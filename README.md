# HAAAI Social Scribe - AI 社工助手系統

一個基於 AI 的社工訪視報告自動生成系統，支援逐字稿分析、報告初稿生成、人物關係圖視覺化和處遇計畫編輯。系統採用前後端分離架構，後端使用 Flask + Python，前端使用 Vue 3 + TypeScript。

---

## ✨ 核心功能

- **📝 逐字稿處理** - 上傳文字檔、手動編輯，支援音檔播放同步
- **🤖 智能報告生成** - AI 自動生成社工訪視報告初稿，支援流式回應
- **👥 人物關係圖** - AI 智能抽取人物關係，支援視覺化和進階對話編輯
- **📋 處遇計畫編輯** - 基於報告內容智能生成個案處遇計畫
- **💾 會話管理** - 支援多會話並行處理和本地持久化
- **🔧 多 LLM 支援** - 支援 OpenAI、Ollama、Anthropic 等多種語言模型

---

## 🏗️ 系統架構

```
haaai-social-scribe/
├── backend/                    # Flask API 後端
│   ├── app.py                 # 主應用入口
│   ├── api/                   # API 路由模組
│   │   ├── report_routes.py   # 報告生成API
│   │   ├── treatment_routes.py # 處遇計畫API  
│   │   └── graph_routes.py    # 人物關係圖API
│   ├── utils/                 # 工具模組
│   │   ├── session_manager.py # 會話管理
│   │   ├── file_manager.py    # 文件管理
│   │   └── treatment_plan.py  # 處遇計畫邏輯
│   ├── prompt_core/           # AI Prompt 核心
│   │   ├── chat.py           # LLM API 封裝
│   │   └── prompt.py         # Prompt 模板管理
│   ├── requirements.txt       # Python 依賴
│   ├── Dockerfile            # Docker 建置檔案
│   └── 設定檔/
│       ├── setting.json       # LLM 模型設定
│       ├── run.json          # 報告生成流程
│       ├── person_graph.json # 關係圖設定
│       └── treatment_plan.json # 處遇計畫設定
├── frontend/                  # Vue 3 前端應用
│   ├── src/
│   │   ├── components/       # Vue 組件庫
│   │   │   ├── TypescriptEditor/    # 逐字稿編輯器
│   │   │   ├── ReportSession/       # 報告顯示組件
│   │   │   ├── PersonGraph/         # 人物關係圖組件
│   │   │   ├── TreatmentPlan/       # 處遇計畫編輯器
│   │   │   ├── ReportConfig/        # 報告配置面板
│   │   │   └── Dashboard/           # 主控台
│   │   ├── stores/           # Pinia 狀態管理
│   │   │   └── modules/      # 模組化 Store
│   │   ├── utils/            # 工具函數
│   │   └── views/            # 頁面組件
│   ├── package.json          # Node.js 依賴
│   └── vite.config.ts        # Vite 開發設定
├── start_services.sh          # 一鍵啟動腳本
├── stop_services.sh           # 一鍵停止腳本
└── temp_sessions/            # 會話暫存目錄
```

---

## 🚀 快速開始

### 🔧 系統需求

- **Node.js** 18+ (前端開發)
- **Python** 3.8+ (後端運行)
- **Docker** (可選，用於容器化部署)

### 📦 安裝與啟動

#### 方法一：本地開發 (推薦)

**1. 後端設定**
```bash
cd backend

# 安裝 Python 依賴
pip install -r requirements.txt

# 配置 API 金鑰
cp api_key.example.json api_key.json
# 編輯 api_key.json 填入您的 API 金鑰

# 啟動 Flask 服務器
python app.py
# 後端將運行在 http://127.0.0.1:5050
```

**2. 前端設定**
```bash
cd frontend

# 安裝 Node.js 依賴
npm install

# 啟動開發服務器
npm run dev
# 前端將運行在 http://127.0.0.1:5173
```

