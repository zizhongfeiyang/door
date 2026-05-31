export type OpenClawContextType =
  | "voice"
  | "webpage"
  | "screenshot-translate"
  | "selection"
  | "desktop-context";

export type OpenClawDesktopContext = {
  type: OpenClawContextType;
  label: string;
  data: unknown;
  createdAt: string;
};

export type OpenClawDesktopRequest = {
  provider: "openclaw";
  intent: "desktop_assistant_chat";
  message: string;
  contexts: OpenClawDesktopContext[];
  features: string[];
  createdAt: string;
};

export function createOpenClawRequest(
  message: string,
  contexts: OpenClawDesktopContext[] = [],
): OpenClawDesktopRequest {
  return {
    provider: "openclaw",
    intent: "desktop_assistant_chat",
    message,
    contexts: contexts.slice(-8),
    features: [
      "voice",
      "webpage",
      "screenshot_translate",
      "selected_text",
      "desktop_context",
    ],
    createdAt: new Date().toISOString(),
  };
}
