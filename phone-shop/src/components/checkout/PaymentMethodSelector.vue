<template>
  <div class="payment-method-selector">
    <div class="payment-methods">
      <div 
        v-for="method in methods" 
        :key="method.id"
        class="payment-method"
        :class="{ active: modelValue === method.id }"
        @click="selectMethod(method.id)"
      >
        <div class="method-icon">
          <img v-if="method.icon" :src="method.icon" :alt="method.name">
          <div v-else class="icon-placeholder"></div>
        </div>
        
        <div class="method-content">
          <div class="method-name">{{ method.name }}</div>
          <div v-if="method.description" class="method-description">{{ method.description }}</div>
        </div>
        
        <div class="method-radio">
          <div class="radio-circle" :class="{ selected: modelValue === method.id }"></div>
        </div>
      </div>
    </div>
    
    <div v-if="selectedMethod?.id === 'card'" class="card-details">
      <div class="form-row">
        <div class="form-group">
          <label for="cardNumber">卡号</label>
          <input 
            id="cardNumber" 
            type="text" 
            v-model="cardDetails.number" 
            placeholder="请输入卡号" 
            maxlength="19"
            @input="formatCardNumber"
          />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group card-name">
          <label for="cardName">持卡人姓名</label>
          <input 
            id="cardName" 
            type="text" 
            v-model="cardDetails.name" 
            placeholder="请输入持卡人姓名"
          />
        </div>
        
        <div class="form-group card-expiry">
          <label for="cardExpiry">有效期至</label>
          <input 
            id="cardExpiry" 
            type="text" 
            v-model="cardDetails.expiry" 
            placeholder="MM/YY"
            maxlength="5"
            @input="formatCardExpiry"
          />
        </div>
        
        <div class="form-group card-cvv">
          <label for="cardCvv">安全码</label>
          <input 
            id="cardCvv" 
            type="text" 
            v-model="cardDetails.cvv" 
            placeholder="CVV"
            maxlength="3"
            @input="validateNumeric"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// Define interfaces
interface PaymentMethod {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

// Define props and emits
const props = defineProps<{
  modelValue: string;
  methods: PaymentMethod[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'card-details-changed', value: CardDetails): void;
}>();

// State
const cardDetails = ref<CardDetails>({
  number: '',
  name: '',
  expiry: '',
  cvv: ''
});

// Computed
const selectedMethod = computed(() => {
  return props.methods.find(method => method.id === props.modelValue);
});

// Methods
const selectMethod = (methodId: string) => {
  emit('update:modelValue', methodId);
};

const formatCardNumber = () => {
  // Remove non-digit characters and limit to 16 digits
  const value = cardDetails.value.number.replace(/\D/g, '').substring(0, 16);
  
  // Format as xxxx xxxx xxxx xxxx
  let formattedValue = '';
  for (let i = 0; i < value.length; i++) {
    if (i > 0 && i % 4 === 0) {
      formattedValue += ' ';
    }
    formattedValue += value.charAt(i);
  }
  
  cardDetails.value.number = formattedValue;
};

const formatCardExpiry = () => {
  // Remove non-digit characters
  const value = cardDetails.value.expiry.replace(/\D/g, '');
  
  // Format as MM/YY
  if (value.length > 2) {
    cardDetails.value.expiry = value.substring(0, 2) + '/' + value.substring(2);
  } else {
    cardDetails.value.expiry = value;
  }
};

const validateNumeric = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  
  // Remove non-digit characters
  target.value = value.replace(/\D/g, '');
};

// Watch for changes in card details
watch(cardDetails, (newValue) => {
  emit('card-details-changed', { ...newValue });
}, { deep: true });
</script>

<style scoped>
.payment-method-selector {
  width: 100%;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.payment-method {
  display: flex;
  align-items: center;
  padding: var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s;
}

.payment-method:hover {
  border-color: var(--color-primary-light);
  background-color: var(--color-background-soft);
}

.payment-method.active {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.method-icon {
  width: 40px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--space-md);
}

.method-icon img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.icon-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--color-background-soft);
  border-radius: var(--border-radius-sm);
}

.method-content {
  flex: 1;
}

.method-name {
  font-weight: 500;
  color: var(--color-text);
}

.method-description {
  font-size: 0.85rem;
  color: var(--color-text-light);
  margin-top: 2px;
}

.method-radio {
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

.card-details {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background-color: var(--color-background-soft);
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border-light);
}

.form-row {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 4px;
  color: var(--color-text);
}

.form-group input {
  width: 100%;
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.card-expiry {
  width: 80px;
}

.card-cvv {
  width: 70px;
}

@media (max-width: 768px) {
  .form-row {
    flex-wrap: wrap;
  }
  
  .card-name {
    flex-basis: 100%;
    margin-bottom: var(--space-sm);
  }
  
  .card-expiry,
  .card-cvv {
    flex: 1;
    width: auto;
  }
}
</style>
