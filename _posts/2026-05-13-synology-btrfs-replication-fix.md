---
layout: post
title: "Fixing Synology btrfs Replication with a Linux Kernel ioctl"
date: 2026-05-13
tags: [Developer]
---

I run a Synology NAS (skattkistan) and a NixOS home server (skattkammaren). The plan was simple: use `btrfs send | btrfs receive` to replicate 128 daily snapshots from the Synology to NixOS over SSH. A well-understood, efficient, built-in feature of btrfs.

It did not go as planned. Here is what broke, why, and the fix I ended up with.

---

## The Setup

Synology stores its scheduled snapshots under `/volume2/@sharesnap/ps/` with names like `GMT+01-2026.01.05-00.00.01`. These are read-only btrfs subvolumes - perfect for `btrfs send`.

The destination on NixOS would receive them under `/data/skattkistan/ps/.snapshots/`, keeping 128 daily snapshots and a `latest/` read-only view for easy browsing.

The standard pipeline:

```bash
# First snapshot - full send
sudo btrfs send /volume2/@sharesnap/ps/GMT+01-2026.01.05 | \
  ssh eijii@192.168.88.20 "sudo btrfs receive /data/skattkistan/ps/.snapshots/"

# Subsequent snapshots - incremental
sudo btrfs send -p /volume2/@sharesnap/ps/GMT+01-2026.01.05 \
                   /volume2/@sharesnap/ps/GMT+01-2026.01.06 | \
  ssh eijii@192.168.88.20 "sudo btrfs receive /data/skattkistan/ps/.snapshots/"
```

---

## The Problem

The full send of the first snapshot consistently failed:

```
At subvol GMT+01-2026.01.05-00.00.01
ERROR: attribute 15 requested but not present
```

The snapshot directory *was* created on the destination. But when I checked it:

```
UUID:           63194476-baf0-7b40-b8cb-e3cd68856f7a
Received UUID:  -
```

`Received UUID` was empty. And without a `Received UUID`, incremental sends fail immediately - btrfs receive uses it to find the parent subvolume when applying a diff:

```
ERROR: snapshot receive: cannot find parent subvolume 6637c616-b21d-b440-af09-0fc62ef62e93
```

---

## Diagnosing the Root Cause

Synology runs btrfs-progs **v4.0** - a heavily patched, decade-old fork. NixOS runs **v6.17.1**.

Inspecting the raw send stream revealed the culprit:

```bash
sudo btrfs send /volume2/@sharesnap/ps/GMT+01-2026.01.05 2>&1 | head -5
```

```
...syno.create_time...syno.archive_version...syno.archive_bit...system.syno_acl_self...
```

Synology's snapshots are decorated with proprietary extended attributes that their btrfs fork adds internally. When btrfs send encodes these into the stream, it apparently emits a command that references attribute type 15 (PATH) without including it - a malformed stream. NixOS's btrfs receive processes what it can, creates the snapshot directory, then hits the malformed command and exits with an error before finalising the snapshot metadata (including `Received UUID`).

The error is non-fatal enough that the snapshot lands on disk, but fatal enough that the UUID bookkeeping never completes.

---

## The Fix: BTRFS_IOC_SET_RECEIVED_SUBVOL

btrfs tracks the replication chain through `Received UUID`. On the destination, after a successful `btrfs receive`, the subvolume's `Received UUID` is set to the UUID of the source subvolume. Incremental receives then find the parent by looking for a local subvolume with a matching `Received UUID`.

We have the snapshot. We know the source UUID. We just need to set it.

Linux exposes this via a kernel ioctl: `BTRFS_IOC_SET_RECEIVED_SUBVOL` (number 37, magic 0x94). It takes a struct with the source UUID and sets it on an open subvolume directory. Requires `CAP_SYS_ADMIN`.

```python
import fcntl, os, struct, uuid

IOCTL = 0xc0c09425  # IOWR(0x94, 37, 192)

src = uuid.UUID("6637c616-b21d-b440-af09-0fc62ef62e93")  # UUID from source
buf = struct.pack("=16sQQ QI QI Q16Q",
    src.bytes,
    0, 0,    # stransid (in), rtransid (out)
    0, 0,    # stime sec, nsec
    0, 0,    # rtime sec, nsec
    0,       # flags
    *([0]*16)  # reserved
)

fd = os.open("/data/skattkistan/ps/.snapshots/GMT+01-2026.01.05-00.00.01", os.O_RDONLY)
fcntl.ioctl(fd, IOCTL, bytearray(buf))
os.close(fd)
```

After this, make the subvolume read-only (btrfs receive left it writable due to the error):

```bash
sudo btrfs property set /data/skattkistan/ps/.snapshots/GMT+01-2026.01.05-00.00.01 ro true
```

Then the incremental chain works. Snapshot 2 sends cleanly using snapshot 1 as parent, and its `Received UUID` is set correctly by btrfs receive (incremental streams don't trigger the same error - only the initial full send does).

---

## The Replication Script

The final loop for all 128 snapshots:

1. Full send of snapshot 1 (will error but land on disk)
2. Fix `Received UUID` via ioctl, set `ro=true`
3. For each subsequent snapshot: incremental send using previous as parent
4. If snapshot lands without `Received UUID` set (incremental sends don't have this problem, but just in case): apply the same ioctl fix
5. Notify via ntfy every 10 snapshots

The ioctl approach means each send - even if the Synology stream is slightly malformed - results in a properly finalised snapshot that the next incremental can use as a parent. The chain stays intact for all 128 snapshots regardless of what proprietary attributes Synology embeds.

---

## Takeaway

`btrfs send | btrfs receive` is elegant in theory. In practice, if one side is a decade-old vendor fork with proprietary extensions, the stream can be just broken enough to silently corrupt the metadata that the whole incremental chain depends on.

The `Received UUID` is the linchpin. Lose it on one snapshot and the entire chain of incremental diffs becomes useless. The kernel ioctl is the only standard way to restore it - no btrfs-progs tool exposes it, not even `btrfs property set`.

If you are replicating from Synology to a standard Linux btrfs system and seeing `ERROR: snapshot receive: cannot find parent subvolume`, check your `Received UUID` first.
