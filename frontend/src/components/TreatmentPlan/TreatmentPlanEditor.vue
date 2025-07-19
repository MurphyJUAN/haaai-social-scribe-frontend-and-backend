<template>
  <div class="treatment-plan-editor p-6">
    <!-- 頁面標題 -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">處遇計畫</h2>
      <p class="text-gray-600">基於報告內容生成專業的社工處遇計畫</p>
    </div>

    <!-- 狀態檢查 -->
    <div v-if="!hasReport" class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
      <div class="flex items-center gap-2 text-orange-700">
        <i class="pi pi-exclamation-triangle"></i>
        <span class="font-medium">尚未生成報告</span>
      </div>
      <p class="text-orange-600 mt-2">請先完成報告生成，才能建立處遇計畫。</p>
      <Button 
        label="前往報告設定" 
        icon="pi pi-arrow-left" 
        severity="warning" 
        outlined
        class="mt-3"
        @click="goToReportConfig"
      />
    </div>

    <!-- 處遇計畫內容 -->
    <div v-else>
      <!-- 錯誤訊息 -->
      <div v-if="errorMessage" class="mb-6 p-4 rounded-lg border" 
           :class="{
             'bg-red-50 border-red-200 text-red-700': errorType === 'server' || errorType === 'network',
             'bg-yellow-50 border-yellow-200 text-yellow-700': errorType === 'validation',
             'bg-gray-50 border-gray-200 text-gray-700': errorType === 'unknown'
           }">
        <div class="flex items-center gap-2">
          <i class="pi pi-exclamation-triangle" 
             :class="{
               'text-red-500': errorType === 'server' || errorType === 'network',
               'text-yellow-500': errorType === 'validation',
               'text-gray-500': errorType === 'unknown'
             }"></i>
          <span class="font-medium">{{ errorMessage }}</span>
        </div>
        <Button 
          label="重試"
          icon="pi pi-refresh"
          size="small"
          class="mt-2"
          :severity="errorType === 'validation' ? 'warning' : 'danger'"
          outlined
          @click="generateTreatmentPlan"
          v-if="errorType !== 'validation'"
        />
      </div>
      
      <!-- 生成控制區域 -->
      <Card class="mb-6" v-if="!hasTreatmentPlan || isRegenerating">
        <template #title>
          <span class="flex items-center gap-2">
            <i class="pi pi-cog text-blue-600"></i>
            處遇計畫生成
          </span>
        </template>
        <template #content>
          <div class="space-y-4">
            <!-- 移除報告摘要 -->



            <!-- 社工服務領域 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                社工服務領域（可複選，影響處遇計畫建議）
              </label>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div 
                  v-for="field in serviceFields" 
                  :key="field.value"
                  class="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Checkbox 
                    v-model="selectedServiceFields" 
                    :value="field.value"
                  />
                  <label class="text-sm font-medium text-gray-700 cursor-pointer">
                    {{ field.name }}
                  </label>
                </div>
              </div>
            </div>

            <!-- 生成按鈕 -->
            <div class="flex justify-center pt-4">
              <Button 
                :label="isGenerating ? '生成中...' : '生成處遇計畫'"
                :icon="isGenerating ? 'pi pi-spin pi-spinner' : 'pi pi-plus'"
                :disabled="isGenerating"
                :loading="isGenerating"
                @click="generateTreatmentPlan"
                size="large"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- 處遇計畫編輯區域 -->
      <Card v-if="hasTreatmentPlan" class="mb-6">
        <template #title>
          <div class="flex justify-between items-center w-full">
            <span class="flex items-center gap-2">
              <i class="pi pi-file-edit text-green-600"></i>
              處遇計畫內容
            </span>
            <div class="flex gap-2">
              <Button 
                icon="pi pi-refresh" 
                severity="secondary" 
                outlined
                @click="regeneratePlan"
                v-tooltip="'重新設定'"
              />
              <Button 
                icon="pi pi-pencil" 
                :severity="isEditing ? 'success' : 'secondary'"
                :outlined="!isEditing"
                @click="toggleEdit"
                v-tooltip="isEditing ? '完成編輯' : '編輯模式'"
              />
            </div>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <!-- 生成時間 -->
            <div class="text-sm text-gray-500 mb-4" v-if="generatedAt">
              生成時間：{{ formatDate(generatedAt) }}
            </div>

            <!-- 處遇計畫內容 -->
            <div v-if="isGenerating" class="space-y-4">
              <!-- 生成中的骨架載入 -->
              <div class="animate-pulse space-y-3">
                <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                <div class="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div class="text-center text-gray-500 py-4">
                <i class="pi pi-spin pi-spinner mr-2"></i>
                正在生成處遇計畫，請稍候...
              </div>
            </div>

            <div v-else>
              <Textarea 
                :model-value="treatmentContent"
                @update:model-value="updateTreatmentContent"
                :readonly="!isEditing"
                rows="20"
                class="w-full font-mono text-sm"
                :class="{ 'bg-gray-50': !isEditing }"
              />
              <div v-if="isEditing" class="flex gap-2 mt-2">
                <Button 
                  label="儲存" 
                  icon="pi pi-check" 
                  severity="success" 
                  @click="saveEdit"
                />
                <Button 
                  label="取消" 
                  icon="pi pi-times" 
                  severity="secondary" 
                  outlined
                  @click="cancelEdit"
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 操作按鈕 -->
      <div class="flex justify-between items-center pt-4 border-t" v-if="hasTreatmentPlan">
        <div class="text-sm text-gray-500">
          <span class="flex items-center gap-1">
            <i class="pi pi-check-circle text-green-600"></i>
            處遇計畫已完成
          </span>
        </div>
        
        <div class="flex gap-3">
          <Button 
            label="下載計畫" 
            icon="pi pi-download" 
            severity="secondary" 
            outlined
            @click="downloadPlan"
          />
          <Button 
            label="下一步：人物關係圖" 
            icon="pi pi-arrow-right" 
            @click="goToPersonGraph"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import { useSessionStore } from '@/stores/useSessionStore'
