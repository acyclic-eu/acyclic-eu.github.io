---
layout: page
title: "eijii beta"
permalink: /eijii/download/beta/
---

# eijii beta

**Channel:** beta - latest named version

> This software may try to kill your cat. A version number exists. That is the extent of the guarantee.

<div id="build-meta" style="font-size:0.85em;color:#888;margin:1em 0"></div>

---

## Install via Homebrew

```bash
brew tap acyclic-eu/eijii
brew install --cask eijii          # GUI app
brew install acyclic-eu/eijii/eijii-tui  # TUI + daemon
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
