<script setup>
const config = useRuntimeConfig()
const { data, error } = await useFetch(
  `https://${config.public.microcmsServiceDomain}.microcms.io/api/v1/writings`,
  {
    headers: {
      'X-MICROCMS-API-KEY': config.public.microcmsApiKey
    }
  }
)

const lang = useTextLang()

function setLang(value) {
  lang.value = value
}

function isEnglishFor(item) {
  return lang.value === 'en' && !!item['title-en']
}

function titleFor(item) {
  return isEnglishFor(item) ? item['title-en'] : item.title
}
</script>

<template>
  <UContainer class="py-20 max-w-2xl mx-0 px-3 sm:px-0 sm:pl-[10.5vw] lg:px-0 lg:pl-[10.5vw]">
    <div class="flex items-center gap-3 mb-6">
      <NuxtLink
        to="/"
        class="inline-flex items-center text-[11px] text-gray-400 hover:text-[#0365a6] transition-colors"
      >
        ･: Back
      </NuxtLink>
      <span class="text-gray-300 text-[11px]">/</span>
      <div class="flex items-center gap-1.5 text-[11px]">
        <button
          type="button"
          :class="[
            'transition-colors',
            lang === 'ja' ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-600'
          ]"
          @click="setLang('ja')"
        >
          JA
        </button>
        <span class="text-gray-300">/</span>
        <button
          type="button"
          :class="[
            'transition-colors',
            lang === 'en' ? 'text-gray-900 font-medium' : 'text-gray-400 hover:text-gray-600'
          ]"
          @click="setLang('en')"
        >
          EN
        </button>
      </div>
    </div>

    <div v-if="data" class="flex flex-col">
      <NuxtLink
        v-for="item in data.contents"
        :key="item.id"
        :to="`/writings/${item.slug}`"
        class="group block py-0.5"
      >
        <h2
          class="writings-index-title text-gray-900 font-garamond leading-tight group-hover:text-[#0365a6] transition-colors"
          :style="{
            fontSize: isEnglishFor(item)
              ? 'clamp(9px, 1.9vh, 13px)'
              : 'clamp(8px, calc(1.9vh - 1px), 12px)'
          }"
        >
          {{ titleFor(item) }}
        </h2>
      </NuxtLink>
    </div>

    <div v-else class="py-20 text-center text-gray-300 animate-pulse tracking-widest uppercase text-xs">
      <p v-if="error">Failed to load catalogue.</p>
      <p v-else style="font-family: 'Coral Pixels', sans-serif;">Loading Logs...</p>
    </div>
  </UContainer>
</template>
