<template>
  <div ref="searchPanelRef" class="mt-4 w-full" @keydown="handleKeyDown">
    <Input class="" placeholder="输入关键词搜索" v-model="keyword" @input="search" />
    <div class="max-h-[70vh] overflow-y-auto">
      <template v-for="group, gIdx in searchRes" :key="group.title">
        <div class="mt-4" v-if="group.data.length > 0">
          <div class="text-lg font-semibold">{{ group.title }}</div>
          <div ref="gridRef" class="grid grid-cols-[repeat(auto-fill,minmax(130px,auto))] justify-items-center">
            <WebSiteItem 
              v-for="(website, iIdx) in group.data" 
              :key="website.title" 
              :website="website"
              :keySelected="isSelected(gIdx, iIdx)"
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
import tool from '@/lib/tool';
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
const searchResLength = computed(() => {
  const L = searchRes.value.reduce((acc, cur) => acc + cur.data.length, 0)
  return L
})



/* 键盘选择 */
const currentIndex = ref<number | null>(null)
const gridRef = ref<HTMLDivElement[] | null>(null)
const searchPanelRef = ref<HTMLDivElement | null>(null)
const GridColNum = ref(0) // 每行显示的列数，根据实际grid布局调整
const resizeObserver: ResizeObserver = new ResizeObserver(() => {
  if(gridRef.value?.length) {
    GridColNum.value = tool.getGridColNum(gridRef.value[0])
  }
})
const handleKeyDown = (e: KeyboardEvent) => {
  const keyArr = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Enter']
  if (!keyArr.includes(e.key)) return
  if(searchResLength.value === 0) return
  e.preventDefault()
  console.log(e.key);

  const idx = currentIndex.value === null ? -1 : currentIndex.value
  const maxIdx = searchResLength.value - 1
  switch (e.key) {
    case 'ArrowRight':
      currentIndex.value = Math.min(idx + 1, maxIdx)
      break
    case 'ArrowLeft':
      currentIndex.value = Math.max(idx - 1, 0)
      break
    case 'ArrowDown':
      if(idx + GridColNum.value > maxIdx) return
      currentIndex.value = idx + GridColNum.value
      break
    case 'ArrowUp':
      if(idx - GridColNum.value < 0) return
      currentIndex.value = idx - GridColNum.value
      break
    case 'Enter':
      if(idx){
        const item = getCurrSearchItem()
        console.log(111, item);
        window.open(item.href, '_blank')
      }
      break
  }
}
const resetKeySelect = () => currentIndex.value = null
const getCurrSearchItem = () => { // 获取当前选中项
  let idx = currentIndex.value === null ? -1 : currentIndex.value
  let gIdx = 0
  for(; gIdx < searchRes.value.length; gIdx++) {
    const group = searchRes.value[gIdx]
    if(idx >= 0 && idx <= group.data.length) {
      break
    } else{
      idx -= group.data.length
    }
  }
  const item = searchRes.value[gIdx].data[idx]
  return item
}
const isSelected = (gIdx: number, iIdx: number) => { // 判断是否选中
  let idx = currentIndex.value === null ? -1 : currentIndex.value
  for(let g = 0; g < gIdx; g++) {
    const group = searchRes.value[g]
    if(idx >= 0 && idx <= group.data.length) {
      break
    } else{
      idx -= group.data.length
    }   
  }
  return idx === iIdx
}

onMounted(() => {
  if(searchPanelRef.value) {
    resizeObserver.observe(searchPanelRef.value)
    console.log('Observe Start');
  }
})
onUnmounted(() => {
  resizeObserver.disconnect()
})


</script>

<style lang="scss" scoped></style>
