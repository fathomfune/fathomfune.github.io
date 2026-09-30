<template>
  <div class="text-gray-900">
    <NuxtLink
      to="/"
      style="font-family: 'Yu Gothic', 'YuGothic', '游ゴシック', sans-serif; font-size: 0.8125rem;"
      class="mb-10 inline-block hover:text-[#0365a6] transition-colors"
    >舟</NuxtLink>
    <div
      class="whitespace-pre-wrap font-garamond"
      style="font-size: 0.8rem; letter-spacing: 0.03em; line-height: 1.5;"
    >{{ content }}</div>
  </div>
</template>

<script setup>
// 詩の全角スペースは意図したもの
/* eslint-disable no-irregular-whitespace */
const content = `Fune explores 　the 　　creation
                    　　of　a system 　where,  no matter
the 　circumstances,
            people 　can eat with　 peace of       mind,
                              sleep under a roof
     even when it rains,     and face tomorrow.


At     our core,
        there is a   shared philosophy —
　                         yet no fixed structure.
Wrestling　 with       ourselves,
             we      are always in motion,
     transforming,                          becoming.



Today, we might be
those who                     till the soil,
                those who        　     coax the ferment,
    acupuncturists,　 cooks,　　　　architects —

                                and on another day, perhaps,

          alchemists.`
/* eslint-enable no-irregular-whitespace */
</script>
