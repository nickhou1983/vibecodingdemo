<script setup lang="ts">
import { ref, provide } from 'vue';

interface AccordionItem {
  id: string | number;
  title: string;
  content?: string;
}

const props = defineProps({
  items: {
    type: Array as () => AccordionItem[],
    default: () => []
  },
  allowMultiple: {
    type: Boolean,
    default: false
  },
  defaultOpen: {
    type: Array as () => (string | number)[],
    default: () => []
  },
  iconPosition: {
    type: String,
    default: 'right' // 'right' or 'left'
  }
});

const openItems = ref<Set<string | number>>(new Set(props.defaultOpen));

const toggleItem = (id: string | number) => {
  if (openItems.value.has(id)) {
    openItems.value.delete(id);
  } else {
    if (!props.allowMultiple) {
      openItems.value.clear();
    }
    openItems.value.add(id);
  }
};

const isOpen = (id: string | number) => {
  return openItems.value.has(id);
};

// Provide context for child accordion-item components
provide('accordionContext', {
  openItems,
  toggleItem,
  isOpen,
  iconPosition: props.iconPosition
});
</script>

<template>
  <div class="accordion">
    <div 
      v-for="item in props.items" 
      :key="item.id"
      class="accordion-item"
      :class="{ 'accordion-item--open': isOpen(item.id) }"
    >
      <div 
        class="accordion-header"
        @click="toggleItem(item.id)"
      >
        <span v-if="props.iconPosition === 'left'" class="accordion-icon">
          {{ isOpen(item.id) ? '−' : '+' }}
        </span>
        
        <h3 class="accordion-title">{{ item.title }}</h3>
        
        <span v-if="props.iconPosition === 'right'" class="accordion-icon">
          {{ isOpen(item.id) ? '−' : '+' }}
        </span>
      </div>
      
      <div 
        v-if="isOpen(item.id)"
        class="accordion-content"
      >
        <div v-if="item.content" v-html="item.content"></div>
        <slot :name="`item-${item.id}`"></slot>
      </div>
    </div>
    
    <slot></slot>
  </div>
</template>

<style scoped>
.accordion {
  width: 100%;
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.accordion-item {
  border: 1px solid var(--gray-light);
  margin-bottom: -1px;
  background-color: white;
  transition: box-shadow var(--transition-fast);
}

.accordion-item--open {
  box-shadow: var(--shadow-sm);
  z-index: 1;
  position: relative;
}

.accordion-header {
  display: flex;
  align-items: center;
  padding: var(--space-md);
  cursor: pointer;
  user-select: none;
  position: relative;
}

.accordion-title {
  flex: 1;
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--text-dark);
}

.accordion-icon {
  font-size: var(--font-size-xl);
  color: var(--primary-blue);
  padding: 0 var(--space-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast);
}

.accordion-item--open .accordion-icon {
  color: var(--primary-blue-dark);
}

.accordion-content {
  padding: var(--space-md);
  border-top: 1px solid var(--gray-light);
  background-color: var(--gray-light);
}

/* When icon is on the left, add some spacing */
.accordion-header:has(.accordion-icon:first-child) .accordion-title {
  margin-left: var(--space-sm);
}

/* Hover effect */
.accordion-item:hover {
  background-color: var(--light-blue);
}

.accordion-item--open:hover {
  background-color: white;
}
</style>
