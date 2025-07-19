// File: stores/modules/navigationStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNavigationStore = defineStore('navigation', () => {
  // 狀態
  const currentStep = ref(0) // 0: 逐字稿, 1: 報告設定, 2: 報告初稿, 3: 處遇計畫, 4: 人物關係圖
  const activeTabIndex = ref(0)
  const stepValidation = ref([false, false, false, false, false])
  const hasSubmitted = ref(false)
  
  // 計算屬性
  const canAdvanceToStep = computed(() => (stepIndex: number) => {
    if (stepIndex <= 0) return true
    return stepValidation.value[stepIndex - 1]
  })
  
  const isStepComplete = computed(() => (stepIndex: number) => {
    return stepValidation.value[stepIndex]
  })
  
  const nextAvailableStep = computed(() => {
    for (let i = 0; i < stepValidation.value.length; i++) {
      if (!stepValidation.value[i]) return i
    }
    return stepValidation.value.length - 1
  })
  
  // 動作
  function setActiveTab(index: number) {
    activeTabIndex.value = index
    currentStep.value = index
  }
  
  function setCurrentStep(step: number) {
    currentStep.value = step
    activeTabIndex.value = step
  }
  
  function setStepValidation(stepIndex: number, isValid: boolean) {
    stepValidation.value[stepIndex] = isValid
  }
  
  function markSubmitted() {
    hasSubmitted.value = true
  }
  
  function goToNextStep() {
    const nextStep = currentStep.value + 1
    if (nextStep < stepValidation.value.length) {
      setCurrentStep(nextStep)
    }
  }
  
  function goToPreviousStep() {
    const prevStep = currentStep.value - 1
    if (prevStep >= 0) {
      setCurrentStep(prevStep)
    }
  }
  
  function reset() {
    currentStep.value = 0
    activeTabIndex.value = 0
    stepValidation.value = [false, false, false, false, false]
    hasSubmitted.value = false
  }
  
  return {
    // 狀態
    currentStep,
    activeTabIndex,
    stepValidation,
    hasSubmitted,
    
    // 計算屬性
    canAdvanceToStep,
    isStepComplete,
    nextAvailableStep,
    
    // 動作
    setActiveTab,
    setCurrentStep,
    setStepValidation,
    markSubmitted,
    goToNextStep,
    goToPreviousStep,
    reset
  }
}, {
  persist: {
    storage: localStorage,
    paths: ['currentStep', 'activeTabIndex', 'stepValidation']
  }
})