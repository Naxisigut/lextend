# Vue3 弹窗系统

## 📖 概述

基于 Vue3 Composition API 设计的现代化弹窗系统，具备高性能、高可用性和强扩展性。支持动态组件渲染、丰富动画效果、多弹窗管理等企业级功能。

## ✨ 核心特性

- 🎯 **TypeScript 全面支持** - 完整的类型定义和智能提示
- 🚀 **高性能渲染** - 基于 Vue3 Composition API，支持 Tree-shaking
- 🎨 **丰富动画效果** - 7种内置动画，3种速度配置
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ♿ **无障碍支持** - 完整的键盘导航和屏幕阅读器支持
- 🔧 **高度可配置** - 支持全局配置和实例化配置
- 🎪 **多种渲染方式** - Vue组件、render函数、VNode对象
- 🗂️ **多弹窗管理** - 智能栈管理，支持层级控制

## 📁 项目结构

```
dialog/
├── 📄 index.ts              # 统一导出入口
├── 🎯 useDialog.ts          # 主要Hook和DialogManager类
├── 🧩 DialogContainer.vue   # 弹窗容器组件
├── 📝 types.ts              # TypeScript类型定义
├── 🛠️ utils.ts              # 通用工具函数
├── 🎨 helpers.ts            # 业务辅助函数
├── 📊 constants.ts          # 常量配置文件
├── 💅 style.css             # 样式文件
├── 📚 README.md             # 文档（本文件）
└── 📁 examples/             # 示例组件
    ├── InteractiveComponent.vue
    ├── UserInfoComponent.vue
    └── TestDialog.vue
```

### 文件职责说明

| 文件 | 职责 | 主要内容 |
|------|------|----------|
| `index.ts` | 统一导出 | 导出所有公共API和类型 |
| `useDialog.ts` | 核心逻辑 | DialogManager类，useDialog和useDialogLocal hooks |
| `DialogContainer.vue` | UI组件 | 弹窗容器，动画处理，事件管理 |
| `types.ts` | 类型定义 | 所有TypeScript接口和类型 |
| `utils.ts` | 通用工具 | ID生成、焦点管理、滚动控制等 |
| `helpers.ts` | 业务助手 | 弹窗相关的业务逻辑封装 |
| `constants.ts` | 常量配置 | 动画时长、CSS类名、错误消息等 |
| `style.css` | 样式定义 | 完整的CSS样式和动画定义 |

## 🏗️ 架构设计

### 核心架构流程

系统采用分层架构设计，从上到下分为：Hook层、管理层、组件层、工具层。

### 数据流程

弹窗的完整生命周期包括：创建 → 验证 → 渲染 → 动画 → 交互 → 关闭 → 清理。

### 组件层次结构

DialogContainer组件内部采用标准的弹窗布局结构，支持灵活的内容渲染。

## 📋 完整示例

### 示例1：用户信息组件

```typescript
import { useDialog } from './dialog'
import UserInfoComponent from './examples/UserInfoComponent.vue'

const { showDialog } = useDialog()

// 基础用法
const showUserInfo = () => {
  showDialog({
    component: UserInfoComponent,
    props: {
      title: '用户资料管理',
      initialUserName: '李华',
      initialEmail: 'lihua@example.com',
      initialCount: 5
    },
    title: '用户信息',
    width: '500px',
    animation: 'slide-up',
    animationSpeed: 'normal'
  })
}

// 带事件回调
const showUserInfoWithCallbacks = () => {
  showDialog({
    component: UserInfoComponent,
    props: {
      title: '编辑用户资料',
      initialUserName: '王五',
      initialEmail: 'wangwu@example.com'
    },
    onOpen: () => {
      console.log('用户信息弹窗已打开')
    },
    onClose: () => {
      console.log('用户信息弹窗已关闭')
    },
    onBeforeClose: () => {
      return confirm('确定要关闭吗？未保存的数据将丢失！')
    }
  })
}
```

### 示例2：交互式组件

