<template>
  <!-- 全ページ共通のフッター：クレジットと、右端にプライバシーポリシー（スマホはクレジットの上）。上の中身との間は120px -->
  <footer class="mt-30 flex flex-col-reverse items-start gap-y-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between gap-x-4 font-garamond text-gray-900 whitespace-nowrap" style="font-size: 0.65625rem; letter-spacing: 0.03em; line-height: 1.6;">
    <p class="font-garamond">
      Copyright © Fune All rights reserved.<span class="ml-4 font-garamond">Built by
        <a
          href="https://www.instagram.com/fylzith/"
          target="_blank"
          rel="noopener noreferrer"
          class="font-garamond hover:text-[#0365a6] transition-colors"
        >Rina arai</a></span>
    </p>
    <NuxtLink
      to="/privacy"
      class="font-garamond hover:text-[#0365a6] transition-colors"
    >Privacy Policy</NuxtLink>
  </footer>
</template>
