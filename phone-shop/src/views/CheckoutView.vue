<template>
  <div class="checkout-view">
    <template v-if="!orderSuccess">
      <div class="checkout-header">
        <h1 class="checkout-title">结算</h1>
        <Breadcrumb :items="breadcrumbItems" />
      </div>
      
      <CheckoutForm />
    </template>
    
    <OrderSuccess 
      v-else
      :orderId="successData.orderId"
      :orderAmount="successData.orderAmount"
      :paymentMethod="successData.paymentMethod"
      :shippingAddress="successData.shippingAddress"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import CheckoutForm from '@/components/checkout/CheckoutForm.vue';
import OrderSuccess from '@/components/checkout/OrderSuccess.vue';

// Setup
const route = useRoute();
const cartStore = useCartStore();

// State
const orderSuccess = computed(() => {
  return route.path.includes('/checkout/success');
});

// Mock data for success page
const successData = ref({
  orderId: route.query.orderId?.toString() || 'ORD12345678',
  orderAmount: 5999,
  paymentMethod: '支付宝',
  shippingAddress: {
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    address: '科技园路1号',
    zipCode: '518000'
  }
});

// Breadcrumb
const breadcrumbItems = [
  { label: '首页', to: '/' },
  { label: '购物车', to: '/cart' },
  { label: '结算', to: '/checkout' }
];

// Lifecycle hooks
onMounted(() => {
  document.title = orderSuccess.value ? '订单成功 - 手机商城' : '结算 - 手机商城';
  
  // If we're on success page, calculate total from cart
  if (orderSuccess.value) {
    const cartItems = cartStore.items;
    if (cartItems.length > 0) {
      const subtotal = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      
      // Add tax and shipping
      const tax = subtotal * 0.13;
      const shipping = subtotal > 1000 ? 0 : 20;
      
      successData.value.orderAmount = subtotal + tax + shipping;
    }
  }
});
</script>

<style scoped>
.checkout-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-lg);
  min-height: 70vh;
  padding-bottom: var(--space-xl);
}

.checkout-header {
  margin-bottom: var(--space-xl);
}

.checkout-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: var(--space-sm);
  color: var(--color-text);
}
</style>