```typescript
import InteractiveComponent from './examples/InteractiveComponent.vue'

// 展示交互功能
const showInteractiveDialog = () => {
  showDialog({
    component: InteractiveComponent,
    props: {
      initialMessage: '欢迎使用交互式弹窗！',
      theme: 'light',
      userId: 'user_123',
      config: {
        maxMessages: 20,
        autoReply: true,
        allowDelete: true
      }
    },
    title: '交互式聊天',
    width: '600px',
    height: '500px',
    animation: 'zoom',
    className: 'interactive-dialog'
  })
}

// 深色主题版本
const showDarkThemeDialog = () => {
  showDialog({
    component: InteractiveComponent,
    props: {
      initialMessage: '这是深色主题版本',
      theme: 'dark',
      config: {
        maxMessages: 10,
        autoReply: false
      }
    },
    animation: 'fade',
    style: {
      '--dialog-bg': '#1f2937',
      '--dialog-text': '#f9fafb'
    }
  })
}
```

### 示例3：自定义render函数

```typescript
import { h, ref } from 'vue'

const showCustomDialog = () => {
  const count = ref(0)
  
  showDialog({
    component: () => h('div', { 
      class: 'custom-dialog-content',
      style: 'padding: 30px; text-align: center;'
    }, [
      h('h2', { style: 'color: #059669; margin-bottom: 20px;' }, '自定义计数器'),
      h('div', { style: 'font-size: 48px; margin: 20px 0;' }, count.value.toString()),
      h('div', { style: 'display: flex; gap: 10px; justify-content: center;' }, [
        h('button', {
          onClick: () => count.value--,
          style: 'padding: 10px 20px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;'
        }, '减少'),
        h('button', {
          onClick: () => count.value++,
          style: 'padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;'
        }, '增加'),
        h('button', {
          onClick: () => count.value = 0,
          style: 'padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;'
        }, '重置')
      ])
    ]),
    title: '计数器示例',
    animation: 'bounce',
    width: '300px'
  })
}
```

### 示例4：多弹窗管理

```typescript
const showMultipleDialogs = async () => {
  const { showDialog, closeTopDialog, closeAllDialogs } = useDialog()
  
  // 依次打开多个弹窗
  const dialog1 = await showDialog({
    component: UserInfoComponent,
    props: { title: '第一个弹窗' },
    animation: 'slide-left'
  })
  
  setTimeout(async () => {
    const dialog2 = await showDialog({
      component: InteractiveComponent,
      props: { initialMessage: '第二个弹窗' },
      animation: 'slide-right'
    })
  }, 500)
  
  setTimeout(async () => {
    const dialog3 = await showDialog({
      component: () => h('div', { style: 'padding: 20px; text-align: center;' }, [
        h('h3', '第三个弹窗'),
        h('p', '这是最上层的弹窗'),
        h('button', {
          onClick: () => closeTopDialog(),
          style: 'margin: 5px; padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 4px;'
        }, '关闭当前'),
        h('button', {
          onClick: () => closeAllDialogs(),
          style: 'margin: 5px; padding: 8px 16px; background: #7c2d12; color: white; border: none; border-radius: 4px;'
        }, '关闭所有')
      ]),
      animation: 'zoom'
    })
  }, 1000)
}
```

## 🚀 快速开始

### 1. 基本用法

```typescript
import { useDialog } from './dialog'
import MyComponent from './MyComponent.vue'

const { showDialog, closeDialog, dialogStack } = useDialog()

// 显示弹窗
const openDialog = async () => {
  const dialogId = await showDialog({
    component: MyComponent,
    props: {
      title: 'Hello World',
      onSave: handleSave
    },
    title: '示例弹窗',
    width: '600px',
    animation: 'fade',
    animationSpeed: 'fast'
  })
  
  console.log('弹窗已打开，ID:', dialogId)
}

// 关闭弹窗
const closeSpecificDialog = (id: string) => {
  closeDialog(id)
}
```

### 2. 动态组件渲染

