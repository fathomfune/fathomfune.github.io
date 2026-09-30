<template>
  <div class="text-gray-900">
    <!-- 英語表示は DM Mono の「Fune」、日本語表示は以前と同じ游ゴシックの「舟」 -->
    <NuxtLink
      to="/"
      :style="lang === 'ja' ? { fontFamily: `'Yu Gothic', 'YuGothic', '游ゴシック', sans-serif`, fontSize: '0.8125rem' } : { fontSize: '0.8125rem' }"
      class="mb-10 inline-block hover:text-[#0365a6] transition-colors"
      :class="lang === 'ja' ? '' : 'font-dm-mono'"
    >{{ lang === 'ja' ? '舟' : 'Fune' }}</NuxtLink>
    <div
      class="whitespace-pre-wrap font-garamond"
      style="font-size: 0.75rem; letter-spacing: 0.03em; line-height: 1.5;"
    >{{ content }}</div>
  </div>
</template>

<script setup>
const lang = useTextLang()

// 詩の全角スペースは意図したもの
/* eslint-disable no-irregular-whitespace */
const content = `Fune explores the creation
                    of a system where,  no matter
the circumstances,
            people can eat with peace of        mind,
                              sleep under a roof
     even when it rains,              and face tomorrow.

At     our core,
         there is a   shared philosophy —
                         yet no fixed structure.
Wrestling with       ourselves,
             we      are always in motion,
     transforming,                          becoming.


Today, we might be
those who                     till the soil,
                those who        　     coax the ferment,
    acupuncturists, cooks,　　　　architects —

                                and on another day, perhaps,

            alchemists.`
/* eslint-enable no-irregular-whitespace */
</script>
