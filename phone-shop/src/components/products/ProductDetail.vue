<template>
  <div class="product-detail" v-if="product">
    <Breadcrumb :items="breadcrumbItems" class="product-breadcrumb" />
    
    <div class="product-main">
      <div class="product-gallery-container">
        <ProductGallery :images="product.images" />
      </div>
      
      <div class="product-info">
        <div class="product-header">
          <h1 class="product-title">{{ product.name }}</h1>
          <div class="product-meta">
            <div class="product-rating">
              <StarRating :modelValue="product.rating" :readonly="true" :showValue="true" />
              <span class="review-count">({{ product.reviewCount }} 条评价)</span>
            </div>
            <div class="product-sku">型号: {{ product.sku }}</div>
          </div>
        </div>
        
        <div class="product-price">
          <span class="current-price">¥{{ formatPrice(product.price) }}</span>
          <span class="original-price" v-if="product.originalPrice">¥{{ formatPrice(product.originalPrice) }}</span>
          <PromotionTag v-if="isOnSale" text="促销" />
        </div>
        
        <div class="product-options">
          <div class="option-section">
            <h3>颜色</h3>
            <ColorSelector 
              :colors="product.colors"
              v-model="selectedColor"
            />
          </div>
          
          <div class="option-section">
            <h3>存储容量</h3>
            <StorageSelector 
              :options="product.storage"
              v-model="selectedStorage"
            />
          </div>
        </div>
        
        <div class="product-actions">
          <div class="quantity-wrapper">
            <QuantitySelector v-model="quantity" :max="product.stock" />
          </div>
          
          <AddToCartButton 
            :product-id="product.id"
            :variant-id="currentVariantId"
            :quantity="quantity"
            @added-to-cart="onAddedToCart"
          />
          
          <button class="btn-wishlist" @click="toggleWishlist">
            <span class="wishlist-icon" :class="{ active: isInWishlist }">❤</span>
            <span>{{ isInWishlist ? '已收藏' : '收藏' }}</span>
          </button>
        </div>
        
        <div class="product-stock" :class="{ 'low-stock': product.stock < 10 }">
          <span v-if="product.stock > 0">库存: {{ product.stock }} 件</span>
          <span v-else class="out-of-stock">暂时缺货</span>
        </div>
      </div>
    </div>
    
    <div class="product-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div class="product-content">
      <div v-if="activeTab === 'description'" class="tab-content">
        <ProductDescription :content="product.description" />
      </div>
      
      <div v-if="activeTab === 'specifications'" class="tab-content">
        <ProductSpecifications :specifications="product.specifications" />
      </div>
      
      <div v-if="activeTab === 'reviews'" class="tab-content">
        <ProductReviews :product-id="product.id" />
      </div>
    </div>
    
    <div class="related-products">
      <h2>相关推荐</h2>
      <RelatedProducts :product-id="product.id" />
    </div>
  </div>
  
  <div v-else class="loading-state">
    <LoadingSpinner size="large" text="加载商品信息..." />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Breadcrumb from '@/components/layout/Breadcrumb.vue';
import ProductGallery from '@/components/products/ProductGallery.vue';
import StarRating from '@/components/common/StarRating.vue';
import PromotionTag from '@/components/checkout/PromotionTag.vue';
import ColorSelector from '@/components/products/ColorSelector.vue';
import StorageSelector from '@/components/products/StorageSelector.vue';
import QuantitySelector from '@/components/common/QuantitySelector.vue';
import AddToCartButton from '@/components/products/AddToCartButton.vue';
import ProductDescription from '@/components/products/ProductDescription.vue';
import ProductSpecifications from '@/components/products/ProductSpecifications.vue';
import ProductReviews from '@/components/products/ProductReviews.vue';
import RelatedProducts from '@/components/products/RelatedProducts.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

// Mock product data (in a real app this would come from an API)
const product = ref({
  id: '1',
  name: 'iPhone 14 Pro Max',
  sku: 'IP14PM-128GB',
  price: 8999,
  originalPrice: 9999,
  rating: 4.8,
  reviewCount: 256,
  stock: 42,
  description: '<p>iPhone 14 Pro Max 采用创新的灵动岛设计，取代了传统的刘海屏幕。搭载 A16 仿生芯片，性能强劲。配备 4800 万像素主摄，支持 4K 电影模式视频拍摄。支持车祸检测功能，在紧急情况下可自动拨打救援电话。</p>',
  specifications: [
    { name: '屏幕', value: '6.7 英寸 Super Retina XDR 显示屏' },
    { name: '处理器', value: 'A16 仿生芯片' },
    { name: '摄像头', value: '4800 万像素主摄 + 1200 万像素超广角 + 1200 万像素长焦' },
    { name: '电池', value: '4323 mAh' },
    { name: '操作系统', value: 'iOS 16' },
    { name: '防水等级', value: 'IP68' }
  ],
  colors: [
    { id: 'purple', name: '暗紫色', hex: '#735a78' },
    { id: 'gold', name: '金色', hex: '#f9e5c9' },
    { id: 'silver', name: '银色', hex: '#f5f5f0' },
    { id: 'black', name: '深空黑色', hex: '#505050' }
  ],
  storage: [
    { id: '128', name: '128GB', price: 8999 },
    { id: '256', name: '256GB', price: 9999 },
    { id: '512', name: '512GB', price: 11999 },
    { id: '1024', name: '1TB', price: 13999 }
  ],
  images: [
    { id: '1', src: '/images/products/iphone-1.jpg', alt: 'iPhone 14 Pro Max 正面' },
    { id: '2', src: '/images/products/iphone-2.jpg', alt: 'iPhone 14 Pro Max 背面' },
    { id: '3', src: '/images/products/iphone-3.jpg', alt: 'iPhone 14 Pro Max 侧面' }
  ]
});

