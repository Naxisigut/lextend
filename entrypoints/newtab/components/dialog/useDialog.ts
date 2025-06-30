import { ref, readonly, computed, onBeforeUnmount, nextTick, createApp, App } from 'vue'
import type { 
  DialogOptions, 
  DialogInstance, 
  UseDialogReturn, 
  DialogDefaultOptions,
  CloseReason 
} from './types'
import { 
  preventBodyScroll,
  debounce 
} from './utils'
import { 
  DIALOG_DEFAULTS, 
  ERROR_MESSAGES,
  FOCUS_SELECTORS 
} from './constants'
import {
  createDialogInstance,
  validateDialogOptions,
  checkMaxDialogCount,
  getTopDialog,
  findDialogInStack,
  safeExecuteCallback
} from './helpers'
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
  maxCount: DIALOG_DEFAULTS.MAX_COUNT,
  baseZIndex: DIALOG_DEFAULTS.BASE_Z_INDEX
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
 * 弹窗管理器类 - 封装弹窗管理逻辑
 */
class DialogManager {
  constructor(
    private dialogStack: typeof globalDialogStack,
    private scrollRestoreFuncs: (() => void)[]
  ) {}

  /**
   * ESC 键处理函数
   */
  private handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.dialogStack.value.length > 0) {
      const topDialog = getTopDialog(this.dialogStack.value)
      if (topDialog && topDialog.options.escClosable !== false) {
        this.closeDialog(topDialog.id, 'escape')
      }
    }
  }

  /**
   * 全局事件监听器管理
   */
  private isGlobalListenerAdded = false

  private addGlobalListeners() {
    if (!this.isGlobalListenerAdded) {
      document.addEventListener('keydown', this.handleEscapeKey)
      this.isGlobalListenerAdded = true
    }
  }

  private removeGlobalListeners() {
    if (this.isGlobalListenerAdded && this.dialogStack.value.length === 0) {
      document.removeEventListener('keydown', this.handleEscapeKey)
      this.isGlobalListenerAdded = false
    }
  }

  /**
   * 渲染弹窗到 DOM
   */
  private renderDialog(dialogInstance: DialogInstance) {
    const container = document.createElement('div')
    container.setAttribute('data-dialog-id', dialogInstance.id)
    
    const app = createApp(DialogContainer, {
      dialogData: dialogInstance
    })
    
    app.provide('onDialogClose', (event: any) => {
      if (!event.defaultPrevented) {
        this.closeDialog(dialogInstance.id, event.reason)
      }
    })
    
    app.mount(container)
    
    dialogRenderers.set(dialogInstance.id, { app, container })
  }

  /**
   * 安全销毁弹窗渲染器
   */
  private destroyDialog(dialogId: string) {
    const renderer = dialogRenderers.get(dialogId)
    if (!renderer) return

    try {
      renderer.app.unmount()
    } catch (error) {
      console.warn(`${ERROR_MESSAGES.UNMOUNT_FAILED} (${dialogId}):`, error)
    }
    
    try {
      if (renderer.container.parentNode) {
        renderer.container.parentNode.removeChild(renderer.container)
      }
    } catch (error) {
      console.warn(`${ERROR_MESSAGES.DOM_CLEANUP_FAILED} (${dialogId}):`, error)
    }
    
    dialogRenderers.delete(dialogId)
  }

  /**
   * 显示弹窗
   */
  async showDialog(options: DialogOptions): Promise<string> {
    // 验证参数
    validateDialogOptions(options)
    checkMaxDialogCount(this.dialogStack.value.length, DEFAULT_OPTIONS.maxCount)

    // 创建弹窗实例
    const dialogInstance = createDialogInstance(options, this.dialogStack.value.length)
    dialogInstance.close = () => this.closeDialog(dialogInstance.id)

    // 添加到栈中
    this.dialogStack.value.push(dialogInstance)

    // 管理资源
    this.addGlobalListeners()
    
    if (this.dialogStack.value.length === 1) {
      const restoreScroll = preventBodyScroll()
      this.scrollRestoreFuncs.push(restoreScroll)
    }

    try {
      this.renderDialog(dialogInstance)
      return dialogInstance.id
    } catch (renderError) {
      // 渲染失败时清理资源
      this.cleanupFailedDialog(dialogInstance.id)
      throw new Error(`${ERROR_MESSAGES.RENDER_FAILED}: ${renderError}`)
    }
  }

  /**
   * 清理失败的弹窗
   */
  private cleanupFailedDialog(id: string) {
    const result = findDialogInStack(this.dialogStack.value, id)
    if (result) {
      this.dialogStack.value.splice(result.index, 1)
    }
    
    if (this.dialogStack.value.length === 0 && this.scrollRestoreFuncs.length > 0) {
      const restoreScroll = this.scrollRestoreFuncs.pop()
      restoreScroll?.()
    }
    
    this.removeGlobalListeners()
  }

  /**
   * 关闭指定弹窗
   */
  async closeDialog(id: string, reason: CloseReason = 'manual'): Promise<void> {
    const result = findDialogInStack(this.dialogStack.value, id)
    if (!result) return

    const { dialog } = result
    
    // 执行关闭前回调
    if (dialog.options.onBeforeClose) {
      const shouldClose = await safeExecuteCallback(dialog.options.onBeforeClose, true)
      if (shouldClose === false) return
    }

    await this.performCloseDialog(id, reason)
  }

  /**
   * 执行弹窗关闭逻辑
   */
  private async performCloseDialog(id: string, reason: CloseReason): Promise<void> {
    const result = findDialogInStack(this.dialogStack.value, id)
    if (!result) return

    const { dialog, index } = result
    
    // 标记为不可见
    dialog.isVisible = false

    // 从栈中移除
    this.dialogStack.value.splice(index, 1)

    // 恢复滚动
    if (this.dialogStack.value.length === 0 && this.scrollRestoreFuncs.length > 0) {
      const restoreScroll = this.scrollRestoreFuncs.pop()
      restoreScroll?.()
    }

    // 移除全局监听器
    this.removeGlobalListeners()

    // 销毁弹窗渲染器
    this.destroyDialog(id)

    // 执行关闭回调
    await nextTick()
    await safeExecuteCallback(dialog.options.onClose, undefined)
  }

  /**
   * 关闭栈顶弹窗
   */
  closeTopDialog(): void {
    const topDialog = getTopDialog(this.dialogStack.value)
    if (topDialog) {
      this.closeDialog(topDialog.id, 'manual')
    }
  }

  /**
   * 关闭所有弹窗
   */
  closeAllDialogs(): void {
    const dialogIds = this.dialogStack.value.map(dialog => dialog.id).reverse()
    dialogIds.forEach(id => this.closeDialog(id, 'manual'))
  }

  /**
   * 获取指定弹窗实例
   */
  getDialog(id: string): DialogInstance | undefined {
    const result = findDialogInStack(this.dialogStack.value, id)
    return result?.dialog
  }

  /**
   * 清理所有资源
   */
  cleanup() {
    for (const [id] of dialogRenderers) {
      this.destroyDialog(id)
    }
    this.removeGlobalListeners()
  }
}

