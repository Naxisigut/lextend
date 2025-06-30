<template>
  <Teleport to="body">
    <div
      v-if="dialogData.isVisible"
      ref="overlayRef"
      :class="overlayClasses"
      :style="{ zIndex: dialogData.zIndex }"
      @click="handleMaskClick"
      @keydown="handleKeyDown"
    >
      <!-- 弹窗主体 -->
      <div
        ref="dialogContentRef"
        :class="contentClasses"
        :style="contentStyles"
        @click.stop
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="dialogData.options.title ? `dialog-title-${dialogData.id}` : undefined"
        tabindex="-1"
      >
        <!-- 头部区域 -->
        <div v-if="dialogData.options.title || dialogData.options.closable !== false" class="dialog-header">
          <!-- 标题 -->
          <h2 
            v-if="dialogData.options.title" 
            :id="`dialog-title-${dialogData.id}`"
            class="dialog-title"
          >
            {{ dialogData.options.title }}
          </h2>
          
          <!-- 关闭按钮 -->
          <button
            v-if="dialogData.options.closable !== false"
            class="dialog-close-btn"
            type="button"
            aria-label="关闭弹窗"
            @click="handleCloseClick"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- 内容区域 - 动态组件渲染 -->
        <div class="dialog-body">
          <!-- 使用 component 标签渲染动态组件 -->
          <component 
            v-if="isVueComponent(dialogData.options.component)"
            :is="dialogData.options.component"
            v-bind="dialogData.options.props"
            @close="handleComponentClose"
          />
          
          <!-- 使用 render 函数渲染 -->
          <div v-else-if="isRenderFunction(dialogData.options.component)" ref="renderContainer">
            <!-- render 函数的内容会通过 JavaScript 动态插入 -->
          </div>
          
          <!-- VNode 渲染 -->
          <div v-else ref="vnodeContainer">
            <!-- VNode 内容会通过 JavaScript 动态插入 -->
          </div>
        </div>

        <!-- 底部区域 -->
        <div class="dialog-footer">
          <button
            class="dialog-btn dialog-btn-default"
            type="button"
            @click="handleCloseClick"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { 
  ref, 
  computed, 
  onMounted, 
  onBeforeUnmount, 
  nextTick,
  render as vueRender,
  h,
  type VNode
} from 'vue'
import type { DialogContainerProps, DialogCloseEvent, CloseReason, DialogAnimationState } from './types'
import { FocusTrap, isClickOutside } from './utils'

// Props
const props = defineProps<DialogContainerProps>()

// Emits
const emit = defineEmits<{
  close: [event: DialogCloseEvent]
}>()

// Refs
const overlayRef = ref<HTMLElement>()
const dialogContentRef = ref<HTMLElement>()
const renderContainer = ref<HTMLElement>()
const vnodeContainer = ref<HTMLElement>()

// 动画状态
const animationState = ref<DialogAnimationState>('entering')

// 焦点陷阱实例
let focusTrap: FocusTrap | null = null

// 计算样式
const contentStyles = computed(() => {
  const styles: Record<string, any> = {}
  
  if (props.dialogData.options.width) {
    styles.width = typeof props.dialogData.options.width === 'number' 
      ? `${props.dialogData.options.width}px` 
      : props.dialogData.options.width
  }
  
  if (props.dialogData.options.height) {
    styles.height = typeof props.dialogData.options.height === 'number' 
      ? `${props.dialogData.options.height}px` 
      : props.dialogData.options.height
  }
  
  // 合并用户自定义样式
  if (props.dialogData.options.style) {
    Object.assign(styles, props.dialogData.options.style)
  }
  
  return styles
})

// 计算遮罩层类名
const overlayClasses = computed(() => {
  const classes = ['dialog-overlay']
  
  // 添加动画状态类
  if (animationState.value === 'entering') {
    classes.push('dialog--entering')
  } else if (animationState.value === 'leaving') {
    classes.push('dialog--leaving')
  }
  
  // 添加动画速度类
  const speed = props.dialogData.options.animationSpeed
  if (speed === 'fast') {
    classes.push('dialog--fast')
  } else if (speed === 'slow') {
    classes.push('dialog--slow')
  }
  
  return classes
})

// 计算内容容器类名
const contentClasses = computed(() => {
  const classes = ['dialog-content']
  
  // 添加用户自定义类名
  if (props.dialogData.options.className) {
    classes.push(props.dialogData.options.className)
  }
  
  // 添加动画状态类
  if (animationState.value === 'entering') {
    classes.push('dialog--entering')
  } else if (animationState.value === 'leaving') {
    classes.push('dialog--leaving')
  }
  
  // 添加动画类型类
  const animation = props.dialogData.options.animation || 'default'
  if (animation !== 'none' && animation !== 'default') {
    classes.push(`dialog--${animation}`)
  }
  
  // 添加动画速度类
  const speed = props.dialogData.options.animationSpeed
  if (speed === 'fast') {
    classes.push('dialog--fast')
  } else if (speed === 'slow') {
    classes.push('dialog--slow')
  }
  
  // 添加弹跳效果类
  if (animation === 'bounce') {
    classes.push('dialog--bounce')
  }
  
  return classes
})

