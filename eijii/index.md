---
layout: page
title: eijii
permalink: /eijii/
---

# eijii

**An AI agent session manager for people who run too many agents.**

eijii watches your running AI coding sessions (pi, claude, and friends), shows you what they are doing, lets you jump between them, and tracks their progress - all in one place.

It runs as a lightweight background daemon and talks to a desktop GUI, a native TUI, or both at once.

---

## Warning

eijii is experimental software under active development.

It will change without notice. It may corrupt your workflow files, spawn processes you did not ask for, forget sessions that mattered, and eat config you carefully tuned. There is no guarantee of backwards compatibility between versions. There is barely a guarantee it will start.

**Use at your own risk. We are not responsible for lost work, confused cats, or existential dread caused by watching too many AI agents at once.**

---

## Screenshots

### Sessions
![eijii TUI - Sessions view](/public/img/eijii/tui-sessions.png)

### Tasks
![eijii TUI - Tasks view](/public/img/eijii/tui-tasks.png)

---

## What it does

- Detects running pi and claude sessions automatically - no config needed
- Shows what each agent is working on (active task, summary, status)
- Supports tmux, screen, Wave, and cmux as host terminals
- Desktop GUI (macOS), native TUI, and a JSON/SSE daemon API
- Tracks session history and todo progress across restarts

---

## Download

| Channel | Description |
|---------|-------------|
| [alpha](/eijii/download/alpha) | Latest build. Rough edges. May eat your config. |
| [beta](/eijii/download/beta) | Latest named version. Still rough. At least someone named it. |
| [0.0.1](/eijii/download/0.0.1) | First named version. All of the above still applies. |

---

## Install

### macOS (GUI + TUI + daemon)

1. Download the `.dmg` from a channel above
2. Open it and drag **eijii.app** to `/Applications`
3. Launch eijii from Spotlight - it will start the daemon automatically on first run
4. **First launch**: macOS will block it - right-click → Open → Open anyway (or run `xattr -cr /Applications/eijii.app`)

### Install or update CLI tools

```bash
brew tap acyclic-eu/apps
brew install acyclic-eu/apps/eijii-tui   # TUI + daemon
```

Or if you already have eijii installed:

```bash
eijii update          # latest beta
eijii update alpha    # latest alpha
```

### TUI only (no brew)

```bash
curl -fsSL https://acyclic.eu/eijii/install.sh | bash
```

---

## Source

Source is not public.
