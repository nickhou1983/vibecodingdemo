<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
  productCount?: number;
}

const props = defineProps({
  showCount: {
    type: Boolean,
    default: true
  },
  maxCategories: {
    type: Number,
    default: 6
  },
  type: {
    type: String,
    default: 'grid' // 'grid' or 'list'
  }
});

const router = useRouter();
const categories = ref<Category[]>([]);
const loading = ref(true);

// Mock data
const mockCategories = [
  {
    id: 1,
    name: "Apple",
    image: "/images/brands/apple.png",
    slug: "apple",
    productCount: 24
  },
  {
    id: 2,
    name: "Samsung",
    image: "/images/brands/samsung.png",
    slug: "samsung",
    productCount: 32
  },
  {
    id: 3,
    name: "Google",
    image: "/images/brands/google.png",
    slug: "google",
    productCount: 8
  },
  {
    id: 4,
    name: "Xiaomi",
    image: "/images/brands/xiaomi.png",
    slug: "xiaomi",
    productCount: 19
  },
  {
    id: 5,
    name: "OnePlus",
    image: "/images/brands/oneplus.png",
    slug: "oneplus",
    productCount: 12
  },
  {
    id: 6,
    name: "Huawei",
    image: "/images/brands/huawei.png",
    slug: "huawei",
    productCount: 15
  },
  {
    id: 7,
    name: "Sony",
    image: "/images/brands/sony.png",
    slug: "sony",
    productCount: 6
  },
  {
    id: 8,
    name: "Other",
    image: "/images/brands/other.png",
    slug: "other",
    productCount: 20
  }
];

const loadCategories = () => {
  loading.value = true;
  // Simulate API call
  setTimeout(() => {
    categories.value = mockCategories.slice(0, props.maxCategories);
    loading.value = false;
  }, 300);
};

const navigateToCategory = (slug: string) => {
  router.push(`/products/category/${slug}`);
};

onMounted(() => {
  loadCategories();
});
</script>

<template>
  <div class="category-list" :class="`category-list--${props.type}`">
    <div v-if="loading" class="category-list__loading">
      <div class="loading-indicator"></div>
    </div>
    
    <div v-else class="category-list__container">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="category-item"
        @click="navigateToCategory(category.slug)"
      >
        <div class="category-item__image-container">
          <img 
            :src="category.image" 
            :alt="`${category.name} category`"
            class="category-item__image"
          />
        </div>
        <div class="category-item__content">
          <h3 class="category-item__name">{{ category.name }}</h3>
          <p v-if="props.showCount" class="category-item__count">
            {{ category.productCount }} products
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-list {
  margin: var(--space-lg) 0;
}

.category-list__container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.category-list--grid .category-list__container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.category-list--list .category-list__container {
  flex-direction: column;
}

.category-item {
  background-color: white;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  cursor: pointer;
}

.category-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.category-list--grid .category-item {
  display: flex;
  flex-direction: column;
}

.category-list--list .category-item {
  display: flex;
  align-items: center;
  padding: var(--space-sm);
}

.category-item__image-container {
  padding: var(--space-md);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--light-blue);
}

.category-list--grid .category-item__image-container {
  height: 140px;
}

.category-list--list .category-item__image-container {
  width: 80px;
  height: 80px;
}

.category-item__image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.category-item__content {
  padding: var(--space-md);
  text-align: center;
}

.category-list--list .category-item__content {
  text-align: left;
  flex: 1;
}

.category-item__name {
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--text-dark);
}

.category-item__count {
  margin: var(--space-xs) 0 0;
  font-size: var(--font-size-sm);
  color: var(--gray-medium);
}

.category-list__loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.loading-indicator {
  width: 40px;
  height: 40px;
  border: 4px solid var(--light-blue);
  border-top: 4px solid var(--primary-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .category-list--grid .category-list__container {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .category-list--grid .category-item__image-container {
    height: 100px;
  }
  
  .category-item__name {
    font-size: var(--font-size-sm);
  }
  
  .category-item__count {
    font-size: var(--font-size-xs);
  }
}
</style>