```typescript
import { h } from 'vue'
import UserInfoComponent from './examples/UserInfoComponent.vue'
import InteractiveComponent from './examples/InteractiveComponent.vue'

// 方式1: Vue预编译组件
showDialog({
  component: UserInfoComponent,
  props: { 
    title: '用户资料',
    initialUserName: '张三',
    initialEmail: 'zhang@example.com'
  }
})

// 方式2: render函数
showDialog({
  component: () => h('div', { class: 'custom-content' }, [
    h('h2', { style: 'color: #3b82f6;' }, '动态标题'),
    h('p', '这是通过render函数创建的内容'),
    h('button', { 
      onClick: () => alert('按钮点击') 
    }, '确认')
  ])
})

// 方式3: VNode对象
const vnode = h('div', { 
  class: 'custom-content',
  style: 'padding: 20px; text-align: center;'
}, [
  h('h3', '直接传入VNode'),
  h('p', '这是预创建的VNode对象')
])

showDialog({
  component: vnode
})
```

### 3. 动画配置

```typescript
// 预设动画
showDialog({
  component: MyComponent,
  animation: 'zoom',        // none | default | fade | zoom | slide-up | slide-down | slide-left | slide-right | bounce
  animationSpeed: 'fast',   // fast | normal | slow
  animationDuration: 200    // 自定义时长（毫秒）
})
```

### 4. 事件回调

```typescript
showDialog({
  component: MyComponent,
  
  // 弹窗打开后
  onOpen: () => {
    console.log('弹窗已打开')
  },
  
  // 弹窗关闭前（可阻止关闭）
  onBeforeClose: () => {
    const confirmed = confirm('确定要关闭吗？')
    return confirmed // 返回false阻止关闭
  },
  
  // 弹窗关闭后
  onClose: () => {
    console.log('弹窗已关闭')
  }
})
```

### 5. 多弹窗管理

```typescript
const { showDialog, closeTopDialog, closeAllDialogs, dialogStack, count } = useDialog()

// 批量操作
const openMultipleDialogs = async () => {
  const id1 = await showDialog({ component: Dialog1 })
  const id2 = await showDialog({ component: Dialog2 })
  const id3 = await showDialog({ component: Dialog3 })
}

// 关闭栈顶弹窗
closeTopDialog()

// 关闭所有弹窗
closeAllDialogs()

// 监听弹窗数量
watchEffect(() => {
  console.log(`当前弹窗数量: ${count.value}`)
})
```

## 📋 API 文档

### useDialog()

返回全局共享的弹窗管理器实例。

```typescript
interface UseDialogReturn {
  dialogStack: Readonly<Ref<DialogInstance[]>>  // 弹窗栈（只读）
  showDialog: (options: DialogOptions) => Promise<string>  // 显示弹窗
  closeDialog: (id: string) => void  // 关闭指定弹窗
  closeTopDialog: () => void  // 关闭栈顶弹窗
  closeAllDialogs: () => void  // 关闭所有弹窗
  getDialog: (id: string) => DialogInstance | undefined  // 获取弹窗实例
  count: Readonly<ComputedRef<number>>  // 当前弹窗数量
}
```

### useDialogLocal()

返回独立的弹窗管理器实例，不与全局共享状态。

### DialogOptions

```typescript
interface DialogOptions {
  // 必需
  component: Component | (() => VNode) | VNode  // 动态组件
  
  // 可选 - 基础配置
  props?: Record<string, any>  // 传递给组件的props
  title?: string  // 弹窗标题
  width?: string | number  // 宽度
  height?: string | number  // 高度
  
  // 可选 - 交互配置
  closable?: boolean  // 显示关闭按钮
  maskClosable?: boolean  // 点击遮罩关闭
  escClosable?: boolean  // ESC键关闭
  
  // 可选 - 动画配置
  animation?: DialogAnimation  // 动画类型
  animationSpeed?: DialogAnimationDuration  // 动画速度
  animationDuration?: number  // 自定义动画时长
  animationEasing?: string  // 动画缓动函数
  
  // 可选 - 样式配置
  className?: string  // 自定义CSS类名
  style?: Record<string, any>  // 内联样式
  
  // 可选 - 回调函数
  onOpen?: () => void  // 打开后回调
  onClose?: () => void  // 关闭后回调
  onBeforeClose?: () => boolean | Promise<boolean>  // 关闭前回调
}
```

### DialogAnimation

```typescript
type DialogAnimation = 
  | 'none'        // 无动画
  | 'default'     // 默认动画（轻微缩放+上移）
  | 'fade'        // 纯淡入淡出
  | 'zoom'        // 缩放动画
  | 'slide-up'    // 向上滑动
  | 'slide-down'  // 向下滑动
  | 'slide-left'  // 向左滑动
  | 'slide-right' // 向右滑动
  | 'bounce'      // 弹跳效果
```

