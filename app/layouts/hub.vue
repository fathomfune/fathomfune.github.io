<template>
  <!-- デスクトップは左33%・右67%のグリッド。左は画面に固定し、右（ページ本体）だけがスクロールする -->
  <div class="min-h-screen sm:grid sm:grid-cols-[33%_67%]">
    <!--
      デスクトップは上下中央。
      スマホは上下中央のときの空きを G として、上を G/2、下を G のままにし、そのぶん以降のコンテンツを上に詰める。
      詩の高さを測れるまでは、上1：下3で空きを分けておく
    -->
    <div
      class="flex flex-col sm:h-screen sm:flex-row sm:items-center sm:sticky sm:top-0"
      :class="mobileGap ? 'pt-[var(--hub-pt)] pb-[var(--hub-pb)] sm:pt-0 sm:pb-0' : 'h-screen'"
      :style="mobileGap ? { '--hub-pt': `${mobileGap / 2}px`, '--hub-pb': `${mobileGap}px` } : undefined"
    >
      <div v-if="!mobileGap" class="flex-1 sm:hidden" />
      <div ref="panelEl" class="w-full min-w-0 pl-20">
        <ConceptPanel />
      </div>
      <div v-if="!mobileGap" class="flex-[3] sm:hidden" />
    </div>

    <div class="relative min-w-0 pr-1">
      <slot />
    </div>
  </div>
</template>

<script setup>
const panelEl = ref(null)
const mobileGap = ref(0)

// 上下中央に置いたときの、詩の上（または下）の空き
function measure() {
  const height = panelEl.value?.offsetHeight || 0
  mobileGap.value = Math.max(0, (window.innerHeight - height) / 2)
}

let observer
let lastWidth = 0

// スマホはスクロールでアドレスバーが出入りして高さが変わるので、幅が変わったときだけ測り直す
function onResize() {
  if (window.innerWidth === lastWidth) return
  lastWidth = window.innerWidth
  measure()
}

onMounted(() => {
  lastWidth = window.innerWidth
  measure()
  // フォントの読み込みや言語の切り替えで詩の高さが変わったら測り直す
  observer = new ResizeObserver(measure)
  if (panelEl.value) observer.observe(panelEl.value)
  window.addEventListener('resize', onResize, { passive: true })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', onResize)
})
</script>
