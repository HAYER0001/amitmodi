#!/usr/bin/env bash
#
# optimize-assets.sh — trim, resize and compress everything in public/images.
#
#   bash tools/optimize-assets.sh
#
# Run this after batch-key.sh. It is idempotent: running it twice is harmless,
# because every asset is resized to a fixed target rather than by a percentage.
#
# Gemini returns one canvas size for everything (2816x1536 in practice), so a
# portrait figure arrives centred in a wide frame. Transparent assets are first
# cropped to their real content, then everything is resized to the size it is
# actually displayed at. Shipping a 2816px image into a 220px slot wastes about
# 95% of the bytes and is the single biggest Core Web Vitals cost on a page.
#
set -uo pipefail

cd "$(dirname "$0")/.." || exit 1
IMG=public/images
TRIM=tools/trim-alpha.swift

[ -d "$IMG" ] || { echo "error: $IMG not found"; exit 1; }

# Count only files directly in public/images — never _raw/, which holds the
# multi-megabyte originals and would make the saving look imaginary.
before=$(find "$IMG" -maxdepth 1 -type f -exec du -k {} + | awk '{s+=$1}END{print s+0}')

# target longest edge, per prefix
target_for() {
  case "$1" in
    fig-walking-row.png) echo 2400 ;;
    fig-*)               echo 1400 ;;
    cut-*)               echo 1000 ;;
    tex-torn-edge.png)   echo 2400 ;;
    tex-*)               echo  800 ;;
    spread-*)            echo 1600 ;;
    cover-*)             echo 1200 ;;
    og-*)                echo 1200 ;;
    favicon-src.png)     echo 1024 ;;
    apple-touch.png)     echo  180 ;;
    *)                   echo 1200 ;;
  esac
}

echo "── trimming transparent assets to their content ──"
for f in "$IMG"/fig-*.png "$IMG"/cut-*.png "$IMG"/tex-*.png; do
  [ -f "$f" ] || continue
  swift "$TRIM" "$f" "$f" --pad 10 --threshold 30 2>/dev/null \
    || echo "  skipped $(basename "$f") (trim failed)"
done

echo
echo "── resizing ──"
for f in "$IMG"/*.png "$IMG"/*.jpg; do
  [ -f "$f" ] || continue
  base=$(basename "$f")
  t=$(target_for "$base")
  sips -Z "$t" "$f" >/dev/null 2>&1
  # JPEGs: recompress at a sane quality. PNGs keep lossless alpha.
  case "$base" in
    *.jpg) sips -s format jpeg -s formatOptions 80 "$f" >/dev/null 2>&1 ;;
  esac
  d=$(sips -g pixelWidth -g pixelHeight "$f" 2>/dev/null | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{print w"x"h}')
  printf "  %-30s %-12s %s\n" "$base" "$d" "$(du -h "$f" | cut -f1 | tr -d ' ')"
done

# Open Graph images must be exactly 1200x630 — social platforms crop or reject
# anything else, and a wrong ratio shows up as a letterboxed card in every share.
echo
echo "── cropping OG images to exactly 1200x630 ──"
for f in "$IMG"/og-*.jpg; do
  [ -f "$f" ] || continue
  sips -c 630 1200 "$f" >/dev/null 2>&1
  d=$(sips -g pixelWidth -g pixelHeight "$f" 2>/dev/null | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{print w"x"h}')
  printf "  %-30s %s\n" "$(basename "$f")" "$d"
done

after=$(find "$IMG" -maxdepth 1 -type f -exec du -k {} + | awk '{s+=$1}END{print s}')
echo
echo "── done ──"
echo "  before: $((before / 1024)) MB"
echo "  after:  $((after / 1024)) MB"
echo
echo "Next: regenerate data/assets.ts so its width/height match these files exactly."
echo "Wrong dimensions there cause layout shift, which is a Core Web Vitals penalty."
