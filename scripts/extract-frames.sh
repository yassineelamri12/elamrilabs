#!/usr/bin/env bash
# Turn a hero video (e.g. generated with Higgsfield) into a WebP frame sequence
# for the Apple-style scroll-scrubbed hero.
#
#   ./scripts/extract-frames.sh path/to/hero.mp4 [fps] [width]
#
# Then enable it in index.html:
#   <script>window.HERO_FRAMES = { count: N, path: i => `assets/hero/frame_${String(i + 1).padStart(4, '0')}.webp` };</script>
set -euo pipefail
IN="${1:?usage: extract-frames.sh video.mp4 [fps] [width]}"
FPS="${2:-24}"
WIDTH="${3:-1600}"
OUT="$(dirname "$0")/../assets/hero"
mkdir -p "$OUT"
rm -f "$OUT"/frame_*.webp
ffmpeg -loglevel error -i "$IN" -vf "fps=${FPS},scale=${WIDTH}:-2" -c:v libwebp -quality 72 "$OUT/frame_%04d.webp"
COUNT=$(ls "$OUT"/frame_*.webp | wc -l | tr -d ' ')
echo "Extracted $COUNT frames to assets/hero/ — set HERO_FRAMES.count = $COUNT"
