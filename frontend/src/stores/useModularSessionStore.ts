// File: stores/useModularSessionStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

// 導入模組化的stores
import { useTranscriptStore } from './modules/transcriptStore'
import { useReportStore } from './modules/reportStore'
import { useTreatmentPlanStore } from './modules/treatmentPlanStore'
import { usePersonGraphStore } from './modules/personGraphStore'
import { useNavigationStore } from './modules/navigationStore'

export const useModularSessionStore = defineStore('modularSession', () => {
  // 會話相關狀態
  const sessionId = ref('')
  
  // 初始化會話
  function initializeSession() {
    if (!sessionId.value) sessionId.value = uuidv4()
  }
  
  // 全局重置功能
  function resetAll() {
    const transcriptStore = useTranscriptStore()
    const reportStore = useReportStore()
    const treatmentPlanStore = useTreatmentPlanStore()
    const personGraphStore = usePersonGraphStore()
    const navigationStore = useNavigationStore()
    
    transcriptStore.reset()
    reportStore.reset()
    treatmentPlanStore.reset()
    personGraphStore.reset()
    navigationStore.reset()
    
    // 清除localStorage
    localStorage.removeItem('pinia')
  }
  
  function clearSession() {
    sessionId.value = ''
    resetAll()
  }
  
  return {
    sessionId,
    initializeSession,
    resetAll,
    clearSession
  }
}, {
  persist: {
    storage: localStorage,
    paths: ['sessionId']
  }
})