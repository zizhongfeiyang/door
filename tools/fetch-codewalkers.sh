#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-vendor/CodeWalkers}"
TMP_DIR="$(mktemp -d)"
ZIP_PATH="$TMP_DIR/codewalkers.zip"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

try_zip() {
  local url="$1"
  echo "Trying archive mirror: $url"
  if curl -L --fail --max-time 90 -o "$ZIP_PATH" "$url"; then
    if unzip -t "$ZIP_PATH" >/dev/null; then
      rm -rf "$TARGET_DIR"
      mkdir -p "$(dirname "$TARGET_DIR")"
      unzip -q "$ZIP_PATH" -d "$TMP_DIR/unpacked"
      local root
      root="$(find "$TMP_DIR/unpacked" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
      mv "$root" "$TARGET_DIR"
      echo "Fetched CodeWalkers into $TARGET_DIR"
      return 0
    fi
  fi
  return 1
}

try_git() {
  local url="$1"
  echo "Trying git mirror: $url"
  rm -rf "$TARGET_DIR"
  mkdir -p "$(dirname "$TARGET_DIR")"
  if git clone --depth 1 "$url" "$TARGET_DIR"; then
    echo "Fetched CodeWalkers into $TARGET_DIR"
    return 0
  fi
  rm -rf "$TARGET_DIR"
  return 1
}

ARCHIVE_URLS=(
  "https://codeload.github.com/you-want/CodeWalkers/zip/refs/heads/main"
  "https://github.com/you-want/CodeWalkers/archive/refs/heads/main.zip"
  "https://gh-proxy.com/https://github.com/you-want/CodeWalkers/archive/refs/heads/main.zip"
  "https://gh.llkk.cc/https://github.com/you-want/CodeWalkers/archive/refs/heads/main.zip"
  "https://ghproxy.net/https://github.com/you-want/CodeWalkers/archive/refs/heads/main.zip"
  "https://ghfast.top/https://github.com/you-want/CodeWalkers/archive/refs/heads/main.zip"
  "https://mirror.ghproxy.com/https://github.com/you-want/CodeWalkers/archive/refs/heads/main.zip"
)

GIT_URLS=(
  "https://github.com/you-want/CodeWalkers.git"
  "https://hub.gitmirror.com/https://github.com/you-want/CodeWalkers.git"
  "https://ghproxy.net/https://github.com/you-want/CodeWalkers.git"
)

for url in "${ARCHIVE_URLS[@]}"; do
  if try_zip "$url"; then
    exit 0
  fi
  echo "Archive mirror failed: $url"
done

for url in "${GIT_URLS[@]}"; do
  if try_git "$url"; then
    exit 0
  fi
  echo "Git mirror failed: $url"
done

cat >&2 <<'MSG'
Unable to fetch CodeWalkers from the configured official URL or mirrors.
If this environment blocks GitHub/mirror traffic, download the archive manually and unpack it into vendor/CodeWalkers.
MSG
exit 1
