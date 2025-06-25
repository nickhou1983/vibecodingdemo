<template>
  <div 
    class="loading-spinner" 
    :class="{ 
      'small': size === 'small', 
      'medium': size === 'medium', 
      'large': size === 'large',
      'overlay': overlay
    }"
  >
    <div class="spinner" :style="spinnerStyle">
      <div class="bounce1" :style="bounceStyle"></div>
      <div class="bounce2" :style="bounceStyle"></div>
      <div class="bounce3" :style="bounceStyle"></div>
    </div>
    <div v-if="text" class="spinner-text" :style="{ color }">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: 'var(--primary-blue)'
  },
  overlay: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  }
});

const spinnerStyle = computed(() => ({
  color: props.color
}));

const bounceStyle = computed(() => ({
  backgroundColor: props.color
}));
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
}

.loading-spinner.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
}

.spinner {
  display: flex;
  gap: 4px;
}

.spinner > div {
  border-radius: 100%;
  display: inline-block;
  animation: bounce 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  animation-delay: -0.16s;
}

/* Size variants */
.small .spinner > div {
  width: 6px;
  height: 6px;
}

.medium .spinner > div {
  width: 10px;
  height: 10px;
}

.large .spinner > div {
  width: 16px;
  height: 16px;
}

.spinner-text {
  font-size: var(--font-size-sm);
  font-weight: 500;
}

@keyframes bounce {
  0%, 80%, 100% { 
    transform: scale(0);
  } 40% { 
    transform: scale(1.0);
  }
}
</style>
