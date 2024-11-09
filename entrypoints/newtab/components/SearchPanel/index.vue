<template>
  <!-- <div class="mt-4 max-w-[80vw] sm:w-[500px] md:w-[600px] lg:w-[60vw]"> -->
  <div class="mt-4 w-full">
    <Input class="" placeholder="输入关键词搜索" v-model="keyword" @input="search" />
    <div class="mt-2 max-h-[70vh] overflow-y-auto">
      <template v-for="group in searchRes" :key="group.title">
        <template v-if="group.data.length > 0">
          <div class="text-lg font-semibold text-muted-foreground">{{ group.title }}</div>
          <div class="grid grid-cols-[repeat(auto-fill,minmax(100px,auto))] gap-2">
            <template v-for="website in group.data" :key="website.title">
              <WebSiteItem :website="website" />
            </template>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { ref } from 'vue';
import { default as websites, type Website } from '../../static/websites';
import WebSiteItem from '../WebSiteItem.vue';
type SearchGroupRes = {
  title: string
  data: Array<Website>
}

const keyword = ref('')
const searchRes = ref<Array<SearchGroupRes>>([])
const search = () => {
  const e = keyword.value.trim()
  if (!e) return
  const websitesSearchRes: Website[] = []

  websites.Data.forEach(group => {
    group.data.forEach(website => {
      if (website.title.includes(e) || website.desc.includes(e)) {
        websitesSearchRes.push(website)
      }
    })
  })

  const res = [
    {
      title: '常用网站',
      data: websitesSearchRes
    }
  ]

  searchRes.value = res
}

</script>

<style lang="scss" scoped></style>
