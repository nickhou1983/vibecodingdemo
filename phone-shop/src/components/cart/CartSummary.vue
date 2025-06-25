<template>
  <div class="cart-summary">
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
    
    <div class="shipping-info" v-if="subtotal < freeShippingThreshold && freeShippingThreshold > 0">
      <div class="shipping-progress">
        <div 
          class="progress-bar" 
          :style="`width: ${(subtotal / freeShippingThreshold) * 100}%`"
        ></div>
      </div>
      <p class="shipping-message">
        再消费 <strong>¥{{ formatPrice(freeShippingThreshold - subtotal) }}</strong> 可免运费
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define props
const props = defineProps<{
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  discount?: number;
}>();

// Define defaults
const discount = props.discount || 0;
const freeShippingThreshold = 1000; // Free shipping at ¥1000

// Format price
const formatPrice = (price: number): string => {
  return price.toLocaleString('zh-CN');
};
</script>

<style scoped>
.cart-summary {
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

.shipping-info {
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px dashed var(--color-border-light);
}

.shipping-progress {
  height: 6px;
  background-color: var(--color-background-soft);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: var(--space-xs);
}

.progress-bar {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.shipping-message {
  font-size: 0.9rem;
  color: var(--color-text-light);
  text-align: center;
}

.shipping-message strong {
  color: var(--color-primary);
}
</style>
