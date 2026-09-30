<template>
  <!-- hub 以外のページ：本文の下にフッター。デスクトップはトップと同じく左33%を空けて、右67%の列に置く -->
  <div class="flex-1 flex flex-col">
    <div class="flex-1">
      <slot />
    </div>
    <AppFooter class="mb-10 mx-3 sm:mx-0 sm:ml-[33%] sm:pr-1" />
  </div>
</template>
