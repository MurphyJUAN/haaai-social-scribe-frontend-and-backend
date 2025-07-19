# HAAAI Social Scribe —— AI 社工助手系統

一個基於 AI 的社工訪視報告自動生成系統，支援逐字稿分析、報告初稿生成和人物關係圖視覺化。系統採用前後端分離架構，後端使用 Flask 支援多種 LLM（Ollama、OpenAI），前端使用 Vue 3 + TypeScript 提供現代化 Web 介面。

---

## ✨ 主要功能

- **📝 逐字稿處理** - 上傳、編輯逐字稿，支援音檔播放同步
- **🤖 AI 報告生成** - 自動生成家事訪視報告初稿，支援流式顯示
- **👥 人物關係圖** - AI 自動抽取人物關係，支援視覺化和互動編輯
- **📊 JSON 編輯器** - 即時編輯和預覽人物關係結構
- **💾 會話管理** - 支援多會話並行處理和暫存清理
- **🐳 Docker 部署** - 容器化部署，環境變數管理 API 金鑰

---

## 🏗️ 系統架構

```
haaai-social-scribe-frontend-and-backend/
├── backend/                    # Flask API 後端
│   ├── app.py                 # 主應用入口
│   ├── run.py                 # 報告生成流程
│   ├── person_graph.py        # 人物關係圖處理
│   ├── person_graph_chat.py   # 互動式關係圖修改
│   ├── prompt_core/           # 核心 Prompt 管理
│   │   ├── chat.py           # LLM API 封裝
│   │   └── prompt.py         # Prompt 模板
│   ├── requirements.txt       # Python 依賴
│   ├── Dockerfile            # Docker 建置
│   ├── setting.json          # LLM 設定
│   ├── run.json              # 報告生成設定
│   ├── person_graph.json     # 關係圖設定
│   ├── person_graph_chat.json # 互動設定
│   └── temp_sessions/        # 暫存會話
├── frontend/                  # Vue 3 前端
│   ├── src/
│   │   ├── components/       # Vue 組件
│   │   │   ├── TypescriptEditor/     # 逐字稿編輯器
│   │   │   ├── ReportSession/        # 報告顯示
│   │   │   ├── PersonGraph/          # 人物關係圖
│   │   │   ├── Dashboard/            # 主控台
│   │   │   └── ...
│   │   ├── stores/           # Pinia 狀態管理
│   │   ├── router/           # Vue Router
│   │   └── utils/            # 工具函數
│   ├── package.json          # Node.js 依賴
│   └── vite.config.ts        # Vite 設定 (含 Proxy)
└── temp_sessions/            # 共享暫存目錄
```

---

## 🚀 快速開始

### 🔧 系統需求

- **Node.js** 18+ 
- **Python** 3.8+
- **Docker** (可選，建議生產環境使用)

### 📦 安裝與啟動

#### 方法一：Docker 部署（推薦）

1. **啟動後端**
```bash
cd backend
docker build -t haaai-backend .
docker run -e MY_OPENAI_KEY=your_openai_key -p 5050:5050 haaai-backend
```

2. **啟動前端**
```bash
cd frontend
npm install
npm run dev
```

#### 方法二：本地開發

1. **後端設定**
```bash
cd backend
cp api_key.example.json api_key.json
# 編輯 api_key.json 填入你的 API 金鑰
pip install -r requirements.txt
python app.py
```

2. **前端設定**
```bash
cd frontend
npm install
npm run dev    # 啟動於 http://localhost:5173
```

### 🔑 API 金鑰設定

創建 `backend/api_key.json`：
```json
{
  "my_openai_key": "sk-your-actual-openai-key-here"
}
```

或使用環境變數（Docker 推薦）：
```bash
export MY_OPENAI_KEY=sk-your-openai-key
```

---

## 🔌 API 端點

| 方法 | 端點 | 功能 | 請求格式 |
|------|------|------|----------|
| POST | `/run` | 生成訪視報告 | `{"text": "逐字稿內容", "sessionId": "可選"}` |
| POST | `/PersonGraph` | 生成人物關係圖 | `{"text": "逐字稿內容", "sessionId": "可選"}` |
| POST | `/PersonGraphChat` | 修改人物關係圖 | `{"message": "修改指令", "currentGraph": "{...}", "transcript": "逐字稿", "sessionId": "必填"}` |
| DELETE | `/cleanup/<session_id>` | 清理會話暫存 | - |

### 流式 API 回應

所有 AI 生成端點都支援流式回應，前端會即時顯示生成內容：

```javascript
// 流式請求範例
const response = await fetch('/run', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: transcript, sessionId: sessionId })
});

const reader = response.body?.getReader();
// 處理流式數據...
```

---

## ⚙️ 設定檔說明

### `backend/setting.json` - LLM 模型設定
```json
[
  {
    "id": "ollama_llama3.2",
    "platform": "ollama", 
    "model": "llama3.2",
    "url": "http://127.0.0.1:11434"
  },
  {
    "id": "openai_gpt-4o",
    "platform": "openai",
    "model": "gpt-4o", 
    "openai_api_key": "my_openai_key"
  }
]
```

