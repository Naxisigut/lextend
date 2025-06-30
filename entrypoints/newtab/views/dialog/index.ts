// 导出核心 Hook
export { useDialog, useDialogLocal, getGlobalDialogState } from './useDialog'

// 导出组件
export { default as DialogContainer } from './DialogContainer.vue'

// 导出类型定义
export type {
  DialogOptions,
  DialogInstance,
  UseDialogReturn,
  DialogDefaultOptions,
  CloseReason,
  DialogCloseEvent,
  FocusTrapOptions,
  DialogAnimationState,
  DialogPosition,
  DialogContainerProps,
  DialogContainerEmits
} from './types'

// 导出工具函数（部分）
export {
  generateId,
  getFocusableElements,
  FocusTrap,
  preventBodyScroll,
  isClickOutside,
  delay,
  debounce,
  throttle,
  supportsDialog
} from './utils'

// 导出样式文件
import './style.css'
