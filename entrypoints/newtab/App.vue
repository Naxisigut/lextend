﻿<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto">
      <div class="flex h-screen">
        <!-- 左侧边栏 - 在 md 断点以下隐藏 -->
        <div class="hidden md:flex w-64 border-r bg-white min-h-screen flex-col">
          <!-- 搜索栏 -->
          <SearchBar ref="searchBarLeftRef" />

          <!-- 常用功能 -->
          <div class="flex-1 overflow-y-auto p-4">
            <div class="space-y-1">
              <FunctionRow @click="onFunction(null)">
                首页
                <template #prefix>
                  <House class="w-4 h-5 text-gray-600" />
                </template>
              </FunctionRow>

              <FunctionRow @click="onFunction('WebSites')" :active="cpnt === 'WebSites'">
                <span>常用网站</span>
                <template #prefix>
                  <Globe class="w-4 h-4 text-gray-600" />
                </template>
                <template #suffix>
                  <span class="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-1">
                    {{ websites.Count }}
                  </span>
                </template>
              </FunctionRow>
            </div>
          </div>
        </div>

        <!-- 右侧主内容区 -->
        <div class="flex-1 flex flex-col">
          <!-- 在中等屏幕以下显示的搜索栏 -->
          <div class="md:hidden p-4">
            <SearchBar ref="searchBarRightRef" />
          </div>

          <!-- 主要内容 -->
          <div class="h-0 flex-1 p-8 main-container relative overflow-x-visible">
            <Main v-model:cpnt="cpnt" />
          </div>
        </div>
      </div>
    </div>
    
    <Dialog 
      title="搜索" 
      v-model:open="isOpen"
      :showHeader="false"
      :showFooter="false"
    >
      <SearchPanel />
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import SearchBar from './components/SearchBar.vue';
import Main from './components/Main.vue';
import FunctionRow from './components/FunctionRow.vue';
import { Globe, Home, House } from 'lucide-vue-next';
import websites from './static/websites';
import Dialog from './components/Dialog.vue';
import SearchPanel from './components/SearchPanel/index.vue';
import { useEventListener } from '@vueuse/core';

const cpnt = ref<string | null>(null)
const onFunction = (name: string | null) => {
  cpnt.value = name
}


const searchBarLeftRef = ref<InstanceType<typeof SearchBar> | null>(null)
const searchBarRightRef = ref<InstanceType<typeof SearchBar> | null>(null)
const focusVisibleBar = () => {
  if (searchBarLeftRef.value && searchBarRightRef.value) {
    const leftEl = searchBarLeftRef.value.$el
    const rightEl = searchBarRightRef.value.$el

    /* checkVisibility: 检查元素是否可见, 无论其可见性是否被其祖先元素的样式影响 */
    leftEl.checkVisibility() && searchBarLeftRef.value.focus()
    rightEl.checkVisibility() && searchBarRightRef.value.focus()
  }
}
onMounted(() => {
  focusVisibleBar()
})



/* 搜索对话框 */
const isOpen = ref(false)
useEventListener(document, 'keydown', (e) => {
  if (e.key === 'k' && e.ctrlKey) {
    e.preventDefault()
    isOpen.value = true
  }
})

</script>

<style scoped lang="scss"></style>
