<template>
  <div class="product-list-view">
    <div class="product-list-container">
      <div class="filter-sidebar">
        <ProductFilter @filter-change="handleFilterChange" />
      </div>
      
      <div class="product-content">
        <div class="product-header">
          <h1>手机</h1>
          <Breadcrumb :items="breadcrumbItems" />
          
          <div class="product-controls">
            <div class="product-count">
              找到 <b>{{ filteredProducts.length }}</b> 个产品
            </div>
            
            <div class="product-sort">
              <ProductSort v-model="sortOption" />
            </div>
          </div>
        </div>
        
        <div class="product-grid" v-if="filteredProducts.length > 0">
          <ProductCard 
            v-for="product in paginatedProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
        
        <div class="empty-results" v-else>
          <svg class="empty-icon" viewBox="0 0 24 24">
            <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"></path>
          </svg>
          <h2>无匹配产品</h2>
          <p>请尝试调整筛选条件</p>
          <button class="btn-reset" @click="resetFilters">重置筛选</button>
        </div>
        
        <div class="pagination-container" v-if="totalPages > 1">
          <Pagination 
            v-model:currentPage="currentPage"
            v-model:pageSize="pageSize"
            :total="filteredProducts.length"
            @change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import ProductFilter from '@/components/products/ProductFilter.vue';
import ProductSort from '@/components/products/ProductSort.vue';
import ProductCard from '@/components/products/ProductCard.vue';
import Pagination from '@/components/common/Pagination.vue';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  rating: number;
  reviewCount: number;
  features: string[];
  storage: string;
  inStock: boolean;
}

// Mock product data
const products = ref<Product[]>([
  {
    id: '1',
    name: 'iPhone 14 Pro Max',
    price: 8999,
    originalPrice: 9999,
    image: '/images/products/iphone-1.jpg',
    brand: 'apple',
    rating: 4.8,
    reviewCount: 256,
    features: ['5g', 'face_id', 'wireless_charging', 'water_resistant'],
    storage: '128',
    inStock: true
  },
  {
    id: '2',
    name: 'Samsung Galaxy S22 Ultra',
    price: 7999,
    image: '/images/products/samsung-1.jpg',
    brand: 'samsung',
    rating: 4.7,
    reviewCount: 182,
    features: ['5g', 'fingerprint', 'wireless_charging', 'water_resistant'],
    storage: '256',
    inStock: true
  },
  {
    id: '3',
    name: 'Xiaomi 12 Pro',
    price: 4999,
    originalPrice: 5999,
    image: '/images/products/xiaomi-1.jpg',
    brand: 'xiaomi',
    rating: 4.5,
    reviewCount: 120,
    features: ['5g', 'fingerprint', 'wireless_charging'],
    storage: '128',
    inStock: true
  },
  {
    id: '4',
    name: 'Huawei P50 Pro',
    price: 6999,
    image: '/images/products/huawei-1.jpg',
    brand: 'huawei',
    rating: 4.6,
    reviewCount: 98,
    features: ['fingerprint', 'wireless_charging', 'water_resistant'],
    storage: '256',
    inStock: false
  },
  {
    id: '5',
    name: 'OPPO Find X5 Pro',
    price: 5999,
    originalPrice: 6599,
    image: '/images/products/oppo-1.jpg',
    brand: 'oppo',
    rating: 4.4,
    reviewCount: 87,
    features: ['5g', 'fingerprint', 'wireless_charging', 'water_resistant'],
    storage: '256',
    inStock: true
  },
  {
    id: '6',
    name: 'iPhone 13',
    price: 5999,
    image: '/images/products/iphone-2.jpg',
    brand: 'apple',
    rating: 4.7,
    reviewCount: 320,
    features: ['5g', 'face_id', 'water_resistant'],
    storage: '128',
    inStock: true
  },
  {
    id: '7',
    name: 'Samsung Galaxy A53',
    price: 2499,
    originalPrice: 2999,
    image: '/images/products/samsung-2.jpg',
    brand: 'samsung',
    rating: 4.3,
    reviewCount: 156,
    features: ['5g', 'fingerprint'],
    storage: '128',
    inStock: true
  },
  {
    id: '8',
    name: 'Xiaomi Redmi Note 11',
    price: 1299,
    image: '/images/products/xiaomi-2.jpg',
    brand: 'xiaomi',
    rating: 4.2,
    reviewCount: 203,
    features: ['fingerprint'],
    storage: '64',
    inStock: true
  }
]);

