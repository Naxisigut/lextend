<template>
  <a :href="props.website.href" target="_blank"
    class="flex flex-col items-center p-4 rounded-lg  transition-all duration-200 hover:transform hover:translate-y-[-2px] text-center w-[160px]"
    :class="{ 'website-selected': keySelected }">
    <div class="w-12 h-12 mb-3 flex items-center justify-center">
      <img v-if="props.website.icon" :src="props.website.icon" :alt="props.website.title" class="w-full h-full object-contain">
      <div v-else class="w-full h-full rounded-full flex items-center justify-center relative">
      <div class="website-icon-bg"></div>
      <Globe class="z-10 text-gray-700" />
    </div>
  </div>
  <span class="text-sm text-gray-700 dark:text-gray-300">{{ props.website.title }}</span>
  <span class="text-xs text-gray-500 mt-1">{{ props.website.desc }}</span>
</a>
</template>

<script setup lang="ts">
import { Globe } from 'lucide-vue-next';
import type { WebsiteItem } from '../static/websites';

const props = withDefaults(defineProps<{
  website: WebsiteItem,
  keySelected?: boolean
}>(), {
  keySelected: false
})

</script>

<style lang="scss" scoped>
.website-selected {
  background-color: rgba(0, 0, 0, 0.05);
  outline: 2px solid #4f46e5;
  
  &.dark {
    background-color: rgba(255, 255, 255, 0.05);
  }
}
</style>
