<template>
  <aside class="sidebar" :class="{ 'sidebar--active': isActive }">
    <div class="sidebar__header">
      <h3 class="sidebar__title">Filter Options</h3>
      <button class="sidebar__close" @click="closeSidebar">&times;</button>
    </div>

    <div class="sidebar__content">
      <!-- Price Range Filter -->
      <div class="sidebar__section">
        <h4 class="sidebar__section-title">Price Range</h4>
        <div class="price-range">
          <div class="price-range__slider">
            <input 
              type="range" 
              min="0" 
              max="2000" 
              step="50" 
              v-model="priceRange.min" 
              class="price-range__input"
            />
            <input 
              type="range" 
              min="0" 
              max="2000" 
              step="50" 
              v-model="priceRange.max" 
              class="price-range__input"
            />
          </div>
          <div class="price-range__values">
            <span>${{ priceRange.min }}</span>
            <span>${{ priceRange.max }}</span>
          </div>
        </div>
      </div>

      <!-- Brand Filter -->
      <div class="sidebar__section">
        <h4 class="sidebar__section-title">Brands</h4>
        <div class="filter-group">
          <label class="checkbox" v-for="(brand, index) in brands" :key="index">
            <input type="checkbox" v-model="selectedBrands" :value="brand" />
            <span class="checkbox__label">{{ brand }}</span>
          </label>
        </div>
      </div>

      <!-- Features Filter -->
      <div class="sidebar__section">
        <h4 class="sidebar__section-title">Features</h4>
        <div class="filter-group">
          <label class="checkbox" v-for="(feature, index) in features" :key="index">
            <input type="checkbox" v-model="selectedFeatures" :value="feature" />
            <span class="checkbox__label">{{ feature }}</span>
          </label>
        </div>
      </div>

      <!-- Storage Filter -->
      <div class="sidebar__section">
        <h4 class="sidebar__section-title">Storage</h4>
        <div class="filter-group">
          <label class="checkbox" v-for="(storage, index) in storageOptions" :key="index">
            <input type="checkbox" v-model="selectedStorage" :value="storage" />
            <span class="checkbox__label">{{ storage }}</span>
          </label>
        </div>
      </div>

      <!-- Ratings Filter -->
      <div class="sidebar__section">
        <h4 class="sidebar__section-title">Ratings</h4>
        <div class="filter-group ratings-filter">
          <label class="radio" v-for="rating in 5" :key="rating">
            <input 
              type="radio" 
              name="rating" 
              :value="rating" 
              v-model="selectedRating" 
            />
            <span class="radio__label">
              {{ rating }}+ <span class="stars">{{ '★'.repeat(rating) }}</span>
            </span>
          </label>
        </div>
      </div>

      <div class="sidebar__actions">
        <button class="btn btn-primary btn-block" @click="applyFilters">Apply Filters</button>
        <button class="btn btn-outline btn-block" @click="resetFilters">Reset All</button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits } from 'vue';

const emit = defineEmits(['filter', 'close']);

const isActive = ref(false);
const priceRange = reactive({
  min: 0,
  max: 1000
});

const brands = ref(['Apple', 'Samsung', 'Google', 'Xiaomi', 'OnePlus', 'Sony', 'Nokia', 'Motorola']);
const selectedBrands = ref([]);

const features = ref(['5G Ready', 'Water Resistant', 'Dual Camera', 'Face Recognition', 'Wireless Charging']);
const selectedFeatures = ref([]);

const storageOptions = ref(['64GB', '128GB', '256GB', '512GB', '1TB']);
const selectedStorage = ref([]);

const selectedRating = ref(0);

// Methods
function closeSidebar() {
  isActive.value = false;
  emit('close');
}

function applyFilters() {
  const filters = {
    priceRange: { ...priceRange },
    brands: [...selectedBrands.value],
    features: [...selectedFeatures.value],
    storage: [...selectedStorage.value],
    rating: selectedRating.value
  };

  emit('filter', filters);
  
  // On mobile, close the sidebar after applying filters
  if (window.innerWidth < 768) {
    closeSidebar();
  }
}

function resetFilters() {
  priceRange.min = 0;
  priceRange.max = 1000;
  selectedBrands.value = [];
  selectedFeatures.value = [];
  selectedStorage.value = [];
  selectedRating.value = 0;
  
  applyFilters();
}

// To be called from parent component
function openSidebar() {
  isActive.value = true;
}

// Expose methods to parent components
defineExpose({
  openSidebar,
  closeSidebar
});
</script>

<style scoped>
.sidebar {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 280px;
  padding: 1.5rem;
  height: 100%;
  overflow-y: auto;
}

.sidebar__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.sidebar__title {
  font-size: 1.2rem;
  color: #1a2b63;
  margin: 0;
  font-weight: 600;
}

.sidebar__close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  display: none;
}

.sidebar__section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.sidebar__section-title {
  font-size: 1rem;
  color: #1a2b63;
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: 500;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox,
.radio {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox__label,
.radio__label {
  margin-left: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

.price-range__slider {
  position: relative;
  height: 5px;
  margin-bottom: 1.5rem;
}

.price-range__input {
  position: absolute;
  width: 100%;
  height: 5px;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
}

.price-range__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #4d8bf8;
  cursor: pointer;
  pointer-events: auto;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.price-range__values {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #555;
}

.sidebar__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background-color: #1a2b63;
  color: white;
}

.btn-primary:hover {
  background-color: #0f1f4d;
}

.btn-outline {
  background-color: transparent;
  color: #1a2b63;
  border: 1px solid #1a2b63;
}

.btn-outline:hover {
  background-color: #f5f7ff;
}

.btn-block {
  width: 100%;
}

.stars {
  color: #ffc107;
}

/* Mobile styles */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    right: -300px;
    height: 100vh;
    z-index: 1000;
    transition: right 0.3s ease;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 0;
  }
  
  .sidebar--active {
    right: 0;
  }
  
  .sidebar__close {
    display: block;
  }
}
</style>
