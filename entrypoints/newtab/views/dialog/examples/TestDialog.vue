<template>
  <div class="test-dialog-page">
    <h1>弹窗系统测试页面</h1>
    
    <div class="test-section">
      <h2>📋 测试说明</h2>
      <p>测试各种弹窗功能和场景，包括Vue组件渲染、Props传递、回调处理、多弹窗管理等。所有测试都会在控制台输出详细信息。</p>
      <div style="margin: 15px 0; padding: 12px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px;">
        <p style="margin: 0; color: #15803d; font-size: 14px;">
          <strong>✅ 已优化：</strong>现在使用真正的Vue单文件组件(.vue文件)，如Vue Router的用法：
          <code style="background: #dcfce7; padding: 2px 4px; border-radius: 3px; margin: 0 4px;">import Component from './Component.vue'</code>
          无需运行时模板编译！
        </p>
      </div>
    </div>
    
    <div class="test-section">
      <h2>基础功能测试</h2>
      <div class="button-group">
        <button @click="testVueComponent" class="test-btn">测试 Vue 组件</button>
        <button @click="testRenderFunction" class="test-btn">测试 Render 函数</button>
        <button @click="testVNode" class="test-btn">测试 VNode 对象</button>
      </div>
    </div>

    <div class="test-section">
      <h2>高级功能测试</h2>
      <div class="button-group">
        <button @click="testWithProps" class="test-btn">测试带Props</button>
        <button @click="testWithCallbacks" class="test-btn">测试回调函数</button>
        <button @click="testMultipleDialogs" class="test-btn">测试多弹窗</button>
        <button @click="testBeforeClose" class="test-btn">测试关闭拦截</button>
      </div>
    </div>

    <div class="test-section">
      <h2>样式测试</h2>
      <div class="button-group">
        <button @click="testCustomSize" class="test-btn">测试自定义尺寸</button>
        <button @click="testMobile" class="test-btn">测试移动端样式</button>
        <button @click="testLongContent" class="test-btn">测试长内容滚动</button>
      </div>
    </div>

    <div class="test-section">
      <h2>🎬 动画测试</h2>
      <div class="button-group">
        <button @click="testDefaultAnimation" class="test-btn">默认动画</button>
        <button @click="testFadeAnimation" class="test-btn">淡入淡出</button>
        <button @click="testZoomAnimation" class="test-btn">缩放动画</button>
        <button @click="testSlideAnimations" class="test-btn">滑动动画</button>
        <button @click="testBounceAnimation" class="test-btn">弹跳动画</button>
        <button @click="testAnimationSpeeds" class="test-btn">动画速度</button>
        <button @click="testNoAnimation" class="test-btn">禁用动画</button>
      </div>
    </div>



    <div class="status-section">
      <h3>弹窗状态</h3>
      <p>当前弹窗数量: {{ count }}</p>
      <p>弹窗列表:</p>
      <ul>
        <li v-for="dialog in dialogStack" :key="dialog.id">
          ID: {{ dialog.id.slice(-8) }} | Z-Index: {{ dialog.zIndex }}
          <button @click="closeDialog(dialog.id)" style="margin-left: 10px;">关闭</button>
        </li>
      </ul>
      <button v-if="count > 0" @click="closeAllDialogs" class="danger-btn">关闭所有</button>
    </div>

    <!-- 用于测试的组件定义 -->
    <div style="display: none;">
      <!-- 这些组件会被动态使用 -->
    </div>
  </div>
</template>

<script setup>
import { ref, h, defineComponent } from 'vue'
import { useDialog } from '../index'
// 导入真正的Vue单文件组件 - 这才是正确的用法！
import UserInfoComponent from './UserInfoComponent.vue'
import InteractiveComponent from './InteractiveComponent.vue'
defineOptions({
  name: 'TestDialog'
})

const { showDialog, closeDialog, closeAllDialogs, dialogStack, count } = useDialog()

