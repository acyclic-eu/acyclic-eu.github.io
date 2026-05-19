---
layout: page
title: "eijii alpha"
permalink: /eijii/download/alpha/
---

# eijii alpha

**Channel:** alpha - latest build, updated up to once per hour

> **Extra warning.** Raw edge. No version name. No promises. Definitely tried to kill a cat. If it breaks you were warned twice.

<div id="build-meta" style="font-size:0.85em;color:#c04;margin:1em 0"></div>

---

## Install via Homebrew

```bash
brew tap acyclic-eu/eijii
brew install --cask eijii-alpha   # GUI app
brew install acyclic-eu/eijii/eijii-tui  # TUI + daemon (latest beta)
```

---

## Direct download

<div id="download-links" style="margin:1em 0">Loading...</div>

---

[Back to eijii](/eijii/) - [beta](/eijii/download/beta/)

<script>
fetch('/download/alpha/build.json').then(r => r.json()).then(d => {
  document.getElementById('build-meta').innerHTML =
    'Commit: <code>' + d.commit.slice(0,8) + '</code> &nbsp;|&nbsp; Built: <strong>' + d.built + '</strong>';
  document.getElementById('download-links').innerHTML =
    '<table><thead><tr><th>File</th><th>Description</th></tr></thead><tbody>' +
    '<tr><td><a href="' + d.dmg + '">eijii-mac.dmg</a></td><td>macOS app (GUI + daemon)</td></tr>' +
    '<tr><td><a href="' + d.tui + '">eijii-tui-macos-arm64</a></td><td>TUI binary (Apple Silicon)</td></tr>' +
    '<tr><td><a href="' + d.jar + '">eijii-daemon.jar</a></td><td>Daemon jar (Java 21+)</td></tr>' +
    '</tbody></table>';
}).catch(() => {
  document.getElementById('download-links').textContent = 'No alpha build available yet.';
});
</script>
