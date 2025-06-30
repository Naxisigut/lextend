<template>
  <div class="user-info-component">
    <div class="header">
      <h3>{{ title }}</h3>
      <span class="badge">Vue组件</span>
    </div>
    
    <div class="content">
      <div class="user-avatar">
        <div class="avatar-circle">{{ userName.charAt(0).toUpperCase() }}</div>
      </div>
      
      <div class="user-details">
        <p><strong>用户名:</strong> {{ userName }}</p>
        <p><strong>邮箱:</strong> {{ email }}</p>
        <p><strong>访问次数:</strong> {{ visitCount }}</p>
      </div>
      
      <div class="actions">
        <button @click="incrementVisit" class="btn-primary">
          增加访问次数
        </button>
        <button @click="updateEmail" class="btn-secondary">
          更新邮箱
        </button>
        <button @click="handleClose" class="btn-danger">
          关闭弹窗
        </button>
      </div>
      
      <div class="features-list">
        <h4>组件功能验证:</h4>
        <ul>
          <li :class="{ verified: propsReceived }">✅ Props 传递正常</li>
          <li :class="{ verified: reactivityWorking }">✅ 响应式数据正常</li>
          <li :class="{ verified: eventsWorking }">✅ 事件发送正常</li>
          <li :class="{ verified: stylesWorking }">✅ 样式渲染正常</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 定义Props
interface Props {
  title?: string
  initialUserName?: string
  initialEmail?: string
  initialCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '用户信息',
  initialUserName: 'Vue用户',
  initialEmail: 'user@example.com',
  initialCount: 0
})

// 定义Emits
const emit = defineEmits<{
  close: []
  userUpdated: [user: { name: string; email: string; count: number }]
}>()

// 响应式数据
const userName = ref(props.initialUserName)
const email = ref(props.initialEmail)
const visitCount = ref(props.initialCount)

// 计算属性
const propsReceived = computed(() => props.title !== '用户信息')
const reactivityWorking = computed(() => visitCount.value > props.initialCount)
const eventsWorking = ref(false)
const stylesWorking = ref(true)

// 方法
const incrementVisit = () => {
  visitCount.value++
  eventsWorking.value = true
  
  // 发射事件给父组件
  emit('userUpdated', {
    name: userName.value,
    email: email.value,
    count: visitCount.value
  })
}

const updateEmail = () => {
  const newEmail = prompt('请输入新邮箱:', email.value)
  if (newEmail && newEmail.trim()) {
    email.value = newEmail.trim()
    emit('userUpdated', {
      name: userName.value,
      email: email.value,
      count: visitCount.value
    })
  }
}

const handleClose = () => {
  emit('close')
}

// 生命周期
onMounted(() => {
  console.log('Vue组件已挂载，Props:', props)
})
</script>

<style scoped>
.user-info-component {
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  max-width: 480px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 20px;
}

.badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.avatar-circle {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.user-details {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.user-details p {
  margin: 8px 0;
  color: #374151;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-danger:hover {
  background: #dc2626;
}

.features-list {
  background: #f0f9ff;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e0f2fe;
}

.features-list h4 {
  margin: 0 0 12px 0;
  color: #0369a1;
  font-size: 16px;
}

.features-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li {
  padding: 6px 0;
  color: #64748b;
  transition: color 0.3s;
}

.features-list li.verified {
  color: #059669;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .user-info-component {
    padding: 16px;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .actions button {
    width: 100%;
    padding: 12px;
  }
}
</style> 