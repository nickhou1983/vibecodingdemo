<template>
  <div class="cart-item">
    <div class="cart-item-image">
      <img :src="item.image" :alt="item.name">
    </div>
    
    <div class="cart-item-content">
      <div class="cart-item-header">
        <router-link :to="`/products/${item.productId}`" class="cart-item-title">
          {{ item.name }}
        </router-link>
        <button class="remove-button" @click="removeItem">×</button>
      </div>
      
      <div class="cart-item-details">
        <div class="cart-item-variant">
          <span v-if="item.color" class="variant-detail">
            颜色: <span class="variant-value">{{ item.color }}</span>
          </span>
          <span v-if="item.storage" class="variant-detail">
            存储: <span class="variant-value">{{ item.storage }}</span>
          </span>
        </div>
        
        <div class="cart-item-availability" v-if="!item.inStock" :class="{'out-of-stock': !item.inStock}">
          <span>暂时缺货</span>
        </div>
      </div>
      
      <div class="cart-item-actions">
        <div class="cart-item-quantity">
          <QuantitySelector 
            v-model="quantity" 
            :min="1" 
            :max="item.maxQuantity || 10" 
            @update:modelValue="updateQuantity"
          />
        </div>
        
        <div class="cart-item-price">
          <div class="current-price">¥{{ formatPrice(item.price) }}</div>
          <div v-if="item.originalPrice && item.originalPrice > item.price" class="original-price">
            ¥{{ formatPrice(item.originalPrice) }}
          </div>
        </div>
        
        <div class="cart-item-subtotal">
          <div class="subtotal-label">小计:</div>
          <div class="subtotal-value">¥{{ formatPrice(item.price * quantity) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCartStore } from '@/stores/cart';
import QuantitySelector from '@/components/common/QuantitySelector.vue';

// Define props
const props = defineProps<{
  item: {
    id: string;
    productId: string;
    variantId?: string;
    name: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    image: string;
    color?: string;
    storage?: string;
    inStock: boolean;
    maxQuantity?: number;
  }
}>();

// Define emits
const emit = defineEmits<{
  (e: 'remove'): void;
  (e: 'update:quantity', quantity: number): void;
}>();

// Setup
const cartStore = useCartStore();
const quantity = ref(props.item.quantity);

// Watch quantity changes from parent
watch(
  () => props.item.quantity,
  (newQuantity) => {
    quantity.value = newQuantity;
  }
);

// Methods
const updateQuantity = (value: number) => {
  emit('update:quantity', value);
  cartStore.updateItemQuantity(props.item.id, value);
};

const removeItem = () => {
  emit('remove');
  cartStore.removeItem(props.item.id);
};

const formatPrice = (price: number) => {
  return price.toLocaleString('zh-CN');
};
</script>

<style scoped>
.cart-item {
  display: flex;
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-border-light);
  position: relative;
}

.cart-item-image {
  width: 100px;
  height: 100px;
  border-radius: var(--border-radius);
  overflow: hidden;
  margin-right: var(--space-md);
  flex-shrink: 0;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cart-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-xs);
}

.cart-item-title {
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  font-size: 1.1rem;
  transition: color 0.2s;
}

.cart-item-title:hover {
  color: var(--color-primary);
}

.remove-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--color-text-light);
  padding: 0;
  margin: 0;
  transition: color 0.2s;
}

.remove-button:hover {
  color: var(--color-error);
}

.cart-item-details {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--space-sm);
}

.cart-item-variant {
  font-size: 0.9rem;
  color: var(--color-text-light);
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-xs);
}

.variant-detail {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.variant-value {
  font-weight: 500;
  color: var(--color-text);
}

.cart-item-availability {
  font-size: 0.85rem;
  margin-top: var(--space-xs);
}

.out-of-stock {
  color: var(--color-error);
}

.cart-item-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-item-quantity {
  width: 120px;
}

.cart-item-price {
  text-align: right;
  min-width: 90px;
}

.current-price {
  font-weight: 500;
  color: var(--color-text);
}

.original-price {
  font-size: 0.85rem;
  color: var(--color-text-light);
  text-decoration: line-through;
}

.cart-item-subtotal {
  text-align: right;
  min-width: 120px;
}

.subtotal-label {
  font-size: 0.85rem;
  color: var(--color-text-light);
}

.subtotal-value {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    align-items: center;
    padding: var(--space-md) var(--space-sm);
  }
  
  .cart-item-image {
    width: 80px;
    height: 80px;
    margin-right: 0;
    margin-bottom: var(--space-sm);
  }
  
  .cart-item-header {
    width: 100%;
  }
  
  .cart-item-actions {
    flex-direction: column;
    gap: var(--space-sm);
    width: 100%;
  }
  
  .cart-item-quantity,
  .cart-item-price,
  .cart-item-subtotal {
    width: 100%;
    text-align: center;
  }
}
</style>
