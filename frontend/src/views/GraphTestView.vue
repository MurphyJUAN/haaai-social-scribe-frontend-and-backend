<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">關係圖整合測試</h1>
    
    <!-- 測試控制面板 -->
    <div class="mb-6 p-4 border rounded-lg bg-gray-50">
      <h2 class="text-lg font-semibold mb-4">測試控制</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 圖表類型選擇 -->
        <div>
          <label class="block text-sm font-medium mb-2">圖表類型</label>
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input 
                type="radio" 
                v-model="selectedGraphType" 
                value="person" 
                class="mr-2"
              >
              人物關係圖 (vis.js)
            </label>
            <!-- 移除家庭關係圖選項 -->
          </div>
        </div>
        
        <!-- 測試操作 -->
        <div>
          <label class="block text-sm font-medium mb-2">測試操作</label>
          <div class="flex space-x-2">
            <button 
              @click="loadSampleData"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              :disabled="isLoading"
            >
              載入測試數據
            </button>
            <button 
              @click="generateGraph"
              class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              :disabled="isLoading || !sampleText"
            >
              生成圖表
            </button>
                    <button 
          @click="clearData" 
          class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          清除數據
        </button>
        <!-- 移除家庭關係圖測試按鈕 -->
          </div>
        </div>
      </div>
      
      <!-- 測試數據輸入 -->
      <div class="mt-4">
        <label class="block text-sm font-medium mb-2">測試逐字稿內容</label>
        <textarea 
          v-model="sampleText"
          rows="4"
          class="w-full p-3 border rounded-lg"
          placeholder="輸入測試用的逐字稿內容..."
        ></textarea>
      </div>
      
      <!-- 狀態顯示 -->
      <div class="mt-4 flex items-center space-x-4">
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full mr-2" :class="isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-gray-400'"></span>
          <span class="text-sm">{{ isLoading ? '處理中...' : '就緒' }}</span>
        </div>
        <div class="flex items-center">
          <span class="w-3 h-3 rounded-full mr-2" :class="graphData ? 'bg-green-500' : 'bg-gray-400'"></span>
          <span class="text-sm">{{ graphData ? '圖表已載入' : '無圖表數據' }}</span>
        </div>
      </div>
    </div>
    
    <!-- 測試按鈕區域 -->
    <div class="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 class="font-semibold mb-4">手動測試功能</h3>
      <div class="flex gap-3">
        <Button 
          label="測試人物關係圖" 
          icon="pi pi-users"
          @click="handleTestPersonGraph"
          severity="secondary"
          outlined
        />
        <!-- 移除家庭關係圖測試按鈕 -->
      </div>
    </div>
    
    <!-- 圖表顯示區域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 圖表檢視器 -->
      <div class="border rounded-lg">
        <div class="p-4 border-b bg-gray-50">
          <h3 class="font-semibold">
            {{ selectedGraphType === 'person' ? '人物關係圖 (vis.js)' : '家庭關係圖 (FamilyTree.js)' }}
          </h3>
        </div>
        <div class="h-96">
          <PersonGraphViewer :graph-type="selectedGraphType" />
        </div>
      </div>
      
      <!-- 原始數據檢視 -->
      <div class="border rounded-lg">
        <div class="p-4 border-b bg-gray-50">
          <h3 class="font-semibold">原始 JSON 數據</h3>
        </div>
        <div class="h-96 p-4 overflow-auto">
          <pre v-if="graphData" class="text-sm bg-gray-100 p-3 rounded">{{ formatJson(graphData) }}</pre>
          <div v-else class="text-gray-500 text-center py-8">
            尚無圖表數據
          </div>
        </div>
      </div>
    </div>
    
    <!-- 格式比較 -->
    <div class="mt-6 p-4 border rounded-lg bg-blue-50">
      <h3 class="font-semibold mb-4">格式說明</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 class="font-medium text-blue-800">人物關係圖 (vis.js 格式)</h4>
          <pre class="mt-2 bg-white p-2 rounded text-xs">
{
  "nodes": [
    {
      "id": "案主",
      "label": "案主", 
      "age": "35",
      "attributes": {...}
    }
  ],
  "edges": [
    {
      "from": "案主",
      "to": "配偶",
      "label": "夫妻",
      "relationship_quality": "良好"
    }
  ]
}
          </pre>
        </div>
        <div>
          <h4 class="font-medium text-green-800">家庭關係圖 (FamilyTree.js 格式)</h4>
          <pre class="mt-2 bg-white p-2 rounded text-xs">
