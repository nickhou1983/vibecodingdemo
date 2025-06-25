<template>
  <header class="app-header">
    <div class="container app-header__container">
      <div class="app-header__logo">
        <router-link to="/">
          <img src="@/assets/logo.svg" alt="Phone Shop" class="app-header__logo-img" v-if="logoUrl" />
          <h1 v-else class="app-header__logo-text">Phone Shop</h1>
        </router-link>
      </div>

      <div class="app-header__search">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Search for phones..."
            v-model="searchQuery"
            @keyup.enter="handleSearch"
          >
          <button class="search-button" @click="handleSearch">
            <span class="search-icon">🔍</span>
          </button>
        </div>
      </div>

      <nav class="app-header__nav">
        <ul class="app-header__nav-list">
          <li class="app-header__nav-item">
            <router-link to="/categories" class="app-header__nav-link">Categories</router-link>
          </li>
          <li class="app-header__nav-item">
            <router-link to="/deals" class="app-header__nav-link">Deals</router-link>
          </li>
          <li class="app-header__nav-item">
            <router-link to="/support" class="app-header__nav-link">Support</router-link>
          </li>
          <li class="app-header__nav-item">
            <router-link to="/marketing" class="app-header__nav-link">Promotions</router-link>
          </li>
        </ul>
      </nav>

      <div class="app-header__actions">
        <div class="app-header__cart">
          <router-link to="/cart" class="cart-icon">
            <span class="cart-icon__badge" v-if="cartItemCount > 0">{{ cartItemCount }}</span>
            <span class="cart-icon__symbol">🛒</span>
          </router-link>
        </div>
        
        <div class="app-header__user">
          <template v-if="isLoggedIn">
            <div class="user-menu" @click="toggleUserMenu" ref="userMenuRef">
              <img v-if="user.avatar" :src="user.avatar" alt="User Avatar" class="user-avatar" />
              <span v-else class="user-icon">👤</span>
              <span class="user-name">{{ user.name }}</span>
              
              <div class="user-dropdown" v-if="userMenuOpen">
                <router-link to="/account" class="user-dropdown__link">My Account</router-link>
                <router-link to="/orders" class="user-dropdown__link">My Orders</router-link>
                <router-link to="/wishlist" class="user-dropdown__link">Wishlist</router-link>
                <div class="user-dropdown__divider"></div>
                <button class="user-dropdown__link user-dropdown__logout" @click="logout">
                  Logout
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="login-btn">Login</router-link>
            <router-link to="/register" class="register-btn">Register</router-link>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useCartStore } from '@/stores/cart';

// Props
const props = defineProps({
  logoUrl: {
    type: String,
    default: ''
  }
});

// Stores
const userStore = useUserStore();
const cartStore = useCartStore();
const router = useRouter();

// State
const searchQuery = ref('');
const userMenuOpen = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

// Computed properties
const isLoggedIn = computed(() => userStore.isAuthenticated);
const user = computed(() => userStore.currentUser);
const cartItemCount = computed(() => cartStore.itemCount);

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ 
      path: '/search', 
      query: { q: searchQuery.value.trim() } 
    });
  }
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

const closeUserMenu = (e: MouseEvent) => {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    userMenuOpen.value = false;
  }
};

const logout = () => {
  userStore.logout();
  userMenuOpen.value = false;
  router.push('/');
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', closeUserMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeUserMenu);
});
</script>

<style scoped>
.app-header {
  background-color: var(--text-light);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.app-header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  flex-wrap: wrap;
}

.app-header__logo {
  flex: 0 0 auto;
  margin-right: var(--space-lg);
}

.app-header__logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.app-header__logo-img {
  height: 40px;
}

.app-header__logo-text {
  color: var(--primary-blue);
  font-size: var(--font-size-xl);
  margin: 0;
}

.app-header__search {
  flex: 1 1 300px;
  max-width: 500px;
  margin: 0 var(--space-md);
}

.search-box {
  display: flex;
  position: relative;
  width: 100%;
}

.search-box input {
  flex: 1;
  border: 1px solid var(--gray-medium);
  border-radius: var(--border-radius-md);
  padding: 0.5rem 3rem 0.5rem 1rem;
  font-size: var(--font-size-md);
  width: 100%;
  transition: border-color var(--transition-fast);
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-blue);
}

.search-button {
  background: transparent;
  border: none;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--gray-dark);
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-header__nav {
  margin: 0 var(--space-md);
  display: flex;
}

.app-header__nav-list {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
}

.app-header__nav-item {
  margin: 0 var(--space-md);
}

.app-header__nav-link {
  color: var(--text-dark);
  font-weight: 500;
  text-decoration: none;
  transition: color var(--transition-fast);
  position: relative;
  padding-bottom: 3px;
}

.app-header__nav-link:hover,
.app-header__nav-link.router-link-active {
  color: var(--primary-blue);
}

.app-header__nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-blue);
  border-radius: 1px;
}

.app-header__actions {
  display: flex;
  align-items: center;
}

.app-header__cart {
  margin: 0 var(--space-md);
  position: relative;
}

.cart-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: var(--border-radius-round);
  transition: background-color var(--transition-fast);
  text-decoration: none;
}

.cart-icon:hover {
  background-color: var(--gray-light);
}

.cart-icon__badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--primary-blue);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
}

.app-header__user {
  display: flex;
  align-items: center;
}

.login-btn,
.register-btn {
  margin-left: var(--space-sm);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
  text-decoration: none;
}

.login-btn {
  color: var(--primary-blue);
}

.login-btn:hover {
  background-color: var(--light-blue);
}

.register-btn {
  background-color: var(--primary-blue);
  color: white;
}

.register-btn:hover {
  background-color: var(--primary-blue-dark);
}

.user-menu {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-fast);
  position: relative;
}

.user-menu:hover {
  background-color: var(--gray-light);
}

.user-icon,
.user-avatar {
  margin-right: var(--space-xs);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-round);
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  width: 180px;
  overflow: hidden;
  z-index: 1000;
  margin-top: var(--space-xs);
}

.user-dropdown__link {
  display: block;
  padding: var(--space-sm) var(--space-md);
  color: var(--text-dark);
  text-decoration: none;
  transition: background-color var(--transition-fast);
}

.user-dropdown__link:hover {
  background-color: var(--gray-light);
}

.user-dropdown__divider {
  height: 1px;
  background-color: var(--gray-light);
  margin: var(--space-xs) 0;
}

.user-dropdown__logout {
  color: var(--error);
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-md);
}

@media (max-width: 992px) {
  .app-header__nav {
    display: none;
  }
}

@media (max-width: 768px) {
  .app-header__container {
    flex-wrap: wrap;
  }
  
  .app-header__logo {
    flex: 0 0 50%;
    margin-right: 0;
    margin-bottom: var(--space-md);
  }
  
  .app-header__actions {
    flex: 0 0 50%;
    justify-content: flex-end;
    margin-bottom: var(--space-md);
  }
  
  .app-header__search {
    flex: 1 1 100%;
    max-width: 100%;
    margin: 0 0 var(--space-md);
    order: 3;
  }
}
</style>
