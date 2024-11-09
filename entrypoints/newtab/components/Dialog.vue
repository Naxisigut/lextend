<template>
  <Dialog v-model:open="open">
    <DialogTrigger v-if="showTrigger">
      <Button>{{ props.triggerText }}</Button>
    </DialogTrigger>
    <DialogContent class="min-w-[80vw] sm:min-w-[500px] md:min-w-[600px] lg:min-w-[60vw]">
      <DialogHeader v-if="showHeader">
        <DialogTitle>{{ props.title }}</DialogTitle>
      </DialogHeader>
      <slot>内容</slot>
      <DialogFooter v-if="showFooter">
        <slot name="footer">
          <Button @click="onConfirm">确定</Button>
        </slot>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

/* Props */
/* defineProps的泛型 基于类型声明Props */
/* withDefaults 设置默认值 */
interface Props {
  title?: string
  triggerText?: string
  showTrigger?: boolean
  showHeader?: boolean
  showFooter?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  title: '标题',
  triggerText: '打开',
  showTrigger: false,
  showHeader: true,
  showFooter: true
}) 

/* Model */
const open = defineModel<boolean>()

/* Emits */
const emit = defineEmits<{
  (e: 'confirm'): void
}>()

const onConfirm = () => {
  emit('confirm')
}






</script>

