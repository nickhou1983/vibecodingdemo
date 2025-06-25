<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { MarketingSection, PromotionalBanner, FeatureHighlight } from '@/components/marketing';

const router = useRouter();

// Demo data for banner
const bannerProps = {
  title: 'Summer Sale',
  subtitle: 'Get up to 30% off on selected smartphones',
  ctaText: 'Shop the Sale',
  ctaLink: '/products',
  backgroundColor: '#0d47a1',
  textColor: '#ffffff',
  discount: 'UP TO 30% OFF',
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
};

// Demo data for features
const featuresProps = {
  title: 'Why Choose Our Phones',
  subtitle: 'We offer the best smartphone experience',
  features: [
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'All transactions are protected with 256-bit SSL encryption for complete peace of mind.',
      ctaText: 'Learn More',
      ctaLink: '/about#security'
    },
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Free and fast delivery on all orders over $100. Get your phone within 2-3 business days.',
      ctaText: 'Shipping Info',
      ctaLink: '/about#shipping'
    },
    {
      icon: '🔄',
      title: '30-Day Returns',
      description: 'Not satisfied with your purchase? Return within 30 days for a full refund.',
      ctaText: 'Return Policy',
      ctaLink: '/about#returns'
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description: 'Our customer support team is available 24/7 to assist you with any questions or issues.',
      ctaText: 'Contact Us',
      ctaLink: '/contact'
    }
  ],
  columns: 4,
  ctaText: 'Browse All Phones',
  ctaLink: '/products'
};

// Combined section props
const hybridSectionProps = {
  title: 'Limited Time Offers',
  subtitle: 'Exclusive deals on our premium smartphones',
  backgroundColor: '#f5f5f5',
  sectionType: 'hybrid' as const,
  bannerProps: {
    ...bannerProps,
    backgroundColor: '#1e88e5'
  },
  featuresProps: {
    ...featuresProps,
    title: 'Why Shop With Us?',
    columns: 3,
    features: featuresProps.features.slice(0, 3)
  }
};

const handleBannerClick = (url: string) => {
  router.push(url);
};

const handleFeatureClick = (feature: any) => {
  if (feature.ctaLink) {
    router.push(feature.ctaLink);
  }
};

const handleCtaClick = () => {
  router.push('/products');
};
</script>

<template>
  <div class="marketing-demo">
    <h1 class="marketing-demo__title">Marketing Components Demo</h1>
    
    <section class="marketing-demo__section">
      <h2 class="marketing-demo__section-title">Promotional Banner</h2>
      <PromotionalBanner 
        v-bind="bannerProps"
        @bannerClick="handleBannerClick"
      />
    </section>
    
    <section class="marketing-demo__section">
      <h2 class="marketing-demo__section-title">Feature Highlights</h2>
      <FeatureHighlight 
        v-bind="featuresProps"
        @featureClick="handleFeatureClick"
        @ctaClick="handleCtaClick"
      />
    </section>
    
    <section class="marketing-demo__section">
      <h2 class="marketing-demo__section-title">Combined Marketing Section</h2>
      <MarketingSection 
        v-bind="hybridSectionProps"
        @bannerClick="handleBannerClick"
        @featureClick="handleFeatureClick" 
        @ctaClick="handleCtaClick"
      />
    </section>
  </div>
</template>

<style scoped>
.marketing-demo {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.marketing-demo__title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--color-text-primary, #333);
  text-align: center;
}

.marketing-demo__section {
  margin-bottom: 4rem;
}

.marketing-demo__section-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-primary, #1976d2);
  color: var(--color-text-primary, #333);
}
</style>
