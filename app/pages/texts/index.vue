<script setup>
const config = useRuntimeConfig()
const { data, error } = await useFetch(
  `https://${config.public.microcmsServiceDomain}.microcms.io/api/v1/texts`,
  {
    headers: {
      'X-MICROCMS-API-KEY': config.public.microcmsApiKey
    }
  }
)

const lang = useTextLang()


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
    </div>

    <div v-if="data" class="flex flex-col">
      <NuxtLink
        v-for="item in data.contents"
        :key="item.id"
        :to="`/texts/${item.slug}`"
        class="group block py-0.5"
      >
        <h2
          class="writings-index-title text-gray-900 font-garamond leading-tight group-hover:text-[#0365a6] transition-colors"
          :style="{
            fontSize: isEnglishFor(item)
              ? 'clamp(0.5625rem, 1.9vh, 0.8125rem)'
              : 'clamp(0.5rem, calc(1.9vh - 0.0625rem), 0.75rem)'
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
