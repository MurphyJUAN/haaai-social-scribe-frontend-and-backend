# AI社工助手5分頁升級完整架構指南

## 🎯 核心改動

**現有：** 3分頁 (逐字稿 → 報告初稿 → 人物關係圖)  
**目標：** 5分頁 (逐字稿 → 報告設定 → 報告初稿 → 處遇計畫 → 人物關係圖)

---

## 🏗️ 系統架構總覽

### 前端架構
```
components/
├── DashboardPanel.vue (修改：3→5分頁)
├── ReportConfig/ReportConfigPanel.vue (新增)
├── TreatmentPlan/TreatmentPlanEditor.vue (新增)
└── 現有組件保持不變

stores/
├── useSessionStore.ts (擴展：新增4個狀態)
└── 新增配置資料檔案

API Layer/
├── 現有 API 調用邏輯 (修改參數)
└── 新增處遇計畫 API 調用
```

### 後端架構
```
app.py (修改：擴展現有端點 + 新增端點)
├── /api/run (修改：接收新參數)
├── /api/treatment-plan (新增)
└── 配置檔案對應 (修改)

配置檔案/
├── run.json 系列 (修改：支援選擇性段落)
├── treatment_plan.json (新增)
└── 模板映射更新
```

---

## 🔄 前後端接口設計

### 1. 現有 API 修改

#### 報告生成 API 擴展
```typescript
// 前端：修改現有 API 調用
// TypescriptEditor.vue 中的 generateReportStream 函數

// 原本
const payload = {
  text: transcript,
  template: template,
  sessionId: sessionId.value
}

// 修改後  
const payload = {
  text: transcript,
  template: template,
  selectedSections: sessionStore.reportConfig.selectedSections, // 新增
  customSettings: sessionStore.reportConfig.customSettings,     // 新增
  sessionId: sessionId.value
}
```

```python
# 後端：app.py 修改
@app.route('/api/run', methods=['POST'])
def run_script():
    data = request.get_json()
    text = data.get('text', '')
    template = data.get('template', '司法社工家庭訪視模板')
    selected_sections = data.get('selectedSections', [])  # 新增
    custom_settings = data.get('customSettings', {})     # 新增
    session_id = data.get('sessionId', str(uuid.uuid4()))
    
    # 根據 selectedSections 動態選擇配置文件
    config_file = get_config_with_sections(template, selected_sections)
    
    # 其餘邏輯保持不變...
```

### 2. 新增處遇計畫 API

#### 前端 API 調用
```typescript
// TreatmentPlanEditor.vue
const generateTreatmentPlan = async () => {
  sessionStore.setTreatmentPlanStage('generating')
  
  try {
    const response = await fetch('/api/treatment-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportContent: sessionStore.reportText,     // 使用生成的報告
        mainIssue: extractMainIssue(),             // 從報告中提取主述議題
        caseType: sessionStore.reportConfig.selectedTemplate,
        sessionId: sessionStore.sessionId
      })
    })
    
    // 流式處理
    const reader = response.body?.getReader()
    // ... 流式讀取邏輯
    
  } catch (error) {
    console.error('處遇計畫生成失敗:', error)
  }
}
```

#### 後端新端點
```python
# app.py 新增
@app.route('/api/treatment-plan', methods=['POST'])
def generate_treatment_plan():
    data = request.get_json()
    report_content = data.get('reportContent', '')
    main_issue = data.get('mainIssue', '')
    case_type = data.get('caseType', '')
    session_id = data.get('sessionId', str(uuid.uuid4()))
    
    def generate():
        # 為處遇計畫創建輸入文件
        input_file = get_session_file_path(session_id, 'treatment_input.txt')
        with open(input_file, 'w', encoding='utf-8') as f:
            f.write(f"報告內容:\n{report_content}\n\n主述議題:\n{main_issue}")
        
        # 調用處遇計畫生成腳本
        process = subprocess.Popen([
            sys.executable, 'treatment_plan.py',
            '--session-id', session_id,
            '--input-file', input_file,
            '--case-type', case_type
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        for line in process.stdout:
            yield line
            
    return Response(generate(), mimetype='application/x-ndjson')
```

### 3. 配置檔案對應

