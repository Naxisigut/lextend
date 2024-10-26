<template>
  <div>
    <div class="container mx-auto">
      <div class="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3">
        <DisplayItem v-for="item, idx in items" :key="idx" :item="item"></DisplayItem>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import DisplayItem from '@/components/newtab/DisplayItem.vue';

const items = reactive([
  {
    title: 'UnoCSS',
    desc: 'UnoCSS',
    href: 'http://unocss.cn/'
  },
  {
    title: 'Shadcn Vue',
    desc: 'Shadcn Vue',
    href: 'https://www.shadcn-vue.com/docs/components/accordion.html'
  },
  {
    title: 'TailWindCSS',
    desc: 'TailWindCSS',
    href: 'https://www.tailwindcss.cn/docs/installation'
  },
])

</script>


<style scoped lang="scss"></style>
