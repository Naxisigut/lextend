// 主要 hooks 和组件
export { useDialog, useDialogLocal, getGlobalDialogState } from './useDialog'
export { default as DialogContainer } from './DialogContainer.vue'

// 类型定义
export type * from './types'

// 工具函数
export { 
  generateId, 
  FocusTrap, 
  preventBodyScroll, 
  debounce, 
  throttle,
  toCssValue,
  mergeOptions
} from './utils'

// 常量配置
export {
  ANIMATION_CONSTANTS,
  DIALOG_DEFAULTS,
  CSS_CLASSES,
  ERROR_MESSAGES,
  FOCUS_SELECTORS
} from './constants'

// 辅助函数
export {
  calculateAnimationDuration,
  buildCSSClasses,
  buildAnimationClasses,
  createDialogInstance,
  validateDialogOptions,
  checkMaxDialogCount,
  createAnimationListener,
  executeAnimation,
  getTopDialog,
  findDialogInStack,
  getComponentType,
  safeExecuteCallback
} from './helpers'

// 导出样式文件
import './style.css'
