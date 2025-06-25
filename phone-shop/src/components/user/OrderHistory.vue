<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

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

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  trackingNumber?: string;
}

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
});

const router = useRouter();
const orders = ref<Order[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedStatus = ref<string>('all');

// Mock data
const mockOrders: Order[] = [
  {
    id: 'ORD-123456',
    date: '2023-11-15T10:30:00Z',
    total: 1099.98,
    status: 'delivered',
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
    trackingNumber: 'TRK98765432'
  },
  {
    id: 'ORD-789012',
    date: '2023-10-27T14:15:00Z',
    total: 699.99,
    status: 'shipped',
    items: [
      {
        id: 'ITEM-3',
        productId: 'pixel-6',
        name: 'Google Pixel 6',
        price: 699.99,
        quantity: 1,
        image: '/images/products/pixel-6.jpg',
        color: 'Sorta Seafoam',
        storage: '128GB'
      }
    ],
    trackingNumber: 'TRK12345678'
  },
  {
    id: 'ORD-345678',
    date: '2023-12-01T09:45:00Z',
    total: 849.99,
    status: 'processing',
    items: [
      {
        id: 'ITEM-4',
        productId: 'galaxy-s21',
        name: 'Samsung Galaxy S21',
        price: 799.99,
        quantity: 1,
        image: '/images/products/samsung-s21.jpg',
        color: 'Phantom Gray',
        storage: '256GB'
      },
      {
        id: 'ITEM-5',
        productId: 'wireless-charger',
        name: 'Wireless Charging Pad',
        price: 49.99,
        quantity: 1,
        image: '/images/products/wireless-charger.jpg'
      }
    ]
  },
  {
    id: 'ORD-901234',
    date: '2023-09-18T16:20:00Z',
    total: 1199.99,
    status: 'cancelled',
    items: [
      {
        id: 'ITEM-6',
        productId: 'iphone-13-pro-max',
        name: 'iPhone 13 Pro Max',
        price: 1199.99,
        quantity: 1,
        image: '/images/products/iphone-13-pro-max.jpg',
        color: 'Gold',
        storage: '512GB'
      }
    ]
  }
];

const loadOrders = () => {
  loading.value = true;
  error.value = null;
  
  // Simulate API call
  setTimeout(() => {
    try {
      orders.value = mockOrders;
    } catch (err) {
      error.value = 'Failed to load order history';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }, 800);
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

const filteredOrders = computed(() => {
  if (selectedStatus.value === 'all') {
    return orders.value;
  }
  return orders.value.filter(order => order.status === selectedStatus.value);
});

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
};

const viewOrderDetails = (orderId: string) => {
  router.push(`/account/orders/${orderId}`);
};

onMounted(() => {
  loadOrders();
});
</script>

<template>
  <div class="order-history">
    <div class="order-history__header">
      <h2 class="order-history__title">Order History</h2>
      
      <div class="order-history__filters">
        <label for="status-filter">Filter by status:</label>
        <select 
          id="status-filter" 
          v-model="selectedStatus" 
          class="status-filter"
        >
          <option value="all">All Orders</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
    
    <div v-if="loading" class="order-history__loading">
      <div class="loading-indicator"></div>
      <p>Loading order history...</p>
    </div>
    
    <div v-else-if="error" class="order-history__error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="filteredOrders.length === 0" class="order-history__empty">
      <p v-if="selectedStatus === 'all'">
        You haven't placed any orders yet.
      </p>
      <p v-else>
        No {{ selectedStatus }} orders found.
      </p>
    </div>
    
    <div v-else class="order-history__list">
      <div 
        v-for="order in filteredOrders" 
        :key="order.id"
        class="order-card"
      >
        <div class="order-card__header">
          <div class="order-info">
            <h3 class="order-id">Order #{{ order.id }}</h3>
            <p class="order-date">{{ formatDate(order.date) }}</p>
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
        
        <div class="order-card__items">
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
                <span class="order-item__quantity">Qty: {{ item.quantity }}</span>
              </div>
              <p class="order-item__price">${{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
          </div>
        </div>
        
        <div class="order-card__footer">
          <div class="order-total">
            <span>Total:</span>
            <strong>${{ order.total.toFixed(2) }}</strong>
          </div>
          
          <div class="order-actions">
            <button 
              class="btn btn-primary"
              @click="viewOrderDetails(order.id)"
            >
              View Details
            </button>
            
            <button 
              v-if="order.status === 'delivered'"
              class="btn btn-secondary"
            >
              Buy Again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-history {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.order-history__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.order-history__title {
  font-size: var(--font-size-xl);
  color: var(--text-dark);
  margin: 0;
}

.order-history__filters {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.status-filter {
  padding: var(--space-sm);
  border: 1px solid var(--gray-medium);
  border-radius: var(--border-radius-sm);
  background-color: white;
  color: var(--text-dark);
  font-size: var(--font-size-md);
}

.order-history__loading,
.order-history__error,
.order-history__empty {
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

.order-history__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.order-card {
  background-color: white;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.order-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  background-color: var(--gray-light);
  border-bottom: 1px solid var(--gray-medium);
}

.order-info {
  flex: 1;
}

.order-id {
  font-size: var(--font-size-md);
  margin: 0;
  margin-bottom: var(--space-xs);
}

.order-date {
  font-size: var(--font-size-sm);
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

.order-card__items {
  padding: var(--space-md);
  border-bottom: 1px solid var(--gray-light);
}

.order-item {
  display: flex;
  margin-bottom: var(--space-md);
}

.order-item:last-child {
  margin-bottom: 0;
}

.order-item__image {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border: 1px solid var(--gray-light);
  border-radius: var(--border-radius-sm);
  margin-right: var(--space-md);
}

.order-item__info {
  flex: 1;
}

.order-item__name {
  font-size: var(--font-size-md);
  margin: 0;
  margin-bottom: var(--space-xs);
}

.order-item__details {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-xs);
  font-size: var(--font-size-sm);
  color: var(--gray-dark);
}

.order-item__price {
  font-weight: 600;
  margin: 0;
}

.order-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
}

.order-total {
  font-size: var(--font-size-md);
}

.order-total strong {
  margin-left: var(--space-sm);
  color: var(--text-dark);
}

.order-actions {
  display: flex;
  gap: var(--space-md);
}

.btn {
  padding: var(--space-sm) var(--space-lg);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
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
  .order-history__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }
  
  .order-card__footer {
    flex-direction: column;
    gap: var(--space-md);
    align-items: flex-start;
  }
  
  .order-actions {
    width: 100%;
  }
  
  .btn {
    flex: 1;
    text-align: center;
  }
}
</style>
