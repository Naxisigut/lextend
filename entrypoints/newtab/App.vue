<template>
  <div class="container min-h-screen bg-gray-50">
    <router-view />
    
    <Dialog title="搜索" v-model:open="isOpen":showHeader="false":showFooter="false">
      <SearchPanel />
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Dialog from './components/Dialog.vue';
import SearchPanel from './components/SearchPanel/index.vue';
import { useEventListener } from '@vueuse/core';

const cpnt = ref<string | null>(null)
const onFunction = (name: string | null) => {
  cpnt.value = name
}

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
