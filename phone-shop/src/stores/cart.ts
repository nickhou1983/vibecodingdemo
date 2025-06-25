import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface AddItemPayload {
  productId: string;
  variantId?: string;
  quantity: number;
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Calculate total items in cart
  const itemCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });
  
  // Calculate subtotal
  const subtotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });
  
  // Get cart item by id
  const getItem = (itemId: string) => {
    return items.value.find(item => item.id === itemId);
  };
  
  // Add item to cart
  const addItem = async (payload: AddItemPayload) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate a unique ID for the cart item - in a real app, this would come from the API
      const itemId = `${payload.productId}${payload.variantId ? `-${payload.variantId}` : ''}`;
      
      // Check if item already exists in cart
      const existingItem = items.value.find(item => item.id === itemId);
      
      if (existingItem) {
        // Update quantity if item exists
        existingItem.quantity += payload.quantity;
      } else {
        // In a real app, we would fetch product details from the API
        // For now, we'll create a mock item
        const newItem: CartItem = {
          id: itemId,
          productId: payload.productId,
          variantId: payload.variantId,
          name: `Product ${payload.productId}`,  // Mock name
          price: 999,  // Mock price
          image: `/images/products/default.jpg`,  // Mock image
          quantity: payload.quantity
        };
        
        items.value.push(newItem);
      }
      
      return { success: true };
    } catch (err) {
      error.value = 'Failed to add item to cart';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const item = items.value.find(item => item.id === itemId);
      
      if (!item) {
        throw new Error('Item not found');
      }
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return removeItem(itemId);
      }
      
      item.quantity = quantity;
      
      return { success: true };
    } catch (err) {
      error.value = 'Failed to update item quantity';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Remove item from cart
  const removeItem = async (itemId: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const index = items.value.findIndex(item => item.id === itemId);
      
      if (index === -1) {
        throw new Error('Item not found');
      }
      
      items.value.splice(index, 1);
      
      return { success: true };
    } catch (err) {
      error.value = 'Failed to remove item from cart';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Clear cart
  const clearCart = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      items.value = [];
      
      return { success: true };
    } catch (err) {
      error.value = 'Failed to clear cart';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };
  
  return {
    items,
    isLoading,
    error,
    itemCount,
    subtotal,
    getItem,
    addItem,
    updateQuantity,
    removeItem,
    clearCart
  };
});
