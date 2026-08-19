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
</script>

<template>
  <UContainer class="py-20 max-w-2xl mx-0 px-3 sm:px-0 sm:pl-[10.5vw] lg:px-0 lg:pl-[10.5vw]">
    <div v-if="data" class="flex flex-col">
      <NuxtLink
        v-for="item in data.contents"
        :key="item.id"
        :to="`/texts/${item.slug}`"
        class="group block py-0.5"
      >
        <h2 class="text-[11px] text-gray-900 font-garamond leading-tight group-hover:text-[#0365a6] transition-colors">
          {{ item.title }}
        </h2>
      </NuxtLink>
    </div>

    <div v-else class="py-20 text-center text-gray-300 animate-pulse tracking-widest uppercase text-xs">
      <p v-if="error">Failed to load catalogue.</p>
      <p v-else style="font-family: 'Coral Pixels', sans-serif;">Loading Logs...</p>
    </div>
  </UContainer>
</template>