// 1. 测试Vue组件 - 使用真正的.vue文件
const testVueComponent = async () => {
  console.log('🧪 测试Vue组件渲染...')
  console.log('📝 使用方式类似Vue Router: import UserInfoComponent from "./UserInfoComponent.vue"')
  
  const dialogId = await showDialog({
    // ✅ 正确的用法：传入编译时已处理的.vue组件
    component: UserInfoComponent,
    props: {
      title: 'Vue单文件组件测试',
      initialUserName: '张三',
      initialEmail: 'zhangsan@example.com',
      initialCount: 5
    },
    title: 'Vue组件弹窗',
    width: '520px',
    onOpen: () => console.log('✅ Vue组件弹窗已打开'),
    onClose: () => console.log('✅ Vue组件弹窗已关闭')
  })
  
  console.log('✅ Vue组件弹窗创建成功，ID:', dialogId)
  console.log('💡 这种方式不需要运行时模板编译，性能更好！')
}

// 2. 测试Render函数
const testRenderFunction = async () => {
  console.log('🧪 测试Render函数渲染...')
  
  const renderFunction = () => {
    return h('div', { style: 'padding: 30px; text-align: center;' }, [
      h('h3', { style: 'color: #3b82f6; margin-bottom: 20px;' }, 'Render函数测试'),
      h('p', '这个内容是通过 h() 函数创建的'),
      h('div', { style: 'margin: 20px 0;' }, [
        h('p', '可以创建复杂的嵌套结构：'),
        h('ul', { style: 'text-align: left; display: inline-block;' }, [
          h('li', '支持任意HTML结构'),
          h('li', '支持事件绑定'),
          h('li', '支持动态数据'),
          h('li', '支持样式绑定')
        ])
      ]),
      h('div', { style: 'margin-top: 20px;' }, [
        h('button', {
          style: 'padding: 8px 16px; margin-right: 10px; background: #3b82f6; color: white; border: none; border-radius: 4px;',
          onClick: () => alert('Render函数中的事件处理正常！')
        }, '测试事件'),
        h('button', {
          style: 'padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 4px;',
          onClick: () => {
            // 这里应该调用关闭弹窗的方法，但在render函数中比较复杂
            console.log('在render函数中关闭弹窗需要特殊处理')
          }
        }, '关闭测试')
      ])
    ])
  }
  
  const dialogId = await showDialog({
    component: renderFunction,
    title: 'Render函数弹窗',
    width: '480px',
    onOpen: () => console.log('✅ Render函数弹窗已打开'),
    onClose: () => console.log('✅ Render函数弹窗已关闭')
  })
  
  console.log('✅ Render函数弹窗创建成功，ID:', dialogId)
}

// 3. 测试VNode对象
const testVNode = async () => {
  console.log('🧪 测试VNode对象渲染...')
  
  // 直接创建VNode对象
  const vnodeContent = h('div', { 
    style: 'padding: 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px;' 
  }, [
    h('h3', { style: 'margin-bottom: 15px; text-align: center;' }, 'VNode对象测试'),
    h('p', { style: 'margin-bottom: 20px;' }, '这是直接传入的VNode对象'),
    h('div', { style: 'background: rgba(255,255,255,0.1); padding: 15px; border-radius: 4px; margin-bottom: 15px;' }, [
      h('h4', { style: 'margin-bottom: 10px;' }, 'VNode特点:'),
      h('ul', { style: 'margin: 0; padding-left: 20px;' }, [
        h('li', '直接传入已创建的VNode'),
        h('li', '不需要额外的函数包装'),
        h('li', '适合简单的静态内容'),
        h('li', '性能较高，渲染直接')
      ])
    ]),
    h('div', { style: 'text-align: center;' }, [
      h('span', { style: 'background: rgba(255,255,255,0.2); padding: 5px 10px; border-radius: 15px; font-size: 12px;' }, '🎉 VNode渲染成功！')
    ])
  ])
  
  const dialogId = await showDialog({
    component: vnodeContent,
    title: 'VNode对象弹窗',
    width: '450px',
    onOpen: () => console.log('✅ VNode对象弹窗已打开'),
    onClose: () => console.log('✅ VNode对象弹窗已关闭')
  })
  
  console.log('✅ VNode对象弹窗创建成功，ID:', dialogId)
}

