import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useWishlistStore = defineStore('wishlist', () => {
  const items = ref<(string | number)[]>([]);

  // Computed
  const isInWishlist = (productId: string | number) => {
    return items.value.includes(productId);
  };

  // Actions
  const addToWishlist = (productId: string | number) => {
    if (!isInWishlist(productId)) {
      items.value.push(productId);
    }
  };

  const removeFromWishlist = (productId: string | number) => {
    const index = items.value.indexOf(productId);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  };

  const clearWishlist = () => {
    items.value = [];
  };

  return {
    items,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist
  };
});
