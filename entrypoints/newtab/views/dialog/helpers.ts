import type { DialogOptions, DialogInstance, DialogAnimationDuration } from './types'
import { ANIMATION_CONSTANTS, DIALOG_DEFAULTS, CSS_CLASSES, ERROR_MESSAGES } from './constants'
import { generateId, mergeOptions } from './utils'

/**
 * 计算动画时长
 */
export function calculateAnimationDuration(
  customDuration?: number,
  animationSpeed?: DialogAnimationDuration
): number {
  if (customDuration !== undefined) {
    return customDuration
  }
  
  switch (animationSpeed) {
    case 'fast':
      return ANIMATION_CONSTANTS.DURATIONS.fast
    case 'slow':
      return ANIMATION_CONSTANTS.DURATIONS.slow
    default:
      return ANIMATION_CONSTANTS.DURATIONS.normal
  }
}

/**
 * 构建CSS类名数组
 */
export function buildCSSClasses(
  baseClass: string,
  conditionalClasses: Array<{
    condition: boolean
    className: string
  }> = []
): string[] {
  const classes = [baseClass]
  
  conditionalClasses.forEach(({ condition, className }) => {
    if (condition) {
      classes.push(className)
    }
  })
  
  return classes
}

/**
 * 构建动画相关CSS类名
 */
export function buildAnimationClasses(
  animationState: string,
  animationSpeed?: DialogAnimationDuration,
  animationType?: string
): string[] {
  return buildCSSClasses('', [
    {
      condition: animationState === 'entering',
      className: CSS_CLASSES.STATES.entering
    },
    {
      condition: animationState === 'leaving',
      className: CSS_CLASSES.STATES.leaving
    },
    {
      condition: animationSpeed === 'fast',
      className: CSS_CLASSES.SPEEDS.fast
    },
    {
      condition: animationSpeed === 'slow',
      className: CSS_CLASSES.SPEEDS.slow
    },
    {
      condition: Boolean(animationType && animationType !== 'none' && animationType !== 'default'),
      className: animationType ? `${CSS_CLASSES.ANIMATION_PREFIX}${animationType}` : ''
    },
    {
      condition: animationType === 'bounce',
      className: `${CSS_CLASSES.ANIMATION_PREFIX}bounce`
    }
  ])
}

/**
 * 创建弹窗实例
 */
export function createDialogInstance(
  options: DialogOptions,
  stackLength: number = 0
): DialogInstance {
  const id = generateId()
  
  // 直接使用对象展开进行合并
  const mergedOptions: DialogOptions = {
    width: DIALOG_DEFAULTS.SIZE.width,
    height: DIALOG_DEFAULTS.SIZE.height,
    closable: true,
    maskClosable: true,
    escClosable: true,
    animationDuration: ANIMATION_CONSTANTS.DURATIONS.normal,
    animationEasing: ANIMATION_CONSTANTS.DEFAULT_EASING,
    ...options // 用户选项覆盖默认值
  }
  
  const baseZIndex = DIALOG_DEFAULTS.BASE_Z_INDEX

  return {
    id,
    options: mergedOptions,
    isVisible: true,
    zIndex: baseZIndex + stackLength,
    createdAt: Date.now(),
    close: () => {} // 会在创建后被重新赋值
  }
}

/**
 * 验证弹窗配置
 */
export function validateDialogOptions(options: DialogOptions): void {
  if (!options.component) {
    throw new Error(ERROR_MESSAGES.COMPONENT_REQUIRED)
  }
}

/**
 * 检查是否超出最大弹窗数量
 */
export function checkMaxDialogCount(currentCount: number, maxCount: number = DIALOG_DEFAULTS.MAX_COUNT): void {
  if (currentCount >= maxCount) {
    throw new Error(`${ERROR_MESSAGES.MAX_COUNT_EXCEEDED}: ${maxCount}`)
  }
}

/**
 * 创建动画监听器
 */
export function createAnimationListener(
  element: HTMLElement,
  duration: number,
  onComplete: () => void
): () => void {
  let completed = false
  
  const handleAnimationEnd = () => {
    if (completed) return
    completed = true
    
    element.removeEventListener('animationend', handleAnimationEnd)
    element.removeEventListener('transitionend', handleAnimationEnd)
    onComplete()
  }
  
  // 监听动画结束事件
  element.addEventListener('animationend', handleAnimationEnd, { once: true })
  element.addEventListener('transitionend', handleAnimationEnd, { once: true })
  
  // 备用超时机制
  const timeoutId = setTimeout(() => {
    handleAnimationEnd()
  }, duration + ANIMATION_CONSTANTS.BUFFER_TIME)
  
  // 返回清理函数
  return () => {
    clearTimeout(timeoutId)
    element.removeEventListener('animationend', handleAnimationEnd)
    element.removeEventListener('transitionend', handleAnimationEnd)
  }
}

/**
 * 执行动画
 */
export async function executeAnimation(
  element: HTMLElement | null,
  duration: number,
  onStateChange: (state: string) => void,
  enteringState: string,
  completedState: string
): Promise<void> {
  if (!element) {
    onStateChange(completedState)
    return
  }
  
  onStateChange(enteringState)
  
  return new Promise<void>((resolve) => {
    const cleanup = createAnimationListener(element, duration, () => {
      onStateChange(completedState)
      resolve()
    })
    
    // 如果组件在动画过程中被销毁，确保清理资源
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && !document.contains(element)) {
          cleanup()
          observer.disconnect()
          resolve()
        }
      })
    })
    
    observer.observe(document.body, { childList: true, subtree: true })
  })
}

/**
 * 获取栈顶弹窗
 */
export function getTopDialog(dialogStack: DialogInstance[]): DialogInstance | undefined {
  return dialogStack[dialogStack.length - 1]
}

/**
 * 从栈中查找弹窗
 */
export function findDialogInStack(
  dialogStack: DialogInstance[], 
  id: string
): { dialog: DialogInstance; index: number } | null {
  const index = dialogStack.findIndex(dialog => dialog.id === id)
  if (index === -1) return null
  
  return {
    dialog: dialogStack[index],
    index
  }
}

/**
 * 判断组件类型
 */
export function getComponentType(component: any): 'vue-component' | 'render-function' | 'vnode' {
  if (typeof component === 'object' && component !== null && 
      ('setup' in component || 'render' in component || 'template' in component)) {
    return 'vue-component'
  } else if (typeof component === 'function') {
    return 'render-function'
  } else {
    return 'vnode'
  }
}

/**
 * 安全执行异步回调
 */
export async function safeExecuteCallback<T>(
  callback: (() => T | Promise<T>) | undefined,
  defaultValue: T
): Promise<T> {
  if (!callback) return defaultValue
  
  try {
    const result = callback()
    return result instanceof Promise ? await result : result
  } catch (error) {
    console.warn('回调函数执行失败:', error)
    return defaultValue
  }
} 