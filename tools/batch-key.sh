#!/usr/bin/env bash
#
# batch-key.sh — remove flat backgrounds from a folder of generated images.
#
#   bash tools/batch-key.sh public/images/_raw public/images
#
# Mode is chosen from the filename prefix:
#   fig-*  tex-*   → luminance  (black line art generated on pure white)
#   cut-*           → chroma     (objects generated on flat magenta #FF00FF)
#   anything else   → copied through untouched (spreads, covers, og, icons stay opaque)
#
set -euo pipefail

IN_DIR="${1:-public/images/_raw}"
OUT_DIR="${2:-public/images}"
TOOL="$(dirname "$0")/alpha-key.swift"

[ -d "$IN_DIR" ] || { echo "error: input folder not found: $IN_DIR"; exit 1; }
mkdir -p "$OUT_DIR"

shopt -s nullglob
files=("$IN_DIR"/*.png "$IN_DIR"/*.PNG "$IN_DIR"/*.jpg "$IN_DIR"/*.jpeg)

if [ ${#files[@]} -eq 0 ]; then
  echo "Nothing to do — no images in $IN_DIR"
  echo "Generate with the prompts in MASTER-BUILD-PLAN.md Phase 4 STEP 1 and save them there."
  exit 0
fi

keyed=0; copied=0

for f in "${files[@]}"; do
  base="$(basename "$f")"
  stem="${base%.*}"
  out="$OUT_DIR/$stem.png"

  case "$base" in
    fig-*|tex-*)
      swift "$TOOL" "$f" "$out" --mode luminance
      keyed=$((keyed+1))
      ;;
    cut-*)
      swift "$TOOL" "$f" "$out" --mode chroma --key FF00FF
      keyed=$((keyed+1))
      ;;
    *)
      cp "$f" "$OUT_DIR/$base"
      echo "$base  →  copied unchanged (opaque by design)"
      copied=$((copied+1))
      ;;
  esac
done

echo
echo "Done — $keyed keyed, $copied copied unchanged."
echo
echo "Verify the alpha actually landed (anything saying 'no' did not key):"
echo "  for f in $OUT_DIR/{fig,cut,tex}-*.png; do printf '%-32s ' \"\$(basename \$f)\"; sips -g hasAlpha \"\$f\" | tail -1; done"