// 4. 测试带Props的复杂交互
const testWithProps = async () => {
  console.log('🧪 测试Props传递...')
  console.log('📝 使用真正的Vue单文件组件进行复杂交互测试')
  
  await showDialog({
    // ✅ 使用预编译的Vue单文件组件
    component: InteractiveComponent,
    props: {
      initialMessage: '这是通过Props传递的初始消息！',
      theme: 'light',
      userId: 'user_123',
      config: {
        maxMessages: 20,
        autoReply: true,
        allowDelete: true
      }
    },
    title: 'Props & 交互测试',
    width: '600px',
    height: '500px',
    onOpen: () => console.log('✅ 交互组件弹窗已打开'),
    onClose: () => console.log('✅ 交互组件弹窗已关闭')
  })
  
  console.log('💡 这个组件展示了完整的Props传递、事件处理、生命周期等功能')
}

// 5. 测试回调函数
const testWithCallbacks = async () => {
  console.log('🧪 测试回调函数...')
  
  // ✅ 使用render函数替代template字符串
  const callbackTestComponent = () => h('div', { style: 'padding: 30px; text-align: center;' }, [
    h('h3', { style: 'color: #3b82f6; margin-bottom: 20px;' }, '回调函数测试'),
    h('p', { style: 'margin-bottom: 20px;' }, '查看控制台输出以验证回调执行'),
    h('div', { 
      style: 'margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e5e7eb;' 
    }, [
      h('p', [h('strong', '预期回调顺序：')]),
      h('ol', { style: 'text-align: left; display: inline-block; margin: 10px 0;' }, [
        h('li', { style: 'margin: 5px 0;' }, 'onOpen - 弹窗打开时'),
        h('li', { style: 'margin: 5px 0;' }, 'onBeforeClose - 关闭前确认'),
        h('li', { style: 'margin: 5px 0;' }, 'onClose - 关闭后清理')
      ])
    ]),
    h('p', { style: 'color: #6b7280;' }, '尝试用不同方式关闭弹窗来测试完整流程'),
    h('div', { style: 'margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 6px;' }, [
      h('p', { style: 'margin: 0; font-size: 14px; color: #92400e;' }, '💡 使用render函数创建，无需运行时模板编译')
    ])
  ])
  
  await showDialog({
    component: callbackTestComponent,
    title: '回调测试弹窗',
    width: '480px',
    onOpen: () => {
      console.log('📅 [onOpen] 弹窗已打开 - 可以在这里初始化数据')
    },
    onBeforeClose: () => {
      const shouldClose = confirm('确定要关闭弹窗吗？这是onBeforeClose回调')
      console.log('⚠️ [onBeforeClose] 关闭确认结果:', shouldClose)
      return shouldClose
    },
    onClose: () => {
      console.log('✅ [onClose] 弹窗已关闭 - 可以在这里进行清理工作')
      alert('回调测试完成！查看控制台输出')
    }
  })
}

// 6. 测试多弹窗
const testMultipleDialogs = async () => {
  console.log('🧪 测试多弹窗管理...')
  
  // 连续创建3个弹窗
  for (let i = 1; i <= 3; i++) {
    // ✅ 使用render函数创建多层弹窗
    const multiDialogComponent = () => h('div', { style: 'padding: 25px; text-align: center;' }, [
      h('div', { style: `background: linear-gradient(135deg, hsl(${i * 60}, 70%, 60%), hsl(${i * 60}, 70%, 40%)); color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;` }, [
        h('h3', { style: 'margin: 0;' }, `弹窗 ${i}`)
      ]),
      h('p', { style: 'margin: 10px 0;' }, `这是第${i}个弹窗`),
      h('p', { style: 'margin: 10px 0; color: #6b7280;' }, '尝试按ESC键，应该只关闭最顶层的弹窗'),
      h('div', { style: 'background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0;' }, [
        h('p', { style: 'margin: 0; font-weight: bold;' }, `当前弹窗数量: ${count.value}`),
        h('p', { style: 'margin: 5px 0 0 0; font-size: 12px; color: #6b7280;' }, `Z-Index: ${1000 + i - 1}`)
      ]),
      h('div', { style: 'margin-top: 20px;' }, [
        h('p', { style: 'margin: 0; font-size: 14px; color: #059669;' }, '✅ 多弹窗层级管理正常')
      ])
    ])
    
    await showDialog({
      component: multiDialogComponent,
      title: `多弹窗测试 - 弹窗${i}`,
      width: 300 + i * 50 + 'px'  // 不同大小便于区分
    })
  }
  
  console.log('✅ 多弹窗创建完成，测试ESC键关闭顺序')
}

