<template>
  <div class="h-full overflow-y-auto">
    <div v-if="!cpnt" class="placeholder absolute inset-0 m-auto"></div>
    <component :is="resolveComponent(cpnt)" class=""></component>
  </div>
</template>

<script lang="ts" setup>
import { ref, markRaw } from 'vue';
import WebSites from '../views/WebSites.vue';

const cpnt = defineModel<string | null>('cpnt', { required: true })

// 组件映射表
const componentMap: Record<string, any> = {
  'WebSites': markRaw(WebSites),
  // 可以添加更多组件...
}

// 解析组件函数
const resolveComponent = (name: string | null) =>  name && componentMap[name]
</script>

<style lang="scss" scoped>
.placeholder {
  width: 320px;
  height: 320px;
  background-image: linear-gradient(-45deg, var(--vp-c-brand-1) 30%, var(--vp-c-brand-next));
  filter: blur(120px);
  animation: rainbow 6s linear infinite;

  opacity: .8;
  transition: opacity 1s ease;
  &:hover {
    opacity: .2;
  }
}
</style>
