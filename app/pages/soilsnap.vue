<template>
  <div class="flex flex-col sm:flex-row w-full pt-55 gap-3 sm:gap-25 min-h-screen px-3 sm:px-[8.89vw]">
    <!-- 上に固定されたフィルターメニュー（常に表示） -->
    <div class="fixed top-0 left-0 right-0 z-20 pt-0 pb-4 px-3 sm:pl-[8.89vw] sm:pr-0">
      <div class="sm:max-w-[884px] bg-white pt-0 pb-4 px-3 sm:px-0">
        <div class="text-[11px] text-gray-400 mb-1.5 select-none">+</div>
        <div class="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-600">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectCategory(category)"
            :class="[
              'transition-colors',
              selectedCategory === category
                ? 'text-gray-900 font-medium'
                : 'text-gray-400 hover:text-gray-600'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </div>

    <aside class="w-full sm:w-1/5 min-w-0 sm:sticky sm:top-32 h-fit">
      <div>
        <h2 class="text-xl font-bold mb-4">soilSnap</h2>
        <p class="text-[10px] leading-relaxed break-words text-gray-700">
          We are practicing to produce as much as possible with our own hands. We are researching the creation of a system that allows people in any situation to eat with peace of mind, sleep through the rain, and face tomorrow. We have a core but not a coherent structure, and we are always shaking (fluctuating).
          <br><br>
          Today we could be ..<br>
          farmer, acupuncturist, carpenter, architect, alchemist
        </p>
      </div>
    </aside>

    <main class="w-full sm:w-4/5">
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
                '[column-gap:12px] space-y-3'
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
            alt=""
            class="w-full object-cover hover:opacity-90 transition-opacity"
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
        class="flex justify-start py-16 text-[11px] leading-tight text-gray-500 whitespace-pre text-left"
      >
        {{ emptyArt }}
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useFetch, useRuntimeConfig } from '#app'

const config = useRuntimeConfig()

const selectedCategory = ref('All')
const emptyArt = ref('')

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

// 初期のAA
emptyArt.value = emptyArts[0]

watch(selectedCategory, () => {
  // カテゴリーを変えるたびにAAをランダム変更
  const i = Math.floor(Math.random() * emptyArts.length)
  emptyArt.value = emptyArts[i]
})

const { data: response, error } = await useFetch(
  `https://${config.public.microcmsServiceDomain}.microcms.io/api/v1/soilsnap`,
  {
    params: {
      limit: 100
    },
    headers: {
      'X-MICROCMS-API-KEY': config.public.microcmsApiKey
    }
  }
)

const allSoilsnaps = computed(() => {
  if (!response.value?.contents) return []
  return response.value.contents.map(item => {
    let imageUrl = ''
    if (item.image && Array.isArray(item.image) && item.image.length > 0) {
      imageUrl = item.image[0].url + '?w=800&q=80'
    } else if (item.image?.url) {
      imageUrl = item.image.url + '?w=800&q=80'
    }

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

    return {
      image: imageUrl,
      text: item.text || item.title || '',
      id: item.id,
      slug: item.slug,
      category: categoryLabel.toLowerCase(),
      categoryLabel
    }
  })
})

// 投稿されたtagから実際に使われているカテゴリーだけを、登場順に積み上げる（🕳は常時固定で末尾に表示）
const categories = computed(() => {
  const seen = new Set()
  const list = ['All']
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
    return shuffledCopy(allSoilsnaps.value)
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
