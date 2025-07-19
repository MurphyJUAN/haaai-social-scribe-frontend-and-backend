# AI社工助手 5分頁升級實施檢查清單

## 📊 項目概況
- **目標**: 將現有3分頁系統升級為5分頁 (逐字稿 → 報告設定 → 報告初稿 → 處遇計畫 → 人物關係圖)
- **開始時間**: 2025-06-28
- **服務狀態**: 
  - ✅ 後端服務 (Flask): http://localhost:5000 - 運行中
  - ✅ 前端服務 (Vue): http://localhost:5173 - 運行中

## 🏗️ 系統架構現狀分析

### ✅ 已完成項目

#### 項目結構分析
- ✅ **前端架構檢查**: Vue 3 + TypeScript + Pinia + PrimeVue
- ✅ **後端架構檢查**: Flask + OpenAI + Anthropic APIs
- ✅ **5分頁容器**: DashboardPanel.vue 已包含5個TabPanel
- ✅ **狀態管理基礎**: useSessionStore.ts 基本架構存在
- ✅ **服務啟動**: 前後端服務已在背景運行

#### 現有功能評估
- ✅ **逐字稿處理**: 音頻上傳和文字輸入功能
- ✅ **報告生成**: 基於模板的AI報告生成 (/api/run)
- ✅ **人物關係圖**: 基於報告的關係圖生成
- ✅ **會話管理**: SessionID和文件管理系統

### 🔄 進行中項目

#### 當前工作
- 🔄 **檢查清單建立**: 正在完善詳細實施計畫

### ⏳ 待完成項目

## 📋 詳細實施計畫

### 階段一: 核心狀態管理擴展 (30分鐘)

#### 1. 擴展 useSessionStore.ts
- [ ] **新增報告設定狀態**
  ```typescript
  const reportConfig = ref({
    selectedTemplate: '',
    selectedSections: [] as string[],
    customSettings: {} as Record<string, any>,
    isComplete: false
  })
  ```
- [ ] **新增處遇計畫狀態**
  ```typescript
  const treatmentPlan = ref({
    content: '',
    isGenerated: false,
    isEditing: false,
    generatedAt: null as Date | null
  })
  ```
- [ ] **新增分頁控制狀態**
  ```typescript
  const currentStep = ref(1) // 1-5
  const stepValidation = ref([false, false, false, false, false])
  ```
- [ ] **新增對應的 action 函數**
  - setReportConfig()
  - setTreatmentPlan()
  - validateReportConfig()
- [ ] **更新持久化配置**
  - 新增 reportConfig, treatmentPlan, currentStep 到 persist paths

#### 2. 報告段落配置資料建立
- [ ] **建立 9大類段落定義**
  - 基本資料段落
  - 家庭狀況段落  
  - 經濟狀況段落
  - 健康狀況段落
  - 社會關係段落
  - 問題分析段落
  - 資源評估段落
  - 服務建議段落
  - 其他特殊段落
- [ ] **建立段落與模板對應關係**
- [ ] **建立選擇性段落配置文件**

### 階段二: 前端組件開發 (45分鐘)

#### 3. ReportConfigPanel.vue 組件
- [ ] **基本架構建立**
  - 模板選擇器 (Dropdown)
  - 段落選擇器 (MultiSelect)
  - 自訂設定區域
- [ ] **功能實現**
  - 模板變更時自動更新可選段落
  - 段落選擇驗證
  - 設定完整性檢查
- [ ] **UI/UX 設計**
  - 使用 PrimeVue 組件保持一致性
  - 響應式設計
  - 表單驗證提示

#### 4. TreatmentPlanEditor.vue 組件  
- [ ] **基本架構建立**
  - 處遇計畫顯示區域
  - 生成按鈕和進度指示
  - 編輯模式切換
- [ ] **功能實現**
  - 基於報告內容自動生成
  - 流式內容顯示
  - 手動編輯功能
  - 儲存和匯出功能
- [ ] **UI/UX 設計**
  - Markdown 或富文本編輯器
  - 生成進度動畫
  - 錯誤處理顯示

