<template>
  <div class="empty-cart">
    <div class="empty-cart-icon">
      <svg viewBox="0 0 24 24" width="100" height="100">
        <path
          fill="currentColor"
          d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z"
        />
      </svg>
    </div>
    <h2 class="empty-cart-title">您的购物车是空的</h2>
    <p class="empty-cart-message">
      看起来您尚未添加任何商品到购物车。
    </p>
    <Button 
      variant="primary"
      class="shop-now-button"
      @click="goToProducts"
    >
      立即选购
    </Button>
    
    <div class="suggestions" v-if="suggestions.length > 0">
      <h3 class="suggestions-title">您可能会喜欢</h3>
      <div class="suggestions-grid">
        <ProductCard
          v-for="product in suggestions"
          :key="product.id"
          :product="product"
          size="small"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/common/Button.vue';
import ProductCard from '@/components/products/ProductCard.vue';

// Setup
const router = useRouter();

// Suggestions data
const suggestions = ref([
  {
    id: '1',
    name: 'iPhone 14 Pro Max',
    currentPrice: 8999,
    originalPrice: 9999,
    image: '/images/products/iphone-1.jpg',
    rating: 4.8,
    reviewCount: 256
  },
  {
    id: '2',
    name: 'Samsung Galaxy S22 Ultra',
    currentPrice: 7999,
    image: '/images/products/samsung-1.jpg',
    rating: 4.7,
    reviewCount: 182
  },
  {
    id: '3',
    name: 'Xiaomi 12 Pro',
    currentPrice: 4999,
    originalPrice: 5999,
    image: '/images/products/xiaomi-1.jpg',
    rating: 4.5,
    reviewCount: 120
  }
]);

// Methods
const goToProducts = () => {
  router.push('/products');
};
</script>

<style scoped>
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-xl) 0;
  text-align: center;
}

.empty-cart-icon {
  margin-bottom: var(--space-lg);
  color: var(--color-text-light);
}

.empty-cart-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--space-sm);
  color: var(--color-text);
}

.empty-cart-message {
  color: var(--color-text-light);
  max-width: 400px;
  margin-bottom: var(--space-lg);
}

.shop-now-button {
  padding-left: var(--space-lg);
  padding-right: var(--space-lg);
}

.suggestions {
  margin-top: var(--space-xl);
  width: 100%;
  max-width: 800px;
}

.suggestions-title {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: var(--space-lg);
  color: var(--color-text);
  text-align: center;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-md);
}

@media (max-width: 768px) {
  .suggestions-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>
