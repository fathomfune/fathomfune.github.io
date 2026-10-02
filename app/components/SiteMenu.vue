<template>
  <!--
    スマホ：左上に固定したバー。メニューは決まった順番で横に並び、折り返して積み重なる。
    トップでは、散らばったメニューがスクロールでバーまで上がってきたものから順に現れる。ほかのページでは最初から全部並ぶ
  -->
  <nav
    ref="mobileBar"
    class="sm:hidden fixed top-0 inset-x-0 z-40 bg-white px-3 py-2.5 transition-opacity duration-300"
    :class="isDissolving ? 'opacity-0' : 'opacity-100'"
  >
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 font-dm-mono text-[0.65rem] text-gray-900 tracking-wider">
      <NuxtLink
        v-for="link in MENU_LINKS" :key="link.label"
        :to="link.to"
        :target="link.external ? '_blank' : undefined"
        :rel="link.external ? 'noopener noreferrer' : undefined"
        class="inline-flex items-center gap-1 transition-opacity duration-300"
        :class="isInMobileBar(link) ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        :tabindex="isInMobileBar(link) ? undefined : -1"
      >
        <span class="inline-block rotate-45">{{ link.mark }}</span>{{ link.label }}
      </NuxtLink>

      <button
        type="button"
        class="ml-auto"
        @click="lang = lang === 'en' ? 'ja' : 'en'"
      >☄︎. {{ lang === 'en' ? 'EN' : 'JP' }}</button>
    </div>
  </nav>

  <!-- メニューは画面に固定したレイヤーに置く。トップではスクロール量だけ上へずらして上端で止め、ほかのページでは最初から上端に並べる -->
  <div
    ref="menuLayer"
    class="hidden sm:block fixed inset-y-0 right-0 left-[33%] z-30 pointer-events-none transition-opacity duration-300"
    :class="isDissolving ? 'opacity-0' : 'opacity-100'"
  >
    <NuxtLink v-for="(link, i) in scatterLinks" :key="link.label"
      :ref="setLinkEl(i)"
      :to="link.to"
      :target="link.external ? '_blank' : undefined"
      :rel="link.external ? 'noopener noreferrer' : undefined"
      class="sparkle-link group pointer-events-auto absolute inline-flex items-center gap-1 font-dm-mono text-[0.65rem] text-gray-900 tracking-wider hover:text-[#0365a6] transition-colors duration-500"
      :style="{ top: topStyle(link.top), left: link.left, right: link.right, transform: `translateY(${-menuOffset(link.top, i)}px)` }"
    >
      <span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] rotate-45 group-hover:rotate-0">{{ link.mark }}</span>{{ link.label }}

      <span
        v-for="(p, pi) in sparkles" :key="pi"
        class="sparkle-particle pointer-events-none absolute left-1/2 top-1/2 text-gray-400"
        :style="{ '--dx': p.dx, '--dy': p.dy, animationDelay: p.delay }"
      >{{ p.ch }}</span>
    </NuxtLink>

    <!-- 文字の切り替え（EN / JP）。ほかのメニューより必ず右に置く -->
    <div
      ref="langEl"
      class="pointer-events-auto absolute right-[3%] inline-flex items-center gap-1.5 font-dm-mono text-[0.65rem] tracking-wider"
      :style="{ top: topStyle(LANG_TOP), transform: `translateY(${-menuOffset(LANG_TOP, 'lang')}px)` }"
    >
      <!-- 今の言語だけを「☄︎. EN」「☄︎. JP」と出し、押すともう一方に切り替える -->
      <button
        type="button"
        class="text-gray-900 hover:text-[#0365a6] transition-colors duration-500"
        @click="lang = lang === 'en' ? 'ja' : 'en'"
      >☄︎. {{ lang === 'en' ? 'EN' : 'JP' }}</button>
    </div>

    <button
      v-for="symbol in (isHome ? shuffleSymbols : [])" :key="symbol.ch"
      type="button"
      class="pointer-events-auto absolute text-[0.6875rem] text-gray-600 hover:text-gray-900 transition-colors duration-500"
      :style="{ top: symbol.top, left: symbol.left, right: symbol.right, transform: `translateY(${-scrollY}px)` }"
      @click="shufflePositions"
    >{{ symbol.ch }}</button>
  </div>
