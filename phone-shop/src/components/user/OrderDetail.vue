<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { computed } from 'vue';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  storage?: string;
}

interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: {
    type: string;
    last4?: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  subtotal: number;
  shipping: number;
  tax: number;
}

const props = defineProps({
  orderId: {
    type: String,
    required: true
  }
});

const order = ref<Order | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Mock data for demonstration
const mockOrder: Order = {
  id: 'ORD-123456',
  date: '2023-11-15T10:30:00Z',
  status: 'shipped',
  items: [
    {
      id: 'ITEM-1',
      productId: 'iphone-13-pro',
      name: 'iPhone 13 Pro',
      price: 999.99,
      quantity: 1,
      image: '/images/products/iphone-13-pro.jpg',
      color: 'Graphite',
      storage: '256GB'
    },
    {
      id: 'ITEM-2',
      productId: 'case-iphone',
      name: 'iPhone 13 Pro Case',
      price: 49.99,
      quantity: 2,
      image: '/images/products/iphone-case.jpg',
      color: 'Black'
    }
  ],
  shippingAddress: {
    fullName: 'John Doe',
    line1: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'United States',
    phone: '(555) 123-4567'
  },
  billingAddress: {
    fullName: 'John Doe',
    line1: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'United States',
    phone: '(555) 123-4567'
  },
  paymentMethod: {
    type: 'credit_card',
    last4: '4242'
  },
  trackingNumber: 'TRK98765432',
  estimatedDelivery: '2023-11-20T00:00:00Z',
  subtotal: 1099.97,
  shipping: 0,
  tax: 90.75,
  total: 1190.72
};

