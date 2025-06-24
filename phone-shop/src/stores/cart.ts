import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface CartItem {
  id: string | number;
  quantity: number;
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  
  // Computed
  const itemCount = () => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  };

  // Actions
  const addItem = async (productId: string | number, quantity = 1) => {
    // In a real app, we might call an API endpoint here
    const existingItem = items.value.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.value.push({ id: productId, quantity });
    }
  };

  const removeItem = (productId: string | number) => {
    const index = items.value.findIndex(item => item.id === productId);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    const item = items.value.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  };

  const clearCart = () => {
    items.value = [];
  };

  return {
    items,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
});