</template>

<script setup>
const route = useRoute()
const isHome = computed(() => route.path === '/')

const sparkles = [
  { ch: '⁺', dx: '18px', dy: '-16px', delay: '0s' },
  { ch: '⊹', dx: '-16px', dy: '-18px', delay: '0.06s' },
  { ch: '𖦹', dx: '-18px', dy: '14px', delay: '0.03s' },
  { ch: '⁺', dx: '2px', dy: '-24px', delay: '0.09s' }
]

// メニューの中身と並び順（スマホのバーはいつもこの順番）
const MENU_LINKS = [
  { to: '/texts', label: 'Texts', mark: '⁺' },
  { to: '/building', label: 'First frost', mark: '⊹' },
  { to: '/soilsnap', label: 'Soilsnap', mark: '⊹' },
  { to: '/contact', label: 'Contact', mark: '⊹' },
  { to: '/sound', label: 'Sound', mark: '᠀.' },
  { to: 'https://www.instagram.com/fathomfune', label: 'Instagram', mark: '⊹', external: true }
]

const { stuck: mobileStuck, barHeight: mobileBarHeight } = useMobileMenu()
const mobileBar = ref(null)

function isInMobileBar(link) {
  return !isHome.value || !!mobileStuck.value[link.label]
}

const scatterLinks = ref([
  { to: '/texts', label: 'Texts', mark: '⁺', top: '10%', left: '13%' },
  { to: '/building', label: 'First frost', mark: '⊹', top: '70%', right: '9%' },
  { to: '/soilsnap', label: 'Soilsnap', mark: '⊹', top: '44%', left: '37%' },
  { to: '/contact', label: 'Contact', mark: '⊹', top: '20%', right: '24%' },
  { to: '/sound', label: 'Sound', mark: '᠀.', top: '88%', left: '19%' },
  { to: 'https://www.instagram.com/fathomfune', label: 'Instagram', mark: '⊹', top: '60%', right: '45%', external: true }
])

const shuffleSymbols = [
  { ch: '+ ⁺', top: '30%', right: '6%' },
  { ch: '⁺ ⊹', top: '56%', left: '10%' },
  { ch: '⊹𓂃 ࣪', top: '94%', left: '55%' },
  { ch: '☄︎.𖥔 ݁', top: '12%', left: '22%' }
]

// 文字の切り替え（texts の JA/EN と共有）
const lang = useTextLang()
const LANG_TOP = '10%'
const langEl = ref(null)

const isDissolving = ref(false)

// メニューが上端に張り付く位置（px）
const STICK_TOP = 10

const scrollY = ref(0)
const viewportHeight = ref(0)

function onScroll() {
  scrollY.value = window.scrollY
}

function onResize() {
  viewportHeight.value = window.innerHeight
  placeWithoutOverlap(true)
}

// 元の位置（top: xx%）から上端までは一緒にスクロールし、そこから先は止まる。トップ以外では常に上端
// 文字が半端なピクセル位置に描かれると、字間や太さがほかと違って見えるので、位置は整数pxにそろえる
function naturalTopPx(top) {
  return Math.round((parseFloat(top) / 100) * viewportHeight.value)
}

// top（xx%）を整数pxに直す。画面の高さを測るまでは%のまま
function topStyle(top) {
  return viewportHeight.value ? `${naturalTopPx(top)}px` : top
}

function stuckOffset(top) {
  const toTop = Math.max(0, naturalTopPx(top) - STICK_TOP)
  return isHome.value ? Math.min(Math.round(scrollY.value), toTop) : toTop
}

// ページを移るときは、メニューを今の位置のまま消してから、新しい位置で現れるようにする（ディゾルブ）
const DISSOLVE_MS = 300
const frozenOffsets = ref(null)
let dissolveTimer

function menuOffset(top, key) {
  const frozen = frozenOffsets.value?.[key]
  return frozen ?? stuckOffset(top)
}

// 切り替えの幅が変わるので、ほかのメニューが重ならないか置き直す
watch(lang, () => nextTick(() => placeWithoutOverlap(true)))

