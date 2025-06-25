<template>
  <div class="product-detail-view">
    <ProductDetail />
  </div>
</template>

<script setup lang="ts">
import ProductDetail from '@/components/products/ProductDetail.vue';
</script>

<style scoped>
.product-detail-view {
  min-height: 100vh;
  background-color: var(--gray-light);
}
</style>
