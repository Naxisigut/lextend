<template>
  <div class="container mx-auto pt-8 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- 搜索输入框组合 -->
      <div
        class="relative flex items-center w-full rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <!-- 搜索引擎选择 -->
        <div @mousewheel="handleScroll">
          <Select v-model="selectedEngine">
            <SelectTrigger class="h-10 border-0 focus:ring-0 focus:ring-offset-0 bg-transparent">
              <SelectValue>
                <div class="flex items-center">
                  <img :src="engineIcons[selectedEngine]" :alt="selectedEngine" class="w-4 h-4" />
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baidu">
                <div class="flex items-center gap-2">
                  <img :src="engineIcons.baidu" alt="baidu" class="w-4 h-4" />
                  <span>Baidu</span>
                </div>
              </SelectItem>
              <SelectItem value="google">
                <div class="flex items-center gap-2">
                  <img :src="engineIcons.google" alt="google" class="w-4 h-4" />
                  <span>Google</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- 分隔线 -->
        <div class="h-5 w-px bg-border"></div>

        <!-- 输入框 -->
        <Input style="box-shadow: none;" v-model="searchText" placeholder="输入关键词搜索..."
          class="flex-1 border-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0" @keyup.enter="handleSearch" />

        <!-- 搜索按钮 -->
        <button class="w-12 h-10 flex items-center justify-center hover:opacity-70 bg-transparent" @click="handleSearch">
          <SearchIcon class="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { SearchIcon } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import baiduIcon from '@/assets/icons/baidu.png'
import googleIcon from '@/assets/icons/google.png'

// 定义搜索引擎列表
const engines = ['baidu', 'google'] as const
type Engine = typeof engines[number]

const engineIcons = {
  baidu: baiduIcon,
  google: googleIcon
}

const searchText = ref('')
const selectedEngine = ref<Engine>('baidu')

const handleScroll = (e: WheelEvent) => {
  e.preventDefault() // 阻止默认滚动行为
  
  const currentIndex = engines.indexOf(selectedEngine.value)
  if (e.deltaY > 0) {
    // 向下滚动，但不超过最后一个
    if (currentIndex < engines.length - 1) {
      selectedEngine.value = engines[currentIndex + 1]
    }
  } else {
    // 向上滚动，但不超过第一个
    if (currentIndex > 0) {
      selectedEngine.value = engines[currentIndex - 1]
    }
  }
}

const handleSearch = () => {
  if (!searchText.value.trim()) return

  const searchUrls = {
    baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(searchText.value)}`,
    google: `https://www.google.com/search?q=${encodeURIComponent(searchText.value)}`
  }

  window.location.href = searchUrls[selectedEngine.value]
}
</script>

<style scoped>
:deep(.select-trigger) {
  padding-left: 0.75rem;
  padding-right: 0.5rem;
}

:deep(.select-content) {
  min-width: 120px;
}
</style>