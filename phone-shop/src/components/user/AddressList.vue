<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Address {
  id: string;
  isDefault: boolean;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  type: 'shipping' | 'billing' | 'both';
}

const props = defineProps({
  userId: {
    type: String,
    required: true
  },
  editable: {
    type: Boolean,
    default: true
  },
  selectMode: {
    type: Boolean,
    default: false
  },
  filter: {
    type: String,
    default: 'all' // 'all', 'shipping', 'billing'
  }
});

const emit = defineEmits(['select', 'add', 'edit', 'remove', 'default']);

const addresses = ref<Address[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const selectedAddress = ref<string>('');

// Mock data for demonstration
const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    isDefault: true,
    fullName: 'John Doe',
    line1: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'United States',
    phone: '(555) 123-4567',
    type: 'both'
  },
  {
    id: 'addr-2',
    isDefault: false,
    fullName: 'John Doe',
    line1: '456 Market St',
    line2: 'Apt 2B',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94103',
    country: 'United States',
    phone: '(555) 123-4567',
    type: 'shipping'
  },
  {
    id: 'addr-3',
    isDefault: false,
    fullName: 'Jane Doe',
    line1: '789 Work Ave',
    city: 'Palo Alto',
    state: 'CA',
    postalCode: '94301',
    country: 'United States',
    phone: '(555) 987-6543',
    type: 'billing'
  }
];

const fetchAddresses = () => {
  loading.value = true;
  
  // Simulate API call to fetch user addresses
  setTimeout(() => {
    try {
      // In a real app, we would fetch addresses for the given user ID
      addresses.value = mockAddresses;
      
      // If in select mode, preselect the default address
      if (props.selectMode) {
        const defaultAddr = addresses.value.find(addr => addr.isDefault);
        if (defaultAddr) {
          selectedAddress.value = defaultAddr.id;
        }
      }
    } catch (err) {
      error.value = 'Failed to load addresses';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }, 500);
};

const filteredAddresses = computed(() => {
  if (props.filter === 'all') {
    return addresses.value;
  }
  
  return addresses.value.filter(addr => 
    addr.type === props.filter || addr.type === 'both'
  );
});

const selectAddress = (addressId: string) => {
  if (!props.selectMode) return;
  
  selectedAddress.value = addressId;
  const selected = addresses.value.find(addr => addr.id === addressId);
  if (selected) {
    emit('select', selected);
  }
};

const addNewAddress = () => {
  emit('add');
};

const editAddress = (address: Address) => {
  emit('edit', address);
};

const removeAddress = (addressId: string) => {
  emit('remove', addressId);
};

const setDefaultAddress = (addressId: string) => {
  emit('default', addressId);
};

onMounted(() => {
  fetchAddresses();
});
</script>

<template>
  <div class="address-list">
    <div class="address-list__header">
      <h2 class="address-list__title">Your Addresses</h2>
      <button
        v-if="props.editable"
        class="btn btn-primary"
        @click="addNewAddress"
      >
        Add New Address
      </button>
    </div>
    
    <div v-if="loading" class="address-list__loading">
      <div class="loading-indicator"></div>
      <p>Loading addresses...</p>
    </div>
    
    <div v-else-if="error" class="address-list__error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="filteredAddresses.length === 0" class="address-list__empty">
      <p>No addresses found.</p>
      <button
        v-if="props.editable"
        class="btn btn-primary"
        @click="addNewAddress"
      >
        Add New Address
      </button>
    </div>
    
    <div v-else class="address-list__grid">
      <div
        v-for="address in filteredAddresses"
        :key="address.id"
        class="address-card"
        :class="{
          'address-card--selected': selectedAddress === address.id,
          'address-card--default': address.isDefault
        }"
        @click="selectAddress(address.id)"
      >
        <div v-if="address.isDefault" class="default-badge">Default</div>
        
        <div class="address-card__content">
          <p class="address-name">{{ address.fullName }}</p>
          <p>{{ address.line1 }}</p>
          <p v-if="address.line2">{{ address.line2 }}</p>
          <p>{{ address.city }}, {{ address.state }} {{ address.postalCode }}</p>
          <p>{{ address.country }}</p>
          <p>{{ address.phone }}</p>
          
          <div class="address-type">
            <span v-if="address.type === 'shipping'" class="address-type-badge shipping">
              Shipping
            </span>
            <span v-if="address.type === 'billing'" class="address-type-badge billing">
              Billing
            </span>
            <span v-if="address.type === 'both'" class="address-type-badge both">
              Shipping & Billing
            </span>
          </div>
        </div>
        
        <div v-if="props.editable || props.selectMode" class="address-card__footer">
          <div v-if="props.editable" class="address-actions">
            <button
              class="btn btn-secondary btn-sm"
              @click.stop="editAddress(address)"
            >
              Edit
            </button>
            <button
              class="btn btn-danger btn-sm"
              @click.stop="removeAddress(address.id)"
            >
              Remove
            </button>
            <button
              v-if="!address.isDefault"
              class="btn btn-text btn-sm"
              @click.stop="setDefaultAddress(address.id)"
            >
              Set as Default
            </button>
          </div>
          
          <div v-if="props.selectMode" class="address-select">
            <input
              type="radio"
              :name="'address-select'"
              :id="`address-${address.id}`"
              :value="address.id"
              v-model="selectedAddress"
              @change="selectAddress(address.id)"
            />
            <label :for="`address-${address.id}`">
              {{ selectedAddress === address.id ? 'Selected' : 'Select' }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.address-list {
  width: 100%;
}

.address-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.address-list__title {
  font-size: var(--font-size-xl);
  margin: 0;
  color: var(--text-dark);
}

.address-list__loading,
.address-list__error,
.address-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  text-align: center;
  color: var(--gray-dark);
}

