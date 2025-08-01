<template>
  <div class="report-config-panel p-6">
    <!-- 頁面標題 -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">記錄設定</h2>
      <p class="text-gray-600">選擇需要生成的記錄段落</p>
    </div>

    <!-- 段落選擇區域 -->
    <Card class="mb-6">
      <template #title>
        <span class="flex items-center gap-2">
          <i class="pi pi-list text-green-600"></i>
          段落選擇
        </span>
      </template>
      <template #content>
        <div class="space-y-6">
          <!-- 預設包含段落說明 -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center gap-2 mb-3">
              <i class="pi pi-info-circle text-blue-600"></i>
              <h4 class="font-medium text-blue-800">以下段落將預設包含在記錄中</h4>
            </div>
            <p class="text-sm text-blue-700 mb-4">
              基於基本資訊整理需求與潛在安全性問題評估，以下段落為社工訪視記錄必要內容，系統將自動包含。
            </p>
            
            <!-- 按段落分組顯示 -->
            <div class="space-y-4">
              <!-- 一、主述議題 -->
              <div class="bg-white border border-blue-100 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-2">
                  <i class="pi pi-exclamation-triangle text-blue-600"></i>
                  <h5 class="font-medium text-blue-800">一、主述議題</h5>
                </div>
                <p class="text-xs text-blue-700 mb-2">建立案件基本脈絡，確保服務導向正確</p>
                <div class="space-y-1">
                  <div v-for="section in getRequiredSectionsByGroup('main')" :key="section.value" class="text-sm text-blue-800 pl-4">
                    {{ section.name }}
                  </div>
                </div>
              </div>
              
              <!-- 二、個案概況 -->
              <div class="bg-white border border-blue-100 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-2">
                  <i class="pi pi-users text-blue-600"></i>
                  <h5 class="font-medium text-blue-800">二、個案概況</h5>
                </div>
                <p class="text-xs text-blue-700 mb-2">完整了解家庭結構與背景，為後續評估奠定基礎</p>
                <div class="space-y-1">
                  <div v-for="section in getRequiredSectionsByGroup('case_overview')" :key="section.value" class="text-sm text-blue-800 pl-4">
                    {{ getSectionDisplayName(section.name) }}
                  </div>
                </div>
              </div>
              
              <!-- 三、個案狀況 - 人身安全 -->
              <div class="bg-white border border-blue-100 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-2">
                  <i class="pi pi-shield text-blue-600"></i>
                  <h5 class="font-medium text-blue-800">三、個案狀況 - 人身安全</h5>
                </div>
                <p class="text-xs text-blue-700 mb-2">風險評估必要項目，確保服務對象安全</p>
                <div class="space-y-1">
                  <div v-for="section in getRequiredSectionsByGroup('safety')" :key="section.value" class="text-sm text-blue-800 pl-4">
                    {{ getSectionDisplayName(section.name) }}
                  </div>
                </div>
              </div>
              
              <!-- 四、需求與評估 -->
              <div class="bg-white border border-blue-100 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-2">
                  <i class="pi pi-chart-line text-blue-600"></i>
                  <h5 class="font-medium text-blue-800">四、需求與評估</h5>
                </div>
                <p class="text-xs text-blue-700 mb-2">專業評估與服務規劃，確保介入有效性</p>
                <div class="space-y-1">
                  <div v-for="section in getRequiredSectionsByGroup('assessment')" :key="section.value" class="text-sm text-blue-800 pl-4">
                    {{ getSectionDisplayName(section.name) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 額外選擇段落 -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <i class="pi pi-plus-circle text-gray-600"></i>
              <h4 class="font-medium text-gray-800">三、個案狀況 - 其他評估項目</h4>
              <span class="text-sm text-gray-500">（可依個案需求選擇）</span>
            </div>
            <p class="text-sm text-gray-600 mb-4">
              社工可依據個案特性與服務需求，選擇適合的評估面向進行深入了解。
            </p>
            
            <!-- 全選/取消全選 (僅針對可選項目) -->
            <div class="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
              <Checkbox 
                v-model="selectAllOptional" 
                :binary="true"
                @change="onSelectAllOptionalChange"
              />
              <label class="font-medium text-gray-700">全選其他評估項目</label>
            </div>
            
            <!-- 按分類顯示可選段落選項 -->
            <div class="space-y-6">
              <div v-for="category in optionalCategories" :key="category" class="border rounded-lg p-4 bg-gray-50">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="font-medium text-gray-800">{{ category }}</h4>
                  <Button
                    :label="isCategorySelected(category) ? '取消全選' : '全選'"
                    @click="toggleCategory(category)"
                    class="p-button-text p-button-sm"
                    size="small"
                  />
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div 
                    v-for="section in getSectionsForCategory(category)" 
                    :key="section.value"
                    class="flex items-start gap-3 p-3 border rounded-lg transition-colors bg-white hover:bg-gray-50 cursor-pointer"
                    @click="toggleSection(section.value)"
                  >
                    <Checkbox 
                      v-model="selectedSections" 
                      :value="section.value"
                      @change="onSectionChange"
                      class="mt-1"
                      :binary="false"
                    />
                    <div class="flex-1 min-w-0">
                      <label class="text-sm font-medium cursor-pointer block flex items-center gap-2 text-gray-800">
                        <i :class="[section.icon, 'text-gray-600']"></i>
                        {{ section.name }}
                      </label>
                      <p class="text-xs mt-1 line-clamp-2 text-gray-600">
                        {{ section.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>



    <!-- 操作按鈕 -->
    <div class="flex justify-between items-center pt-4 border-t">
      <div class="text-sm text-gray-500">
        <span v-if="configValidation.isValid" class="text-green-600 flex items-center gap-1">
          <i class="pi pi-check-circle"></i>
          設定完成，可以生成記錄
        </span>
        <span v-else class="text-orange-600 flex items-center gap-1">
          <i class="pi pi-exclamation-triangle"></i>
          {{ configValidation.message }}
        </span>
      </div>
      
      <div class="flex gap-3">
        <Button 
          label="重置設定" 
          icon="pi pi-refresh" 
          severity="secondary" 
          @click="resetConfig"
          outlined
        />
        <Button 
          label="下一步：生成記錄" 
          icon="pi pi-arrow-right" 
          :disabled="!configValidation.isValid"
          @click="proceedToReport"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import { useSessionStore } from '@/stores/useSessionStore'
import { usePersonGraphStore } from '@/stores/modules/personGraphStore'
import { storeToRefs } from 'pinia'
import { trackAPICall } from '@/utils/analytics'

// JSON 清理函數
const cleanJsonContent = (content: string): string => {
  // 移除 markdown 代碼塊標記
  content = content.replace(/```json\s*/gmi, '')
  content = content.replace(/```\s*$/gm, '')
  
  // 嘗試找到 JSON 內容的開始和結束
  // 對於數組格式 [...]
  const arrayMatch = content.match(/(\[.*\])/s)
  if (arrayMatch) {
    return arrayMatch[1].trim()
  }
  
  // 對於對象格式 {...}
  const objectMatch = content.match(/(\{.*\})/s)
  if (objectMatch) {
    return objectMatch[1].trim()
  }
  
  // 如果都找不到，返回原內容
  return content.trim()
}

const sessionStore = useSessionStore()
const personGraphStore = usePersonGraphStore()
const { transcriptText, reportText, sessionId, autoGeneratePersonGraph } = storeToRefs(sessionStore)
// 移除家庭關係圖相關引用

// 預設模板
const DEFAULT_TEMPLATE = '通用社工評估記錄'

// 通用議題選項 - 按照社工訪視紀錄標準架構
const availableSections = ref([
  // === 必須顯示項目 ===
  { 
    name: '一、主述議題', 
    value: 'main_issue', 
    description: '求助者的身分、求助方式、求助問題',
    category: '必須項目',
    icon: 'pi-exclamation-triangle',
    required: true,
    order: 1
  },
  
  // === 二、個案概況 (必須顯示) ===
  { 
    name: '二、個案概況 - (一)家庭狀況', 
    value: 'case_family_situation', 
    description: '家庭人員的組成（結構、年齡）、家人的相處模式（關係）、教育程度、婚姻關係、家庭的權力結構、經濟狀況、就業情形、財產分配或收入、重大事件、居住環境',
    category: '個案概況(必須)',
    icon: 'pi pi-home',
    required: true,
    order: 2
  },
  { 
    name: '二、個案概況 - (二)子女狀況', 
    value: 'case_children_situation', 
    description: '子女生活或教育上的問題、教養的問題、親子關係、過往照顧的狀況、是否有特殊疾病或狀況等',
    category: '個案概況(必須)',
    icon: 'pi pi-baby',
    required: true,
    order: 3
  },
  { 
    name: '二、個案概況 - (三)人物關係圖', 
    value: 'case_relationship_chart', 
    description: '家庭成員及重要他人的關係網絡圖，將另開分頁顯示AI生成結果',
    category: '個案概況(必須)',
    icon: 'pi pi-sitemap',
    required: true,
    order: 4
  },

  // === 三、個案狀況 (可複選) ===
  { 
    name: '三、個案狀況 - (一)法律相關狀況', 
    value: 'legal_status', 
    description: '是否有訴訟(如民事離婚、保護令、暫時處份、強制執行、刑事案件-家暴、妨害性自主、法律爭議、法院未成年子女相關訴訟(如酌定親權-監護權、會面交往、給付扶養)、是否有犯罪服刑、涉及家庭暴力...等等',
    category: '個案狀況(可選)',
    icon: 'pi pi-balance-scale',
    order: 5
  },
  { 
    name: '三、個案狀況 - (二)經濟或財務狀況', 
    value: 'economic_financial_status', 
    description: '主要收入來源、主要經濟提供者、是否有人身保險、是否負債、個案謀生能力、主要花費負擔',
    category: '個案狀況(可選)',
    icon: 'pi pi-money-bill',
    order: 6
  },
  { 
    name: '三、個案狀況 - (三)人身或安全狀況', 
    value: 'safety_security_status', 
    description: '是否具有攻擊風險、訪視時應注意事項、是否有家暴或受虐可能、是否有家人間的性騷擾或性侵害、是否擔心受害、是否有人身安全問題、是否需要搬離住所或聯繫當地警局協助等',
    category: '個案狀況(可選)',
    icon: 'pi pi-shield',
    required: true, // 安全狀況應為必選
    order: 7
  },
  { 
    name: '三、個案狀況 - (四)心理或情緒狀況', 
    value: 'psychological_emotional_status', 
    description: '個案或其家人的人格特質、情緒穩定度、訪視的態度、身心狀況、是否有諮商或看精神科（或疾病史）、是否有自我傷害傾向、重大壓力事件',
    category: '個案狀況(可選)',
    icon: 'pi pi-brain',
    order: 8
  },
  { 
    name: '三、個案狀況 - (五)教養或教育狀況', 
    value: 'parenting_education_status', 
    description: '個案或其家庭的親職能力、親職教養上的困難、孩子接受課後照顧或補習情形、孩子學業成績表現、學校中的師生關係、孩子與同儕的關係或互動、學業壓力',
    category: '個案狀況(可選)',
    icon: 'pi pi-book',
    order: 9
  },
  { 
    name: '三、個案狀況 - (六)早療或幼兒狀況', 
    value: 'early_intervention_childcare_status', 
    description: '個案與配偶之間的互動頻率、彼此情感支持狀況、家務責任分工、與孩子互動的頻率與深度、是否有隔代教養的問題、孩子與祖父母的情感關係、教養因應問題的策略或技巧',
    category: '個案狀況(可選)',
    icon: 'pi pi-heart',
    order: 10
  },
  { 
    name: '三、個案狀況 - (七)醫療或生理狀況', 
    value: 'medical_physical_status', 
    description: '個案或其家人的罹病與診治史、對疾病的認識與態度、是否有長期用藥、是否具有身心障礙資格或有重大傷病卡、是否有慢性疾病或有重大疾病，服藥穩定度、對醫療的期待、醫療團隊的評估',
    category: '個案狀況(可選)',
    icon: 'pi pi-heart',
    order: 11
  },
  { 
    name: '三、個案狀況 - (八)支持系統或狀況', 
    value: 'support_system_status', 
    description: '支持系統(正式系統、非正式系統)、主要照顧者、是否有委任律師、資源使用的能力、經常請教討論的對象、這些支持系統或支持者所提供的訊息或協助',
    category: '個案狀況(可選)',
    icon: 'pi pi-users',
    order: 12
  },
  { 
    name: '三、個案狀況 - (九)文化與傳統狀況', 
    value: 'cultural_traditional_status', 
    description: '國籍(若非台灣國籍)、民族(若非漢族)、宗教信仰背景、與台灣主流文化不同的生活習慣、生活價值觀、生活適應問題、語言溝通問題、與遠地或國外家人的關係',
    category: '個案狀況(可選)',
    icon: 'pi pi-globe',
    order: 13
  },

  // === 四、需求與評估 (AI生成) ===
  { 
    name: '四、需求與評估 - (一)個案需求與期待', 
    value: 'case_needs_expectations', 
    description: '個案對目前狀況的想法或規劃、所表達的需求、根據過往經驗而希望改進的地方、陪同或喘息的需求、希望能解決的問題、期待從政府或相關單位得到的資源或協助',
    category: '需求與評估',
    icon: 'pi pi-flag',
    required: true,
    order: 14
  },
  { 
    name: '四、需求與評估 - (二)家庭功能評估', 
    value: 'family_function_assessment', 
    description: '從專業且資深的社工角度，評估個案家庭功能的優勢處、劣勢處、目前的危機、未來可改變的機會',
    category: '需求與評估',
    icon: 'pi pi-chart-line',
    required: true,
    order: 15
  },
  { 
    name: '四、需求與評估 - (三)整體評估建議', 
    value: 'overall_assessment_recommendations', 
    description: '從專業且資深的社工角度，評估個案目前的能動性、主要需要解決的問題、可能需要立即協助的需求、需要長期陪伴的需求、需要搭配其他單位資源的需求等等。儘量從不同面向完整提供，避免遺漏。',
    category: '需求與評估',
    icon: 'pi pi-cog',
    required: true,
    order: 16
  }
])


// 響應式狀態
const selectedSections = ref<string[]>([])
const selectAll = ref(false)
const selectAllOptional = ref(false)

// 計算屬性 - 只顯示可選分類
const optionalCategories = computed(() => {
  // 只顯示非必選的分類
  const categoryOrder = [
    '個案狀況(可選)'
  ]
  
  const cats = [...new Set(availableSections.value
    .filter(s => !s.required)
    .map(s => s.category)
  )]
  
  // 按預定義順序排序，未定義的放在最後
  return cats.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a)
    const indexB = categoryOrder.indexOf(b)
    
    if (indexA === -1 && indexB === -1) return a.localeCompare(b)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })
})

// 取得必選段落
const getRequiredSections = () => {
  return availableSections.value
    .filter(section => section.required)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}

// 按組別取得必選段落
const getRequiredSectionsByGroup = (group: string) => {
  const groupMapping = {
    'main': ['必須項目'],
    'case_overview': ['個案概況(必須)'],
    'safety': ['個案狀況(可選)'], // 人身安全在個案狀況分類中但是必選
    'assessment': ['需求與評估']
  }
  
  const targetCategories = groupMapping[group] || []
  
  return availableSections.value
    .filter(section => {
      if (group === 'safety') {
        // 特別處理人身安全項目
        return section.value === 'safety_security_status' && section.required
      }
      return section.required && targetCategories.includes(section.category)
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0))
}

// 取得段落顯示名稱，移除重複的主分類標題
const getSectionDisplayName = (fullName: string) => {
  // 移除 "二、個案概況 - " 前綴，只保留子項目名稱
  if (fullName.includes('二、個案概況 - ')) {
    return fullName.replace('二、個案概況 - ', '')
  }
  // 移除 "三、個案狀況 - " 前綴，只保留子項目名稱
  if (fullName.includes('三、個案狀況 - ')) {
    return fullName.replace('三、個案狀況 - ', '')
  }
  // 移除 "四、需求與評估 - " 前綴，只保留子項目名稱
  if (fullName.includes('四、需求與評估 - ')) {
    return fullName.replace('四、需求與評估 - ', '')
  }
  return fullName
}

const configValidation = computed(() => {
  // 檢查必選項目
  const requiredSections = availableSections.value
    .filter(section => section.required)
    .map(section => section.value)
  
  const missingRequired = requiredSections.filter(
    required => !selectedSections.value.includes(required)
  )
  
  if (missingRequired.length > 0) {
    const missingSectionNames = missingRequired
      .map(sectionId => availableSections.value.find(s => s.value === sectionId)?.name)
      .join('、')
    return { 
      isValid: false, 
      message: `請選擇必要項目：${missingSectionNames}` 
    }
  }
  
  if (selectedSections.value.length === 0) {
    return { isValid: false, message: '請至少選擇一個記錄段落' }
  }
  
  return { isValid: true, message: '設定完成，已包含所有必要項目' }
})

// 方法

const onSelectAllChange = () => {
  if (selectAll.value) {
    selectedSections.value = availableSections.value.map(s => s.value)
  } else {
    selectedSections.value = []
  }
}

// 全選額外段落的處理
const onSelectAllOptionalChange = () => {
  const optionalSections = availableSections.value
    .filter(s => !s.required)
    .map(s => s.value)
  
  if (selectAllOptional.value) {
    // 加入所有可選段落，但保留必選段落
    const requiredSections = availableSections.value
      .filter(s => s.required)
      .map(s => s.value)
    selectedSections.value = [...requiredSections, ...optionalSections]
  } else {
    // 只保留必選段落
    selectedSections.value = selectedSections.value.filter(sectionId => {
      const section = availableSections.value.find(s => s.value === sectionId)
      return section?.required || false
    })
  }
}

const onSectionChange = () => {
  selectAll.value = selectedSections.value.length === availableSections.value.length
}

// 新增分類相關方法
const getSectionsForCategory = (category: string) => {
  return availableSections.value
    .filter(section => section.category === category && !section.required)
    .sort((a, b) => (a.order || 0) - (b.order || 0)) // 按order字段排序
}

const isCategorySelected = (category: string) => {
  const categorySections = getSectionsForCategory(category)
  return categorySections.every(section => selectedSections.value.includes(section.value))
}

const toggleCategory = (category: string) => {
  const categorySections = getSectionsForCategory(category)
  const isSelected = isCategorySelected(category)
  
  if (isSelected) {
    // 取消選擇該分類的所有議題
    categorySections.forEach(section => {
      const index = selectedSections.value.indexOf(section.value)
      if (index > -1) {
        selectedSections.value.splice(index, 1)
      }
    })
  } else {
    // 選擇該分類的所有議題
    categorySections.forEach(section => {
      if (!selectedSections.value.includes(section.value)) {
        selectedSections.value.push(section.value)
      }
    })
  }
  
  onSectionChange()
}

const toggleSection = (sectionValue: string) => {
  // 只處理可選項目
  const section = availableSections.value.find(s => s.value === sectionValue)
  if (section?.required) {
    return // 必選項目不允許取消選擇
  }
  
  const index = selectedSections.value.indexOf(sectionValue)
  if (index > -1) {
    selectedSections.value.splice(index, 1)
  } else {
    selectedSections.value.push(sectionValue)
  }
  onSectionChange()
}

const resetConfig = () => {
  selectedSections.value = []
  selectAll.value = false
  selectAllOptional.value = false
  
  // 重新設定必選項目
  const requiredSections = availableSections.value
    .filter(section => section.required)
    .map(section => section.value)
  selectedSections.value = requiredSections
}

const proceedToReport = async () => {
  // 保存配置到sessionStore
  const config = {
    selectedTemplate: DEFAULT_TEMPLATE,
    selectedSections: selectedSections.value,
    customSettings: {}
  }
  
  console.log('記錄配置 (基於新架構):', config)
  
  // 開始生成記錄
  await generateReportWithConfig(config)
}

// 生成記錄的核心函數
const generateReportWithConfig = async (config: any) => {
  const transcript = transcriptText.value?.trim()
  if (!transcript) {
    alert('目前尚未有逐字稿內容')
    return
  }
  
  // 保存選擇的模板到sessionStore
  sessionStore.setSelectedTemplate(DEFAULT_TEMPLATE)
  sessionStore.setReportStage('generating')
  sessionStore.setReportText('') // 清空
  
  // 跳轉到記錄初稿分頁 (索引 2)
  sessionStore.setActiveTab(2)

  try {
    const response = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: transcript,
        template: DEFAULT_TEMPLATE,
        selectedSections: config.selectedSections,
        customSettings: config.customSettings,
        sessionId: sessionId.value
      })
    })
    
    if (!response.body) {
      sessionStore.setReportStage('done')
      return
    }
    
    const reader = response.body.getReader()
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
          sessionStore.setReportText(reportText.value + obj.content)
        } catch (e) {
          // 可加錯誤處理
        }
      }
    }
    trackAPICall('run', 'report_generation', true)
    sessionStore.setReportStage('done')
    
    // 記錄生成完成後，自動生成關係圖
    if (autoGeneratePersonGraph.value) {
      await generatePersonGraphFromReport()
    }
    
    // 移除家庭關係圖自動生成
  } catch (err) {
    console.error('生成記錄失敗', err)
    sessionStore.setReportText('[生成失敗，請稍後再試]')
    sessionStore.setReportStage('done')
    trackAPICall('run', 'report_generation', false)
  }
}