import { useTreatmentPlanStore } from '@/stores/modules/treatmentPlanStore'
import { storeToRefs } from 'pinia'

const sessionStore = useSessionStore()
const treatmentPlanStore = useTreatmentPlanStore()
const { reportText, sessionId } = storeToRefs(sessionStore)
const { treatmentPlan, treatmentPlanStage, hasTreatmentPlan, isGenerating, canGenerate } = storeToRefs(treatmentPlanStore)

// 本地響應式狀態
const isRegenerating = ref(false)
const mainIssue = ref('')
const caseType = ref('family_mediation')
const selectedServiceFields = ref<string[]>([])
const customNotes = ref('')
const reportStyle = ref('formal')
const errorMessage = ref('')
const errorType = ref<'network' | 'validation' | 'server' | 'unknown'>('unknown')

// 案件類型選項
const caseTypeOptions = ref([
  { name: '家事商談', value: 'family_mediation' },
  { name: '親子關係', value: 'parent_child' },
  { name: '婚姻諮商', value: 'marriage_counseling' },
  { name: '兒少保護', value: 'child_protection' },
  { name: '家庭暴力', value: 'domestic_violence' },
  { name: '其他家事案件', value: 'other_family' }
])

// 社工服務領域選項
const serviceFields = ref([
  { name: '司法與矯治', value: 'judicial_correction' },
  { name: '經濟扶助', value: 'economic_assistance' },
  { name: '新(原)住民', value: 'new_residents' },
  { name: '保護服務', value: 'protection_services' },
  { name: '兒童與少年', value: 'children_youth' },
  { name: '學校與教育', value: 'school_education' },
  { name: '婦女與家庭', value: 'women_family' },
  { name: '醫務相關', value: 'medical_related' },
  { name: '心理與精神', value: 'psychological_mental' },
  { name: '身心障礙', value: 'disability' },
  { name: '老人與長照', value: 'elderly_longterm_care' }
])

// 計算屬性
const hasReport = computed(() => !!reportText.value?.trim())
const treatmentContent = computed(() => treatmentPlan.value.content)
const isEditing = computed(() => treatmentPlan.value.isEditing)
const generatedAt = computed(() => treatmentPlan.value.generatedAt)
// 移除重複的 hasTreatmentPlan 計算屬性，使用 store 中的
// 移除報告摘要計算屬性

