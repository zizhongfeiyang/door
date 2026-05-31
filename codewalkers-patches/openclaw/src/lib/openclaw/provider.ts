import { invoke } from "@tauri-apps/api/core";
import type { OpenClawDesktopContext, OpenClawDesktopRequest } from "./request";
import { createOpenClawRequest } from "./request";

export type OpenClawResponse = {
  text: string;
  raw?: unknown;
};

export async function sendOpenClawMessage(
  message: string,
  contexts: OpenClawDesktopContext[] = [],
): Promise<OpenClawResponse> {
  const request: OpenClawDesktopRequest = createOpenClawRequest(message, contexts);
  return invoke<OpenClawResponse>("openclaw_send", { request });
}

export async function collectOpenClawContext(
  type: OpenClawDesktopContext["type"],
): Promise<OpenClawDesktopContext> {
  return invoke<OpenClawDesktopContext>("openclaw_collect_context", { contextType: type });
}
