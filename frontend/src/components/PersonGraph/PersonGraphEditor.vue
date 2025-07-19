<template>
  <div class="w-full h-full p-4">
    <!-- 標題區域 -->
    <div class="mb-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold">人物關係圖分析</h2>
      </div>
      
      <!-- 類型說明 -->
      <p class="text-sm text-gray-600 mt-2">
        分析所有人際關係、社會網絡、朋友同事等互動關係
      </p>
    </div>
    
    <!-- 左右佈局 -->
    <div class="flex gap-4">
      <!-- 左側：關係圖顯示區 -->
      <div class="flex-1 h-[calc(100vh-120px)]">
        <PersonGraphViewer graph-type="person" />
      </div>
      
      <!-- 右側：對話區 -->
      <div class="flex-1 h-[calc(100vh-120px)]">
        <PersonGraphChat graph-type="person" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PersonGraphViewer from './PersonGraphViewer.vue'
import PersonGraphChat from './PersonGraphChat.vue'
</script>