// 方法
const extractMainIssue = () => {
  const report = reportText.value?.trim()
  if (!report) return ''
  
  // 嘗試從報告中提取主述問題
  const lines = report.split('\n')
  for (const line of lines) {
    if (line.includes('主述') || line.includes('主要問題') || line.includes('問題')) {
      const extracted = line.replace(/^[一二三四五六七八九十、\d\.\s]*/, '').trim()
      if (extracted.length > 10) {
        return extracted.substring(0, 100) + (extracted.length > 100 ? '...' : '')
      }
    }
  }
  
  return '請根據報告內容描述主要議題'
}

const generateTreatmentPlan = async () => {
  // 清除之前的錯誤
  errorMessage.value = ''
  errorType.value = 'unknown'
  
  treatmentPlanStore.setTreatmentPlanStage('generating')
  treatmentPlanStore.setTreatmentPlanContent('')
  
  try {
    const response = await fetch('/api/treatment-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportContent: reportText.value,
        mainIssue: mainIssue.value,
        caseType: caseType.value,
        serviceFields: selectedServiceFields.value,
        customSettings: {
          notes: customNotes.value,
          style: reportStyle.value
        },
        sessionId: sessionId.value
      })
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`伺服器錯誤 (${response.status}): ${errorText}`)
    }
    
    if (!response.body) {
      throw new Error('伺服器未返回數據流')
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
          // 實時更新內容
          treatmentPlanStore.setTreatmentPlanContent(content)
        } catch (e) {
          console.warn('解析流數據失敗:', e)
        }
      }
    }
    
    // 更新驗證狀態
    sessionStore.updateTreatmentPlanValidation(!!content)
    treatmentPlanStore.setTreatmentPlanStage('done')
    
  } catch (err) {
    console.error('生成處遇計畫失敗', err)
    console.error('錯誤詳細信息:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      isRegenerating: isRegenerating.value
    })
    
    // 根據錯誤類型設置相應的錯誤信息
    if (err instanceof TypeError && err.message.includes('fetch')) {
      handleError('network', '網路連接失敗，請檢查網路狀態後重試')
    } else if (err.message.includes('伺服器錯誤')) {
      handleError('server', err.message)
    } else {
      handleError('unknown', `處遇計畫生成失敗: ${err.message}`)
    }
    
    treatmentPlanStore.setTreatmentPlanStage('error')
  }
}

const handleError = (type: 'network' | 'validation' | 'server' | 'unknown', message: string) => {
  errorType.value = type
  errorMessage.value = message
}

const regeneratePlan = () => {
  // 顯示生成控制區域，讓用戶修改後手動發送
  isRegenerating.value = true
  // 清除之前的錯誤訊息
  errorMessage.value = ''
  errorType.value = 'unknown'
}

const toggleEdit = () => {
  treatmentPlanStore.startEditing()
}

const updateTreatmentContent = (content: string) => {
  treatmentPlanStore.setTreatmentPlanContent(content)
}

const saveEdit = () => {
  treatmentPlanStore.stopEditing()
  // 更新驗證狀態
  sessionStore.updateTreatmentPlanValidation(!!treatmentContent.value)
}

const cancelEdit = () => {
  treatmentPlanStore.stopEditing()
}

const downloadPlan = () => {
  const content = treatmentContent.value.trim()
  if (!content) {
    alert('沒有可下載的內容')
    return
  }
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = 'treatment_plan.txt'
  a.click()
  
  URL.revokeObjectURL(url)
}

const goToReportConfig = () => {
  sessionStore.setActiveTab(1) // 報告設定分頁
}

const goToPersonGraph = () => {
  sessionStore.setActiveTab(4) // 人物關係圖分頁
}

const formatDate = (date: Date) => {
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 監聽報告變化，自動提取主述議題
watch(reportText, () => {
  if (reportText.value && !mainIssue.value) {
    mainIssue.value = extractMainIssue()
  }
}, { immediate: true })

// 組件掛載時初始化
onMounted(() => {
  if (reportText.value && !mainIssue.value) {
    mainIssue.value = extractMainIssue()
  }
})
</script>

<style scoped>
.treatment-plan-editor {
  max-width: 1000px;
  margin: 0 auto;
}

.font-mono {
  font-family: 'Courier New', monospace;
}
</style>