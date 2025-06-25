<template>
  <div class="storage-selector">
    <div 
      v-for="option in options" 
      :key="option.id"
      class="storage-option"
      :class="{ active: modelValue === option.id }"
      @click="selectStorage(option.id)"
    >
      <div class="storage-name">{{ option.name }}</div>
      <div class="storage-price" v-if="option.price">¥{{ formatPrice(option.price) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StorageOption {
  id: string;
  name: string;
  price?: number;
}

const props = defineProps({
  options: {
    type: Array as () => StorageOption[],
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const selectStorage = (storageId: string) => {
  emit('update:modelValue', storageId);
};

const formatPrice = (price: number) => {
  return price.toLocaleString('zh-CN');
};
</script>

<style scoped>
.storage-selector {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.storage-option {
  padding: var(--space-md);
  border: 1px solid var(--gray-medium);
  border-radius: var(--border-radius-sm);
  min-width: 80px;
  text-align: center;
  cursor: pointer;
  transition: var(--transition-fast);
}

.storage-option:hover {
  border-color: var(--primary-blue-light);
  background-color: var(--light-blue);
}

.storage-option.active {
  border-color: var(--primary-blue);
  background-color: var(--light-blue);
}

.storage-name {
  font-weight: 500;
  color: var(--text-dark);
}

.storage-option.active .storage-name {
  color: var(--primary-blue);
}

.storage-price {
  margin-top: var(--space-xs);
  font-size: var(--font-size-sm);
  color: var(--gray-dark);
}

.storage-option.active .storage-price {
  color: var(--primary-blue);
}
</style>
