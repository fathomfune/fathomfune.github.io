<template>
  <div class="hidden sm:block absolute inset-0 pointer-events-none">
    <div style="position: absolute; top: 46%; left: 56%; font-size: 10.5px; letter-spacing: 0.05em;">
      <a href="mailto:fathomfune@gmail.com" class="pointer-events-auto block text-gray-600 hover:text-gray-900 transition-colors duration-500">fathomfune@gmail.com</a>
      <NuxtLink
        to="/"
        class="pointer-events-auto mt-2 inline-flex items-center text-sm text-gray-400 hover:text-gray-900 transition-colors"
      >
        ⤺ back
      </NuxtLink>
    </div>

    <span
      v-for="symbol in shuffleSymbols" :key="symbol.ch"
      class="absolute text-[11px] text-gray-600"
      :style="{ top: symbol.top, left: symbol.left, right: symbol.right }"
    >{{ symbol.ch }}</span>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'hub' })

const shuffleSymbols = [
  { ch: '+ ⁺', top: '30%', right: '4%' },
  { ch: '⁺ ⊹', top: '56%', left: '40%' },
  { ch: '⊹𓂃 ࣪', top: '94%', left: '70%' },
  { ch: '☄︎.𖥔 ݁', top: '12%', left: '48%' }
]
</script>
