<template>
  <Dialog v-model:open="open">
    <DialogTrigger v-if="showTrigger">
      <Button>{{ props.triggerText }}</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ props.title }}</DialogTitle>
      </DialogHeader>

      <DialogFooter>
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
}
const props = withDefaults(defineProps<Props>(), {
  title: '标题',
  triggerText: '打开',
  showTrigger: false
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

