# Add Marketing Components for Promotions and Features

## Summary
This PR adds a set of marketing components to enhance the Phone Shop e-commerce application. These components enable better promotional capabilities, feature highlighting, and user engagement through visually appealing UI elements.

## New Components
- `PromotionalBanner.vue`: Versatile banner for showcasing special offers with countdown timer support
- `FeatureHighlight.vue`: Grid-based component for displaying product/service features 
- `MarketingSection.vue`: Container component that can combine banners and features
- `MarketingDemo.vue`: Demonstration component showcasing all marketing components

## Added Features
- Time-based promotional banners with countdown timers
- Feature highlight grids with configurable columns
- Flexible marketing section layouts (promotional, features, or hybrid)
- New "/marketing" route to demonstrate components
- Added "Promotions" link in the navigation menu

## Technical Details
- Components are fully responsive, working on mobile, tablet, and desktop screens
- Written in Vue 3 with TypeScript for type safety
- Follows the existing design system with consistent styling
- Customizable through props for maximum flexibility
- Event emitters for tracking user interactions

## Screenshots
[Please add screenshots during PR submission]

## Testing
- Tested responsive behavior across different screen sizes
- Verified countdown timer functionality
- Tested routing to the marketing demo page
- Validated component props and event emitters

## Documentation
Added detailed README.md in the marketing components directory with examples of component usage.
