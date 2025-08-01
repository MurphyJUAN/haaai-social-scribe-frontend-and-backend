<script setup lang="ts">
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

// import { useProjectStore } from '@/stores/projectStore'
import { useSessionStore } from '@/stores/useSessionStore'
import { storeToRefs } from 'pinia'
// const projectStore = useProjectStore()
const sessionStore = useSessionStore()
const { activeTabIndex, reportStage } = storeToRefs(sessionStore)
</script>

<template>
  <div class="w-full">
    <slot name="project-header"></slot>

    <TabView
      v-model:activeIndex="activeTabIndex"
      :pt="{
        tabpanel: {
          headerAction: ({ parent, context, props }) => ({
            class: [
              'relative font-bold flex items-center p-5 -mb-[2px] border-b-2 rounded-t-md',
              'transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring focus-visible:ring-inset',

              'cursor-pointer select-none',

              context.index === parent.state.d_activeIndex
                ? 'text-deepBlue border-deepBlue'
                : 'text-lightPurple border-transparent hover:text-deepBlue hover:border-deepBlue'
            ]
          })
        }
      }"
    >
      <!--<TabPanel header="錄音室"><slot name="recording-tab" /> </TabPanel>-->

      <!--<TabPanel header="逐字稿" :disabled="!projectStore.tempTranscript?.trim()">-->
      <TabPanel header="逐字稿">
        <slot name="transcript-tab" />
      </TabPanel>
      
      <TabPanel header="記錄設定">
        <slot name="report-config-tab" />
      </TabPanel>
      
 
      <TabPanel header="記錄初稿" :disabled="reportStage === 'idle'">
        <slot name="ai-doc-tab" />
      </TabPanel>
      
      <TabPanel header="處遇計畫設定">
        <slot name="treatment-plan-tab" />
      </TabPanel>
      
      <TabPanel header="人物關係圖(Beta)">
        <slot name="person-graph-tab" />
      </TabPanel>
    </TabView>
  </div>
</template>
