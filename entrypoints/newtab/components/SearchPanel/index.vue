<template>
  <div ref="searchPanelRef" class="mt-4 w-full" tabindex="0" @keydown="handleKeyDown">
    <Input class="" placeholder="输入关键词搜索" v-model="keyword" @input="search" />
    <div class="max-h-[70vh] overflow-y-auto">
      <template v-for="group in searchRes" :key="group.title">
        <div class="mt-4" v-if="group.data.length > 0">
          <div class="text-lg font-semibold text-muted-foreground">{{ group.title }}</div>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(100px,auto))] gap-2">
            <WebSiteItem 
              v-for="(website, index) in group.data" 
              :key="website.title" 
              :website="website"
              :keySelected="currentIndex === index"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { ref, onMounted } from 'vue';
import { default as websites, type WebsiteItem } from '../../static/websites';
import WebSiteItem from '../WebSiteItem.vue';
type SearchGroupRes = {
  title: string
  data: Array<WebsiteItem>
}


/* 搜索 */
const keyword = ref('')
const searchRes = ref<[SearchGroupRes]>([
  {
    title: '常用网站',
    data: []
  }
])
const search = () => {
  resetKeySelect()
  const e = keyword.value.trim()
  if (!e) return

  const websiteGroup = searchRes.value[0]
  websites.Data.forEach(group => {
    group.data.forEach(website => {
      if (website.title.includes(e) || website.desc.includes(e)) {
        websiteGroup.data.push(website)
      }
    })
  })
}



/* 键盘选择 */
const searchPanelRef = ref<HTMLElement | null>(null)
const currentIndex = ref<number | null>(null)
const COLS_PER_ROW = 4 // 每行显示的列数，根据实际grid布局调整
const handleKeyDown = (e: KeyboardEvent) => {
  e.preventDefault()

  const Length = searchRes.value[0].data.length
  const idx = currentIndex.value || 0
  
  switch (e.key) {
    case 'ArrowRight':
      currentIndex.value = idx + 1
      break
    case 'ArrowLeft':
      currentIndex.value = idx - 1
      break
    case 'ArrowDown':
      const nextDown = idx + COLS_PER_ROW
      currentIndex.value = nextDown >= Length ? idx % COLS_PER_ROW : nextDown
      break
    case 'ArrowUp':
      const nextUp = idx - COLS_PER_ROW
      currentIndex.value = nextUp < 0 
        ? Length - (COLS_PER_ROW - (idx % COLS_PER_ROW))
        : nextUp
      break
    case 'Enter':
      if (searchRes.value[0].data[idx]) {
        window.open(searchRes.value[0].data[idx].href, '_blank')
      }
      break
  }
}
const resetKeySelect = () => currentIndex.value = null

onMounted(() => {
  if (searchPanelRef.value) {
    searchPanelRef.value.focus()
  }
})


</script>

<style lang="scss" scoped></style>
