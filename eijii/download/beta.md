---
layout: page
title: "eijii beta"
permalink: /eijii/download/beta/
---

# eijii beta

**Channel:** beta - latest named version

> beta is experimental software under active development.
>
> It will change without notice. It may corrupt your workflow files, spawn processes you did not ask for, forget sessions that mattered, and eat config you carefully tuned. There is no guarantee of backwards compatibility between versions.
>
> It will also try to kill your cat. The version number does not change this. It just means someone was willing to put their name on it.
>
> **Use at your own risk. We are not responsible for lost work, confused cats, or existential dread caused by watching too many AI agents at once.**

<div id="build-meta" style="font-size:0.85em;color:#888;margin:1em 0"></div>

---

## Install via Homebrew

```bash
brew tap acyclic-eu/apps
brew install --cask eijii          # GUI app
brew install acyclic-eu/apps/eijii-tui  # TUI + daemon
```

---

## Direct download

<div id="download-links" style="margin:1em 0">Loading...</div>

---

[Back to eijii](/eijii/) - [alpha](/eijii/download/alpha/)

<script>
fetch('/download/beta/build.json').then(r => r.json()).then(d => {
  document.getElementById('build-meta').innerHTML =
    'Version: <strong>' + d.version + '</strong> &nbsp;|&nbsp; Built: <strong>' + d.built + '</strong> &nbsp;|&nbsp; Commit: <code>' + d.commit.slice(0,8) + '</code>';
  document.getElementById('download-links').innerHTML =
    '<table><thead><tr><th>File</th><th>Description</th></tr></thead><tbody>' +
    '<tr><td><a href="' + d.dmg + '">eijii-' + d.version + '-mac.dmg</a></td><td>macOS app (GUI + daemon)</td></tr>' +
    '<tr><td><a href="' + d.tui + '">eijii-tui-' + d.version + '-macos-arm64</a></td><td>TUI binary (Apple Silicon)</td></tr>' +
    '<tr><td><a href="' + d.jar + '">eijii-daemon-' + d.version + '.jar</a></td><td>Daemon jar (Java 21+)</td></tr>' +
    '</tbody></table>';
}).catch(() => {
  document.getElementById('download-links').textContent = 'No beta build available yet.';
});
</script>
