<!-- File: TypescriptEditor.vue -->
<template>
  <div class="transition-all duration-1000 ease-in-out w-full text-gray-800">
    <Message 
      v-if="sessionStore.transcriptStage !== 'idle'"
      :severity="getMessageSeverity(sessionStore.transcriptStage)"
    >
      {{ stageMessage }}
    </Message>

    <template
      v-if="
        sessionStore.transcriptStage === 'transcribing' ||
        sessionStore.transcriptStage === 'correcting'
      "
    >
      <!-- 模擬 textarea 的骨架 loading 區塊 -->
      <div class="w-full h-64 border p-2 rounded animate-pulse space-y-2">
        <div class="flex space-x-2">
          <div class="h-4 bg-gray-200 rounded w-[60%]"></div>
          <div class="h-4 bg-gray-200 rounded w-[20%]"></div>
        </div>
        <div class="h-4 bg-gray-200 rounded w-[90%]"></div>
        <div class="flex space-x-5">
          <div class="h-4 bg-gray-200 mb-4 rounded w-[30%]"></div>
          <div class="h-4 bg-gray-200rounded w-[40%]"></div>
        </div>
        <div class="h-4 bg-gray-200 rounded w-[85%]"></div>
        <div class="h-4 bg-gray-200 rounded w-[50%]"></div>
        <div class="flex space-x-1">
          <div class="h-4 bg-gray-200 mb-6 rounded w-[40%]"></div>
          <div class="h-4 bg-gray-200 rounded w-[30%]"></div>
          <div class="h-4 bg-gray-200 rounded w-[15%]"></div>
        </div>
        <div class="h-4 bg-gray-200 rounded w-[70%]"></div>
        <div class="flex space-x-2">
          <div class="h-4 bg-gray-200 rounded w-[45%]"></div>
          <div class="h-4 bg-gray-200 rounded w-[35%]"></div>
        </div>
      </div>
    </template>

    <template v-else>
      <!-- 原始逐字稿 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2 text-gray-700">訪談逐字稿</h3>
        <textarea
          ref="textareaRef"
          class="w-full h-auto min-h-[40vh] border p-2 rounded resize-none"
          v-model="sessionStore.transcriptText"
          placeholder="請輸入或上傳訪談逐字稿..."
        />
      </div>

      <!-- 社工補充說明 -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-semibold text-gray-700">社工補充說明</h3>
          <div class="flex space-x-2">
            <button
              @click="toggleVoiceInput"
              :class="[
                'flex items-center px-3 py-2 rounded text-sm font-medium transition-colors',
                isRecording 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : isTranscribing
                  ? 'bg-yellow-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              ]"
              :disabled="!isVoiceSupported || isTranscribing"
              :title="isVoiceSupported ? '' : '您的瀏覽器不支援語音錄製功能'"
            >
              <svg 
                v-if="!isTranscribing"
                class="w-4 h-4 mr-1" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fill-rule="evenodd" 
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" 
                  clip-rule="evenodd" 
                />
              </svg>
              <svg 
                v-else
                class="animate-spin w-4 h-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isTranscribing ? '轉錄中...' : isRecording ? '停止錄音' : '語音輸入' }}
            </button>
            <button
              v-if="sessionStore.socialWorkerNotes"
              @click="clearNotes"
              class="flex items-center px-3 py-2 rounded text-sm font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
              清除
            </button>
          </div>
        </div>
        
        <!-- 語音錄製狀態提示 -->
        <div v-if="isRecording" class="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          <div class="flex items-center">
            <div class="animate-pulse w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            正在錄音中，請開始說話...
          </div>
        </div>

        <div v-if="isTranscribing" class="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm">
          <div class="flex items-center">
            <svg class="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            正在使用 AI 轉錄語音內容，請稍候...
          </div>
        </div>
        
        <div v-if="voiceError" class="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {{ voiceError }}
        </div>

        <textarea
          ref="socialWorkerTextareaRef"
          class="w-full h-auto min-h-[30vh] border p-2 rounded resize-none"
          v-model="sessionStore.socialWorkerNotes"
          placeholder="請輸入社工補充說明，或點擊上方語音輸入按鈕進行語音錄製..."
        />
      </div>

      <div class="w-full mx-auto flex justify-center space-x-4">
        <button
          class="flex justify-center items-center text-center mt-4 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-700"
          @click="download"
        >
          <img src="@/assets/downloads.png" alt="icon" class="h-5 mr-1" />
          下載逐字稿與社工補充說明
        </button>

        <Button
          class="mt-4 text-purple-700 flex"
          severity="help"
          @click="proceedToReportConfig"
        >
          <img src="@/assets/add.png" alt="icon" class="h-5 mr-1" />
          下一步：記錄設定
        </Button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted } from 'vue'
import apiClient from '@/api/axiosClient'
import Message from 'primevue/message'
import Button from 'primevue/button'
import { useSessionStore } from '@/stores/useSessionStore'
import { storeToRefs } from 'pinia'
import { transcriptStageMessageMap } from '@/utils/stageMessages'

const sessionStore = useSessionStore()
const { 
  transcriptStage, 
  transcriptText,
  socialWorkerNotes
} = storeToRefs(sessionStore)