#### 後端配置文件映射擴展
```python
# app.py 中新增配置選擇邏輯
def get_config_with_sections(template: str, selected_sections: list) -> str:
    """根據模板和選擇的段落返回對應的配置文件"""
    
    base_config_map = {
        '士林地院家事服務中心格式(ChatGPT)': 'run_court_format_gpt.json',
        '士林地院家事服務中心格式(Claude)': 'run_court_format_claude.json',
        # ... 其他模板
    }
    
    base_config = base_config_map.get(template, 'run.json')
    
    # 如果有選擇特定段落，使用客製化配置
    if selected_sections:
        return generate_custom_config(base_config, selected_sections)
    
    return base_config

def generate_custom_config(base_config: str, selected_sections: list) -> str:
    """動態生成包含選定段落的配置文件"""
    with open(base_config, 'r', encoding='utf-8') as f:
        config = json.load(f)
    
    # 根據 selected_sections 修改 prompt template
    config['steps'][0]['template'] = modify_prompt_for_sections(
        config['steps'][0]['template'], 
        selected_sections
    )
    
    # 保存為臨時配置文件
    custom_config_path = f"temp_config_{uuid.uuid4().hex}.json"
    with open(custom_config_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
    
    return custom_config_path
```

#### 新增處遇計畫配置
```json
// treatment_plan.json
{
  "input_file": "treatment_input.txt",
  "default_model_id": "openai_gpt-4o",
  "temperature": 0.3,
  "stream": true,
  "steps": [
    {
      "label": "treatment_plan_generation",
      "type": "chat",
      "template": "根據以下社工報告，生成專業的處遇計畫：\n\n{input}\n\n請按照以下格式生成：\n一、處遇目標\n二、處遇策略\n三、實施步驟\n四、預期成效"
    }
  ]
}
```

---

## 📊 完整資料流架構

### 資料流路徑圖
```
Step 1: 用戶輸入
   ↓ 
   前端: sessionStore.transcriptText
   
Step 2: 報告設定  
   ↓
   前端: sessionStore.reportConfig = { selectedTemplate, selectedSections }
   
Step 3: 報告生成
   ↓
   前端 → API: /api/run { text, template, selectedSections }
   ↓
   後端: 動態配置 → AI處理 → 流式返回
   ↓  
   前端: sessionStore.reportText
   
Step 4: 處遇計畫
   ↓
   前端 → API: /api/treatment-plan { reportContent, mainIssue }
   ↓
   後端: treatment_plan.py → AI處理 → 流式返回
   ↓
   前端: sessionStore.treatmentPlan
   
Step 5: 人物關係圖 (現有邏輯)
```

### 狀態管理詳細設計
```typescript
// stores/useSessionStore.ts 擴展
export const useSessionStore = defineStore('session', () => {
  // 現有狀態保持不變
  const transcriptText = ref('')
  const reportText = ref('')
  const personGraphJson = ref('')
  
  // 新增狀態
  const reportConfig = ref({
    selectedTemplate: '',
    selectedSections: [] as string[],
    customSettings: {} as Record<string, any>,
    isComplete: false
  })
  
  const treatmentPlan = ref({
    content: '',
    isGenerated: false,
    isEditing: false,
    generatedAt: null as Date | null
  })
  
  const currentStep = ref(1) // 1-5
  const stepValidation = ref([false, false, false, false, false])
  
  // 新增 actions
  const setReportConfig = (config: any) => {
    reportConfig.value = { ...reportConfig.value, ...config }
    // 自動驗證設定完整性
    reportConfig.value.isComplete = validateReportConfig()
    stepValidation.value[1] = reportConfig.value.isComplete
  }
  
  const setTreatmentPlan = (plan: any) => {
    treatmentPlan.value = { ...treatmentPlan.value, ...plan }
    stepValidation.value[3] = !!plan.content
  }
  
  const validateReportConfig = () => {
    return !!(reportConfig.value.selectedTemplate && 
             reportConfig.value.selectedSections.length > 0)
  }
  
  // 持久化設定
  return {
    // ... 現有 return
    reportConfig,
    treatmentPlan, 
    currentStep,
    stepValidation,
    setReportConfig,
    setTreatmentPlan
  }
}, {
  persist: {
    storage: localStorage,
    paths: ['transcriptText', 'reportText', 'reportConfig', 'treatmentPlan', 'currentStep']
  }
})
```

