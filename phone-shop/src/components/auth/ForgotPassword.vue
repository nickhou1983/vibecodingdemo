<template>
  <div class="forgot-password-form">
    <h2>忘记密码</h2>
    <p class="description">请输入您的电子邮箱，我们将为您发送重置密码的链接。</p>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">电子邮箱</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          class="form-control"
          placeholder="请输入您的电子邮箱"
          :class="{ 'error': errors.email }" 
          required
        />
        <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
      </div>
      
      <div class="form-footer">
        <div v-if="message" class="form-message" :class="{ 'success': success, 'error': !success }">
          {{ message }}
        </div>
        <button 
          type="submit" 
          class="btn-primary" 
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">处理中...</span>
          <span v-else>发送重置链接</span>
        </button>
        <div class="links">
          <router-link to="/login">返回登录</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const email = ref('');
const isSubmitting = ref(false);
const success = ref(false);
const message = ref('');
const errors = reactive({
  email: ''
});

const validateEmail = (email: string): boolean => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!email) {
    errors.email = '请输入电子邮箱';
    return false;
  } 
  if (!emailPattern.test(email)) {
    errors.email = '请输入有效的电子邮箱地址';
    return false;
  }
  errors.email = '';
  return true;
};

const handleSubmit = async () => {
  if (!validateEmail(email.value)) return;
  
  isSubmitting.value = true;
  message.value = '';
  
  try {
    // This would be an API call in a real application
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    success.value = true;
    message.value = '重置密码链接已发送到您的邮箱，请查收';
  } catch (error) {
    success.value = false;
    message.value = '发送重置链接失败，请稍后再试';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.forgot-password-form {
  max-width: 400px;
  margin: 0 auto;
  padding: var(--space-lg);
  background-color: #fff;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
}

h2 {
  color: var(--primary-blue);
  margin-bottom: var(--space-md);
  text-align: center;
}

.description {
  margin-bottom: var(--space-lg);
  color: var(--gray-dark);
  text-align: center;
  font-size: var(--font-size-sm);
}

.form-group {
  margin-bottom: var(--space-lg);
}

label {
  display: block;
  margin-bottom: var(--space-sm);
  color: var(--text-dark);
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--gray-medium);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  transition: var(--transition-fast);
}

.form-control:focus {
  border-color: var(--primary-blue);
  outline: none;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-control.error {
  border-color: var(--error);
}

.error-message {
  color: var(--error);
  font-size: var(--font-size-sm);
  margin-top: var(--space-xs);
}

.form-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
}

.form-message {
  text-align: center;
  padding: var(--space-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  width: 100%;
}

.form-message.success {
  background-color: rgba(56, 142, 60, 0.1);
  color: var(--success);
}

.form-message.error {
  background-color: rgba(211, 47, 47, 0.1);
  color: var(--error);
}

.btn-primary {
  width: 100%;
  padding: var(--space-md);
  background-color: var(--primary-blue);
  color: var(--text-light);
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-primary:hover {
  background-color: var(--primary-blue-dark);
}

.btn-primary:disabled {
  background-color: var(--gray-medium);
  cursor: not-allowed;
}

.links {
  text-align: center;
  margin-top: var(--space-md);
}

.links a {
  color: var(--primary-blue);
  text-decoration: none;
  font-size: var(--font-size-sm);
}

.links a:hover {
  text-decoration: underline;
}
</style>