// 类型检查工具函数
const isVueComponent = (component: any): boolean => {
  return typeof component === 'object' && (component.setup || component.render || component.template)
}

const isRenderFunction = (component: any): boolean => {
  return typeof component === 'function'
}

// 事件处理
const handleMaskClick = (event: MouseEvent) => {
  if (props.dialogData.options.maskClosable !== false) {
    emitCloseEvent('mask')
  }
}

const handleCloseClick = () => {
  emitCloseEvent('button')
}

const handleComponentClose = () => {
  emitCloseEvent('manual')
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.dialogData.options.escClosable !== false) {
    emitCloseEvent('escape')
  }
}

// 渲染动态内容
const renderDynamicContent = async () => {
  await nextTick()
  
  const { component } = props.dialogData.options
  
  // 处理 render 函数
  if (isRenderFunction(component) && renderContainer.value) {
    try {
      const result = (component as Function)()
      
      if (result && typeof result === 'object' && result.type) {
        // 这是一个 VNode
        vueRender(result, renderContainer.value)
      } else {
        // 这是普通的返回值
        renderContainer.value.innerHTML = String(result)
      }
    } catch (error) {
      console.error('渲染函数执行失败:', error)
      renderContainer.value.innerHTML = '<div>渲染失败</div>'
    }
  }
  
  // 处理 VNode
  else if (component && typeof component === 'object' && component.type && vnodeContainer.value) {
    try {
      vueRender(component as VNode, vnodeContainer.value)
    } catch (error) {
      console.error('VNode 渲染失败:', error)
      vnodeContainer.value.innerHTML = '<div>渲染失败</div>'
    }
  }
}

// 初始化焦点陷阱
const initFocusTrap = () => {
  if (dialogContentRef.value) {
    focusTrap = new FocusTrap(dialogContentRef.value, {
      enabled: true,
      initialFocus: '.dialog-close-btn, .dialog-btn, input, textarea, select, button, [tabindex]'
    })
    focusTrap.activate()
  }
}

// 清理焦点陷阱
const cleanupFocusTrap = () => {
  if (focusTrap) {
    focusTrap.deactivate()
    focusTrap = null
  }
}

// 动画相关函数
const startEnterAnimation = async () => {
  const animation = props.dialogData.options.animation || 'default'
  
  if (animation === 'none') {
    // 无动画，直接设置为已进入状态
    animationState.value = 'entered'
    return
  }
  
  // 设置初始状态
  animationState.value = 'entering'
  
  // 等待动画完成
  await new Promise<void>((resolve) => {
    const duration = props.dialogData.options.animationDuration || 
                    (props.dialogData.options.animationSpeed === 'fast' ? 80 : 
                     props.dialogData.options.animationSpeed === 'slow' ? 250 : 150)
    
    setTimeout(() => {
      animationState.value = 'entered'
      resolve()
    }, duration)
  })
}

const startLeaveAnimation = async () => {
  const animation = props.dialogData.options.animation || 'default'
  
  if (animation === 'none') {
    // 无动画，直接设置为已离开状态
    animationState.value = 'left'
    return
  }
  
  // 设置离开状态
  animationState.value = 'leaving'
  
  // 等待动画完成
  await new Promise<void>((resolve) => {
    const duration = props.dialogData.options.animationDuration || 
                    (props.dialogData.options.animationSpeed === 'fast' ? 80 : 
                     props.dialogData.options.animationSpeed === 'slow' ? 250 : 150)
    
    setTimeout(() => {
      animationState.value = 'left'
      resolve()
    }, duration)
  })
}

// 修改关闭处理，加入动画
const emitCloseEvent = async (reason: CloseReason) => {
  // 如果有 onBeforeClose 回调，先执行
  if (props.dialogData.options.onBeforeClose) {
    const shouldClose = props.dialogData.options.onBeforeClose()
    
    if (shouldClose === false) {
      return
    }
    
    if (shouldClose instanceof Promise) {
      const result = await shouldClose.catch(() => true)
      if (result === false) {
        return
      }
    }
  }
  
  // 执行离场动画
  await startLeaveAnimation()
  
  // 动画完成后执行关闭
  props.dialogData.close()
}

// 生命周期
onMounted(async () => {
  // 渲染动态内容
  await renderDynamicContent()
  
  // 开始入场动画
  await startEnterAnimation()
  
  // 初始化焦点陷阱
  await nextTick()
  initFocusTrap()
  
  // 执行打开回调
  props.dialogData.options.onOpen?.()
})

onBeforeUnmount(() => {
  // 清理焦点陷阱
  cleanupFocusTrap()
})
</script>

<style scoped>
/* DialogContainer 组件本身不包含样式，样式在外部的 style.css 文件中 */
</style> 