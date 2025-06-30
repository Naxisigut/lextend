/**
 * 弹窗系统常量配置
 */

// 动画相关常量
export const ANIMATION_CONSTANTS = {
  /** 动画时长映射 */
  DURATIONS: {
    fast: 80,
    normal: 150,
    slow: 250
  },
  /** 动画缓冲时间 */
  BUFFER_TIME: 50,
  /** 默认缓动函数 */
  DEFAULT_EASING: 'ease-out'
} as const

// 弹窗系统默认配置
export const DIALOG_DEFAULTS = {
  /** 默认最大弹窗数量 */
  MAX_COUNT: 10,
  /** 默认基础z-index */
  BASE_Z_INDEX: 1000,
  /** 防抖延迟 */
  DEBOUNCE_DELAY: 50,
  /** 默认尺寸 */
  SIZE: {
    width: 'auto',
    height: 'auto'
  }
} as const

// CSS类名常量
export const CSS_CLASSES = {
  /** 基础类名 */
  BASE: {
    overlay: 'dialog-overlay',
    content: 'dialog-content',
    header: 'dialog-header',
    body: 'dialog-body',
    footer: 'dialog-footer'
  },
  /** 状态类名 */  
  STATES: {
    entering: 'dialog--entering',
    leaving: 'dialog--leaving'
  },
  /** 速度类名 */
  SPEEDS: {
    fast: 'dialog--fast',
    slow: 'dialog--slow'
  },
  /** 动画类名前缀 */
  ANIMATION_PREFIX: 'dialog--'
} as const

// 错误消息常量
export const ERROR_MESSAGES = {
  COMPONENT_REQUIRED: '缺少必需参数: component',
  MAX_COUNT_EXCEEDED: '超出最大弹窗数量限制',
  RENDER_FAILED: '弹窗渲染失败',
  CREATE_FAILED: '创建弹窗失败',
  UNMOUNT_FAILED: '卸载弹窗应用失败',
  DOM_CLEANUP_FAILED: '清理弹窗DOM失败'
} as const

// 焦点选择器常量
export const FOCUS_SELECTORS = {
  /** 可聚焦元素选择器 */
  FOCUSABLE: [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ],
  /** 初始焦点选择器 */
  INITIAL_FOCUS: '.dialog-close-btn, .dialog-btn, input, textarea, select, button, [tabindex]'
} as const 