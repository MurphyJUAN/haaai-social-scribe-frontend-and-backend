<template>
  <div ref="graphContainer" class="w-full h-full border border-gray-300"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Network, DataSet } from 'vis-network/standalone'
import type { Node, Edge } from 'vis-network/standalone'

const props = defineProps<{
  graphJson: string // 傳入的 JSON 字串
}>()

const graphContainer = ref<HTMLElement | null>(null)
let network: Network | null = null

function renderGraph(jsonStr: string) {
  if (!graphContainer.value) return
  try {
    const data = JSON.parse(jsonStr)
    const nodes = new DataSet<Node>(data.nodes)
    const edges = new DataSet<Edge>(
      data.edges.map((e: any) => ({
        from: e.from,
        to: e.to,
        label: e.label,
        arrows: 'to'
      }))
    )
    // 銷毀舊的 network
    if (network) {
      network.destroy()
      network = null
    }
    network = new Network(graphContainer.value, { nodes, edges }, {
      layout: { improvedLayout: true },
      physics: { stabilization: true },
      edges: { smooth: true }
    })
  } catch (e) {
    // JSON 格式錯誤時清空圖形
    if (network) {
      network.destroy()
      network = null
    }
  }
}

// 當 props.graphJson 變動時自動渲染
watch(() => props.graphJson, (val) => {
  if (val) renderGraph(val)
}, { immediate: true })

onMounted(() => {
  if (props.graphJson) renderGraph(props.graphJson)
})
</script> 