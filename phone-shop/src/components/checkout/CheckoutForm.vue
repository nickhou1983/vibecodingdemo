<template>
  <div class="checkout-form">
    <form @submit.prevent="submitOrder" class="form-container">
      <div class="form-sections">
        <div class="shipping-section">
          <h2 class="section-title">收货信息</h2>
          <div class="shipping-address">
            <ShippingAddressForm 
              v-model="shippingDetails"
              :saved-addresses="savedAddresses"
              :loading="addressesLoading"
            />
          </div>
        </div>
        
        <div class="payment-section">
          <h2 class="section-title">支付方式</h2>
          <PaymentMethodSelector 
            v-model="paymentMethod" 
            :methods="paymentMethods"
          />
        </div>
        
        <div class="review-section">
          <h2 class="section-title">订单确认</h2>
          <div class="order-items">
            <div 
              v-for="item in cartItems" 
              :key="item.id" 
              class="order-item"
            >
              <div class="item-image">
                <img :src="item.image" :alt="item.name">
              </div>
              
              <div class="item-details">
                <div class="item-name">{{ item.name }}</div>
                <div v-if="item.color || item.storage" class="item-variant">
                  {{ [item.color, item.storage].filter(Boolean).join(', ') }}
                </div>
                <div class="item-quantity-price">
                  <span class="item-quantity">{{ item.quantity }}×</span>
                  <span class="item-price">¥{{ formatPrice(item.price) }}</span>
                </div>
              </div>
              
              <div class="item-total">
                ¥{{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>
          </div>

          <div class="coupon-section">
            <CouponCode @apply="applyCoupon" />
          </div>
        </div>
      </div>
      
      <div class="order-summary-section">
        <OrderSummary 
          :subtotal="subtotal"
          :tax="tax"
          :shipping="shipping"
          :discount="discount"
          :total="total"
        />
        
        <div class="submit-section">
          <Button 
            type="submit" 
            variant="primary" 
            class="submit-button"
            :loading="submitting"
            :disabled="!canSubmit"
          >
            提交订单
          </Button>
          
          <p class="terms-agreement">
            点击"提交订单"，即表示您同意我们的
            <a href="#" @click.prevent="showTerms">服务条款</a>
            和
            <a href="#" @click.prevent="showPrivacy">隐私政策</a>
          </p>
        </div>
      </div>
    </form>
    
    <Modal v-model="showTermsModal" title="服务条款">
      <div class="terms-modal-content">
        <p>这里是服务条款的内容...</p>
      </div>
    </Modal>
    
    <Modal v-model="showPrivacyModal" title="隐私政策">
      <div class="privacy-modal-content">
        <p>这里是隐私政策的内容...</p>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import ShippingAddressForm from './ShippingAddressForm.vue';
import PaymentMethodSelector from './PaymentMethodSelector.vue';
import OrderSummary from './OrderSummary.vue';
import CouponCode from './CouponCode.vue';
import Button from '@/components/common/Button.vue';
import Modal from '@/components/common/Modal.vue';

// Setup
const router = useRouter();
const cartStore = useCartStore();

// Define interfaces
interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  zipCode: string;
  isDefault: boolean;
}

interface ShippingDetails {
  addressId?: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  zipCode: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

// State
const shippingDetails = ref<ShippingDetails>({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  address: '',
  zipCode: ''
});

const savedAddresses = ref<Address[]>([]);
const addressesLoading = ref(true);
const paymentMethod = ref('alipay');
const discount = ref(0);
const submitting = ref(false);
const showTermsModal = ref(false);
const showPrivacyModal = ref(false);

// Payment methods
const paymentMethods: PaymentMethod[] = [
  { id: 'alipay', name: '支付宝', icon: '/images/payment/alipay.png' },
  { id: 'wechat', name: '微信支付', icon: '/images/payment/wechat.png' },
  { id: 'card', name: '银行卡', icon: '/images/payment/card.png' }
];

// Computed properties
const cartItems = computed(() => cartStore.items);

const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

const tax = computed(() => {
  // Assume tax is 13% of subtotal
  return subtotal.value * 0.13;
});

const shipping = computed(() => {
  // Free shipping for orders over ¥1000, otherwise ¥20
  return subtotal.value > 1000 ? 0 : 20;
});

const total = computed(() => {
  return subtotal.value + tax.value + shipping.value - discount.value;
});

const canSubmit = computed(() => {
  // Basic validation
  return (
    shippingDetails.value.name &&
    shippingDetails.value.phone &&
    shippingDetails.value.province &&
    shippingDetails.value.city &&
    shippingDetails.value.address &&
    paymentMethod.value
  );
});

// Methods
const formatPrice = (price: number): string => {
  return price.toLocaleString('zh-CN');
};

const fetchSavedAddresses = async () => {
  try {
    // In a real app, this would be an API call
    // For now, we'll simulate with mock data
    await new Promise(resolve => setTimeout(resolve, 600));
    
    savedAddresses.value = [
      {
        id: '1',
        name: '张三',
        phone: '13800138000',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        address: '科技园路1号',
        zipCode: '518000',
        isDefault: true
      },
      {
        id: '2',
        name: '张三',
        phone: '13800138001',
        province: '广东省',
        city: '广州市',
        district: '天河区',
        address: '天河路385号',
        zipCode: '510000',
        isDefault: false
      }
    ];
  } finally {
    addressesLoading.value = false;
  }
};

const applyCoupon = (value: number) => {
  discount.value = value;
};

const submitOrder = async () => {
  if (!canSubmit.value) return;
  
  submitting.value = true;
  
  try {
    // In a real app, you would submit the order to the backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear the cart
    await cartStore.clearCart();
    
    // Redirect to success page
    router.push({
      path: '/checkout/success',
      query: { 
        orderId: 'ORD' + Date.now().toString().slice(-8) 
      }
    });
  } catch (error) {
    console.error('Error submitting order:', error);
    // Handle error
  } finally {
    submitting.value = false;
  }
};

const showTerms = () => {
  showTermsModal.value = true;
};

const showPrivacy = () => {
  showPrivacyModal.value = true;
};

// Lifecycle hooks
onMounted(async () => {
  if (cartItems.value.length === 0) {
    // Redirect back to cart if it's empty
    router.push('/cart');
    return;
  }
  
  await fetchSavedAddresses();
  
  // If there's a default address, use it
  const defaultAddress = savedAddresses.value.find(addr => addr.isDefault);
  if (defaultAddress) {
    shippingDetails.value = {
      addressId: defaultAddress.id,
      name: defaultAddress.name,
      phone: defaultAddress.phone,
      province: defaultAddress.province,
      city: defaultAddress.city,
      district: defaultAddress.district,
      address: defaultAddress.address,
      zipCode: defaultAddress.zipCode
    };
  }
});
</script>

<style scoped>
.checkout-form {
  max-width: 1200px;
  margin: 0 auto;
}

.form-container {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--space-xl);
}

.form-sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-border-light);
  color: var(--color-text);
}

