# CodeWalkers as the product base

Decision: use CodeWalkers as the desktop companion base instead of growing the current `assistant.html` prototype into a full product.

## Why this is the better base

CodeWalkers already solves the hard desktop-companion layer that this repository would otherwise need to recreate:

- Tauri v2 + React + Rust application structure.
- Character roaming and resting behavior near the bottom of the screen.
- Canvas alpha click-through so transparent pixels pass clicks to the desktop.
- Built-in AI terminal surface with streaming/thinking feedback patterns.
- Multi-character/theme system, tray controls, sound feedback, and packaging flow.
- MIT license, which allows modification and redistribution when the license notice is preserved.

The current local prototype should be treated as a visual/OpenClaw integration sketch only. It should not be the long-term architecture.

## Adoption strategy

Do **not** copy CodeWalkers assets blindly into this repo. Use it as the upstream application foundation, then layer OpenClaw features on top.

Recommended repository path:

See `docs/github-repository-plan.md` for the own-GitHub repository/remotes workflow.

1. Fork or vendor CodeWalkers as the new app root. Use `tools/fetch-codewalkers.sh vendor/CodeWalkers` to try the official archive plus common mirrors, then `tools/bootstrap-own-github.sh <your-origin-url> vendor/CodeWalkers` to point it at your own GitHub repository.
2. Preserve its MIT license and attribution.
3. Apply the starter source files in `codewalkers-patches/openclaw/`.
4. Replace its AI-provider integration with an OpenClaw provider adapter.
5. Replace or add characters with generated original frost assistant assets.
6. Port only the useful pieces from this prototype:
   - frost visual language;
   - compact/expanded assistant copy;
   - OpenClaw request contract;
   - requested capability list: voice, webpage, screenshot translation, selected text, desktop context.

## Mapping our requested features to CodeWalkers

| Requirement | CodeWalkers base area | OpenClaw work to add |
| --- | --- | --- |
| Small desktop character | Character renderer / walking loop | Replace with generated frost mascot states |
| Click-through desktop companion | Canvas alpha click-through layer | Keep base behavior, tune hit regions |
| Chat/terminal | Built-in AI terminal/session panel | Add OpenClaw chat provider |
| Voice chat | New panel/control + native audio command | Add microphone/VAD/ASR/TTS bridge |
| View webpage | New context collector | Add URL/readability/browser-extension bridge |
| Screenshot translation | Native screenshot command | Add region select, OCR, translation request |
| Selected text chat | Native clipboard/accessibility command | Add selected text collector and context chip |
| Desktop-content chat | Window/screen metadata collector | Add active-window summary + OCR payload |

## What to keep from this repo

- `docs/openclaw-integration-plan.md` remains the OpenClaw contract draft.
- `assistant.html`, `css/assistant.css`, and `js/assistant.js` can remain as a static design reference until the CodeWalkers fork has equivalent UI.
- Existing game files should remain untouched unless this repository is intentionally converted into the assistant app.

## Source-level patch plan

This repo now includes starter source files under `codewalkers-patches/openclaw/`:

- `src/lib/openclaw/request.ts` builds the OpenClaw desktop request.
- `src/lib/openclaw/provider.ts` calls Tauri commands from React.
- `src-tauri/src/openclaw.rs` defines Rust command placeholders for OpenClaw send/context collection.
- `PATCH_NOTES.md` lists the exact integration points in CodeWalkers.

## First implementation milestone

Create an `OpenClawProvider` inside the CodeWalkers fork that accepts this shape:

```ts
type OpenClawDesktopRequest = {
  provider: 'openclaw';
  intent: 'desktop_assistant_chat';
  message: string;
  contexts: Array<{
    type: 'voice' | 'webpage' | 'screenshot-translate' | 'selection' | 'desktop-context';
    label: string;
    data: unknown;
    createdAt: string;
  }>;
  features: string[];
  createdAt: string;
};
```

The first milestone is complete when CodeWalkers can show the default character, open its session panel, send a typed message to a mocked OpenClaw endpoint, and render the response.
