<template>
  <div class="cart-actions">
    <Button variant="primary" class="checkout-button" @click="goToCheckout">
      去结算
    </Button>
    
    <Button variant="outline" class="continue-button" @click="continueShopping">
      继续购物
    </Button>
    
    <Button 
      variant="text" 
      class="clear-button" 
      @click="confirmClearCart" 
      v-if="canClearCart"
    >
      清空购物车
    </Button>
    
    <Modal v-model="showClearCartModal" title="确认清空购物车">
      <div class="clear-cart-modal">
        <p>确定要清空购物车吗？此操作无法撤销。</p>
        <div class="modal-actions">
          <Button variant="outline" @click="showClearCartModal = false">
            取消
          </Button>
          <Button variant="danger" @click="clearCart">
            确认清空
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import Button from '@/components/common/Button.vue';
import Modal from '@/components/common/Modal.vue';

// Setup
const router = useRouter();
const cartStore = useCartStore();

// State
const showClearCartModal = ref(false);

// Computed
const canClearCart = computed(() => cartStore.items.length > 0);

// Methods
const goToCheckout = () => {
  router.push('/checkout');
};

const continueShopping = () => {
  router.push('/products');
};

const confirmClearCart = () => {
  showClearCartModal.value = true;
};

const clearCart = async () => {
  await cartStore.clearCart();
  showClearCartModal.value = false;
};
</script>

<style scoped>
.cart-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.checkout-button {
  width: 100%;
  padding: var(--space-md);
  font-weight: 600;
  font-size: 1rem;
}

.continue-button,
.clear-button {
  width: 100%;
}

.clear-cart-modal {
  padding: var(--space-md) 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-lg);
}
</style>
