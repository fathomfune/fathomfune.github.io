<template>
  <div class="flex flex-col">
    <!-- 1画面目はメニューのための余白。その下にSoilSnapからランダムに2枚 -->
    <div class="hidden sm:block h-screen" />
    <div
      v-if="randomSnaps.length"
      class="order-1 mx-3 mb-40 sm:mx-0"
    >
      <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-1">
        <div v-for="snap in randomSnaps" :key="snap.id" class="min-w-0">
          <NuxtLink to="/soilsnap" class="block overflow-hidden">
            <img
              :src="snap.image"
              alt=""
              class="w-full aspect-[4/5] object-cover hover:opacity-90 transition-opacity"
            />
          </NuxtLink>

          <!-- 写真ごとに「⊹ Soilsnap」と、右端に microCMS の month -->
          <div class="mt-2 flex items-baseline justify-between gap-2 font-dm-mono text-[0.65rem] text-gray-900 tracking-wider leading-snug">
            <NuxtLink
              to="/soilsnap"
              class="inline-flex items-center gap-1 hover:text-[#0365a6] transition-colors duration-500"
            ><span>⊹</span>Soilsnap</NuxtLink>
            <span v-if="snap.month">{{ snap.month }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 次の項目：Sound。写真と同じ2列にして、タイトルを2枚目の写真の左端に揃える。右端にアイコン -->
    <div class="order-1 mx-3 mb-24 sm:mx-0 flex flex-col gap-1">
      <NuxtLink
        v-for="sound in sounds" :key="sound.date + sound.title"
        :to="sound.to"
        class="grid grid-cols-2 gap-1 font-dm-mono text-[0.65rem] text-gray-900 tracking-wider leading-snug hover:text-[#0365a6] transition-colors duration-500"
      >
        <!-- 日付はタイトルの左端から96pxのところで終わる（列の間隔4px + 92px） -->
        <span class="flex justify-between gap-4">
          <span class="inline-flex items-center gap-1"><span>᠀.</span>Sound</span>
          <span class="mr-[92px]">{{ sound.date }}</span>
        </span>
        <span class="flex min-w-0 items-center gap-2">
          <span class="min-w-0 truncate">{{ sound.title }}</span>
          <img src="/icons/cube-alt-02.svg" alt="" class="ml-auto size-3 shrink-0" />
        </span>
      </NuxtLink>
    </div>

    <!-- 次の項目：Texts。正方形のサムネイル、記号とTexts、16px空けて明朝のタイトル。5列で間は4px。スマホは2列で、タイトルまでを8pxに詰め、上下の間を24pxに広げる -->
    <div v-if="homeTexts.length" class="order-1 mx-3 mb-10 sm:mx-0 sm:mb-[20vh] grid grid-cols-2 sm:grid-cols-5 gap-x-1 gap-y-6 sm:gap-y-1">
      <NuxtLink
        v-for="text in homeTexts" :key="text.id"
        :to="`/texts/${text.slug}`"
        class="group block min-w-0"
      >
        <div class="aspect-square overflow-hidden bg-gray-100">
          <img
            v-if="text.image"
            :src="text.image"
            alt=""
            class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          />
        </div>
        <p class="mt-2 flex items-center gap-1 font-dm-mono text-[0.65rem] text-gray-900 tracking-wider leading-snug group-hover:text-[#0365a6] transition-colors duration-500"><span>⁺</span>Texts</p>
        <p class="mt-2 sm:mt-[14px] font-garamond text-gray-900 break-words group-hover:text-[#0365a6] transition-colors duration-500" style="font-size: 0.75rem; letter-spacing: 0.03em; line-height: 1.5;">{{ text.title }}</p>
      </NuxtLink>
    </div>

    <div class="sm:hidden relative mt-10 mb-16 mx-3 h-[46vh]">
      <NuxtLink v-for="link in mobileScatterLinks" :key="`m-${link.label}`"
        :to="link.to"
        :target="link.external ? '_blank' : undefined"
        :rel="link.external ? 'noopener noreferrer' : undefined"
        class="group absolute inline-flex items-center gap-1 font-dm-mono text-[0.65rem] text-gray-900 tracking-wider hover:text-[#0365a6] transition-colors duration-500"
        :style="{ top: link.top, left: link.left, right: link.right }"
      >
        <span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] rotate-45 group-hover:rotate-0">{{ link.mark }}</span>{{ link.label }}
      </NuxtLink>

      <span
        v-for="symbol in mobileShuffleSymbols" :key="`m-${symbol.ch}`"
        class="absolute text-[0.6875rem] text-gray-600"
        :style="{ top: symbol.top, left: symbol.left, right: symbol.right }"
      >{{ symbol.ch }}</span>
    </div>

    <!-- クレジットは右のコンテンツ列の一番下。右端にプライバシーポリシー -->
    <div class="order-2 mb-10 mx-3 sm:mx-0 flex flex-wrap items-baseline justify-between gap-x-4 font-garamond text-gray-900 whitespace-nowrap" style="font-size: 0.65625rem; letter-spacing: 0.03em; line-height: 1.6;">
      <p class="font-garamond">
        Copyright © Fune All rights reserved.<span class="ml-4 font-garamond">Built by
          <a
            href="https://www.instagram.com/fylzith/"
            target="_blank"
            rel="noopener noreferrer"
            class="font-garamond hover:text-[#0365a6] transition-colors"
          >Rina arai</a></span>
      </p>
      <NuxtLink
        to="/privacy"
        class="font-garamond hover:text-[#0365a6] transition-colors"
      >Privacy Policy</NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'hub' })

