<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface ProductSpec {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  specs: {
    display: string;
    processor: string;
    ram: string;
    storage: string;
    camera: string;
    battery: string;
    os: string;
    [key: string]: string;
  };
}

const props = defineProps({
  productIds: {
    type: Array as () => (string | number)[],
    default: () => []
  },
  highlightDifferences: {
    type: Boolean,
    default: true
  }
});

const products = ref<ProductSpec[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Mock data for demonstration
const mockProducts = {
  'iphone-13-pro': {
    id: 'iphone-13-pro',
    name: 'iPhone 13 Pro',
    brand: 'Apple',
    image: '/images/products/iphone-13-pro.jpg',
    price: 999,
    specs: {
      display: '6.1" Super Retina XDR OLED',
      processor: 'A15 Bionic',
      ram: '6GB',
      storage: '128GB/256GB/512GB/1TB',
      camera: 'Triple 12MP',
      battery: '3095 mAh',
      os: 'iOS 15',
      network: '5G',
      dimensions: '146.7 x 71.5 x 7.7 mm',
      weight: '204g',
      colors: 'Graphite, Gold, Silver, Sierra Blue',
      waterResistance: 'IP68',
      sensors: 'Face ID, Proximity, Gyro, Accelerometer'
    }
  },
  'galaxy-s21': {
    id: 'galaxy-s21',
    name: 'Samsung Galaxy S21',
    brand: 'Samsung',
    image: '/images/products/samsung-s21.jpg',
    price: 799,
    specs: {
      display: '6.2" Dynamic AMOLED 2X',
      processor: 'Exynos 2100',
      ram: '8GB',
      storage: '128GB/256GB',
      camera: 'Triple 12MP + 12MP + 64MP',
      battery: '4000 mAh',
      os: 'Android 11, One UI 3.1',
      network: '5G',
      dimensions: '151.7 x 71.2 x 7.9 mm',
      weight: '169g',
      colors: 'Phantom Gray, Phantom White, Phantom Pink, Phantom Violet',
      waterResistance: 'IP68',
      sensors: 'Fingerprint, Proximity, Gyro, Accelerometer'
    }
  },
  'pixel-6': {
    id: 'pixel-6',
    name: 'Google Pixel 6',
    brand: 'Google',
    image: '/images/products/pixel-6.jpg',
    price: 599,
    specs: {
      display: '6.4" AMOLED',
      processor: 'Google Tensor',
      ram: '8GB',
      storage: '128GB/256GB',
      camera: 'Dual 50MP + 12MP',
      battery: '4614 mAh',
      os: 'Android 12',
      network: '5G',
      dimensions: '158.6 x 74.8 x 8.9 mm',
      weight: '207g',
      colors: 'Stormy Black, Sorta Seafoam, Kinda Coral',
      waterResistance: 'IP68',
      sensors: 'Fingerprint, Proximity, Gyro, Accelerometer'
    }
  }
};

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const fetchedProducts: ProductSpec[] = [];
    
    props.productIds.forEach(id => {
      const productId = String(id);
      if (mockProducts[productId as keyof typeof mockProducts]) {
        fetchedProducts.push(mockProducts[productId as keyof typeof mockProducts]);
      }
    });
    
    if (fetchedProducts.length === 0) {
      error.value = 'No products found for comparison';
    }
    
    products.value = fetchedProducts;
  } catch (err) {
    error.value = 'Failed to load product comparison data';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const specCategories = computed(() => {
  const allSpecs = new Set<string>();
  
  // Collect all spec categories from all products
  products.value.forEach(product => {
    Object.keys(product.specs).forEach(key => allSpecs.add(key));
  });
  
  return Array.from(allSpecs);
});

// Check if a specific spec value is different across products
const isDifferent = (specKey: string): boolean => {
  if (!props.highlightDifferences || products.value.length <= 1) {
    return false;
  }
  
  const firstValue = products.value[0].specs[specKey];
  return products.value.some(product => product.specs[specKey] !== firstValue);
};

// Format spec key to a more readable form
const formatSpecKey = (key: string): string => {
  return key
    .split(/(?=[A-Z])/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="comparison-chart">
    <h2 class="comparison-chart__title">Product Comparison</h2>
    
    <div v-if="loading" class="comparison-chart__loading">
      <div class="loading-indicator"></div>
      <p>Loading comparison data...</p>
    </div>
    
    <div v-else-if="error" class="comparison-chart__error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="products.length === 0" class="comparison-chart__empty">
      <p>Please select products to compare.</p>
    </div>
    
    <div v-else class="comparison-chart__table-container">
      <table class="comparison-chart__table">
        <thead>
          <tr>
            <th class="spec-category">Specification</th>
            <th v-for="product in products" :key="product.id" class="product-column">
              <div class="product-header">
                <img :src="product.image" :alt="product.name" class="product-image" />
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-price">${{ product.price }}</p>
              </div>
            </th>
          </tr>
        </thead>
        
        <tbody>
          <tr v-for="spec in specCategories" :key="spec" :class="{ 'highlight-row': isDifferent(spec) }">
            <td class="spec-category">{{ formatSpecKey(spec) }}</td>
            <td 
              v-for="product in products" 
              :key="`${product.id}-${spec}`"
              class="spec-value"
              :class="{ 'highlight-cell': isDifferent(spec) }"
            >
              {{ product.specs[spec] || 'N/A' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.comparison-chart {
  margin: var(--space-lg) 0;
}

.comparison-chart__title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-lg);
  color: var(--text-dark);
  text-align: center;
}

.comparison-chart__loading,
.comparison-chart__error,
.comparison-chart__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  text-align: center;
  color: var(--gray-dark);
}

.loading-indicator {
  width: 40px;
  height: 40px;
  border: 4px solid var(--light-blue);
  border-top: 4px solid var(--primary-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--space-md);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.comparison-chart__table-container {
  overflow-x: auto;
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-md);
}

.comparison-chart__table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

.spec-category {
  font-weight: 600;
  text-align: left;
  padding: var(--space-md);
  min-width: 150px;
  background-color: var(--gray-light);
  color: var(--text-dark);
}

.product-column {
  min-width: 200px;
}

.product-header {
  padding: var(--space-md);
  border-bottom: 1px solid var(--gray-light);
  text-align: center;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: var(--space-sm);
}

.product-name {
  font-size: var(--font-size-md);
  margin: 0;
  margin-bottom: var(--space-xs);
  color: var(--primary-blue);
}

.product-price {
  font-weight: bold;
  margin: 0;
  color: var(--text-dark);
}

.spec-value {
  padding: var(--space-md);
  text-align: center;
  border-bottom: 1px solid var(--gray-light);
  color: var(--text-dark);
}

.highlight-row {
  background-color: var(--light-blue);
}

.highlight-cell {
  font-weight: 600;
  color: var(--primary-blue);
}

tr:hover {
  background-color: rgba(100, 181, 246, 0.1);
}

@media (max-width: 768px) {
  .product-column {
    min-width: 150px;
  }
  
  .spec-category,
  .spec-value {
    padding: var(--space-sm);
    font-size: var(--font-size-sm);
  }
  
  .product-name {
    font-size: var(--font-size-sm);
  }
}
</style>
