import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCompareStore = defineStore('compare', () => {
  const items = ref<(string | number)[]>([]);
  const maxItems = 4; // Maximum number of items to compare

  // Computed
  const isInCompareList = (productId: string | number) => {
    return items.value.includes(productId);
  };

  const isFull = () => {
    return items.value.length >= maxItems;
  };

  // Actions
  const addToCompare = (productId: string | number) => {
    if (!isInCompareList(productId) && !isFull()) {
      items.value.push(productId);
    }
  };

  const removeFromCompare = (productId: string | number) => {
    const index = items.value.indexOf(productId);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  };

  const clearCompare = () => {
    items.value = [];
  };

  return {
    items,
    maxItems,
    isInCompareList,
    isFull,
    addToCompare,
    removeFromCompare,
    clearCompare
  };
});
