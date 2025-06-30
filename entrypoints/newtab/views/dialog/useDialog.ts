import { ref, readonly, computed, onBeforeUnmount, nextTick, createApp, App } from 'vue'
import type { 
  DialogOptions, 
  DialogInstance, 
  UseDialogReturn, 
  DialogDefaultOptions,
  CloseReason 
} from './types'
import { 
  generateId, 
  mergeOptions, 
  preventBodyScroll,
  debounce 
} from './utils'
import DialogContainer from './DialogContainer.vue'
import './style.css'

/**
 * 默认配置
 */
const DEFAULT_OPTIONS: DialogDefaultOptions = {
  width: 'auto',
  height: 'auto',
  closable: true,
  maskClosable: true,
  escClosable: true,
  animationDuration: 300,
  animationEasing: 'ease-out',
  maxCount: 10,
  baseZIndex: 1000
}

/**
 * 全局弹窗栈 - 支持跨组件共享状态
 */
const globalDialogStack = ref<DialogInstance[]>([])

/**
 * 滚动恢复函数栈 - 管理多个弹窗的滚动锁定
 */
const scrollRestoreFunctions: (() => void)[] = []

/**
 * 弹窗渲染器映射 - 存储每个弹窗的 Vue 应用实例
 */
const dialogRenderers = new Map<string, {
  app: App,
  container: HTMLElement
}>()

/**
 * ESC 键处理函数
 */
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && globalDialogStack.value.length > 0) {
    const topDialog = globalDialogStack.value[globalDialogStack.value.length - 1]
    if (topDialog.options.escClosable !== false) {
      closeDialog(topDialog.id, 'escape')
    }
  }
}

/**
 * 全局事件监听器管理
 */
let isGlobalListenerAdded = false

function addGlobalListeners() {
  if (!isGlobalListenerAdded) {
    document.addEventListener('keydown', handleEscapeKey)
    isGlobalListenerAdded = true
  }
}

function removeGlobalListeners() {
  if (isGlobalListenerAdded && globalDialogStack.value.length === 0) {
    document.removeEventListener('keydown', handleEscapeKey)
    isGlobalListenerAdded = false
  }
}

/**
 * 渲染弹窗到 DOM
 */
function renderDialog(dialogInstance: DialogInstance) {
  // 创建容器元素
  const container = document.createElement('div')
  container.setAttribute('data-dialog-id', dialogInstance.id)
  
  // 创建 Vue 应用实例
  const app = createApp(DialogContainer, {
    dialogData: dialogInstance
  })
  
  // 监听关闭事件
  app.provide('onDialogClose', (event: any) => {
    if (!event.defaultPrevented) {
      closeDialog(dialogInstance.id, event.reason)
    }
  })
  
  // 挂载到容器
  app.mount(container)
  
  // 存储渲染器信息
  dialogRenderers.set(dialogInstance.id, {
    app,
    container
  })
}

/**
 * 销毁弹窗渲染器
 */
function destroyDialog(dialogId: string) {
  const renderer = dialogRenderers.get(dialogId)
  if (renderer) {
    // 卸载 Vue 应用
    renderer.app.unmount()
    
    // 清理 DOM
    if (renderer.container.parentNode) {
      renderer.container.parentNode.removeChild(renderer.container)
    }
    
    // 从映射中移除
    dialogRenderers.delete(dialogId)
  }
}

/**
 * 关闭指定弹窗
 */
function closeDialog(id: string, reason: CloseReason = 'manual'): void {
  const dialogIndex = globalDialogStack.value.findIndex(dialog => dialog.id === id)
  if (dialogIndex === -1) return

  const dialog = globalDialogStack.value[dialogIndex]
  
  // 执行关闭前回调
  if (dialog.options.onBeforeClose) {
    const shouldClose = dialog.options.onBeforeClose()
    if (shouldClose === false) return
    
    // 支持异步回调
    if (shouldClose instanceof Promise) {
      shouldClose.then(result => {
        if (result !== false) {
          performCloseDialog(id, reason)
        }
      }).catch(() => {
        // 如果异步回调出错，默认允许关闭
        performCloseDialog(id, reason)
      })
      return
    }
  }

  performCloseDialog(id, reason)
}

