<template>
  <div class="color-selector">
    <div 
      v-for="color in colors" 
      :key="color.id"
      class="color-option"
      :class="{ active: modelValue === color.id }"
      @click="selectColor(color.id)"
      :title="color.name"
    >
      <div 
        class="color-swatch"
        :style="{ backgroundColor: color.hex }"
      ></div>
      <span class="color-name">{{ color.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

const props = defineProps({
  colors: {
    type: Array as () => ColorOption[],
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const selectColor = (colorId: string) => {
  emit('update:modelValue', colorId);
};
</script>

<style scoped>
.color-selector {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: var(--transition-fast);
}

.color-swatch {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-round);
  border: 2px solid transparent;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-fast);
}

.color-option:hover .color-swatch {
  transform: scale(1.1);
}

.color-option.active .color-swatch {
  border-color: var(--primary-blue);
  transform: scale(1.1);
}

.color-name {
  margin-top: var(--space-xs);
  font-size: var(--font-size-sm);
  color: var(--text-dark);
}

.color-option.active .color-name {
  color: var(--primary-blue);
  font-weight: 500;
}
</style>
