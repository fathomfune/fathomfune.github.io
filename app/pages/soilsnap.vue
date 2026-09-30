<template>
  <!-- デスクトップはトップと同じく左33%：右67%。写真は右の列に置き、右端は4px空ける -->
  <!-- スマホは、写真がカテゴリの帯のすぐ下から始まるように上の余白を合わせる -->
  <div
    class="flex flex-col sm:flex-row w-full pt-[var(--soilsnap-pt)] sm:pt-40 gap-3 sm:gap-0 min-h-screen px-3 sm:pl-0 sm:pr-1"
    :style="{ '--soilsnap-pt': mobileTopPadding }"
  >
    <!--
      スマホ：カテゴリはメニューバーの下の白い帯。下にスクロールすると一緒に上へ流れて隠れ、
      上にスクロールすると、そのぶんだけ上から戻ってくる
    -->
    <div
      ref="bandEl"
      class="sm:hidden fixed left-0 right-0 z-20 bg-white px-3 pt-2 pb-3"
      :style="{ top: `${mobileBarHeight}px`, transform: `translateY(${-bandOffset}px)` }"
    >
      <SoilsnapCategories
        :categories="categories"
        :selected="selectedCategory"
        @select="selectCategory"
      />
    </div>

    <!-- デスクトップ：トップの詩と同じく、カテゴリは左33%の列に固定し、写真だけ右でスクロールする -->
    <aside class="hidden sm:block w-[33%] shrink-0 min-w-0 sticky top-48 mt-8 h-fit pl-20 pr-15">
      <SoilsnapCategories
        :categories="categories"
        :selected="selectedCategory"
        @select="selectCategory"
      />
    </aside>

    <main class="w-full sm:w-[67%] min-w-0">
      <!-- 投稿があるとき：グリッド表示 -->
      <div
        v-if="soilsnaps.length"
        :class="
          selectedCategory === '🕳'
            ? 'w-full'
            : [
                selectedCategory === 'All'
                  ? 'columns-2 md:columns-3'
                  : 'columns-1 md:columns-3',
                '[column-gap:4px] space-y-1'
              ]
        "
      >
        <div
          v-for="(item, index) in soilsnaps"
          :key="item.id || index"
          class="break-inside-avoid overflow-hidden"
          :class="[
            { 'p-10': !item.image && item.text },
            selectedCategory === '🕳' ? 'md:w-2/3' : ''
          ]"
        >
          <img
            v-if="item.image"
            :src="item.image"
            :width="item.width || undefined"
            :height="item.height || undefined"
            alt=""
            decoding="async"
            class="w-full h-auto object-cover hover:opacity-90 transition-opacity"
            :class="{ 'mb-2': item.text }"
          />
          <div
            v-if="item.text"
            :class="item.image ? 'text-sm px-1 pb-2 text-gray-600' : 'text-sm text-gray-600'"
            style="line-height: 1.4;"
            v-html="item.text"
          ></div>
        </div>
      </div>

      <!-- 投稿がないとき：AAをランダム表示 -->
      <div
        v-else
        class="flex justify-start py-16 text-[0.6875rem] leading-tight text-gray-500 whitespace-pre text-left"
      >
        {{ emptyArt }}
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useFetch, useRuntimeConfig } from '#app'

const config = useRuntimeConfig()

// --- スマホのカテゴリの帯：スクロールに合わせて隠れたり戻ったりする ---
const { barHeight: mobileBarHeight } = useMobileMenu()
const bandEl = ref(null)
const bandHeight = ref(0)
// 帯を上にずらしている量（0 = 全部見えている、bandHeight = メニューバーの裏に全部隠れている）
const bandOffset = ref(0)
let lastScrollY = 0

function onBandScroll() {
  // iOS の引っぱりでマイナスになる分は無視する
  const y = Math.max(0, window.scrollY)
  const delta = y - lastScrollY
  lastScrollY = y
  bandOffset.value = Math.min(bandHeight.value, Math.max(0, bandOffset.value + delta))
}

// 写真は、メニューバーとカテゴリの帯の下から12px空けて始める（測れるまでは160px）
const mobileTopPadding = computed(() =>
  bandHeight.value ? `${mobileBarHeight.value + bandHeight.value + 12}px` : '160px'
)

let bandObserver

onMounted(() => {
  lastScrollY = Math.max(0, window.scrollY)
  if (bandEl.value) {
    bandObserver = new ResizeObserver(() => {
      bandHeight.value = bandEl.value?.offsetHeight || 0
    })
    bandObserver.observe(bandEl.value)
  }
  window.addEventListener('scroll', onBandScroll, { passive: true })
})

onBeforeUnmount(() => {
  bandObserver?.disconnect()
  window.removeEventListener('scroll', onBandScroll)
})

const selectedCategory = ref('All')
const emptyArt = ref('')

/* eslint-disable no-irregular-whitespace -- full-width spaces align the ASCII art below */
const emptyArts = [
  `  
     🌱
　________
 /　　　　\\\\
/　@　@　\\\\
|　　@　　| 
\\\\　\\\\___/　/
 \\\\_______/ 


Still growing
 `
]
/* eslint-enable no-irregular-whitespace */

