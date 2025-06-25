<template>
  <div class="product-sort">
    <div class="select-container">
      <select v-model="sortOptionLocal" class="sort-select" @change="emitChange">
        <option value="default">默认排序</option>
        <option value="price-asc">价格: 从低到高</option>
        <option value="price-desc">价格: 从高到低</option>
        <option value="rating">评分: 最高</option>
        <option value="reviews">评论: 最多</option>
        <option value="newest">最新上架</option>
      </select>
      <div class="select-arrow">▼</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// Define props and emits
const props = defineProps<{
  modelValue: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

// Use computed property to sync with parent component
const sortOptionLocal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Emit change event with the current value
function emitChange() {
  emit('update:modelValue', sortOptionLocal.value);
}
</script>

<style scoped>
.product-sort {
  position: relative;
  width: 200px;
}

.select-container {
  position: relative;
  width: 100%;
}

.sort-select {
  appearance: none;
  width: 100%;
  padding: 10px 32px 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: white;
  color: var(--color-text);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sort-select:hover, .sort-select:focus {
  border-color: var(--color-primary);
  outline: none;
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--color-text-light);
  font-size: 0.7rem;
}
</style>