// 自動生成人物關係圖
const generatePersonGraphFromReport = async () => {
  const reportTextValue = reportText.value?.trim()
  if (!reportTextValue) {
    console.warn('沒有記錄內容，無法生成人物關係圖')
    return
  }

  sessionStore.setPersonGraphStage('generating')
  sessionStore.setPersonGraphJson('')

  try {
    const response = await fetch('/api/PersonGraph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: reportTextValue,
        graphType: 'person',
        sessionId: sessionId.value
      })
    })
    
    if (!response.body) {
      sessionStore.setPersonGraphStage('done')
      return
    }
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let content = ''
    
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
          content += obj.content
        } catch (e) {
          // 忽略解析錯誤
        }
      }
    }
    
    // 清理 JSON 內容
    const cleanedContent = cleanJsonContent(content)
    
    sessionStore.setPersonGraphJson(cleanedContent)
    sessionStore.setPersonGraphStage('done')
    console.log('人物關係圖自動生成完成')
  } catch (err) {
    console.error('生成人物關係圖失敗', err)
    sessionStore.setPersonGraphStage('done')
  }
}

// 移除家庭關係圖生成功能

// 監聽段落選擇變化
watch(selectedSections, () => {
  selectAll.value = selectedSections.value.length === availableSections.value.length
  
  // 更新可選項目的全選狀態
  const optionalSections = availableSections.value
    .filter(s => !s.required)
    .map(s => s.value)
  
  const selectedOptional = selectedSections.value.filter(sectionId => 
    optionalSections.includes(sectionId)
  )
  
  selectAllOptional.value = optionalSections.length > 0 && selectedOptional.length === optionalSections.length
})

// 組件初始化時確保必選項目被選中
onMounted(() => {
  const requiredSections = availableSections.value
    .filter(section => section.required)
    .map(section => section.value)
  
  // 如果沒有選擇任何項目，自動選擇必選項目
  if (selectedSections.value.length === 0) {
    selectedSections.value = requiredSections
  } else {
    // 確保所有必選項目都被包含
    requiredSections.forEach(required => {
      if (!selectedSections.value.includes(required)) {
        selectedSections.value.push(required)
      }
    })
  }
})
</script>

<style scoped>
.report-config-panel {
  max-width: 1200px;
  margin: 0 auto;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>