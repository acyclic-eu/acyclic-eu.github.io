---
layout: null
permalink: /eijii/install.sh
---
#!/usr/bin/env bash
set -e

CHANNEL="${EIJII_CHANNEL:-beta}"
BASE="https://acyclic.eu/download/$CHANNEL"
BIN_DIR="${EIJII_BIN_DIR:-/usr/local/bin}"

echo "eijii installer - channel: $CHANNEL"
echo "This software may try to kill your cat. Proceeding anyway."
echo ""

ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ]; then
  TUI_BIN="eijii-tui-macos-arm64"
else
  echo "Unsupported architecture: $ARCH"
  exit 1
fi

# Install TUI
echo "Downloading TUI..."
curl -fsSL "$BASE/$TUI_BIN" -o /tmp/eijii-tui
chmod +x /tmp/eijii-tui
sudo mv /tmp/eijii-tui "$BIN_DIR/eijii-tui"
echo "Installed eijii-tui -> $BIN_DIR/eijii-tui"

# Install daemon jar
echo "Downloading daemon..."
mkdir -p "$HOME/.eijii"
curl -fsSL "$BASE/eijii-daemon.jar" -o "$HOME/.eijii/eijii-daemon.jar"
echo "Installed daemon -> $HOME/.eijii/eijii-daemon.jar"

echo ""
echo "Done. Run 'eijii-tui' to start."
