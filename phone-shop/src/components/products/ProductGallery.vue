<template>
  <div class="product-gallery">
    <div class="main-image-container">
      <div 
        class="main-image" 
        :style="{
          backgroundImage: `url(${currentImage.src})`
        }"
        :alt="currentImage.alt"
      >
        <div class="image-overlay">
          <button 
            class="zoom-button"
            @click="openFullscreen"
            title="查看大图"
          >
            <svg viewBox="0 0 24 24" class="zoom-icon">
              <path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3h-6zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3v6zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6h6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6v-6z"></path>
            </svg>
          </button>
          
          <div class="navigation-buttons" v-if="images.length > 1">
            <button 
              class="nav-button prev"
              @click="prevImage"
              :disabled="currentIndex === 0"
              title="上一张图片"
            >
              <svg viewBox="0 0 24 24" class="nav-icon">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
              </svg>
            </button>
            <button 
              class="nav-button next"
              @click="nextImage"
              :disabled="currentIndex >= images.length - 1"
              title="下一张图片"
            >
              <svg viewBox="0 0 24 24" class="nav-icon">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="thumbnails" v-if="images.length > 1">
      <div 
        v-for="(image, index) in images" 
        :key="image.id"
        class="thumbnail"
        :class="{ active: index === currentIndex }"
        @click="setCurrentImage(index)"
        :title="image.alt"
      >
        <img :src="image.src" :alt="image.alt">
      </div>
    </div>
    
    <div class="fullscreen-gallery" v-if="isFullscreen" @click="closeFullscreen">
      <div class="fullscreen-content" @click.stop>
        <div class="fullscreen-image">
          <img :src="currentImage.src" :alt="currentImage.alt">
        </div>
        
        <div class="fullscreen-navigation">
          <button 
            class="fullscreen-nav-button prev"
            @click="prevImage"
            :disabled="currentIndex === 0"
          >
            <svg viewBox="0 0 24 24" class="nav-icon">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
            </svg>
          </button>
          <div class="fullscreen-counter">{{ currentIndex + 1 }} / {{ images.length }}</div>
          <button 
            class="fullscreen-nav-button next"
            @click="nextImage"
            :disabled="currentIndex >= images.length - 1"
          >
            <svg viewBox="0 0 24 24" class="nav-icon">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
            </svg>
          </button>
        </div>
        
        <button class="close-fullscreen" @click="closeFullscreen">
          <svg viewBox="0 0 24 24" class="close-icon">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
}

const props = defineProps({
  images: {
    type: Array as () => GalleryImage[],
    required: true,
    validator: (value: GalleryImage[]) => value.length > 0
  }
});

const currentIndex = ref(0);
const isFullscreen = ref(false);

const currentImage = computed(() => {
  return props.images[currentIndex.value] || props.images[0];
});

const setCurrentImage = (index: number) => {
  if (index >= 0 && index < props.images.length) {
    currentIndex.value = index;
  }
};

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
  }
};

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const openFullscreen = () => {
  isFullscreen.value = true;
  // Prevent body scroll when fullscreen is open
  document.body.style.overflow = 'hidden';
};

const closeFullscreen = () => {
  isFullscreen.value = false;
  // Restore body scroll
  document.body.style.overflow = '';
};
</script>

<style scoped>
.product-gallery {
  position: relative;
  width: 100%;
}

.main-image-container {
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* Square aspect ratio */
  margin-bottom: var(--space-md);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.main-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-color: white;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-image-container:hover .image-overlay {
  opacity: 1;
}

.zoom-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-round);
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
}

.zoom-button:hover {
  background-color: white;
}

.zoom-icon {
  width: 20px;
  height: 20px;
  fill: var(--text-dark);
}

.navigation-buttons {
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 var(--space-sm);
}

.nav-button {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-round);
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
}

.nav-button:hover:not(:disabled) {
  background-color: white;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-icon {
  width: 24px;
  height: 24px;
  fill: var(--text-dark);
}

.thumbnails {
  display: flex;
  gap: var(--space-sm);
  overflow-x: auto;
  scrollbar-width: thin;
  padding-bottom: var(--space-sm);
}

.thumbnail {
  flex: 0 0 60px;
  height: 60px;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: var(--transition-fast);
}

.thumbnail.active {
  border-color: var(--primary-blue);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Fullscreen gallery */
.fullscreen-gallery {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-content {
  position: relative;
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
}

.fullscreen-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.fullscreen-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
}

.fullscreen-nav-button {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-round);
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
}

.fullscreen-nav-button:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.3);
}

.fullscreen-nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fullscreen-nav-button .nav-icon {
  fill: white;
}

.fullscreen-counter {
  color: white;
  font-size: var(--font-size-md);
  margin: 0 var(--space-lg);
}

.close-fullscreen {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-round);
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-fast);
}

.close-fullscreen:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.close-icon {
  width: 24px;
  height: 24px;
  fill: white;
}

@media (max-width: 768px) {
  .fullscreen-content {
    width: 100%;
    height: 100%;
  }
  
  .close-fullscreen {
    top: 10px;
    right: 10px;
  }
  
  .thumbnail {
    flex: 0 0 50px;
    height: 50px;
  }
}
</style>
