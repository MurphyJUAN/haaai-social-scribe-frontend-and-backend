<!-- File: TypescriptEditor.vue -->
<template>
  <div class="transition-all duration-1000 ease-in-out w-full text-gray-800">
    <Message v-if="sessionStore.transcriptStage !== 'idle'">{{ stageMessage }}</Message>

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
      <textarea
        ref="textareaRef"
        class="w-full h-auto min-h-[50vh] border p-2 rounded resize-none"
        v-model="sessionStore.transcriptText"
      />
      <div class="w-full mx-auto flex justify-center space-x-4">
        <button
          class="flex justify-center items-center text-center mt-4 bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-700"
          @click="download"
        >
          <img src="@/assets/downloads.png" alt="icon" class="h-5 mr-1" />
          下載逐字稿
        </button>

        <Button
          class="mt-4 text-purple-700 flex"
          severity="help"
          @click="proceedToReportConfig"
        >
          <img src="@/assets/add.png" alt="icon" class="h-5 mr-1" />
          下一步：報告設定
        </Button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import axios from 'axios'
import Message from 'primevue/message'
import Button from 'primevue/button'
import { useSessionStore } from '@/stores/useSessionStore'
import { storeToRefs } from 'pinia'
import { transcriptStageMessageMap } from '@/utils/stageMessages'

const sessionStore = useSessionStore()
const { 
  transcriptStage, 
  transcriptText
} = storeToRefs(sessionStore)

const stageMessage = computed(() => transcriptStageMessageMap[transcriptStage.value])

// 初始化會話ID
onMounted(() => {
  sessionStore.initializeSession()
})

// 跳轉到報告設定頁面
const proceedToReportConfig = () => {
  const transcript = transcriptText.value?.trim()
  if (!transcript) {
    alert('請先輸入或上傳逐字稿內容')
    return
  }
  
  // 跳轉到報告設定分頁 (索引 1)
  sessionStore.setActiveTab(1)
}


const download = () => {
  const text = transcriptText.value.trim()
  if (!text) {
    alert('沒有可下載的內容')
    return
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'transcript.txt'
  a.click()

  URL.revokeObjectURL(url)
}
</script>
