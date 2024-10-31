<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto">
      <div class="flex min-h-screen">
        <!-- 左侧边栏 - 在 md 断点以下隐藏 -->
        <div class="hidden md:flex w-64 border-r bg-white min-h-screen flex-col">
          <!-- 搜索栏 -->
          <div class="">
            <SearchBar />
          </div>

          <!-- 收藏列表 -->
          <div class="flex-1 overflow-y-auto p-4">
            <div class="space-y-3">
              <DisplayItem 
                v-for="item, idx in bookmarks" 
                :key="idx" 
                :item="item"
                class="!shadow-none hover:bg-gray-50"
              />
            </div>
          </div>
        </div>

        <!-- 右侧主内容区 -->
        <div class="flex-1 flex flex-col">
          <!-- 在中等屏幕以下显示的搜索栏 -->
          <div class="md:hidden p-4">
            <SearchBar />
          </div>

          <!-- 主要内容 -->
          <div class="flex-1 p-8 overflow-y-auto">
            <h2 class="text-xl font-bold mb-4">今日资讯</h2>
            <div class="grid md:grid-cols-2 grid-cols-1 gap-4">
              <div v-for="n in 4" :key="n" class="bg-white p-4 rounded-lg shadow">
                <h3 class="font-medium">资讯标题示例</h3>
                <p class="text-gray-600 mt-2">这里是资讯的简短描述，可以是最新的技术新闻或者其他感兴趣的内容...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
