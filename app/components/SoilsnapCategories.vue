<template>
  <!-- Soilsnap のカテゴリ一覧（押せるカテゴリ名） -->
  <div class="font-dm-mono">
    <div class="flex flex-wrap gap-x-3 gap-y-0.5 text-[0.65rem] text-gray-600">
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        :class="[
          'transition-colors',
          selected === category
            ? 'text-gray-900 font-normal'
            : 'text-gray-400 hover:text-gray-600'
        ]"
        @click="emit('select', category)"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  categories: { type: Array, required: true },
  selected: { type: String, required: true }
})

const emit = defineEmits(['select'])
</script>