#### 5. 整合現有組件
- [ ] **HomeView.vue 修改**
  - 新增兩個組件的 slot 內容
  - 確保組件間資料流正確
- [ ] **導航邏輯更新**
  - 分頁間的跳轉控制
  - 完成狀態驗證

### 階段三: 後端API擴展 (40分鐘)

#### 6. 修改現有 /api/run 端點
- [ ] **參數擴展**
  ```python
  selected_sections = data.get('selectedSections', [])
  custom_settings = data.get('customSettings', {})
  ```
- [ ] **動態配置生成**
  - get_config_with_sections() 函數
  - generate_custom_config() 函數
  - 臨時配置文件管理
- [ ] **向下相容性保證**
  - 處理缺少新參數的情況
  - 預設段落選擇邏輯

#### 7. 新增 /api/treatment-plan 端點
- [ ] **端點基本架構**
  ```python
  @app.route('/api/treatment-plan', methods=['POST'])
  def generate_treatment_plan():
  ```
- [ ] **處理邏輯實現**
  - 接收報告內容和主述議題
  - 呼叫 treatment_plan.py 腳本
  - 流式回傳處理
- [ ] **錯誤處理和日誌**
  - 參數驗證
  - 異常捕獲
  - 操作日誌記錄

#### 8. 處遇計畫生成腳本
- [ ] **treatment_plan.py 腳本建立**
  - 命令列參數處理
  - 報告內容分析
  - AI API 呼叫邏輯
- [ ] **treatment_plan.json 配置**
  - Prompt 模板設計
  - AI 模型參數配置
  - 輸出格式定義

### 階段四: 前後端整合 (30分鐘)

#### 9. API 呼叫邏輯更新
- [ ] **修改現有 generateReportStream 函數**
  ```typescript
  const payload = {
    text: transcript,
    template: template,
    selectedSections: sessionStore.reportConfig.selectedSections,
    customSettings: sessionStore.reportConfig.customSettings,
    sessionId: sessionId.value
  }
  ```
- [ ] **新增 generateTreatmentPlan 函數**
  - API 呼叫邏輯
  - 流式資料處理
  - 錯誤處理機制

#### 10. 資料流整合
- [ ] **分頁間資料傳遞**
  - 逐字稿 → 報告設定
  - 報告設定 → 報告生成  
  - 報告內容 → 處遇計畫
  - 報告內容 → 人物關係圖
- [ ] **狀態同步確保**
  - Store 資料一致性
  - 本地存儲同步
  - 錯誤狀態處理

### 階段五: 測試與優化 (30分鐘)

#### 11. 功能測試
- [ ] **單元功能測試**
  - 各分頁獨立功能
  - API 端點回應
  - 資料驗證邏輯
- [ ] **整合測試**  
  - 完整流程測試
  - 跨分頁資料流
  - 錯誤情境處理
- [ ] **相容性測試**
  - 新舊功能共存
  - API 向下相容
  - 資料遷移驗證

#### 12. 效能與UX優化
- [ ] **載入效能優化**
  - 組件懶載入
  - API 回應時間
  - 大文件處理
- [ ] **使用者體驗改善**
  - 載入指示器
  - 錯誤訊息優化
  - 操作引導提示

#### 13. 部署準備
- [ ] **環境變數檢查**
- [ ] **配置文件驗證**
- [ ] **日誌設定完善**
- [ ] **安全設定檢查**

## 🚨 風險點與解決方案

### 技術風險
1. **API 參數相容性問題**
   - 風險: 新參數導致舊版本後端崩潰
   - 解決: 防禦性編程，預設值處理

2. **流式資料格式不一致**
   - 風險: 處遇計畫 API 返回格式與報告生成不同
   - 解決: 統一流式回傳格式

3. **會話管理衝突**
   - 風險: 5個分頁同時訪問可能造成檔案衝突
   - 解決: 為不同步驟使用不同檔案名

### 業務風險
1. **使用者流程中斷**
   - 風險: 升級過程中現有功能暫時不可用
   - 解決: 分階段部署，確保向下相容

2. **資料遺失風險**
   - 風險: Store 結構變更導致現有資料無法讀取
   - 解決: 資料遷移腳本，版本兼容處理

