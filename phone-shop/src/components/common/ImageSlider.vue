<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';

interface SliderImage {
  id: string | number;
  src: string;
  alt?: string;
  thumbnailSrc?: string;
}

const props = defineProps({
  images: {
    type: Array as () => SliderImage[],
    required: true
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  interval: {
    type: Number,
    default: 5000
  },
  height: {
    type: String,
    default: '400px'
  },
  thumbnailsPosition: {
    type: String,
    default: 'bottom' // 'bottom', 'top', 'left', 'right', 'none'
  },
  fullscreenEnabled: {
    type: Boolean,
    default: true
  }
});

const activeIndex = ref(0);
const timer = ref<number | null>(null);
const isAnimating = ref(false);
const isFullscreen = ref(false);
const touchStartX = ref(0);
const touchEndX = ref(0);

const sliderStyle = computed(() => {
  return {
    height: props.height
  };
});

const showThumbnails = computed(() => {
  return props.thumbnailsPosition !== 'none' && props.images.length > 1;
});

const goToSlide = (index: number) => {
  if (isAnimating.value || index === activeIndex.value) return;
  
  isAnimating.value = true;
  activeIndex.value = index;
  
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
  
  if (props.autoplay) {
    startAutoplay();
  }
  
  // Reset animation flag after transition completes
  setTimeout(() => {
    isAnimating.value = false;
  }, 400);
};

const nextSlide = () => {
  const newIndex = (activeIndex.value + 1) % props.images.length;
  goToSlide(newIndex);
};

const prevSlide = () => {
  const newIndex = (activeIndex.value - 1 + props.images.length) % props.images.length;
  goToSlide(newIndex);
};

const startAutoplay = () => {
  if (timer.value) {
    clearInterval(timer.value);
  }
  
  timer.value = window.setInterval(() => {
    nextSlide();
  }, props.interval);
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  
  // If we exited fullscreen, restart autoplay if enabled
  if (!isFullscreen.value && props.autoplay) {
    startAutoplay();
  }
};

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX;
};

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].clientX;
  
  const diff = touchStartX.value - touchEndX.value;
  
  // If the touch movement is significant
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      nextSlide(); // Swipe left
    } else {
      prevSlide(); // Swipe right
    }
  }
};

onMounted(() => {
  if (props.autoplay) {
    startAutoplay();
  }
});

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<template>
  <div 
    class="image-slider" 
    :class="{
      'image-slider--fullscreen': isFullscreen,
      [`image-slider--thumbs-${props.thumbnailsPosition}`]: showThumbnails
    }"
  >
    <div 
      class="slider-container" 
      :style="sliderStyle"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <div 
        v-for="(image, index) in props.images" 
        :key="image.id"
        class="slider-slide"
        :class="{ active: index === activeIndex }"
      >
        <img :src="image.src" :alt="image.alt || ''" class="slider-image" />
      </div>
      
      <!-- Navigation arrows -->
      <button 
        v-if="props.images.length > 1"
        class="slider-nav slider-prev"
        @click="prevSlide"
        aria-label="Previous slide"
      >
        <span>&#10094;</span>
      </button>
      <button 
        v-if="props.images.length > 1"
        class="slider-nav slider-next"
        @click="nextSlide"
        aria-label="Next slide"
      >
        <span>&#10095;</span>
      </button>
      
      <!-- Fullscreen toggle -->
      <button 
        v-if="props.fullscreenEnabled"
        class="slider-fullscreen"
        @click="toggleFullscreen"
        aria-label="Toggle fullscreen"
      >
        <span v-if="isFullscreen">&#10006;</span>
        <span v-else>&#9974;</span>
      </button>
    </div>
    
    <!-- Thumbnails -->
    <div 
      v-if="showThumbnails"
      class="slider-thumbnails"
      :class="`slider-thumbnails--${props.thumbnailsPosition}`"
    >
      <div 
        v-for="(image, index) in props.images" 
        :key="`thumb-${image.id}`"
        class="slider-thumbnail"
        :class="{ active: index === activeIndex }"
        @click="goToSlide(index)"
      >
        <img 
          :src="image.thumbnailSrc || image.src" 
          :alt="`Thumbnail ${index + 1}`" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-slider {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.image-slider--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 0;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-slider--fullscreen .slider-container {
  height: 90vh;
  max-width: 90vw;
}

.image-slider--fullscreen .slider-image {
  object-fit: contain;
}

.slider-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.slider-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slider-slide.active {
  opacity: 1;
  position: relative;
}

.slider-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  color: var(--text-dark);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  z-index: 1;
  transition: background-color var(--transition-fast);
}

.slider-nav:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.slider-prev {
  left: 10px;
}

.slider-next {
  right: 10px;
}

.slider-fullscreen {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  color: var(--text-dark);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  z-index: 1;
  transition: background-color var(--transition-fast);
}

.slider-fullscreen:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.slider-thumbnails {
  display: flex;
  padding: var(--space-sm);
  gap: var(--space-sm);
  background-color: white;
}

.slider-thumbnails--bottom,
.slider-thumbnails--top {
  flex-direction: row;
  overflow-x: auto;
  justify-content: center;
  flex-wrap: wrap;
}

.slider-thumbnails--left,
.slider-thumbnails--right {
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  max-height: 400px;
  position: absolute;
  top: 0;
  bottom: 0;
}

.slider-thumbnails--left {
  left: 0;
}

.slider-thumbnails--right {
  right: 0;
}

.slider-thumbnail {
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color var(--transition-fast);
  opacity: 0.7;
  overflow: hidden;
}

.slider-thumbnails--bottom .slider-thumbnail,
.slider-thumbnails--top .slider-thumbnail {
  width: 60px;
  height: 60px;
}

.slider-thumbnails--left .slider-thumbnail,
.slider-thumbnails--right .slider-thumbnail {
  width: 60px;
  height: 60px;
}

.slider-thumbnail.active {
  border-color: var(--primary-blue);
  opacity: 1;
}

.slider-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slider-thumbnail:hover {
  opacity: 1;
}

.image-slider--thumbs-left .slider-container,
.image-slider--thumbs-right .slider-container {
  margin: 0 70px;
}

.image-slider--thumbs-top .slider-container {
  margin-top: 70px;
}

.image-slider--thumbs-bottom .slider-container {
  margin-bottom: 70px;
}

@media (max-width: 768px) {
  .slider-nav {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
  
  .slider-thumbnail {
    width: 50px;
    height: 50px;
  }
  
  .image-slider--thumbs-left .slider-container,
  .image-slider--thumbs-right .slider-container {
    margin: 0;
  }
  
  .slider-thumbnails--left,
  .slider-thumbnails--right {
    position: relative;
    flex-direction: row;
    width: 100%;
    height: auto;
    max-height: none;
    overflow-x: auto;
    justify-content: center;
  }
  
  .image-slider--thumbs-left .slider-container,
  .image-slider--thumbs-top .slider-container {
    margin-top: 60px;
  }
  
  .image-slider--thumbs-right .slider-container,
  .image-slider--thumbs-bottom .slider-container {
    margin-bottom: 60px;
  }
}
</style>
