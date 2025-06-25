<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ProductCard from '../products/ProductCard.vue';

interface WishlistItem {
  id: string;
  product: {
    id: string | number;
    name: string;
    image: string;
    currentPrice: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    features: string[];
    slug: string;
    inStock: boolean;
  };
  dateAdded: string;
}

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['add-to-cart', 'remove-from-wishlist']);

const wishlistItems = ref<WishlistItem[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const sortOption = ref('date-desc');

// Mock data
const mockWishlist: WishlistItem[] = [
  {
    id: 'wish1',
    product: {
      id: 1,
      name: 'iPhone 13 Pro',
      image: '/images/products/iphone-13-pro.jpg',
      currentPrice: 999,
      rating: 4.8,
      reviewCount: 245,
      features: ['A15 Bionic Chip', 'Pro Camera System', 'Super Retina XDR'],
      slug: 'iphone-13-pro',
      inStock: true
    },
    dateAdded: '2023-11-20T15:30:00Z'
  },
  {
    id: 'wish2',
    product: {
      id: 2,
      name: 'Samsung Galaxy S21',
      image: '/images/products/samsung-s21.jpg',
      currentPrice: 699,
      originalPrice: 799,
      rating: 4.5,
      reviewCount: 189,
      features: ['Exynos 2100', 'Triple Camera', '120Hz Display'],
      slug: 'samsung-s21',
      inStock: true
    },
    dateAdded: '2023-11-15T10:45:00Z'
  },
  {
    id: 'wish3',
    product: {
      id: 3,
      name: 'Google Pixel 6',
      image: '/images/products/pixel-6.jpg',
      currentPrice: 599,
      rating: 4.6,
      reviewCount: 112,
      features: ['Google Tensor', 'Night Sight', 'Magic Eraser'],
      slug: 'pixel-6',
      inStock: false
    },
    dateAdded: '2023-12-01T09:20:00Z'
  }
];

const fetchWishlist = () => {
  loading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    try {
      wishlistItems.value = mockWishlist;
    } catch (err) {
      error.value = 'Failed to load wishlist';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }, 500);
};

const sortedWishlist = computed(() => {
  const items = [...wishlistItems.value];
  
  switch (sortOption.value) {
    case 'date-desc':
      return items.sort((a, b) => 
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
    case 'date-asc':
      return items.sort((a, b) => 
        new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
      );
    case 'price-asc':
      return items.sort((a, b) => a.product.currentPrice - b.product.currentPrice);
    case 'price-desc':
      return items.sort((a, b) => b.product.currentPrice - a.product.currentPrice);
    case 'name':
      return items.sort((a, b) => a.product.name.localeCompare(b.product.name));
    default:
      return items;
  }
});

const handleSort = (option: string) => {
  sortOption.value = option;
};

const addToCart = (productId: string | number) => {
  emit('add-to-cart', productId);
};

const removeFromWishlist = (wishlistItemId: string) => {
  emit('remove-from-wishlist', wishlistItemId);
};

onMounted(() => {
  fetchWishlist();
});
</script>

<template>
  <div class="wishlist">
    <div class="wishlist__header">
      <h2 class="wishlist__title">Your Wishlist</h2>
      
      <div v-if="wishlistItems.length > 0" class="wishlist__controls">
        <label for="sort-select">Sort by:</label>
        <select 
          id="sort-select" 
          class="wishlist__sort" 
          v-model="sortOption"
          @change="handleSort(sortOption)"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name</option>
        </select>
      </div>
    </div>
    
    <div v-if="loading" class="wishlist__loading">
      <div class="loading-indicator"></div>
      <p>Loading wishlist...</p>
    </div>
    
    <div v-else-if="error" class="wishlist__error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="wishlistItems.length === 0" class="wishlist__empty">
      <div class="empty-state">
        <div class="empty-icon">❤️</div>
        <h3>Your wishlist is empty</h3>
        <p>Items you save to your wishlist will appear here.</p>
        <button class="btn btn-primary" @click="$router.push('/')">
          Start Shopping
        </button>
      </div>
    </div>
    
    <div v-else class="wishlist__grid">
      <div 
        v-for="item in sortedWishlist" 
        :key="item.id"
        class="wishlist-item"
      >
        <ProductCard :product="item.product" />
        
        <div class="wishlist-item__actions">
          <button 
            class="btn btn-primary"
            @click="addToCart(item.product.id)"
            :disabled="!item.product.inStock"
          >
            {{ item.product.inStock ? 'Add to Cart' : 'Out of Stock' }}
          </button>
          
          <button 
            class="btn btn-secondary"
            @click="removeFromWishlist(item.id)"
          >
            Remove
          </button>
        </div>
        
        <div class="wishlist-item__date">
          Added {{ new Date(item.dateAdded).toLocaleDateString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wishlist {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.wishlist__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.wishlist__title {
  font-size: var(--font-size-xl);
  color: var(--text-dark);
  margin: 0;
}

.wishlist__controls {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.wishlist__sort {
  padding: var(--space-sm);
  border: 1px solid var(--gray-medium);
  border-radius: var(--border-radius-sm);
  background-color: white;
  color: var(--text-dark);
  font-size: var(--font-size-md);
}

.wishlist__loading,
.wishlist__error,
.wishlist__empty {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-xl);
}

.loading-indicator {
  width: 40px;
  height: 40px;
  border: 4px solid var(--light-blue);
  border-top: 4px solid var(--primary-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: var(--space-md);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: var(--space-xl);
  max-width: 400px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--space-md);
}

.empty-state h3 {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-sm);
  color: var(--text-dark);
}

.empty-state p {
  margin-bottom: var(--space-lg);
  color: var(--gray-dark);
}

.wishlist__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-lg);
}

.wishlist-item {
  display: flex;
  flex-direction: column;
}

.wishlist-item__actions {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-md);
}

.wishlist-item__date {
  font-size: var(--font-size-sm);
  color: var(--gray-dark);
  margin-top: var(--space-sm);
  text-align: center;
}

.btn {
  flex: 1;
  padding: var(--space-sm);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  text-align: center;
}

.btn:disabled {
  background-color: var(--gray-light);
  color: var(--gray-medium);
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--primary-blue);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-blue-dark);
}

.btn-secondary {
  background-color: var(--light-blue);
  color: var(--primary-blue);
}

.btn-secondary:hover {
  background-color: var(--primary-blue-light);
}

@media (max-width: 768px) {
  .wishlist__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }
  
  .wishlist__grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: var(--space-md);
  }
  
  .wishlist-item__actions {
    flex-direction: column;
    gap: var(--space-sm);
  }
}
</style>
