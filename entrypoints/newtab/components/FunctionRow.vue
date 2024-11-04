<template>
  <div
    class="flex items-center rounded-sm p-1 hover:bg-gray-200 hover:shadow-sm transition-all duration-200 ease-in-out" :class="{'bg-gray-200': props.active}">
    <slot name="prefix" />
    <span class="flex-1 ml-2 text-sm font-semibold text-gray-700">
      <slot />
    </span>
    <slot name="suffix" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  active?: boolean
}>()
</script>
