<template>
  <div class="h-full flex flex-col p-4">
    <h2 class="text-lg font-bold mb-4">人物關係圖進階編輯</h2>
    
    <!-- 上下文信息顯示 -->
    <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 class="text-sm font-semibold text-blue-800 mb-2">AI 可用的上下文信息：</h3>
      <div class="flex flex-wrap gap-4 text-sm text-blue-700">
        <div class="flex items-center">
          <span class="w-2 h-2 rounded-full mr-2" :class="sessionStore.transcriptText ? 'bg-green-500' : 'bg-gray-400'"></span>
          逐字稿 ({{ sessionStore.transcriptText ? `${sessionStore.transcriptText.length} 字符` : '無' }})
        </div>
        <div class="flex items-center">
          <span class="w-2 h-2 rounded-full mr-2" :class="currentGraphJson ? 'bg-green-500' : 'bg-gray-400'"></span>
          人物關係圖 ({{ currentGraphJson ? '已載入' : '無' }})
        </div>
        <div class="flex items-center">
          <span class="w-2 h-2 rounded-full mr-2" :class="sessionStore.reportText ? 'bg-green-500' : 'bg-gray-400'"></span>
          記錄內容 ({{ sessionStore.reportText ? '已生成' : '無' }})
        </div>
      </div>
    </div>
    
    <!-- 對話歷史區域 -->
    <div class="border rounded-lg p-4 mb-4 flex-1 overflow-y-auto bg-gray-50">
      <div v-if="chatHistory.length === 0" class="text-gray-500 text-center py-8">
        開始對話來編輯您的人物關係圖...
      </div>
      
      <div v-for="(message, index) in chatHistory" :key="index" class="mb-4">
        <!-- 用戶消息 -->
        <div v-if="message.role === 'user'" class="flex justify-end">
          <div class="bg-blue-500 text-white rounded-lg px-4 py-2 max-w-xs">
            {{ message.content }}
          </div>
        </div>
        
        <!-- AI 回應 -->
        <div v-else class="flex justify-start">
          <div class="bg-white border rounded-lg px-4 py-2 max-w-xs">
            {{ message.content }}
          </div>
        </div>
      </div>
      
      <!-- 載入中指示器 -->
      <div v-if="isLoading" class="flex justify-start">
        <div class="bg-white border rounded-lg px-4 py-2">
          <div class="flex items-center space-x-2">
            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span>AI 正在思考...</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 輸入區域 -->
    <div class="flex space-x-2 mb-4">
      <input
        v-model="userInput"
        @keyup.enter="sendMessage"
        :disabled="isLoading"
        class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="例如：請移除張三這個角色，或者：請加強李四和王五的關係..."
      />
      <button
        @click="sendMessage"
        :disabled="isLoading || !userInput.trim()"
        class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        發送
      </button>
    </div>
    
    <!-- 快速指令按鈕 -->
    <div class="mt-auto">
      <p class="text-sm text-gray-600 mb-2">快速指令：</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="quickCommand in quickCommands"
          :key="quickCommand"
          @click="userInput = quickCommand"
          class="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full"
        >
          {{ quickCommand }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useSessionStore } from '@/stores/useSessionStore'
import { usePersonGraphStore } from '@/stores/modules/personGraphStore'
import PersonGraphViewer from './PersonGraphViewer.vue'

// Props - 現在只支援 person 類型
interface Props {
  graphType?: 'person'
}

const props = withDefaults(defineProps<Props>(), {
  graphType: 'person'
})

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const sessionStore = useSessionStore()
const personGraphStore = usePersonGraphStore()
const userInput = ref('')
const isLoading = ref(false)
// 根據圖表類型分別儲存對話歷史
const chatHistory = ref<ChatMessage[]>([])


// 人物關係圖的快速指令
const quickCommands = computed(() => {
  return [
    '請基於逐字稿重新生成人物關係圖',
    '請簡化人物關係，只保留主要角色',
    '請加強主要角色之間的連結',
    '請突出逐字稿中的衝突關係',
    '請添加逐字稿中提到但遺漏的人物',
    '請重新組織關係結構使其更清晰'
  ]
})

