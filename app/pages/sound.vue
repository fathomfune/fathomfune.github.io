<template>
  <!-- デスクトップはトップと同じく左33%：右67%。Sound の行は右の列に並べ、右端は4px空ける -->
  <!-- スマホは、メニューバーの下から24px空けて始める -->
  <div
    class="flex flex-col sm:flex-row w-full pt-[var(--sound-pt)] sm:pt-40 pb-40 min-h-screen px-3 sm:pl-0 sm:pr-1"
    :style="{ '--sound-pt': `${mobileBarHeight + 24}px` }"
  >
    <div class="hidden sm:block w-[33%] shrink-0" />
    <main class="w-full sm:w-[67%] min-w-0">
      <SoundList :sounds="sounds" :show-label="false" />
    </main>
  </div>
</template>

<script setup>
const sounds = useSounds()
const { barHeight: mobileBarHeight } = useMobileMenu()
</script>