const router = useRouter()
let dissolveStartedAt = 0

const removeBeforeGuard = router.beforeEach((to, from) => {
  if (import.meta.server || to.path === from.path) return

  // 移る前の位置を覚えておき、消えるまではそこから動かさない
  if (!frozenOffsets.value) {
    const offsets = { lang: stuckOffset(LANG_TOP) }
    scatterLinks.value.forEach((link, i) => {
      offsets[i] = stuckOffset(link.top)
    })
    frozenOffsets.value = offsets
  }
  clearTimeout(dissolveTimer)
  dissolveStartedAt = Date.now()
  isDissolving.value = true
})

// ページの移動が終わり、消えきってから新しい位置で現す
const removeAfterHook = router.afterEach(() => {
  if (import.meta.server || !frozenOffsets.value) return

  const remaining = Math.max(0, DISSOLVE_MS - (Date.now() - dissolveStartedAt))
  clearTimeout(dissolveTimer)
  dissolveTimer = setTimeout(() => {
    frozenOffsets.value = null
    requestAnimationFrame(() => {
      isDissolving.value = false
    })
  }, remaining)
})

let mobileBarObserver

onMounted(() => {
  if (mobileBar.value) {
    mobileBarObserver = new ResizeObserver(() => {
      mobileBarHeight.value = mobileBar.value?.offsetHeight || 0
    })
    mobileBarObserver.observe(mobileBar.value)
  }
  onResize()
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  clearTimeout(dissolveTimer)
  mobileBarObserver?.disconnect()
  removeBeforeGuard()
  removeAfterHook()
})

function randomTop() {
  return `${Math.floor(Math.random() * 88) + 4}%`
}

const menuLayer = ref(null)
const linkEls = []

function setLinkEl(i) {
  return (el) => {
    linkEls[i] = el?.$el ?? el
  }
}

// 上に張り付くと全メニューが同じ高さに並ぶので、横方向の範囲が重ならないように置く
const MENU_GAP = 16

function placeWithoutOverlap(keepCurrent) {
  const layerWidth = menuLayer.value?.clientWidth
  if (!layerWidth) return

  // 文字の切り替えより左にだけ置く
  const limitX = langEl.value ? langEl.value.offsetLeft - MENU_GAP : layerWidth

  const placed = []
  scatterLinks.value = scatterLinks.value.map((link, i) => {
    const el = linkEls[i]
    const width = el?.offsetWidth || 0
    const maxX = Math.max(0, limitX - width)
    const overlaps = x => placed.some(([a, b]) => x < b + MENU_GAP && x + width + MENU_GAP > a)

    // 今の位置で重なっていなければそのまま
    if (keepCurrent && el && el.offsetLeft <= maxX && !overlaps(el.offsetLeft)) {
      placed.push([el.offsetLeft, el.offsetLeft + width])
      return link
    }

    let x = null
    for (let t = 0; t < 200 && x === null; t++) {
      const candidate = Math.random() * maxX
      if (!overlaps(candidate)) x = candidate
    }
    // ランダムで見つからなければ左から空いている場所を探す
    for (let candidate = 0; x === null && candidate <= maxX; candidate += 4) {
      if (!overlaps(candidate)) x = candidate
    }
    if (x === null) x = Math.random() * maxX

    placed.push([x, x + width])
    return { ...link, left: `${(x / layerWidth) * 100}%`, right: undefined }
  })
}

function shufflePositions() {
  isDissolving.value = true
  setTimeout(() => {
    scatterLinks.value = scatterLinks.value.map(link => ({
      ...link,
      top: randomTop()
    }))
    placeWithoutOverlap(false)
    isDissolving.value = false
  }, 300)
}
</script>

<style>
.sparkle-particle {
  opacity: 0;
  font-size: 0.5625rem;
  transform: translate(-50%, -50%);
}

.sparkle-link:hover .sparkle-particle {
  animation: sparkle-fly 0.7s ease-out forwards;
}

@keyframes sparkle-fly {
  0% {
    transform: translate(-50%, -50%) translate(0, 0) scale(0.4);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(1);
    opacity: 0;
  }
}
</style>