// 创建全局弹窗管理器实例
const globalDialogManager = new DialogManager(globalDialogStack, scrollRestoreFunctions)

// 页面卸载时清理所有资源
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => globalDialogManager.cleanup())
}

// 防抖显示弹窗函数（保留兼容性）
const debouncedShowDialog = debounce((options: DialogOptions, resolve: (id: string) => void) => {
  globalDialogManager.showDialog(options)
    .then(resolve)
    .catch(error => console.error(ERROR_MESSAGES.CREATE_FAILED, error))
}, DIALOG_DEFAULTS.DEBOUNCE_DELAY)

/**
 * useDialog Hook 主函数
 */
export function useDialog(): UseDialogReturn {
  const count = computed(() => globalDialogStack.value.length)

  onBeforeUnmount(() => {
    // 注意：这里不能直接关闭所有弹窗，因为可能有其他组件实例在使用
    // 全局状态的清理应该由最后一个弹窗关闭时处理
  })

  return {
    dialogStack: readonly(globalDialogStack),
    showDialog: (options: DialogOptions) => globalDialogManager.showDialog(options),
    closeDialog: (id: string) => globalDialogManager.closeDialog(id, 'manual'),
    closeTopDialog: () => globalDialogManager.closeTopDialog(),
    closeAllDialogs: () => globalDialogManager.closeAllDialogs(),
    getDialog: (id: string) => globalDialogManager.getDialog(id),
    count
  }
}

/**
 * 创建独立的弹窗实例（不共享全局状态）
 */
export function useDialogLocal(): UseDialogReturn {
  const localDialogStack = ref<DialogInstance[]>([])
  const localScrollRestoreFunctions: (() => void)[] = []
  
  const localDialogManager = new DialogManager(localDialogStack, localScrollRestoreFunctions)

  const count = computed(() => localDialogStack.value.length)

  onBeforeUnmount(() => {
    localDialogManager.closeAllDialogs()
  })

  return {
    dialogStack: readonly(localDialogStack),
    showDialog: (options: DialogOptions) => localDialogManager.showDialog(options),
    closeDialog: (id: string) => localDialogManager.closeDialog(id, 'manual'),
    closeTopDialog: () => localDialogManager.closeTopDialog(),
    closeAllDialogs: () => localDialogManager.closeAllDialogs(),
    getDialog: (id: string) => localDialogManager.getDialog(id),
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
