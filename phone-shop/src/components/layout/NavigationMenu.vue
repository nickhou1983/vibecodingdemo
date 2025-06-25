<template>
  <nav class="navigation-menu" :class="{ 'is-mobile-active': isMobileMenuActive }">
    <div class="navigation-menu__container container">
      <ul class="navigation-menu__list">
        <li class="navigation-menu__item" v-for="(category, index) in categories" :key="index">
          <a 
            class="navigation-menu__link" 
            href="#" 
            @click.prevent="openDropdown(index)"
            @mouseenter="openDropdown(index)"
            @mouseleave="startCloseTimer(index)"
            :class="{ 'active': activeDropdown === index }"
          >
            {{ category.name }}
            <span class="navigation-menu__arrow">▼</span>
          </a>
          
          <div class="navigation-menu__dropdown" 
            v-if="activeDropdown === index" 
            @mouseenter="cancelCloseTimer"
            @mouseleave="startCloseTimer(index)"
          >
            <div class="navigation-menu__dropdown-content">
              <div class="navigation-menu__dropdown-column" v-for="(column, colIndex) in category.columns" :key="colIndex">
                <h4 class="navigation-menu__dropdown-title">{{ column.title }}</h4>
                <ul class="navigation-menu__dropdown-list">
                  <li v-for="(item, itemIndex) in column.items" :key="itemIndex">
                    <router-link :to="item.link">{{ item.name }}</router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    
    <button class="navigation-menu__mobile-toggle" @click="toggleMobileMenu">
      <span class="navigation-menu__mobile-icon"></span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const categories = ref([
  {
    name: 'Brands',
    columns: [
      {
        title: 'Popular Brands',
        items: [
          { name: 'Apple', link: '/brands/apple' },
          { name: 'Samsung', link: '/brands/samsung' },
          { name: 'Google', link: '/brands/google' },
          { name: 'Xiaomi', link: '/brands/xiaomi' },
          { name: 'OnePlus', link: '/brands/oneplus' }
        ]
      },
      {
        title: 'Other Brands',
        items: [
          { name: 'Sony', link: '/brands/sony' },
          { name: 'Nokia', link: '/brands/nokia' },
          { name: 'Motorola', link: '/brands/motorola' },
          { name: 'Huawei', link: '/brands/huawei' },
          { name: 'Oppo', link: '/brands/oppo' }
        ]
      }
    ]
  },
  {
    name: 'Price Range',
    columns: [
      {
        title: 'By Price',
        items: [
          { name: 'Under $300', link: '/price-range/under-300' },
          { name: '$300 - $600', link: '/price-range/300-600' },
          { name: '$600 - $1000', link: '/price-range/600-1000' },
          { name: 'Over $1000', link: '/price-range/over-1000' },
          { name: 'All Prices', link: '/price-range/all' }
        ]
      }
    ]
  },
  {
    name: 'Features',
    columns: [
      {
        title: 'Special Features',
        items: [
          { name: '5G Ready', link: '/features/5g' },
          { name: 'High Camera Quality', link: '/features/camera' },
          { name: 'Gaming Phones', link: '/features/gaming' },
          { name: 'Long Battery Life', link: '/features/battery' },
          { name: 'Water Resistant', link: '/features/water-resistant' }
        ]
      }
    ]
  },
  {
    name: 'Deals',
    columns: [
      {
        title: 'Special Offers',
        items: [
          { name: 'Clearance', link: '/deals/clearance' },
          { name: 'Bundle Offers', link: '/deals/bundles' },
          { name: 'Trade-In Deals', link: '/deals/trade-in' },
          { name: 'Student Discount', link: '/deals/student' },
          { name: 'Limited Time Offers', link: '/deals/limited' }
        ]
      }
    ]
  }
]);

const activeDropdown = ref<number | null>(null);
const isMobileMenuActive = ref(false);
let closeTimer: number | null = null;