#### 方法二：一鍵啟動腳本 (生產環境推薦)

```bash
# 啟動所有服務
./start_services.sh

# 停止所有服務
./stop_services.sh
```

這些腳本會自動：
- 啟動後端 Flask 服務 (使用虛擬環境)
- 啟動前端 Vite 開發服務器
- 檢查服務狀態並提供啟動結果回饋
- 支援背景執行，適合生產環境部署

#### 方法三：Docker 部署 (僅後端)

```bash
cd backend

# 建置 Docker 映像
docker build -t haaai-backend .

# 運行容器 (使用環境變數)
docker run -e MY_OPENAI_KEY=your_openai_key -p 5050:5050 haaai-backend
```

### 🔑 API 金鑰配置

**方式一：配置檔案** (本地開發)
```json
// backend/api_key.json
{
  "my_openai_key": "sk-your-actual-openai-key-here"
}
```

**方式二：環境變數** (Docker 推薦)
```bash
export MY_OPENAI_KEY=sk-your-openai-key
```

---

## 🔌 API 端點

| 方法 | 端點 | 功能 | 請求格式 |
|------|------|------|----------|
| POST | `/api/run` | 生成訪視報告 | `{"text": "逐字稿", "sessionId": "可選", "template": "報告類型", "selectedSections": []}` |
| POST | `/api/PersonGraph` | 生成人物關係圖 | `{"text": "逐字稿", "sessionId": "可選"}` |
| POST | `/api/PersonGraphChat` | 對話式編輯關係圖 | `{"message": "指令", "currentGraph": "{...}", "transcript": "逐字稿", "sessionId": "必填"}` |
| POST | `/api/treatment_plan` | 生成處遇計畫 | `{"report": "報告內容", "sessionId": "可選"}` |
| DELETE | `/api/cleanup/<session_id>` | 清理會話暫存 | - |
| GET | `/api/health` | 健康檢查 | - |

### 📡 流式回應支援

所有 AI 生成端點都支援即時流式回應：

```javascript
// 前端流式請求範例
const response = await fetch('/api/run', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    text: transcript, 
    sessionId: sessionId,
    template: '通用社工評估報告',
    selectedSections: ['基本資料', '主要議題', '需求評估']
  })
});

const reader = response.body?.getReader();
// 處理流式數據並即時更新 UI
```

---

## ⚙️ 設定檔說明

### `backend/setting.json` - LLM 模型配置
```json
[
  {
    "id": "openai_gpt-4o",
    "platform": "openai",
    "model": "gpt-4o", 
    "openai_api_key": "my_openai_key"
  },
  {
    "id": "ollama_llama3.2",
    "platform": "ollama", 
    "model": "llama3.2",
    "url": "http://127.0.0.1:11434"
  },
  {
    "id": "anthropic_claude",
    "platform": "anthropic",
    "model": "claude-3-sonnet-20240229",
    "anthropic_api_key": "anthropic_key"
  }
]
```

### `backend/run.json` - 報告生成流程
定義多步驟 AI 生成流程，支援條件分支、參數傳遞和自定義模板。

### `backend/person_graph.json` - 人物關係圖配置
設定人物抽取、關係分析和對話編輯的 Prompt 模板。

### `backend/treatment_plan.json` - 處遇計畫配置
定義處遇計畫生成的結構化 Prompt 和輸出格式。

---

## 🎨 前端核心功能

### 📝 逐字稿編輯器 (TypescriptEditor)
- 文字檔上傳和手動編輯
- 音檔播放同步 (支援多種格式)
- 自動儲存和恢復
- 一鍵生成 AI 報告

### 📊 報告生成 (ReportSession)
- 多模板報告生成
- 段落式配置選擇
- 即時流式顯示
- PDF 匯出功能

### 👥 人物關係圖 (PersonGraph)
- AI 自動抽取人物和關係
- Vis.js 視覺化網路圖
- **進階對話編輯** - 非 JSON 編輯器，而是智能對話系統
- 支援複雜關係修改指令