// 初期のAA
emptyArt.value = emptyArts[0]

watch(selectedCategory, () => {
  // カテゴリーを変えるたびにAAをランダム変更
  const i = Math.floor(Math.random() * emptyArts.length)
  emptyArt.value = emptyArts[i]
})

const { data: response } = await useFetch(
  `https://${config.public.microcmsServiceDomain}.microcms.io/api/v1/soilsnap`,
  {
    params: {
      limit: 100
    },
    headers: {
      'X-MICROCMS-API-KEY': config.public.microcmsApiKey
    },
    // 並び順はビルド（プリレンダー）のときに一度だけランダムに決め、ページに書き込む。
    // ブラウザは同じデータを使うので、何度リロードしても同じ順番で、表示直後に入れ替わらない
    transform: res => ({ ...res, contents: shuffledCopy(res?.contents || []) })
  }
)

const allSoilsnaps = computed(() => {
  if (!response.value?.contents) return []
  return response.value.contents.map(item => {
    // microCMS の画像は width / height を持っているので、読み込み前から縦横比を確保できる
    const imageField = Array.isArray(item.image) ? item.image[0] : item.image
    const imageUrl = imageField?.url ? imageField.url + '?w=800&q=80' : ''

    let categoryLabel = ''
    const tagField = item.tag || item.category
    if (tagField) {
      if (Array.isArray(tagField)) {
        categoryLabel = tagField[0]?.name || tagField[0] || ''
      } else if (typeof tagField === 'object') {
        categoryLabel = tagField.name || tagField.id || tagField.value || ''
      } else {
        categoryLabel = tagField
      }
    }

    // microCMS側のtag表記に前後の余白が混ざっていても同じカテゴリーとして扱う
    categoryLabel = categoryLabel.trim()

    return {
      image: imageUrl,
      width: imageField?.width || 0,
      height: imageField?.height || 0,
      text: item.text || item.title || '',
      id: item.id,
      slug: item.slug,
      category: categoryLabel.toLowerCase(),
      categoryLabel
    }
  })
})

// まだ投稿がなくても常に表示する野菜カテゴリー一覧（microCMSのtag選択肢と同じ並び）
const FIXED_CATEGORIES = [
  'Rice', 'Soy Bean', 'Piment', 'Tomato', 'Carrot', 'Radish', 'Turnip',
  'Beetroot', 'Sweet Potato', 'Potato', 'Taro', 'Parsnip', 'Lotus Root',
  'Lettuce', 'Spinachc', 'Kale', 'Cabbagecc', 'Bok Choy', 'Mustard Greens',
  'Swiss Chard', 'Mizuna', 'Arugula', 'Komatsuna', 'Cherry Tomato',
  'Eggplantc', 'Cucumber', 'Zucchini', 'Bell Pepper', 'Okra', 'Bitter Melon',
  'Pumpkin', 'Snap Peas', 'Edamame', 'Black Bean', 'Chickpea', 'Lentil',
  'Kidney Bean', 'Fava Bean', 'Lima Bean', 'Asparagus', 'Broccoli',
  'Cauliflowercc', 'Celery', 'Onion', 'Garlic', 'Leek', 'Chive', 'Ginger',
  'Cowpea', 'Persimmon', 'Sudachi', 'Malabar Spinach'
]

// 固定の野菜カテゴリー＋投稿tagにだけ登場する未知のカテゴリーを、登場順に積み上げる（🕳は常時固定で末尾に表示）
const categories = computed(() => {
  const seen = new Set()
  const list = ['All']

  for (const label of FIXED_CATEGORIES) {
    const key = label.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    list.push(label)
  }

  for (const item of allSoilsnaps.value) {
    if (!item.categoryLabel || seen.has(item.category)) continue
    seen.add(item.category)
    list.push(item.categoryLabel)
  }

  if (!list.includes('🕳')) list.push('🕳')
  return list
})

// カテゴリーボタンを押すたびに（同じカテゴリーの再クリックでも）ランダム表示を振り直す
const shuffleSeed = ref(0)

function selectCategory(category) {
  selectedCategory.value = category
  shuffleSeed.value++
}

function shuffledCopy(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const soilsnaps = computed(() => {
  void shuffleSeed.value

  if (selectedCategory.value === 'All') {
    // 最初はビルド時に決めた順番のまま。カテゴリを押したら振り直す
    return shuffleSeed.value === 0 ? allSoilsnaps.value : shuffledCopy(allSoilsnaps.value)
  }

  if (selectedCategory.value === '🕳') {
    if (allSoilsnaps.value.length === 0) return []
    const i = Math.floor(Math.random() * allSoilsnaps.value.length)
    return [allSoilsnaps.value[i]]
  }

  const selectedCategoryLower = selectedCategory.value.toLowerCase()
  return allSoilsnaps.value.filter(item => item.category === selectedCategoryLower)
})
</script>

<style scoped></style>
