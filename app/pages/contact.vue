<template>
  <div>
    <!-- デスクトップ：右側に配置 -->
    <div class="hidden sm:block absolute inset-0 pointer-events-none">
      <div
        class="pointer-events-auto absolute w-[320px]"
        style="top: 30%; left: 56%;"
      >
        <ContactForm />
      </div>
    </div>

    <!-- モバイル：ConceptPanelの下に通常フローで配置 -->
    <div class="sm:hidden relative mt-10 mb-16 mx-3">
      <ContactForm />
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'hub' })
</script>
