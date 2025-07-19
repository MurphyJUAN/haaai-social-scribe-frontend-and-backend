# HSSAI 社工助手前端系統

## 📋 專案簡介

**HSSAI 社工助手前端系統** 是一個基於 Vue 3 + TypeScript 的現代化 Web 應用程式，專為社工專業人員設計，提供智能化的訪談記錄處理和報告生成服務。系統整合了多項 AI 技術，包括語音轉文字、自動報告生成，以及智能人物關係圖分析等功能。

### 🎯 核心價值

- **提升工作效率**：自動化處理訪談記錄，減少文書作業時間
- **增強服務品質**：AI 輔助分析，提供更全面的案件洞察
- **標準化流程**：統一的報告格式和處理流程
- **易於使用**：直觀的用戶界面，降低學習成本

---

## ✨ 主要功能模組

### 1. 📝 逐字稿管理系統
- **音檔上傳與播放**：支援音檔上傳，內建音檔播放器 (使用 WaveSurfer.js)
- **逐字稿編輯**：文字區域編輯器，支援即時編輯
- **文件匯入匯出**：支援直接文字輸入，可下載為 TXT 檔案
- **自動儲存**：使用 Pinia 狀態管理，支援 localStorage 持久化

### 2. 📊 AI 報告生成系統
- **智能分析**：基於逐字稿內容，AI 自動分析並生成報告
- **多腳本支援**：支援不同 Prompt 腳本的差異化呼叫方式
- **報告模板**：支援 4 種預設模板，包含不同機構格式和 AI 模型選擇
- **流式生成**：即時顯示 AI 生成過程，內容逐步累加顯示
- **模板參數傳遞**：前端會根據選擇的模板傳送對應參數到後端
- **內容編輯**：生成後的報告內容可進行編輯

### 3. 🕸️ 人物關係圖系統
- **智能抽取**：AI 自動分析文本中的人物關係，回傳 JSON 格式資料
- **視覺化呈現**：使用 Vis.js 繪製關係圖 (VisNetworkGraph 組件)
- **編輯模式**：支援智能對話編輯和手動編輯兩種模式
- **JSON 操作**：支援 JSON 內容編輯、複製、下載
- **自動生成**：可設定在報告生成後自動觸發人物關係圖生成

### 4. 🎛️ 工作台管理
- **分頁式介面**：三個主要分頁 - 逐字稿、AI 報告、人物關係圖
- **狀態管理**：使用 Pinia 統一管理會話狀態，支援 localStorage 持久化
- **檔案上傳**：支援音檔和逐字稿檔案上傳 (BannerUpload 組件)
- **會話控制**：支援儲存和清除會話功能

---

## 🏗️ 技術架構

### 前端技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| **Vue.js** | 3.4.21 | 核心框架，提供響應式 UI |
| **TypeScript** | 5.4.0 | 類型安全，提升代碼品質 |
| **Vite** | 6.3.5 | 構建工具，快速開發體驗 |
| **Vue Router** | 4.3.0 | 單頁應用路由管理 |
| **Pinia** | 2.1.7 | 狀態管理，支援持久化 |
| **PrimeVue** | 3.53.1 | UI 組件庫，企業級體驗 |
| **Tailwind CSS** | 3.4.3 | 原子化 CSS 框架 |

### 核心依賴

| 套件 | 版本 | 功能說明 |
|------|------|----------|
| **Vis Network** | 9.1.10 | 關係圖視覺化 |
| **Axios** | 1.7.2 | HTTP 客戶端，API 通信 |
| **WaveSurfer.js** | 7.9.5 | 音檔波形顯示與播放 |
| **PDFMake** | 0.2.10 | PDF 文件生成 |
| **Chart.js** | 4.4.8 | 圖表繪製 |
| **D3.js** | 7.9.0 | 數據視覺化 |
| **RecordRTC** | 5.6.2 | 瀏覽器錄音功能 |
| **OpenCC** | 1.0.5 | 繁簡中文轉換 |