### 📋 處遇計畫編輯器 (TreatmentPlan)
- 基於報告內容智能生成
- 段落結構化編輯
- 個人化調整和重新生成
- 即時預覽功能

### 🗄️ 狀態管理 (Pinia)
採用模組化 Store 架構：
```typescript
// 模組化狀態管理
stores/
├── useSessionStore.ts          # 主會話狀態
└── modules/
    ├── transcriptStore.ts      # 逐字稿狀態
    ├── reportStore.ts          # 報告狀態
    ├── personGraphStore.ts     # 關係圖狀態
    └── treatmentPlanStore.ts   # 處遇計畫狀態
```

---

## 🛠️ 開發指南

### 📋 前端開發指令
```bash
npm run dev          # 開發服務器 (http://127.0.0.1:5173)
npm run build        # 生產建置
npm run preview      # 預覽建置結果
npm run type-check   # TypeScript 類型檢查
npm run lint         # ESLint 代碼檢查
npm run format       # Prettier 代碼格式化
```

### 🔧 開發環境配置
```typescript
// vite.config.ts - 前端代理設定
server: {
  proxy: {
    '/api': 'http://127.0.0.1:5050'  // 代理所有API請求
  },
  host: '127.0.0.1',
  port: 5173
}
```

### 🏗️ 架構特色
- **模組化設計** - 前後端完全分離，組件高度重用
- **TypeScript** - 完整型別支援和開發時檢查
- **響應式 UI** - 基於 PrimeVue + Tailwind CSS
- **流式處理** - AI 回應即時顯示，提升使用者體驗

---

## 🔒 安全性和最佳實踐

### 🔐 API 金鑰保護
- ✅ 使用環境變數或配置檔案管理金鑰
- ✅ `api_key.json` 已加入 `.gitignore`
- ❌ 絕不將真實金鑰提交到版本控制
- 🔄 定期輪換 API 金鑰

### 🗂️ 檔案和會話管理
- 自動清理過期會話檔案
- 會話隔離確保資料安全
- 本地持久化避免意外資料丟失

---

## 🐛 故障排除

### Q: 前端無法連接後端 API？
**A:** 檢查後端是否在 `http://127.0.0.1:5050` 正常啟動，確認防火牆和代理設定。

### Q: AI 回應異常或空白？
**A:** 
1. 檢查 `setting.json` 中的模型配置是否正確
2. 確認 API 金鑰有效且有足夠額度
3. 若使用 Ollama，確認本地模型已下載並啟動

### Q: 人物關係圖無法顯示？
**A:** 檢查瀏覽器控制台錯誤，確認 vis-network 依賴已正確安裝。

### Q: Docker 容器啟動失敗？
**A:** 檢查環境變數設定和 Docker 日誌：
```bash
docker logs <container_id>
```

---

## 🚧 技術棧

### 後端技術
- **Flask 3.0** - Web 框架
- **OpenAI API** - GPT 模型支援
- **Ollama** - 本地 LLM 支援  
- **Anthropic API** - Claude 模型支援

### 前端技術
- **Vue 3** - 漸進式前端框架
- **TypeScript** - 靜態類型檢查
- **Vite** - 快速建置工具
- **Pinia** - 狀態管理
- **PrimeVue** - UI 組件庫
- **Tailwind CSS** - 原子化 CSS
- **Vis-Network** - 關係圖視覺化

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
- 新增功能請包含相應測試
- 更新相關文檔說明

---

## 📄 授權條款

本專案採用 [MIT License](LICENSE) 開源授權。

---

## 📞 聯絡方式

- **Issues**: [GitHub Issues](../../issues)
- **機構**: HAAAI (人文社會 AI 應用研究中心)

---

## 🙏 致謝

感謝所有貢獻者和開源社群的支持！

<div align="center">

**⭐ 如果這個專案對您有幫助，請給它一個 Star！**

</div>