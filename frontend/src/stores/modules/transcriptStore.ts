// File: stores/modules/transcriptStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTranscriptStore = defineStore('transcript', () => {
  // 狀態
  const audioFile = ref<File | null>(null)
  const transcriptFile = ref<File | null>(null)
  const transcriptText = ref('')
  const transcriptStage = ref<'idle' | 'transcribing' | 'correcting' | 'done' | 'error'>('idle')
  
  // 計算屬性
  const hasTranscript = computed(() => !!transcriptText.value)
  const hasAudioFile = computed(() => !!audioFile.value)
  const hasTranscriptFile = computed(() => !!transcriptFile.value)
  const hasUploaded = computed(() => hasAudioFile.value || hasTranscriptFile.value || hasTranscript.value)
  
  // 動作
  function setAudioFile(file: File) {
    audioFile.value = file
  }
  
  function setTranscriptFile(file: File) {
    transcriptFile.value = file
  }
  
  function setTranscriptText(text: string) {
    transcriptText.value = text
  }
  
  function setTranscriptStage(stage: 'idle' | 'transcribing' | 'correcting' | 'done' | 'error') {
    transcriptStage.value = stage
  }
  
  function reset() {
    audioFile.value = null
    transcriptFile.value = null
    transcriptText.value = ''
    transcriptStage.value = 'idle'
  }
  
  return {
    // 狀態
    audioFile,
    transcriptFile,
    transcriptText,
    transcriptStage,
    
    // 計算屬性
    hasTranscript,
    hasAudioFile,
    hasTranscriptFile,
    hasUploaded,
    
    // 動作
    setAudioFile,
    setTranscriptFile,
    setTranscriptText,
    setTranscriptStage,
    reset
  }
}, {
  persist: true
})