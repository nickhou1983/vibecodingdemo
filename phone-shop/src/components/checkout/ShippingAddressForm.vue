<template>
  <div class="shipping-address-form">
    <div v-if="savedAddresses.length > 0" class="saved-addresses">
      <h3 class="saved-addresses-title">选择保存的地址</h3>
      <div v-if="loading" class="loading-addresses">
        <LoadingSpinner size="small" />
      </div>
      <div v-else class="address-list">
        <div 
          v-for="address in savedAddresses" 
          :key="address.id"
          class="address-item"
          :class="{ active: selectedAddressId === address.id }"
          @click="selectAddress(address)"
        >
          <div class="address-info">
            <div class="address-header">
              <span class="address-name">{{ address.name }}</span>
              <span class="address-phone">{{ address.phone }}</span>
              <span v-if="address.isDefault" class="default-badge">默认</span>
            </div>
            <div class="address-details">
              {{ formatAddress(address) }}
            </div>
          </div>
          <div class="address-radio">
            <div class="radio-circle" :class="{ selected: selectedAddressId === address.id }"></div>
          </div>
        </div>
      </div>
      
      <div class="divider">
        <span class="divider-text">或</span>
      </div>
    </div>
    
    <div class="new-address-form">
      <h3 class="form-title">添加新地址</h3>
      <div class="form-row">
        <div class="form-group">
          <label for="name">收货人</label>
          <input 
            id="name" 
            type="text" 
            v-model="formData.name" 
            placeholder="请输入收货人姓名" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="phone">手机号码</label>
          <input 
            id="phone" 
            type="tel" 
            v-model="formData.phone" 
            placeholder="请输入手机号码" 
            required
          />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="province">省份</label>
          <select id="province" v-model="formData.province" required>
            <option value="" disabled>请选择省份</option>
            <option v-for="province in provinces" :key="province" :value="province">
              {{ province }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="city">城市</label>
          <select 
            id="city" 
            v-model="formData.city" 
            required
            :disabled="!formData.province"
          >
            <option value="" disabled>请选择城市</option>
            <option v-for="city in filteredCities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="district">区/县</label>
          <select 
            id="district" 
            v-model="formData.district" 
            :disabled="!formData.city"
          >
            <option value="" disabled>请选择区/县</option>
            <option v-for="district in filteredDistricts" :key="district" :value="district">
              {{ district }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label for="address">详细地址</label>
        <textarea 
          id="address" 
          v-model="formData.address" 
          placeholder="请输入详细地址，如街道、门牌号等" 
          required
          rows="3"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="zipCode">邮政编码</label>
        <input 
          id="zipCode" 
          type="text" 
          v-model="formData.zipCode" 
          placeholder="邮政编码（可选）"
        />
      </div>
      
      <div class="form-actions">
        <Button 
          variant="outline" 
          @click="resetForm" 
          v-if="selectedAddressId || (!isEmpty(formData))"
        >
          重置
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          @click="saveAddress"
          v-if="!selectedAddressId && !isEmpty(formData)"
        >
          保存为常用地址
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import Button from '@/components/common/Button.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

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

interface FormData {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  zipCode: string;
}

// Define props
const props = defineProps<{
  modelValue: {
    addressId?: string;
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    address: string;
    zipCode: string;
  };
  savedAddresses: Address[];
  loading?: boolean;
}>();

// Define emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: {
    addressId?: string;
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    address: string;
    zipCode: string;
  }): void;
  (e: 'save-address', address: FormData): void;
}>();

// State
const selectedAddressId = ref(props.modelValue.addressId || '');
const formData = reactive<FormData>({
  name: props.modelValue.name || '',
  phone: props.modelValue.phone || '',
  province: props.modelValue.province || '',
  city: props.modelValue.city || '',
  district: props.modelValue.district || '',
  address: props.modelValue.address || '',
  zipCode: props.modelValue.zipCode || ''
});

// Mock data for locations
const provinces = ['广东省', '北京市', '上海市', '江苏省', '浙江省'];

