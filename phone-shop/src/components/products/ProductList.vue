<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ProductCard from './ProductCard.vue';
import ProductSort from './ProductSort.vue';
import ProductFilter from './ProductFilter.vue';
import LoadingSpinner from '../common/LoadingSpinner.vue';
import Pagination from '../common/Pagination.vue';

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  discountPrice?: number;
  image: string;
  rating: number;
  inStock: boolean;
  colors: string[];
}

const props = defineProps({
  category: {
    type: String,
    default: ''
  },
  filterParams: {
    type: Object,
    default: () => ({})
  }
});

const products = ref<Product[]>([]);
const loading = ref(true);
const page = ref(1);
const totalPages = ref(1);
const sortBy = ref('popular');

// Mock data for demonstration
const mockProducts = [
  {
    id: 1,
    name: "iPhone 13 Pro",
    brand: "Apple",
    price: 999,
    image: "/images/products/iphone-13-pro.jpg",
    rating: 4.8,
    inStock: true,
    colors: ['graphite', 'gold', 'silver', 'blue']
  },
  {
    id: 2,
    name: "Samsung Galaxy S21",
    brand: "Samsung",
    price: 799,
    discountPrice: 699,
    image: "/images/products/samsung-s21.jpg",
    rating: 4.5,
    inStock: true,
    colors: ['black', 'white', 'purple']
  },
  {
    id: 3,
    name: "Google Pixel 6",
    brand: "Google",
    price: 599,
    image: "/images/products/pixel-6.jpg",
    rating: 4.6,
    inStock: false,
    colors: ['black', 'coral']
  },
  {
    id: 4,
    name: "OnePlus 9 Pro",
    brand: "OnePlus",
    price: 899,
    image: "/images/products/oneplus-9-pro.jpg",
    rating: 4.4,
    inStock: true,
    colors: ['black', 'green', 'silver']
  },
  {
    id: 5,
    name: "Xiaomi Mi 11",
    brand: "Xiaomi",
    price: 749,
    discountPrice: 699,
    image: "/images/products/xiaomi-mi11.jpg",
    rating: 4.3,
    inStock: true,
    colors: ['black', 'blue', 'white']
  },
  {
    id: 6,
    name: "iPhone 12",
    brand: "Apple",
    price: 799,
    image: "/images/products/iphone-12.jpg",
    rating: 4.7,
    inStock: true,
    colors: ['black', 'white', 'red', 'blue', 'green']
  }
];

// Computed properties
const filteredProducts = computed(() => {
  // In a real app, this would filter based on props.filterParams
  // For now, just return the mock data
  return products.value;
});

// Methods
const loadProducts = () => {
  loading.value = true;
  // Simulate API call
  setTimeout(() => {
    products.value = mockProducts;
    totalPages.value = 3; // Mock pagination
    loading.value = false;
  }, 500);
};

const handleSort = (sortOption: string) => {
  sortBy.value = sortOption;
  
  // Sort products based on the selected option
  if (sortOption === 'price-low-high') {
    products.value = [...products.value].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (sortOption === 'price-high-low') {
    products.value = [...products.value].sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (sortOption === 'newest') {
    // In a real app, this would sort by date
    products.value = [...mockProducts].reverse();
  } else {
    // Default: popular
    products.value = [...mockProducts];
  }
};

const handlePageChange = (newPage: number) => {
  page.value = newPage;
  loadProducts();
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  loadProducts();
});
</script>

<template>
  <div class="product-list">
    <div class="product-list__header">
      <h2 class="product-list__title" v-if="props.category">{{ props.category }}</h2>
      <h2 class="product-list__title" v-else>All Phones</h2>
      <ProductSort @sort="handleSort" :current="sortBy" />
    </div>
    
    <div class="product-list__container">
      <aside class="product-list__sidebar">
        <ProductFilter />
      </aside>
      
      <div class="product-list__content">
        <div v-if="loading" class="product-list__loading">
          <LoadingSpinner />
        </div>
        
        <div v-else-if="filteredProducts.length === 0" class="product-list__empty">
          <p>No products found matching your criteria.</p>
        </div>
        
        <div v-else class="product-list__grid">
          <ProductCard
            v-for="product in filteredProducts"
            :key="product.id"
            :id="product.id"
            :name="product.name"
            :price="product.price"
            :discountPrice="product.discountPrice"
            :image="product.image"
            :rating="product.rating"
            :inStock="product.inStock"
          />
        </div>
        
        <Pagination
          v-if="!loading && filteredProducts.length > 0"
          :currentPage="page"
          :totalPages="totalPages"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-list {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-md);
}

.product-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--gray-light);
}

.product-list__title {
  font-size: var(--font-size-xl);
  color: var(--text-dark);
  margin: 0;
}

.product-list__container {
  display: flex;
  gap: var(--space-lg);
}

.product-list__sidebar {
  flex: 0 0 250px;
}

.product-list__content {
  flex: 1;
}

.product-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-lg);
}

.product-list__loading,
.product-list__empty {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.product-list__empty {
  color: var(--gray-dark);
  font-size: var(--font-size-lg);
}

@media (max-width: 768px) {
  .product-list__container {
    flex-direction: column;
  }
  
  .product-list__sidebar {
    flex: 0 0 auto;
    width: 100%;
    margin-bottom: var(--space-lg);
  }
  
  .product-list__grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--space-md);
  }
}
</style>
