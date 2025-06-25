<template>
  <div class="cart-view">
    <ShoppingCart />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ShoppingCart from '@/components/cart/ShoppingCart.vue';

onMounted(() => {
  document.title = '购物车 - 手机商城';
});
</script>

<style scoped>
.cart-view {
  min-height: 70vh;
  padding-bottom: var(--space-xl);
}
</style>