.shipping-section,
.payment-section,
.review-section {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  padding: var(--space-lg);
}

.order-items {
  margin-bottom: var(--space-lg);
}

.order-item {
  display: flex;
  align-items: center;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius);
  overflow: hidden;
  margin-right: var(--space-md);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-variant {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-bottom: 4px;
}

.item-quantity-price {
  font-size: 0.9rem;
}

.item-quantity {
  color: var(--color-text-light);
  margin-right: var(--space-xs);
}

.item-price {
  color: var(--color-text);
}

.item-total {
  font-weight: 600;
  color: var(--color-primary);
  margin-left: var(--space-md);
}

.coupon-section {
  margin-top: var(--space-lg);
}

.order-summary-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.submit-section {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  padding: var(--space-lg);
}

.submit-button {
  width: 100%;
  padding: var(--space-md);
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: var(--space-md);
}

.terms-agreement {
  font-size: 0.8rem;
  color: var(--color-text-light);
  text-align: center;
}

.terms-agreement a {
  color: var(--color-primary);
  text-decoration: none;
}

.terms-agreement a:hover {
  text-decoration: underline;
}

.terms-modal-content,
.privacy-modal-content {
  padding: var(--space-md) 0;
}

@media (max-width: 900px) {
  .form-container {
    grid-template-columns: 1fr;
  }
}
</style>
