<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <div class="error-image">
        <svg viewBox="0 0 24 24" class="error-icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
        </svg>
      </div>
      <h2>页面未找到</h2>
      <p>您要寻找的页面可能已被移除、更名或暂时无法访问。</p>
      <div class="actions">
        <router-link to="/" class="btn-primary">
          返回首页
        </router-link>
        <button class="btn-secondary" @click="goBack">
          返回上一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.not-found {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  background-color: var(--gray-light);
}

.not-found-content {
  max-width: 500px;
  text-align: center;
  padding: var(--space-xl);
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
}

h1 {
  font-size: 6rem;
  font-weight: 700;
  color: var(--primary-blue);
  margin: 0;
  line-height: 1;
}

h2 {
  font-size: var(--font-size-xl);
  margin: var(--space-lg) 0 var(--space-md);
  color: var(--text-dark);
}

p {
  color: var(--gray-dark);
  margin-bottom: var(--space-xl);
}

.error-image {
  margin: var(--space-lg) auto;
  width: 120px;
  height: 120px;
}

.error-icon {
  width: 100%;
  height: 100%;
  fill: var(--primary-blue-light);
}

.actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  transition: var(--transition-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.btn-primary {
  background-color: var(--primary-blue);
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: var(--primary-blue-dark);
}

.btn-secondary {
  background-color: transparent;
  color: var(--primary-blue);
  border: 1px solid var(--primary-blue);
}

.btn-secondary:hover {
  background-color: var(--light-blue);
}
</style>
