<template>
  <div class="cross-corner-wrapper">
    <slot>Plus</slot>
    <svg class="corner" width="5" height="5" viewBox="0 0 5 5" style="top: -2px;left: -2px;">
      <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
    </svg>
    <svg class="corner" width="5" height="5" viewBox="0 0 5 5" style="top: -2px;right: -2px;">
      <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
    </svg>
    <svg class="corner" width="5" height="5" viewBox="0 0 5 5" style="bottom: -2px;left: -2px;">
      <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
    </svg>
    <svg class="corner" width="5" height="5" viewBox="0 0 5 5" style="bottom: -2px;right: -2px;">
      <path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z"></path>
    </svg>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.cross-corner-wrapper {
  position: relative;
  padding-left: 0.375rem;
  padding-right: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border: 1px dashed rgb(125 211 252 / 0.6);
  background-color: rgba(56, 191, 248, 0.103);
  &:hover{
    background-color: rgb(56 189 248 / 0.15)
  }
  svg.corner{
    position: absolute;
    fill: rgb(125 211 252);
  }
}
</style>