### 開發工具

| 工具 | 版本 | 用途 |
|------|------|------|
| **ESLint** | 8.57.0 | 代碼檢查，維護代碼品質 |
| **Prettier** | 3.2.5 | 代碼格式化 |
| **Vue TSC** | 2.0.11 | TypeScript 類型檢查 |
| **Autoprefixer** | 10.4.19 | CSS 前綴自動添加 |

---

## 📁 專案結構

```
frontend/
├── 📂 public/                    # 靜態資源
├── 📂 src/
│   ├── 📂 api/                   # API 接口層
│   │   └── axiosClient.ts        # Axios 配置
│   ├── 📂 assets/                # 靜態資源 (圖片、字體等)
│   ├── 📂 components/            # Vue 組件
│   │   ├── 📂 Banner/            # 上傳橫幅組件
│   │   ├── 📂 Dashboard/         # 儀表板組件
│   │   ├── 📂 Footer/            # 頁腳組件
│   │   ├── 📂 NavBar/            # 導航欄組件
│   │   ├── 📂 PersonGraph/       # 人物關係圖組件
│   │   │   ├── PersonGraphEditor.vue    # 關係圖編輯器
│   │   │   ├── PersonGraphChat.vue      # 關係圖對話介面
│   │   │   ├── PersonGraphViewer.vue    # 關係圖檢視器
│   │   │   └── 📂 vis-network/          # Vis.js 相關組件
│   │   ├── 📂 Player/            # 音檔播放器組件
│   │   ├── 📂 ReportSession/     # 報告會話組件
│   │   │   └── ReportEditor.vue  # 報告編輯器
│   │   ├── 📂 TypescriptEditor/  # 逐字稿編輯器組件
│   │   │   └── TypescriptEditor.vue
│   │   ├── BasicLayout.vue       # 基礎佈局組件
│   │   ├── ModeLayout.vue        # 模式佈局組件
│   │   └── CustodyMultiSelect.vue # 多選下拉組件
│   ├── 📂 primevue-presets/      # PrimeVue 主題預設
│   ├── 📂 router/                # 路由配置
│   │   └── index.ts
│   ├── 📂 stores/                # Pinia 狀態管理
│   │   └── useSessionStore.ts    # 會話狀態管理
│   ├── 📂 utils/                 # 工具函數
│   │   ├── pdfMake.ts           # PDF 生成工具
│   │   ├── sessionManager.ts    # 會話管理工具
│   │   └── stageMessages.ts     # 階段提示訊息
│   ├── 📂 views/                # 頁面組件
│   │   └── HomeView.vue         # 主頁面
│   ├── App.vue                  # 根組件
│   ├── main.ts                  # 應用程式入口
│   ├── style.css                # 全域樣式
│   └── shims-vue.d.ts           # Vue TypeScript 聲明
├── 📄 package.json              # 專案配置與依賴
├── 📄 vite.config.ts            # Vite 構建配置
├── 📄 tailwind.config.js        # Tailwind CSS 配置
├── 📄 tsconfig.json             # TypeScript 配置
├── 📄 .eslintrc.cjs             # ESLint 配置
├── 📄 .prettierrc.json          # Prettier 配置
└── 📄 README.md                 # 專案說明文件
  ```

---

## 🚀 快速開始

### 環境需求

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0 或 **yarn**: >= 1.22.0
- **瀏覽器**: Chrome 90+, Firefox 88+, Safari 14+

### 安裝與啟動

1. **克隆專案**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **安裝依賴**
   ```bash
   npm install
   # 或
   yarn install
   ```

3. **啟動開發伺服器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

4. **開啟瀏覽器**
   - 開發環境預設運行於 `http://localhost:5173`
   - 系統會自動開啟瀏覽器

### 開發指令