### `backend/run.json` - 報告生成流程
定義多步驟 Prompt 流程，支援條件分支和參數傳遞。

### `backend/person_graph.json` - 人物關係圖設定
設定人物抽取和關係分析的 Prompt 模板。

---

## 🎨 前端特色功能

### 📝 逐字稿編輯器
- 支援文字檔上傳和手動編輯
- 音檔播放同步（支援多種格式）
- 自動儲存和恢復
- 一鍵生成 AI 報告

### 👥 人物關係圖
- AI 自動抽取人物和關係
- JSON 格式即時編輯
- 支援 Vis.js 視覺化渲染
- 互動式修改和聊天功能

### 📊 狀態管理
使用 Pinia 進行全域狀態管理：
```typescript
// stores/useSessionStore.ts
export const useSessionStore = defineStore('session', {
  state: () => ({
    transcript: '',
    report: '',
    personGraph: {},
    activeTabIndex: 0,
    currentSessionId: null
  }),
  persist: true // 本地持久化
})
```

---

## 🔒 安全性建議

### 🔐 API 金鑰保護
- ✅ 使用 Docker 環境變數注入金鑰
- ✅ `api_key.json` 已在 `.gitignore` 中
- ❌ 絕不將真實金鑰提交到版本控制
- 🔄 定期輪換 API 金鑰

### 🗂️ 檔案管理
- 定期清理 `temp_sessions/` 暫存檔案
- 避免敏感資訊存放在暫存中
- 會話隔離確保資料安全

---

## 🛠️ 開發指南

### 📋 前端開發指令
```bash
npm run dev          # 開發伺服器
npm run build        # 生產建置
npm run preview      # 預覽建置
npm run type-check   # TypeScript 檢查
npm run lint         # ESLint 檢查
npm run format       # Prettier 格式化
```

### 🔧 Proxy 設定
前端自動代理 API 請求到後端：
```typescript
// vite.config.ts
server: {
  proxy: {
    '/run': 'http://127.0.0.1:5050',
    '/PersonGraph': 'http://127.0.0.1:5050',
    '/PersonGraphChat': 'http://127.0.0.1:5050',
    '/cleanup': 'http://127.0.0.1:5050'
  }
}
```

### 🧩 組件架構
- **模組化設計** - 每個功能獨立組件
- **TypeScript** - 完整型別支援
- **響應式設計** - 支援多裝置
- **PrimeVue UI** - 專業 UI 組件庫

---

## 🐛 常見問題

### Q: 前端無法連接後端 API？
**A:** 檢查 `vite.config.ts` 的 proxy 設定，確保後端在 `http://127.0.0.1:5050` 啟動。

### Q: AI 回應異常或空白？
**A:** 
1. 檢查 `setting.json` 中的模型設定
2. 確認 API 金鑰有效且有足夠額度
3. 若使用 Ollama，確認模型已啟動

### Q: 人物關係圖無法渲染？
**A:** 檢查 JSON 格式是否正確，可使用內建 JSON 編輯器驗證。

### Q: Docker 容器無法啟動？
**A:** 確認環境變數正確設定，檢查 Docker 日誌：
```bash
docker logs <container_id>
```

---

## 🚧 未來規劃

- [ ] 🌐 多語言支援（中文/英文）
- [ ] 🎨 深色主題模式
- [ ] 📱 行動裝置優化
- [ ] 🔍 全文搜索功能
- [ ] 📈 使用統計分析
- [ ] 🔧 更多 LLM 平台支援
- [ ] 🎯 個人化 Prompt 模板
- [ ] 💬 即時協作功能

---

## 🤝 貢獻指南

歡迎貢獻！請遵循以下步驟：

1. **Fork** 本倉庫
2. **建立** 功能分支 (`git checkout -b feature/amazing-feature`)
3. **提交** 變更 (`git commit -m 'Add amazing feature'`)
4. **推送** 分支 (`git push origin feature/amazing-feature`)
5. **建立** Pull Request

### 💻 開發規範
- 遵循 ESLint 和 Prettier 設定
- 撰寫清晰的 commit 訊息
- 新增功能請包含測試
- 更新相關文檔

---

## 📄 授權條款

本專案採用 [MIT License](LICENSE) 開源授權。

---

## 📞 聯絡方式

- **Issues**: [GitHub Issues](../../issues)
- **作者**: Leo Luo
- **參考專案**: [basic-backend-design-for-auto-generating-social-work-visit-reports-using-Docker](https://github.com/iamleoluo/basic-backend-design-for-auto-generating-social-work-visit-reports-using-Docker)

---

## 🙏 致謝

感謝所有貢獻者和開源社群的支持！

<div align="center">

**⭐ 如果這個專案對你有幫助，請給它一個 Star！**

</div> 