// 7. 测试关闭拦截
const testBeforeClose = async () => {
  console.log('🧪 测试关闭拦截功能...')
  
  // ✅ 使用render函数创建关闭拦截测试
  const closeInterceptComponent = () => h('div', { style: 'padding: 25px;' }, [
    h('h3', { style: 'color: #ef4444; margin-bottom: 20px;' }, '关闭拦截测试'),
    h('p', { style: 'margin-bottom: 15px;' }, '这个弹窗有关闭拦截功能，尝试用不同方式关闭：'),
    h('ul', { style: 'text-align: left; margin: 15px 0; padding-left: 20px;' }, [
      h('li', { style: 'margin: 8px 0;' }, '点击右上角 × 按钮'),
      h('li', { style: 'margin: 8px 0;' }, '点击遮罩层'),
      h('li', { style: 'margin: 8px 0;' }, '按ESC键'),
      h('li', { style: 'margin: 8px 0;' }, '点击底部关闭按钮')
    ]),
    h('div', { style: 'margin: 20px 0; padding: 15px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;' }, [
      h('p', { style: 'margin: 0; color: #dc2626; font-weight: 500;' }, '⚠️ 每次关闭都会弹出确认对话框')
    ]),
    h('div', { style: 'margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 6px;' }, [
      h('p', { style: 'margin: 0; font-size: 14px; color: #92400e;' }, '💡 支持异步关闭验证，500ms延迟后弹出确认框')
    ])
  ])
  
  await showDialog({
    component: closeInterceptComponent,
    title: '关闭拦截测试',
    width: '480px',
    onBeforeClose: async () => {
      // 可以返回 Promise 进行异步验证
      return new Promise((resolve) => {
        setTimeout(() => {
          const shouldClose = confirm('模拟异步验证：确定要关闭吗？')
          console.log('🔒 关闭拦截验证结果:', shouldClose)
          resolve(shouldClose)
        }, 500)
      })
    }
  })
}

// 8. 测试自定义尺寸
const testCustomSize = async () => {
  console.log('🧪 测试自定义尺寸...')
  
  // ✅ 使用render函数创建自定义尺寸测试
  const customSizeComponent = () => h('div', { style: 'padding: 20px;' }, [
    h('h3', { style: 'color: #8b5cf6; margin-bottom: 15px;' }, '自定义尺寸测试'),
    h('p', { style: 'margin-bottom: 15px;' }, '这个弹窗设置了固定的600px宽度和400px高度'),
    h('div', { 
      style: 'height: 200px; background: #f3f4f6; padding: 20px; margin: 20px 0; overflow-y: auto; border: 1px solid #e5e7eb; border-radius: 8px;' 
    }, [
      h('p', { style: 'margin-bottom: 10px; font-weight: bold; color: #6366f1;' }, '内容区域高度固定为200px，超出部分可滚动：'),
      ...Array.from({ length: 20 }, (_, i) => 
        h('p', { 
          key: i, 
          style: 'margin: 8px 0; padding: 8px; background: white; border-radius: 4px; border-left: 3px solid #8b5cf6;' 
        }, `第${i + 1}行内容 - 这是一个测试滚动功能的长内容行，用于验证固定高度容器的滚动行为`)
      )
    ]),
    h('div', { style: 'margin-top: 15px; padding: 12px; background: #f0f9ff; border-radius: 6px; border: 1px solid #c7d2fe;' }, [
      h('p', { style: 'margin: 0; font-size: 14px; color: #4338ca;' }, '✅ 弹窗尺寸：600px × 400px，内容区域独立滚动')
    ])
  ])
  
  await showDialog({
    component: customSizeComponent,
    title: '自定义尺寸',
    width: '600px',
    height: '400px'
  })
}

