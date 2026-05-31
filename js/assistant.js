(function () {
	"use strict";

	var shell = document.getElementById("assistantShell");
	var togglePanel = document.getElementById("togglePanel");
	var collapsePanel = document.getElementById("collapsePanel");
	var quickSend = document.getElementById("quickSend");
	var compactInput = document.getElementById("compactInput");
	var composer = document.getElementById("composer");
	var messageInput = document.getElementById("messageInput");
	var messageList = document.getElementById("messageList");
	var clearMessages = document.getElementById("clearMessages");
	var minimizeWindow = document.getElementById("minimizeWindow");
	var closeWindow = document.getElementById("closeWindow");
	var contextStrip = document.getElementById("contextStrip");
	var voiceToggle = document.getElementById("voiceToggle");
	var collectedContexts = [];
	var isListening = false;

	var capabilityCopy = {
		voice: "语音聊天已进入待接入状态：前端会整理语音会话事件，后续交给 OpenClaw 语音服务。",
		webpage: "网页查看已触发：桌面层会负责读取当前网页标题、URL 与正文摘要。",
		"screenshot-translate": "截图翻译已触发：桌面层会负责截图/OCR，模型服务负责翻译与解释。",
		selection: "选中文字沟通已触发：已把当前选区作为上下文加入下一次 OpenClaw 请求。",
		"desktop-context": "桌面内容沟通已触发：桌面层会收集窗口、屏幕与活动应用摘要。"
	};

	function desktop() {
		return window.desktopAssistant || {};
	}

	function setExpanded(expanded) {
		shell.setAttribute("data-expanded", expanded ? "true" : "false");
		togglePanel.setAttribute("aria-expanded", expanded ? "true" : "false");
	}

	function nowTime() {
		var date = new Date();
		return String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0");
	}

	function addMessage(text, role) {
		var article = document.createElement("article");
		article.className = "message " + (role === "user" ? "user-message" : "assistant-message");

		if (role !== "user") {
			var avatar = document.createElement("img");
			avatar.src = "assets/peep.png";
			avatar.alt = "";
			article.appendChild(avatar);
		}

		var bubble = document.createElement("div");
		bubble.className = "bubble";

		if (role !== "user") {
			var speaker = document.createElement("span");
			speaker.className = "speaker";
			speaker.textContent = "OpenClaw";
			bubble.appendChild(speaker);
		}

		var paragraph = document.createElement("p");
		paragraph.textContent = text;
		bubble.appendChild(paragraph);

		var time = document.createElement("time");
		time.textContent = nowTime();
		bubble.appendChild(time);

		article.appendChild(bubble);
		messageList.appendChild(article);
		messageList.scrollTop = messageList.scrollHeight;
	}

	function addContext(type, label, data) {
		collectedContexts.push({ type: type, label: label, data: data || null, createdAt: new Date().toISOString() });
		renderContexts();
	}

	function renderContexts() {
		contextStrip.innerHTML = "";
		if (!collectedContexts.length) {
			var empty = document.createElement("span");
			empty.className = "context-chip active";
			empty.textContent = "OpenClaw 等待接入";
			contextStrip.appendChild(empty);
			return;
		}

		collectedContexts.slice(-5).forEach(function (item) {
			var chip = document.createElement("span");
			chip.className = "context-chip";
			chip.textContent = item.label;
			contextStrip.appendChild(chip);
		});
	}

	function normalizeNativeResult(result, fallbackLabel) {
		if (typeof result === "string") {
			return result || fallbackLabel;
		}
		if (result && result.summary) {
			return result.summary;
		}
		if (result && result.available === false) {
			return fallbackLabel + "（浏览器预览模式，等待 Tauri 能力接入）";
		}
		return fallbackLabel;
	}

	function callNative(method, fallbackLabel) {
		if (!desktop()[method]) {
			return Promise.resolve(fallbackLabel + "（桌面桥未加载）");
		}

		return desktop()[method]().then(function (result) {
			return normalizeNativeResult(result, fallbackLabel);
		}).catch(function (error) {
			return fallbackLabel + "（" + error.message + "）";
		});
	}

	function triggerCapability(type) {
		setExpanded(true);
		var nativeCalls = {
			voice: "startVoice",
			webpage: "inspectWebpage",
			"screenshot-translate": "captureScreenshotForTranslation",
			selection: "getSelectedText",
			"desktop-context": "getDesktopContext"
		};
		var labels = {
			voice: "语音上下文",
			webpage: "网页上下文",
			"screenshot-translate": "截图翻译上下文",
			selection: "选中文字",
			"desktop-context": "桌面上下文"
		};

		if (type === "voice") {
			isListening = !isListening;
			voiceToggle.classList.toggle("is-listening", isListening);
			if (!isListening && desktop().stopVoice) {
				desktop().stopVoice();
			}
		}

		callNative(nativeCalls[type], capabilityCopy[type]).then(function (summary) {
			addContext(type, labels[type], summary);
			addMessage(summary, "assistant");
		});
	}

	function buildOpenClawRequest(text) {
		return {
			provider: "openclaw",
			intent: "desktop_assistant_chat",
			message: text,
			contexts: collectedContexts.slice(-8),
			features: ["voice", "webpage", "screenshot_translate", "selected_text", "desktop_context"],
			createdAt: new Date().toISOString()
		};
	}

	function sendText(text) {
		var trimmed = text.trim();
		if (!trimmed) {
			return;
		}

		setExpanded(true);
		addMessage(trimmed, "user");
		var request = buildOpenClawRequest(trimmed);
		if (desktop().sendToOpenClaw) {
			desktop().sendToOpenClaw(request);
		}
		window.setTimeout(function () {
			addMessage("已打包 OpenClaw 请求：" + request.features.join(" / ") + "。你接上服务端后，把这里的占位回复替换成真实模型响应即可。", "assistant");
		}, 280);
	}

	document.querySelectorAll("[data-capability]").forEach(function (button) {
		button.addEventListener("click", function () {
			triggerCapability(button.getAttribute("data-capability"));
		});
	});

	togglePanel.addEventListener("click", function () {
		setExpanded(shell.getAttribute("data-expanded") !== "true");
	});

	collapsePanel.addEventListener("click", function () {
		setExpanded(false);
	});

	quickSend.addEventListener("click", function () {
		sendText(compactInput.value);
		compactInput.value = "";
	});

	compactInput.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			sendText(compactInput.value);
			compactInput.value = "";
		}
	});

	composer.addEventListener("submit", function (event) {
		event.preventDefault();
		sendText(messageInput.value);
		messageInput.value = "";
	});

	clearMessages.addEventListener("click", function () {
		messageList.innerHTML = "";
		collectedContexts = [];
		renderContexts();
		addMessage("聊天记录和上下文已经清空。", "assistant");
	});

	minimizeWindow.addEventListener("click", function () {
		if (desktop().minimize) {
			desktop().minimize();
		}
	});

	closeWindow.addEventListener("click", function () {
		if (desktop().close) {
			desktop().close();
		} else {
			setExpanded(false);
		}
	});
}());
