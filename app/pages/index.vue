<template>
  <div>
    <div
      class="hidden sm:block absolute inset-0 pointer-events-none transition-opacity duration-300"
      :class="isDissolving ? 'opacity-0' : 'opacity-100'"
    >
      <NuxtLink v-for="link in scatterLinks" :key="link.label"
        :to="link.to"
        :target="link.external ? '_blank' : undefined"
        :rel="link.external ? 'noopener noreferrer' : undefined"
        class="sparkle-link group pointer-events-auto absolute inline-flex items-center gap-1 text-[10.5px] text-gray-400 tracking-widest hover:text-[#0365a6] transition-colors duration-500"
        :style="{ top: link.top, left: link.left, right: link.right }"
      >
        <span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] rotate-45 group-hover:rotate-0">+</span>{{ link.label }}

        <span
          v-for="(p, pi) in sparkles" :key="pi"
          class="sparkle-particle pointer-events-none absolute left-1/2 top-1/2 text-gray-400"
          :style="{ '--dx': p.dx, '--dy': p.dy, animationDelay: p.delay }"
        >{{ p.ch }}</span>
      </NuxtLink>

      <button
        v-for="symbol in shuffleSymbols" :key="symbol.ch"
        type="button"
        class="pointer-events-auto absolute text-[11px] text-gray-600 hover:text-gray-900 transition-colors duration-500"
        :style="{ top: symbol.top, left: symbol.left, right: symbol.right }"
        @click="shufflePositions"
      >{{ symbol.ch }}</button>
    </div>

    <div class="sm:hidden relative mt-10 mb-16 mx-3 h-[46vh]">
      <NuxtLink v-for="link in mobileScatterLinks" :key="`m-${link.label}`"
        :to="link.to"
        :target="link.external ? '_blank' : undefined"
        :rel="link.external ? 'noopener noreferrer' : undefined"
        class="group absolute inline-flex items-center gap-1 text-[11px] text-gray-400 tracking-widest hover:text-[#0365a6] transition-colors duration-500"
        :style="{ top: link.top, left: link.left, right: link.right }"
      >
        <span class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] rotate-45 group-hover:rotate-0">+</span>{{ link.label }}
      </NuxtLink>

      <span
        v-for="symbol in mobileShuffleSymbols" :key="`m-${symbol.ch}`"
        class="absolute text-[11px] text-gray-600"
        :style="{ top: symbol.top, left: symbol.left, right: symbol.right }"
      >{{ symbol.ch }}</span>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'hub' })

const sparkles = [
  { ch: '⁺', dx: '18px', dy: '-16px', delay: '0s' },
  { ch: '⊹', dx: '-16px', dy: '-18px', delay: '0.06s' },
  { ch: '𖦹', dx: '-18px', dy: '14px', delay: '0.03s' },
  { ch: '⁺', dx: '2px', dy: '-24px', delay: '0.09s' }
]

const scatterLinks = ref([
  { to: '/texts', label: 'texts', top: '10%', left: '42%' },
  { to: '/', label: 'yao', top: '70%', right: '6%' },
  { to: '/soilsnap', label: 'soilsnap', top: '44%', left: '58%' },
  { to: '/contact', label: 'contact', top: '20%', right: '16%' },
  { to: '/', label: 'sounds', top: '88%', left: '46%' },
  { to: 'https://www.instagram.com/fathomfune', label: 'instagram', top: '60%', right: '30%', external: true }
])

const mobileScatterLinks = [
  { to: '/texts', label: 'texts', top: '4%', left: '8%' },
  { to: '/', label: 'yao', top: '20%', right: '10%' },
  { to: '/soilsnap', label: 'soilsnap', top: '40%', left: '45%' },
  { to: '/contact', label: 'contact', top: '55%', left: '5%' },
  { to: '/', label: 'sounds', top: '72%', right: '20%' },
  { to: 'https://www.instagram.com/fathomfune', label: 'instagram', top: '90%', left: '30%', external: true }
]

const shuffleSymbols = [
  { ch: '+ ⁺', top: '30%', right: '4%' },
  { ch: '⁺ ⊹', top: '56%', left: '40%' },
  { ch: '⊹𓂃 ࣪', top: '94%', left: '70%' },
  { ch: '☄︎.𖥔 ݁', top: '12%', left: '48%' }
]

const mobileShuffleSymbols = [
  { ch: '+ ⁺', top: '10%', right: '5%' },
  { ch: '⁺ ⊹', top: '30%', left: '62%' },
  { ch: '⊹𓂃 ࣪', top: '62%', right: '8%' },
  { ch: '☄︎.𖥔 ݁', top: '85%', right: '32%' }
]

const isDissolving = ref(false)

function randomTop() {
  return `${Math.floor(Math.random() * 88) + 4}%`
}

function randomSide() {
  return Math.random() > 0.5
    ? { left: `${Math.floor(Math.random() * 50) + 40}%`, right: undefined }
    : { left: undefined, right: `${Math.floor(Math.random() * 28) + 2}%` }
}

function shufflePositions() {
  isDissolving.value = true
  setTimeout(() => {
    scatterLinks.value = scatterLinks.value.map(link => ({
      ...link,
      top: randomTop(),
      ...randomSide()
    }))
    isDissolving.value = false
  }, 300)
}
</script>

<style>
.sparkle-particle {
  opacity: 0;
  font-size: 9px;
  transform: translate(-50%, -50%);
}

.sparkle-link:hover .sparkle-particle {
  animation: sparkle-fly 0.7s ease-out forwards;
}

@keyframes sparkle-fly {
  0% {
    transform: translate(-50%, -50%) translate(0, 0) scale(0.4);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(1);
    opacity: 0;
  }
}
</style>
