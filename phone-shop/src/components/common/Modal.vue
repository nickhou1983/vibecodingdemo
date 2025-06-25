<template>
  <Teleport to="body">
    <transition name="modal">
      <div 
        v-if="modelValue" 
        class="modal-overlay" 
        @click="closeOnOutsideClick && close()"
      >
        <div 
          class="modal"
          :class="[size]" 
          :style="customStyles"
          @click.stop
        >
          <div class="modal-header" v-if="$slots.header || title">
            <slot name="header">
              <h2 class="modal-title">{{ title }}</h2>
            </slot>
            <button 
              v-if="showCloseButton"
              class="close-button" 
              @click="close"
            >
              &times;
            </button>
          </div>
          
          <div class="modal-body">
            <slot></slot>
          </div>
          
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large', 'full'].includes(value)
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: true
  },
  maxWidth: {
    type: String,
    default: ''
  },
  maxHeight: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const customStyles = computed(() => {
  const styles: Record<string, string> = {};
  
  if (props.maxWidth) {
    styles.maxWidth = props.maxWidth;
  }
  
  if (props.maxHeight) {
    styles.maxHeight = props.maxHeight;
  }
  
  return styles;
});
</script>

<style scoped>
.modal-overlay {
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

.modal {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  width: 90%;
}

/* Size variants */
.small {
  max-width: 400px;
}

.medium {
  max-width: 600px;
}

.large {
  max-width: 800px;
}

.full {
  width: 95%;
  max-width: 1200px;
  height: 90vh;
}

.modal-header {
  padding: var(--space-md) var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--gray-light);
}

.modal-title {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--text-dark);
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
  width: 32px;
  height: 32px;
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

.modal-body {
  padding: var(--space-lg);
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: var(--space-md) var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-sm);
  border-top: 1px solid var(--gray-light);
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--transition-normal);
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform var(--transition-normal);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.9);
}
</style>
