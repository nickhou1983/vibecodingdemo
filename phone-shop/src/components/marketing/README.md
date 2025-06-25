# Marketing Components for Phone Shop

This PR adds a set of marketing components to the Phone Shop e-commerce application to enhance promotional capabilities and user engagement.

## New Components

### 1. PromotionalBanner.vue
A versatile banner component for showcasing special offers, sales, and promotions.

**Features:**
- Customizable title, subtitle, and call-to-action button
- Support for countdown timers for time-sensitive offers
- Custom background colors and text colors
- Optional promotional discount display
- Responsive design for all screen sizes

### 2. FeatureHighlight.vue
A component for showcasing product or service features in an engaging grid layout.

**Features:**
- Customizable column count (2, 3, or 4 columns)
- Supports icons, titles, and descriptions for each feature
- Optional call-to-action links for individual features
- Main call-to-action button for the entire section
- Responsive design that adjusts columns based on screen size

### 3. MarketingSection.vue
A container component that can combine promotional banners and feature highlights in various layouts.

**Features:**
- Three section types: promotional (banner only), features (features only), or hybrid (both)
- Customizable section title and subtitle
- Background color customization
- Full-width option for edge-to-edge designs

### 4. MarketingDemo.vue
A demonstration component that showcases all marketing components with sample data.

## How to Use

### PromotionalBanner Example
```vue
<PromotionalBanner
  title="Summer Sale"
  subtitle="Get up to 30% off on selected smartphones"
  ctaText="Shop Now"
  ctaLink="/products"
  backgroundColor="#1e88e5"
  textColor="#ffffff"
  discount="UP TO 30% OFF"
  :endDate="new Date('2023-12-31')"
  @bannerClick="handleBannerClick"
/>
```

### FeatureHighlight Example
```vue
<FeatureHighlight
  title="Why Choose Our Phones"
  subtitle="We offer the best smartphone experience"
  :features="[
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'All transactions are protected with encryption.',
      ctaText: 'Learn More',
      ctaLink: '/about#security'
    },
    // More features...
  ]"
  :columns="3"
  @featureClick="handleFeatureClick"
/>
```

### MarketingSection Example
```vue
<MarketingSection
  sectionType="hybrid"
  title="Special Offers"
  subtitle="Don't miss out on our exclusive deals"
  :bannerProps="bannerProps"
  :featuresProps="featuresProps"
  @bannerClick="handleBannerClick"
  @featureClick="handleFeatureClick"
/>
```

## Demo Page
A demo page has been added to showcase these components at `/marketing`. You can access it through the "Promotions" link in the navigation menu.
