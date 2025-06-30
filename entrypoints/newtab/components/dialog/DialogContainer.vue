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
            v-if="isVueComponent"
            :is="dialogData.options.component"
            v-bind="dialogData.options.props"
            @close="handleComponentClose"
          />
          
          <!-- 使用 render 函数渲染 -->
          <div v-else-if="isRenderFunction" ref="renderContainer">
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
import { CSS_CLASSES, FOCUS_SELECTORS } from './constants'
import { 
  buildCSSClasses, 
  buildAnimationClasses, 
  calculateAnimationDuration, 
  executeAnimation,
  getComponentType,
  safeExecuteCallback
} from './helpers'

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
  
  const { width, height, style } = props.dialogData.options
  
  if (width) {
    styles.width = typeof width === 'number' ? `${width}px` : width
  }
  
  if (height) {
    styles.height = typeof height === 'number' ? `${height}px` : height
  }
  
  // 合并用户自定义样式
  if (style) {
    Object.assign(styles, style)
  }
  
  return styles
})

// 计算遮罩层类名
const overlayClasses = computed(() => {
  const { animationSpeed } = props.dialogData.options
  
  return buildCSSClasses(CSS_CLASSES.BASE.overlay, [
    ...buildAnimationClasses(animationState.value, animationSpeed).map(className => ({
      condition: Boolean(className),
      className
    }))
  ])
})

// 计算内容容器类名
const contentClasses = computed(() => {
  const { className, animation, animationSpeed } = props.dialogData.options
  const animationType = animation || 'default'
  
  const conditionalClasses = [
    // 用户自定义类名
    {
      condition: Boolean(className),
      className: className || ''
    },
    // 动画相关类名
    ...buildAnimationClasses(animationState.value, animationSpeed, animationType).map(cls => ({
      condition: Boolean(cls),
      className: cls
    }))
  ]
  
  return buildCSSClasses(CSS_CLASSES.BASE.content, conditionalClasses)
})

// 组件类型判断
const componentType = computed(() => getComponentType(props.dialogData.options.component))
const isVueComponent = computed(() => componentType.value === 'vue-component')
const isRenderFunction = computed(() => componentType.value === 'render-function')

// 事件处理器工厂
const createEventHandler = (reason: CloseReason) => {
  return () => {
    const option = reason === 'mask' ? 'maskClosable' : 
                   reason === 'escape' ? 'escClosable' : 
                   'closable'
    
    if (props.dialogData.options[option] !== false) {
      emitCloseEvent(reason)
    }
  }
}

// 事件处理
const handleMaskClick = createEventHandler('mask')
const handleCloseClick = createEventHandler('button')
const handleComponentClose = () => emitCloseEvent('manual')

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    createEventHandler('escape')()
  }
}

// 渲染动态内容
const renderDynamicContent = async () => {
  await nextTick()
  
  const { component } = props.dialogData.options
  
  try {
    // 处理 render 函数
    if (isRenderFunction.value && renderContainer.value) {
      const result = (component as Function)()
      
      if (result && typeof result === 'object' && result.type) {
        vueRender(result, renderContainer.value)
      } else {
        renderContainer.value.innerHTML = String(result)
      }
    }
    // 处理 VNode
    else if (component && typeof component === 'object' && component.type && vnodeContainer.value) {
      vueRender(component as VNode, vnodeContainer.value)
    }
  } catch (error) {
    console.error('动态内容渲染失败:', error)
    const container = renderContainer.value || vnodeContainer.value
    if (container) {
      container.innerHTML = '<div>渲染失败</div>'
    }
  }
}

// 焦点陷阱管理
const initFocusTrap = () => {
  if (dialogContentRef.value) {
    focusTrap = new FocusTrap(dialogContentRef.value, {
      enabled: true,
      initialFocus: FOCUS_SELECTORS.INITIAL_FOCUS
    })
    focusTrap.activate()
  }
}

const cleanupFocusTrap = () => {
  if (focusTrap) {
    focusTrap.deactivate()
    focusTrap = null
  }
}

// 动画执行
const startEnterAnimation = async () => {
  const { animation, animationDuration, animationSpeed } = props.dialogData.options
  
  if (animation === 'none') {
    animationState.value = 'entered'
    return
  }
  
  const duration = calculateAnimationDuration(animationDuration, animationSpeed)
  
  await executeAnimation(
    dialogContentRef.value || null,
    duration,
    (state) => { animationState.value = state as DialogAnimationState },
    'entering',
    'entered'
  )
}

const startLeaveAnimation = async () => {
  const { animation, animationDuration, animationSpeed } = props.dialogData.options
  
  if (animation === 'none') {
    animationState.value = 'left'
    return
  }
  
  const duration = calculateAnimationDuration(animationDuration, animationSpeed)
  
  await executeAnimation(
    dialogContentRef.value || null,
    duration,
    (state) => { animationState.value = state as DialogAnimationState },
    'leaving',
    'left'
  )
}

// 修改关闭处理，加入动画
const emitCloseEvent = async (reason: CloseReason) => {
  // 执行关闭前回调
  const shouldClose = await safeExecuteCallback(
    props.dialogData.options.onBeforeClose, 
    true
  )
  
  if (shouldClose === false) {
    return
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
  await safeExecuteCallback(props.dialogData.options.onOpen, undefined)
})

onBeforeUnmount(() => {
  cleanupFocusTrap()
})
</script>

<style scoped>
/* DialogContainer 组件本身不包含样式，样式在外部的 style.css 文件中 */
</style> 