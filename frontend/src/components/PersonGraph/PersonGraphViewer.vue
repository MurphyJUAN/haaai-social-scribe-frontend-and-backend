<template>
  <div class="h-full flex flex-col">
    <div v-if="currentGraphStage === 'generating'" class="flex-1 flex items-center justify-center text-gray-500">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <div>正在生成人物關係圖...</div>
      </div>
    </div>
    <div v-else-if="!currentJson || !currentJson.trim()" class="flex-1 flex items-center justify-center text-gray-400">
      <div class="text-center">
        <i :class="graphType === 'person' ? 'pi pi-users' : 'pi pi-home'" class="text-4xl mb-2"></i>
        <div>尚未有人物關係圖資料</div>
      </div>
    </div>
    <div v-else-if="!isValidJson" class="h-full flex flex-col">
      <div class="text-red-500 mb-2">JSON 格式錯誤，請檢查內容！</div>
      <pre class="bg-gray-100 p-2 rounded overflow-auto text-sm flex-1">{{ currentJson }}</pre>
    </div>
    <div v-else class="h-full">
      <!-- 人物關係圖使用 vis.js -->
      <VisNetworkGraph 
        :graphJson="currentJson" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePersonGraphStore } from '@/stores/modules/personGraphStore'
import VisNetworkGraph from './vis-network/VisNetworkGraph.vue'

// Props - 現在只支援 person 類型
interface Props {
  graphType?: 'person'
}

const props = withDefaults(defineProps<Props>(), {
  graphType: 'person'
})

const personGraphStore = usePersonGraphStore()

// 只獲取人物關係圖數據
const currentJson = computed(() => personGraphStore.personGraphJson)
const currentGraphStage = computed(() => personGraphStore.personGraphStage)

const isValidJson = computed(() => {
  if (!currentJson.value) return false
  try {
    JSON.parse(currentJson.value)
    return true
  } catch {
    return false
  }
})

</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style> 