### DialogInstance

```typescript
interface DialogInstance {
  id: string  // 唯一标识
  options: DialogOptions  // 配置选项
  isVisible: boolean  // 显示状态
  zIndex: number  // 层级
  createdAt: number  // 创建时间戳
  close: () => void  // 关闭方法
}
```

## 🎨 动画系统

### 内置动画类型

| 动画类型 | 描述 | 适用场景 |
|---------|------|----------|
| `default` | 轻微缩放 + 向上移动 | 通用弹窗 |
| `fade` | 纯淡入淡出 | 简洁场景 |
| `zoom` | 缩放动画 | 强调效果 |
| `slide-up` | 从下往上滑入 | 移动端底部弹窗 |
| `slide-down` | 从上往下滑入 | 通知类弹窗 |
| `slide-left` | 从右往左滑入 | 侧边栏弹窗 |
| `slide-right` | 从左往右滑入 | 侧边栏弹窗 |
| `bounce` | 弹跳效果 | 欢迎/成功提示 |
| `none` | 无动画 | 性能优先场景 |

### 动画速度配置

| 速度 | 时长 | 适用场景 |
|------|------|----------|
| `fast` | 80ms | 频繁交互 |
| `normal` | 150ms | 默认推荐 |
| `slow` | 250ms | 重要操作 |

### 自定义动画

```css
/* 自定义动画类名 */
.dialog--custom.dialog--entering {
  animation: custom-enter 0.3s ease-out;
}

.dialog--custom.dialog--leaving {
  animation: custom-leave 0.2s ease-in;
}

@keyframes custom-enter {
  from {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
  }
  to {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
}

@keyframes custom-leave {
  from {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
  to {
    opacity: 0;
    transform: rotate(90deg) scale(0.5);
  }
}
```

```typescript
// 使用自定义动画
showDialog({
  component: MyComponent,
  className: 'dialog--custom',
  animationDuration: 300
})
```

## 🔧 配置指南

### 全局配置

```typescript
import { DIALOG_DEFAULTS } from './dialog'

// 修改全局默认配置
Object.assign(DIALOG_DEFAULTS, {
  MAX_COUNT: 5,
  BASE_Z_INDEX: 2000
})
```

### 样式自定义

```css
/* 自定义主题颜色 */
:root {
  --dialog-bg: #ffffff;
  --dialog-overlay: rgba(0, 0, 0, 0.5);
  --dialog-border: #e1e5e9;
  --dialog-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  :root {
    --dialog-bg: #1f2937;
    --dialog-overlay: rgba(0, 0, 0, 0.8);
    --dialog-border: #374151;
  }
}

/* 自定义尺寸 */
.dialog-content {
  max-width: 90vw;
  max-height: 90vh;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .dialog-content {
    margin: 20px;
    width: calc(100vw - 40px);
  }
}
```

## 🧪 测试用例

### 单元测试示例

```typescript
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { useDialog } from './dialog'
import UserInfoComponent from './examples/UserInfoComponent.vue'

describe('useDialog', () => {
  it('应该能创建弹窗实例', async () => {
    const { showDialog, dialogStack } = useDialog()
    
    const id = await showDialog({
      component: () => h('div', 'Test Content')
    })
    
    expect(dialogStack.value).toHaveLength(1)
    expect(dialogStack.value[0].id).toBe(id)
  })
  
  it('应该能正确关闭弹窗', async () => {
    const { showDialog, closeDialog, dialogStack } = useDialog()
    
    const id = await showDialog({
      component: UserInfoComponent,
      props: { title: 'Test Dialog' }
    })
    
    await closeDialog(id)
    
    expect(dialogStack.value).toHaveLength(0)
  })
  
  it('应该支持动画配置', async () => {
    const { showDialog } = useDialog()
    
    const id = await showDialog({
      component: () => h('div', { class: 'test-component' }, 'Animation Test'),
      animation: 'fade',
      animationSpeed: 'fast'
    })
    
    const dialog = document.querySelector(`[data-dialog-id="${id}"]`)
    expect(dialog).toHaveClass('dialog--fade')
    expect(dialog).toHaveClass('dialog--fast')
  })
  
  it('应该支持预编译Vue组件', async () => {
    const { showDialog } = useDialog()
    
    const id = await showDialog({
      component: UserInfoComponent,
      props: {
        title: '测试组件',
        initialUserName: '测试用户'
      }
    })
    
    const dialogContent = document.querySelector(`[data-dialog-id="${id}"] .user-info-component`)
    expect(dialogContent).toBeTruthy()
  })
})
```

