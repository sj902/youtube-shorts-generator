#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$ROOT/video" "$ROOT/temp-audio" "$ROOT/opfiles"

cd "$ROOT/get-videos"
node index.js

# Wait for downloads to flush to disk before joining
sleep 5

cd "$ROOT/joiner"
./joiner.sh

# Clear scratch videos so the next run starts clean
rm -f "$ROOT/video/"*.mp4
