import type { Component, VNode, Ref, ComputedRef } from 'vue'

/**
 * 动画类型
 */
export type DialogAnimation = 
  | 'none'        // 无动画
  | 'default'     // 默认动画（轻微缩放+上移）
  | 'fade'        // 纯淡入淡出
  | 'zoom'        // 缩放动画
  | 'slide-up'    // 向上滑动
  | 'slide-down'  // 向下滑动
  | 'slide-left'  // 向左滑动
  | 'slide-right' // 向右滑动
  | 'bounce'      // 弹跳效果

/**
 * 动画速度
 */
export type DialogAnimationDuration = 'fast' | 'normal' | 'slow'



/**
 * 弹窗配置选项
 */
export interface DialogOptions {
  /** 动态组件 - 支持 Vue 组件、render 函数、VNode */
  component: Component | (() => VNode) | VNode
  
  /** 传递给动态组件的 props */
  props?: Record<string, any>
  
  /** 弹窗标题 */
  title?: string
  
  /** 弹窗宽度 */
  width?: string | number
  
  /** 弹窗高度 */
  height?: string | number
  
  /** 是否显示关闭按钮 */
  closable?: boolean
  
  /** 点击遮罩是否关闭弹窗 */
  maskClosable?: boolean
  
  /** 按 ESC 键是否关闭弹窗 */
  escClosable?: boolean
  
  /** 动画类型 */
  animation?: DialogAnimation
  
  /** 动画速度 */
  animationSpeed?: DialogAnimationDuration
  
  /** 动画持续时间（毫秒）- 会覆盖 animationSpeed 设置 */
  animationDuration?: number
  
  /** 动画缓动函数 */
  animationEasing?: string
  

  
  /** 自定义 CSS 类名 */
  className?: string
  
  /** 自定义内联样式 */
  style?: Record<string, any>
  
  /** 弹窗打开后的回调 */
  onOpen?: () => void
  
  /** 弹窗关闭后的回调 */
  onClose?: () => void
  
  /** 弹窗关闭前的回调，返回 false 可阻止关闭 */
  onBeforeClose?: () => boolean | Promise<boolean>
}



/**
 * 弹窗实例数据
 */
export interface DialogInstance {
  /** 唯一标识 */
  id: string
  
  /** 弹窗配置选项 */
  options: DialogOptions
  
  /** 显示状态 */
  isVisible: boolean
  
  /** 层级 z-index */
  zIndex: number
  
  /** 创建时间戳 */
  createdAt: number
  
  /** 关闭弹窗的方法 */
  close: () => void
}

/**
 * useDialog Hook 返回的接口
 */
export interface UseDialogReturn {
  /** 弹窗栈（只读） */
  dialogStack: any
  
  /** 显示弹窗 */
  showDialog: (options: DialogOptions) => Promise<string>
  
  /** 关闭指定弹窗 */
  closeDialog: (id: string) => void
  
  /** 关闭栈顶弹窗 */
  closeTopDialog: () => void
  
  /** 关闭所有弹窗 */
  closeAllDialogs: () => void
  
  /** 获取指定弹窗实例 */
  getDialog: (id: string) => DialogInstance | undefined
  
  /** 当前弹窗数量 */
  count: any
}

/**
 * 关闭弹窗的触发方式
 */
export type CloseReason = 'button' | 'mask' | 'escape' | 'manual'

/**
 * 弹窗关闭事件参数
 */
export interface DialogCloseEvent {
  /** 弹窗ID */
  id: string
  
  /** 关闭原因 */
  reason: CloseReason
  
  /** 是否被阻止关闭 */
  defaultPrevented: boolean
  
  /** 阻止关闭 */
  preventDefault: () => void
}

/**
 * 焦点陷阱配置
 */
export interface FocusTrapOptions {
  /** 是否启用焦点陷阱 */
  enabled?: boolean
  
  /** 初始焦点元素选择器 */
  initialFocus?: string
  
  /** 返回焦点元素选择器 */
  returnFocus?: string
  
  /** 可聚焦元素选择器 */
  focusableSelectors?: string[]
}

/**
 * 弹窗动画状态
 */
export type DialogAnimationState = 'entering' | 'entered' | 'leaving' | 'left'



/**
 * 默认配置选项
 */
export interface DialogDefaultOptions {
  /** 默认宽度 */
  width?: string | number
  
  /** 默认高度 */
  height?: string | number
  
  /** 默认是否可关闭 */
  closable?: boolean
  
  /** 默认点击遮罩是否关闭 */
  maskClosable?: boolean
  
  /** 默认按 ESC 是否关闭 */
  escClosable?: boolean
  
  /** 默认动画时长 */
  animationDuration?: number
  
  /** 默认动画缓动 */
  animationEasing?: string
  
  /** 最大弹窗数量 */
  maxCount?: number
  
  /** 基础 z-index 值 */
  baseZIndex?: number
}

/**
 * 弹窗容器组件的 Props
 */
export interface DialogContainerProps {
  /** 弹窗实例数据 */
  dialogData: DialogInstance
}

/**
 * 弹窗容器组件的 Emits
 */
export interface DialogContainerEmits {
  /** 弹窗关闭事件 */
  close: [event: DialogCloseEvent]
  
  /** 动画开始事件 */
  animationStart: [state: DialogAnimationState]
  
  /** 动画结束事件 */
  animationEnd: [state: DialogAnimationState]
}
