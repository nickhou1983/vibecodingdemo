<template>
  <div class="mini-cart">
    <div 
      class="mini-cart-trigger"
      @click="toggleCart"
      ref="cartTrigger"
    >
      <div class="cart-icon">
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path 
            fill="currentColor"
            d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z"
          />
        </svg>
      </div>
      <div v-if="itemCount > 0" class="cart-badge">
        {{ itemCount > 99 ? '99+' : itemCount }}
      </div>
    </div>
    
    <div 
      v-if="isOpen" 
      class="mini-cart-dropdown"
      ref="cartDropdown"
    >
      <div class="mini-cart-header">
        <h3>购物车 ({{ itemCount }})</h3>
        <button class="close-button" @click="isOpen = false">×</button>
      </div>
      
      <div v-if="loading" class="mini-cart-loading">
        <LoadingSpinner size="small" />
      </div>
      
      <template v-else>
        <div v-if="cartItems.length > 0" class="mini-cart-items">
          <div 
            v-for="item in cartItems" 
            :key="item.id" 
            class="mini-cart-item"
          >
            <div class="item-image">
              <img :src="item.image" :alt="item.name">
            </div>
            
            <div class="item-info">
              <div class="item-name" :title="item.name">{{ item.name }}</div>
              <div v-if="item.color || item.storage" class="item-variant">
                {{ [item.color, item.storage].filter(Boolean).join(', ') }}
              </div>
              <div class="item-details">
                <div class="item-price">¥{{ formatPrice(item.price) }}</div>
                <div class="item-quantity">× {{ item.quantity }}</div>
              </div>
            </div>
            
            <button 
              class="remove-item" 
              @click.stop="removeItem(item.id)" 
              title="移除"
            >
              ×
            </button>
          </div>
        </div>
        
        <div v-else class="mini-cart-empty">
          <p>购物车是空的</p>
        </div>
        
        <div v-if="cartItems.length > 0" class="mini-cart-footer">
          <div class="cart-subtotal">
            <span>小计:</span>
            <span class="subtotal-value">¥{{ formatPrice(subtotal) }}</span>
          </div>
          
          <div class="cart-actions">
            <Button 
              variant="outline" 
              class="view-cart-btn" 
              @click="viewCart"
            >
              查看购物车
            </Button>
            
            <Button 
              variant="primary" 
              class="checkout-btn" 
              @click="checkout"
            >
              去结算
            </Button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import Button from '@/components/common/Button.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

// Setup
const router = useRouter();
const cartStore = useCartStore();
const cartTrigger = ref<HTMLElement | null>(null);
const cartDropdown = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const loading = ref(false);

// Computed properties
const cartItems = computed(() => cartStore.items);

const itemCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0);
});

const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

// Methods
const toggleCart = (event: Event) => {
  event.stopPropagation();
  isOpen.value = !isOpen.value;
  
  if (isOpen.value) {
    // Simulate loading
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 300);
  }
};

const removeItem = (id: string) => {
  cartStore.removeItem(id);
};

const viewCart = () => {
  isOpen.value = false;
  router.push('/cart');
};

const checkout = () => {
  isOpen.value = false;
  router.push('/checkout');
};

const formatPrice = (price: number): string => {
  return price.toLocaleString('zh-CN');
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (
    isOpen.value &&
    cartDropdown.value &&
    cartTrigger.value &&
    !cartDropdown.value.contains(event.target as Node) &&
    !cartTrigger.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.mini-cart {
  position: relative;
}

.mini-cart-trigger {
  position: relative;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-icon {
  color: var(--color-text);
  display: flex;
}

.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 18px;
  height: 18px;
  background-color: var(--color-primary);
  color: white;
  border-radius: 9px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.mini-cart-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  max-width: calc(100vw - 40px);
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  z-index: 1000;
  overflow: hidden;
  animation: fadeIn 0.2s ease;
}

.mini-cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--color-border-light);
}

.mini-cart-header h3 {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-text-light);
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-button:hover {
  color: var(--color-text);
}

.mini-cart-loading {
  padding: var(--space-lg);
  display: flex;
  justify-content: center;
}

.mini-cart-items {
  max-height: 360px;
  overflow-y: auto;
  padding: var(--space-xs) 0;
}

.mini-cart-item {
  display: flex;
  padding: var(--space-xs) var(--space-md);
  position: relative;
  border-bottom: 1px solid var(--color-border-light);
  transition: background-color 0.2s;
}

.mini-cart-item:hover {
  background-color: var(--color-background-soft);
}

.mini-cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius);
  overflow: hidden;
  margin-right: var(--space-sm);
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
  padding-right: 20px;
}

.item-name {
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 2px;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-variant {
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-bottom: 4px;
}

.item-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.item-price {
  font-weight: 500;
  color: var(--color-text);
}

.item-quantity {
  color: var(--color-text-light);
}

.remove-item {
  position: absolute;
  top: var(--space-xs);
  right: var(--space-xs);
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--color-text-light);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.2s, color 0.2s;
  border-radius: 50%;
}

.remove-item:hover {
  opacity: 1;
  color: var(--color-error);
  background-color: var(--color-background);
}

.mini-cart-empty {
  padding: var(--space-lg);
  text-align: center;
  color: var(--color-text-light);
}

.mini-cart-footer {
  padding: var(--space-md);
  border-top: 1px solid var(--color-border-light);
  background-color: var(--color-background-soft);
}

.cart-subtotal {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
  font-size: 0.9rem;
}

.subtotal-value {
  font-weight: 600;
  color: var(--color-primary);
}

.cart-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
}

.view-cart-btn,
.checkout-btn {
  width: 100%;
  font-size: 0.85rem;
  padding: var(--space-xs) var(--space-sm);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .mini-cart-dropdown {
    width: 280px;
  }
}
</style>
