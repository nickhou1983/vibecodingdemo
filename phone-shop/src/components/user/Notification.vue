<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  date: string;
  read: boolean;
  link?: string;
}

const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  limit: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['read', 'read-all', 'delete', 'delete-all']);

const notifications = ref<Notification[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showUnreadOnly = ref(false);

// Mock data
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'success',
    title: 'Order Shipped',
    message: 'Your order #ORD-123456 has been shipped. Estimated delivery date is November 20, 2023.',
    date: '2023-11-15T14:30:00Z',
    read: false,
    link: '/account/orders/ORD-123456'
  },
  {
    id: 'notif-2',
    type: 'info',
    title: 'Price Drop',
    message: 'Good news! An item in your wishlist "Samsung Galaxy S21" is now on sale.',
    date: '2023-11-14T09:45:00Z',
    read: true,
    link: '/products/samsung-galaxy-s21'
  },
  {
    id: 'notif-3',
    type: 'warning',
    title: 'Limited Stock',
    message: 'The iPhone 13 Pro in your cart is selling quickly. Only 3 left in stock!',
    date: '2023-11-13T18:20:00Z',
    read: false,
    link: '/products/iphone-13-pro'
  },
  {
    id: 'notif-4',
    type: 'error',
    title: 'Payment Failed',
    message: 'Your recent payment method was declined. Please update your payment information.',
    date: '2023-11-10T11:10:00Z',
    read: true,
    link: '/account/payment-methods'
  },
  {
    id: 'notif-5',
    type: 'info',
    title: 'New Release',
    message: 'The new Google Pixel 6 is now available. Be the first to get it!',
    date: '2023-11-08T15:30:00Z',
    read: true,
    link: '/products/google-pixel-6'
  }
];

const fetchNotifications = () => {
  loading.value = true;
  
  // Simulate API call
  setTimeout(() => {
    try {
      notifications.value = mockNotifications;
    } catch (err) {
      error.value = 'Failed to load notifications';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }, 500);
};

const filteredNotifications = computed(() => {
  let result = [...notifications.value];
  
  if (showUnreadOnly.value) {
    result = result.filter(notif => !notif.read);
  }
  
  // Sort by date (newest first)
  result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Apply limit if specified
  if (props.limit > 0) {
    result = result.slice(0, props.limit);
  }
  
  return result;
});

const unreadCount = computed(() => {
  return notifications.value.filter(notif => !notif.read).length;
});

const formatDate = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Today
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    // Yesterday
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays < 7) {
    // Days ago
    return `${diffDays} days ago`;
  } else {
    // Full date
    return date.toLocaleDateString();
  }
};

const markAsRead = (id: string) => {
  const notification = notifications.value.find(n => n.id === id);
  if (notification && !notification.read) {
    notification.read = true;
    emit('read', id);
  }
};

const markAllAsRead = () => {
  notifications.value.forEach(notif => {
    if (!notif.read) {
      notif.read = true;
    }
  });
  emit('read-all');
};

const deleteNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index !== -1) {
    notifications.value.splice(index, 1);
    emit('delete', id);
  }
};

const deleteAllNotifications = () => {
  notifications.value = [];
  emit('delete-all');
};

onMounted(() => {
  fetchNotifications();
});
</script>

