<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/common/Button.vue';
import ProductCard from '@/components/products/ProductCard.vue';
import { PromotionalBanner, FeatureHighlight, MarketingSection } from '@/components/marketing';

// Router
const router = useRouter();

// Refs
const productsSection = ref<HTMLElement | null>(null);
const email = ref('');
const isSubscribing = ref(false);

// Mock Data (In a real app, this would come from API/store)
const categories = [
  { id: 1, name: 'Smartphones', slug: 'smartphones', icon: '📱', count: 120, color: '#e3f2fd' },
  { id: 2, name: 'Accessories', slug: 'accessories', icon: '🎧', count: 85, color: '#e8f5e9' },
  { id: 3, name: 'Tablets', slug: 'tablets', icon: '💻', count: 42, color: '#fff3e0' },
  { id: 4, name: 'Wearables', slug: 'wearables', icon: '⌚', count: 36, color: '#f3e5f5' }
];

const brands = [
  { id: 1, name: 'Apple', slug: 'apple', logo: '/images/brands/apple.png' },
  { id: 2, name: 'Samsung', slug: 'samsung', logo: '/images/brands/samsung.png' },
  { id: 3, name: 'Google', slug: 'google', logo: '/images/brands/google.png' },
  { id: 4, name: 'Xiaomi', slug: 'xiaomi', logo: '/images/brands/xiaomi.png' },
  { id: 5, name: 'OnePlus', slug: 'oneplus', logo: '/images/brands/oneplus.png' }
];

const featuredProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    image: '/images/products/iphone-15-pro.png',
    currentPrice: 999,
    originalPrice: 1099,
    rating: 4.8,
    reviewCount: 245,
    features: ['A17 Pro chip', '48MP camera', 'Titanium design'],
    badge: 'New'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S23 Ultra',
    slug: 'samsung-galaxy-s23-ultra',
    image: '/images/products/galaxy-s23-ultra.png',
    currentPrice: 1199,
    originalPrice: 1299,
    rating: 4.7,
    reviewCount: 189,
    features: ['200MP camera', 'Snapdragon 8 Gen 2', '6.8" Dynamic AMOLED']
  },
  {
    id: 3,
    name: 'Google Pixel 8 Pro',
    slug: 'google-pixel-8-pro',
    image: '/images/products/pixel-8-pro.png',
    currentPrice: 899,
    originalPrice: 999,
    rating: 4.6,
    reviewCount: 156,
    features: ['Tensor G3', '50MP triple camera', '6.7" OLED display'],
    badge: 'Hot'
  },
  {
    id: 4,
    name: 'OnePlus 11',
    slug: 'oneplus-11',
    image: '/images/products/oneplus-11.png',
    currentPrice: 699,
    originalPrice: null,
    rating: 4.5,
    reviewCount: 128,
    features: ['Snapdragon 8 Gen 2', 'Hasselblad camera', '100W fast charging']
  }
];

const customerReviews = [
  {
    id: 1,
    name: 'John Smith',
    avatar: null,
    rating: 5,
    comment: 'Amazing service and super fast delivery! The phone was exactly as described and arrived in perfect condition.',
    date: new Date('2023-10-15')
  },
  {
    id: 2,
    name: 'Emily Johnson',
    avatar: null, /* placeholder: removed image reference */
    rating: 4,
    comment: 'Great selection of phones at competitive prices. Customer service was very helpful when I had questions.',
    date: new Date('2023-09-28')
  },
  {
    id: 3,
    name: 'Michael Brown',
    avatar: null,
    rating: 5,
    comment: "Second time ordering from this store and I'm still impressed. Their warranty service is excellent.",
    date: new Date('2023-11-02')
  }
];

// Methods
const navigateToCategory = (slug: string) => {
  router.push(`/category/${slug}`);
};

const navigateToBrand = (slug: string) => {
  router.push(`/brand/${slug}`);
};

const navigateToProducts = () => {
  router.push('/products');
};

const navigateToDeals = () => {
  router.push('/deals');
};

