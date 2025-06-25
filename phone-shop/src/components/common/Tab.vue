<script setup lang="ts">
import { ref, computed } from 'vue';

interface TabItem {
  id: string | number;
  title: string;
  disabled?: boolean;
  badge?: number | string;
}

const props = defineProps({
  tabs: {
    type: Array as () => TabItem[],
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: null
  },
  position: {
    type: String,
    default: 'top' // 'top', 'bottom', 'left', 'right'
  },
  variant: {
    type: String,
    default: 'default' // 'default', 'pills', 'underline', 'buttons'
  }
});

const emit = defineEmits(['update:modelValue', 'tab-click']);

const activeTab = computed({
  get() {
    // If modelValue is provided, use it, otherwise use first enabled tab
    if (props.modelValue !== null) {
      return props.modelValue;
    }
    
    const firstEnabledTab = props.tabs.find(tab => !tab.disabled);
    return firstEnabledTab?.id;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

const switchTab = (tabId: string | number) => {
  const tab = props.tabs.find(t => t.id === tabId);
  
  if (tab && !tab.disabled) {
    activeTab.value = tabId;
    emit('tab-click', tabId);
  }
};

// Generate class names based on props
const tabsClasses = computed(() => {
  return [
    `tabs--${props.position}`,
    `tabs--${props.variant}`
  ];
});
</script>

<template>
  <div class="tabs" :class="tabsClasses">
    <div class="tabs__nav">
      <button
        v-for="tab in props.tabs"
        :key="tab.id"
        class="tab-button"
        :class="{
          'tab-button--active': tab.id === activeTab,
          'tab-button--disabled': tab.disabled
        }"
        @click="switchTab(tab.id)"
        :disabled="tab.disabled"
      >
        <span>{{ tab.title }}</span>
        <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
      </button>
    </div>
    
    <div class="tabs__content">
      <div v-for="tab in props.tabs" :key="`panel-${tab.id}`">
        <div v-if="tab.id === activeTab" class="tab-panel">
          <slot :name="`tab-${tab.id}`"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabs {
  width: 100%;
}

/* Tab positions */
.tabs--top {
  display: flex;
  flex-direction: column;
}

.tabs--bottom {
  display: flex;
  flex-direction: column-reverse;
}

.tabs--left {
  display: flex;
}

.tabs--right {
  display: flex;
  flex-direction: row-reverse;
}

/* Navigation */
.tabs__nav {
  display: flex;
  position: relative;
}

.tabs--top .tabs__nav,
.tabs--bottom .tabs__nav {
  flex-direction: row;
  border-bottom: 1px solid var(--gray-light);
}

.tabs--bottom .tabs__nav {
  border-bottom: none;
  border-top: 1px solid var(--gray-light);
}

.tabs--left .tabs__nav,
.tabs--right .tabs__nav {
  flex-direction: column;
  border-right: 1px solid var(--gray-light);
}

.tabs--right .tabs__nav {
  border-right: none;
  border-left: 1px solid var(--gray-light);
}

/* Tab button */
.tab-button {
  padding: var(--space-md) var(--space-lg);
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: 500;
  color: var(--gray-dark);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  transition: color var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast);
}

.tab-button--active {
  color: var(--primary-blue);
  font-weight: 600;
}

.tab-button--disabled {
  color: var(--gray-medium);
  cursor: not-allowed;
}

.tab-button:hover:not(.tab-button--disabled) {
  color: var(--primary-blue-dark);
}

/* Badge */
.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 var(--space-xs);
  border-radius: var(--border-radius-round);
  font-size: var(--font-size-xs);
  font-weight: 600;
  background-color: var(--primary-blue);
  color: white;
}

.tab-button--disabled .tab-badge {
  background-color: var(--gray-medium);
}

/* Content */
.tabs__content {
  flex: 1;
  padding: var(--space-lg);
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Variants */
.tabs--default .tab-button--active {
  position: relative;
}

.tabs--top.tabs--default .tab-button--active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--primary-blue);
}

.tabs--bottom.tabs--default .tab-button--active::after {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--primary-blue);
}

.tabs--left.tabs--default .tab-button--active::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--primary-blue);
}

.tabs--right.tabs--default .tab-button--active::after {
  content: '';
  position: absolute;
  left: -1px;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--primary-blue);
}

/* Pills variant */
.tabs--pills .tabs__nav {
  border: none;
  gap: var(--space-sm);
}

.tabs--pills .tab-button {
  border-radius: var(--border-radius-md);
}

.tabs--pills .tab-button--active {
  background-color: var(--primary-blue);
  color: white;
}

.tabs--pills .tab-button--active .tab-badge {
  background-color: white;
  color: var(--primary-blue);
}

/* Underline variant */
.tabs--underline .tabs__nav {
  border: none;
}

.tabs--underline .tab-button {
  border-bottom: 2px solid transparent;
}

.tabs--underline .tab-button--active {
  border-bottom-color: var(--primary-blue);
}

/* Buttons variant */
.tabs--buttons .tabs__nav {
  border: none;
  background-color: var(--gray-light);
  padding: var(--space-xs);
  border-radius: var(--border-radius-md);
  gap: var(--space-xs);
}

.tabs--buttons .tab-button {
  border-radius: var(--border-radius-sm);
}

.tabs--buttons .tab-button--active {
  background-color: white;
  box-shadow: var(--shadow-sm);
}

@media (max-width: 768px) {
  .tabs--left,
  .tabs--right {
    flex-direction: column;
  }
  
  .tabs--left .tabs__nav,
  .tabs--right .tabs__nav {
    flex-direction: row;
    border-right: none;
    border-left: none;
    border-bottom: 1px solid var(--gray-light);
    overflow-x: auto;
  }
  
  .tabs--left.tabs--default .tab-button--active::after,
  .tabs--right.tabs--default .tab-button--active::after {
    top: auto;
    bottom: -1px;
    left: 0;
    right: 0;
    width: auto;
    height: 2px;
  }
}
</style>
