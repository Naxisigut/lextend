import type { FocusTrapOptions } from './types'

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return `dialog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 获取所有可聚焦的元素
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ]
  
  const elements = container.querySelectorAll(focusableSelectors.join(','))
  return Array.from(elements) as HTMLElement[]
}

/**
 * 焦点陷阱管理器
 */
export class FocusTrap {
  private container: HTMLElement
  private options: Required<FocusTrapOptions>
  private focusableElements: HTMLElement[] = []
  private previouslyFocusedElement: HTMLElement | null = null
  private isActive = false

  constructor(container: HTMLElement, options: FocusTrapOptions = {}) {
    this.container = container
    this.options = {
      enabled: true,
      initialFocus: '',
      returnFocus: '',
      focusableSelectors: [
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]'
      ],
      ...options
    }
  }

  /**
   * 激活焦点陷阱
   */
  activate(): void {
    if (!this.options.enabled || this.isActive) return

    // 保存当前焦点元素
    this.previouslyFocusedElement = document.activeElement as HTMLElement

    // 获取可聚焦元素
    this.updateFocusableElements()

    // 设置初始焦点
    this.setInitialFocus()

    // 添加事件监听器
    this.container.addEventListener('keydown', this.handleKeyDown)
    
    this.isActive = true
  }

  /**
   * 停用焦点陷阱
   */
  deactivate(): void {
    if (!this.isActive) return

    // 移除事件监听器
    this.container.removeEventListener('keydown', this.handleKeyDown)

    // 恢复之前的焦点
    this.restoreFocus()

    this.isActive = false
  }

  /**
   * 更新可聚焦元素列表
   */
  private updateFocusableElements(): void {
    this.focusableElements = getFocusableElements(this.container)
  }

  /**
   * 设置初始焦点
   */
  private setInitialFocus(): void {
    let elementToFocus: HTMLElement | null = null

    // 优先使用指定的初始焦点选择器
    if (this.options.initialFocus) {
      elementToFocus = this.container.querySelector(this.options.initialFocus)
    }

    // 否则使用第一个可聚焦元素
    if (!elementToFocus && this.focusableElements.length > 0) {
      elementToFocus = this.focusableElements[0]
    }

    // 最后使用容器本身
    if (!elementToFocus) {
      elementToFocus = this.container
    }

    elementToFocus?.focus()
  }

  /**
   * 恢复焦点
   */
  private restoreFocus(): void {
    let elementToFocus: HTMLElement | null = null

    // 优先使用指定的返回焦点选择器
    if (this.options.returnFocus) {
      elementToFocus = document.querySelector(this.options.returnFocus)
    }

    // 否则恢复到之前聚焦的元素
    if (!elementToFocus && this.previouslyFocusedElement) {
      elementToFocus = this.previouslyFocusedElement
    }

    elementToFocus?.focus()
  }

  /**
   * 处理 Tab 键导航
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== 'Tab') return

    this.updateFocusableElements()

    if (this.focusableElements.length === 0) {
      event.preventDefault()
      return
    }

    const currentIndex = this.focusableElements.indexOf(document.activeElement as HTMLElement)
    let nextIndex: number

    if (event.shiftKey) {
      // Shift + Tab: 向前导航
      nextIndex = currentIndex <= 0 ? this.focusableElements.length - 1 : currentIndex - 1
    } else {
      // Tab: 向后导航
      nextIndex = currentIndex >= this.focusableElements.length - 1 ? 0 : currentIndex + 1
    }

    event.preventDefault()
    this.focusableElements[nextIndex]?.focus()
  }
}

/**
 * 防止页面滚动
 */
export function preventBodyScroll(): () => void {
  const originalStyle = {
    overflow: document.body.style.overflow,
    paddingRight: document.body.style.paddingRight
  }

  // 计算滚动条宽度
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

  // 设置样式防止滚动
  document.body.style.overflow = 'hidden'
  if (scrollbarWidth > 0) {
    document.body.style.paddingRight = `${scrollbarWidth}px`
  }

  // 返回恢复函数
  return () => {
    document.body.style.overflow = originalStyle.overflow
    document.body.style.paddingRight = originalStyle.paddingRight
  }
}

/**
 * 检查点击是否在元素外部
 */
export function isClickOutside(event: MouseEvent, element: HTMLElement): boolean {
  return !element.contains(event.target as Node)
}





/**
 * 延迟执行函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func(...args)
      timeout = null
    }, wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, wait)
    }
  }
}

/**
 * 获取数值的 CSS 值（自动添加 px 单位）
 */
export function toCssValue(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * 创建 DOM 元素
 */
export function createElement(tag: string, attributes: Record<string, any> = {}): HTMLElement {
  const element = document.createElement(tag)
  
  Object.keys(attributes).forEach(key => {
    if (key === 'className') {
      element.className = attributes[key]
    } else if (key === 'style' && typeof attributes[key] === 'object') {
      Object.assign(element.style, attributes[key])
    } else {
      element.setAttribute(key, attributes[key])
    }
  })
  
  return element
}

/**
 * 合并默认选项
 */
export function mergeOptions<T extends Record<string, any>>(
  defaults: T,
  options: Partial<T>
): T {
  return { ...defaults, ...options }
}

/**
 * 检查是否支持 HTML5 Dialog
 */
export function supportsDialog(): boolean {
  return typeof HTMLDialogElement !== 'undefined'
}

/**
 * 获取元素的层级（z-index）
 */
export function getElementZIndex(element: HTMLElement): number {
  const zIndex = window.getComputedStyle(element).zIndex
  return zIndex === 'auto' ? 0 : parseInt(zIndex, 10)
}

/**
 * 查找最高的 z-index 值
 */
export function getHighestZIndex(): number {
  let highest = 0
  const elements = document.querySelectorAll('*')
  
  elements.forEach(element => {
    const zIndex = getElementZIndex(element as HTMLElement)
    if (zIndex > highest) {
      highest = zIndex
    }
  })
  
  return highest
}
