<!-- File: PlayerPanel.vue -->
<template>
  <div class="w-full mx-auto">
    <!-- 控制按鈕區域 -->
    <div class="flex justify-center items-center gap-4 mb-4">
      <!-- 播放/暫停按鈕 -->
      <button
        @click="togglePlay"
        class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center"
      >
        <img :src="isPlaying ? pauseIcon : playIcon" class="h-5 mr-2" alt="play-pause" />
        {{ isPlaying ? '暫停播放' : '播放錄音' }}
      </button>

      <!-- 下載按鈕 -->
      <button
        @click="downloadAudio"
        class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        title="下載錄音檔案"
      >
        <img src="@/assets/downloads.png" alt="download-icon" class="h-5 mr-2" />
        下載錄音
      </button>
    </div>

    <!-- 時間顯示 -->
    <div class="flex justify-between text-sm text-gray-600 mb-1 px-1">
      <span>{{ formatTime(currentTime) }}</span>
      <span>{{ formatTime(totalTime) }}</span>
    </div>

    <!-- 波形顯示 -->
    <div ref="waveformRef" class="mb-4"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import WaveSurfer from 'wavesurfer.js'
import playIcon from '@/assets/play.png'
import pauseIcon from '@/assets/pause.png'

const props = defineProps<{ file: File }>()

const waveformRef = ref<HTMLDivElement | null>(null)
const wavesurfer = ref<WaveSurfer | null>(null)

const isPlaying = ref(false)
const currentTime = ref(0)
const totalTime = ref(0)

const formatTime = (s: number) => {
  const minutes = Math.floor(s / 60)
  const seconds = Math.floor(s % 60)
    .toString()
    .padStart(2, '0')
  return `${minutes}:${seconds}`
}

const togglePlay = () => {
  if (wavesurfer.value) {
    wavesurfer.value.playPause()
    isPlaying.value = wavesurfer.value.isPlaying()
  }
}

// 下載音頻檔案
const downloadAudio = () => {
  try {
    const url = URL.createObjectURL(props.file)
    const a = document.createElement('a')
    
    // 生成檔案名稱，保持原始副檔名或使用適當的副檔名
    const fileExtension = getFileExtension(props.file.name) || getFileExtensionFromType(props.file.type)
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const fileName = props.file.name.includes('recording_') 
      ? props.file.name 
      : `audio_${timestamp}${fileExtension}`
    
    a.href = url
    a.download = fileName
    a.style.display = 'none'
    
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    
    // 清理 URL
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 100)
    
  } catch (error) {
    console.error('下載檔案失敗:', error)
    alert('下載檔案失敗，請稍後再試')
  }
}

// 從檔案名稱取得副檔名
const getFileExtension = (fileName: string): string => {
  const lastDotIndex = fileName.lastIndexOf('.')
  return lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : ''
}

// 從 MIME 類型取得副檔名
const getFileExtensionFromType = (mimeType: string): string => {
  const typeMap: { [key: string]: string } = {
    'audio/webm': '.webm',
    'audio/mp4': '.mp4',
    'audio/mpeg': '.mp3',
    'audio/wav': '.wav',
    'audio/ogg': '.ogg',
    'audio/aac': '.aac',
    'audio/flac': '.flac'
  }
  return typeMap[mimeType] || '.audio'
}

watch(currentTime, (val) => {
  if (wavesurfer.value && !wavesurfer.value.isPlaying()) {
    isPlaying.value = false
  }
})

onMounted(() => {
  const reader = new FileReader()
  reader.onload = () => {
    const blob = reader.result as ArrayBuffer

    wavesurfer.value = WaveSurfer.create({
      container: waveformRef.value!,
      waveColor: '#999',
      progressColor: '#7e5bef',
      height: 60,
      responsive: true,
      barWidth: 2
    })

    wavesurfer.value.loadBlob(new Blob([blob]))

    wavesurfer.value.on('ready', () => {
      totalTime.value = wavesurfer.value!.getDuration()
    })

    wavesurfer.value.on('audioprocess', () => {
      currentTime.value = wavesurfer.value!.getCurrentTime()
    })

    wavesurfer.value.on('finish', () => {
      isPlaying.value = false
      currentTime.value = 0
    })
  }
  reader.readAsArrayBuffer(props.file)
})

onUnmounted(() => {
  wavesurfer.value?.destroy()
})
</script>