const mobileScatterLinks = [
  { to: '/texts', label: 'Texts', mark: '⁺', top: '4%', left: '8%' },
  { to: '/building', label: 'First frost', mark: '⊹', top: '20%', right: '10%' },
  { to: '/soilsnap', label: 'Soilsnap', mark: '⊹', top: '40%', left: '45%' },
  { to: '/contact', label: 'Contact', mark: '⊹', top: '55%', left: '5%' },
  { to: '/building', label: 'Sound', mark: '᠀.', top: '72%', right: '20%' },
  { to: 'https://www.instagram.com/fathomfune', label: 'Instagram', mark: '⊹', top: '90%', left: '30%', external: true }
]

// Sound の項目（いまはダミー。R2 の準備ができたら差し替える）
const sounds = [
  { date: '2026.04', title: 'Morning soil', to: '/building' },
  { date: '2026.02', title: 'Slow ferment', to: '/building' },
  { date: '2025.12', title: 'First frost', to: '/building' },
  { date: '2025.10', title: 'Rain on the roof', to: '/building' },
  { date: '2025.08', title: 'Tide', to: '/building' },
  { date: '2025.06', title: 'Kitchen hum', to: '/building' }
]

const mobileShuffleSymbols = [
  { ch: '+ ⁺', top: '10%', right: '5%' },
  { ch: '⁺ ⊹', top: '30%', left: '62%' },
  { ch: '⊹𓂃 ࣪', top: '62%', right: '8%' },
  { ch: '☄︎.𖥔 ݁', top: '85%', right: '32%' }
]

const config = useRuntimeConfig()

const { data: soilsnapResponse } = await useFetch(
  `https://${config.public.microcmsServiceDomain}.microcms.io/api/v1/soilsnap`,
  {
    key: 'home-soilsnap',
    params: { limit: 100 },
    headers: { 'X-MICROCMS-API-KEY': config.public.microcmsApiKey }
  }
)

const snapsWithImage = computed(() => {
  const contents = soilsnapResponse.value?.contents || []
  return contents
    .map((item) => {
      const image = Array.isArray(item.image) ? item.image[0] : item.image
      // month はテキストでもセレクト（配列）でも受け取れるようにする
      const month = Array.isArray(item.month) ? item.month[0] : item.month
      return { id: item.id, image: image?.url ? `${image.url}?w=800&q=80` : '', month: month || '' }
    })
    .filter(item => item.image)
})

// Texts（microCMS の texts）の新しいものから10件。サムネイルは thumbnail があればそれ、なければ本文の1枚目の画像
const { data: textsResponse } = await useFetch(
  `https://${config.public.microcmsServiceDomain}.microcms.io/api/v1/texts`,
  {
    key: 'home-texts',
    params: { limit: 10 },
    headers: { 'X-MICROCMS-API-KEY': config.public.microcmsApiKey }
  }
)

const lang = useTextLang()
// トップページを開いたら毎回英語表示にする
lang.value = 'en'

const homeTexts = computed(() => {
  const contents = textsResponse.value?.contents || []
  return contents.map((item) => {
    const images = Array.isArray(item.image) ? item.image : (item.image ? [item.image] : [])
    const image = item.thumbnail?.url || images[0]?.url
    return {
      id: item.id,
      slug: item.slug,
      title: lang.value === 'en' && item['title-en'] ? item['title-en'] : item.title,
      image: image ? `${image}?w=600&h=600&fit=crop&q=80` : ''
    }
  })
})

// SSRとの食い違いを避けるため、ランダムな2枚はクライアント側で選ぶ
const randomSnaps = ref([])

onMounted(() => {
  const pool = [...snapsWithImage.value]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  randomSnaps.value = pool.slice(0, 2)
})

</script>