---

## ⚠️ 前後端配合風險點

### 1. API 參數相容性問題
**風險：** 新參數導致舊版本後端崩潰  
**解決方案：**
```python
# 後端防禦性編程
selected_sections = data.get('selectedSections', [])
if not selected_sections:
    # 如果沒有傳入 selectedSections，使用預設全部段落
    selected_sections = get_default_sections_for_template(template)
```

### 2. 流式資料格式不一致
**風險：** 處遇計畫 API 返回格式與報告生成不同  
**解決方案：**
```python
# 統一流式返回格式
def generate_stream_response(content_generator):
    for content in content_generator:
        yield json.dumps({"content": content}) + "\n"
```

### 3. 會話管理衝突
**風險：** 5個分頁同時訪問可能造成檔案衝突  
**解決方案：**
```python
# 為不同步驟使用不同檔案名
def get_step_specific_file(session_id: str, step: str) -> str:
    return os.path.join(TEMP_DIR, session_id, f"{step}_input.txt")
```

### 4. 配置檔案管理複雜
**風險：** 動態配置檔案過多，清理困難  
**解決方案：**
```python
# 定期清理臨時配置檔案
@app.route('/cleanup-temp-configs', methods=['POST'])
def cleanup_temp_configs():
    for file in glob.glob("temp_config_*.json"):
        if is_file_old(file, hours=1):
            os.remove(file)
```

---

## 🚀 快速實施檢查清單

### 前端修改 (60分鐘)
- [ ] **擴展狀態管理** (15分鐘)
  - 修改 `useSessionStore.ts` 新增4個狀態欄位
  - 新增對應的 setter functions
  - 更新 persist 配置

- [ ] **修改分頁容器** (10分鐘)  
  - 修改 `DashboardPanel.vue` 為5個 TabPanel
  - 新增分頁存取控制邏輯
  - 新增2個 slot 定義

- [ ] **建立新頁面** (30分鐘)
  - 建立 `ReportConfigPanel.vue` 基本架構
  - 建立 `TreatmentPlanEditor.vue` 基本架構
  - 在 `HomeView.vue` 中整合新組件

- [ ] **修改 API 調用** (5分鐘)
  - 修改 `generateReportStream` 傳遞新參數
  - 新增 `generateTreatmentPlan` API 調用

### 後端修改 (40分鐘)
- [ ] **修改現有端點** (15分鐘)
  - 修改 `/api/run` 接收新參數
  - 實作 `get_config_with_sections` 邏輯
  - 確保向下相容性

- [ ] **新增處遇計畫端點** (20分鐘)
  - 新增 `/api/treatment-plan` 端點
  - 建立 `treatment_plan.py` 腳本
  - 建立 `treatment_plan.json` 配置檔案

- [ ] **測試與驗證** (5分鐘)
  - 測試新舊 API 都能正常工作
  - 驗證流式回傳格式一致性

### 資料配置 (20分鐘)
- [ ] **報告段落配置** (10分鐘)
  - 建立 9大類段落定義資料
  - 設定段落與模板的對應關係

- [ ] **處遇計畫 Prompt** (10分鐘)
  - 設計處遇計畫生成 Prompt
  - 測試生成品質並調整

---

## 🔧 關鍵技術決策

### 1. API 設計策略
**選擇：** 擴展現有 API + 新增專用 API  
**原因：** 最小化對現有功能的影響，同時保持清晰的職責分離

### 2. 配置檔案管理
**選擇：** 動態生成 + 臨時檔案  
**原因：** 避免組合爆炸（5模板 × 9段落 = 45個配置檔案）

### 3. 狀態管理策略  
**選擇：** 擴展現有 store + 扁平化結構  
**原因：** 保持簡單，避免複雜的嵌套狀態管理

### 4. 分頁存取控制
**選擇：** 漸進式解鎖 + 自由跳轉  
**原因：** 平衡引導性和靈活性

---

## 🧪 測試重點

### 前後端接口測試
1. **API 相容性**：舊參數格式仍能正常工作
2. **新參數處理**：`selectedSections` 正確傳遞和處理  
3. **流式回傳**：處遇計畫 API 返回格式正確
4. **錯誤處理**：