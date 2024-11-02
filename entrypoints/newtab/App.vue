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
          <div class="flex-1 p-8 overflow-y-auto main-container relative">
            <Main />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import DisplayItem from './components/DisplayItem.vue';
import SearchBar from './components/SearchBar.vue';
import Main from './components/Main.vue';

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

<style scoped lang="scss">

</style>
