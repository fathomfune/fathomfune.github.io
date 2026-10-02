<template>
  <!-- 写真と同じ2列にして、タイトルを2枚目の写真の左端に揃える。右端にアイコン -->
  <div class="flex flex-col gap-1">
    <NuxtLink
      v-for="sound in sounds" :key="sound.date + sound.title"
      :to="sound.to"
      class="grid grid-cols-2 gap-1 font-dm-mono text-[0.65rem] text-gray-900 tracking-wider leading-snug hover:text-[#0365a6] transition-colors duration-500"
    >
      <!-- 日付はタイトルの左端から96pxのところで終わる（列の間隔4px + 92px） -->
      <span class="flex justify-between gap-4">
        <span v-if="showLabel" class="inline-flex items-center gap-1"><span>᠀.</span>Sound</span>
        <span v-else />
        <span class="mr-[92px]">{{ sound.date }}</span>
      </span>
      <span class="flex min-w-0 items-center gap-2">
        <span class="min-w-0 truncate">{{ sound.title }}</span>
        <!-- アイコンは文字と同じ色にする（ホバーで一緒に青くなる）ため、SVG をマスクにして塗る -->
        <span aria-hidden="true" class="sound-icon ml-auto size-3.5 shrink-0 bg-current" />
      </span>
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  sounds: { type: Array, required: true },
  // Sound ページでは行ごとの「᠀.Sound」は出さない
  showLabel: { type: Boolean, default: true }
})
</script>

<style scoped>
.sound-icon {
  mask: url('/icons/cube-alt-02.svg') center / contain no-repeat;
  -webkit-mask: url('/icons/cube-alt-02.svg') center / contain no-repeat;
}
</style>