// 9. 测试长内容
const testLongContent = async () => {
  console.log('🧪 测试长内容滚动...')
  
  // ✅ 使用render函数创建长内容测试
  const longContentComponent = () => h('div', { style: 'padding: 20px;' }, [
    h('h3', { style: 'color: #f59e0b; margin-bottom: 15px;' }, '长内容滚动测试'),
    h('p', { style: 'margin-bottom: 20px; color: #6b7280;' }, '这个弹窗包含50个段落，用于测试长内容的滚动功能'),
    ...Array.from({ length: 50 }, (_, i) => 
      h('div', { 
        key: i,
        style: 'margin-bottom: 15px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e5e7eb;'
      }, [
        h('h4', { 
          style: 'margin: 0 0 8px 0; color: #f59e0b; font-size: 16px;' 
        }, `段落 ${i + 1}`),
        h('p', { 
          style: 'margin: 0; line-height: 1.6; color: #374151;' 
        }, `这是第${i + 1}个段落的内容。用来测试弹窗内部的滚动功能。当内容超出弹窗高度时，应该在弹窗内容区域显示滚动条，而不是整个页面滚动。这段文字比较长，是为了让每个段落都有足够的内容来测试滚动效果。Lorem ipsum dolor sit amet, consectetur adipiscing elit.`)
      ])
    ),
    h('div', { 
      style: 'margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 6px; text-align: center;' 
    }, [
      h('p', { style: 'margin: 0; font-size: 14px; color: #92400e;' }, '🎯 测试完成！弹窗内容滚动正常，页面滚动被锁定')
    ])
  ])
  
  await showDialog({
    component: longContentComponent,
    title: '长内容测试',
    width: '550px'
  })
}

// 10. 模拟移动端测试
const testMobile = async () => {
  console.log('🧪 测试移动端样式...')
  
  // ✅ 使用render函数创建移动端测试
  const mobileTestComponent = () => h('div', { style: 'padding: 20px;' }, [
    h('h3', { style: 'color: #10b981; margin-bottom: 20px;' }, '移动端样式测试'),
    h('p', { style: 'margin-bottom: 15px;' }, '在移动端（屏幕宽度 < 640px），弹窗应该：'),
    h('ul', { style: 'margin: 15px 0; padding-left: 20px;' }, [
      h('li', { style: 'margin: 8px 0; color: #374151;' }, '占满屏幕宽度'),
      h('li', { style: 'margin: 8px 0; color: #374151;' }, '从底部滑出'),
      h('li', { style: 'margin: 8px 0; color: #374151;' }, '按钮变为全宽'),
      h('li', { style: 'margin: 8px 0; color: #374151;' }, '内容区域自适应')
    ]),
    h('div', { style: 'margin: 20px 0; padding: 15px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px;' }, [
      h('p', { style: 'margin: 0 0 10px 0; font-weight: bold; color: #047857;' }, '📱 测试方法：'),
      h('p', { style: 'margin: 0; font-size: 14px; color: #065f46;' }, '1. 调整浏览器窗口大小到640px以下')
    ]),
    h('div', { style: 'margin: 20px 0; padding: 15px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;' }, [
      h('p', { style: 'margin: 0 0 10px 0; font-weight: bold; color: #1e40af;' }, '🔧 或者：'),
      h('p', { style: 'margin: 0; font-size: 14px; color: #1e3a8a;' }, '2. 按F12打开开发者工具 → 点击设备模拟按钮')
    ]),
    h('div', { style: 'margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 6px; text-align: center;' }, [
      h('p', { style: 'margin: 0; font-size: 14px; color: #92400e;' }, '当前窗口宽度: ' + window.innerWidth + 'px')
    ])
  ])
  
  await showDialog({
    component: mobileTestComponent,
    title: '移动端测试'
  })
}

// ========== 动画测试函数 ==========

// 1. 测试默认动画
const testDefaultAnimation = async () => {
  console.log('🎬 测试默认动画...')
  
  const animationTestComponent = () => h('div', { style: 'padding: 30px; text-align: center;' }, [
    h('h3', { style: 'color: #3b82f6; margin-bottom: 20px;' }, '默认动画测试'),
    h('p', { style: 'margin-bottom: 20px;' }, '这是默认的入场和离场动画效果'),
    h('div', { style: 'background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;' }, [
      h('h4', { style: 'margin-bottom: 10px; color: #1e40af;' }, '默认动画特点:'),
      h('ul', { style: 'text-align: left; margin: 0; padding-left: 20px;' }, [
        h('li', { style: 'margin: 5px 0;' }, '轻微向上移动 + 缩放效果'),
        h('li', { style: 'margin: 5px 0;' }, '300ms 动画持续时间'),
        h('li', { style: 'margin: 5px 0;' }, '平滑的缓动函数'),
        h('li', { style: 'margin: 5px 0;' }, '适中的视觉效果')
      ])
    ]),
    h('p', { style: 'color: #6b7280; font-size: 14px;' }, '关闭弹窗查看离场动画效果')
  ])
  
  await showDialog({
    component: animationTestComponent,
    title: '默认动画',
    animation: 'default',
    animationSpeed: 'normal'
  })
}