| 指令 | 功能 |
|------|------|
| `npm run dev` | 啟動開發伺服器 |
| `npm run build` | 構建生產版本 |
| `npm run preview` | 預覽生產版本 |
| `npm run type-check` | TypeScript 類型檢查 |
| `npm run lint` | ESLint 代碼檢查 |
| `npm run format` | Prettier 代碼格式化 |

---

## 🔧 配置說明

### API 配置

系統使用兩套 API 配置方式：

#### 1. Vite Proxy 配置 (開發環境)
```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': 'http://127.0.0.1:5353'
  }
}
```

#### 2. Axios 客戶端配置 (生產環境)
```typescript
// src/api/axiosClient.ts
const apiClient = axios.create({
  baseURL: 'https://hssai-custodiAI.phys.nthu.edu.tw/api',
  headers: {
    'Content-Type': 'application/json'
  }
})
```

### 環境變數配置

創建 `.env.local` 檔案設定環境變數：

```bash
# API 基礎 URL
VITE_API_BASE_URL=https://your-api-domain.com/api

# 開發模式標記
VITE_DEV_MODE=true

# 啟用除錯模式
VITE_DEBUG=true
```

### 主題配置

系統支援深色/淺色主題切換，配置位於：
- `src/primevue-presets/lara/` - PrimeVue 主題預設
- `tailwind.config.js` - Tailwind CSS 色彩配置

---

## 🌐 後端整合

### API 端點

基於實際代碼分析，系統使用以下 API 端點：

| 端點 | 方法 | 功能 | 參數 |
|------|------|------|------|
| `/api/run` | POST | 生成報告 | `{ text: string, template: string, sessionId: string }` |
| `/api/PersonGraph` | POST | 生成人物關係圖 | `{ text: string, sessionId: string }` |

### 流式資料處理

系統支援 Server-Sent Events (SSE) 進行即時資料串流：

```typescript
// 流式 API 呼叫範例 (基於實際代碼)
const response = await fetch('/api/run', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    text: transcript,
    template: template,
    sessionId: sessionId
  })
})

const reader = response.body?.getReader()
const decoder = new TextDecoder('utf-8')
let buffer = ''

while (true) {
  const { value, done } = await reader.read()
  if (done) break
  
  buffer += decoder.decode(value, { stream: true })
  let lines = buffer.split('\n')
  buffer = lines.pop() || ''
  
  for (const line of lines) {
    if (!line.trim()) continue
    try {
      const obj = JSON.parse(line)
      // 累加內容
      content += obj.content
    } catch (e) {
      // 忽略解析錯誤
    }
  }
}
```

### 後端專案

