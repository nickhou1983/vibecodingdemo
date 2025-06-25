<template>
  <div class="quantity-selector">
    <button 
      class="quantity-button decrease" 
      :disabled="modelValue <= min"
      @click="updateQuantity(modelValue - 1)"
    >
      <span>-</span>
    </button>
    
    <input 
      type="number" 
      class="quantity-input" 
      :value="modelValue"
      :min="min"
      :max="max"
      @input="onInput"
      @blur="onBlur"
    />
    
    <button 
      class="quantity-button increase" 
      :disabled="modelValue >= max"
      @click="updateQuantity(modelValue + 1)"
    >
      <span>+</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 99
  },
  step: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['update:modelValue']);

// Ensure value stays within bounds
const ensureWithinBounds = (value: number): number => {
  if (isNaN(value) || value < props.min) return props.min;
  if (value > props.max) return props.max;
  return value;
};

// Update quantity ensuring it's within bounds
const updateQuantity = (value: number) => {
  const boundedValue = ensureWithinBounds(value);
  if (boundedValue !== props.modelValue) {
    emit('update:modelValue', boundedValue);
  }
};

// Handle input event (when user types)
const onInput = (event: Event) => {
  const inputElement = event.target as HTMLInputElement;
  const value = parseInt(inputElement.value);
  
  if (!isNaN(value)) {
    emit('update:modelValue', value);
  }
};

// Handle blur event (when input loses focus)
const onBlur = (event: Event) => {
  const inputElement = event.target as HTMLInputElement;
  const value = parseInt(inputElement.value);
  
  updateQuantity(value);
};
</script>

<style scoped>
.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid var(--gray-medium);
  border-radius: var(--border-radius-sm);
  height: 40px;
  box-sizing: border-box;
  width: 100%;
}

.quantity-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 100%;
  background: none;
  border: none;
  font-size: var(--font-size-md);
  color: var(--text-dark);
  cursor: pointer;
  user-select: none;
  transition: var(--transition-fast);
}

.quantity-button:hover:not(:disabled) {
  background-color: var(--gray-light);
}

.quantity-button:disabled {
  color: var(--gray-medium);
  cursor: not-allowed;
}

.quantity-input {
  flex: 1;
  height: 100%;
  border: none;
  text-align: center;
  font-size: var(--font-size-md);
  padding: 0;
  margin: 0;
  -moz-appearance: textfield;
}

.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-input:focus {
  outline: none;
}
</style>
