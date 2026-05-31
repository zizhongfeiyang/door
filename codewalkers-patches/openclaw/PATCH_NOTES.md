# OpenClaw patch notes for CodeWalkers

These files are source-level starting points to apply after CodeWalkers is available locally.

## Files to add

- `src/lib/openclaw/request.ts`
- `src/lib/openclaw/provider.ts`
- `src-tauri/src/openclaw.rs`

## Rust integration points

In CodeWalkers `src-tauri/src/lib.rs`:

1. Add `mod openclaw;` next to the existing `mod providers;` and `mod session;` declarations.
2. Add these commands to the `tauri::generate_handler!` list:
   - `openclaw::openclaw_send`
   - `openclaw::openclaw_collect_context`
3. Add these dependencies to `src-tauri/Cargo.toml` if they are not already present:
   - `serde = { version = "1", features = ["derive"] }`
   - `serde_json = "1"`
   - `chrono = { version = "0.4", features = ["serde"] }`

## Frontend integration points

CodeWalkers already has a session/terminal panel. Wire `sendOpenClawMessage()` into the provider dropdown as a new `OpenClaw` provider, then route the panel submit event through that function when selected.

For context buttons, call `collectOpenClawContext(type)` and keep the returned contexts in React state next to the session panel before sending the final message.

## Server handoff

`openclaw_send` currently returns a placeholder response. Replace it with an HTTP/WebSocket call to your hosted OpenClaw service once the endpoint is ready.
