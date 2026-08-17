<template>
  <div class="flex flex-col sm:flex-row w-full pt-55 gap-3 sm:gap-25 min-h-screen px-3 sm:px-[8.89vw]">
    
    <aside class="w-full sm:w-1/5 min-w-0 sm:sticky sm:top-32 h-fit">
      <div>
        <h2 class="text-xl font-bold mb-4">Fragments</h2>
        <p class="text-[10px] leading-relaxed break-words text-gray-700">
          We are practicing to produce as much as possible with our own hands. We are researching the creation of a system that allows people in any situation to eat with peace of mind, sleep through the rain, and face tomorrow. We have a core but not a coherent structure, and we are always shaking (fluctuating).
          <br><br>
          Today we could be ..<br>
          farmer, acupuncturist, carpenter, architect, alchemist
        </p>
      </div>
    </aside>

    <main class="w-full sm:w-4/5">
      <div class="columns-2 md:columns-3 [column-gap:12px] space-y-3">
        <div 
          v-for="(item, index) in fragments" 
          :key="item.id || index" 
          class="break-inside-avoid overflow-hidden"
          :class="{ 'p-10': !item.image && item.text }"
        >
          <img 
            v-if="item.image" 
            :src="item.image" 
            alt="" 
            class="w-full mb-2 object-cover hover:opacity-90 transition-opacity" 
          />
          <div v-if="item.text" :class="item.image ? 'text-sm px-1 pb-2 text-gray-600' : 'text-sm text-gray-600'" style="line-height: 1.4;" v-html="item.text"></div>
        </div>
      </div>
    </main>
    
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFetch, useRuntimeConfig } from '#app'

const config = useRuntimeConfig()

// microCMSからfragmentsを取得
const { data: response, error } = await useFetch(
  `https://${config.public.microcmsServiceDomain}.microcms.io/api/v1/fragments`,
  {
    headers: {
      'X-MICROCMS-API-KEY': config.public.microcmsApiKey
    }
  }
)

// microCMSのデータを変換
const fragments = computed(() => {
  if (!response.value?.contents) return []
  return response.value.contents.map(item => {
    let imageUrl = ''
    if (item.image && Array.isArray(item.image) && item.image.length > 0) {
      imageUrl = item.image[0].url + '?w=800&q=80'
    } else if (item.image?.url) {
      imageUrl = item.image.url + '?w=800&q=80'
    }
    
    return {
      image: imageUrl,
      text: item.text || item.title || '',
      id: item.id,
      slug: item.slug
    }
  })
})
</script>

<style scoped>
/* 必要に応じて追加のスタイルを記述 */
</style>