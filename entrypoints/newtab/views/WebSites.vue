<template>
  <div class="p-6">
    <div class="space-y-8">
      <div v-for="group in allData" :key="group.groupId" class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300" @contextmenu.prevent="onGroupContextMenu($event, group)">{{ group.groupName }}</h2>
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
            <div class="h-full flex items-center justify-center" @click="onPlus(group.groupId)">
              <Plus class="w-10 h-10 text-white"/>
            </div>
          </LiquidGlassWrapper>
        </div>
      </div>
    </div>
  </div>

  
  <Dialog :title="dialogTitle" v-model:open="isOpen" @confirm="onConfirm">
    <div class="p-4 space-y-4">
      <template v-if="openType === 'addNewGroup' || openType === 'editGroup'">
        <Input type="text" v-model="newGroupName" placeholder="请输入类型名称" />
      </template>
      <template v-if="openType === 'addNewWebsite' || openType === 'editWebsite'">
        <Input type="text" v-model="newWebsite.title" placeholder="请输入名称" />
        <Input type="text" v-model="newWebsite.desc" placeholder="请输入描述" />
        <Input type="text" v-model="newWebsite.href" placeholder="请输入链接地址" />
        <Input type="text" v-model="newWebsite.icon" placeholder="请输入图标地址" />
        <Select v-model="newWebsite.typeId" :disabled="openType === 'addNewWebsite'">
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
import { Input } from "@/components/ui/input/index"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select/index';
import request from '@/lib/http.js';
import ContextMenu from '@imengyu/vue3-context-menu'

// #region 类型定义
type DialogOpenType = '' 
  | 'addNewWebsite' 
  | 'editWebsite' 
  | 'addNewGroup'
  | 'editGroup'
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
// #endregion


const newGroupName = ref('')
const newWebsite = ref<Website>({
  id: '',
  title: '',
  desc: '',
  href: '',
  icon: '',
  typeId: ''
})
const currGroupId = ref('')
const currItem = ref<Website | null>(null)
const onPlus = (groupId: string) => {
  currGroupId.value = groupId
  onOpen('addNewWebsite')
}

//#region 弹窗
const dialogTitle = ref('')
const isOpen = ref(false)
const openType = ref<DialogOpenType>('')
const onOpen = (type: DialogOpenType) => {
  openType.value = type
  if(type === 'addNewGroup'){
    newGroupName.value = ""
    dialogTitle.value = "新增分组"
  }
  if(type === 'editGroup'){
    const currGroup = allData.value.find((i) => i.groupId === currGroupId.value)
    if(!currGroup)return
    newGroupName.value = currGroup.groupName
    dialogTitle.value = "编辑分组"
  }
  if(type === 'addNewWebsite'){
    newWebsite.value = {
      id: '',
      title: '',
      desc: '',
      href: '',
      icon: '',
      typeId: currGroupId.value || '' // 新建时固定类型
    }
    dialogTitle.value = "新增网站"
  }

  if(type === 'editWebsite'){
    const item = currItem.value
    if(!item)return
    newWebsite.value = {
      ...item, 
      typeId: item.typeId.toString()
    }
    dialogTitle.value = "编辑网站"
  }
  isOpen.value = true
}
const onConfirm = () => {
  if(openType.value === 'addNewGroup'){
    onConfirmAddNewGroup()
  }else if(openType.value === 'editGroup'){
    onConfirmEditGroup()
  }else if(openType.value === 'addNewWebsite'){
    onConfirmAddNewWebsite()
  }else if(openType.value === 'editWebsite'){
    onConfirmEditWebsite()
  }
}
//#endregion


//#region 新建分组
const onConfirmAddNewGroup = () => {
  if (!newGroupName.value) return
  request.post('/AddWebsiteType', {
    name: newGroupName.value
  }).then((res) => {
    if(res.success){
      isOpen.value = false
      initWebsiteData()
    }else{
      // 获取失败 msg
    }
  })
}
//#endregion

//#region 编辑分组
const onConfirmEditGroup = () => {
  if (!newGroupName.value) return
  request.post('/UpdateWebsiteType', {
    id: currGroupId.value,
    name: newGroupName.value
  }).then((res) => {
    if(res.success){
      isOpen.value = false
      initWebsiteData()
    }else{
      // 获取失败 msg
    }
  })
}
//#endregion

//#region 删除分组
const onDeleteGroup = async (groupId: string) => {
  const deleteRes = await request.post('/DeleteWebsiteType', {
    id: groupId
  })
  if(!deleteRes.success) {
    // 删除失败msg
    return
  }
  initWebsiteData()
}
//#endregion


//#region 新建网站
const onConfirmAddNewWebsite = async () => {
  // fake validate
  if (!newWebsite.value.title) return
  
  const res = await request.post('/AddWebsite', newWebsite.value)
  if(!res.success) {
    // 获取失败 msg
    return
  }
  refreshGroupDataByTypeId(currGroupId.value)
  isOpen.value = false
}
// #endregion

//#region 编辑网站
const onConfirmEditWebsite = () => {
  if (!newWebsite.value.title) return
  request.post('/UpdateWebsite', newWebsite.value).then((res) => {
    if(res.success){
      refreshGroupDataByTypeId(currGroupId.value)
      isOpen.value = false
    }else{
      // 获取失败 msg
    }
  })
}
//#endregion

//#region 删除网站
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
// #endregion

//#region 右键菜单
const defaultMenuData = {
  theme: "mac",
  // menuTransitionProps: {
  //   duration: 1000,
  //   name: 'fade'
  // },
}
const contextMenuItemAction = (label: MenuLabelType | MenuGroupLabelType) => {
  ContextMenu.closeContextMenu()
  switch (label) {
    case '编辑':
      onOpen('editWebsite')
      break;
    case '删除':
      if (!currItem.value) return
      onDeleteWebsite(currItem.value)
      break;
    case '新增分组':
      onOpen('addNewGroup')
      break;
    case '编辑分组':
      onOpen('editGroup')
      break;
    case "删除分组":
      onDeleteGroup(currGroupId.value)
      break;
    default:
      break;
  }
}


const menuLabels = ['编辑', '删除'] as const
type MenuLabelType = typeof menuLabels[number]
const onContextMenu = (e: MouseEvent, website: Website, group: WebsiteGroup) => {
  currGroupId.value = group.groupId
  currItem.value = website
  ContextMenu.showContextMenu({
    ...defaultMenuData,
    items: menuLabels.map(label => ({
      label,
      onClick: () => contextMenuItemAction(label)
    })),
    x: e.x,
    y: e.y,
  })
}

const menuGroupLabels = ['新增分组', '编辑分组', '删除分组'] as const
type MenuGroupLabelType = typeof menuGroupLabels[number]
const onGroupContextMenu = (e: MouseEvent, group: WebsiteGroup) => {
  currGroupId.value = group.groupId
  ContextMenu.showContextMenu({
    ...defaultMenuData,
    items: menuGroupLabels.map(label => ({
      label,
      onClick: () => contextMenuItemAction(label)
    })),
    x: e.x,
    y: e.y,
  })
}

//#endregion

// #region 初始化
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

//#endregion

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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
