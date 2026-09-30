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
      :class="isMeasured ? 'pt-[var(--hub-pt)] pb-[var(--hub-pb)] sm:pt-0 sm:pb-0' : 'h-screen'"
      :style="isMeasured ? { '--hub-pt': `${mobileTop}px`, '--hub-pb': `${mobileBottom}px` } : undefined"
    >
      <div v-if="!isMeasured" class="flex-1 sm:hidden" />
      <div ref="panelEl" class="w-full min-w-0 pl-3 sm:pl-20 sm:pr-15">
        <ConceptPanel />
      </div>
      <div v-if="!isMeasured" class="flex-[3] sm:hidden" />
    </div>

    <!-- 右の列：ページ本体の下にフッター（中身が短いページでも画面の一番下に来る） -->
    <div class="relative min-w-0 pr-1 flex flex-col sm:min-h-screen">
      <div class="flex-1">
        <slot />
      </div>
      <AppFooter class="mb-10 mx-3 sm:mx-0" />
    </div>
  </div>
</template>

<script setup>
const panelEl = ref(null)
const mobileGap = ref(0)
// 詩の高さを測れたか（測れるまでは上1：下3で空きを分けておく）
const isMeasured = ref(false)

// スマホは上端にメニューのバーが固定されているので、「舟」がその下に隠れないよう、バーの下から最低24pxは空ける
const MIN_GAP_BELOW_BAR = 24
const { barHeight: mobileBarHeight } = useMobileMenu()
// Contact は中身（所在地）が短いので、下の余白は取らずにすぐフォームを続ける
const route = useRoute()
const mobileBottom = computed(() => (route.path === '/contact' ? 0 : mobileGap.value))

const mobileTop = computed(() => Math.max(mobileGap.value / 2, mobileBarHeight.value + MIN_GAP_BELOW_BAR))

// 上下中央に置いたときの、詩の上（または下）の空き
function measure() {
  const height = panelEl.value?.offsetHeight || 0
  mobileGap.value = Math.max(0, (window.innerHeight - height) / 2)
  isMeasured.value = true
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