[
  {
    "id": 1,
    "name": "案主",
    "gender": "female",
    "birth_year": "1988",
    "pids": [2],
    "mid": 3,
    "fid": 4,
    "tags": ["主要當事人"]
  }
]
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePersonGraphStore } from '@/stores/modules/personGraphStore'
import { useSessionStore } from '@/stores/useSessionStore'
import PersonGraphViewer from '@/components/PersonGraph/PersonGraphViewer.vue'

const personGraphStore = usePersonGraphStore()
const sessionStore = useSessionStore()

// 狀態管理
const selectedGraphType = ref<'person'>('person')
const isLoading = ref(false)
const sampleText = ref('')
const graphData = computed(() => personGraphStore.personGraphJson)

// 測試數據樣本
const familyTreeTestData = [
  {
    id: 1,
    name: "張小明",
    gender: "male",
    birth_year: "1990",
    pids: [2],
    mid: 3,
    fid: 4,
    tags: ["案主", "主要當事人"]
  },
  {
    id: 2,
    name: "林小玉",
    gender: "female", 
    birth_year: "1992",
    pids: [1],
    mid: 5,
    fid: 6,
    tags: ["配偶"]
  },
  {
    id: 3,
    name: "王美麗",
    gender: "female",
    birth_year: "1965",
    pids: [4],
    tags: ["案主母親"]
  },
  {
    id: 4,
    name: "張大華",
    gender: "male",
    birth_year: "1963",
    pids: [3],
    tags: ["案主父親"]
  },
  {
    id: 5,
    name: "陳老媽",
    gender: "female",
    birth_year: "1968",
    pids: [6],
    tags: ["配偶母親"]
  },
  {
    id: 6,
    name: "林老爸",
    gender: "male",
    birth_year: "1966",
    pids: [5],
    tags: ["配偶父親"]
  },
  {
    id: 7,
    name: "張小寶",
    gender: "male",
    birth_year: "2020",
    mid: 2,
    fid: 1,
    tags: ["子女"]
  }
]
const sampleDataTemplates = {
  person: `案主王小美，35歲女性，已婚，育有一子一女（8歲和5歲）。目前面臨工作壓力過大的問題，經常與先生王大明發生爭執。王小美的母親住在附近，經常來幫忙照顧孩子，但有時會對教養方式有不同意見。王小美提到她與同事關係還算不錯，但覺得缺乏深度的友誼支持。先生王大明工作穩定，但工時較長，回家後較少參與家務和育兒。兩個孩子在學校表現正常，但哥哥最近開始出現注意力不集中的問題。此外，王小美還提到她有一個好朋友李小華，會定期聯絡並提供情感支持。`
}

// 載入測試數據
const loadSampleData = () => {
  sampleText.value = sampleDataTemplates.person
}

// 生成圖表
const generateGraph = async () => {
  if (!sampleText.value.trim()) return
  
  try {
    isLoading.value = true
    
    // 設置逐字稿到 session store
    sessionStore.transcriptText = sampleText.value
    
    const response = await fetch('/api/PersonGraph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: sampleText.value,
        graphType: selectedGraphType.value,
        sessionId: sessionStore.sessionId
      })
    })
    
    if (!response.body) throw new Error('No response body')
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let graphJson = ''
    
    // 設置生成中狀態
    personGraphStore.setGraphStage(selectedGraphType.value, 'generating')
    
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      
      buffer += decoder.decode(value, { stream: true })
      let lines = buffer.split('\n')
      buffer = lines.pop() || ''
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const parsed = JSON.parse(line)
            if (parsed.status === 'data') {
              graphJson += parsed.data
            } else if (parsed.status === 'complete') {
              // 設置最終數據
              personGraphStore.setGraphJson(selectedGraphType.value, graphJson)
              personGraphStore.setGraphStage(selectedGraphType.value, 'done')
              console.log(`${selectedGraphType.value} 圖表生成完成`)
              return
            }
          } catch (e) {
            // 可能是部分數據，繼續累積
            graphJson += line
          }
        }
      }
    }
    
  } catch (error) {
    console.error('生成圖表錯誤:', error)
    personGraphStore.setGraphStage(selectedGraphType.value, 'error')
  } finally {
    isLoading.value = false
  }
}

