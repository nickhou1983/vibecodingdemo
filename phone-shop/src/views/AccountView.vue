<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import UserProfile from '@/components/user/UserProfile.vue';
import OrderHistory from '@/components/user/OrderHistory.vue';
import AddressList from '@/components/user/AddressList.vue';
import WishList from '@/components/user/WishList.vue';
import Notification from '@/components/user/Notification.vue';
import OrderDetail from '@/components/user/OrderDetail.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const activeTab = ref(route.params.tab || 'profile');
const orderId = ref(route.params.orderId || null);

// Array of available tabs
const tabs = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'orders', label: 'Orders', icon: '📦' },
  { id: 'addresses', label: 'Addresses', icon: '📍' },
  { id: 'wishlist', label: 'Wishlist', icon: '❤️' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
];

// Check if user is authenticated
const isAuthenticated = computed(() => userStore.isAuthenticated);
const userId = computed(() => userStore.user?.id);

// Methods
const setActiveTab = (tabId: string) => {
  activeTab.value = tabId;
  orderId.value = null;
  router.push(`/account/${tabId}`);
};

const viewOrderDetails = (id: string) => {
  orderId.value = id;
  router.push(`/account/orders/${id}`);
};

const backToOrders = () => {
  orderId.value = null;
  router.push('/account/orders');
};

// Check authentication status on mount
onMounted(() => {
  if (!isAuthenticated.value) {
    router.push({ path: '/auth', query: { redirect: route.fullPath } });
  }
  
  // Set active tab based on route
  if (route.params.tab) {
    activeTab.value = route.params.tab as string;
  }
  
  if (route.params.orderId) {
    orderId.value = route.params.orderId as string;
  }
});
</script>

<template>
  <div v-if="isAuthenticated" class="account-view">
    <div class="account-container">
      <aside class="account-sidebar">
        <h2 class="account-title">My Account</h2>
        
        <nav class="account-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="account-nav-item"
            :class="{ 'account-nav-item--active': activeTab === tab.id }"
            @click="setActiveTab(tab.id)"
          >
            <span class="account-nav-icon">{{ tab.icon }}</span>
            <span class="account-nav-label">{{ tab.label }}</span>
          </button>
          
          <button 
            class="account-nav-item account-logout"
            @click="userStore.logout()"
          >
            <span class="account-nav-icon">🚪</span>
            <span class="account-nav-label">Logout</span>
          </button>
        </nav>
      </aside>
      
      <main class="account-content">
        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'" class="account-tab-content">
          <h1 class="account-page-title">Profile</h1>
          <UserProfile :userId="userId" />
        </div>
        
        <!-- Orders Tab -->
        <div v-else-if="activeTab === 'orders'" class="account-tab-content">
          <template v-if="orderId">
            <div class="account-page-header">
              <button class="btn-back" @click="backToOrders">
                ← Back to Orders
              </button>
              <h1 class="account-page-title">Order Details</h1>
            </div>
            <OrderDetail :orderId="orderId" />
          </template>
          <template v-else>
            <h1 class="account-page-title">Order History</h1>
            <OrderHistory :userId="userId" @view-details="viewOrderDetails" />
          </template>
        </div>
        
        <!-- Addresses Tab -->
        <div v-else-if="activeTab === 'addresses'" class="account-tab-content">
          <h1 class="account-page-title">Addresses</h1>
          <AddressList :userId="userId" />
        </div>
        
        <!-- Wishlist Tab -->
        <div v-else-if="activeTab === 'wishlist'" class="account-tab-content">
          <h1 class="account-page-title">My Wishlist</h1>
          <WishList :userId="userId" />
        </div>
        
        <!-- Notifications Tab -->
        <div v-else-if="activeTab === 'notifications'" class="account-tab-content">
          <h1 class="account-page-title">Notifications</h1>
          <Notification :userId="userId" />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.account-view {
  width: 100%;
  padding: var(--space-lg);
}

.account-container {
  display: flex;
  gap: var(--space-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.account-sidebar {
  flex: 0 0 250px;
  background-color: white;
  border-radius: var(--border-radius-md);
  padding: var(--space-lg);
  box-shadow: var(--shadow-sm);
  height: fit-content;
  position: sticky;
  top: 20px;
}

.account-title {
  font-size: var(--font-size-lg);
  color: var(--text-dark);
  margin-top: 0;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--gray-light);
}

.account-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.account-nav-item {
  display: flex;
  align-items: center;
  padding: var(--space-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  color: var(--text-dark);
  text-align: left;
}

.account-nav-item:hover {
  background-color: var(--light-blue);
}

.account-nav-item--active {
  background-color: var(--primary-blue);
  color: white;
}

.account-nav-icon {
  margin-right: var(--space-md);
  font-size: var(--font-size-lg);
}

.account-logout {
  margin-top: var(--space-lg);
  border-top: 1px solid var(--gray-light);
  padding-top: var(--space-lg);
  color: var(--gray-dark);
}

.account-content {
  flex: 1;
  min-width: 0; /* Fixes overflow issues */
}

.account-tab-content {
  background-color: white;
  border-radius: var(--border-radius-md);
  padding: var(--space-xl);
  box-shadow: var(--shadow-sm);
}

.account-page-title {
  font-size: var(--font-size-xl);
  color: var(--text-dark);
  margin-top: 0;
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--gray-light);
}

.account-page-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-xl);
}

.btn-back {
  background: none;
  border: none;
  color: var(--primary-blue);
  cursor: pointer;
  font-weight: 600;
  padding: var(--space-sm) var(--space-md);
  margin-right: var(--space-md);
  border-radius: var(--border-radius-sm);
  transition: background-color var(--transition-fast);
}

.btn-back:hover {
  background-color: var(--light-blue);
}

@media (max-width: 768px) {
  .account-container {
    flex-direction: column;
  }
  
  .account-sidebar {
    flex: 0 0 auto;
    position: static;
  }
  
  .account-nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }
  
  .account-nav-item {
    padding: var(--space-sm);
    flex: 1 0 auto;
    min-width: calc(50% - var(--space-xs));
    justify-content: center;
  }
  
  .account-logout {
    margin-top: var(--space-sm);
    padding-top: var(--space-sm);
    width: 100%;
  }
  
  .account-nav-icon {
    margin-right: var(--space-xs);
  }
  
  .account-tab-content {
    padding: var(--space-md);
  }
}
</style>