const route = useRoute();
const selectedColor = ref(product.value.colors[0].id);
const selectedStorage = ref(product.value.storage[0].id);
const quantity = ref(1);
const isInWishlist = ref(false);
const activeTab = ref('description');

const tabs = [
  { id: 'description', label: '商品描述' },
  { id: 'specifications', label: '规格参数' },
  { id: 'reviews', label: '用户评价' }
];

const breadcrumbItems = [
  { label: '首页', to: '/' },
  { label: '手机', to: '/products/phones' },
  { label: 'iPhone', to: '/products/phones/iphone' },
  { label: product.value.name, to: '' }
];

const isOnSale = computed(() => {
  return product.value.originalPrice && product.value.originalPrice > product.value.price;
});

const currentVariantId = computed(() => {
  return `${product.value.id}-${selectedColor.value}-${selectedStorage.value}`;
});

// Get price based on selected storage
const currentPrice = computed(() => {
  const selectedStorageOption = product.value.storage.find(s => s.id === selectedStorage.value);
  return selectedStorageOption ? selectedStorageOption.price : product.value.price;
});

onMounted(async () => {
  const productId = route.params.id;
  
  if (productId) {
    // In a real app, we would fetch the product data from the API
    // await fetchProductData(productId);
    
    // Check if product is in wishlist
    // isInWishlist.value = await checkWishlistStatus(productId);
  }
});

const formatPrice = (price: number) => {
  return price.toLocaleString('zh-CN');
};

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value;
  // In a real app, we would call the API to add/remove the product from wishlist
};

const onAddedToCart = () => {
  // Show notification or perform any actions after adding to cart
  console.log('Added to cart', {
    productId: product.value.id,
    colorId: selectedColor.value,
    storageId: selectedStorage.value,
    quantity: quantity.value
  });
};
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-lg);
}

.product-breadcrumb {
  margin-bottom: var(--space-lg);
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.product-gallery-container {
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.product-header {
  margin-bottom: var(--space-lg);
}

.product-title {
  font-size: var(--font-size-xxl);
  color: var(--text-dark);
  margin: 0 0 var(--space-md);
}

.product-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  align-items: center;
  color: var(--gray-dark);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.review-count {
  font-size: var(--font-size-sm);
  color: var(--gray-medium);
}

.product-sku {
  font-size: var(--font-size-sm);
}

.product-price {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.current-price {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--primary-blue);
}

.original-price {
  font-size: var(--font-size-md);
  color: var(--gray-medium);
  text-decoration: line-through;
}

.option-section {
  margin-bottom: var(--space-lg);
}

.option-section h3 {
  margin: 0 0 var(--space-sm);
  font-size: var(--font-size-md);
  color: var(--text-dark);
}

.product-actions {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.quantity-wrapper {
  width: 120px;
}

.btn-wishlist {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--gray-medium);
  border-radius: var(--border-radius-sm);
  background-color: white;
  color: var(--text-dark);
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-wishlist:hover {
  border-color: var(--primary-blue);
  color: var(--primary-blue);
}

.wishlist-icon {
  font-size: var(--font-size-md);
  color: var(--gray-medium);
  transition: var(--transition-fast);
}

.wishlist-icon.active {
  color: var(--error);
}

.product-stock {
  padding: var(--space-sm) var(--space-md);
  background-color: var(--gray-light);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  display: inline-block;
}

.low-stock {
  color: var(--warning);
}

.out-of-stock {
  color: var(--error);
}

.product-tabs {
  display: flex;
  border-bottom: 1px solid var(--gray-light);
  margin-bottom: var(--space-lg);
}

.tab-button {
  padding: var(--space-md) var(--space-lg);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  color: var(--gray-dark);
  cursor: pointer;
  transition: var(--transition-fast);
}

.tab-button.active {
  color: var(--primary-blue);
  border-bottom-color: var(--primary-blue);
}

.tab-button:hover:not(.active) {
  color: var(--text-dark);
  background-color: var(--gray-light);
}

.tab-content {
  margin-bottom: var(--space-xl);
}

.related-products h2 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-lg);
  color: var(--text-dark);
}

.loading-state {
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .product-main {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
  
  .product-actions {
    flex-wrap: wrap;
  }
  
  .quantity-wrapper {
    width: 100%;
  }
}
</style>
