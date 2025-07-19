// File: stores/modules/reportStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useReportStore = defineStore('report', () => {
  // 狀態
  const reportText = ref('')
  const reportStage = ref<'idle' | 'generating' | 'done' | 'error'>('idle')
  const selectedTemplate = ref('')
  
  // 新增：報告配置相關狀態
  const reportConfig = ref({
    selectedTemplate: '',
    selectedSections: [] as string[],
    customSettings: {} as Record<string, any>,
    isComplete: false
  })
  
  // 計算屬性
  const hasReport = computed(() => !!reportText.value)
  const isGenerating = computed(() => reportStage.value === 'generating')
  const isConfigComplete = computed(() => {
    return !!(reportConfig.value.selectedTemplate && 
             reportConfig.value.selectedSections.length > 0)
  })
  
  // 動作
  function setReportText(text: string) {
    reportText.value = text
  }
  
  function setReportStage(stage: 'idle' | 'generating' | 'done' | 'error') {
    reportStage.value = stage
  }
  
  function setSelectedTemplate(template: string) {
    selectedTemplate.value = template
    reportConfig.value.selectedTemplate = template
    updateConfigComplete()
  }
  
  function setReportConfig(config: Partial<typeof reportConfig.value>) {
    reportConfig.value = { ...reportConfig.value, ...config }
    updateConfigComplete()
  }
  
  function setSelectedSections(sections: string[]) {
    reportConfig.value.selectedSections = sections
    updateConfigComplete()
  }
  
  function setCustomSettings(settings: Record<string, any>) {
    reportConfig.value.customSettings = settings
    updateConfigComplete()
  }
  
  function updateConfigComplete() {
    reportConfig.value.isComplete = isConfigComplete.value
  }
  
  function reset() {
    reportText.value = ''
    reportStage.value = 'idle'
    selectedTemplate.value = ''
    reportConfig.value = {
      selectedTemplate: '',
      selectedSections: [],
      customSettings: {},
      isComplete: false
    }
  }
  
  return {
    // 狀態
    reportText,
    reportStage,
    selectedTemplate,
    reportConfig,
    
    // 計算屬性
    hasReport,
    isGenerating,
    isConfigComplete,
    
    // 動作
    setReportText,
    setReportStage,
    setSelectedTemplate,
    setReportConfig,
    setSelectedSections,
    setCustomSettings,
    reset
  }
}, {
  persist: {
    storage: localStorage,
    paths: ['reportText', 'selectedTemplate', 'reportConfig']
  }
})