const route = useRoute();
const currentPage = ref(1);
const pageSize = ref(8);
const sortOption = ref('default');

interface Filters {
  brands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  storage: string[];
  features: string[];
}

const filters = ref<Filters>({
  brands: [],
  priceRange: {
    min: 0,
    max: 10000
  },
  storage: [],
  features: []
});

const breadcrumbItems = [
  { label: '首页', to: '/' },
  { label: '手机', to: '/products' }
];

// Apply filters to products
const filteredProducts = computed(() => {
  let result = [...products.value];
  
  // Filter by brands
  if (filters.value.brands.length > 0) {
    result = result.filter(product => filters.value.brands.includes(product.brand));
  }
  
  // Filter by price range
  result = result.filter(product => 
    product.price >= filters.value.priceRange.min && 
    product.price <= filters.value.priceRange.max
  );
  
  // Filter by storage
  if (filters.value.storage.length > 0) {
    result = result.filter(product => filters.value.storage.includes(product.storage));
  }
  
  // Filter by features
  if (filters.value.features.length > 0) {
    result = result.filter(product => {
      return filters.value.features.every(feature => product.features.includes(feature));
    });
  }
  
  // Apply sorting
  if (sortOption.value === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortOption.value === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortOption.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortOption.value === 'reviews') {
    result.sort((a, b) => b.reviewCount - a.reviewCount);
  }
  // Default sort is already applied (or no sort)
  
  return result;
});

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / pageSize.value);
});

// Get paginated products
const paginatedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredProducts.value.slice(startIndex, startIndex + pageSize.value);
});

const handleFilterChange = (newFilters: Filters) => {
  filters.value = newFilters;
  currentPage.value = 1; // Reset to first page when filters change
};

const handlePageChange = (data: { page: number, pageSize: number }) => {
  currentPage.value = data.page;
  pageSize.value = data.pageSize;
};

const resetFilters = () => {
  filters.value = {
    brands: [],
    priceRange: {
      min: 0,
      max: 10000
    },
    storage: [],
    features: []
  };
  currentPage.value = 1;
};

onMounted(() => {
  // Get filters from URL query parameters (in a real app)
  // ...
  
  // Set initial page from route query if exists
  const page = Number(route.query.page);
  if (!isNaN(page) && page > 0) {
    currentPage.value = page;
  }
});
</script>

<style scoped>
.product-list-view {
  min-height: 100vh;
  background-color: var(--gray-light);
  padding: var(--space-lg);
}

.product-list-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--space-lg);
}

.filter-sidebar {
  position: sticky;
  top: var(--space-lg);
  height: fit-content;
}

.product-header {
  margin-bottom: var(--space-lg);
}

.product-header h1 {
  margin: 0 0 var(--space-sm);
  color: var(--text-dark);
}

.product-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-md);
  padding: var(--space-md);
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.product-count {
  color: var(--gray-dark);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: var(--space-lg);
}

.empty-results {
  padding: var(--space-xl) 0;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  fill: var(--gray-medium);
  margin-bottom: var(--space-md);
}

.empty-results h2 {
  color: var(--text-dark);
  margin-bottom: var(--space-sm);
}

.empty-results p {
  color: var(--gray-dark);
  margin-bottom: var(--space-lg);
}

.btn-reset {
  padding: var(--space-sm) var(--space-lg);
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-reset:hover {
  background-color: var(--primary-blue-dark);
}

@media (max-width: 768px) {
  .product-list-container {
    grid-template-columns: 1fr;
  }
  
  .filter-sidebar {
    position: static;
    margin-bottom: var(--space-lg);
  }
  
  .product-controls {
    flex-direction: column;
    gap: var(--space-md);
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
