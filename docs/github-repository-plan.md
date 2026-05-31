# Own GitHub repository plan

Use your own GitHub repository as the product home, with CodeWalkers as an upstream base. Do not keep relying on a transient local copy or a third-party mirror.

## Recommended repository layout

Create a new repository under your GitHub account or organization, for example:

- `openclaw-desktop-assistant`
- `openclaw-codewalkers`
- `frost-assistant-desktop`

The new repository should contain the CodeWalkers source tree as the application root, then apply the OpenClaw patches from this repo.

```text
openclaw-desktop-assistant/
├── src/                         # CodeWalkers React frontend
├── src-tauri/                   # CodeWalkers Tauri/Rust desktop host
├── public/ or assets/           # character/theme assets
├── docs/                        # OpenClaw integration notes
├── LICENSE                      # preserve upstream MIT license
└── OPENCLAW_NOTES.md            # your product-specific notes
```

## Git remote strategy

Keep two remotes:

- `origin` — your own GitHub repo, where product work happens.
- `upstream` — the original CodeWalkers repo, used only for pulling improvements.

```bash
git remote add origin git@github.com:<your-org>/openclaw-desktop-assistant.git
git remote add upstream https://github.com/you-want/CodeWalkers.git
```

If SSH is not configured, use HTTPS for `origin` too.

## First import flow

1. Fetch or manually download CodeWalkers.
2. Copy/apply `codewalkers-patches/openclaw/` into the CodeWalkers source tree.
3. Commit the clean CodeWalkers import first.
4. Commit OpenClaw changes second, so later diffs are readable.
5. Push to your own GitHub repository.

Suggested commit sequence:

```bash
git commit -m "Import CodeWalkers base"
git commit -m "Add OpenClaw provider scaffold"
git push -u origin main
```

## Long-term branch model

Use these branches:

- `main` — stable product branch.
- `integrate/codewalkers-upstream` — periodic upstream CodeWalkers sync branch.
- `feature/openclaw-provider` — OpenClaw service adapter work.
- `feature/frost-mascot-assets` — image2-generated character and UI asset integration.
- `feature/native-context-collectors` — voice, webpage, screenshot, selection, desktop-context collectors.

## Keeping CodeWalkers updated

When you want upstream CodeWalkers improvements:

```bash
git fetch upstream
git checkout -b integrate/codewalkers-upstream
git merge upstream/main
# resolve conflicts, run tests, then open PR into main
```

Do not modify upstream logic directly without clear commits. Keep OpenClaw-specific changes in identifiable modules such as:

- `src/lib/openclaw/`
- `src-tauri/src/openclaw.rs`
- `src/components/openclaw/`
- `docs/openclaw/`

## GitHub secrets to add later

When your hosted OpenClaw service is ready, configure these in GitHub Actions or local `.env` files, not in source code:

- `OPENCLAW_API_BASE_URL`
- `OPENCLAW_API_KEY`
- `OPENCLAW_VOICE_WS_URL`
- `OPENCLAW_MODEL_ID`

Never commit real API keys.

## Release strategy

Use GitHub Releases for packaged builds after the Tauri build pipeline is stable:

1. Tag a version: `v0.1.0`.
2. Build macOS/Windows/Linux installers through GitHub Actions.
3. Attach release notes with model endpoint compatibility and asset version.

## License note

CodeWalkers is MIT-licensed. Preserve its license and attribution in your own GitHub repository. Your generated frost mascot assets can use your own chosen license, but do not copy unlicensed character art from screenshots or demos.
