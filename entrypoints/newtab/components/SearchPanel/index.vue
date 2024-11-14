<template>
  <div ref="searchPanelRef" class="mt-4 w-full" @keydown="handleKeyDown">
    <Input class="" placeholder="输入关键词搜索" v-model="keyword" @input="search" />
    <div class="max-h-[70vh] overflow-y-auto">
      <template v-for="group, gIdx in searchRes" :key="group.title">
        <div class="mt-4" v-if="group.data.length > 0">
          <div class="text-lg font-semibold">{{ group.title }}</div>
          <div ref="gridRef" class="my-2 grid grid-cols-[repeat(auto-fill,minmax(130px,auto))] justify-items-center">
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
  setKeySelect(null)
  const e = keyword.value.trim()
  if (!e) return

  const websiteGroup = searchRes.value[0]
  websiteGroup.data = [] // Clear previous results
  const searchRegex = new RegExp(e, 'i') // 'i' flag for case-insensitive search
  websites.Data.forEach(group => {
    group.data.forEach(website => {
      if (searchRegex.test(website.title) || searchRegex.test(website.desc)) {
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
const searchPanelRef = ref<HTMLDivElement | null>(null)
const GridColNum = ref(0) // 每行显示的列数，根据实际grid布局调整
const handleKeyDown = (e: KeyboardEvent) => {
  // 没有搜索结果时，不响应键盘事件
  if(searchResLength.value === 0) return

  // 如果当前没有选中项，则只有在按下箭头键时选中第一项;
  if(currentIndex.value === null) {
    if(e.key === 'ArrowDown'){
      setKeySelect(0)
      return
    }
    return
  }

  // 只响应这几个按键
  const keyArr = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Enter']
  if (!keyArr.includes(e.key)) return

  e.preventDefault()

  const idx = currentIndex.value
  const maxIdx = searchResLength.value - 1
  switch (e.key) {
    case 'ArrowRight':
      // 下一项
      setKeySelect(Math.min(idx + 1, maxIdx))
      break
    case 'ArrowLeft':
      // 上一项
      setKeySelect(idx === 0 ? null : idx - 1)
      break
    case 'ArrowDown':
      // 下一行
      if(idx + GridColNum.value > maxIdx) return
      setKeySelect(idx + GridColNum.value)
      break
    case 'ArrowUp':
      // 上一行
      setKeySelect(idx - GridColNum.value < 0 ? null : idx - GridColNum.value)
      break
    case 'Enter':
      if(idx){
        const item = getCurrSearchItem()
        window.open(item.href, '_blank')
      }
      break
  }
}
const setKeySelect = (idx: number | null) => currentIndex.value = idx
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

/* 监听组件宽度变化，获取Grid盒子的列数 */
const gridRef = ref<HTMLDivElement[] | null>(null)
const resizeObserver: ResizeObserver = new ResizeObserver(() => {
  if(gridRef.value?.length) {
    GridColNum.value = tool.getGridColNum(gridRef.value[0])
  }
})
onMounted(() => {
  if(!searchPanelRef.value)return
  resizeObserver.observe(searchPanelRef.value)
  console.log('Observe Start');
})
onUnmounted(() => {
  resizeObserver.disconnect()
  console.log('Observe Over');
})


</script>

<style lang="scss" scoped></style>
