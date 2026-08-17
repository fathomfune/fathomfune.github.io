<script setup>
const config = useRuntimeConfig()
const { formatFuneDate } = useFuneDate()

function categoryLabel(cat) {
  if (cat == null) return ''
  if (typeof cat === 'string') return cat.trim() || ''
  if (Array.isArray(cat)) {
    const first = cat[0]
    if (first == null) return ''
    return typeof first === 'object' && first?.name ? String(first.name).trim() : String(first).trim()
  }
  if (typeof cat === 'object' && cat?.name) return String(cat.name).trim()
  return ''
}

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
    <header class="flex flex-col items-start gap-8 w-[320px] ml-auto">
      <div class="flex items-center gap-8">
        <h1 class="text-7xl">
          舟
        </h1>
        <h2>フネ・アジール</h2>
      </div>
      <div class="w-full">
        <p class="w-full text-left text-xs text-gray-600 leading-relaxed">
          Fune explore the creation of a system where, no matter the circumstances,
          people can eat with peace of mind, sleep through the rain,
          and face tomorrow with a calm heart.
          <br>
          At our core, there is a shared philosophy —
          yet no fixed structure.
          We are always in motion, constantly fluctuating, constantly becoming.
          <br>
          Today, we might be farmers, acupuncturists, carpenters, architects, or perhaps — alchemists.
        </p>
      </div>
    </header>

    <!-- フルブリード（画面幅いっぱい） 1440x480 = 3:1 -->
    <div class="mt-10">
      <div class="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen">
        <div class="aspect-[3/1] w-full bg-gray-100"></div>
      </div>
    </div>

    <div v-if="data" class="mt-40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24">
      <div v-for="item in data.contents" :key="item.id" class="group">
        <div class="flex flex-col">

          <div v-if="item.image && item.image.length > 0" class="mb-6 overflow-hidden bg-gray-100 aspect-[4/3]">
            <NuxtLink :to="`/logs/${item.slug}`">
              <img
                :src="item.image[0].url + '?w=800&q=80'"
                class="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-in-out"
                :alt="item.title"
              />
            </NuxtLink>
          </div>

          <div class="px-1">
            <div
              v-if="categoryLabel(item.category)"
              class="text-[10px] text-gray-400 mb-1 tracking-wide"
            >
              {{ categoryLabel(item.category) }}
            </div>
            <h2
              class="text-2xl mb-2 group-hover:text-blue-600 transition-colors"
              style="font-family: 'DotGothic16', sans-serif !important; font-weight: 400 !important;"
            >
              <NuxtLink :to="`/logs/${item.slug}`">
                {{ item.title }}
              </NuxtLink>
            </h2>

            <div class="flex items-center gap-3 text-[10px] text-gray-400 mb-4 tracking-widest uppercase">


              <ClientOnly>
                <span>{{ formatFuneDate(item.date) }}</span>
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

    <div v-else class="mt-40 py-20 text-center text-gray-300 animate-pulse tracking-widest uppercase text-xs">
      <p v-if="error">Failed to load catalogue.</p>
      <p v-else style="font-family: 'Coral Pixels', sans-serif;">Loading Logs...</p>
    </div>
  </UContainer>
</template>
