<template>
  <form class="register-form" @submit.prevent="handleRegister">
    <div class="form-header">
      <h2 class="form-title">Create an Account</h2>
      <p class="form-subtitle">Join us to access exclusive deals and features</p>
    </div>
    
    <div class="form-group" :class="{ 'form-group--error': errors.name }">
      <label for="name" class="form-label">Full Name</label>
      <input 
        type="text" 
        id="name" 
        v-model="form.name" 
        class="form-input" 
        placeholder="Enter your full name"
        @blur="validateName"
        required
      >
      <p v-if="errors.name" class="form-error">{{ errors.name }}</p>
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
      <label for="password" class="form-label">Password</label>
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
      <div class="password-strength" v-if="form.password">
        <div class="password-strength__label">Password strength:</div>
        <div class="password-strength__bars">
          <div 
            v-for="i in 4" 
            :key="i" 
            class="password-strength__bar"
            :class="{ 'active': passwordScore >= i }"
          ></div>
        </div>
        <div class="password-strength__text" :class="`strength-${passwordScore}`">
          {{ passwordStrengthText }}
        </div>
      </div>
    </div>
    
    <div class="form-group" :class="{ 'form-group--error': errors.confirmPassword }">
      <label for="confirmPassword" class="form-label">Confirm Password</label>
      <input 
        :type="showConfirmPassword ? 'text' : 'password'" 
        id="confirmPassword" 
        v-model="form.confirmPassword" 
        class="form-input" 
        placeholder="••••••••"
        @blur="validateConfirmPassword"
        required
      >
      <p v-if="errors.confirmPassword" class="form-error">{{ errors.confirmPassword }}</p>
    </div>
    
    <div class="form-group form-checkbox">
      <label class="checkbox">
        <input type="checkbox" v-model="form.terms" @change="validateTerms">
        <span class="checkbox-label">
          I agree to the <a href="/terms" class="form-link">Terms of Service</a> and <a href="/privacy" class="form-link">Privacy Policy</a>
        </span>
      </label>
      <p v-if="errors.terms" class="form-error">{{ errors.terms }}</p>
    </div>
    
    <button 
      type="submit" 
      class="btn btn-primary btn-block"
      :disabled="isSubmitting"
    >
      <span v-if="isSubmitting">Creating account...</span>
      <span v-else>Create account</span>
    </button>
    
    <div class="social-login">
      <p class="social-divider"><span>or sign up with</span></p>
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
      Already have an account?
      <router-link to="/auth/login" class="form-link">Sign in</router-link>
    </p>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false
});

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: '',
  general: ''
});

const isSubmitting = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Password strength calculation
const passwordScore = computed(() => {
  if (!form.password) return 0;
  
  let score = 0;
  // Length check
  if (form.password.length >= 8) score++;
  // Contains number
  if (/[0-9]/.test(form.password)) score++;
  // Contains lowercase and uppercase
  if (/[a-z]/.test(form.password) && /[A-Z]/.test(form.password)) score++;
  // Contains special characters
  if (/[^a-zA-Z0-9]/.test(form.password)) score++;
  
  return score;
});

const passwordStrengthText = computed(() => {
  switch (passwordScore.value) {
    case 0: return 'Weak';
    case 1: return 'Fair';
    case 2: return 'Good';
    case 3: return 'Strong';
    case 4: return 'Very Strong';
    default: return '';
  }
});

function validateName() {
  if (!form.name) {
    errors.name = 'Name is required';
  } else if (form.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else {
    errors.name = '';
  }
}

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
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else {
    errors.password = '';
  }
  
  // If confirm password is already filled, revalidate it
  if (form.confirmPassword) {
    validateConfirmPassword();
  }
}

function validateConfirmPassword() {
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  } else {
    errors.confirmPassword = '';
  }
}

function validateTerms() {
  errors.terms = form.terms ? '' : 'You must agree to the Terms of Service';
}

async function handleRegister() {
  // Validate all fields
  validateName();
  validateEmail();
  validatePassword();
  validateConfirmPassword();
  validateTerms();
  
  // Check if there are any validation errors
  if (Object.values(errors).some(error => error)) {
    return;
  }
  
  try {
    isSubmitting.value = true;
    
    // Call user store register action
    const result = await userStore.register(form.name, form.email, form.password);
    
    if (result.success) {
      // Redirect to home or a welcome page
      router.push('/');
    } else {
      errors.general = 'Registration failed. Please try again.';
    }
  } catch (error: any) {
    errors.general = error.message || 'Registration failed. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.register-form {
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
  align-items: flex-start;
}

.checkbox {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
}

.checkbox input {
  margin-right: 0.5rem;
  margin-top: 0.25rem;
}

.checkbox-label {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.4;
}

.form-link {
  color: #1a2b63;
  text-decoration: none;
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

/* Password strength indicator */
.password-strength {
  margin-top: 0.75rem;
  font-size: 0.85rem;
}

.password-strength__label {
  margin-bottom: 0.25rem;
  color: #555;
}

.password-strength__bars {
  display: flex;
  gap: 5px;
  margin-bottom: 0.25rem;
}

.password-strength__bar {
  height: 5px;
  flex: 1;
  background-color: #e0e0e0;
  border-radius: 2px;
}

.password-strength__bar.active {
  background-color: currentColor;
}

.password-strength__text {
  font-weight: 500;
}

.password-strength__text.strength-1 {
  color: #f44336; /* red */
}

.password-strength__text.strength-2 {
  color: #ff9800; /* orange */
}

.password-strength__text.strength-3 {
  color: #4caf50; /* green */
}

.password-strength__text.strength-4 {
  color: #2e7d32; /* dark green */
}

@media (max-width: 576px) {
  .register-form {
    padding: 1.5rem;
    box-shadow: none;
    max-width: 100%;
  }
}
</style>
