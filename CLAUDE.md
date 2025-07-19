# Canvas家庭關係圖系統開發檢查清單

## 環境設定
- [x] 使用visit_report_automation環境 (`/Users/leoluonew/opt/anaconda3/envs/visit_report_automation`)

## 後端API開發
### 獨立腳本設計
- [x] 創建獨立的`family_graph_chat.py`腳本（不與person_graph_chat.py混合）
- [x] 修改`api/graph_routes.py`根據graphType選擇不同的腳本和配置
- [x] 確保家庭關係圖和人物關係圖使用完全分離的後端處理

### Canvas格式生成
- [x] 修復`family_graph_chat.py`的流式輸出問題
- [x] 確保生成Canvas陣列格式`[{...}]`而不是vis.js格式`{"nodes":[...], "edges":[...]}`
- [x] 修復family_graph_chat.json的prompt讓AI先回應再輸出JSON
- [x] 解決「AI正在思考」後無回應的問題

### 複雜家庭關係支援
- [x] 增強`family_graph_chat.json` prompt支援複雜家庭關係：
  - [x] 離婚再婚（前配偶vs現任配偶）
  - [x] 繼親關係（繼父母、生父母）
  - [x] 多代關係（祖父母、父母、子女、孫輩）
  - [x] 兄弟姊妹關係
  - [x] 收養關係
  - [x] 存歿狀態管理（存/歿）
  - [x] 居住狀況管理（同居/分居）

### 關係引用一致性
- [x] 確保father_id對應到實際存在的男性節點
- [x] 確保mother_id對應到實際存在的女性節點  
- [x] 確保couple_id對應到實際存在的節點且互相配對
- [x] 避免產生孤立節點或無效引用

## 前端UI開發
### 組件統一設計
- [x] 統一FamilyGraphChat前端UI與PersonGraphChat一致
- [x] 使用統一的PersonGraphChat組件處理兩種圖表類型
- [x] 移除重複的FamilyGraphChat組件

### 對話暫存分離
- [x] 分離人物關係圖和家庭關係圖的對話暫存
- [x] 使用`chatHistory_${graphType}_${sessionId}`作為存儲key
- [x] 實現切換圖表類型時自動載入對應的對話歷史

### 快速指令客製化
- [x] 簡化快速操作建議為簡單的分類prompt
- [x] 為人物關係圖和家庭關係圖提供不同的預設快速指令：
  - 家庭關係圖：基於逐字稿重新生成、突出血緣婚姻關係、新增配偶父母、修改年齡狀態
  - 人物關係圖：基於逐字稿重新生成、簡化關係、加強連結、突出衝突關係、添加遺漏人物、重組結構

## Canvas繪圖系統
### 數據流轉修復
- [x] 添加前端調試信息追蹤數據更新問題
- [x] 確認PersonGraphChat正確更新Store
- [x] 確認PersonGraphViewer正確解析數據
- [x] 確認CanvasFamilyTreeGraph接收數據並重新繪製

### 連線繪製修復
- [x] 參考`/Users/leoluonew/Downloads/tree.html`的正確實現
- [x] 修復Canvas連線邏輯：
  - [x] 實現正確的夫妻關係線（DrawCoupleLine）
  - [x] 實現正確的親子關係線（DrawChildrenLine）
  - [x] 線條從父母中間延伸出子女，而不是單獨個人延伸
  - [x] 父母中間往下的垂直線連接子女橫線
  - [x] 每個子女的垂直連線到子女橫線

### 繪圖邏輯優化
- [x] 分離drawCoupleLine和drawChildrenLine函數
- [x] 按照tree.html的座標計算方式：
  - 夫妻線：nodeVerticalDistance * 2/7
  - 子女線：nodeVerticalDistance * 5/8  
  - 父母中心點計算：(coupleX + nodeX) / 2
- [x] 添加詳細的繪製過程調試信息

## 測試驗證
### 基本功能測試
- [x] 測試Canvas格式對話功能
- [x] 測試簡單家庭關係操作（新增配偶、父母、修改年齡）
- [x] 驗證數據正確從API傳遞到前端並更新顯示

### 複雜關係測試
- [ ] 測試離婚再婚情況
- [ ] 測試多代家庭結構
- [ ] 測試兄弟姊妹關係
- [ ] 測試繼親和收養關係
- [ ] 測試存歿狀態和居住安排

### Canvas繪圖驗證
- [x] 驗證連線繪製邏輯修復
- [ ] 測試複雜家庭結構的連線正確性
- [ ] 驗證父母中間延伸子女的連線模式

## 系統功能調整
### 報告配置UI重新設計
- [x] 重新設計ReportConfigPanel.vue段落選擇UI：
  - [x] 將必選段落顯示為上方說明文字（主要議題、個案概況、安全評估、需求評估）
  - [x] 將自選段落顯示為下方勾選項目
  - [x] 使用Tab分頁組織內容結構
- [x] 移除自定義設定功能完整相關代碼
- [x] 移除自動生成關係圖設定選項

### 處遇計畫編輯器優化
- [x] 修改處遇計畫重新整理按鈕行為：
  - [x] 從自動重新生成改為顯示配置區域供用戶修改
  - [x] 用戶需手動點擊發送才重新生成
- [x] 移除主要議題文本框和案件類型下拉選單
- [x] 簡化驗證邏輯，不再要求主要議題必填

### 家庭關係圖功能移除
- [x] 修改PersonGraphViewer.vue移除家庭關係圖支援
  - [x] 移除CanvasFamilyTreeGraph組件導入和使用
  - [x] 更新props接口只接受'person'類型
  - [x] 移除parsedFamilyData計算屬性
