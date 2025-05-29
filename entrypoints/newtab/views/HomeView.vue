<template>
  <div class="flex flex-col items-center justify-center h-screen relative">
    <!-- <div class="placeholder absolute inset-0 m-auto"></div> -->
    <div class="w-full max-w-2xl">
      <SearchBar ref="searchBarRef" />
      <div class="mt-4 grid grid-cols-4 md:grid-cols-6 gap-4">
        <CrossCornerWrapper>
          <div class="p-2 flex flex-col items-center cursor-pointer" @click="toWebsite">
            <Globe class="w-8 h-8 text-sky-800" />
            <span class="mt-2 text-sky-800">常用网站</span>
          </div>
        </CrossCornerWrapper>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import SearchBar from '../components/SearchBar.vue';
import { Globe } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import CrossCornerWrapper from '../components/CrossCornerWrapper.vue';
defineOptions({
  name: 'HomeView'
})
onMounted(() => {
  focusVisibleBar()
})

const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null)
const focusVisibleBar = () => {
  if (searchBarRef.value) {
    const el = searchBarRef.value.$el
    /* checkVisibility: 检查元素是否可见, 无论其可见性是否被其祖先元素的样式影响 */
    el && searchBarRef.value.focus()
  }
}

const router = useRouter()
const toWebsite = () => {
  console.log(111111);
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

.item{

}

</style>
