<!-- File: HomeView.vue -->
<template>
  <div class="font-sans bg-white transition-all duration-1000 ease-in-out">
    <BannerUpload :scrollTarget="dashboardRef" />
    <div
      ref="dashboardRef"
      class="flex w-full transition-all duration-1000 ease-in-out py-6 px-8"
      v-if="sessionStore.hasUploaded"
    >
      <DashboardPanel>
        <template #project-header>
          <div class="flex">
            <ConfirmPopup />
            <button
              class="md:w-[10%] mr-4 text-deepPurple font-semibold hover:text-deepBlue"
              @click="onClickCancel($event)"
            >
              取消
            </button>
            <div class="md:w-[90%] flex justify-center items-center">
              <p class="font-semibold text-lg">編輯區</p>
            </div>
            <button
              class="md:w-[10%] mr-4 text-deepPurple font-semibold hover:text-deepBlue"
              @click="onClickSave"
            >
              儲存
            </button>
          </div>
        </template>

        <template #transcript-tab>
          <!-- 逐字稿的內容 -->
          <div class="">
            <!-- <textarea row="100" class="h-full block rounded-lg m-0 px-4 py-2  w-full text-gray-900 bg-transparent  border outline-none" v-model="projectStore.tempTranscript"></textarea> -->
            <PlayerPanel v-if="sessionStore.audioFile" :file="sessionStore.audioFile" />
            <TranscriptEditor />
          </div>
        </template>
        
        <template #report-config-tab>
          <!-- 報告設定內容 -->
          <ReportConfigPanel />
        </template>
        
        <template #ai-doc-tab>
          <!-- AI 智能文件的內容 -->
          <div class="">
            <ReportEditor />
          </div>
        </template>
        
        <template #treatment-plan-tab>
          <!-- 處遇計畫內容 -->
          <TreatmentPlanEditor />
        </template>
        
        <template #person-graph-tab>
          <PersonGraphEditor />
        </template>
      </DashboardPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BannerUpload from '../components/Banner/BannerUpload.vue'
import TranscriptEditor from '../components/TypescriptEditor/TypescriptEditor.vue'
import ReportEditor from '../components/ReportSession/ReportEditor.vue'
import ReportConfigPanel from '../components/ReportConfig/ReportConfigPanel.vue'
import TreatmentPlanEditor from '../components/TreatmentPlan/TreatmentPlanEditor.vue'
import DashboardPanel from '@/components/Dashboard/DashboardPanel.vue'
import PlayerPanel from '@/components/Player/PlayerPanel.vue'
import { useSessionStore } from '@/stores/useSessionStore'
import { useConfirm } from 'primevue/useconfirm'
import ConfirmPopup from 'primevue/confirmpopup'
import { useToast } from 'primevue/usetoast'
import PersonGraphEditor from '../components/PersonGraph/PersonGraphEditor.vue'
const sessionStore = useSessionStore()
const dashboardRef = ref<HTMLElement | null>(null)
const confirm = useConfirm()
const toast = useToast()
const onClickSave = () => {
  toast.add({
    severity: 'success',
    summary: '已儲存',
    detail: '您的內容已成功儲存',
    life: 3000 // 幾毫秒後消失（這裡是 3 秒）
  })
}

const onClickCancel = (event: Event) => {
  confirm.require({
    target: event.currentTarget as HTMLElement,
    message: '你確定要清除內容嗎？重新整理後網頁將不會保留目前生成的逐字稿與報告',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: '確認',
    rejectLabel: '取消',
    acceptClass: 'p-button-danger',
    accept: () => {
      sessionStore.reset()
    }
  })
}
</script>
