use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OpenClawDesktopContext {
    pub r#type: String,
    pub label: String,
    pub data: serde_json::Value,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OpenClawDesktopRequest {
    pub provider: String,
    pub intent: String,
    pub message: String,
    pub contexts: Vec<OpenClawDesktopContext>,
    pub features: Vec<String>,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OpenClawResponse {
    pub text: String,
    pub raw: Option<serde_json::Value>,
}

#[tauri::command]
pub async fn openclaw_send(request: OpenClawDesktopRequest) -> Result<OpenClawResponse, String> {
    Ok(OpenClawResponse {
        text: format!(
            "OpenClaw adapter placeholder received: {} context(s), message: {}",
            request.contexts.len(),
            request.message
        ),
        raw: Some(serde_json::to_value(request).map_err(|error| error.to_string())?),
    })
}

#[tauri::command]
pub async fn openclaw_collect_context(
    context_type: String,
) -> Result<OpenClawDesktopContext, String> {
    let label = match context_type.as_str() {
        "voice" => "语音上下文",
        "webpage" => "网页上下文",
        "screenshot-translate" => "截图翻译上下文",
        "selection" => "选中文字",
        "desktop-context" => "桌面上下文",
        _ => "未知上下文",
    };

    Ok(OpenClawDesktopContext {
        r#type: context_type,
        label: label.to_string(),
        data: serde_json::json!({ "status": "placeholder" }),
        created_at: chrono::Utc::now().to_rfc3339(),
    })
}