// 清除數據
const clearData = () => {
  personGraphStore.setGraphJson(selectedGraphType.value, '')
  personGraphStore.setPersonGraphStage('idle')
  sampleText.value = ''
}

// 移除家庭關係圖測試數據載入功能

// 格式化 JSON 顯示
const formatJson = (jsonString: string) => {
  try {
    const parsed = JSON.parse(jsonString)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return jsonString
  }
}

// 監聽圖表類型變化，自動載入對應的測試數據
watch(selectedGraphType, () => {
  if (!sampleText.value) {
    loadSampleData()
  }
})

// 初始化
loadSampleData()

const handleTestPersonGraph = async () => {
  const testText = `
    案主王小美，35歲，家庭主婦，與丈夫陳大明（38歲）結婚10年，育有兩個兒子：
    大兒子陳小華（8歲）就讀小學二年級，小兒子陳小明（5歲）就讀幼稚園。
    
    案主的母親林阿嬤（65歲）偶爾會來幫忙照顧孫子，住在附近。
    案主的姊姊王大美（40歲）已婚，與案主關係良好。
    
    丈夫的父親陳老爺爺（70歲）身體不太好，需要照護。
    丈夫有一個弟弟陳小弟（35歲）未婚，與父母同住。
  `
  
  try {
    sessionStore.setPersonGraphStage('generating')
    sessionStore.setPersonGraphJson('')
    
    const response = await fetch('/api/PersonGraph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: testText,
        graphType: 'person',
        sessionId: 'manual_test_person'
      })
    })
    
    if (!response.body) {
      sessionStore.setPersonGraphStage('done')
      return
    }
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let content = ''
    
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
          content += obj.content
        } catch (e) {
          // 忽略解析錯誤
        }
      }
    }
    
    // 清理 JSON 內容
    const cleanedContent = content.replace(/```json\s*/gmi, '').replace(/```\s*$/gm, '').trim()
    
    sessionStore.setPersonGraphJson(cleanedContent)
    sessionStore.setPersonGraphStage('done')
    
    console.log('手動測試人物關係圖完成:', cleanedContent.substring(0, 200))
  } catch (err) {
    console.error('手動測試人物關係圖失敗:', err)
    sessionStore.setPersonGraphStage('done')
  }
}

const handleTestFamilyGraph = async () => {
  const testText = `
    案主王小美，35歲，家庭主婦，與丈夫陳大明（38歲）結婚10年，育有兩個兒子：
    大兒子陳小華（8歲）就讀小學二年級，小兒子陳小明（5歲）就讀幼稚園。
    
    案主的母親林阿嬤（65歲）偶爾會來幫忙照顧孫子，住在附近。
    案主的姊姊王大美（40歲）已婚，與案主關係良好。
    
    丈夫的父親陳老爺爺（70歲）身體不太好，需要照護。
    丈夫有一個弟弟陳小弟（35歲）未婚，與父母同住。
  `
  
  try {
    personGraphStore.setFamilyGraphStage('generating')
    personGraphStore.setFamilyGraphJson('')
    
    const response = await fetch('/api/PersonGraph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: testText,
        graphType: 'family',
        sessionId: 'manual_test_family'
      })
    })
    
    if (!response.body) {
      personGraphStore.setFamilyGraphStage('done')
      return
    }
    
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let content = ''
    
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
          content += obj.content
        } catch (e) {
          // 忽略解析錯誤
        }
      }
    }
    
// 移除家庭關係圖測試功能
}
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>