const loadOrder = () => {
  loading.value = true;
  error.value = null;
  
  // Simulate API call
  setTimeout(() => {
    try {
      // In a real app, we would fetch the order with the given ID
      if (props.orderId === 'ORD-123456') {
        order.value = mockOrder;
      } else {
        error.value = 'Order not found';
      }
    } catch (err) {
      error.value = 'Failed to load order details';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }, 800);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
};

const getStatusClass = (status: string) => {
  const statusClasses = {
    'processing': 'status-processing',
    'shipped': 'status-shipped',
    'delivered': 'status-delivered',
    'cancelled': 'status-cancelled',
  };
  return statusClasses[status as keyof typeof statusClasses];
};

const orderDate = computed(() => {
  return order.value ? formatDate(order.value.date) : '';
});

const estimatedDeliveryDate = computed(() => {
  return order.value?.estimatedDelivery ? formatDate(order.value.estimatedDelivery) : 'N/A';
});

onMounted(() => {
  loadOrder();
});
</script>

<template>
  <div class="order-detail">
    <div v-if="loading" class="order-detail__loading">
      <div class="loading-indicator"></div>
      <p>Loading order details...</p>
    </div>
    
    <div v-else-if="error" class="order-detail__error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="!order" class="order-detail__not-found">
      <p>Order not found.</p>
    </div>
    
    <div v-else class="order-detail__content">
      <!-- Order Header -->
      <div class="order-detail__header">
        <div class="order-detail__title-section">
          <h2 class="order-detail__title">
            Order #{{ order.id }}
          </h2>
          <p class="order-detail__date">
            Placed on {{ orderDate }}
          </p>
        </div>
        
        <div class="order-status-container">
          <span 
            class="order-status" 
            :class="getStatusClass(order.status)"
          >
            {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
          </span>
        </div>
      </div>
      
      <!-- Order Progress Tracker (for shipped/processing orders) -->
      <div v-if="order.status === 'shipped' || order.status === 'processing'" class="order-progress">
        <div class="order-progress__header">
          <h3 class="section-title">Order Progress</h3>
          <div v-if="order.trackingNumber" class="tracking-info">
            <span class="label">Tracking:</span>
            <span class="tracking-number">{{ order.trackingNumber }}</span>
          </div>
        </div>
        
        <div class="order-progress__timeline">
          <div class="progress-step completed">
            <div class="step-icon">✓</div>
            <div class="step-content">
              <h4>Order Placed</h4>
              <p>{{ orderDate }}</p>
            </div>
          </div>
          
          <div class="progress-step completed">
            <div class="step-icon">✓</div>
            <div class="step-content">
              <h4>Processing</h4>
              <p>Order has been processed</p>
            </div>
          </div>
          
          <div class="progress-step" :class="{ 'completed': order.status === 'shipped' }">
            <div class="step-icon">{{ order.status === 'shipped' ? '✓' : '●' }}</div>
            <div class="step-content">
              <h4>Shipped</h4>
              <p v-if="order.status === 'shipped'">
                Your order is on the way
              </p>
              <p v-else>
                Preparing for shipment
              </p>
            </div>
          </div>
          
          <div class="progress-step">
            <div class="step-icon">●</div>
            <div class="step-content">
              <h4>Delivered</h4>
              <p>
                Estimated delivery: {{ estimatedDeliveryDate }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Order Items -->
      <div class="order-detail__items">
        <h3 class="section-title">Order Items</h3>
        
        <div class="order-items-list">
          <div 
            v-for="item in order.items" 
            :key="item.id"
            class="order-item"
          >
            <img 
              :src="item.image" 
              :alt="item.name"
              class="order-item__image"
            />
            
            <div class="order-item__info">
              <h4 class="order-item__name">{{ item.name }}</h4>
              <div class="order-item__details">
                <span v-if="item.color" class="order-item__color">{{ item.color }}</span>
                <span v-if="item.storage" class="order-item__storage">{{ item.storage }}</span>
              </div>
            </div>
            
            <div class="order-item__quantity">
              Qty: {{ item.quantity }}
            </div>
            
            <div class="order-item__price">
              ${{ (item.price * item.quantity).toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Order Summary & Addresses -->
      <div class="order-detail__summary-section">
        <div class="order-addresses">
          <div class="address-card">
            <h3 class="section-title">Shipping Address</h3>
            <div class="address-content">
              <p class="name">{{ order.shippingAddress.fullName }}</p>
              <p>{{ order.shippingAddress.line1 }}</p>
              <p v-if="order.shippingAddress.line2">{{ order.shippingAddress.line2 }}</p>
              <p>
                {{ order.shippingAddress.city }}, 
                {{ order.shippingAddress.state }} 
                {{ order.shippingAddress.postalCode }}
              </p>
              <p>{{ order.shippingAddress.country }}</p>
              <p>{{ order.shippingAddress.phone }}</p>
            </div>
          </div>
          
          <div class="address-card">
            <h3 class="section-title">Payment Information</h3>
            <div class="address-content">
              <p>
                <strong>Method:</strong> 
                {{ order.paymentMethod.type === 'credit_card' ? 'Credit Card' : order.paymentMethod.type }}
              </p>
              <p v-if="order.paymentMethod.last4">
                <strong>Card:</strong> •••• {{ order.paymentMethod.last4 }}
              </p>
              <div class="divider"></div>
              <p class="name">{{ order.billingAddress.fullName }}</p>
              <p>{{ order.billingAddress.line1 }}</p>
              <p v-if="order.billingAddress.line2">{{ order.billingAddress.line2 }}</p>
              <p>
                {{ order.billingAddress.city }}, 
                {{ order.billingAddress.state }} 
                {{ order.billingAddress.postalCode }}
              </p>
              <p>{{ order.billingAddress.country }}</p>
            </div>
          </div>
          
          <div class="order-summary-card">
            <h3 class="section-title">Order Summary</h3>
            <div class="order-summary">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>${{ order.subtotal.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span>{{ order.shipping > 0 ? `$${order.shipping.toFixed(2)}` : 'Free' }}</span>
              </div>
              <div class="summary-row">
                <span>Tax</span>
                <span>${{ order.tax.toFixed(2) }}</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>${{ order.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Order Actions -->
      <div class="order-detail__actions">
        <button class="btn btn-primary">
          {{ order.status === 'delivered' ? 'Buy Again' : 'Contact Support' }}
        </button>
        
        <button 
          v-if="order.status === 'processing'" 
          class="btn btn-secondary"
        >
          Cancel Order
        </button>
        
        <button class="btn btn-secondary">Print Receipt</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-detail {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.order-detail__loading,
.order-detail__error,
.order-detail__not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  text-align: center;
  color: var(--gray-dark);
}

.loading-indicator {
  width: 40px;
  height: 40px;
  border: 4px solid var(--light-blue);
  border-top: 4px solid var(--primary-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--space-md);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.order-detail__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.order-detail__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-detail__title {
  font-size: var(--font-size-xl);
  margin: 0;
  margin-bottom: var(--space-xs);
}

.order-detail__date {
  color: var(--gray-dark);
  margin: 0;
}

.order-status {
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.status-processing {
  background-color: var(--info);
  color: white;
}

.status-shipped {
  background-color: var(--warning);
  color: white;
}

.status-delivered {
  background-color: var(--success);
  color: white;
}

.status-cancelled {
  background-color: var(--gray-dark);
  color: white;
}

.section-title {
  font-size: var(--font-size-md);
  margin-top: 0;
  margin-bottom: var(--space-md);
  color: var(--text-dark);
  border-bottom: 1px solid var(--gray-light);
  padding-bottom: var(--space-sm);
}

.order-progress {
  background-color: white;
  border-radius: var(--border-radius-md);
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
}

.order-progress__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.tracking-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.label {
  font-weight: 600;
}

.tracking-number {
  background-color: var(--gray-light);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--border-radius-sm);
  font-family: monospace;
}

.order-progress__timeline {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: var(--space-lg) 0;
}

.order-progress__timeline::before {
  content: '';
  position: absolute;
  top: 24px;
  left: 30px;
  right: 30px;
  height: 2px;
  background-color: var(--gray-light);
  z-index: 0;
}

.progress-step {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  flex: 1;
}

.step-icon {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-round);
  background-color: white;
  border: 2px solid var(--gray-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-sm);
  color: var(--gray-medium);
}

.progress-step.completed .step-icon {
  background-color: var(--primary-blue);
  border-color: var(--primary-blue);
  color: white;
}

.step-content {
  text-align: center;
  max-width: 150px;
}

.step-content h4 {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-dark);
}

.step-content p {
  margin: var(--space-xs) 0 0;
  font-size: var(--font-size-xs);
  color: var(--gray-dark);
}

.order-detail__items {
  background-color: white;
  border-radius: var(--border-radius-md);
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
}

.order-items-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.order-item {
  display: flex;
  align-items: center;
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--gray-light);
}

.order-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.order-item__image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-right: var(--space-md);
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius-sm);
  padding: var(--space-xs);
}

.order-item__info {
  flex: 1;
}

.order-item__name {
  margin: 0 0 var(--space-xs) 0;
  font-size: var(--font-size-md);
}

.order-item__details {
  display: flex;
  gap: var(--space-md);
  color: var(--gray-dark);
  font-size: var(--font-size-sm);
}

.order-item__quantity,
.order-item__price {
  font-weight: 600;
  padding: 0 var(--space-md);
}

.order-detail__summary-section {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.order-addresses {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-md);
  width: 100%;
}

.address-card {
  background-color: white;
  border-radius: var(--border-radius-md);
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
}

.address-content p {
  margin: var(--space-xs) 0;
}

.address-content .name {
  font-weight: 600;
}

.divider {
  height: 1px;
  background-color: var(--gray-light);
  margin: var(--space-md) 0;
}

.order-summary-card {
  background-color: white;
  border-radius: var(--border-radius-md);
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
}

.order-summary {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-xs) 0;
  font-size: var(--font-size-md);
}

.summary-row.total {
  font-weight: 700;
  font-size: var(--font-size-lg);
  border-top: 1px solid var(--gray-light);
  padding-top: var(--space-md);
  margin-top: var(--space-xs);
}

.order-detail__actions {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  margin-top: var(--space-md);
}

.btn {
  padding: var(--space-sm) var(--space-lg);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  flex: 1;
  min-width: 150px;
  max-width: 200px;
}

.btn-primary {
  background-color: var(--primary-blue);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-blue-dark);
}

.btn-secondary {
  background-color: var(--light-blue);
  color: var(--primary-blue);
}

.btn-secondary:hover {
  background-color: var(--primary-blue-light);
}

@media (max-width: 768px) {
  .order-detail__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }
  
  .order-progress__timeline {
    flex-direction: column;
    gap: var(--space-md);
    margin-left: var(--space-lg);
  }
  
  .order-progress__timeline::before {
    top: 24px;
    left: -20px;
    width: 2px;
    height: calc(100% - 48px);
    background-color: var(--gray-light);
  }
  
  .progress-step {
    flex-direction: row;
    align-items: flex-start;
  }
  
  .step-content {
    text-align: left;
    margin-left: var(--space-md);
  }
  
  .order-item {
    flex-wrap: wrap;
  }
  
  .order-item__quantity,
  .order-item__price {
    padding: var(--space-sm) 0 0 0;
    margin-left: 96px; /* Image width + margin */
  }
  
  .order-detail__actions {
    justify-content: center;
  }
  
  .btn {
    max-width: none;
  }
}
</style>