## 📈 進度追蹤

### 已完成 (14/15 項目)
- ✅ 項目結構分析
- ✅ 後端服務啟動  
- ✅ 前端服務啟動
- ✅ 5分頁容器確認
- ✅ 檢查清單建立
- ✅ Claude API Key 更新
- ✅ 狀態管理擴展 (useSessionStore.ts)
- ✅ 報告設定組件 (ReportConfigPanel.vue)
- ✅ 處遇計畫組件 (TreatmentPlanEditor.vue)
- ✅ 後端API修改 (/api/run 支援新參數)
- ✅ 處遇計畫API (/api/treatment-plan)
- ✅ 段落配置資料 (report_sections_config.json)
- ✅ 處遇計畫配置 (treatment_plan.json 使用 Claude)
- ✅ API整合 (前端組件已整合)

### 已完成 (15/15 項目)
- ✅ 測試驗證 - 後端動態prompt生成已部署，服務運行正常

### 新發現需調整項目 (7項)
- ✅ **必選項目設定** - 將關鍵議題設為必選 (高優先級) ✅ 已完成
  - ✅ 基本資料 (必選)
  - ✅ 個案概況/案件背景 (必選) 
  - ✅ 主述問題 (必選)
  - ✅ 安全風險評估 (必選)
  - ✅ 服務建議 (必選)

- ✅ **段落順序編排** - 按社工評估邏輯順序排列 (高優先級) ✅ 已完成
  - ✅ 21個議題按邏輯順序編號 (一、二、三...)
  - ✅ 8大分類按評估流程排序
  - ✅ 自動排序顯示功能

### 基於架構文件發現的新需求 (4項)
- ⚠️ **評估議題缺失** - 需新增專業評估段落 (高優先級)
  - 個案需求與期待
  - 家庭功能評估
  - 整體評估建議

- ⚠️ **人物關係圖整合** - 與個案概況的結構整合 (中優先級)
  - 個案概況應包含人物關係圖子項目
  - 自動從報告生成人物關係圖

- ⚠️ **處遇計畫結構調整** - 符合標準格式 (中優先級)
  - 處遇目標、處遇策略、實施步驟、預期成效
  - 根據社工服務領域動態調整建議

- ⚠️ **段落式格式優化** - 改善條列式輸出 (低優先級)
  - ✅ 已完成段落式prompt優化
  - 持續改善輸出格式品質

- ⚠️ **議題架構優化** - 增加遺漏的重要評估項目 (中優先級)
  - 新增：個案概況 (案件背景、轉介來源、接案原因)
  - 新增：風險評估 (使用標準化評估工具)
  - 新增：資源盤點 (現有資源詳細清單)
  - 調整：將「個案概況」從現有「家庭狀況」中分離

- ⚠️ **分類結構調整** - 更符合社工實務標準 (中優先級)
  - 重新分類：基礎資訊類 (基本資料 + 個案概況)
  - 重新分類：風險評估類 (安全風險 + 風險評估工具)
  - 重新分類：介入計畫類 (目標設定 + 服務規劃)

- ⚠️ **專業驗證機制** - 確保報告完整性 (中優先級)
  - 動態必選邏輯 (根據服務領域調整必選項目)
  - 報告品質檢核 (完整性與專業性驗證)

- ⚠️ **模板專業化** - 針對不同服務領域 (低優先級)
  - 兒童與少年保護模板
  - 家庭暴力案件模板
  - 老人長照評估模板
  - 身心障礙服務模板

- ⚠️ **使用者體驗優化** - 提升操作便利性 (低優先級)
  - 快速選擇按鈕 (基本配置、完整配置、專業推薦)
  - 智能提示 (根據選擇的議題提供相關建議)
  - 預覽功能 (顯示將生成的報告結構)

- ⚠️ **國際化與在地化** - 符合台灣社工實務 (低優先級)
  - 台灣社工倫理守則對應
  - 法規要求檢核 (如兒權法、家暴法等)
  - 在地資源清單整合

## 🚀 新功能規劃

