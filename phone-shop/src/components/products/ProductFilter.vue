<template>
  <div class="product-filter">
    <h3 class="filter-title">筛选条件</h3>
    
    <div class="filter-section">
      <h4>品牌</h4>
      <div class="filter-options">
        <label v-for="brand in brands" :key="brand.id" class="filter-checkbox">
          <input 
            type="checkbox" 
            :value="brand.id" 
            v-model="selectedBrands"
            @change="applyFilters"
          />
          <span class="filter-label">{{ brand.name }}</span>
          <span class="filter-count">({{ brand.count }})</span>
        </label>
      </div>
    </div>
    
    <div class="filter-section">
      <h4>价格范围</h4>
      <div class="price-range">
        <div class="price-inputs">
          <input 
            type="number" 
            v-model.number="priceRange.min" 
            placeholder="最低价" 
            class="price-input"
            @change="applyFilters"
          />
          <span class="price-separator">至</span>
          <input 
            type="number" 
            v-model.number="priceRange.max" 
            placeholder="最高价" 
            class="price-input"
            @change="applyFilters"
          />
        </div>
        <div class="price-slider">
          <input 
            type="range"
            min="0"
            :max="maxPrice"
            v-model.number="priceRange.min"
            class="range-slider"
            @change="applyFilters"
          />
          <input 
            type="range"
            :min="priceRange.min"
            :max="maxPrice"
            v-model.number="priceRange.max"
            class="range-slider"
            @change="applyFilters"
          />
        </div>
      </div>
    </div>
    
    <div class="filter-section">
      <h4>内存容量</h4>
      <div class="filter-options">
        <label v-for="storage in storageOptions" :key="storage.value" class="filter-checkbox">
          <input 
            type="checkbox" 
            :value="storage.value" 
            v-model="selectedStorage"
            @change="applyFilters"
          />
          <span class="filter-label">{{ storage.label }}</span>
          <span class="filter-count">({{ storage.count }})</span>
        </label>
      </div>
    </div>
    
    <div class="filter-section">
      <h4>功能特性</h4>
      <div class="filter-options">
        <label v-for="feature in features" :key="feature.id" class="filter-checkbox">
          <input 
            type="checkbox" 
            :value="feature.id" 
            v-model="selectedFeatures"
            @change="applyFilters"
          />
          <span class="filter-label">{{ feature.name }}</span>
          <span class="filter-count">({{ feature.count }})</span>
        </label>
      </div>
    </div>
    
    <div class="filter-actions">
      <button class="btn-reset" @click="resetFilters">重置筛选</button>
      <button class="btn-apply" @click="applyFilters">应用筛选</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

interface Brand {
  id: string;
  name: string;
  count: number;
}

interface StorageOption {
  value: string;
  label: string;
  count: number;
}

interface Feature {
  id: string;
  name: string;
  count: number;
}

interface PriceRange {
  min: number;
  max: number;
}

interface FilterOptions {
  brands: string[];
  priceRange: PriceRange;
  storage: string[];
  features: string[];
}

const props = defineProps({
  initialFilters: {
    type: Object as () => Partial<FilterOptions>,
    default: () => ({})
  },
  maxPrice: {
    type: Number,
    default: 10000
  }
});

const emit = defineEmits(['filter-change']);

// Filter data
const brands = ref<Brand[]>([
  { id: 'apple', name: 'Apple', count: 12 },
  { id: 'samsung', name: 'Samsung', count: 10 },
  { id: 'xiaomi', name: '小米', count: 8 },
  { id: 'huawei', name: '华为', count: 7 },
  { id: 'oppo', name: 'OPPO', count: 6 }
]);

const storageOptions = ref<StorageOption[]>([
  { value: '64', label: '64GB', count: 20 },
  { value: '128', label: '128GB', count: 30 },
  { value: '256', label: '256GB', count: 15 },
  { value: '512', label: '512GB', count: 8 },
  { value: '1024', label: '1TB', count: 3 }
]);

const features = ref<Feature[]>([
  { id: '5g', name: '5G', count: 35 },
  { id: 'wireless_charging', name: '无线充电', count: 25 },
  { id: 'face_id', name: '面容识别', count: 20 },
  { id: 'fingerprint', name: '指纹识别', count: 30 },
  { id: 'water_resistant', name: '防水', count: 18 }
]);

// Selected filter states
const selectedBrands = ref<string[]>([]);
const selectedStorage = ref<string[]>([]);
const selectedFeatures = ref<string[]>([]);
const priceRange = reactive<PriceRange>({
  min: 0,
  max: props.maxPrice
});

// Initialize filters from props or URL params
onMounted(() => {
  if (props.initialFilters) {
    if (props.initialFilters.brands) {
      selectedBrands.value = [...props.initialFilters.brands];
    }
    if (props.initialFilters.storage) {
      selectedStorage.value = [...props.initialFilters.storage];
    }
    if (props.initialFilters.features) {
      selectedFeatures.value = [...props.initialFilters.features];
    }
    if (props.initialFilters.priceRange) {
      priceRange.min = props.initialFilters.priceRange.min || 0;
      priceRange.max = props.initialFilters.priceRange.max || props.maxPrice;
    }
  }
});

// Apply filter changes
const applyFilters = () => {
  emit('filter-change', {
    brands: selectedBrands.value,
    priceRange: {
      min: priceRange.min,
      max: priceRange.max
    },
    storage: selectedStorage.value,
    features: selectedFeatures.value
  });
};

// Reset all filters
const resetFilters = () => {
  selectedBrands.value = [];
  selectedStorage.value = [];
  selectedFeatures.value = [];
  priceRange.min = 0;
  priceRange.max = props.maxPrice;
  
  applyFilters();
};

// Expose methods to parent component
defineExpose({
  resetFilters,
  applyFilters
});
</script>

<style scoped>
.product-filter {
  background-color: white;
  padding: var(--space-lg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.filter-title {
  margin-top: 0;
  margin-bottom: var(--space-lg);
  color: var(--text-dark);
  font-size: var(--font-size-lg);
  border-bottom: 1px solid var(--gray-light);
  padding-bottom: var(--space-sm);
}

.filter-section {
  margin-bottom: var(--space-lg);
}

.filter-section h4 {
  margin-top: 0;
  margin-bottom: var(--space-sm);
  color: var(--text-dark);
  font-size: var(--font-size-md);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.filter-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.filter-checkbox input {
  margin-right: var(--space-sm);
}

.filter-label {
  color: var(--text-dark);
}

.filter-count {
  margin-left: var(--space-sm);
  color: var(--gray-medium);
  font-size: var(--font-size-sm);
}

.price-range {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.price-input {
  flex: 1;
  padding: var(--space-sm);
  border: 1px solid var(--gray-medium);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
}

.price-separator {
  color: var(--gray-medium);
}

.price-slider {
  position: relative;
  height: 20px;
}

.range-slider {
  position: absolute;
  width: 100%;
  top: 0;
  height: 5px;
  background: none;
  pointer-events: none;
}

.range-slider::-webkit-slider-thumb {
  pointer-events: auto;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: var(--primary-blue);
  cursor: pointer;
}

.filter-actions {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.btn-reset,
.btn-apply {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn-reset {
  background-color: transparent;
  border: 1px solid var(--gray-medium);
  color: var(--gray-dark);
}

.btn-reset:hover {
  background-color: var(--gray-light);
}

.btn-apply {
  background-color: var(--primary-blue);
  border: none;
  color: white;
  flex: 1;
}

.btn-apply:hover {
  background-color: var(--primary-blue-dark);
}
</style>
