<template>
  <div>
    <textarea
      class="w-full min-h-[50vh] border p-2 rounded"
      v-model="sessionStore.reportText"
      :readonly="sessionStore.reportStage === 'generating'"
    />
    <div v-if="sessionStore.reportStage === 'generating'" class="text-gray-500 mt-2">
      正在產生報告初稿...
    </div>
    <!-- 操作按鈕 -->
    <div v-else class="flex justify-between items-center pt-4 border-t">
      <div class="text-sm text-gray-500">
        <span v-if="hasValidReport" class="text-green-600 flex items-center gap-1">
          <i class="pi pi-check-circle"></i>
          報告生成完成，可以下載或進行下一步
        </span>
        <span v-else class="text-orange-600 flex items-center gap-1">
          <i class="pi pi-exclamation-triangle"></i>
          報告尚未生成完成
        </span>
      </div>
      
      <div class="flex gap-3">
        <Button 
          label="下載報告" 
          icon="pi pi-download" 
          severity="secondary" 
          @click="download"
          outlined
        />
        <Button 
          label="下一步：處遇計畫" 
          icon="pi pi-arrow-right" 
          :disabled="!hasValidReport"
          @click="goToTreatmentPlan"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import { useSessionStore } from '@/stores/useSessionStore'
import { storeToRefs } from 'pinia'
import { reportStageMessageMap, templateMessageMap } from '@/utils/stageMessages'

const sessionStore = useSessionStore()
const { reportText, reportStage, selectedTemplate } = storeToRefs(sessionStore)

const hasValidReport = computed(() => {
  return reportText.value.trim() && reportStage.value === 'done'
})

const stageMessage = computed(() => reportStageMessageMap[reportStage.value])
const templateMessages = computed(() => {
  const template = selectedTemplate.value as keyof typeof templateMessageMap
  return templateMessageMap[template] || []
})

const download = () => {
  const text = reportText.value.trim()
  if (!text) {
    alert('沒有可下載的內容')
    return
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = 'report.txt'
  a.click()

  URL.revokeObjectURL(url)
}

const goToTreatmentPlan = () => {
  sessionStore.setActiveTab(3) // 跳轉到處遇計畫分頁
}
</script>
