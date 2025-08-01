<template>
  <section
    class="relative text-white text-center overflow-hidden transition-all duration-500"
    :class="store.hasUploaded ? 'h-[400px]' : 'h-[calc(100vh)]'"
  >
    <!-- 背景圖層 -->
    <div
      class="absolute inset-0 z-0"
      :style="`background-image: url(${bgUrl}); background-size: cover; background-position: top;`"
    ></div>

    <!-- 遮罩層 -->
    <div class="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

    <div class="relative z-10 flex flex-col items-center justify-center h-full px-4">
      <h1 class="text-3xl font-bold mb-2">社工專屬的智慧報告助手</h1>
      <p class="text-lg mb-6">支援錄音上傳與逐字稿產出，AI自動生成訪視報告，效率再升級。</p>

      <!-- 錄音中的狀態顯示 -->
      <div v-if="isRecording || isPaused" class="mb-4 p-4 bg-red-600 bg-opacity-80 rounded-lg">
        <div class="flex items-center justify-center gap-2 mb-3">
          <div 
            class="w-3 h-3 rounded-full"
            :class="isPaused ? 'bg-yellow-300' : 'bg-red-300 animate-pulse'"
          ></div>
          <span class="text-white font-medium">
            {{ isPaused ? '錄音已暫停' : '錄音中...' }} {{ formatRecordingTime(recordingTime) }}
          </span>
        </div>
        
        <div class="flex gap-3 justify-center">
          <!-- 暫停/繼續按鈕 -->
          <button
            v-if="isRecording"
            @click="pauseRecording"
            class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 font-medium flex items-center gap-2"
          >
            <i class="pi pi-pause"></i>
            暫停錄音
          </button>
          
          <button
            v-if="isPaused"
            @click="resumeRecording"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-medium flex items-center gap-2"
          >
            <i class="pi pi-play"></i>
            繼續錄音
          </button>
          
          <!-- 停止錄音按鈕 -->
          <button
            @click="stopRecording"
            class="bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100 font-medium flex items-center gap-2"
          >
            <i class="pi pi-stop"></i>
            停止錄音
          </button>
        </div>
      </div>

      <!-- 按鈕區域 -->
      <div class="space-x-4 flex" v-if="!isRecording && !isPaused">
        <!-- 開始錄製按鈕 -->
        <button
          class="flex bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          @click="startRecording"
          :disabled="isProcessing"
        >
          <img src="@/assets/voice.png" alt="record-icon" class="h-5 mr-1" />
          開始錄製
        </button>

        <!-- 上傳錄音檔按鈕 -->
        <input
          type="file"
          accept="audio/*"
          class="hidden"
          ref="audioInput"
          @change="handleAudioUpload"
        />
        <button
          class="flex bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
          @click="triggerAudioInput"
          :disabled="isProcessing"
        >
          <img src="@/assets/microphone.png" alt="upload-icon" class="h-5 mr-1" />
          上傳錄音檔
        </button>

        <!-- 上傳逐字稿按鈕 -->
        <input
          type="file"
          accept=".txt"
          class="hidden"
          ref="textInput"
          @change="handleTranscriptUpload"
        />
        <button
          class="flex bg-gray-50 text-purple-700 px-4 py-2 rounded border border-purple-700 hover:bg-gray-300"
          @click="triggerTextInput"
          :disabled="isProcessing"
        >
          <img src="@/assets/document.png" alt="document-icon" class="h-5 mr-1" />
          上傳逐字稿
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import bgUrl from '@/assets/banner-background-img.png'
import { useSessionStore } from '../../stores/useSessionStore'
import apiClient from '@/api/axiosClient'
import { trackAPICall } from '@/utils/analytics' // 引入你之前建立的追蹤函數


const props = defineProps<{
  scrollTarget: HTMLElement | null
}>()

const scrollToEditor = () => {
  props.scrollTarget?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const audioInput = ref<HTMLInputElement | null>(null)
const textInput = ref<HTMLInputElement | null>(null)
const store = useSessionStore()

// 錄音相關狀態
const isRecording = ref(false)
const isPaused = ref(false)
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])
const recordingTime = ref(0)
const recordingTimer = ref<any>(null)
const isProcessing = ref(false)
const mediaStream = ref<MediaStream | null>(null)

const triggerAudioInput = () => audioInput.value?.click()
const triggerTextInput = () => textInput.value?.click()