<template>
  <div class="notification-component" :class="{ 'notification-component--limited': props.limit > 0 }">
    <div v-if="!props.limit" class="notification-header">
      <h2 class="notification-title">
        Notifications
        <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
      </h2>
      
      <div class="notification-controls">
        <div class="notification-filter">
          <input 
            type="checkbox" 
            id="unread-filter" 
            v-model="showUnreadOnly" 
          />
          <label for="unread-filter">Show unread only</label>
        </div>
        
        <div class="notification-actions">
          <button 
            v-if="unreadCount > 0"
            class="btn btn-text"
            @click="markAllAsRead"
          >
            Mark all as read
          </button>
          
          <button 
            v-if="filteredNotifications.length > 0"
            class="btn btn-text btn-danger"
            @click="deleteAllNotifications"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="notification-loading">
      <div class="loading-indicator"></div>
      <p>Loading notifications...</p>
    </div>
    
    <div v-else-if="error" class="notification-error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="filteredNotifications.length === 0" class="notification-empty">
      <p>{{ showUnreadOnly ? 'No unread notifications.' : 'No notifications.' }}</p>
    </div>
    
    <div v-else class="notification-list">
      <div 
        v-for="notification in filteredNotifications" 
        :key="notification.id"
        class="notification-item"
        :class="{
          'notification-item--unread': !notification.read,
          [`notification-item--${notification.type}`]: true
        }"
        @click="notification.link ? $router.push(notification.link) : null"
      >
        <div class="notification-icon" :class="`notification-icon--${notification.type}`">
          <span v-if="notification.type === 'info'">ℹ️</span>
          <span v-if="notification.type === 'success'">✓</span>
          <span v-if="notification.type === 'warning'">⚠️</span>
          <span v-if="notification.type === 'error'">✗</span>
        </div>
        
        <div class="notification-content">
          <div class="notification-header-row">
            <h3 class="notification-item-title">{{ notification.title }}</h3>
            <span class="notification-date">{{ formatDate(notification.date) }}</span>
          </div>
          
          <p class="notification-message">{{ notification.message }}</p>
          
          <div class="notification-item-actions">
            <button 
              v-if="!notification.read"
              class="btn btn-text btn-sm"
              @click.stop="markAsRead(notification.id)"
            >
              Mark as read
            </button>
            <button 
              v-if="notification.link"
              class="btn btn-text btn-sm"
              @click.stop="$router.push(notification.link)"
            >
              View details
            </button>
            <button 
              class="btn btn-text btn-sm btn-danger"
              @click.stop="deleteNotification(notification.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="props.limit > 0 && filteredNotifications.length > 0" class="view-all-link">
      <button class="btn btn-text" @click="$router.push('/account/notifications')">
        View All Notifications
        <span v-if="unreadCount > 0">
          ({{ unreadCount }} unread)
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.notification-component {
  width: 100%;
}

.notification-component--limited {
  max-width: 400px;
}

.notification-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.notification-title {
  font-size: var(--font-size-xl);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.unread-badge {
  background-color: var(--primary-blue);
  color: white;
  border-radius: var(--border-radius-round);
  padding: 0 var(--space-sm);
  font-size: var(--font-size-sm);
  min-width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.notification-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.notification-filter {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.notification-actions {
  display: flex;
  gap: var(--space-sm);
}

.notification-loading,
.notification-error,
.notification-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
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

.notification-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.notification-item {
  display: flex;
  background-color: white;
  border-radius: var(--border-radius-md);
  padding: var(--space-md);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  border-left: 4px solid transparent;
}

.notification-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.notification-item--unread {
  background-color: var(--light-blue);
}

.notification-item--info {
  border-left-color: var(--info);
}

.notification-item--success {
  border-left-color: var(--success);
}

.notification-item--warning {
  border-left-color: var(--warning);
}

.notification-item--error {
  border-left-color: var(--error);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--space-md);
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.notification-icon--info {
  background-color: var(--light-blue);
  color: var(--info);
}

.notification-icon--success {
  background-color: #E8F5E9;
  color: var(--success);
}

.notification-icon--warning {
  background-color: #FFF3E0;
  color: var(--warning);
}

.notification-icon--error {
  background-color: #FFEBEE;
  color: var(--error);
}

.notification-content {
  flex: 1;
}

.notification-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-xs);
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.notification-item-title {
  margin: 0;
  font-size: var(--font-size-md);
}

.notification-date {
  font-size: var(--font-size-sm);
  color: var(--gray-dark);
}

.notification-message {
  margin: 0 0 var(--space-sm) 0;
  color: var(--text-dark);
}

.notification-item-actions {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.view-all-link {
  display: flex;
  justify-content: center;
  margin-top: var(--space-md);
}

.btn {
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.btn-sm {
  font-size: var(--font-size-sm);
}

.btn-text {
  background-color: transparent;
  color: var(--primary-blue);
  padding: var(--space-xs);
  text-decoration: none;
}

.btn-text:hover {
  color: var(--primary-blue-dark);
  text-decoration: underline;
}

.btn-danger {
  color: var(--error);
}

.btn-danger:hover {
  color: #b71c1c;
}

@media (max-width: 768px) {
  .notification-header {
    gap: var(--space-sm);
  }
  
  .notification-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }
  
  .notification-item {
    padding: var(--space-sm);
  }
  
  .notification-icon {
    width: 32px;
    height: 32px;
    margin-right: var(--space-sm);
  }
}
</style>
