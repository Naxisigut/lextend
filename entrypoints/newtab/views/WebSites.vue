<template>
  <div class="p-6">
    <div class="space-y-8">
      <div v-for="group in websites.Data" :key="group.title" class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300">{{ group.title }}</h2>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] auto-rows-[120px] gap-2">
          <LiquidGlassWrapper v-for="website in group.data" :key="website.title" class="rounded-full hover:scale-120 hover:z-10">
            <a :href="website.href" target="_blank"
              class="h-full flex flex-col items-center justify-center text-center text-white">
                <div class="w-12 h-12 flex items-center justify-center relative">
                  <div class="website-icon-bg"></div>
                  <img v-if="website.icon" :src="website.icon" :alt="website.title">
                  <Globe v-else class="z-10" />
                </div>
                <div class="px-1 w-full truncate text-sm ">{{ website.title }}</div>
                <div class="px-1 w-full truncate text-xs text-white/80">{{ website.desc }}</div>
            </a>  
          </LiquidGlassWrapper>
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