const scrollToProducts = () => {
  productsSection.value?.scrollIntoView({ behavior: 'smooth' });
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const subscribeToNewsletter = async () => {
  if (!email.value) return;
  
  isSubscribing.value = true;
  
  try {
    // In a real app, you'd call an API endpoint
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Success handling
    email.value = '';
    alert('Thank you for subscribing!');
  } catch (error) {
    // Error handling
    console.error('Failed to subscribe:', error);
    alert('Failed to subscribe. Please try again.');
  } finally {
    isSubscribing.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  // Any initialization code can go here
});
</script>

<template>
  <div class="home-view">
    <!-- Banner Carousel -->
    <section class="banner">
      <div class="container">
        <div class="banner__carousel">
          <div class="banner__image-placeholder"></div>
          <div class="banner__content">
            <h1 class="banner__title">Discover the Latest Smartphones</h1>
            <p class="banner__subtitle">Premium phones at unbeatable prices</p>
            <Button variant="primary" class="banner__button" @click="scrollToProducts">
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Categories -->
    <section class="categories">
      <div class="container">
        <h2 class="section-title">Shop By Category</h2>
        <div class="categories__grid">
          <div 
            v-for="category in categories" 
            :key="category.id"
            class="category-card"
            @click="navigateToCategory(category.slug)"
          >
            <div class="category-card__icon" :style="{ backgroundColor: category.color }">
              <span class="category-icon">{{ category.icon }}</span>
            </div>
            <h3 class="category-card__title">{{ category.name }}</h3>
            <span class="category-card__count">{{ category.count }} products</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="featured-products" ref="productsSection">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Featured Products</h2>
          <div class="section-actions">
            <Button variant="outline" @click="navigateToProducts">
              View All
            </Button>
          </div>
        </div>
        <div class="products-grid">
          <ProductCard 
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            :badge="product.badge"
          />
        </div>
      </div>
    </section>

    <!-- Deals -->
    <section class="deals">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Hot Deals</h2>
          <div class="section-actions">
            <Button variant="outline" @click="navigateToDeals">
              View All Deals
            </Button>
          </div>
        </div>
        <div class="deals__container">
          <div class="deals__card">
            <div class="deals__content">
              <span class="deals__label">Limited Time Offer</span>
              <h3 class="deals__title">Save up to 30%</h3>
              <p class="deals__description">On the latest flagship phones</p>
              <Button variant="primary" @click="navigateToDeals">
                Shop Deals
              </Button>
            </div>
            <div class="deals__image">
              <div class="deals__image-placeholder"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Brands -->
    <section class="brands">
      <div class="container">
        <h2 class="section-title">Top Brands</h2>
        <div class="brands__grid">
          <div 
            v-for="brand in brands" 
            :key="brand.id"
            class="brand-card"
            :data-brand="brand.name"
            @click="navigateToBrand(brand.slug)"
          >
            <img :src="brand.logo" :alt="brand.name" class="brand-logo">
          </div>
        </div>
      </div>
    </section>

    <!-- Reviews and Testimonials -->
    <section class="testimonials">
      <div class="container">
        <h2 class="section-title">What Our Customers Say</h2>
        <div class="testimonials__grid">
          <div 
            v-for="review in customerReviews" 
            :key="review.id"
            class="testimonial-card"
          >
            <div class="testimonial-card__rating">
              <span v-for="i in 5" :key="i" :class="['star', { 'star--filled': i <= review.rating }]">★</span>
            </div>
            <p class="testimonial-card__content">{{ review.comment }}</p>
            <div class="testimonial-card__author">
              <div class="testimonial-card__avatar">
                <img v-if="review.avatar" :src="review.avatar" :alt="review.name">
                <span v-else class="testimonial-card__avatar-placeholder">
                  {{ review.name.charAt(0) }}
                </span>
              </div>
              <div class="testimonial-card__info">
                <h4 class="testimonial-card__name">{{ review.name }}</h4>
                <span class="testimonial-card__date">{{ formatDate(review.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter">
      <div class="container">
        <div class="newsletter__content">
          <h2 class="newsletter__title">Stay Updated</h2>
          <p class="newsletter__description">Subscribe to our newsletter for exclusive deals and updates</p>
          <form class="newsletter__form" @submit.prevent="subscribeToNewsletter">
            <input 
              type="email" 
              class="newsletter__input" 
              placeholder="Enter your email" 
              v-model="email"
              required
            >
            <Button variant="primary" class="newsletter__button" :loading="isSubscribing">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-view {
  padding-bottom: var(--space-xxl);
}

/* Banner */
.banner {
  margin-bottom: var(--space-xl);
}

.banner__carousel {
  position: relative;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  height: 500px;
}

.banner__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
}

.banner__content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-xl);
  color: white;
}

.banner__title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: var(--space-md);
  max-width: 600px;
}

.banner__subtitle {
  font-size: 1.5rem;
  margin-bottom: var(--space-lg);
  max-width: 500px;
}

.banner__button {
  width: fit-content;
}

/* Section styling */
section {
  margin-bottom: var(--space-xxl);
}

.section-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-lg);
  color: var(--text-dark);
  text-align: center;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}

