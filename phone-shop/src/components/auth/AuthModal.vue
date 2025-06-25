<template>
  <div class="auth-modal-overlay" @click="closeModal">
    <div class="auth-modal" @click.stop>
      <div class="auth-modal-header">
        <h2>{{ modalTitle }}</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      
      <div class="auth-modal-tabs" v-if="showTabs">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'login' }"
          @click="activeTab = 'login'"
        >
          登录
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'register' }"
          @click="activeTab = 'register'"
        >
          注册
        </button>
      </div>
      
      <div class="auth-modal-content">
        <LoginForm v-if="activeTab === 'login'" @login-success="handleLoginSuccess" />
        <RegisterForm v-else-if="activeTab === 'register'" @register-success="handleRegisterSuccess" />
        <ForgotPassword v-else-if="activeTab === 'forgotPassword'" />
        <ResetPassword v-else-if="activeTab === 'resetPassword'" />
      </div>
      
      <div class="auth-modal-footer" v-if="activeTab === 'login'">
        <button class="text-button" @click="activeTab = 'forgotPassword'">
          忘记密码？
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';
import ForgotPassword from './ForgotPassword.vue';
import ResetPassword from './ResetPassword.vue';

const props = defineProps({
  initialTab: {
    type: String,
    default: 'login',
    validator: (value: string) => ['login', 'register', 'forgotPassword', 'resetPassword'].includes(value)
  },
  showTabs: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close', 'login-success', 'register-success']);

const activeTab = ref(props.initialTab);

const modalTitle = computed(() => {
  switch (activeTab.value) {
    case 'login':
      return '登录';
    case 'register':
      return '注册';
    case 'forgotPassword':
      return '忘记密码';
    case 'resetPassword':
      return '重置密码';
    default:
      return '';
  }
});

const closeModal = () => {
  emit('close');
};

const handleLoginSuccess = () => {
  emit('login-success');
  closeModal();
};

const handleRegisterSuccess = () => {
  emit('register-success');
  closeModal();
};
</script>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.auth-modal {
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.auth-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--gray-light);
}

.auth-modal-header h2 {
  margin: 0;
  color: var(--primary-blue);
}

.close-button {
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  line-height: 1;
  color: var(--gray-dark);
  cursor: pointer;
  padding: 0;
  margin: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-round);
  transition: var(--transition-fast);
}

.close-button:hover {
  background-color: var(--gray-light);
  color: var(--text-dark);
}

.auth-modal-tabs {
  display: flex;
  border-bottom: 1px solid var(--gray-light);
}

.tab-button {
  flex: 1;
  padding: var(--space-md);
  background: none;
  border: none;
  font-weight: 500;
  color: var(--gray-dark);
  cursor: pointer;
  transition: var(--transition-fast);
}

.tab-button.active {
  color: var(--primary-blue);
  border-bottom: 2px solid var(--primary-blue);
}

.tab-button:hover:not(.active) {
  background-color: var(--gray-light);
}

.auth-modal-content {
  padding: var(--space-lg);
  max-height: 70vh;
  overflow-y: auto;
}

.auth-modal-footer {
  padding: var(--space-md) var(--space-lg);
  text-align: center;
  border-top: 1px solid var(--gray-light);
}

.text-button {
  background: none;
  border: none;
  color: var(--primary-blue);
  font-size: var(--font-size-sm);
  cursor: pointer;
  padding: var(--space-xs) var(--space-sm);
  transition: var(--transition-fast);
}

.text-button:hover {
  text-decoration: underline;
}
</style>
