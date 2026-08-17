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
  <UContainer class="py-20">
    <div v-if="data" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24">
      <div v-for="item in data.contents" :key="item.id" class="group">
        <div class="flex flex-col">

          <div v-if="item.image && item.image.length > 0" class="mb-6 overflow-hidden bg-gray-100 aspect-[4/3]">
            <NuxtLink :to="`/texts/${item.slug}`">
              <img
                :src="item.image[0].url + '?w=800&q=80'"
                class="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-in-out"
                :alt="item.title"
              />
            </NuxtLink>
          </div>

          <div class="px-1">
            <h2
              class="text-2xl mb-2 group-hover:text-blue-600 transition-colors"
              style="font-family: 'DotGothic16', sans-serif !important; font-weight: 400 !important;"
            >
              <NuxtLink :to="`/texts/${item.slug}`">
                {{ item.title }}
              </NuxtLink>
            </h2>

            <div class="flex items-center gap-3 text-[10px] text-gray-400 mb-4 tracking-widest uppercase">


              <ClientOnly>
                <span>{{ new Date(item.date).toLocaleDateString() }}</span>
              </ClientOnly>
            </div>

            <p
              class="text-sm text-gray-500 leading-relaxed line-clamp-2"
            >
              {{ item.text }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="py-20 text-center text-gray-300 animate-pulse tracking-widest uppercase text-xs">
      <p v-if="error">Failed to load catalogue.</p>
      <p v-else style="font-family: 'Coral Pixels', sans-serif;">Loading Logs...</p>
    </div>
  </UContainer>
</template>
