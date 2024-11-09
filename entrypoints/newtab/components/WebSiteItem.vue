<template>
  <a :href="website.href" target="_blank"
    class="flex flex-col items-center p-4 rounded-lg  transition-all duration-200 hover:transform hover:translate-y-[-2px] text-center w-[160px]">
    <div class="w-12 h-12 mb-3 flex items-center justify-center">
      <img v-if="website.icon" :src="website.icon" :alt="website.title" class="w-full h-full object-contain">
      <div v-else class="w-full h-full rounded-full flex items-center justify-center relative">
      <div class="website-icon-bg"></div>
      <Globe class="z-10 text-gray-700" />
    </div>
  </div>
  <span class="text-sm text-gray-700 dark:text-gray-300">{{ website.title }}</span>
  <span class="text-xs text-gray-500 mt-1">{{ website.desc }}</span>
</a>
</template>

<script setup lang="ts">
import { Globe } from 'lucide-vue-next';
import type { Website } from '../static/websites';

defineProps<{
  website: Website
}>()
</script>

<style lang="scss" scoped></style>
