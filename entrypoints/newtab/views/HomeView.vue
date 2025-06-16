<template>
  <div class="flex flex-col items-center justify-center h-screen relative">
    <!-- <div class="placeholder absolute inset-0 m-auto"></div> -->
    <div class="w-full max-w-2xl relative">
      <transition name="fade">
        <div v-if="searchBarVisible" class="absolute -top-[3rem] left-0 w-full">
          <SearchBar ref="searchBarRef" />
        </div>
      </transition>
      <LiquidGlassWrapper class="rounded-3xl p-2">
        <div class="dock mt-1 flex items-center justify-center gap-4">
          <img class="w-20 hover:scale-105 transition-all duration-300" src="/assets/dock-icons/safari.png" alt="常用网站" @click="toWebsite">
          <img class="w-20 hover:scale-105 transition-all duration-300" src="/assets/dock-icons/search.png" alt="logo" @mouseenter="showSearchBar" @mouseleave="hideSearchBar">
        </div>
        </LiquidGlassWrapper>
    </div>
  </div>
</template>

<script setup lang='ts'>
import SearchBar from '../components/SearchBar.vue';
import { useRouter } from 'vue-router';
defineOptions({
  name: 'HomeView'
})

const searchBarVisible = ref(false)
const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null)
const focusVisibleBar = () => {
  if (!searchBarRef.value) return
  const el = searchBarRef.value.$el
  /* checkVisibility: 检查元素是否可见, 无论其可见性是否被其祖先元素的样式影响 */
  el && searchBarRef.value.focus()
}
const showSearchBar = () => {
  searchBarVisible.value = true
  nextTick(() => focusVisibleBar())
}
const hideSearchBar = () => {
  searchBarVisible.value = false
}

const router = useRouter()
const toWebsite = () => {
  router.push('/websites')
}
</script>

<style lang='scss' scoped>
.placeholder {
  width: 320px;
  height: 320px;
  background-image: linear-gradient(-45deg, var(--vp-c-brand-1) 30%, var(--vp-c-brand-next));
  filter: blur(120px);
  animation: rainbow;

  opacity: .8;
  transition: opacity 1s ease;
  &:hover {
    opacity: .2;
  }
}

.dock{
  img{
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 2.2);
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