/**
 * 执行弹窗关闭逻辑
 */
function performCloseDialog(id: string, reason: CloseReason): void {
  const dialogIndex = globalDialogStack.value.findIndex(dialog => dialog.id === id)
  if (dialogIndex === -1) return

  const dialog = globalDialogStack.value[dialogIndex]
  
  // 标记为不可见（为后续动画做准备）
  dialog.isVisible = false

  // 立即从栈中移除（阶段2暂不考虑动画延迟）
  globalDialogStack.value.splice(dialogIndex, 1)

  // 恢复滚动（如果这是最后一个弹窗）
  if (globalDialogStack.value.length === 0 && scrollRestoreFunctions.length > 0) {
    const restoreScroll = scrollRestoreFunctions.pop()
    restoreScroll?.()
  }

  // 移除全局监听器（如果没有弹窗了）
  removeGlobalListeners()

  // 销毁弹窗渲染器
  destroyDialog(id)

  // 执行关闭回调
  nextTick(() => {
    dialog.options.onClose?.()
  })
}

/**
 * 关闭栈顶弹窗
 */
function closeTopDialog(): void {
  if (globalDialogStack.value.length === 0) return
  
  const topDialog = globalDialogStack.value[globalDialogStack.value.length - 1]
  closeDialog(topDialog.id, 'manual')
}

/**
 * 关闭所有弹窗
 */
function closeAllDialogs(): void {
  // 从后往前关闭，避免数组索引问题
  const dialogIds = globalDialogStack.value.map(dialog => dialog.id)
  dialogIds.reverse().forEach(id => {
    closeDialog(id, 'manual')
  })
}

/**
 * 获取指定弹窗实例
 */
function getDialog(id: string): DialogInstance | undefined {
  return globalDialogStack.value.find(dialog => dialog.id === id)
}

/**
 * 显示弹窗的防抖处理
 */
const debouncedShowDialog = debounce((options: DialogOptions, resolve: (id: string) => void) => {
  const dialogId = generateId()
  
  // 合并默认选项
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

  // 检查最大弹窗数量限制
  if (globalDialogStack.value.length >= (mergedOptions.maxCount || 10)) {
    console.warn(`已达到最大弹窗数量限制: ${mergedOptions.maxCount}`)
    return
  }

  // 创建弹窗实例
  const dialogInstance: DialogInstance = {
    id: dialogId,
    options: mergedOptions,
    isVisible: true,
    zIndex: (mergedOptions.baseZIndex || 1000) + globalDialogStack.value.length,
    createdAt: Date.now(),
    close: () => closeDialog(dialogId, 'manual')
  }

  // 添加到弹窗栈
  globalDialogStack.value.push(dialogInstance)

  // 防止页面滚动（仅第一个弹窗时）
  if (globalDialogStack.value.length === 1) {
    const restoreScroll = preventBodyScroll()
    scrollRestoreFunctions.push(restoreScroll)
  }

  // 添加全局监听器
  addGlobalListeners()

  // 渲染弹窗到 DOM
  renderDialog(dialogInstance)

  // 执行打开回调会在 DialogContainer 组件的 onMounted 中处理

  resolve(dialogId)
}, 50) // 50ms 防抖，防止快速连续调用

/**
 * useDialog Hook 主函数
 */
export function useDialog(): UseDialogReturn {
  
  /**
   * 显示弹窗
   */
  const showDialog = (options: DialogOptions): Promise<string> => {
    return new Promise((resolve) => {
      // 验证必需的参数
      if (!options.component) {
        throw new Error('Dialog component is required')
      }

      debouncedShowDialog(options, resolve)
    })
  }

  /**
   * 当前弹窗数量
   */
  const count = computed(() => globalDialogStack.value.length)

  /**
   * 组件卸载时清理
   */
  onBeforeUnmount(() => {
    // 注意：这里不能直接关闭所有弹窗，因为可能有其他组件实例在使用
    // 全局状态的清理应该由最后一个弹窗关闭时处理
  })

  return {
    dialogStack: readonly(globalDialogStack),
    showDialog,
    closeDialog: (id: string) => closeDialog(id, 'manual'),
    closeTopDialog,
    closeAllDialogs,
    getDialog,
    count
  }
}

