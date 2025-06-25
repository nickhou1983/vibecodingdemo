<template>
  <div class="order-summary">
    <h2 class="summary-title">订单摘要</h2>
    
    <div class="summary-items">
      <div class="summary-item">
        <span class="item-label">商品小计</span>
        <span class="item-value">¥{{ formatPrice(subtotal) }}</span>
      </div>
      
      <div class="summary-item" v-if="discount > 0">
        <span class="item-label">优惠</span>
        <span class="item-value discount">-¥{{ formatPrice(discount) }}</span>
      </div>
      
      <div class="summary-item">
        <span class="item-label">税费</span>
        <span class="item-value">¥{{ formatPrice(tax) }}</span>
      </div>
      
      <div class="summary-item">
        <span class="item-label">运费</span>
        <span class="item-value">
          <template v-if="shipping === 0">免费</template>
          <template v-else>¥{{ formatPrice(shipping) }}</template>
        </span>
      </div>
      
      <div class="summary-item total">
        <span class="item-label">总计</span>
        <span class="item-value">¥{{ formatPrice(total) }}</span>
      </div>
    </div>
    
    <div class="summary-footer" v-if="showDeliveryInfo">
      <div class="delivery-info">
        <div class="delivery-icon">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path 
              fill="currentColor" 
              d="M19.5,3.09L15,7.59V4H9V11H3V13H7V20H9V13H15V20H17V11H23V9H17V7.59L19.5,5.09V3.09M17,9V6.14L19.86,3.28V4.86L17,7.72V9Z" 
            />
          </svg>
        </div>
        <div class="delivery-text">
          <div class="delivery-title">预计送达时间</div>
          <div class="delivery-time">{{ estimatedDelivery }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Define props
const props = defineProps<{
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  discount?: number;
  showDeliveryInfo?: boolean;
}>();

// Default values
const discount = props.discount || 0;
const showDeliveryInfo = props.showDeliveryInfo !== undefined ? props.showDeliveryInfo : true;

// Computed
const estimatedDelivery = computed(() => {
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

// Helper functions
const formatPrice = (price: number): string => {
  return price.toLocaleString('zh-CN');
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric'
  });
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
.order-summary {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  padding: var(--space-lg);
}

.summary-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-border-light);
  color: var(--color-text);
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xs) 0;
}

.item-label {
  color: var(--color-text-light);
}

.item-value {
  font-weight: 500;
  color: var(--color-text);
}

.item-value.discount {
  color: var(--color-success);
}

.summary-item.total {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border-light);
}

.summary-item.total .item-label,
.summary-item.total .item-value {
  font-weight: 600;
  color: var(--color-text);
  font-size: 1.1rem;
}

.summary-footer {
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px dashed var(--color-border-light);
}

.delivery-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.delivery-icon {
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.delivery-text {
  flex: 1;
}

.delivery-title {
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.delivery-time {
  font-weight: 500;
  color: var(--color-text);
}
</style>
