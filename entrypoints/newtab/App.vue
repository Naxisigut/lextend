<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 搜索栏区域 -->
    <SearchBar />

    <!-- 收藏网站列表 -->
    <!-- <div class="container mx-auto mt-8 px-4">
      <h2 class="text-xl font-bold mb-4">我的收藏</h2>
      <div class="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
        <DisplayItem v-for="item, idx in bookmarks" :key="idx" :item="item"></DisplayItem>
      </div>
    </div> -->

    <!-- 资讯列表区域 -->
    <!-- <div class="container mx-auto mt-8 px-4 mb-8">
      <h2 class="text-xl font-bold mb-4">今日资讯</h2>
      <div class="grid md:grid-cols-2 grid-cols-1 gap-4">
        <div v-for="n in 4" :key="n" class="bg-white p-4 rounded-lg shadow">
          <h3 class="font-medium">资讯标题示例</h3>
          <p class="text-gray-600 mt-2">这里是资讯的简短描述，可以是最新的技术新闻或者其他感兴趣的内容...</p>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import DisplayItem from '@/components/newtab/DisplayItem.vue';
import SearchBar from '@/components/newtab/SearchBar.vue';

const bookmarks = reactive([
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
