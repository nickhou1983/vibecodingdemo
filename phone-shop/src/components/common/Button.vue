<template>
  <button 
    :class="[
      'custom-button',
      `custom-button--${variant}`,
      { 'custom-button--full-width': fullWidth },
      { 'custom-button--icon-only': iconOnly }
    ]"
    :type="type"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="custom-button__loading">
      <span class="spinner"></span>
    </span>
    <span v-else>
      <i v-if="iconLeft" class="custom-button__icon custom-button__icon--left" :class="iconLeft"></i>
      <slot>Button</slot>
      <i v-if="iconRight" class="custom-button__icon custom-button__icon--right" :class="iconRight"></i>
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'outline', 'text'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  iconOnly: {
    type: Boolean,
    default: false
  },
  iconLeft: {
    type: String,
    default: ''
  },
  iconRight: {
    type: String,
    default: ''
  }
});

defineEmits(['click']);
</script>

<style scoped>
.custom-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  font-size: var(--font-size-md);
  padding: 0.6rem 1.25rem;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: none;
  outline: none;
  white-space: nowrap;
  box-shadow: var(--shadow-sm);
}

.custom-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.custom-button:active:not(:disabled) {
  transform: translateY(0);
}

.custom-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.custom-button--primary {
  background-color: var(--primary-blue);
  color: var(--text-light);
}

.custom-button--primary:hover:not(:disabled) {
  background-color: var(--primary-blue-dark);
}

.custom-button--secondary {
  background-color: var(--accent-blue);
  color: var(--text-light);
}

.custom-button--secondary:hover:not(:disabled) {
  background-color: var(--primary-blue);
}

.custom-button--outline {
  background-color: transparent;
  border: 2px solid var(--primary-blue);
  color: var(--primary-blue);
  box-shadow: none;
}

.custom-button--outline:hover:not(:disabled) {
  background-color: var(--light-blue);
}

.custom-button--text {
  background-color: transparent;
  color: var(--primary-blue);
  padding: 0.4rem 0.8rem;
  box-shadow: none;
}

.custom-button--text:hover:not(:disabled) {
  background-color: var(--light-blue);
}

.custom-button--full-width {
  width: 100%;
}

.custom-button--icon-only {
  padding: 0.6rem;
  border-radius: var(--border-radius-round);
}

.custom-button__icon {
  display: inline-flex;
  align-items: center;
}

.custom-button__icon--left {
  margin-right: 0.5rem;
}

.custom-button__icon--right {
  margin-left: 0.5rem;
}

.custom-button__loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--text-light);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
