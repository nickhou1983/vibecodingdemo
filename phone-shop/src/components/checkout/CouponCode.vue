<template>
  <div class="coupon-code">
    <h3 class="coupon-title" v-if="showTitle">优惠券</h3>
    
    <div v-if="appliedCoupon" class="applied-coupon">
      <div class="coupon-info">
        <div class="coupon-code">{{ appliedCoupon.code }}</div>
        <div class="coupon-value">-¥{{ formatPrice(appliedCoupon.value) }}</div>
      </div>
      <button class="remove-coupon" @click="removeCoupon">移除</button>
    </div>
    
    <form v-else class="coupon-form" @submit.prevent="applyCoupon">
      <div class="input-group">
        <input 
          type="text" 
          v-model="couponCode" 
          placeholder="输入优惠码"
          :class="{ 'has-error': error }" 
          @input="error = ''"
        >
        <Button 
          type="submit" 
          variant="outline" 
          :loading="loading" 
          :disabled="!couponCode.trim()"
        >
          使用
        </Button>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/components/common/Button.vue';

// Define props
const props = defineProps({
  showTitle: {
    type: Boolean,
    default: true
  }
});

// Define emits
const emit = defineEmits<{
  (e: 'apply', value: number): void
}>();

// State
const couponCode = ref('');
const error = ref('');
const loading = ref(false);
const appliedCoupon = ref<{ code: string; value: number } | null>(null);

// Valid coupons for demo
const validCoupons = [
  { code: 'WELCOME10', value: 100 },
  { code: 'SUMMER20', value: 200 },
  { code: 'VIP30', value: 300 }
];

// Methods
const applyCoupon = async () => {
  if (!couponCode.value.trim()) return;
  
  loading.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if coupon is valid
    const foundCoupon = validCoupons.find(
      c => c.code.toLowerCase() === couponCode.value.trim().toLowerCase()
    );
    
    if (foundCoupon) {
      appliedCoupon.value = foundCoupon;
      emit('apply', foundCoupon.value);
      error.value = '';
    } else {
      error.value = '无效的优惠码';
      appliedCoupon.value = null;
      emit('apply', 0);
    }
  } finally {
    loading.value = false;
  }
};

const removeCoupon = () => {
  appliedCoupon.value = null;
  couponCode.value = '';
  emit('apply', 0);
};

const formatPrice = (price: number): string => {
  return price.toLocaleString('zh-CN');
};
</script>

<style scoped>
.coupon-code {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  padding: var(--space-md);
}

.coupon-title {
  font-size: 1rem;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: var(--space-sm);
  color: var(--color-text);
}

.coupon-form {
  width: 100%;
}

.input-group {
  display: flex;
  align-items: center;
}

.input-group input {
  flex: 1;
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-right: none;
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.input-group input:focus {
  border-color: var(--color-primary);
}

.input-group input.has-error {
  border-color: var(--color-error);
}

.input-group button {
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  white-space: nowrap;
}

.error-message {
  color: var(--color-error);
  font-size: 0.85rem;
  margin-top: var(--space-xs);
}

.applied-coupon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xs);
  background-color: var(--color-background-soft);
  border-radius: var(--border-radius);
}

.coupon-info {
  display: flex;
  flex-direction: column;
}

.coupon-code {
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.9rem;
}

.coupon-value {
  color: var(--color-success);
  font-size: 0.85rem;
}

.remove-coupon {
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  font-size: 0.85rem;
  transition: color 0.2s;
  padding: var(--space-xs) var(--space-sm);
}

.remove-coupon:hover {
  color: var(--color-error);
}
</style>
