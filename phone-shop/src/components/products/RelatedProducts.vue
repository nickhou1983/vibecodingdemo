<template>
  <div class="related-products">
    <div v-if="loading" class="loading-container">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="products.length > 0" class="products-grid">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product" 
        size="compact"
      />
    </div>
    
    <div v-else class="no-products">
      暂无相关产品推荐
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProductCard from './ProductCard.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

// Define props
const props = defineProps<{
  productId: string;
}>();

// Define product interface
interface Product {
  id: string;
  name: string;
  currentPrice: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  features: string[];
}

// State
const loading = ref(true);
const products = ref<Product[]>([]);

// Fetch related products
const fetchRelatedProducts = async (productId: string) => {
  // In a real app, this would be an API call
  // For now, we'll simulate a delay and return mock data
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: '2',
      name: 'iPhone 13 Pro',
      currentPrice: 6999,
      originalPrice: 8999,
      image: '/images/products/iphone-related-1.jpg',
      rating: 4.7,
      reviewCount: 122,
      features: ['iOS 15', 'A15 芯片', '三摄像头']
    },
    {
      id: '3',
      name: 'iPhone 14',
      currentPrice: 5999,
      image: '/images/products/iphone-related-2.jpg',
      rating: 4.5,
      reviewCount: 87,
      features: ['iOS 16', 'A15 芯片', '双摄像头']
    },
    {
      id: '4',
      name: 'iPhone 14 Plus',
      currentPrice: 6499,
      image: '/images/products/iphone-related-3.jpg',
      rating: 4.6,
      reviewCount: 56,
      features: ['iOS 16', 'A15 芯片', '双摄像头']
    },
    {
      id: '5',
      name: 'iPhone SE',
      currentPrice: 3999,
      originalPrice: 4499,
      image: '/images/products/iphone-related-4.jpg',
      rating: 4.3,
      reviewCount: 203,
      features: ['iOS 16', 'A15 芯片', '单摄像头']
    }
  ];
};

onMounted(async () => {
  try {
    products.value = await fetchRelatedProducts(props.productId);
  } catch (error) {
    console.error('Failed to fetch related products:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.related-products {
  margin-top: var(--space-xl);
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: var(--space-xl) 0;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-lg);
}

.no-products {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--space-md);
  }
}
</style>
