<script setup lang="ts">
import { ref, computed } from 'vue';
import PromotionalBanner from './PromotionalBanner.vue';
import FeatureHighlight from './FeatureHighlight.vue';

interface MarketingSectionProps {
  sectionType: 'promotional' | 'features' | 'hybrid';
  title?: string;
  subtitle?: string;
  backgroundColor?: string;
  bannerProps?: Record<string, any>;
  featuresProps?: Record<string, any>;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<MarketingSectionProps>(), {
  sectionType: 'hybrid',
  title: '',
  subtitle: '',
  backgroundColor: 'transparent',
  bannerProps: () => ({}),
  featuresProps: () => ({}),
  fullWidth: false
});

const emit = defineEmits<{
  (e: 'bannerClick', url: string): void,
  (e: 'featureClick', feature: any): void,
  (e: 'ctaClick'): void
}>();

const handleBannerClick = (url: string) => {
  emit('bannerClick', url);
};

const handleFeatureClick = (feature: any) => {
  emit('featureClick', feature);
};

const handleCtaClick = () => {
  emit('ctaClick');
};

const showBanner = computed(() => {
  return props.sectionType === 'promotional' || props.sectionType === 'hybrid';
});

const showFeatures = computed(() => {
  return props.sectionType === 'features' || props.sectionType === 'hybrid';
});

const containerClass = computed(() => {
  return props.fullWidth ? 'marketing-section__container--full' : 'marketing-section__container';
});
</script>

<template>
  <section 
    class="marketing-section" 
    :style="{
      backgroundColor: backgroundColor
    }"
  >
    <div :class="containerClass">
      <div v-if="title || subtitle" class="marketing-section__header">
        <h2 v-if="title" class="marketing-section__title">{{ title }}</h2>
        <p v-if="subtitle" class="marketing-section__subtitle">{{ subtitle }}</p>
      </div>
      
      <PromotionalBanner 
        v-if="showBanner" 
        v-bind="bannerProps"
        @bannerClick="handleBannerClick"
      />
      
      <FeatureHighlight 
        v-if="showFeatures"
        v-bind="featuresProps"
        @feature-click="handleFeatureClick"
        @cta-click="handleCtaClick"
      />
    </div>
  </section>
</template>

<style scoped>
.marketing-section {
  padding: 3rem 0;
  width: 100%;
}

.marketing-section__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.marketing-section__container--full {
  width: 100%;
  padding: 0 1rem;
}

.marketing-section__header {
  text-align: center;
  margin-bottom: 2rem;
}

.marketing-section__title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-text-primary, #333);
  margin-bottom: 1rem;
}

.marketing-section__subtitle {
  font-size: 1.2rem;
  color: var(--color-text-secondary, #666);
  max-width: 700px;
  margin: 0 auto;
}
</style>
