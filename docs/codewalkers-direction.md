# CodeWalkers-inspired desktop direction

The previous local prototype proved only the visual direction. Product development should now pivot to using CodeWalkers as the desktop companion base, because it already provides the optimized Tauri + React + Rust companion architecture we need.

## New base decision

- **Use CodeWalkers as the upstream base:** fork/vendor the MIT-licensed project and build OpenClaw integration on top of its existing desktop companion shell.
- **Do not keep expanding this static prototype:** keep it as a visual/reference sketch only.
- **Preserve attribution and license:** retain the upstream MIT license notice when code is copied or vendored.
- **Generate original assets:** replace upstream/default characters with image2-generated frost assistant assets rather than copying unlicensed art.

## Current implementation in this repo

- `assistant.html` remains a standalone UI reference so it can still be previewed in a browser.
- `js/desktop-bridge.js` and `src-tauri/` are placeholders for OpenClaw capability wiring, not the final app shell.
- `docs/codewalkers-base.md` is the migration target and should guide the next implementation branch.

## Next milestones

1. Fork/vendor CodeWalkers as the product base.
2. Add an `OpenClawProvider` adapter to the CodeWalkers AI/session layer.
3. Replace or add character assets with generated frost assistant states.
4. Port the OpenClaw request contract from `docs/openclaw-integration-plan.md`.
5. Implement native collectors for voice, webpage, screenshot translation, selected text, and desktop context.
