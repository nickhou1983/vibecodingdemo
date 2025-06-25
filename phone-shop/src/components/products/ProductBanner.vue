<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

interface BannerItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string;
  textColor?: string;
}

const props = defineProps({
  autoplay: {
    type: Boolean,
    default: true
  },
  interval: {
    type: Number,
    default: 5000
  },
  height: {
    type: String,
    default: '500px'
  }
});

const router = useRouter();
const currentSlide = ref(0);
const timer = ref<number | null>(null);
const isAnimating = ref(false);

const banners: BannerItem[] = [
  {
    id: 1,
    title: "New iPhone 14 Pro",
    subtitle: "The Ultimate iPhone",
    description: "Featuring the Always-On display, first-ever 48MP camera, and innovative Dynamic Island.",
    image: "/images/products/iphone-banner.jpg",
    buttonText: "Shop Now",
    buttonLink: "/products/iphone-14-pro",
    backgroundColor: "var(--primary-blue-dark)",
    textColor: "var(--text-light)"
  },
  {
    id: 2,
    title: "Galaxy Z Fold",
    subtitle: "Unfold Your World",
    description: "Experience the phone that unfolds into a tablet, with a massive screen for immersive viewing.",
    image: "/images/products/samsung-fold-banner.jpg",
    buttonText: "Explore",
    buttonLink: "/products/galaxy-z-fold",
    backgroundColor: "var(--gray-dark)",
    textColor: "var(--text-light)"
  },
  {
    id: 3,
    title: "Summer Sale",
    subtitle: "Up to 30% Off",
    description: "Grab amazing deals on selected smartphones. Limited time offer.",
    image: "/images/products/sale-banner.jpg",
    buttonText: "View Offers",
    buttonLink: "/sale",
    backgroundColor: "var(--warning)",
    textColor: "var(--text-light)"
  }
];

const bannerStyle = computed(() => {
  return {
    height: props.height
  };
});

const goToSlide = (index: number) => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  currentSlide.value = index;
  resetTimer();
  
  // Reset animation flag after transition completes
  setTimeout(() => {
    isAnimating.value = false;
  }, 600); // Match this with CSS transition duration
};

const nextSlide = () => {
  goToSlide((currentSlide.value + 1) % banners.length);
};

const prevSlide = () => {
  goToSlide((currentSlide.value - 1 + banners.length) % banners.length);
};

const resetTimer = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
  
  if (props.autoplay) {
    timer.value = window.setInterval(() => {
      nextSlide();
    }, props.interval);
  }
};

const navigateTo = (link: string) => {
  router.push(link);
};

onMounted(() => {
  resetTimer();
});
</script>

<template>
  <div class="product-banner" :style="bannerStyle">
    <div class="banner-container">
      <div 
        v-for="(banner, index) in banners" 
        :key="banner.id"
        class="banner-slide"
        :class="{ 'active': index === currentSlide }"
        :style="{
          backgroundColor: banner.backgroundColor,
          color: banner.textColor
        }"
      >
        <div class="banner-content">
          <h2 class="banner-title">{{ banner.title }}</h2>
          <h3 class="banner-subtitle">{{ banner.subtitle }}</h3>
          <p class="banner-description">{{ banner.description }}</p>
          <button 
            class="banner-button"
            @click="navigateTo(banner.buttonLink)"
          >
            {{ banner.buttonText }}
          </button>
        </div>
        <div class="banner-image">
          <img :src="banner.image" :alt="banner.title">
        </div>
      </div>
    </div>
    
    <!-- Navigation arrows -->
    <button class="banner-nav banner-nav-prev" @click="prevSlide" aria-label="Previous slide">
      <span class="arrow-icon">&#10094;</span>
    </button>
    <button class="banner-nav banner-nav-next" @click="nextSlide" aria-label="Next slide">
      <span class="arrow-icon">&#10095;</span>
    </button>
    
    <!-- Dots navigation -->
    <div class="banner-dots">
      <button 
        v-for="(banner, index) in banners"
        :key="banner.id"
        class="banner-dot"
        :class="{ 'active': index === currentSlide }"
        @click="goToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<style scoped>
.product-banner {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
}

.banner-container {
  height: 100%;
  width: 100%;
  position: relative;
}

.banner-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  opacity: 0;
  transition: opacity 0.6s ease;
  z-index: 0;
  overflow: hidden;
}

.banner-slide.active {
  opacity: 1;
  z-index: 1;
}

.banner-content {
  flex: 1;
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.banner-title {
  font-size: var(--font-size-xxl);
  margin-bottom: var(--space-sm);
}

.banner-subtitle {
  font-size: var(--font-size-lg);
  opacity: 0.9;
  margin-bottom: var(--space-md);
}

.banner-description {
  margin-bottom: var(--space-lg);
  max-width: 500px;
  line-height: 1.5;
}

.banner-button {
  align-self: flex-start;
  padding: var(--space-sm) var(--space-lg);
  background-color: var(--accent-blue);
  color: var(--text-light);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-weight: bold;
  transition: background-color var(--transition-normal);
}

.banner-button:hover {
  background-color: var(--primary-blue-dark);
}

.banner-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
}

.banner-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.banner-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.3);
  color: var(--text-dark);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: background-color var(--transition-fast);
}

.banner-nav:hover {
  background-color: rgba(255, 255, 255, 0.7);
}

.banner-nav-prev {
  left: var(--space-md);
}

.banner-nav-next {
  right: var(--space-md);
}

.arrow-icon {
  font-size: var(--font-size-xl);
}

.banner-dots {
  position: absolute;
  bottom: var(--space-md);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--space-sm);
  z-index: 2;
}

.banner-dot {
  width: 12px;
  height: 12px;
  border-radius: var(--border-radius-round);
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.banner-dot.active {
  background-color: var(--text-light);
}

@media (max-width: 768px) {
  .banner-slide {
    flex-direction: column;
  }
  
  .banner-content {
    padding: var(--space-md);
    order: 2;
  }
  
  .banner-title {
    font-size: var(--font-size-xl);
  }
  
  .banner-image {
    order: 1;
  }
}
</style>
