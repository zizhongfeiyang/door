(function () {
	"use strict";

	function hasTauri() {
		return Boolean(window.__TAURI__ && window.__TAURI__.core && window.__TAURI__.core.invoke);
	}

	function invokeTauri(command, payload) {
		if (!hasTauri()) {
			return Promise.resolve({ available: false, command: command, payload: payload || {} });
		}

		return window.__TAURI__.core.invoke(command, payload || {});
	}

	function fallbackSelection() {
		var selection = window.getSelection ? String(window.getSelection()) : "";
		return Promise.resolve(selection.trim());
	}

	window.desktopAssistant = window.desktopAssistant || {
		minimize: function () {
			return invokeTauri("minimize_window");
		},
		close: function () {
			return invokeTauri("close_window");
		},
		startVoice: function () {
			return invokeTauri("start_voice_session");
		},
		stopVoice: function () {
			return invokeTauri("stop_voice_session");
		},
		inspectWebpage: function () {
			return invokeTauri("inspect_webpage");
		},
		captureScreenshotForTranslation: function () {
			return invokeTauri("capture_screenshot_for_translation");
		},
		getSelectedText: function () {
			return invokeTauri("get_selected_text").then(function (result) {
				if (result && result.available === false) {
					return fallbackSelection();
				}
				return result;
			});
		},
		getDesktopContext: function () {
			return invokeTauri("get_desktop_context");
		},
		sendToOpenClaw: function (request) {
			return invokeTauri("send_to_openclaw", { request: request });
		}
	};
}());
