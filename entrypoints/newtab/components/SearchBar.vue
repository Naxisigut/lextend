<template>
  <LiquidGlassWrapper class="rounded-3xl hover:scale-102">
    <div class="relative flex items-center w-full rounded-md bg-transparent ">
      <!-- 搜索引擎选择 -->
      <div @mousewheel="handleScroll">
        <Select v-model="selectedEngine">
          <SelectTrigger class="h-10 border-0 focus:ring-0 focus:ring-offset-0 bg-transparent">
            <SelectValue>
              <div class="flex items-center">
                <img :src="engines.find(e => e.id === selectedEngine)?.icon" :alt="selectedEngine" class="w-4 h-4" />
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="engine in engines" :key="engine.id" :value="engine.id">
              <div class="flex items-center gap-2">
                <img :src="engine.icon" :alt="engine.id" class="w-4 h-4" />
                <span>{{ engine.name }}</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- 分隔线 -->
      <div class="h-5 w-px bg-border"></div>

      <!-- 输入框 -->
      <Input 
        v-model="searchText" placeholder="输入关键词搜索..."
        ref="iptRef" 
        style="box-shadow: none;" 
        @keyup.enter="handleSearch" 
        class="flex-1 border-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-500 placeholder:italic"
      />

      <!-- 搜索按钮 -->
      <button class="w-12 h-10 flex items-center justify-center hover:opacity-70 bg-transparent" @click="handleSearch">
        <SearchIcon class="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
  </LiquidGlassWrapper>
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
import yandexIcon from '@/assets/icons/yandex.png'

interface SearchEngine {
  id: string
  name: string
  icon: string
  searchUrl: string
  type: 'search' | 'redirect' // search: 直接搜索, redirect: 跳转类
}

// 定义搜索引擎列表
const engines: SearchEngine[] = [
  {
    id: 'yandex',
    name: 'Yandex',
    icon: yandexIcon,
    searchUrl: 'https://yandex.com/search/?text=',
    type: 'search'
  },
  {
    id: 'baidu',
    name: 'Baidu',
    icon: baiduIcon,
    searchUrl: 'https://www.baidu.com/s?wd=',
    type: 'search'
  },
  {
    id: 'google',
    name: 'Google',
    icon: googleIcon,
    searchUrl: 'https://www.google.com/search?q=',
    type: 'search'
  },
  {
    id: 'mdn',
    name: 'MDN',
    icon: 'https://developer.mozilla.org/favicon-48x48.png',
    searchUrl: 'https://developer.mozilla.org/zh-CN',
    type: 'redirect'
  }
]

const searchText = ref('')
const selectedEngine = ref<string>(localStorage.getItem('lastSearchEngine') || engines[0].id)
const iptRef = ref<InstanceType<typeof Input> | null>(null)

/* 搜索引擎选择滚动 */
const handleScroll = (e: WheelEvent) => {
  e.preventDefault() // 阻止默认滚动行为

  const currentIndex = engines.findIndex(engine => engine.id === selectedEngine.value)
  if (e.deltaY > 0) {
    // 向下滚动，到达最后一个时回到第一个
    selectedEngine.value = engines[(currentIndex + 1) % engines.length].id
  } else {
    // 向上滚动，到达第一个时跳转到最后一个
    selectedEngine.value = engines[(currentIndex - 1 + engines.length) % engines.length].id
  }
}

/* 搜索 */
const handleSearch = async () => {
  if (!searchText.value.trim()) return

  const engine = engines.find(e => e.id === selectedEngine.value)
  if (engine) {
    // 保存当前选择的搜索引擎
    localStorage.setItem('lastSearchEngine', selectedEngine.value)
    
    if (engine.type === 'search') {
      // 直接搜索类型：拼接搜索词到URL
      window.location.href = engine.searchUrl + encodeURIComponent(searchText.value)
    } else if (engine.type === 'redirect') {
      // 跳转类型：复制到剪贴板并跳转到搜索页
      try {
        await navigator.clipboard.writeText(searchText.value)
        console.log('搜索词已复制到剪贴板:', searchText.value)
      } catch (err) {
        console.warn('复制到剪贴板失败:', err)
        // 如果复制失败，可以考虑使用传统方法或者提示用户
      }
      window.location.href = engine.searchUrl
    }
  }
}


/* knowledge: Vue3中组件的数据和方法均为私有，父组件只能访问在子组件中使用defineExpose暴露 */
defineExpose({
  // 主动聚焦。这里Input为无头组件，所以需要通过$el访问原生DOM元素
  focus: () => iptRef.value?.$el.focus() 
})
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