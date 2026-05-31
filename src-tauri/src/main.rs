use tauri::{AppHandle, Manager};

#[tauri::command]
fn minimize_window(app: AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.minimize();
    }
}

#[tauri::command]
fn close_window(app: AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.close();
    }
}

#[tauri::command]
fn start_voice_session() -> String {
    "语音会话占位已启动：下一步在这里接入麦克风权限、VAD、ASR 和 OpenClaw voice endpoint。".into()
}

#[tauri::command]
fn stop_voice_session() -> String {
    "语音会话占位已停止。".into()
}

#[tauri::command]
fn inspect_webpage() -> String {
    "网页查看占位已触发：下一步接入 URL 抓取、DOM/readability 提取或浏览器扩展桥。".into()
}

#[tauri::command]
fn capture_screenshot_for_translation() -> String {
    "截图翻译占位已触发：下一步接入系统截图、OCR、区域选择和翻译请求。".into()
}

#[tauri::command]
fn get_selected_text() -> String {
    "选中文字占位已触发：下一步接入系统剪贴板/辅助功能 API 获取跨应用选区。".into()
}

#[tauri::command]
fn get_desktop_context() -> String {
    "桌面内容占位已触发：下一步接入活动窗口、屏幕摘要和可见文本提取。".into()
}

#[tauri::command]
fn send_to_openclaw(request: serde_json::Value) -> String {
    format!("OpenClaw 请求占位已收到，等待接入你的服务端：{}", request)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            minimize_window,
            close_window,
            start_voice_session,
            stop_voice_session,
            inspect_webpage,
            capture_screenshot_for_translation,
            get_selected_text,
            get_desktop_context,
            send_to_openclaw
        ])
        .run(tauri::generate_context!())
        .expect("error while running Door Frost Assistant");
}
