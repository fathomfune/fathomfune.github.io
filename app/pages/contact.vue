<template>
  <div>
    <!-- デスクトップ：左33%は「舟」と所在地、右67%の列の左端（上から30%）にフォーム -->
    <div class="hidden sm:block absolute inset-0 pointer-events-none">
      <div
        class="pointer-events-auto absolute w-[400px]"
        style="top: 30%; left: 0;"
      >
        <ContactForm />
      </div>
    </div>

    <!-- モバイル：「舟」と所在地の下に通常フローで配置 -->
    <div class="sm:hidden relative mt-10 mx-3">
      <ContactForm />
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'hub' })
</script>
