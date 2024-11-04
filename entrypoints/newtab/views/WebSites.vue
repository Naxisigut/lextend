<template>
  <div class="p-6">
    <div class="space-y-8">
      <div v-for="group in websites.Data" :key="group.title" class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300">{{ group.title }}</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <a v-for="website in group.data" :key="website.title" :href="website.href" target="_blank"
            class="flex flex-col items-center p-4 rounded-lg  transition-all duration-200 hover:transform hover:translate-y-[-2px] text-center">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import websites from '../static/websites';
import { Globe } from 'lucide-vue-next';
</script>

<style lang="scss" scoped>
.website-icon-bg {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(-45deg, var(--vp-c-brand-1) 30%, var(--vp-c-brand-next));
  filter: blur(15px);
  opacity: .6;
  transition: opacity 1s ease;
  border-radius: 9999px;

  &:hover {
    opacity: 1;
  }
}
</style>