const stageMessage = computed(() => transcriptStageMessageMap[transcriptStage.value])

// 根據不同狀態返回對應的 Message severity
const getMessageSeverity = (stage: string) => {
  switch (stage) {
    case 'transcribing':
    case 'correcting':
      return 'info' // 藍色
    case 'done':
      return 'success' // 綠色
    case 'error':
      return 'error' // 紅色
    default:
      return 'info' // 預設藍色
  }
}

// 語音錄製和轉錄相關
const isRecording = ref(false)
const isTranscribing = ref(false)
const voiceError = ref('')
const isVoiceSupported = ref(false)
let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []

// 初始化會話ID
onMounted(() => {
  sessionStore.initializeSession()
  initializeVoiceRecording()
})

onUnmounted(() => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop()
  }
})

// 初始化語音錄製
const initializeVoiceRecording = async () => {
  try {
    // 檢查瀏覽器是否支援 MediaRecorder
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      isVoiceSupported.value = false
      return
    }

    // 測試麥克風權限
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach(track => track.stop()) // 立即停止測試流
    
    isVoiceSupported.value = true
  } catch (error) {
    console.error('初始化語音錄製失敗:', error)
    isVoiceSupported.value = false
  }
}

// 使用後端 API 轉錄音頻
const transcribeAudioWithOpenAI = async (audioBlob: Blob) => {
  try {
    isTranscribing.value = true
    voiceError.value = ''

    // 將 Blob 轉換為 File
    const audioFile = new File([audioBlob], 'voice_note.webm', { type: audioBlob.type })

    const formData = new FormData()
    formData.append('file', audioFile)
    formData.append('model', 'whisper-1')
    formData.append('response_format', 'text')
    formData.append('language', 'zh') // 指定中文

    // 使用後端 API 而不是直接調用 OpenAI
    const response = await apiClient.post('/audio/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // 檢查後端回應
    if (!response.data.success) {
      throw new Error(`API 請求失敗: ${response.data.error}`)
    }

    const transcript = response.data.data.final_transcript

    if (!transcript || transcript.trim() === '') {
      throw new Error('轉錄結果為空')
    }

    // 將轉錄結果加入到現有的社工補充說明中
    const currentNotes = sessionStore.socialWorkerNotes
    const newNotes = currentNotes ? `${currentNotes}\n${transcript.trim()}` : transcript.trim()
    sessionStore.setSocialWorkerNotes(newNotes)

  } catch (error) {
    console.error('語音轉錄失敗:', error)
    voiceError.value = error instanceof Error ? error.message : '語音轉錄失敗，請重新嘗試'
    
    // 3秒後清除錯誤訊息
    setTimeout(() => {
      voiceError.value = ''
    }, 5000)
  } finally {
    isTranscribing.value = false
  }
}

// 開始錄音
const startRecording = async () => {
  try {
    voiceError.value = ''
    audioChunks = []

    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    })

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus'
    })

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data)
      }
    }

    mediaRecorder.onstop = async () => {
      // 停止所有音軌
      stream.getTracks().forEach(track => track.stop())
      
      if (audioChunks.length > 0) {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' })
        await transcribeAudioWithOpenAI(audioBlob)
      }
      
      audioChunks = []
    }

    mediaRecorder.onerror = (event) => {
      console.error('錄音錯誤:', event)
      voiceError.value = '錄音過程中發生錯誤'
      isRecording.value = false
    }

    mediaRecorder.start()
    isRecording.value = true

  } catch (error) {
    console.error('開始錄音失敗:', error)
    voiceError.value = '無法開始錄音，請檢查麥克風權限'
    isRecording.value = false
  }
}

// 停止錄音
const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop()
    isRecording.value = false
  }
}

// 切換語音輸入
const toggleVoiceInput = () => {
  if (!isVoiceSupported.value) return

  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

// 清除社工補充說明
const clearNotes = () => {
  if (confirm('確定要清除社工補充說明嗎？')) {
    sessionStore.setSocialWorkerNotes('')
  }
}

// 跳轉到記錄設定頁面
const proceedToReportConfig = () => {
  const transcript = transcriptText.value?.trim()
  if (!transcript) {
    alert('請先輸入或上傳逐字稿內容')
    return
  }
  
  // 跳轉到記錄設定分頁 (索引 1)
  sessionStore.setActiveTab(1)
}

// 下載完整記錄
const download = () => {
  const transcript = transcriptText.value.trim()
  const notes = socialWorkerNotes.value.trim()
  
  if (!transcript && !notes) {
    alert('沒有可下載的內容')
    return
  }

  // 組合完整內容
  let fullContent = ''
  
  if (transcript) {
    fullContent += '=== 訪談逐字稿 ===\n\n'
    fullContent += transcript
  }
  
  if (notes) {
    if (fullContent) fullContent += '\n\n'
    fullContent += '=== 社工補充說明 ===\n\n'
    fullContent += notes
  }

  const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = '完整訪談記錄.txt'
  a.click()

  URL.revokeObjectURL(url)
}

// 為 window 物件添加 MediaRecorder 的型別聲明
declare global {
  interface Window {
    MediaRecorder: typeof MediaRecorder
  }
}
</script>