.address-list__empty {
  gap: var(--space-lg);
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

.address-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.address-card {
  background-color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--space-md);
  position: relative;
  transition: box-shadow var(--transition-fast), transform var(--transition-fast);
  border: 2px solid transparent;
  overflow: hidden;
}

.address-card:hover {
  box-shadow: var(--shadow-md);
}

.address-card--selected {
  border-color: var(--primary-blue);
  box-shadow: var(--shadow-md);
}

.address-card--default {
  border-color: var(--success);
}

.default-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--success);
  color: white;
  padding: var(--space-xs) var(--space-md);
  font-size: var(--font-size-xs);
  font-weight: 600;
  border-bottom-left-radius: var(--border-radius-md);
}

.address-card__content {
  margin-bottom: var(--space-md);
}

.address-card__content p {
  margin: var(--space-xs) 0;
}

.address-name {
  font-weight: 600;
  font-size: var(--font-size-md);
  margin-top: 0;
  color: var(--text-dark);
}

.address-type {
  margin-top: var(--space-sm);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.address-type-badge {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.address-type-badge.shipping {
  background-color: var(--light-blue);
  color: var(--primary-blue);
}

.address-type-badge.billing {
  background-color: #FFF3E0;
  color: var(--warning);
}

.address-type-badge.both {
  background-color: #E8F5E9;
  color: var(--success);
}

.address-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--gray-light);
  padding-top: var(--space-md);
}

.address-actions {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.address-select {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.address-select label {
  cursor: pointer;
}

.address-select input[type="radio"] {
  cursor: pointer;
}

.btn {
  padding: var(--space-sm) var(--space-lg);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.btn-sm {
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-sm);
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

.btn-danger {
  background-color: #FFEBEE;
  color: var(--error);
}

.btn-danger:hover {
  background-color: #FFCDD2;
}

.btn-text {
  background-color: transparent;
  color: var(--primary-blue);
  text-decoration: underline;
  padding: var(--space-xs);
}

.btn-text:hover {
  color: var(--primary-blue-dark);
}

@media (max-width: 768px) {
  .address-list__header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }
  
  .address-list__grid {
    grid-template-columns: 1fr;
  }
}
</style>