後端 API 請參考：[basic-backend-design-for-auto-generating-social-work-visit-reports-using-Docker](https://github.com/iamleoluo/basic-backend-design-for-auto-generating-social-work-visit-reports-using-Docker.git)

---

## 🔄 多腳本(Prompt)呼叫系統

### 架構設計

系統支援不同的 Prompt 腳本有不同的呼叫方式，透過模板選擇機制實現差異化處理：

#### 前端模板配置
```typescript
// TypescriptEditor.vue 中的模板定義
const templates = [
  '士林地院家事服務中心格式(ChatGPT)',
  '士林地院家事服務中心格式(Claude)',
  '珍珠社會福利協會格式(ChatGPT)',
  '珍珠社會福利協會格式(Claude)'
]

const templateOptions = templates.map((template) => ({
  label: template,
  command: () => {
    sessionStore.setSelectedTemplate(template)
    generateReportStream(template)  // 不同模板觸發不同處理
  }
}))
```

#### API 呼叫差異化
```typescript
// 不同模板會傳送不同的參數到後端
const generateReportStream = async (template: string) => {
  const response = await fetch('/api/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      text: transcript,
      template: template,  // 關鍵：模板參數決定後端 Prompt 腳本
      sessionId: sessionId.value
    })
  })
  // ... 流式處理邏輯
}
```

### 模板特色

| 模板名稱 | 機構 | AI 模型 | 特色 |
|---------|------|---------|------|
| 士林地院家事服務中心格式(ChatGPT) | 士林地方法院 | ChatGPT | 法院標準格式，邏輯性強 |
| 士林地院家事服務中心格式(Claude) | 士林地方法院 | Claude | 法院標準格式，語言更自然 |
| 珍珠社會福利協會格式(ChatGPT) | 珍珠社會福利協會 | ChatGPT | 社福機構格式，重視關懷面向 |
| 珍珠社會福利協會格式(Claude) | 珍珠社會福利協會 | Claude | 社福機構格式，表達更溫和 |

### 使用方式

1. **模板選擇**
   - 在逐字稿編輯頁面點擊「生成報告」按鈕
   - 從下拉選單選擇合適的模板
   - 系統會記住使用者的選擇

2. **差異化處理**
   - 不同模板會觸發後端載入不同的 Prompt 腳本
   - 各模板有專屬的處理邏輯和輸出格式
   - AI 模型選擇會影響報告的語言風格和分析深度

3. **狀態管理**
   ```typescript
   // 選中的模板會存儲在 Pinia store 中
   sessionStore.setSelectedTemplate(template)
   
   // 支援 localStorage 持久化
   persist: {
     paths: ['selectedTemplate', ...]
   }
   ```

### 擴展性

系統設計支援輕鬆新增更多模板：

```typescript
// 新增模板只需修改 templates 陣列
const templates = [
  // 現有模板...
  '新機構格式(GPT-4)',
  '醫療社工格式(Claude)',
  '學校社工格式(ChatGPT)'
]
```

### 後端實現架構

基於實際 `backend/app.py` 的實現，後端採用配置文件映射的方式處理不同模板：

#### 配置文件映射
```python
# backend/app.py 中的模板配置映射
config_file_map = {
    '士林地院家事服務中心格式(ChatGPT)': 'run_court_format_gpt.json',
    '士林地院家事服務中心格式(Claude)': 'run_court_format_claude.json',
    '珍珠社會福利協會格式(ChatGPT)': 'run_association_format_gpt.json',
    '珍珠社會福利協會格式(Claude)': 'run_association_format_claude.json',
    '司法社工家庭訪視模板': 'run.json'  # 保持向後兼容
}
```

#### API 端點實現
```python
@app.route('/api/run', methods=['POST'])
def run_script():
    data = request.get_json()
    text = data.get('text', '')
    template = data.get('template', '司法社工家庭訪視模板')
    session_id = data.get('sessionId', str(uuid.uuid4()))
    
    # 根據前端傳來的模板名稱選擇對應的配置文件
    config_file = config_file_map.get(template, 'run.json')
    
    # 為每個會話創建獨立的輸入文件
    input_file = get_session_file_path(session_id, 'input.txt')
    
    # 調用對應的處理腳本
    process = subprocess.Popen([
        sys.executable, 'run.py', 
        '--session-id', session_id,
        '--input-file', input_file,
        '--config-file', config_file  # 關鍵：傳入對應的配置文件
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
```

#### 會話管理機制
```python
# 會話文件管理
def get_session_file_path(session_id: str, filename: str) -> str:
    """為每個會話創建獨立的工作目錄"""
    session_dir = os.path.join(TEMP_DIR, session_id)
    if not os.path.exists(session_dir):
        os.makedirs(session_dir)
    return os.path.join(session_dir, filename)

def cleanup_session_files(session_id: str):
    """清理會話文件，避免磁碟空間累積"""
    session_dir = os.path.join(TEMP_DIR, session_id)
    if os.path.exists(session_dir):
        shutil.rmtree(session_dir)
```

### 完整的前後端流程

1. **前端模板選擇**
   ```typescript
   // 用戶點擊模板選項
   command: () => {
     sessionStore.setSelectedTemplate(template)
     generateReportStream(template)  // 觸發 API 調用
   }
   ```

2. **API 請求傳送**
   ```typescript
   const response = await fetch('/api/run', {
     method: 'POST',
     body: JSON.stringify({ 
       text: transcript,
       template: '士林地院家事服務中心格式(ChatGPT)',  // 模板名稱
       sessionId: sessionId.value
     })
   })
   ```

3. **後端配置文件選擇**
   ```python
   # 後端根據模板名稱選擇配置文件
   config_file = config_file_map.get(template, 'run.json')
   # 結果：'run_court_format_gpt.json'
   ```

4. **腳本執行與流式回傳**
   ```python
   # 調用對應的處理腳本
   process = subprocess.Popen([
     sys.executable, 'run.py',
     '--config-file', 'run_court_format_gpt.json'
   ])
   
   # 流式回傳結果
   for line in process.stdout:
     yield line  # 即時傳送到前端
   ```

### 支援的 API 端點

| 端點 | 功能 | 特殊處理 |
|------|------|----------|
| `/api/run` | 報告生成 | 支援模板配置文件映射 |
| `/api/PersonGraph` | 人物關係圖生成 | 固定使用 `person_graph.json` |
| `/api/PersonGraphChat` | 人物關係圖對話編輯 | 支援上下文對話，整合逐字稿和當前關係圖 |
| `/cleanup/<session_id>` | 清理會話文件 | 管理磁碟空間 |

### 擴展新模板的步驟

1. **前端新增模板**
   ```typescript
   const templates = [
     // 現有模板...
     '新機構格式(GPT-4)',  // 新增
   ]
   ```

2. **後端新增配置映射**
   ```python
   config_file_map = {
     # 現有映射...
     '新機構格式(GPT-4)': 'run_new_institution_gpt4.json',  # 新增
   }
   ```

3. **創建對應的配置文件**
   - 建立 `run_new_institution_gpt4.json`
   - 配置專屬的 Prompt 和 AI 模型參數
   - 設定輸出格式和處理邏輯

### 進階功能：人物關係圖對話編輯

後端還支援智能對話方式編輯人物關係圖：

```python
@app.route('/api/PersonGraphChat', methods=['POST'])
def person_graph_chat():
    data = request.get_json()
    message = data.get('message', '')           # 用戶指令
    current_graph = data.get('currentGraph', '') # 當前關係圖JSON
    transcript = data.get('transcript', '')      # 原始逐字稿
    session_id = data.get('sessionId', str(uuid.uuid4()))
    
    # 創建包含完整上下文的輸入
    input_content = f"""
原始逐字稿:
{transcript}

當前人物關係圖JSON:
{current_graph}

用戶指令:
{message}
"""
```

這個功能讓使用者可以：
- **自然語言編輯**：「請新增小明和小華的兄弟關係」
- **上下文保持**：AI 會參考原始逐字稿和當前關係圖
- **增量修改**：不需要重新生成整個關係圖

---

## 🎨 使用者介面

### 設計系統

- **色彩方案**: 基於 Material Design 3.0 規範
- **字體**: Inter 字體系列，支援多語言
- **圖標**: PrimeIcons 圖標庫
- **響應式**: 支援桌面、平板、手機多端適配

### 組件庫

系統基於 PrimeVue 構建，提供豐富的 UI 組件：
- **表單組件**: 輸入框、選擇器、上傳器等
- **數據展示**: 表格、圖表、樹狀結構等
- **導航組件**: 選單、標籤頁、麵包屑等
- **反饋組件**: 對話框、通知、載入指示器等

### 主題客製化

```typescript
// 自定義主題色彩
const customTheme = {
  primary: '#4F46E5',      // 主要色彩
  secondary: '#1C1D8F',    // 次要色彩
  success: '#10B981',      // 成功色彩
  warning: '#F59E0B',      // 警告色彩
  danger: '#EF4444',       // 危險色彩
}
```

---

## 📱 功能詳細說明

### 逐字稿編輯系統

**檔案支援格式**:
- 音檔: 基於 HTML5 Audio API 支援的格式
- 文字檔: TXT (可直接貼上文字內容)

**核心功能**:
- 檔案上傳 (透過 BannerUpload 組件)
- 文字內容編輯
- 自動儲存至 localStorage
- 下載為 TXT 檔案

**技術實現**:
```typescript
// 狀態管理 (基於實際 useSessionStore.ts)
const sessionStore = useSessionStore()
const { transcriptText } = storeToRefs(sessionStore)

// 支援 localStorage 持久化
// 在 stores/useSessionStore.ts 中配置
export const useSessionStore = defineStore('session', () => {
  // ... store 邏輯
}, {
  persist: {
    storage: localStorage,
    paths: ['transcriptText', 'reportText', 'personGraphJson']
  }
})
```

### AI 報告生成系統

**報告模板類型** (基於實際代碼):
- 士林地院家事服務中心格式(ChatGPT)
- 士林地院家事服務中心格式(Claude)
- 珍珠社會福利協會格式(ChatGPT)
- 珍珠社會福利協會格式(Claude)

**生成流程**:
1. 使用者選擇報告模板 (SplitButton 下拉選單)
2. 前端傳送逐字稿、模板名稱和會話 ID 到 `/api/run`
3. 後端根據模板參數載入對應的 Prompt 腳本
4. AI 流式生成報告內容
5. 前端即時顯示累加內容
6. (可選) 自動觸發人物關係圖生成

### 人物關係圖系統

**資料結構**:
  ```json
{
  "nodes": [
    {
      "id": "person1",
      "label": "張三",
      "type": "individual",
      "attributes": {
        "age": 45,
        "gender": "male",
        "role": "父親"
      }
    }
  ],
  "edges": [
    {
      "from": "person1",
      "to": "person2",
      "label": "父子關係",
      "relationship": "family"
    }
  ]
}
```

**視覺化選項**:
- 節點樣式客製化
- 關係線條樣式
- 佈局演算法選擇
- 互動式操作

---

## 🔒 安全性考量

### 資料保護
- **本地儲存**: 敏感資料僅儲存於本地 localStorage
- **傳輸加密**: 所有 API 通信使用 HTTPS
- **檔案上傳**: 檔案格式與大小限制
- **XSS 防護**: 輸入內容過濾與轉義

### 隱私保護
- **資料匿名化**: 自動移除個人識別資訊
- **會話管理**: 定期清理過期會話
- **存取控制**: 基於角色的權限管理

---

## 🚀 部署指南

### 開發環境部署

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

### 生產環境部署

#### 1. 構建應用程式
```bash
# 構建生產版本
npm run build

# 構建產物位於 dist/ 目錄
ls dist/
```

#### 2. 使用 Nginx 部署
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/frontend/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend-server:5353;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 3. 使用 Docker 部署
```dockerfile
# Dockerfile
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 環境配置檢查清單

- [ ] API 端點配置正確
- [ ] 環境變數設定完成
- [ ] SSL 憑證安裝 (生產環境)
- [ ] 防火牆規則配置
- [ ] 監控與日誌配置

---

## 🧪 測試

### 測試策略
- **手動測試**: 目前主要依賴手動功能測試
- **效能測試**: 使用 Lighthouse 進行效能評估

**注意**: 專案目前尚未配置自動化測試框架，建議未來整合 Vitest 或 Cypress 進行單元測試和端對端測試。

---

## 🛠️ 開發指南

### 代碼規範

**命名規範**:
- 檔案名稱: PascalCase (組件) / camelCase (工具函數)
- 變數名稱: camelCase
- 常數名稱: UPPER_SNAKE_CASE
- CSS 類別: kebab-case

**組件開發**:
```vue
<template>
  <!-- 模板內容 -->
</template>

<script setup lang="ts">
// 使用 Composition API
import { ref, computed, onMounted } from 'vue'

// 介面定義
interface Props {
  title: string
  data: any[]
}

// Props 定義
const props = defineProps<Props>()

// 響應式資料
const loading = ref(false)

// 計算屬性
const processedData = computed(() => {
  return props.data.filter(item => item.active)
})
</script>

<style scoped>
/* 組件樣式 */
</style>
```

### Git 工作流程

**分支策略**:
- `main`: 主分支，穩定版本
- `develop`: 開發分支
- `feature/*`: 功能分支
- `hotfix/*`: 緊急修復分支

**提交訊息格式**:
```
type(scope): description

feat(auth): add user login functionality
fix(api): resolve data fetching issue
docs(readme): update installation guide
```

### 效能優化

**程式碼分割**:
```typescript
// 路由層級程式碼分割
const HomeView = () => import('@/views/HomeView.vue')
```

**圖片優化**:
- 使用 WebP 格式
- 實作 lazy loading
- 適當的圖片尺寸

**Bundle 優化**:
- Tree shaking
- 依賴分析
- 壓縮優化

---

## 📊 監控與維護

### 效能監控
- **Core Web Vitals**: LCP, FID, CLS 指標監控
- **Bundle Size**: 構建產物大小追蹤
- **API Response Time**: API 回應時間監控

### 錯誤追蹤
- **前端錯誤**: 使用 Sentry 進行錯誤收集
- **使用者行為**: 使用者操作行為分析
- **效能分析**: 頁面載入效能分析

### 維護計畫
- **定期更新**: 依賴套件安全更新
- **效能優化**: 定期效能評估與優化
- **功能擴充**: 根據使用者回饋新增功能

---

## 🤝 貢獻指南

### 開發環境設定
1. Fork 專案到個人帳號
2. 克隆 Fork 的專案
3. 安裝依賴並啟動開發環境
4. 創建功能分支進行開發

### 提交程式碼
1. 確保程式碼符合規範 (`npm run lint`)
2. 執行測試確保無錯誤 (`npm run test`)
3. 提交 Pull Request
4. 等待程式碼審查

### 問題回報
請使用 GitHub Issues 回報問題，包含：
- 詳細的問題描述
- 重現步驟
- 環境資訊
- 相關截圖或錯誤訊息

---

## 📋 更新日誌

### v1.0.0 (2024-01-15)
- ✨ 初始版本發布
- 🎯 完整的逐字稿編輯功能
- 🤖 AI 報告生成系統
- 🕸️ 人物關係圖視覺化

### v1.1.0 (2024-02-01)
- 🚀 效能優化
- 🎨 UI/UX 改進
- 🐛 錯誤修復
- 📱 響應式設計優化

---

## 📞 技術支援

### 聯絡方式
- **專案維護者**: [GitHub Profile]
- **問題回報**: [GitHub Issues]
- **技術討論**: [GitHub Discussions]

### 常見問題

**Q: 為什麼音檔上傳失敗？**
A: 請檢查檔案格式是否支援，檔案大小是否超過限制。

**Q: AI 生成報告很慢？**
A: 這是正常現象，AI 處理需要時間，請耐心等待。

**Q: 關係圖無法顯示？**
A: 請確認瀏覽器支援 WebGL，或嘗試重新整理頁面。

---

## 📄 授權條款

本專案採用 MIT 授權條款，詳見 [LICENSE](LICENSE) 檔案。

---

## �� 致謝

感謝所有為本專案做出貢獻的開發者和使用者。特別感謝：

- Vue.js 社群提供優秀的開發工具
- PrimeVue 團隊提供美觀的 UI 組件
- 所有開源專案的貢獻者

---

**版本**: v1.1.0  
**最後更新**: 2024-02-01  
**維護狀態**: 🟢 積極維護中
