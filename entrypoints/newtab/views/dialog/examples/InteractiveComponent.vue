<template>
  <div class="interactive-component">
    <div class="theme-header" :class="`theme-${theme}`">
      <h3>交互式组件测试</h3>
      <div class="theme-badge">主题: {{ theme }}</div>
    </div>
    
    <div class="message-section">
      <div class="input-group">
        <input 
          v-model="currentMessage" 
          @keyup.enter="addMessage"
          placeholder="输入消息 (按Enter发送)..." 
          class="message-input"
        />
        <button @click="addMessage" class="send-btn" :disabled="!currentMessage.trim()">
          发送
        </button>
      </div>
      
      <div class="initial-message" v-if="initialMessage">
        <strong>初始消息 (通过Props传递):</strong>
        <p>{{ initialMessage }}</p>
      </div>
    </div>
    
    <div class="messages-container" v-if="messages.length > 0">
      <h4>消息历史:</h4>
      <div class="messages-list">
        <div 
          v-for="msg in messages" 
          :key="msg.id" 
          class="message-item"
          :class="{ 'my-message': msg.type === 'user', 'system-message': msg.type === 'system' }"
        >
          <div class="message-time">{{ msg.time }}</div>
          <div class="message-text">{{ msg.text }}</div>
          <button @click="deleteMessage(msg.id)" class="delete-btn" v-if="msg.type === 'user'">×</button>
        </div>
      </div>
    </div>
    
    <div class="stats-section">
      <div class="stat-item">
        <span class="stat-label">消息总数:</span>
        <span class="stat-value">{{ messages.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">用户消息:</span>
        <span class="stat-value">{{ userMessageCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">组件激活时间:</span>
        <span class="stat-value">{{ activeTime }}秒</span>
      </div>
    </div>
    
    <div class="actions">
      <button @click="clearMessages" class="clear-btn" v-if="messages.length > 0">
        清空消息
      </button>
      <button @click="switchTheme" class="theme-btn">
        切换主题 ({{ theme === 'light' ? 'dark' : 'light' }})
      </button>
      <button @click="emitUpdate" class="update-btn">
        发送更新事件
      </button>
      <button @click="handleClose" class="close-btn">
        关闭弹窗
      </button>
    </div>
    
    <div class="props-validation">
      <h4>Props验证状态:</h4>
      <div class="validation-grid">
        <div class="validation-item" :class="{ success: initialMessage }">
          <span>✓</span> initialMessage: {{ initialMessage ? '已接收' : '未传递' }}
        </div>
        <div class="validation-item" :class="{ success: theme }">
          <span>✓</span> theme: {{ theme }}
        </div>
        <div class="validation-item" :class="{ success: userId }">
          <span>✓</span> userId: {{ userId || '未设置' }}
        </div>
        <div class="validation-item" :class="{ success: config }">
          <span>✓</span> config: {{ config ? 'Object已接收' : '未传递' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

// Props接口定义
interface Config {
  maxMessages?: number
  autoReply?: boolean
  allowDelete?: boolean
}

interface Props {
  initialMessage?: string
  theme?: 'light' | 'dark'
  userId?: string | number
  config?: Config
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light',
  config: () => ({ maxMessages: 50, autoReply: false, allowDelete: true })
})

// Emits定义
const emit = defineEmits<{
  close: []
  messageAdded: [message: { id: number; text: string; time: string }]
  dataUpdate: [data: { messageCount: number; theme: string; activeTime: number }]
  themeChanged: [theme: string]
}>()

// 响应式数据
const currentMessage = ref('')
const messages = ref<Array<{
  id: number
  text: string
  time: string
  type: 'user' | 'system'
}>>([])

const currentTheme = ref(props.theme)
const startTime = ref(Date.now())
const activeTime = ref(0)

// 计算属性
const userMessageCount = computed(() => 
  messages.value.filter(msg => msg.type === 'user').length
)

const theme = computed(() => currentTheme.value)

// 定时器
let timer: NodeJS.Timeout

// 方法
const addMessage = () => {
  if (!currentMessage.value.trim()) return
  
  const message = {
    id: Date.now(),
    text: currentMessage.value.trim(),
    time: new Date().toLocaleTimeString(),
    type: 'user' as const
  }
  
  messages.value.push(message)
  
  // 发射事件
  emit('messageAdded', message)
  
  // 自动回复
  if (props.config?.autoReply) {
    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        text: `自动回复: 您说的"${message.text}"已收到`,
        time: new Date().toLocaleTimeString(),
        type: 'system' as const
      }
      messages.value.push(autoReply)
    }, 1000)
  }
  
  // 检查消息数量限制
  if (props.config?.maxMessages && messages.value.length > props.config.maxMessages) {
    messages.value.shift()
  }
  
  currentMessage.value = ''
}

const deleteMessage = (id: number) => {
  if (!props.config?.allowDelete) return
  
  const index = messages.value.findIndex(msg => msg.id === id)
  if (index > -1) {
    messages.value.splice(index, 1)
  }
}

const clearMessages = () => {
  messages.value = []
  addSystemMessage('消息已清空')
}

const switchTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  emit('themeChanged', currentTheme.value)
  addSystemMessage(`主题已切换为 ${currentTheme.value}`)
}

const addSystemMessage = (text: string) => {
  messages.value.push({
    id: Date.now(),
    text,
    time: new Date().toLocaleTimeString(),
    type: 'system'
  })
}

const emitUpdate = () => {
  emit('dataUpdate', {
    messageCount: messages.value.length,
    theme: currentTheme.value,
    activeTime: activeTime.value
  })
  
  addSystemMessage('数据更新事件已发送')
}

const handleClose = () => {
  emit('close')
}

// 生命周期
onMounted(() => {
  console.log('InteractiveComponent 已挂载, Props:', props)
  
  // 添加初始消息
  if (props.initialMessage) {
    addSystemMessage(`初始消息: ${props.initialMessage}`)
  }
  
  addSystemMessage('组件已激活，开始计时')
  
  // 开始计时
  timer = setInterval(() => {
    activeTime.value = Math.floor((Date.now() - startTime.value) / 1000)
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
  console.log('InteractiveComponent 将要卸载')
})
</script>

<style scoped>
.interactive-component {
  padding: 20px;
  max-width: 600px;
  background: var(--bg-color, #ffffff);
  color: var(--text-color, #333333);
  transition: all 0.3s ease;
}

.theme-light {
  --bg-color: #ffffff;
  --text-color: #333333;
  --border-color: #e5e7eb;
  --input-bg: #f9fafb;
  --button-bg: #3b82f6;
}

.theme-dark {
  --bg-color: #1f2937;
  --text-color: #f9fafb;
  --border-color: #374151;
  --input-bg: #374151;
  --button-bg: #60a5fa;
}

.theme-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color);
}

.theme-header h3 {
  margin: 0;
  color: var(--text-color);
}

.theme-badge {
  background: var(--button-bg);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.message-section {
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.message-input {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--input-bg);
  color: var(--text-color);
}

.send-btn {
  padding: 10px 16px;
  background: var(--button-bg);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.initial-message {
  background: #f0f9ff;
  padding: 12px;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
}

.messages-container {
  margin-bottom: 20px;
}

.messages-list {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 10px;
  background: var(--input-bg);
}

.message-item {
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  position: relative;
}

.my-message {
  background: #dbeafe;
  border-left: 3px solid #3b82f6;
}

.system-message {
  background: #f3f4f6;
  border-left: 3px solid #6b7280;
  font-style: italic;
}

.message-time {
  font-size: 11px;
  color: #6b7280;
  margin-right: 10px;
  min-width: 60px;
}

.message-text {
  flex: 1;
}

.delete-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 12px;
  margin-left: 10px;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: var(--input-bg);
  border-radius: 6px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: var(--button-bg);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.actions button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.clear-btn { background: #f59e0b; color: white; }
.theme-btn { background: #8b5cf6; color: white; }
.update-btn { background: #10b981; color: white; }
.close-btn { background: #ef4444; color: white; }

.props-validation {
  border-top: 1px solid var(--border-color);
  padding-top: 15px;
}

.validation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
}

.validation-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 4px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 13px;
}

.validation-item.success {
  background: #f0fdf4;
  color: #16a34a;
}

.validation-item span {
  margin-right: 6px;
  font-weight: bold;
}
</style> 