// 獲取人物關係圖的JSON數據
const currentGraphJson = computed(() => personGraphStore.personGraphJson)

onMounted(() => {
  // 載入當前圖表類型的對話歷史
  loadChatHistory(props.graphType)
  
  // 如果沒有對話歷史且有現有的關係圖，添加歡迎消息
  if (chatHistory.value.length === 0 && currentGraphJson.value) {
    const suggestions = '• 調整人物關係\n• 添加或移除角色\n• 修改關係強度\n• 重新組織結構'
    
    chatHistory.value.push({
      role: 'assistant',
      content: `我已經為您載入了現有的人物關係圖。您可以告訴我需要如何修改，例如：\n${suggestions}`,
      timestamp: new Date()
    })
    
    // 保存歡迎消息
    saveChatHistory(props.graphType)
  }
})

// 對話歷史管理方法
function loadChatHistory(graphType: 'person') {
  const storageKey = `chatHistory_${graphType}_${sessionStore.sessionId}`
  const saved = localStorage.getItem(storageKey)
  if (saved) {
    try {
      const data = JSON.parse(saved)
      chatHistory.value = data.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    } catch (e) {
      chatHistory.value = []
    }
  } else {
    chatHistory.value = []
  }
}

function saveChatHistory(graphType: 'person') {
  const storageKey = `chatHistory_${graphType}_${sessionStore.sessionId}`
  localStorage.setItem(storageKey, JSON.stringify(chatHistory.value))
}

async function sendMessage() {
  if (!userInput.value.trim() || isLoading.value) return
  
  const message = userInput.value.trim()
  
  // 添加用戶消息到歷史
  chatHistory.value.push({
    role: 'user',
    content: message,
    timestamp: new Date()
  })
  
  userInput.value = ''
  isLoading.value = true
  
  try {
    const response = await fetch('/api/PersonGraphChat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        currentGraph: currentGraphJson.value,
        transcript: sessionStore.transcriptText,
        sessionId: sessionStore.sessionId,
        graphType: 'person'  // 固定為人物關係圖
      })
    })
    
    if (!response.body) throw new Error('No response body')
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let aiResponse = ''
    let newGraphJson = ''
    
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
          if (obj.type === 'response') {
            aiResponse += obj.content
          } else if (obj.type === 'graph') {
            // 直接使用完整的 JSON 內容，不再累加
            newGraphJson = obj.content
          }
        } catch (e) {
          // 忽略解析錯誤
        }
      }
    }
    
    // 添加 AI 回應到歷史
    if (aiResponse) {
      chatHistory.value.push({
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      })
    }
    
    // 更新關係圖
    if (newGraphJson) {
      try {
        // 驗證 JSON 格式
        const parsed = JSON.parse(newGraphJson)
        console.log(`PersonGraphChat: 更新${props.graphType}關係圖數據`, parsed)
        personGraphStore.setPersonGraphJson(newGraphJson)
        console.log(`PersonGraphChat: 已更新Store中的${props.graphType}數據`)
      } catch (e) {
        console.error('接收到的 JSON 格式錯誤:', newGraphJson)
        const graphTypeName = '人物關係圖'
        chatHistory.value.push({
          role: 'assistant',
          content: `抱歉，生成的${graphTypeName}格式有誤，請重試。`,
          timestamp: new Date()
        })
      }
    }
    
    // 保存對話歷史
    saveChatHistory(props.graphType)
    
  } catch (error) {
    console.error('發送消息失敗:', error)
    chatHistory.value.push({
      role: 'assistant',
      content: '抱歉，處理您的請求時發生錯誤，請稍後再試。',
      timestamp: new Date()
    })
    // 保存錯誤消息到歷史
    saveChatHistory(props.graphType)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 自定義滾動條 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 