function openDropdown(index: number) {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  activeDropdown.value = index;
}

function startCloseTimer(index: number) {
  if (closeTimer) {
    clearTimeout(closeTimer);
  }
  closeTimer = window.setTimeout(() => {
    if (activeDropdown.value === index) {
      activeDropdown.value = null;
    }
  }, 300);
}

function cancelCloseTimer() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}

function toggleMobileMenu() {
  isMobileMenuActive.value = !isMobileMenuActive.value;
}
</script>

<style scoped>
.navigation-menu {
  background-color: #0c1c4c;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: relative;
  z-index: 100;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

.navigation-menu__container {
  display: flex;
  justify-content: center;
}

.navigation-menu__list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.navigation-menu__item {
  position: relative;
}

.navigation-menu__link {
  display: flex;
  align-items: center;
  color: #fff;
  padding: 1rem 1.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
}

.navigation-menu__link:hover,
.navigation-menu__link.active {
  background-color: #1c2e6d;
}

.navigation-menu__arrow {
  font-size: 0.6rem;
  margin-left: 0.4rem;
}

.navigation-menu__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 250px;
  background-color: #fff;
  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
  border-radius: 0 0 4px 4px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
}

.navigation-menu__item:hover .navigation-menu__dropdown,
.navigation-menu__dropdown[style*="display: block"] {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.navigation-menu__dropdown-content {
  display: flex;
  padding: 1.5rem;
}

.navigation-menu__dropdown-column {
  flex: 1;
  min-width: 200px;
  padding: 0 1rem;
}

.navigation-menu__dropdown-title {
  color: #1a2b63;
  margin-top: 0;
  margin-bottom: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 1px solid #e5e9f2;
  padding-bottom: 0.5rem;
}

.navigation-menu__dropdown-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.navigation-menu__dropdown-list li {
  margin-bottom: 0.5rem;
}

.navigation-menu__dropdown-list a {
  color: #555;
  text-decoration: none;
  transition: color 0.2s;
  font-size: 0.9rem;
  display: block;
  padding: 0.3rem 0;
}

.navigation-menu__dropdown-list a:hover {
  color: #4d8bf8;
}

.navigation-menu__mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 1rem;
}

.navigation-menu__mobile-icon {
  display: block;
  position: relative;
  width: 24px;
  height: 2px;
  background-color: #fff;
  transition: background-color 0.3s;
}

.navigation-menu__mobile-icon::before,
.navigation-menu__mobile-icon::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background-color: #fff;
  transition: transform 0.3s;
}

.navigation-menu__mobile-icon::before {
  top: -6px;
}

.navigation-menu__mobile-icon::after {
  top: 6px;
}

/* Mobile styles */
@media (max-width: 768px) {
  .navigation-menu__container {
    display: none;
  }
  
  .navigation-menu__mobile-toggle {
    display: block;
    position: absolute;
    right: 1rem;
    top: 1rem;
  }
  
  .navigation-menu.is-mobile-active .navigation-menu__container {
    display: block;
  }
  
  .navigation-menu.is-mobile-active .navigation-menu__list {
    flex-direction: column;
  }
  
  .navigation-menu.is-mobile-active .navigation-menu__dropdown {
    position: static;
    box-shadow: none;
    opacity: 1;
    visibility: visible;
    transform: none;
    margin-left: 1rem;
  }
  
  .navigation-menu.is-mobile-active .navigation-menu__dropdown-content {
    flex-direction: column;
    padding: 0.5rem 0;
  }
  
  .navigation-menu.is-mobile-active .navigation-menu__mobile-icon {
    background-color: transparent;
  }
  
  .navigation-menu.is-mobile-active .navigation-menu__mobile-icon::before {
    transform: translateY(6px) rotate(45deg);
  }
  
  .navigation-menu.is-mobile-active .navigation-menu__mobile-icon::after {
    transform: translateY(-6px) rotate(-45deg);
  }
}
</style>
