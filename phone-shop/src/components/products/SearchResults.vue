<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import ProductCard from './ProductCard.vue';
import ProductSort from './ProductSort.vue';
import LoadingSpinner from '../common/LoadingSpinner.vue';
import Breadcrumb from '../layout/Breadcrumb.vue';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  discountPrice?: number;
  image: string;
  rating: number;
  inStock: boolean;
}

const props = defineProps({
  query: {
    type: String,
    required: true
  }
});

const products = ref<Product[]>([]);
const loading = ref(true);
const totalResults = ref(0);
const sortBy = ref('relevance');

// Mock data for demonstration
const mockProducts = [
  {
    id: 1,
    name: "iPhone 13 Pro",
    brand: "Apple",
    price: 999,
    image: "/images/products/iphone-13-pro.jpg",
    rating: 4.8,
    inStock: true
  },
  {
    id: 2,
    name: "Samsung Galaxy S21",
    brand: "Samsung",
    price: 799,
    discountPrice: 699,
    image: "/images/products/samsung-s21.jpg",
    rating: 4.5,
    inStock: true
  },
  {
    id: 3,
    name: "Google Pixel 6",
    brand: "Google",
    price: 599,
    image: "/images/products/pixel-6.jpg",
    rating: 4.6,
    inStock: false
  }
];

// Methods
const searchProducts = () => {
  loading.value = true;
  // Simulate API call with search query
  setTimeout(() => {
    // In a real app, this would make an API call with the search query
    const filtered = mockProducts.filter(product => 
      product.name.toLowerCase().includes(props.query.toLowerCase()) || 
      product.brand.toLowerCase().includes(props.query.toLowerCase())
    );
    products.value = filtered;
    totalResults.value = filtered.length;
    loading.value = false;
  }, 500);
};

const handleSort = (value: string) => {
  sortBy.value = value;
  
  if (value === 'price-low-high') {
    products.value.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (value === 'price-high-low') {
    products.value.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (value === 'rating') {
    products.value.sort((a, b) => b.rating - a.rating);
  } else {
    // Default: relevance - we would need a proper algorithm for this in a real app
    searchProducts();
  }
};

// Watch for query changes
watch(() => props.query, (newQuery) => {
  if (newQuery) {
    searchProducts();
  }
}, { immediate: true });

onMounted(() => {
  searchProducts();
});
</script>

<template>
  <div class="search-results">
    <Breadcrumb :items="[
      { text: 'Home', to: '/' },
      { text: `Search: ${props.query}`, to: '' }
    ]" />
    
    <div class="search-results__header">
      <div class="search-results__info">
        <h1 class="search-results__title">Search Results for "{{ props.query }}"</h1>
        <p class="search-results__count">{{ totalResults }} results found</p>
      </div>
      <ProductSort @update:modelValue="handleSort" :modelValue="sortBy" />
    </div>
    
    <div v-if="loading" class="search-results__loading">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="products.length === 0" class="search-results__empty">
      <p>No products found matching "{{ props.query }}"</p>
      <p>Try using different keywords or check for spelling errors.</p>
    </div>
    
    <div v-else class="search-results__grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="{
          id: product.id,
          name: product.name,
          image: product.image,
          currentPrice: product.discountPrice || product.price,
          originalPrice: product.discountPrice ? product.price : undefined,
          rating: product.rating,
          reviewCount: 0,
          features: [],
          slug: product.name.toLowerCase().replace(/\s+/g, '-')
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.search-results {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-md);
}

.search-results__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--space-lg) 0;
}

.search-results__title {
  font-size: var(--font-size-xl);
  color: var(--text-dark);
  margin: 0;
  margin-bottom: var(--space-xs);
}

.search-results__count {
  color: var(--gray-medium);
  margin: 0;
}

.search-results__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-lg);
}

.search-results__loading,
.search-results__empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  text-align: center;
}

.search-results__empty {
  color: var(--gray-dark);
}

.search-results__empty p:first-child {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-sm);
}

@media (max-width: 768px) {
  .search-results__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }
  
  .search-results__grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--space-md);
  }
}
</style>
