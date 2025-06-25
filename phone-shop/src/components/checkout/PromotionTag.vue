<template>
  <div 
    class="promotion-tag" 
    :class="[type, size]"
    :style="customStyles"
  >
    {{ text }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'sale',
    validator: (value: string) => ['sale', 'new', 'hot', 'deal', 'custom'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value)
  },
  color: {
    type: String,
    default: ''
  },
  backgroundColor: {
    type: String,
    default: ''
  }
});

const customStyles = computed(() => {
  const styles: Record<string, string> = {};
  
  if (props.type === 'custom') {
    if (props.color) {
      styles.color = props.color;
    }
    if (props.backgroundColor) {
      styles.backgroundColor = props.backgroundColor;
    }
  }
  
  return styles;
});
</script>

<style scoped>
.promotion-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border-radius: var(--border-radius-sm);
}

/* Size variants */
.small {
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-xs);
}

.medium {
  padding: var(--space-xs) var(--space-md);
  font-size: var(--font-size-sm);
}

.large {
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-size-md);
}

/* Type variants */
.sale {
  background-color: var(--error);
  color: white;
}

.new {
  background-color: var(--primary-blue);
  color: white;
}

.hot {
  background-color: var(--warning);
  color: white;
}

.deal {
  background-color: var(--success);
  color: white;
}

/* Custom type uses custom colors */
.custom {
  /* Default for custom if no color specified */
  background-color: var(--gray-dark);
  color: white;
}
</style>
