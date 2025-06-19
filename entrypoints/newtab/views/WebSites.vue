<template>
  <div class="p-6">
    <div class="space-y-8 relative">
      <div class="absolute top-0 right-0">
        <LiquidGlassWrapper class="rounded-full hover:scale-105" @click.stop="onOpen('addNewGroup')">
          <div class="py-1 px-2">add new group</div>
        </LiquidGlassWrapper>
      </div>
      <div v-for="group in allData" :key="group.groupId" class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300">{{ group.groupName }}</h2>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] auto-rows-[120px] ">
          <LiquidGlassWrapper v-for="website in group.data" :key="website.id" class=" hover:scale-120 hover:z-10" @contextmenu.prevent="onContextMenu($event, website, group)">
            <a :href="website.href" target="_blank"
              class="h-full flex flex-col items-center justify-center text-center text-white">
                <div class="w-12 h-12 flex items-center justify-center relative">
                  <div class="website-icon-bg"></div>
                  <img v-if="website.icon" :src="website.icon" :alt="website.title">
                  <Globe v-else class="z-10" />
                </div>
                <div class="px-1 w-full truncate text-sm ">{{ website.title }}</div>
                <div class="px-1 w-full truncate text-xs text-white/80">{{ website.desc }}</div>
            </a>  
          </LiquidGlassWrapper>
          <LiquidGlassWrapper class="hover:scale-120 hover:z-10">
            <div class="h-full flex items-center justify-center" @click="onOpen('addNewWebsite', group.groupId)">
              <Plus class="w-10 h-10 text-white"/>
            </div>
          </LiquidGlassWrapper>
        </div>
      </div>
    </div>
  </div>

  
  <Dialog title="添加类型" v-model:open="isOpen" @confirm="onConfirm">
    <div class="p-4 space-y-4">
      <template v-if="openType === 'addNewGroup'">
        <Input type="text" v-model="newGroupName" placeholder="请输入类型名称" />
      </template>
      <template v-if="openType === 'addNewWebsite'">
        <Input type="text" v-model="newWebsite.title" placeholder="请输入名称" />
        <Input type="text" v-model="newWebsite.desc" placeholder="请输入描述" />
        <Input type="text" v-model="newWebsite.href" placeholder="请输入链接地址" />
        <Input type="text" v-model="newWebsite.icon" placeholder="请输入图标地址" />
        <Select v-model="newWebsite.typeId" disabled>
          <SelectTrigger>
            <SelectValue placeholder="请选择类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="type in websiteTypes" :key="type.id" :value="type.id">{{ type.text }}</SelectItem>
          </SelectContent>
        </Select>
      </template>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Globe, Plus } from 'lucide-vue-next';
import Dialog from '../components/Dialog.vue';
import { ref } from 'vue';
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import request from '@/lib/http';
import ContextMenu from '@imengyu/vue3-context-menu'
type DialogOpenType = 'addNewGroup' | 'addNewWebsite' | ''
interface Website {
  id: string
  title: string
  desc: string
  href: string
  icon: string
  typeId: string
}
interface WebsiteGroup {
  groupId: string
  groupName: string
  data: Website[]
}

const isOpen = ref(false)
const openType = ref<DialogOpenType>('')
const onOpen = (type: DialogOpenType, groupId?: string) => {
  openType.value = type
  if(groupId){
    currGroupId.value = groupId
    newWebsite.value.typeId = groupId
  }
  isOpen.value = true
}
const onConfirm = () => {
  if(openType.value === 'addNewGroup'){
    onConfirmAddNewGroup()
  }else if(openType.value === 'addNewWebsite'){
    onConfirmAddNewWebsite()
  }
}
/* 新建类型 */
const newGroupName = ref('')
const onConfirmAddNewGroup = () => {
  if (!newGroupName.value) return
  request.post('/AddWebsiteType', {
    name: newGroupName.value
  }).then((res) => {
    if(res.success){
      isOpen.value = false
      newGroupName.value = ''
    }else{
      // 获取失败 msg
    }
  })
}



const currGroupId = ref('')
/* 新建网站 */
const newWebsite = ref({
  title: '',
  desc: '',
  href: '',
  icon: '',
  typeId: ''
})
const onConfirmAddNewWebsite = async () => {
  // fake validate
  if (!newWebsite.value.title) return
  
  const res = await request.post('/AddWebsite', newWebsite.value)
  if(!res.success) {
    // 获取失败 msg
    return
  }
  refreshGroupDataByTypeId(currGroupId.value)
  newWebsite.value = {
    title: '',
    desc: '',
    href: '',
    icon: '',
    typeId: ''
  }
  isOpen.value = false
}

/* 删除网站 */
const onDeleteWebsite = async (website: Website) => {
  const deleteRes = await request.post('/DeleteWebsite', {
    id: website.id
  })
  if(!deleteRes.success) {
    // 删除失败msg
    return
  }
  refreshGroupDataByTypeId(currGroupId.value)
}
/* 编辑网站 */
const onEditWebsite = (website: Website) => {
  console.log(website);
}


const onContextMenu = (e: MouseEvent, website: Website, group: WebsiteGroup) => {
  currGroupId.value = group.groupId
  ContextMenu.showContextMenu({
    theme: "mac",
    // menuTransitionProps: {
    //   name: 'fade'
    // },
    x: e.clientX,
    y: e.clientY,
    items: [
      {
        label: '编辑',
        onClick: () => onEditWebsite(website)
      },
      {
        label: '删除',
        onClick: () => onDeleteWebsite(website)
      },
    ]
  })
}




/* 获取所有数据 */
/* getAllTypes => 根据类型获取 */
const websiteTypes = ref<{id: string, text: string}[]>([])
const allData = ref<WebsiteGroup[]>([])
const getAllTypes = async () => {
  const res = await request.post('/GetWebsiteTypes', {})
  if(res.success){
    res.data.forEach((i: any) => i.id = i.id.toString())
    websiteTypes.value = res.data
  }else{
    // 获取失败 msg
  }
}
const getWebsitesByTypeId = async (typeId: string) => {
  const res = await request.post('/GetWebsites', {
    isPaging: false,
    typeId: typeId
  })
  const data = res.success ? res.data.list : []
  return data
}
const refreshGroupDataByTypeId = async (typeId: string) => {
  const group = allData.value.find((i) => i.groupId === typeId)
  if(!group) return
  const newGroupData = await getWebsitesByTypeId(typeId)
  group.data = newGroupData
}
const initWebsiteData = async () => {
  await getAllTypes()
  allData.value = websiteTypes.value.map((item) => {
    return {
      groupId: item.id,
      groupName: item.text,
      data: []
    }
  })
  allData.value.forEach(async (item) => {
    refreshGroupDataByTypeId(item.groupId)
  })
}
initWebsiteData()

</script>

<style lang="scss" scoped>
.website-icon-bg {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(-45deg, var(--vp-c-brand-1) 30%, var(--vp-c-brand-next));
  filter: blur(15px);
  opacity: .6;
  transition: opacity 1s ease;
  border-radius: 9999px;

  &:hover {
    opacity: 1;
  }
}
</style>
