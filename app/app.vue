<script setup>
const route = useRoute()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <NuxtPage />
    <AppFooter v-if="route.path !== '/'" />
  </div>
</template>