### Canvas家庭關係圖重構 (高優先級)
- 📅 **規劃時間**: 2025-07-03
- ⏱️ **預估工作量**: 4-5個工作天 (33小時)
- 🎯 **目標**: 將現有FamilyTree.js家庭關係圖替換為更簡潔的Canvas繪圖版本

#### 📋 實施計畫
**階段一：前端Canvas組件開發 (26小時)**
- [ ] **Canvas組件包裝** (8小時)
  - 創建 `CanvasFamilyTreeGraph.vue` 組件
  - 移植tree.html的Canvas繪圖邏輯到Vue
  - 適配Vue生命週期和響應式系統
  
- [ ] **事件處理整合** (4小時)
  - Canvas點擊事件與Vue事件系統整合
  - 滑鼠拖拽功能適配Vue組件
  - 鍵盤輸入事件處理

- [ ] **UI介面整合** (4小時)
  - 保留現有對話框格式和prompt提示
  - 整合編輯按鈕到Vue組件架構
  - 維持一致的使用者體驗

- [ ] **響應式設計** (4小時)
  - Canvas尺寸自適應容器
  - 支援行動裝置觸控操作
  - 不同螢幕尺寸下的佈局優化

- [ ] **測試與除錯** (6小時)
  - 功能完整性測試
  - 跨瀏覽器相容性測試
  - 效能優化和記憶體管理

**階段二：後端數據格式調整 (7小時)**
- [ ] **數據格式轉換** (3小時)
  - 修改 `family_graph.json` 輸出格式
  - 從FamilyTree.js格式轉換為Canvas Node格式
  - 建立格式對應mapping

- [ ] **prompt微調** (2小時)
  - 調整AI生成的數據結構
  - 確保Canvas所需的屬性完整
  - 測試不同案例的生成效果

- [ ] **API整合測試** (2小時)
  - 前後端數據流測試
  - 錯誤處理機制驗證
  - 效能測試和優化

#### 🎨 視覺設計特點
- **人物表示**: 圓形(女性)、方形(男性)
- **狀態標記**: X標記(死亡)、特殊圖案(案主)
- **關係連線**: 自動佈局的家族樹結構
- **交互操作**: 點擊選擇、拖拽移動、按鈕編輯

#### 📊 技術優勢
- **效能提升**: 原生Canvas繪圖，無第三方套件依賴
- **視覺簡潔**: 更直觀的家族樹表示方式
- **客製化強**: 完全可控的繪圖邏輯和樣式
- **維護性佳**: 減少外部依賴，降低維護成本

#### 🔧 技術架構
```
現有: Vue 3 + FamilyTree.js → AI後端
新版: Vue 3 + Canvas組件 → AI後端(格式調整)
```

#### 📈 預期成果
- 更簡潔清晰的家庭關係圖視覺效果
- 保持現有對話編輯功能和prompt提示
- 提升系統效能和使用者體驗
- 降低第三方套件依賴風險

---

## 💻 開發環境資訊

### 服務端點
- **前端**: http://localhost:5173
- **後端**: http://localhost:5000
- **API文檔**: http://localhost:5000/api/

### Python環境設定
- **Conda環境**: visit_report_automation
- **環境路徑**: `/Users/leoluonew/opt/anaconda3/envs/visit_report_automation`
- **啟動命令**: `source /Users/leoluonew/opt/anaconda3/bin/activate visit_report_automation`

### 關鍵文件路徑
- **前端Store**: `/frontend/src/stores/useSessionStore.ts`
- **分頁容器**: `/frontend/src/components/Dashboard/DashboardPanel.vue`
- **後端主檔**: `/backend/app.py`
- **配置目錄**: `/backend/*.json`

### 開發工具
- **前端**: Vue 3 + TypeScript + Vite
- **後端**: Flask + Python (visit_report_automation環境)
- **AI APIs**: OpenAI + Anthropic Claude
- **UI框架**: PrimeVue

### 服務啟動確認
- ✅ **前端服務**: 使用 `npm run dev` 已在背景運行
- ✅ **後端服務**: 使用 visit_report_automation 環境已在背景運行

---
*最後更新: 2025-06-28*
*下次檢查: 待項目完成*