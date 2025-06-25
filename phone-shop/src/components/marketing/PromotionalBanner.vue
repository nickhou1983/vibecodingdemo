<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Button from '../common/Button.vue';

interface BannerProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundColor?: string;
  textColor?: string;
  imageUrl?: string;
  discount?: string;
  endDate?: Date;
}

const props = withDefaults(defineProps<BannerProps>(), {
  title: 'Special Offer',
  subtitle: 'Limited time deal',
  ctaText: 'Shop Now',
  ctaLink: '/products',
  backgroundColor: '#1e88e5',
  textColor: '#ffffff',
  imageUrl: '',
  discount: '',
  endDate: undefined
});

const emit = defineEmits<{
  (e: 'bannerClick', url: string): void
}>();

const timeRemaining = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
});

const countdownActive = computed(() => props.endDate !== undefined);

const handleCtaClick = () => {
  emit('bannerClick', props.ctaLink);
};

const updateCountdown = () => {
  if (!props.endDate) return;
  
  const now = new Date();
  const endTime = new Date(props.endDate);
  const diff = endTime.getTime() - now.getTime();
  
  if (diff <= 0) {
    // Countdown has ended
    timeRemaining.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return;
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  timeRemaining.value = { days, hours, minutes, seconds };
};

let countdownInterval: number | null = null;

onMounted(() => {
  if (props.endDate) {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<template>
  <div 
    class="promotional-banner" 
    :style="{ 
      backgroundColor: backgroundColor,
      color: textColor 
    }"
  >
    <div class="promotional-banner__content">
      <div class="promotional-banner__text">
        <h2 class="promotional-banner__title">{{ title }}</h2>
        <p class="promotional-banner__subtitle">{{ subtitle }}</p>
        
        <div v-if="discount" class="promotional-banner__discount">
          <span class="promotional-banner__discount-text">{{ discount }}</span>
        </div>
        
        <div v-if="countdownActive" class="promotional-banner__countdown">
          <div class="countdown-item">
            <span class="countdown-number">{{ timeRemaining.days }}</span>
            <span class="countdown-label">Days</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">{{ timeRemaining.hours }}</span>
            <span class="countdown-label">Hours</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">{{ timeRemaining.minutes }}</span>
            <span class="countdown-label">Minutes</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">{{ timeRemaining.seconds }}</span>
            <span class="countdown-label">Seconds</span>
          </div>
        </div>
        
        <Button 
          class="promotional-banner__cta" 
          @click="handleCtaClick" 
          variant="outlined" 
          size="large"
        >
          {{ ctaText }}
        </Button>
      </div>
      
      <div v-if="imageUrl" class="promotional-banner__image">
        <img :src="imageUrl" :alt="title" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.promotional-banner {
  width: 100%;
  padding: 2rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.promotional-banner__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.promotional-banner__text {
  flex: 1;
}

.promotional-banner__title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.promotional-banner__subtitle {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.promotional-banner__cta {
  margin-top: 1rem;
  border-color: currentColor !important;
  color: inherit !important;
}

.promotional-banner__image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 300px;
}

.promotional-banner__image img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.promotional-banner__discount {
  display: inline-block;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 1.25rem;
}

.promotional-banner__countdown {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.15);
  padding: 0.75rem;
  border-radius: 0.5rem;
  min-width: 60px;
}

.countdown-number {
  font-size: 1.5rem;
  font-weight: 700;
}

.countdown-label {
  font-size: 0.8rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .promotional-banner__content {
    flex-direction: column;
  }
  
  .promotional-banner__image {
    margin-top: 1.5rem;
  }
  
  .promotional-banner__countdown {
    justify-content: center;
  }
}
</style>
