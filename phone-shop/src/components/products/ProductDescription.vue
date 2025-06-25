<template>
  <div class="product-description">
    <div v-if="content" v-html="content" class="description-content"></div>
    <div v-else class="no-description">
      暂无商品描述
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  content: string;
}>();
</script>

<style scoped>
.product-description {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-md) 0;
}

.description-content {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text);
}

.description-content p {
  margin-bottom: var(--space-md);
}

.description-content h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: var(--space-lg);
  margin-bottom: var(--space-sm);
  color: var(--color-text);
}

.description-content ul, .description-content ol {
  margin-left: var(--space-lg);
  margin-bottom: var(--space-md);
}

.description-content li {
  margin-bottom: var(--space-xs);
}

.description-content img {
  max-width: 100%;
  height: auto;
  margin: var(--space-md) 0;
  border-radius: var(--border-radius);
}

.no-description {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-text-light);
  font-style: italic;
}
</style>
