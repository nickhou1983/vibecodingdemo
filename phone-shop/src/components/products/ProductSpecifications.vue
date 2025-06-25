<template>
  <div class="product-specifications">
    <h3 class="specifications-title">技术规格</h3>
    <div class="specifications-grid">
      <div 
        v-for="(spec, index) in specifications" 
        :key="index" 
        class="specification-item"
      >
        <div class="spec-name">{{ spec.name }}</div>
        <div class="spec-value">{{ spec.value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Specification {
  name: string;
  value: string;
}

defineProps<{
  specifications: Specification[];
}>();
</script>

<style scoped>
.product-specifications {
  width: 100%;
  padding: var(--space-md) 0;
}

.specifications-title {
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: var(--space-md);
  color: var(--color-text);
}

.specifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-md);
}

.specification-item {
  display: flex;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.spec-name {
  flex: 1;
  font-weight: 500;
  color: var(--color-text-light);
}

.spec-value {
  flex: 2;
  color: var(--color-text);
}

@media (max-width: 640px) {
  .specifications-grid {
    grid-template-columns: 1fr;
  }
}
</style>