// 2. 测试淡入淡出动画
const testFadeAnimation = async () => {
  console.log('🎬 测试淡入淡出动画...')
  
  const fadeTestComponent = () => h('div', { style: 'padding: 30px; text-align: center;' }, [
    h('h3', { style: 'color: #10b981; margin-bottom: 20px;' }, '淡入淡出动画'),
    h('p', { style: 'margin-bottom: 20px;' }, '纯透明度变化，无位移和缩放效果'),
    h('div', { style: 'background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #86efac;' }, [
      h('p', { style: 'margin: 0; color: #047857;' }, '✨ 简洁优雅的视觉效果，适合内容展示类弹窗')
    ])
  ])
  
  await showDialog({
    component: fadeTestComponent,
    title: '淡入淡出动画',
    animation: 'fade',
    animationSpeed: 'normal'
  })
}

// 3. 测试缩放动画
const testZoomAnimation = async () => {
  console.log('🎬 测试缩放动画...')
  
  const zoomTestComponent = () => h('div', { style: 'padding: 30px; text-align: center;' }, [
    h('h3', { style: 'color: #8b5cf6; margin-bottom: 20px;' }, '缩放动画测试'),
    h('p', { style: 'margin-bottom: 20px;' }, '从小到大的缩放效果，有强烈的视觉冲击'),
    h('div', { style: 'background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;' }, [
      h('p', { style: 'margin: 0 0 10px 0; font-weight: bold; color: #7c3aed;' }, '缩放动画特点:'),
      h('ul', { style: 'text-align: left; margin: 0; padding-left: 20px;' }, [
        h('li', { style: 'margin: 5px 0;' }, '入场: 从 0.8 倍缩放到 1.0 倍'),
        h('li', { style: 'margin: 5px 0;' }, '离场: 从 1.0 倍缩放到 1.1 倍'),
        h('li', { style: 'margin: 5px 0;' }, '适合重要通知和警告弹窗')
      ])
    ])
  ])
  
  await showDialog({
    component: zoomTestComponent,
    title: '缩放动画',
    animation: 'zoom',
    animationSpeed: 'normal'
  })
}

// 4. 测试滑动动画
const testSlideAnimations = async () => {
  console.log('🎬 测试滑动动画...')
  
  const directions = [
    { type: 'slide-up', name: '向上滑动', color: '#ef4444' },
    { type: 'slide-down', name: '向下滑动', color: '#f59e0b' },
    { type: 'slide-left', name: '向左滑动', color: '#10b981' },
    { type: 'slide-right', name: '向右滑动', color: '#3b82f6' }
  ]
  
  for (const direction of directions) {
    const slideTestComponent = () => h('div', { style: 'padding: 30px; text-align: center;' }, [
      h('h3', { style: `color: ${direction.color}; margin-bottom: 20px;` }, direction.name),
      h('p', { style: 'margin-bottom: 20px;' }, `弹窗从${direction.name}方向滑入和滑出`),
      h('div', { style: `background: ${direction.color}20; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid ${direction.color}40;` }, [
        h('p', { style: `margin: 0; color: ${direction.color}; font-weight: bold;` }, `🎯 ${direction.name}效果展示`)
      ]),
      h('p', { style: 'color: #6b7280; font-size: 14px;' }, '关闭查看离场效果，然后会自动显示下一个方向')
    ])
    
         await showDialog({
       component: slideTestComponent,
       title: `滑动动画 - ${direction.name}`,
       animation: direction.type,
       animationSpeed: 'normal'
     })
  }
  
  console.log('✅ 滑动动画测试完成')
}