// 格式化錄音時間
const formatRecordingTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 開始錄音
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaStream.value = stream
    
    mediaRecorder.value = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
    })
    
    audioChunks.value = []
    recordingTime.value = 0
    
    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data)
      }
    }
    
    mediaRecorder.value.onstop = async () => {
      const audioBlob = new Blob(audioChunks.value, { 
        type: mediaRecorder.value?.mimeType || 'audio/webm' 
      })
      
      // 創建 File 物件
      const audioFile = new File([audioBlob], `recording_${Date.now()}.webm`, {
        type: audioBlob.type
      })
      
      // 停止所有音軌
      if (mediaStream.value) {
        mediaStream.value.getTracks().forEach(track => track.stop())
        mediaStream.value = null
      }
      
      // 自動下載錄音檔案
      await downloadRecording(audioBlob)
      
      // 處理錄音檔案
      await processRecordedAudio(audioFile)
    }
    
    mediaRecorder.value.start()
    isRecording.value = true
    isPaused.value = false
    
    // 開始計時
    startTimer()
    
  } catch (error) {
    console.error('無法存取麥克風:', error)
    alert('無法存取麥克風，請確認瀏覽器權限設定')
  }
}

// 暫停錄音
const pauseRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.pause()
    isRecording.value = false
    isPaused.value = true
    
    // 停止計時
    if (recordingTimer.value) {
      clearInterval(recordingTimer.value)
      recordingTimer.value = null
    }
  }
}

// 繼續錄音
const resumeRecording = () => {
  if (mediaRecorder.value && isPaused.value) {
    mediaRecorder.value.resume()
    isRecording.value = true
    isPaused.value = false
    
    // 重新開始計時
    startTimer()
  }
}

// 停止錄音
const stopRecording = () => {
  if (mediaRecorder.value && (isRecording.value || isPaused.value)) {
    mediaRecorder.value.stop()
    isRecording.value = false
    isPaused.value = false
    
    if (recordingTimer.value) {
      clearInterval(recordingTimer.value)
      recordingTimer.value = null
    }
  }
}

// 開始計時器
const startTimer = () => {
  recordingTimer.value = setInterval(() => {
    recordingTime.value++
  }, 1000)
}

// 下載錄音檔案
const downloadRecording = async (audioBlob: Blob) => {
  const url = URL.createObjectURL(audioBlob)
  const a = document.createElement('a')
  a.href = url
  a.download = `recording_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 處理錄製的音頻
const processRecordedAudio = async (audioFile: File) => {
  isProcessing.value = true
  store.reset()
  store.setAudioFile(audioFile)
  
  // 開始轉錄流程
  await transcribeAudio(audioFile)
  
  // 滾動到編輯區
  scrollToEditor()
  isProcessing.value = false
}

// 轉錄音頻
const transcribeAudio = async (file: File) => {
  store.setTranscriptStage('transcribing')

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('model', 'whisper-1')
    formData.append('response_format', 'text')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: formData
    })

    const transcript = await response.text()

    if (!transcript) throw new Error('轉錄結果為空')
    store.setTranscriptText(transcript)

    trackAPICall('audio/transcriptions', 'whisper-1', true)

    await correctTranscriptWithOpenAI(transcript)
  } catch (e) {
    console.error('轉錄失敗', e)
    trackAPICall('audio/transcriptions', 'whisper-1', false)
    store.setTranscriptText('[轉錄失敗，請稍後再試]')
  } finally {
    store.setTranscriptStage('done')
  }
}

const correctTranscriptWithOpenAI = async (transcript: string) => {
  store.setTranscriptStage('correcting')

  const systemPrompt = `你是一位中文逐字稿校對助手，請幫我修正語音辨識轉換的逐字稿中可能錯誤的字詞。不要改變語意，只做錯字修正，並在適當的時候加上換行符號增加可讀性。`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: transcript }
      ],
      temperature: 0.2
    })
  })

  const data = await response.json()
  const correctedText = data.choices?.[0]?.message?.content?.trim()

  if (correctedText) {
    store.setTranscriptText(correctedText)
  } else {
    console.warn('GPT 回傳內容為空，保留原始逐字稿')
  }
}

const handleAudioUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  isProcessing.value = true
  store.reset()
  store.setAudioFile(file)
  
  await transcribeAudio(file)
  scrollToEditor()
  isProcessing.value = false
}

const handleTranscriptUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    store.reset()
    store.setTranscriptFile(file)

    const reader = new FileReader()
    reader.onload = () => {
      const text = reader.result as string
      store.setTranscriptText(text)
      scrollToEditor()
    }
    reader.onerror = () => {
      console.error('讀取逐字稿檔案失敗')
    }

    reader.readAsText(file, 'utf-8')
  }
}

// 清理資源
onUnmounted(() => {
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value)
  }
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
  }
  if (mediaRecorder.value && (isRecording.value || isPaused.value)) {
    stopRecording()
  }
})
</script>