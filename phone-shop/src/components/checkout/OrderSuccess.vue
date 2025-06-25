<template>
  <div class="order-success">
    <div class="success-icon">
      <svg viewBox="0 0 24 24" width="64" height="64">
        <path 
          fill="currentColor" 
          d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
        />
      </svg>
    </div>
    
    <h1 class="success-title">订单提交成功!</h1>
    <p class="success-message">
      感谢您的购买。您的订单已成功提交，我们将尽快处理您的订单。
    </p>
    
    <div class="order-info">
      <div class="info-item">
        <span class="label">订单编号:</span>
        <span class="value">{{ orderId }}</span>
      </div>
      
      <div class="info-item">
        <span class="label">订单日期:</span>
        <span class="value">{{ formatDate(new Date()) }}</span>
      </div>
      
      <div class="info-item">
        <span class="label">支付方式:</span>
        <span class="value">{{ paymentMethod }}</span>
      </div>
      
      <div class="info-item">
        <span class="label">总金额:</span>
        <span class="value price">¥{{ formatPrice(orderAmount) }}</span>
      </div>
    </div>
    
    <div class="delivery-info">
      <h2 class="section-title">配送信息</h2>
      <div class="info-content">
        <div class="address-info">
          <p><strong>{{ shippingAddress.name }}</strong></p>
          <p>{{ shippingAddress.phone }}</p>
          <p>{{ formatAddress(shippingAddress) }}</p>
        </div>
        
        <div class="estimated-delivery">
          <p class="estimate-label">预计送达时间:</p>
          <p class="estimate-value">{{ estimatedDeliveryDate }}</p>
        </div>
      </div>
    </div>
    
    <div class="next-actions">
      <Button variant="primary" @click="viewOrders">查看订单</Button>
      <Button variant="outline" @click="continueShopping">继续购物</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/common/Button.vue';

// Define props
const props = defineProps<{
  orderId: string;
  orderAmount: number;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    address: string;
    zipCode?: string;
  };
}>();

// Setup
const router = useRouter();

// Computed
const estimatedDeliveryDate = computed(() => {
  // Calculate estimated delivery date (3-5 business days from now)
  const today = new Date();
  const minDays = 3;
  const maxDays = 5;
  
  // Skip weekends
  const minDate = addBusinessDays(today, minDays);
  const maxDate = addBusinessDays(today, maxDays);
  
  const minFormatted = formatDate(minDate);
  const maxFormatted = formatDate(maxDate);
  
  return `${minFormatted} - ${maxFormatted}`;
});

// Methods
const viewOrders = () => {
  router.push('/account/orders');
};

const continueShopping = () => {
  router.push('/products');
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatPrice = (price: number): string => {
  return price.toLocaleString('zh-CN');
};

const formatAddress = (address: typeof props.shippingAddress): string => {
  return `${address.province} ${address.city} ${address.district} ${address.address}${address.zipCode ? ` (${address.zipCode})` : ''}`;
};

const addBusinessDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (result.getDay() !== 0 && result.getDay() !== 6) {
      addedDays++;
    }
  }
  
  return result;
};
</script>

<style scoped>
.order-success {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
  text-align: center;
}

.success-icon {
  color: var(--color-success);
  margin-bottom: var(--space-md);
}

.success-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.success-message {
  font-size: 1.1rem;
  color: var(--color-text-light);
  margin-bottom: var(--space-xl);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.order-info {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: var(--color-text-light);
}

.value {
  font-weight: 600;
  color: var(--color-text);
}

.value.price {
  color: var(--color-primary);
}

.delivery-info {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
  text-align: left;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--space-md);
  color: var(--color-text);
}

.info-content {
  display: flex;
  justify-content: space-between;
  gap: var(--space-xl);
}

.address-info p {
  margin: 4px 0;
  color: var(--color-text);
}

.estimated-delivery {
  text-align: right;
  flex-shrink: 0;
}

.estimate-label {
  font-size: 0.9rem;
  color: var(--color-text-light);
  margin-bottom: 4px;
}

.estimate-value {
  font-weight: 600;
  color: var(--color-text);
}

.next-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}

@media (max-width: 768px) {
  .info-content {
    flex-direction: column;
    gap: var(--space-md);
  }
  
  .estimated-delivery {
    text-align: left;
  }
  
  .next-actions {
    flex-direction: column;
  }
}
</style>