// 5. 测试弹跳动画
const testBounceAnimation = async () => {
  console.log('🎬 测试弹跳动画...')
  
  const bounceTestComponent = () => h('div', { style: 'padding: 30px; text-align: center;' }, [
    h('h3', { style: 'color: #f59e0b; margin-bottom: 20px;' }, '弹跳动画测试'),
    h('p', { style: 'margin-bottom: 20px;' }, '有趣的弹跳效果，增加互动感'),
    h('div', { style: 'background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #fbbf24;' }, [
      h('p', { style: 'margin: 0 0 10px 0; font-weight: bold; color: #d97706;' }, '🎈 弹跳效果特点:'),
      h('ul', { style: 'text-align: left; margin: 0; padding-left: 20px;' }, [
        h('li', { style: 'margin: 5px 0;' }, '使用弹性缓动函数'),
        h('li', { style: 'margin: 5px 0;' }, '入场时有轻微回弹效果'),
        h('li', { style: 'margin: 5px 0;' }, '适合游戏和娱乐类应用'),
        h('li', { style: 'margin: 5px 0;' }, '增加用户愉悦感')
      ])
    ])
  ])
  
  await showDialog({
    component: bounceTestComponent,
    title: '弹跳动画',
    animation: 'bounce',
    animationSpeed: 'normal'
  })
}

// 6. 测试动画速度
const testAnimationSpeeds = async () => {
  console.log('🎬 测试动画速度...')
  
  const speeds = [
    { type: 'fast', name: '快速 (150ms)', color: '#ef4444' },
    { type: 'normal', name: '正常 (300ms)', color: '#3b82f6' },
    { type: 'slow', name: '慢速 (500ms)', color: '#10b981' }
  ]
  
  for (const speed of speeds) {
    const speedTestComponent = () => h('div', { style: 'padding: 30px; text-align: center;' }, [
      h('h3', { style: `color: ${speed.color}; margin-bottom: 20px;` }, `动画速度 - ${speed.name}`),
      h('p', { style: 'margin-bottom: 20px;' }, '体验不同速度的动画效果'),
      h('div', { style: `background: ${speed.color}20; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid ${speed.color}40;` }, [
        h('p', { style: `margin: 0; color: ${speed.color}; font-weight: bold;` }, `⚡ ${speed.name} 动画速度`)
      ]),
      h('p', { style: 'color: #6b7280; font-size: 14px;' }, '注意关闭时的动画速度差异')
    ])
    
         await showDialog({
       component: speedTestComponent,
       title: `动画速度 - ${speed.name}`,
       animation: 'default',
       animationSpeed: speed.type
     })
  }
  
  console.log('✅ 动画速度测试完成')
}

// 7. 测试禁用动画
const testNoAnimation = async () => {
  console.log('🎬 测试禁用动画...')
  
  const noAnimationComponent = () => h('div', { style: 'padding: 30px; text-align: center;' }, [
    h('h3', { style: 'color: #6b7280; margin-bottom: 20px;' }, '禁用动画模式'),
    h('p', { style: 'margin-bottom: 20px;' }, '弹窗立即显示和关闭，无任何动画效果'),
    h('div', { style: 'background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #d1d5db;' }, [
      h('p', { style: 'margin: 0 0 10px 0; font-weight: bold; color: #4b5563;' }, '⚡ 无动画模式特点:'),
      h('ul', { style: 'text-align: left; margin: 0; padding-left: 20px;' }, [
        h('li', { style: 'margin: 5px 0;' }, '瞬间显示和关闭'),
        h('li', { style: 'margin: 5px 0;' }, '节省性能资源'),
        h('li', { style: 'margin: 5px 0;' }, '适合低配设备'),
        h('li', { style: 'margin: 5px 0;' }, '遵循无障碍原则')
      ])
    ]),
    h('div', { style: 'background: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0;' }, [
      h('p', { style: 'margin: 0; font-size: 14px; color: #92400e;' }, '💡 当用户设置了"减少运动"偏好时，会自动使用此模式')
    ])
  ])
  
  await showDialog({
    component: noAnimationComponent,
    title: '无动画模式',
    animation: 'none'
  })
}


</script>

<style scoped>
.test-dialog-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fafafa;
}

.test-section h2 {
  margin-top: 0;
  color: #1f2937;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.test-btn {
  padding: 10px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.test-btn:hover {
  background: #2563eb;
}

.danger-btn {
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.status-section {
  background: #f3f4f6;
  padding: 15px;
  border-radius: 6px;
  margin-top: 20px;
}

.status-section ul {
  margin: 10px 0;
  padding-left: 20px;
}

.status-section li {
  margin-bottom: 5px;
}
</style> 