#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  cat >&2 <<'MSG'
Usage: tools/bootstrap-own-github.sh <github-origin-url> [target-dir]

Example:
  tools/bootstrap-own-github.sh git@github.com:your-org/openclaw-desktop-assistant.git vendor/CodeWalkers

This script assumes the CodeWalkers source already exists in target-dir. Use tools/fetch-codewalkers.sh first, or download/unpack CodeWalkers manually if the network is blocked.
MSG
  exit 1
fi

ORIGIN_URL="$1"
TARGET_DIR="${2:-vendor/CodeWalkers}"
UPSTREAM_URL="https://github.com/you-want/CodeWalkers.git"
PATCH_DIR="codewalkers-patches/openclaw"
ROOT_DIR="$(pwd)"

if [[ ! -d "$TARGET_DIR/.git" ]]; then
  cat >&2 <<MSG
Expected a git checkout at $TARGET_DIR.
Run tools/fetch-codewalkers.sh $TARGET_DIR first, or manually clone/download CodeWalkers there.
MSG
  exit 1
fi

if [[ ! -d "$PATCH_DIR" ]]; then
  cat >&2 <<MSG
Missing $PATCH_DIR. Run this script from the repository root that contains the OpenClaw patch seeds.
MSG
  exit 1
fi

cd "$TARGET_DIR"

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$ORIGIN_URL"
else
  git remote add origin "$ORIGIN_URL"
fi

if git remote get-url upstream >/dev/null 2>&1; then
  git remote set-url upstream "$UPSTREAM_URL"
else
  git remote add upstream "$UPSTREAM_URL"
fi

mkdir -p src/lib/openclaw src-tauri/src
cp -R "$ROOT_DIR/$PATCH_DIR/src/lib/openclaw/." src/lib/openclaw/
cp "$ROOT_DIR/$PATCH_DIR/src-tauri/src/openclaw.rs" src-tauri/src/openclaw.rs
cp "$ROOT_DIR/$PATCH_DIR/PATCH_NOTES.md" OPENCLAW_PATCH_NOTES.md

cat <<MSG
Prepared $TARGET_DIR for your own GitHub repo.

Next manual steps inside $TARGET_DIR:
  1. Edit src-tauri/src/lib.rs to register mod openclaw and the OpenClaw commands.
  2. Add any missing Cargo dependencies from OPENCLAW_PATCH_NOTES.md.
  3. Wire src/lib/openclaw/provider.ts into the CodeWalkers session/provider UI.
  4. Commit and push:
       git add .
       git commit -m "Add OpenClaw provider scaffold"
       git push -u origin main
MSG