.section-header .section-title {
  margin-bottom: 0;
  text-align: left;
}

/* Categories */
.categories__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-lg);
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-lg);
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.category-card__icon {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-md);
}

.category-icon {
  font-size: 2rem;
}

.category-card__title {
  margin-bottom: var(--space-xs);
  font-size: var(--font-size-lg);
  font-weight: 500;
  color: var(--text-dark);
}

.category-card__count {
  color: var(--gray-medium);
  font-size: var(--font-size-sm);
}

/* Featured Products */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
}

/* Deals */
.deals__container {
  margin-top: var(--space-lg);
}

.deals__card {
  background: linear-gradient(135deg, var(--primary-blue-dark) 0%, var(--primary-blue) 100%);
  border-radius: var(--border-radius-lg);
  padding: var(--space-xl);
  color: white;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.deals__content {
  flex: 1;
  z-index: 2;
}

.deals__label {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-md);
}

.deals__title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: var(--space-sm);
}

.deals__description {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-lg);
}

.deals__image {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

/* Brands */
.brands__grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-xl);
}

.brand-card {
  padding: var(--space-md);
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 100px;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  cursor: pointer;
}

.brand-card:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-md);
}

.brand-logo {
  max-width: 100%;
  max-height: 60px;
  object-fit: contain;
}

/* Testimonials */
.testimonials__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.testimonial-card {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--space-lg);
}

.testimonial-card__rating {
  margin-bottom: var(--space-md);
  display: flex;
}

.testimonial-card__rating .star {
  color: var(--gray-medium);
  margin-right: 2px;
}

.testimonial-card__rating .star--filled {
  color: var(--warning);
}

.testimonial-card__content {
  font-size: var(--font-size-md);
  margin-bottom: var(--space-lg);
  color: var(--text-dark);
  line-height: 1.6;
}

.testimonial-card__author {
  display: flex;
  align-items: center;
}

.testimonial-card__avatar {
  margin-right: var(--space-sm);
}

.testimonial-card__avatar img {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-round);
  object-fit: cover;
}

.testimonial-card__avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-round);
  background-color: var(--primary-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  font-weight: bold;
}

.testimonial-card__info {
  display: flex;
  flex-direction: column;
}

.testimonial-card__name {
  font-size: var(--font-size-md);
  font-weight: 500;
  margin: 0 0 var(--space-xs);
  color: var(--text-dark);
}

.testimonial-card__date {
  font-size: var(--font-size-sm);
  color: var(--gray-medium);
}

/* Newsletter */
.newsletter {
  background-color: var(--light-blue);
  padding: var(--space-xxl) 0;
  border-radius: var(--border-radius-lg);
}

.newsletter__content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.newsletter__title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--space-md);
  color: var(--primary-blue-dark);
}

.newsletter__description {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-lg);
  color: var(--text-dark);
}

.newsletter__form {
  display: flex;
  gap: var(--space-sm);
}

.newsletter__input {
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--gray-medium);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
}

.newsletter__input:focus {
  outline: none;
  border-color: var(--primary-blue);
}

/* 图片占位符 */
.banner__image-placeholder {
  width: 100%;
  height: 500px;
  background: linear-gradient(135deg, var(--primary-blue-light) 0%, var(--primary-blue-dark) 100%);
  border-radius: var(--border-radius-lg);
}

.deals__image-placeholder {
  width: 100%;
  height: 300px;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.deals__image-placeholder::after {
  content: "📱";
  font-size: 5rem;
  opacity: 0.5;
}

/* 产品卡片占位符 */
.product-card .product-card__image img {
  display: none;
}

.product-card .product-card__image::after {
  content: "📱";
  font-size: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--primary-blue);
}

/* 品牌卡片占位符 */
.brand-card img {
  display: none;
}

.brand-card::after {
  content: attr(data-brand);
  font-weight: bold;
  color: var(--primary-blue);
  font-size: 1.2rem;
}

@media (max-width: 992px) {
  .banner__title {
    font-size: 2.5rem;
  }
  
  .banner__subtitle {
    font-size: 1.25rem;
  }
  
  .deals__card {
    flex-direction: column;
    text-align: center;
  }
  
  .deals__content {
    margin-bottom: var(--space-lg);
  }
}

@media (max-width: 768px) {
  .banner__carousel {
    height: 400px;
  }
  
  .banner__title {
    font-size: 2rem;
  }
  
  .categories__grid,
  .products-grid,
  .testimonials__grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
  
  .newsletter__form {
    flex-direction: column;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }
  
  .brand-card {
    width: 100px;
    height: 80px;
  }
}
</style>
