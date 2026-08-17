<template>
  <footer class="w-full mt-24 py-10 px-3 sm:px-[8.89vw]">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="text-[10px] text-gray-400 tracking-widest uppercase">
        © 2026 Fune All Rights Reserved.
      </div>

      <nav class="flex flex-wrap gap-x-4 gap-y-2 text-[14px] text-gray-900">
        <NuxtLink to="/texts" class="hover:text-gray-600 transition-colors">Texts</NuxtLink>
        <NuxtLink to="/soilsnap" class="hover:text-gray-600 transition-colors">soilSnap</NuxtLink>
        <a
          href="https://www.instagram.com/Fathomyrfn"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-gray-600 transition-colors"
        >
          Instagram
        </a>
        <a
          href="https://www.youtube.com/@FathomyrFn"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-gray-600 transition-colors"
        >
          YouTube
        </a>
      </nav>
    </div>
  </footer>
</template>
