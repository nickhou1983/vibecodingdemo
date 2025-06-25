<template>
  <div class="product-card" @click="navigateToProduct">
    <div class="product-card__badge" v-if="badge">{{ badge }}</div>
    <div class="product-card__wishlist">
      <button 
        class="wishlist-btn" 
        @click.stop="toggleWishlist"
        :class="{ 'wishlist-btn--active': isInWishlist }"
      >
        ♥
      </button>
    </div>
    <div class="product-card__image">
      <img :src="product.image" :alt="product.name">
    </div>
    <div class="product-card__content">
      <h3 class="product-card__title">{{ product.name }}</h3>
      <div class="product-card__rating">
        <span class="stars">
          <span 
            v-for="i in 5" 
            :key="i" 
            :class="['star', { 'star--filled': i <= Math.round(product.rating) }]"
          >★</span>
        </span>
        <span class="rating-count">({{ product.reviewCount }})</span>
      </div>
      <div class="product-card__price">
        <span class="current-price">{{ formatCurrency(product.currentPrice) }}</span>
        <span class="original-price" v-if="product.originalPrice && product.originalPrice > product.currentPrice">
          {{ formatCurrency(product.originalPrice) }}
        </span>
        <span class="discount-percentage" v-if="product.originalPrice && product.originalPrice > product.currentPrice">
          -{{ Math.round((1 - product.currentPrice / product.originalPrice) * 100) }}%
        </span>
      </div>
      <div class="product-card__features">
        <ul class="features-list">
          <li v-for="(feature, index) in limitedFeatures" :key="index">{{ feature }}</li>
        </ul>
      </div>
    </div>
    <div class="product-card__actions">
      <Button 
        variant="primary" 
        class="add-to-cart-btn" 
        @click.stop="addToCart"
        :loading="isAddingToCart"
      >
        Add to Cart
      </Button>
      <Button 
        variant="outline" 
        class="compare-btn" 
        @click.stop="toggleCompare"
        :class="{ 'compare-btn--active': isInCompareList }"
      >
        Compare
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/common/Button.vue';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlist';
import { useCompareStore } from '@/stores/compare';

// Props
interface ProductProps {
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
  };
  badge?: string;
}

const props = defineProps<ProductProps>();

// Store 
const cartStore = useCartStore();
const wishlistStore = useWishlistStore();
const compareStore = useCompareStore();
const router = useRouter();

// State
const isAddingToCart = ref(false);

// Computed
const limitedFeatures = computed(() => {
  return props.product.features.slice(0, 3);
});

const isInWishlist = computed(() => {
  return wishlistStore.isInWishlist(props.product.id);
});

const isInCompareList = computed(() => {
  return compareStore.isInCompareList(props.product.id);
});

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const navigateToProduct = () => {
  router.push(`/product/${props.product.slug}`);
};

const addToCart = async () => {
  isAddingToCart.value = true;
  try {
    await cartStore.addItem(props.product.id);
    // Optional: Show a success notification
  } catch (error) {
    // Optional: Show an error notification
    console.error('Failed to add item to cart:', error);
  } finally {
    isAddingToCart.value = false;
  }
};

const toggleWishlist = () => {
  if (isInWishlist.value) {
    wishlistStore.removeFromWishlist(props.product.id);
  } else {
    wishlistStore.addToWishlist(props.product.id);
  }
};

const toggleCompare = () => {
  if (isInCompareList.value) {
    compareStore.removeFromCompare(props.product.id);
  } else {
    compareStore.addToCompare(props.product.id);
  }
};
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.product-card__badge {
  position: absolute;
  top: var(--space-sm);
  left: var(--space-sm);
  background-color: var(--accent-blue);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: bold;
  text-transform: uppercase;
  z-index: 2;
}

.product-card__wishlist {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  z-index: 2;
}

.wishlist-btn {
  background: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  color: var(--gray-medium);
  transition: all var(--transition-normal);
  font-size: 18px;
}

.wishlist-btn:hover {
  transform: scale(1.1);
}

.wishlist-btn--active {
  color: var(--error);
}

.product-card__image {
  padding: var(--space-md);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.product-card__image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-card__content {
  padding: 0 var(--space-md);
  flex-grow: 1;
}

.product-card__title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-xs);
  color: var(--text-dark);
  font-weight: 500;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-card__rating {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-sm);
  color: var(--gray-dark);
}

.stars {
  display: flex;
  color: var(--gray-medium);
}

.star {
  margin-right: 2px;
}

.star--filled {
  color: var(--warning);
}

.rating-count {
  font-size: var(--font-size-sm);
  margin-left: var(--space-xs);
}

.product-card__price {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-sm);
}

.current-price {
  font-size: var(--font-size-xl);
  font-weight: bold;
  color: var(--primary-blue-dark);
  margin-right: var(--space-sm);
}

.original-price {
  font-size: var(--font-size-md);
  text-decoration: line-through;
  color: var(--gray-medium);
  margin-right: var(--space-sm);
}

.discount-percentage {
  background-color: var(--success);
  color: white;
  padding: 2px 6px;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: bold;
}

.product-card__features {
  margin-bottom: var(--space-md);
}

.features-list {
  padding-left: var(--space-lg);
  margin: var(--space-xs) 0;
  font-size: var(--font-size-sm);
  color: var(--gray-dark);
}

.features-list li {
  margin-bottom: var(--space-xs);
}

.product-card__actions {
  padding: var(--space-md);
  display: flex;
  gap: var(--space-sm);
}

.add-to-cart-btn {
  flex: 1;
}

.compare-btn {
  width: 40%;
}

.compare-btn--active {
  background-color: var(--light-blue);
}

@media (max-width: 768px) {
  .product-card__actions {
    flex-direction: column;
  }
  
  .compare-btn {
    width: 100%;
  }
}
</style>
