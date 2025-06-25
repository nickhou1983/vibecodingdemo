<template>
  <button 
    class="add-to-cart-button" 
    :class="{ loading: isLoading, disabled: isDisabled }" 
    :disabled="isDisabled || isLoading"
    @click="addToCart"
  >
    <div class="button-content">
      <span v-if="isLoading" class="loading-indicator">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </span>
      <span v-else>
        <svg class="cart-icon" viewBox="0 0 24 24">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
        </svg>
        {{ buttonText }}
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCartStore } from '@/stores/cart';

interface Props {
  productId: string;
  variantId?: string;
  quantity?: number;
  size?: 'small' | 'medium' | 'large';
  buttonText?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variantId: undefined,
  quantity: 1,
  size: 'medium',
  buttonText: '加入购物车',
  disabled: false
});

const emit = defineEmits(['added-to-cart', 'error']);

const cartStore = useCartStore();
const isLoading = ref(false);
const isDisabled = computed(() => props.disabled || isLoading.value);

const addToCart = async () => {
  try {
    isLoading.value = true;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const result = await cartStore.addItem({
      productId: props.productId,
      variantId: props.variantId,
      quantity: props.quantity
    });
    
    emit('added-to-cart', {
      productId: props.productId,
      variantId: props.variantId,
      quantity: props.quantity
    });
    
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    emit('error', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.add-to-cart-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.add-to-cart-button:not(.disabled):hover {
  background-color: var(--primary-blue-dark);
}

.add-to-cart-button.disabled {
  background-color: var(--gray-medium);
  cursor: not-allowed;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
}

.cart-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

/* Loading indicator */
.loading-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: white;
  opacity: 0;
  animation: dot-animation 1.4s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-animation {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
}
</style>
