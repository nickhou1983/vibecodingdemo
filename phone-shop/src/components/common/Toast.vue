<template>
  <Teleport to="body">
    <div class="toast-container" :class="position">
      <TransitionGroup name="toast">
        <div 
          v-for="toast in toasts" 
          :key="toast.id"
          class="toast"
          :class="[toast.type, { clickable: toast.clickable }]"
          @click="toast.clickable && closeToast(toast.id)"
        >
          <div class="toast-icon" v-if="toast.showIcon">
            <svg v-if="toast.type === 'success'" class="icon" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
            </svg>
            <svg v-else-if="toast.type === 'error'" class="icon" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
            </svg>
            <svg v-else-if="toast.type === 'warning'" class="icon" viewBox="0 0 24 24">
              <path d="M12 2L1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V9h2v4z"></path>
            </svg>
            <svg v-else-if="toast.type === 'info'" class="icon" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
            </svg>
          </div>
          <div class="toast-content">
            <div v-if="toast.title" class="toast-title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
          <button 
            v-if="toast.closable" 
            class="toast-close" 
            @click.stop="closeToast(toast.id)"
          >
            &times;
          </button>
          <div 
            v-if="toast.progress && toast.duration !== undefined && toast.duration > 0" 
            class="toast-progress" 
            :style="{
              animationDuration: `${toast.duration}ms`,
              backgroundColor: toast.progressColor || undefined
            }"
          ></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';

export interface ToastOptions {
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  closable?: boolean;
  clickable?: boolean;
  showIcon?: boolean;
  progress?: boolean;
  progressColor?: string;
  onClose?: () => void;
}

export interface Toast extends ToastOptions {
  id: number;
}

const props = defineProps({
  position: {
    type: String,
    default: 'top-right',
    validator: (value: string) => [
      'top-right', 'top-center', 'top-left',
      'bottom-right', 'bottom-center', 'bottom-left'
    ].includes(value)
  },
  maxToasts: {
    type: Number,
    default: 5
  }
});

const toasts = ref<Toast[]>([]);
const toastIdCounter = ref(0);

// Store timeout IDs to clear them when the component is unmounted
const timeouts = new Map<number, ReturnType<typeof setTimeout>>();

const showToast = (options: ToastOptions): number => {
  const id = ++toastIdCounter.value;
  
  const toast: Toast = {
    id,
    title: options.title || '',
    message: options.message,
    type: options.type || 'info',
    duration: options.duration === undefined ? 3000 : options.duration,
    closable: options.closable === undefined ? true : options.closable,
    clickable: options.clickable === undefined ? true : options.clickable,
    showIcon: options.showIcon === undefined ? true : options.showIcon,
    progress: options.progress === undefined ? true : options.progress,
    progressColor: options.progressColor,
    onClose: options.onClose
  };
  
  // Add toast to the array
  toasts.value.push(toast);
  
  // Limit the number of toasts
  if (toasts.value.length > props.maxToasts) {
    const removedToast = toasts.value.shift();
    if (removedToast && timeouts.has(removedToast.id)) {
      clearTimeout(timeouts.get(removedToast.id));
      timeouts.delete(removedToast.id);
    }
  }
  
  // Auto-close toast after duration (if duration > 0)
  if (toast.duration !== undefined && toast.duration > 0) {
    const timeout = setTimeout(() => {
      closeToast(id);
      timeouts.delete(id);
    }, toast.duration);
    
    timeouts.set(id, timeout);
  }
  
  return id;
};

const closeToast = (id: number) => {
  const index = toasts.value.findIndex(toast => toast.id === id);
  
  if (index !== -1) {
    const toast = toasts.value[index];
    toasts.value.splice(index, 1);
    
    // Call onClose callback if provided
    if (toast.onClose) {
      toast.onClose();
    }
    
    // Clear timeout if exists
    if (timeouts.has(id)) {
      clearTimeout(timeouts.get(id));
      timeouts.delete(id);
    }
  }
};

// Clear all timeouts when component is unmounted
onBeforeUnmount(() => {
  timeouts.forEach(timeout => clearTimeout(timeout));
  timeouts.clear();
});

// Export methods
defineExpose({
  showToast,
  closeToast,
  // Helper methods for different toast types
  success: (message: string, options: Partial<ToastOptions> = {}) => 
    showToast({ message, type: 'success', ...options }),
  error: (message: string, options: Partial<ToastOptions> = {}) => 
    showToast({ message, type: 'error', ...options }),
  warning: (message: string, options: Partial<ToastOptions> = {}) => 
    showToast({ message, type: 'warning', ...options }),
  info: (message: string, options: Partial<ToastOptions> = {}) => 
    showToast({ message, type: 'info', ...options })
});
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-md);
  pointer-events: none;
  max-width: 100%;
  width: 350px;
}

/* Position variants */
.top-right {
  top: 0;
  right: 0;
  align-items: flex-end;
}

.top-center {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

.top-left {
  top: 0;
  left: 0;
  align-items: flex-start;
}

.bottom-right {
  bottom: 0;
  right: 0;
  align-items: flex-end;
}

.bottom-center {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

.bottom-left {
  bottom: 0;
  left: 0;
  align-items: flex-start;
}

.toast {
  position: relative;
  padding: var(--space-md) var(--space-lg);
  background-color: white;
  color: var(--text-dark);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  overflow: hidden;
  width: 100%;
  pointer-events: auto;
}

.toast.clickable {
  cursor: pointer;
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.toast-message {
  word-break: break-word;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: inherit;
  opacity: 0.6;
  font-size: var(--font-size-lg);
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: var(--space-sm);
  transition: var(--transition-fast);
}

.toast-close:hover {
  opacity: 1;
}

.toast-progress {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 4px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  transform-origin: left;
  animation: progress-shrink linear forwards;
}

/* Toast types */
.success {
  background-color: var(--success);
  color: white;
}

.error {
  background-color: var(--error);
  color: white;
}

.warning {
  background-color: var(--warning);
  color: white;
}

.info {
  background-color: var(--info);
  color: white;
}

/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.top-right .toast-enter-from,
.top-right .toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.top-left .toast-enter-from,
.top-left .toast-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.bottom-right .toast-enter-from,
.bottom-right .toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.bottom-left .toast-enter-from,
.bottom-left .toast-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.top-center .toast-enter-from,
.top-center .toast-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.bottom-center .toast-enter-from,
.bottom-center .toast-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@keyframes progress-shrink {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}
</style>
