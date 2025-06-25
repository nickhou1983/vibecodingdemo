<template>
  <form class="login-form" @submit.prevent="handleLogin">
    <div class="form-header">
      <h2 class="form-title">Sign In</h2>
      <p class="form-subtitle">Welcome back! Please enter your details</p>
    </div>
    
    <div class="form-group" :class="{ 'form-group--error': errors.email }">
      <label for="email" class="form-label">Email</label>
      <input 
        type="email" 
        id="email" 
        v-model="form.email" 
        class="form-input" 
        placeholder="Enter your email"
        @blur="validateEmail"
        required
      >
      <p v-if="errors.email" class="form-error">{{ errors.email }}</p>
    </div>
    
    <div class="form-group" :class="{ 'form-group--error': errors.password }">
      <div class="form-label-row">
        <label for="password" class="form-label">Password</label>
        <router-link to="/auth/forgot-password" class="form-link">Forgot password?</router-link>
      </div>
      <div class="password-input">
        <input 
          :type="showPassword ? 'text' : 'password'" 
          id="password" 
          v-model="form.password" 
          class="form-input" 
          placeholder="••••••••"
          @blur="validatePassword"
          required
        >
        <button 
          type="button" 
          class="password-toggle" 
          @click="showPassword = !showPassword"
          tabindex="-1"
        >
          <span v-if="showPassword">Hide</span>
          <span v-else>Show</span>
        </button>
      </div>
      <p v-if="errors.password" class="form-error">{{ errors.password }}</p>
    </div>
    
    <div class="form-group form-checkbox">
      <label class="checkbox">
        <input type="checkbox" v-model="form.remember">
        <span class="checkbox-label">Remember me for 30 days</span>
      </label>
    </div>
    
    <button 
      type="submit" 
      class="btn btn-primary btn-block"
      :disabled="isSubmitting"
    >
      <span v-if="isSubmitting">Signing in...</span>
      <span v-else>Sign in</span>
    </button>
    
    <div class="social-login">
      <p class="social-divider"><span>or continue with</span></p>
      <div class="social-buttons">
        <button type="button" class="btn btn-social">
          <span class="social-icon">G</span>
          Google
        </button>
        <button type="button" class="btn btn-social">
          <span class="social-icon">F</span>
          Facebook
        </button>
      </div>
    </div>
    
    <p class="form-footer">
      Don't have an account? 
      <router-link to="/auth/register" class="form-link">Sign up</router-link>
    </p>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const form = reactive({
  email: '',
  password: '',
  remember: false
});

const errors = reactive({
  email: '',
  password: '',
  general: ''
});

const isSubmitting = ref(false);
const showPassword = ref(false);

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email) {
    errors.email = 'Email is required';
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email address';
  } else {
    errors.email = '';
  }
}

function validatePassword() {
  if (!form.password) {
    errors.password = 'Password is required';
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  } else {
    errors.password = '';
  }
}  async function handleLogin() {
  // Validate all fields
  validateEmail();
  validatePassword();
  
  // Check if there are any validation errors
  if (errors.email || errors.password) {
    return;
  }
  
  try {
    isSubmitting.value = true;
    
    // Call authentication service or store action
    const result = await userStore.login(form.email, form.password);
    
    if (result.success) {
      // Redirect to home or intended page
      router.push('/');
    } else {
      errors.general = 'Login failed. Please check your credentials and try again.';
    }
  } catch (error: any) {
    errors.general = error.message || 'Login failed. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.5rem;
  color: #1a2b63;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-subtitle {
  color: #666;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #4d8bf8;
  outline: none;
  box-shadow: 0 0 0 2px rgba(77, 139, 248, 0.2);
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 0.8rem;
  color: #666;
  cursor: pointer;
}

.password-toggle:focus {
  outline: none;
  color: #4d8bf8;
}

.form-checkbox {
  display: flex;
  align-items: center;
}

.checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox input {
  margin-right: 0.5rem;
}

.checkbox-label {
  font-size: 0.9rem;
  color: #555;
}

.form-link {
  color: #1a2b63;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.2s;
}

.form-link:hover {
  color: #4d8bf8;
  text-decoration: underline;
}

.form-error {
  color: #d32f2f;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.form-group--error .form-input {
  border-color: #d32f2f;
}

.btn {
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-size: 0.95rem;
}

.btn-primary {
  background-color: #1a2b63;
  color: white;
}

.btn-primary:hover {
  background-color: #0f1f4d;
}

.btn-primary:disabled {
  background-color: #8a97bd;
  cursor: not-allowed;
}

.btn-social {
  background-color: #f5f7ff;
  color: #333;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-social:hover {
  background-color: #e9eeff;
}

.btn-block {
  width: 100%;
}

.social-login {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.social-divider {
  position: relative;
  text-align: center;
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.social-divider::before,
.social-divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background-color: #ddd;
}

.social-divider::before {
  left: 0;
}

.social-divider::after {
  right: 0;
}

.social-divider span {
  background-color: #fff;
  padding: 0 1rem;
}

.social-buttons {
  display: flex;
  gap: 1rem;
}

.social-buttons .btn {
  flex: 1;
}

.social-icon {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #555;
}

@media (max-width: 576px) {
  .login-form {
    padding: 1.5rem;
    box-shadow: none;
    max-width: 100%;
  }
}
</style>
