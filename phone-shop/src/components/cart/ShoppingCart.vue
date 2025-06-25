<template>
  <div class="shopping-cart">
    <div class="cart-header">
      <h1 class="cart-title">购物车</h1>
      <Breadcrumb :items="breadcrumbItems" />
    </div>
    
    <div v-if="loading" class="cart-loading">
      <LoadingSpinner />
    </div>
    
    <template v-else>
      <template v-if="cartItems.length > 0">
        <div class="cart-content">
          <div class="cart-items-container">
            <div class="cart-items-list">
              <CartItem 
                v-for="item in cartItems" 
                :key="item.id" 
                :item="item"
              />
            </div>
          </div>
          
          <div class="cart-sidebar">
            <CartSummary 
              :subtotal="subtotal" 
              :tax="tax" 
              :shipping="shipping" 
              :total="total"
            />
            
            <div class="cart-coupon">
              <CouponCode @apply="applyCoupon" />
            </div>
            
            <CartActions />
          </div>
        </div>
      </template>
      
      <EmptyCart v-else />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import CartItem from '@/components/cart/CartItem.vue';
import CartSummary from '@/components/cart/CartSummary.vue';
import CartActions from '@/components/cart/CartActions.vue';
import EmptyCart from '@/components/cart/EmptyCart.vue';
import CouponCode from '@/components/checkout/CouponCode.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

// Define breadcrumb items
const breadcrumbItems = [
  { label: '首页', to: '/' },
  { label: '购物车', to: '/cart' }
];

// Setup cart store
const cartStore = useCartStore();
const loading = ref(true);
const cartItems = computed(() => cartStore.items);

// Define computed values for cart totals
const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

const tax = computed(() => {
  // Assume tax is 13% of subtotal
  return subtotal.value * 0.13;
});

const shipping = computed(() => {
  // Free shipping for orders over ¥1000, otherwise ¥20
  return subtotal.value > 1000 ? 0 : 20;
});

const discount = ref(0);

const total = computed(() => {
  return subtotal.value + tax.value + shipping.value - discount.value;
});

// Methods
const applyCoupon = (couponValue: number) => {
  discount.value = couponValue;
};

// Lifecycle hooks
onMounted(() => {
  // Simulate loading cart data
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<style scoped>
.shopping-cart {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-lg);
}

.cart-header {
  margin-bottom: var(--space-xl);
}

.cart-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: var(--space-sm);
  color: var(--color-text);
}

.cart-loading {
  display: flex;
  justify-content: center;
  padding: var(--space-xl) 0;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--space-xl);
}

.cart-items-container {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
}

.cart-items-list {
  display: flex;
  flex-direction: column;
}

.cart-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.cart-coupon {
  margin-bottom: var(--space-md);
}

@media (max-width: 900px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-sidebar {
    order: -1;
  }
}
</style>
