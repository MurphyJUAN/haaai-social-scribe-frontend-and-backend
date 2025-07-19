// File: stores/modules/treatmentPlanStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTreatmentPlanStore = defineStore('treatmentPlan', () => {
  // 狀態
  const treatmentPlan = ref({
    content: '',
    isGenerated: false,
    isEditing: false,
    generatedAt: null as Date | null
  })
  const treatmentPlanStage = ref<'idle' | 'generating' | 'done' | 'error'>('idle')
  
  // 計算屬性
  const hasTreatmentPlan = computed(() => !!treatmentPlan.value.content)
  const isGenerating = computed(() => treatmentPlanStage.value === 'generating')
  const canGenerate = computed(() => treatmentPlanStage.value === 'idle' || treatmentPlanStage.value === 'done')
  
  // 動作
  function setTreatmentPlan(plan: Partial<typeof treatmentPlan.value>) {
    treatmentPlan.value = { ...treatmentPlan.value, ...plan }
    if (plan.content) {
      treatmentPlan.value.isGenerated = true
      treatmentPlan.value.generatedAt = new Date()
    }
  }
  
  function setTreatmentPlanStage(stage: 'idle' | 'generating' | 'done' | 'error') {
    treatmentPlanStage.value = stage
  }
  
  function setTreatmentPlanContent(content: string) {
    treatmentPlan.value.content = content
    treatmentPlan.value.isGenerated = !!content
    if (content) {
      treatmentPlan.value.generatedAt = new Date()
    }
  }
  
  function startEditing() {
    treatmentPlan.value.isEditing = true
  }
  
  function stopEditing() {
    treatmentPlan.value.isEditing = false
  }
  
  function reset() {
    treatmentPlan.value = {
      content: '',
      isGenerated: false,
      isEditing: false,
      generatedAt: null
    }
    treatmentPlanStage.value = 'idle'
  }
  
  return {
    // 狀態
    treatmentPlan,
    treatmentPlanStage,
    
    // 計算屬性
    hasTreatmentPlan,
    isGenerating,
    canGenerate,
    
    // 動作
    setTreatmentPlan,
    setTreatmentPlanStage,
    setTreatmentPlanContent,
    startEditing,
    stopEditing,
    reset
  }
}, {
  persist: {
    storage: localStorage,
    paths: ['treatmentPlan']
  }
})