- [x] 修改PersonGraphChat.vue移除家庭關係圖支援
  - [x] 更新props只支援'person'類型
  - [x] 移除家庭關係圖相關快速指令
  - [x] 簡化currentGraphJson直接使用personGraphJson
  - [x] 更新歡迎訊息只提及人物關係圖
  - [x] 修改store更新邏輯使用setPersonGraphJson
- [x] 修改personGraphStore.ts移除家庭關係圖狀態管理
  - [x] 移除所有家庭關係圖相關的狀態和方法
  - [x] 簡化store只保留人物關係圖功能
  - [x] 更新本地存儲持久化配置
- [x] 修改其他組件的家庭關係圖引用
  - [x] PersonGraphEditor.vue：移除家庭關係圖切換功能，固定為通用關係圖
  - [x] ReportConfigPanel.vue：移除家庭關係圖自動生成功能
  - [x] GraphTestView.vue：移除家庭關係圖測試功能和選項
- [x] 移除家庭關係圖組件文件
  - [x] 刪除FamilyGraphChat.vue組件
  - [x] 刪除FamilyTreeGraph.vue組件
  - [x] 刪除CanvasFamilyTreeGraph.vue組件
  - [x] 刪除family-tree目錄
- [x] 移除後端家庭關係圖相關文件和API路由
  - [x] 修改graph_routes.py移除家庭關係圖API邏輯
  - [x] 刪除family_graph.json和family_graph_chat.json配置文件
  - [x] 刪除測試文件：test_family_format.txt、test_family_input.txt
  - [x] 刪除文檔：FAMILYTREE_INTEGRATION_GUIDE.md
  - [x] 清理temp_sessions目錄中的family_graph相關臨時文件
  - [x] 移除test_graph_functionality.py中的家庭關係圖測試功能

### 處遇計畫功能調整
- [x] 移除處遇計畫編輯器中的報告摘要功能
  - [x] 刪除TreatmentPlanEditor.vue中的報告摘要UI顯示區塊
  - [x] 移除reportSummary計算屬性及相關邏輯
  - [x] 簡化處遇計畫編輯器界面，專注於核心功能

### 開發者文檔建立
- [x] 創建綜合性DEVELOPER_GUIDE.md開發者指南
  - [x] 包含9個主要章節：專案概述、前後端架構、核心模組、環境設定、API整合、部署指南、開發流程、故障排除
  - [x] 詳細記錄完整系統架構和組件說明
  - [x] 提供新開發者快速上手的技術文檔
  - [x] 包含配置文件、API端點、開發最佳實踐說明

### 報告初稿UI優化
- [x] 為ReportEditor.vue添加「下一步：處遇計畫」按鈕
  - [x] 在下載按鈕旁邊添加下一步按鈕
  - [x] 實現hasValidReport計算屬性驗證報告狀態
  - [x] 添加goToTreatmentPlan方法實現頁面跳轉
  - [x] 按鈕僅在報告生成完成且有內容時才啟用
  - [x] 調整按鈕顏色配置：下載按鈕為藍色、處遇計畫按鈕為黃色，與其他頁面保持一致
  - [x] 改為ReportConfigPanel相同的布局模式：
    - [x] 左側狀態指示（完成/未完成 + 圖示）
    - [x] 右側操作按鈕（下載報告為次要按鈕、下一步為主要按鈕）
    - [x] 使用PrimeVue Button組件和統一的間距布局

## 已知問題和後續改進
- [ ] 進一步優化複雜關係的視覺化呈現
- [ ] 考慮添加節點拖拽和編輯功能
- [ ] 優化大型家庭樹的佈局演算法
- [ ] 添加關係圖匯出功能

## 今日工作總結（2025-07-17）

### 完成的主要任務：

1. **完整移除家庭關係圖功能**
   - ✅ 前端所有家庭關係圖相關組件和代碼已移除
   - ✅ 後端家庭關係圖API、配置文件、測試代碼已移除
   - ✅ Store狀態管理已簡化，只保留人物關係圖功能
   - ✅ 所有UI組件已調整為只支援通用關係圖

2. **移除處遇計畫報告摘要功能**
   - ✅ TreatmentPlanEditor.vue中的報告摘要顯示已移除
   - ✅ 相關計算屬性和邏輯已清理
   - ✅ 處遇計畫編輯器界面更加簡潔

3. **開發者文檔建立**
   - ✅ 創建綜合性DEVELOPER_GUIDE.md開發者指南
   - ✅ 包含完整系統架構說明和技術文檔
   - ✅ 提供新開發者快速上手指南

4. **報告初稿UI優化**
   - ✅ 為ReportEditor.vue添加「下一步：處遇計畫」按鈕
   - ✅ 實現簡單的頁面跳轉功能
   - ✅ 按鈕狀態驗證和樣式設計
   - ✅ 改為ReportConfigPanel相同的布局模式和按鈕配置

5. **Git提交記錄**
   - ✅ 所有變更已分別提交到前端和後端倉庫
   - ✅ 提交訊息包含詳細的變更說明
   - ✅ 每次變更都有對應的git push操作
   - ✅ DEVELOPER_GUIDE.md已提交到版本控制

### 系統現狀：
- 前端：只保留通用人物關係圖功能，UI更加簡潔
- 後端：移除不完整的家庭關係圖實現，API更加穩定
- 處遇計畫：專注於核心編輯功能，移除不必要的摘要顯示

### 安全性確認：
- 所有刪除操作都經過仔細檢查，確保不破壞現有功能
- 人物關係圖功能完全保留且正常運作
- 報告生成、處遇計畫等核心功能不受影響

---
*檢查清單最後更新：2025-07-17*