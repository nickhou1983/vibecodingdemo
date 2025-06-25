<template>
  <div class="auth-view">
    <div class="auth-container">
      <div class="auth-header">
        <img src="@/assets/logo.svg" alt="Phone Shop Logo" class="logo" />
        <h1>{{ pageTitle }}</h1>
      </div>
      
      <div class="auth-tabs" v-if="showTabs">
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'login' }"
          @click="setTab('login')"
        >
          登录
        </button>
        <button 
          class="tab-button" 
          :class="{ active: activeTab === 'register' }"
          @click="setTab('register')"
        >
          注册
        </button>
      </div>
      
      <div class="auth-content">
        <LoginForm v-if="activeTab === 'login'" @login-success="onLoginSuccess" />
        <RegisterForm v-else-if="activeTab === 'register'" @register-success="onRegisterSuccess" />
        <ForgotPassword v-else-if="activeTab === 'forgotPassword'" />
        <ResetPassword v-else-if="activeTab === 'resetPassword'" />
      </div>
      
      <div class="auth-footer">
        <template v-if="activeTab === 'login'">
          <p>没有账号？ <button class="text-button" @click="setTab('register')">立即注册</button></p>
          <p><button class="text-button" @click="setTab('forgotPassword')">忘记密码？</button></p>
        </template>
        
        <template v-else-if="activeTab === 'register'">
          <p>已有账号？ <button class="text-button" @click="setTab('login')">立即登录</button></p>
        </template>
        
        <template v-else>
          <p><button class="text-button" @click="setTab('login')">返回登录</button></p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoginForm from '@/components/auth/LoginForm.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';
import ForgotPassword from '@/components/auth/ForgotPassword.vue';
import ResetPassword from '@/components/auth/ResetPassword.vue';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const activeTab = ref('login');
const showTabs = ref(true);

onMounted(() => {
  // Check if user is already logged in
  if (userStore.isAuthenticated) {
    // Redirect to home or intended destination
    const redirectPath = route.query.redirect as string || '/';
    router.push(redirectPath);
    return;
  }
  
  // Set active tab based on route
  const tab = route.params.tab as string || route.query.tab as string;
  if (['login', 'register', 'forgotPassword', 'resetPassword'].includes(tab)) {
    activeTab.value = tab;
    
    // Hide tabs for password reset flows
    if (tab === 'forgotPassword' || tab === 'resetPassword') {
      showTabs.value = false;
    }
  }
  
  // Special case for reset password with token
  if (route.query.token) {
    activeTab.value = 'resetPassword';
    showTabs.value = false;
  }
});

const pageTitle = computed(() => {
  switch (activeTab.value) {
    case 'login': return '欢迎登录';
    case 'register': return '创建账号';
    case 'forgotPassword': return '找回密码';
    case 'resetPassword': return '重置密码';
    default: return '用户中心';
  }
});

const setTab = (tab: string) => {
  activeTab.value = tab;
  
  // Update URL without reloading the page
  router.replace({ 
    query: { 
      ...route.query,
      tab 
    } 
  });
  
  // Toggle tabs visibility
  showTabs.value = !(tab === 'forgotPassword' || tab === 'resetPassword');
};

const onLoginSuccess = () => {
  // Redirect to home or intended destination
  const redirectPath = route.query.redirect as string || '/';
  router.push(redirectPath);
};

const onRegisterSuccess = () => {
  // Redirect to home page after successful registration
  router.push('/');
};
</script>

<style scoped>
.auth-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  background-color: var(--light-blue);
}

.auth-container {
  width: 100%;
  max-width: 480px;
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.auth-header {
  text-align: center;
  padding: var(--space-lg) var(--space-lg) var(--space-md);
}

.logo {
  max-height: 60px;
  margin-bottom: var(--space-md);
}

.auth-header h1 {
  color: var(--primary-blue);
  font-size: var(--font-size-xl);
  margin: 0;
}

.auth-tabs {
  display: flex;
  border-bottom: 1px solid var(--gray-light);
}

.tab-button {
  flex: 1;
  padding: var(--space-md);
  background: none;
  border: none;
  font-weight: 500;
  font-size: var(--font-size-md);
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

.auth-content {
  padding: var(--space-lg);
}

.auth-footer {
  text-align: center;
  padding: 0 var(--space-lg) var(--space-lg);
  color: var(--gray-dark);
}

.text-button {
  background: none;
  border: none;
  color: var(--primary-blue);
  font-size: inherit;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: var(--transition-fast);
}

.text-button:hover {
  color: var(--primary-blue-dark);
}
</style>
