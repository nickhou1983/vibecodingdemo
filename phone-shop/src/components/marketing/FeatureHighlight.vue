<script setup lang="ts">
import { ref } from 'vue';
import Button from '../common/Button.vue';

interface Feature {
  icon?: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

interface FeatureHighlightProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
  columns?: number;
  ctaText?: string;
  ctaLink?: string;
}

const props = withDefaults(defineProps<FeatureHighlightProps>(), {
  title: 'Why Choose Our Phones',
  subtitle: 'Discover the advantages of shopping with us',
  features: () => [
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'Your payments are protected with industry-leading encryption.'
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Get your products delivered to your doorstep within 2-3 business days.'
    },
    {
      icon: '💯',
      title: 'Quality Guarantee',
      description: 'All our products are authentic with full manufacturer warranty.'
    }
  ],
  columns: 3,
  ctaText: '',
  ctaLink: ''
});

const emit = defineEmits<{
  (e: 'featureClick', feature: Feature): void,
  (e: 'ctaClick'): void
}>();

const handleFeatureClick = (feature: Feature) => {
  emit('featureClick', feature);
};

const handleCtaClick = () => {
  emit('ctaClick');
};
</script>

<template>
  <section class="feature-highlight">
    <div class="feature-highlight__header">
      <h2 class="feature-highlight__title">{{ title }}</h2>
      <p class="feature-highlight__subtitle">{{ subtitle }}</p>
    </div>
    
    <div 
      class="feature-highlight__grid" 
      :class="`feature-highlight__grid--cols-${columns}`"
    >
      <div 
        v-for="(feature, index) in features" 
        :key="index" 
        class="feature-card"
        @click="feature.ctaLink ? handleFeatureClick(feature) : null"
        :class="{ 'feature-card--clickable': feature.ctaLink }"
      >
        <div v-if="feature.icon" class="feature-card__icon">
          <span>{{ feature.icon }}</span>
        </div>
        
        <div class="feature-card__content">
          <h3 class="feature-card__title">{{ feature.title }}</h3>
          <p class="feature-card__description">{{ feature.description }}</p>
          
          <Button 
            v-if="feature.ctaText" 
            class="feature-card__cta"
            size="small"
            variant="text"
            @click.stop="handleFeatureClick(feature)"
          >
            {{ feature.ctaText }}
          </Button>
        </div>
      </div>
    </div>
    
    <div v-if="ctaText" class="feature-highlight__footer">
      <Button 
        class="feature-highlight__cta"
        size="large"
        @click="handleCtaClick"
      >
        {{ ctaText }}
      </Button>
    </div>
  </section>
</template>

<style scoped>
.feature-highlight {
  padding: 3rem 1rem;
  width: 100%;
}

.feature-highlight__header {
  text-align: center;
  margin-bottom: 3rem;
}

.feature-highlight__title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary, #333);
  margin-bottom: 1rem;
}

.feature-highlight__subtitle {
  font-size: 1.1rem;
  color: var(--color-text-secondary, #666);
  max-width: 600px;
  margin: 0 auto;
}

.feature-highlight__grid {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
}

.feature-highlight__grid--cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.feature-highlight__grid--cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.feature-highlight__grid--cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.feature-card {
  background-color: var(--color-background, #fff);
  border-radius: 0.5rem;
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.feature-card--clickable {
  cursor: pointer;
}

.feature-card--clickable:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.feature-card__icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--color-primary-light, #e3f2fd);
}

.feature-card__content {
  flex: 1;
}

.feature-card__title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-text-primary, #333);
}

.feature-card__description {
  color: var(--color-text-secondary, #666);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.feature-card__cta {
  margin-top: auto;
  padding-left: 0;
  color: var(--color-primary, #1976d2);
}

.feature-highlight__footer {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

@media (max-width: 992px) {
  .feature-highlight__grid--cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .feature-highlight__grid--cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .feature-highlight__grid {
    grid-template-columns: 1fr;
  }
}
</style>
