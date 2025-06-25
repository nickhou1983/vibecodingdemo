<template>
  <div class="reset-password-form">
    <h2>重置密码</h2>
    <p class="description">请设置您的新密码</p>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="password">新密码</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          class="form-control"
          placeholder="请输入新密码"
          :class="{ 'error': errors.password }" 
          required
        />
        <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
        
        <div v-if="password" class="password-strength">
          <span>密码强度:</span>
          <div class="strength-meter">
            <div 
              class="strength-value" 
              :style="{ width: passwordStrength.percent + '%' }"
              :class="passwordStrength.class"
            ></div>
          </div>
          <span class="strength-text" :class="passwordStrength.class">
            {{ passwordStrength.label }}
          </span>
        </div>
      </div>
      
      <div class="form-group">
        <label for="confirmPassword">确认新密码</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="confirmPassword" 
          class="form-control"
          placeholder="请再次输入新密码"
          :class="{ 'error': errors.confirmPassword }" 
          required
        />
        <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
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
          <span v-else>重置密码</span>
        </button>
        <div class="links">
          <router-link to="/login">返回登录</router-link>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

const password = ref('');
const confirmPassword = ref('');
const isSubmitting = ref(false);
const success = ref(false);
const message = ref('');
const errors = reactive({
  password: '',
  confirmPassword: ''
});

const validatePassword = (password: string): boolean => {
  if (!password) {
    errors.password = '请输入密码';
    return false;
  } 
  if (password.length < 8) {
    errors.password = '密码长度至少为8个字符';
    return false;
  }
  errors.password = '';
  return true;
};

const validateConfirmPassword = (confirmPassword: string, password: string): boolean => {
  if (!confirmPassword) {
    errors.confirmPassword = '请确认密码';
    return false;
  }
  if (confirmPassword !== password) {
    errors.confirmPassword = '两次输入的密码不一致';
    return false;
  }
  errors.confirmPassword = '';
  return true;
};

const passwordStrength = computed(() => {
  const pw = password.value;
  if (!pw) {
    return { percent: 0, class: '', label: '' };
  }
  
  // Calculate password strength
  let strength = 0;
  const tests = [
    /[a-z]/.test(pw),  // has lowercase
    /[A-Z]/.test(pw),  // has uppercase
    /[0-9]/.test(pw),  // has number
    /[^a-zA-Z0-9]/.test(pw), // has special char
    pw.length >= 8,    // at least 8 chars
    pw.length >= 12    // at least 12 chars
  ];
  
  strength = tests.filter(Boolean).length;
  
  // Define strength levels
  let strengthClass = '';
  let strengthLabel = '';
  let percent = 0;
  
  if (pw.length < 4) {
    strengthClass = 'very-weak';
    strengthLabel = '非常弱';
    percent = 20;
  } else if (strength < 3) {
    strengthClass = 'weak';
    strengthLabel = '弱';
    percent = 40;
  } else if (strength < 4) {
    strengthClass = 'medium';
    strengthLabel = '中等';
    percent = 60;
  } else if (strength < 5) {
    strengthClass = 'strong';
    strengthLabel = '强';
    percent = 80;
  } else {
    strengthClass = 'very-strong';
    strengthLabel = '非常强';
    percent = 100;
  }
  
  return { percent, class: strengthClass, label: strengthLabel };
});

const handleSubmit = async () => {
  const isPasswordValid = validatePassword(password.value);
  const isConfirmPasswordValid = validateConfirmPassword(confirmPassword.value, password.value);
  
  if (!isPasswordValid || !isConfirmPasswordValid) return;
  
  isSubmitting.value = true;
  message.value = '';
  
  try {
    // This would be an API call in a real application
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    success.value = true;
    message.value = '密码重置成功，请使用新密码登录';
    
    // Clear form fields
    password.value = '';
    confirmPassword.value = '';
  } catch (error) {
    success.value = false;
    message.value = '密码重置失败，请稍后再试';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.reset-password-form {
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

.password-strength {
  margin-top: var(--space-md);
  font-size: var(--font-size-sm);
}

.strength-meter {
  height: 8px;
  background-color: var(--gray-light);
  border-radius: var(--border-radius-sm);
  margin: var(--space-xs) 0;
  overflow: hidden;
}

.strength-value {
  height: 100%;
  transition: var(--transition-normal);
}

.strength-text {
  font-size: var(--font-size-sm);
  font-weight: 500;
}

/* Strength classes */
.very-weak {
  background-color: #FF1744;
  color: #FF1744;
}

.weak {
  background-color: #FF9100;
  color: #FF9100;
}

.medium {
  background-color: #FFEA00;
  color: #F57F17;
}

.strong {
  background-color: #00C853;
  color: #00C853;
}

.very-strong {
  background-color: #00B8D4;
  color: #00B8D4;
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
