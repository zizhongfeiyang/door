# OpenClaw integration plan

This repo now contains the client-side feature bus for the assistant. The model itself is intentionally not implemented here: the UI and Tauri commands prepare structured context so your hosted OpenClaw service can answer.

> Architecture note: the preferred product base is now CodeWalkers. Use this document as the OpenClaw provider contract when implementing the provider inside a CodeWalkers fork/vendor, not as a mandate to continue expanding the standalone `assistant.html` prototype.

## Implemented client feature surfaces

| Feature | UI entry | JavaScript bridge | Tauri command placeholder | Server responsibility |
| --- | --- | --- | --- | --- |
| Voice chat | `#voiceToggle`, compact `语` | `desktopAssistant.startVoice()` / `stopVoice()` | `start_voice_session`, `stop_voice_session` | ASR, streaming dialogue, TTS response |
| View webpage | `#inspectPage`, dock `网页` | `desktopAssistant.inspectWebpage()` | `inspect_webpage` | Summarize/fetch/read webpage content |
| Screenshot translation | `#screenshotTranslate`, compact `译`, dock `截图` | `desktopAssistant.captureScreenshotForTranslation()` | `capture_screenshot_for_translation` | OCR, translation, visual explanation |
| Selected text chat | `#selectedTextChat`, dock `选区` | `desktopAssistant.getSelectedText()` | `get_selected_text` | Explain/rewrite/translate selected text |
| Desktop context chat | `#desktopContext` | `desktopAssistant.getDesktopContext()` | `get_desktop_context` | Interpret visible desktop/application context |

## OpenClaw request contract draft

`js/assistant.js` builds a request shaped like this before calling `desktopAssistant.sendToOpenClaw(request)`:

```json
{
  "provider": "openclaw",
  "intent": "desktop_assistant_chat",
  "message": "user message",
  "contexts": [
    {
      "type": "selection",
      "label": "选中文字",
      "data": "selected text or native summary",
      "createdAt": "ISO timestamp"
    }
  ],
  "features": ["voice", "webpage", "screenshot_translate", "selected_text", "desktop_context"],
  "createdAt": "ISO timestamp"
}
```

When your service is ready, replace the placeholder `send_to_openclaw` command with an HTTP/WebSocket client or a local sidecar call.

## Native work still required

1. **Voice:** request microphone permission, add VAD, stream audio chunks, receive partial transcripts and TTS audio.
2. **Webpage:** decide whether webpage context comes from URL fetch, embedded webview, or browser-extension bridge.
3. **Screenshot translation:** add region selection, screenshot capture, OCR, and image payload upload.
4. **Selected text:** use clipboard fallback first, then platform accessibility APIs for cross-app selection.
5. **Desktop context:** enumerate active windows and optionally combine screenshot OCR with app/window metadata.

## Default character assets to generate with image2

Keep the current `assets/peep.png` as a temporary default. Generate the following original assets later:

- `mascot_idle.png` — transparent PNG, front-facing idle pose.
- `mascot_listening.png` — transparent PNG, headset/ear glow pose for voice mode.
- `mascot_speaking.png` — transparent PNG, mouth-open speaking pose.
- `mascot_thinking.png` — transparent PNG, subtle snowflake/thinking pose.
- `mascot_error.png` — transparent PNG, worried/error pose.
- `compact_peek.png` — transparent PNG, half-body peeking over the compact bar.
- `snow_corner.svg` — scalable ice corner decoration.
- `frost_frame.svg` — scalable glass/ice border overlay.
- `status_online.svg` and `status_error.svg` — tiny status indicators.
- `icon_voice.svg`, `icon_webpage.svg`, `icon_screenshot_translate.svg`, `icon_selection.svg`, `icon_desktop_context.svg`, `icon_send.svg`, `icon_close.svg` — readable 16-24px function icons.
