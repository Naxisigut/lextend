<template>
  <div class="container min-h-screen">
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

/* 搜索对话框 */
const isOpen = ref(false)
useEventListener(document, 'keydown', (e) => {
  if (e.key === 'k' && e.ctrlKey) {
    e.preventDefault()
    isOpen.value = true
  }
})

</script>

<style lang="scss">
body {
  background: url("/assets/flowers.jpg") center center;
  background-size: 500px;
  animation: moveBackground 180s linear infinite;
}
@keyframes moveBackground {
  from {
    background-position: 0% 0%;
  }
  to {
    background-position: 0% -1500%;
  }
}
</style>