const citiesByProvince: Record<string, string[]> = {
  '广东省': ['广州市', '深圳市', '东莞市', '佛山市', '珠海市'],
  '北京市': ['北京市'],
  '上海市': ['上海市'],
  '江苏省': ['南京市', '苏州市', '无锡市', '常州市', '南通市'],
  '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市']
};

const districtsByCity: Record<string, string[]> = {
  '广州市': ['天河区', '海珠区', '越秀区', '白云区', '黄埔区'],
  '深圳市': ['南山区', '福田区', '罗湖区', '宝安区', '龙岗区'],
  '东莞市': ['莞城区', '南城区', '东城区', '万江区'],
  '北京市': ['朝阳区', '海淀区', '东城区', '西城区', '丰台区'],
  '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区'],
  '杭州市': ['西湖区', '上城区', '下城区', '江干区', '拱墅区']
};

// Computed properties
const filteredCities = computed(() => {
  return formData.province ? citiesByProvince[formData.province] || [] : [];
});

const filteredDistricts = computed(() => {
  return formData.city ? districtsByCity[formData.city] || [] : [];
});

// Watch for changes in form data
watch(formData, (newValue) => {
  if (selectedAddressId.value) {
    selectedAddressId.value = ''; // Clear selection if form is edited directly
  }
  
  emit('update:modelValue', {
    name: newValue.name,
    phone: newValue.phone,
    province: newValue.province,
    city: newValue.city,
    district: newValue.district,
    address: newValue.address,
    zipCode: newValue.zipCode
  });
}, { deep: true });

// Watch for changes in selected address
watch(selectedAddressId, (newId) => {
  if (newId) {
    const selectedAddress = props.savedAddresses.find(addr => addr.id === newId);
    if (selectedAddress) {
      Object.assign(formData, {
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        province: selectedAddress.province,
        city: selectedAddress.city,
        district: selectedAddress.district,
        address: selectedAddress.address,
        zipCode: selectedAddress.zipCode
      });
      
      emit('update:modelValue', {
        addressId: selectedAddress.id,
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        province: selectedAddress.province,
        city: selectedAddress.city,
        district: selectedAddress.district,
        address: selectedAddress.address,
        zipCode: selectedAddress.zipCode
      });
    }
  }
});

// Methods
const selectAddress = (address: Address) => {
  selectedAddressId.value = address.id;
};

const formatAddress = (address: Address): string => {
  return `${address.province} ${address.city} ${address.district} ${address.address}${address.zipCode ? ` (${address.zipCode})` : ''}`;
};

const resetForm = () => {
  selectedAddressId.value = '';
  Object.assign(formData, {
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    zipCode: ''
  });
};

const saveAddress = () => {
  // In a real app, this would save the address to the user's account
  emit('save-address', { ...formData });
};

const isEmpty = (obj: FormData): boolean => {
  return Object.values(obj).every(value => value === '');
};
</script>

<style scoped>
.shipping-address-form {
  width: 100%;
}

.saved-addresses {
  margin-bottom: var(--space-lg);
}

.saved-addresses-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: var(--space-sm);
  color: var(--color-text);
}

.loading-addresses {
  display: flex;
  justify-content: center;
  padding: var(--space-md);
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s;
}

.address-item:hover {
  border-color: var(--color-primary-light);
  background-color: var(--color-background-soft);
}

.address-item.active {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.address-info {
  flex: 1;
}

.address-header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: 4px;
}

.address-name {
  font-weight: 500;
}

.address-phone {
  color: var(--color-text-light);
}

.default-badge {
  background-color: var(--color-primary);
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
}

.address-details {
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.address-radio {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: var(--space-md);
}

.radio-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
}

.radio-circle.selected {
  border-color: var(--color-primary);
}

.radio-circle.selected::after {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--color-primary);
}

.divider {
  position: relative;
  height: 1px;
  background-color: var(--color-border-light);
  margin: var(--space-lg) 0;
  text-align: center;
}

.divider-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 0 var(--space-sm);
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.form-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: var(--space-md);
  color: var(--color-text);
}

.form-row {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.form-group {
  flex: 1;
  margin-bottom: var(--space-md);
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 4px;
  color: var(--color-text);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: var(--color-background-soft);
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>