/**
 * 创建独立的弹窗实例（不共享全局状态）
 */
export function useDialogLocal(): UseDialogReturn {
  const localDialogStack = ref<DialogInstance[]>([])
  const localScrollRestoreFunctions: (() => void)[] = []

  const localCloseDialog = (id: string, reason: CloseReason = 'manual') => {
    const dialogIndex = localDialogStack.value.findIndex(dialog => dialog.id === id)
    if (dialogIndex === -1) return

    const dialog = localDialogStack.value[dialogIndex]
    
    // 执行关闭前回调
    if (dialog.options.onBeforeClose) {
      const shouldClose = dialog.options.onBeforeClose()
      if (shouldClose === false) return
      
      if (shouldClose instanceof Promise) {
        shouldClose.then(result => {
          if (result !== false) {
            performLocalCloseDialog(id, reason)
          }
        }).catch(() => {
          performLocalCloseDialog(id, reason)
        })
        return
      }
    }

    performLocalCloseDialog(id, reason)
  }

  const performLocalCloseDialog = (id: string, reason: CloseReason) => {
    const dialogIndex = localDialogStack.value.findIndex(dialog => dialog.id === id)
    if (dialogIndex === -1) return

    const dialog = localDialogStack.value[dialogIndex]
    dialog.isVisible = false
    localDialogStack.value.splice(dialogIndex, 1)

    // 恢复滚动
    if (localDialogStack.value.length === 0 && localScrollRestoreFunctions.length > 0) {
      const restoreScroll = localScrollRestoreFunctions.pop()
      restoreScroll?.()
    }

    nextTick(() => {
      dialog.options.onClose?.()
    })
  }

  const showDialog = (options: DialogOptions): Promise<string> => {
    return new Promise((resolve) => {
      if (!options.component) {
        throw new Error('Dialog component is required')
      }

      const dialogId = generateId()
      const mergedOptions = { ...DEFAULT_OPTIONS, ...options }

      if (localDialogStack.value.length >= (mergedOptions.maxCount || 10)) {
        console.warn(`已达到最大弹窗数量限制: ${mergedOptions.maxCount}`)
        return
      }

      const dialogInstance: DialogInstance = {
        id: dialogId,
        options: mergedOptions,
        isVisible: true,
        zIndex: (mergedOptions.baseZIndex || 1000) + localDialogStack.value.length,
        createdAt: Date.now(),
        close: () => localCloseDialog(dialogId, 'manual')
      }

      localDialogStack.value.push(dialogInstance)

      if (localDialogStack.value.length === 1) {
        const restoreScroll = preventBodyScroll()
        localScrollRestoreFunctions.push(restoreScroll)
      }

      nextTick(() => {
        dialogInstance.options.onOpen?.()
      })

      resolve(dialogId)
    })
  }

  const closeTopDialog = () => {
    if (localDialogStack.value.length === 0) return
    const topDialog = localDialogStack.value[localDialogStack.value.length - 1]
    localCloseDialog(topDialog.id, 'manual')
  }

  const closeAllDialogs = () => {
    const dialogIds = localDialogStack.value.map(dialog => dialog.id)
    dialogIds.reverse().forEach(id => {
      localCloseDialog(id, 'manual')
    })
  }

  const getDialog = (id: string): DialogInstance | undefined => {
    return localDialogStack.value.find(dialog => dialog.id === id)
  }

  const count = computed(() => localDialogStack.value.length)

  onBeforeUnmount(() => {
    closeAllDialogs()
  })

  return {
    dialogStack: readonly(localDialogStack),
    showDialog,
    closeDialog: (id: string) => localCloseDialog(id, 'manual'),
    closeTopDialog,
    closeAllDialogs,
    getDialog,
    count
  }
}

/**
 * 获取全局弹窗状态（只读）
 */
export function getGlobalDialogState() {
  return {
    dialogStack: readonly(globalDialogStack),
    count: computed(() => globalDialogStack.value.length)
  }
}
