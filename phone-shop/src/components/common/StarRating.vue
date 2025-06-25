<template>
  <div 
    class="star-rating" 
    :class="[`size-${size}`, { 'readonly': readonly }]"
  >
    <div class="stars-container">
      <div 
        v-for="i in 5" 
        :key="i"
        class="star"
        @click="!readonly && updateRating(i)"
        @mouseover="!readonly && setHoverRating(i)"
        @mouseout="!readonly && clearHoverRating()"
      >
        <div 
          class="star-fill" 
          :style="{ 
            width: getStarWidth(i) + '%',
            backgroundColor: color
          }"
        ></div>
        <svg 
          class="star-svg" 
          viewBox="0 0 24 24"
          :stroke="color"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      </div>
    </div>
    <div v-if="showValue" class="rating-value">{{ displayValue }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  readonly: {
    type: Boolean,
    default: false
  },
  showValue: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value)
  },
  precision: {
    type: Number,
    default: 0.5,
    validator: (value: number) => [0.1, 0.5, 1].includes(value)
  },
  color: {
    type: String,
    default: '#FFC107' // amber color
  }
});

const emit = defineEmits(['update:modelValue']);

const hoverRating = ref(0);
const internalValue = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue;
});

const displayValue = computed(() => {
  return internalValue.value.toFixed(1);
});

const updateRating = (value: number) => {
  const rating = calculateRating(value);
  internalValue.value = rating;
  emit('update:modelValue', rating);
};

const setHoverRating = (value: number) => {
  hoverRating.value = value;
};

const clearHoverRating = () => {
  hoverRating.value = 0;
};

const calculateRating = (starPosition: number) => {
  if (props.precision === 0.1) {
    return Math.round(starPosition * 10) / 10;
  } else if (props.precision === 0.5) {
    return Math.round(starPosition * 2) / 2;
  }
  return starPosition;
};

const getStarWidth = (starPosition: number) => {
  const rating = hoverRating.value || internalValue.value;
  if (starPosition <= Math.floor(rating)) {
    return 100; // Full star
  } else if (starPosition > Math.ceil(rating)) {
    return 0; // Empty star
  } else {
    // Partial star
    return (rating % 1) * 100;
  }
};
</script>

<style scoped>
.star-rating {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.stars-container {
  display: flex;
  gap: 2px;
}

.star {
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.readonly .star {
  cursor: default;
}

.star-svg {
  fill: transparent;
  stroke-width: 0.5;
}

.star-fill {
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}

.star-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: currentColor;
  mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>');
  mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>');
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
}

.rating-value {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--gray-dark);
}

/* Size variants */
.size-small .star {
  width: 16px;
  height: 16px;
}

.size-medium .star {
  width: 24px;
  height: 24px;
}

.size-large .star {
  width: 32px;
  height: 32px;
}

.size-small .rating-value {
  font-size: var(--font-size-xs);
}

.size-medium .rating-value {
  font-size: var(--font-size-sm);
}

.size-large .rating-value {
  font-size: var(--font-size-md);
}
</style>