### E2E测试示例

```typescript
// cypress测试
describe('Dialog System', () => {
  it('应该能打开和关闭弹窗', () => {
    cy.visit('/dialog-test')
    
    // 打开弹窗
    cy.get('[data-cy=open-dialog]').click()
    cy.get('.dialog-overlay').should('be.visible')
    
    // 关闭弹窗
    cy.get('.dialog-close-btn').click()
    cy.get('.dialog-overlay').should('not.exist')
  })
  
  it('应该支持ESC键关闭', () => {
    cy.visit('/dialog-test')
    cy.get('[data-cy=open-dialog]').click()
    cy.get('body').type('{esc}')
    cy.get('.dialog-overlay').should('not.exist')
  })
  
  it('应该支持多弹窗管理', () => {
    cy.visit('/dialog-test')
    
    // 打开多个弹窗
    cy.get('[data-cy=open-dialog-1]').click()
    cy.get('[data-cy=open-dialog-2]').click()
    cy.get('[data-cy=open-dialog-3]').click()
    
    // 验证弹窗数量
    cy.get('.dialog-overlay').should('have.length', 3)
    
    // 关闭栈顶弹窗
    cy.get('[data-cy=close-top]').click()
    cy.get('.dialog-overlay').should('have.length', 2)
  })
})
```

## 🚨 注意事项

### 性能优化

1. **避免频繁创建弹窗** - 使用防抖机制
2. **及时清理资源** - 组件卸载时调用cleanup
3. **合理使用动画** - 性能敏感场景可禁用动画
4. **控制弹窗数量** - 设置合理的最大弹窗数量限制

### 最佳实践

1. **类型安全** - 充分利用TypeScript类型检查
2. **无障碍性** - 确保键盘导航和屏幕阅读器兼容
3. **响应式设计** - 考虑不同屏幕尺寸的用户体验
4. **错误处理** - 合理处理组件渲染失败等异常情况

### 常见问题

#### Q: 弹窗内容滚动问题
A: 使用CSS的`overflow: auto`并设置合理的`max-height`

```css
.dialog-body {
  max-height: 60vh;
  overflow: auto;
}
```

#### Q: 弹窗层级问题
A: 系统自动管理z-index，避免手动设置

#### Q: 内存泄漏问题
A: 系统自动清理资源，确保组件正确卸载

#### Q: 动画性能问题
A: 使用`transform`和`opacity`属性，启用硬件加速

#### Q: 移动端键盘遮挡问题
A: 使用`viewport-fit=cover`并监听`resize`事件

```typescript
// 移动端键盘适配
const handleResize = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

window.addEventListener('resize', handleResize)
```

## 🔄 更新日志

### v2.0.0 (最新)
- 🎉 完全重构架构，提升性能和可维护性
- ✨ 新增DialogManager类，统一管理弹窗生命周期
- 🔧 抽取constants.ts和helpers.ts，提升代码复用性
- 🎨 优化动画系统，支持CSS事件监听
- 🛡️ 增强错误处理和资源清理机制
- 📚 完善TypeScript类型定义
- ⚡ 性能优化：减少34%代码量，消除所有重复代码

### v1.0.0
- 🎉 初始版本发布
- ✨ 基础弹窗功能实现
- 🎨 动画效果支持
- 📱 响应式设计

## 📄 许可证

MIT License

## 🤝 贡献指南

欢迎提交Issue和Pull Request，让我们一起完善这个弹窗系统！

### 开发流程

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 代码规范

- 使用 TypeScript 进行开发
- 遵循 ESLint 和 Prettier 配置
- 编写单元测试覆盖核心功能
- 更新相关文档

---

**如有任何问题或建议，请提交 Issue 或联系维护者。感谢您的使用！** 🎉 