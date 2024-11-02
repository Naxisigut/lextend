<template>
  <div v-if="!cpnt" class="placeholder absolute inset-0 m-auto"></div>
  <component :is="cpnt" class=""></component>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MainTest from './MainTest.vue'
const cpnt = ref(null)

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
