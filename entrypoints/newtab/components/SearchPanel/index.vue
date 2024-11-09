<template>
  <div class="mt-4">
    <Input placeholder="输入关键词搜索" v-model="keyword" @input="search" />
    <div>
      <template v-for="item in searchRes" :key="item.title">
        <div class="text-sm font-medium text-muted-foreground">{{ item.title }}</div>
        <div class="flex flex-wrap gap-2">
          <template v-for="website in item.data" :key="website.title">
            <a :href="website.href" class="text-sm text-primary hover:underline">{{ website.title }}</a>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { ref } from 'vue';
import { default as websites, type Website } from '../../static/websites';
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

<style lang="scss" scoped>

</style>
