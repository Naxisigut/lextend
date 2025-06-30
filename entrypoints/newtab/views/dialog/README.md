# Vue3 Hook 弹窗功能设计方案

## 概述

基于 Vue3 Composition API 实现一个灵活的弹窗系统，支持动态组件渲染、入场离场动画、多弹窗管理等功能。

## 核心特性

- ✅ 使用 HTML5 原生 `<dialog>` 标签或纯 CSS 实现
- ✅ 动态组件渲染支持
- ✅ 完整的入场离场动画
- ✅ 多弹窗栈管理
- ✅ 模态框关闭（遮罩、ESC键、关闭按钮）
- ✅ 高阶组件和 render 函数支持

## 架构设计

### 1. Hook 结构

```javascript
const useDialog = () => {
  const dialogStack = ref([])
  
  const showDialog = (options) => {
    // 创建弹窗实例，加入栈中
    // 返回弹窗ID用于手动控制
  }
  
  const closeDialog = (id) => {
    // 关闭指定弹窗（带动画）
  }
  
  const closeTopDialog = () => {
    // 关闭栈顶弹窗
  }
  
  return {
    showDialog,
    closeDialog,
    closeTopDialog,
    dialogStack: readonly(dialogStack)
  }
}
```

### 2. 弹窗数据结构

```javascript
{
  id: 'unique-id',           // 唯一标识
  component: YourComponent,  // 动态组件
  props: {},                 // 传递给动态组件的属性
  title: '弹窗标题',         // 可选标题
  zIndex: 1000,             // 层级管理
  isVisible: true,          // 显示状态
  // 其他配置参数...
}
```

### 3. 组件结构

```
useDialog (Hook)
├── DialogContainer (弹窗容器组件)
│   ├── <dialog> 原生标签
│   │   ├── 头部区域
│   │   │   ├── 标题 (可选)
│   │   │   └── 关闭按钮 (×)
│   │   ├── 内容区域
│   │   │   └── <component :is="dynamicComponent">
│   │   └── 底部区域
│   │       └── 关闭按钮
│   └── Teleport to body
```

## 技术实现要点

### 1. 弹窗基础实现

**方案一：HTML5 Dialog**
```vue
<dialog ref="dialogRef" @close="handleClose">
  <!-- 弹窗内容 -->
</dialog>
```

**方案二：CSS Modal**
```vue
<div class="modal-overlay" @click="handleMaskClick">
  <div class="modal-content">
    <!-- 弹窗内容 -->
  </div>
</div>
```

### 2. 动画处理

**Vue Transition 集成：**
```vue
<Transition
  name="dialog"
  @before-enter="onBeforeEnter"
  @after-leave="onAfterLeave"
>
  <DialogContainer v-if="isVisible" />
</Transition>
```

**CSS 动画定义：**
```css
.dialog-enter-active {
  animation: dialog-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialog-leave-active {
  animation: dialog-out 0.2s ease-in;
}

@keyframes dialog-in {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes dialog-out {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
}
```

### 3. 多弹窗管理

**栈管理策略：**
- 使用数组存储弹窗栈，LIFO (后进先出) 原则
- 每个新弹窗 z-index 递增 (1000 + index)
- ESC 键只关闭栈顶弹窗
- 遮罩点击事件需要判断层级

**渲染方案：**
```vue
<template v-for="dialogItem in dialogStack" :key="dialogItem.id">
  <Transition
    name="dialog"
    @after-leave="() => removeFromStack(dialogItem.id)"
  >
    <DialogContainer 
      v-if="dialogItem.isVisible"
      :dialog-data="dialogItem"
      :style="{ zIndex: dialogItem.zIndex }"
    />
  </Transition>
</template>
```

### 4. 事件处理

**键盘事件：**
```javascript
// 全局 ESC 键监听
const handleEscKey = (e) => {
  if (e.key === 'Escape' && dialogStack.value.length > 0) {
    closeTopDialog()
  }
}
```

**焦点管理：**
```javascript
// 弹窗打开时锁定焦点
const trapFocus = (dialogElement) => {
  // 实现焦点陷阱逻辑
}

// 弹窗关闭时恢复焦点
const restoreFocus = (previousActiveElement) => {
  previousActiveElement?.focus()
}
```

## API 使用示例

### 基本用法

```javascript
// 在组件中使用
const { showDialog } = useDialog()

const openMyDialog = () => {
  showDialog({
    component: MyCustomComponent,
    props: {
      userId: 123,
      onSave: handleSave
    },
    title: '编辑用户信息'
  })
}
```

### 高级用法

```javascript
// 使用 render 函数
import { h } from 'vue'

showDialog({
  component: h('div', [
    h('h2', '动态渲染的内容'),
    h('p', '这是通过 h() 函数创建的组件')
  ])
})

// 支持 JSX
showDialog({
  component: () => (
    <div>
      <h2>JSX 组件</h2>
      <p>支持 JSX 语法</p>
    </div>
  )
})
```

## 扩展功能

### 可配置选项

```javascript
showDialog({
  component: MyComponent,
  props: {},
  
  // 外观配置
  title: '标题',
  width: '500px',
  height: 'auto',
  
  // 行为配置
  closable: true,           // 是否可关闭
  maskClosable: true,       // 点击遮罩关闭
  escClosable: true,        // ESC键关闭
  
  // 动画配置
  animationDuration: 300,   // 动画时长
  animationEasing: 'ease-out',
  
  // 回调函数
  onOpen: () => {},         // 打开后回调
  onClose: () => {},        // 关闭后回调
  onBeforeClose: () => {}   // 关闭前回调（可阻止关闭）
})
```

## 注意事项

1. **性能优化**
   - 弹窗关闭后及时清理，避免内存泄漏
   - 动画期间防抖处理，避免重复操作
   - 考虑设置最大弹窗数量限制

2. **无障碍支持**
   - 正确设置 ARIA 属性
   - 实现焦点陷阱和焦点恢复
   - 支持键盘导航

3. **移动端适配**
   - 考虑移动设备的弹窗显示方式
   - 触摸事件处理
   - 屏幕尺寸适配

4. **兼容性**
   - HTML5 dialog 标签的浏览器支持
   - CSS 动画的降级方案
   - Vue 版本兼容性

## 文件结构

```
dialog/
├── README.md              # 文档说明
├── useDialog.ts          # 核心 Hook
├── DialogContainer.vue   # 弹窗容器组件
├── types.ts              # TypeScript 类型定义
└── examples/             # 使用示例
    ├── BasicExample.vue
    └── AdvancedExample.vue
```
