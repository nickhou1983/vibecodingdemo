<template>
  <div class="pagination" v-if="totalPages > 1">
    <button 
      class="pagination-button"
      :class="{ disabled: currentPage <= 1 }"
      :disabled="currentPage <= 1"
      @click="changePage(1)"
      v-if="showFirstLast"
    >
      {{ firstText }}
    </button>
    
    <button 
      class="pagination-button"
      :class="{ disabled: currentPage <= 1 }"
      :disabled="currentPage <= 1"
      @click="changePage(currentPage - 1)"
    >
      {{ prevText }}
    </button>
    
    <div class="pagination-info" v-if="showInfo">
      {{ infoText }}
    </div>
    
    <div class="pagination-pages" v-if="showPageNumbers">
      <button
        v-for="page in visiblePages"
        :key="page"
        class="pagination-page"
        :class="{ active: page === currentPage }"
        @click="changePage(page)"
      >
        {{ page }}
      </button>
    </div>
    
    <button 
      class="pagination-button"
      :class="{ disabled: currentPage >= totalPages }"
      :disabled="currentPage >= totalPages"
      @click="changePage(currentPage + 1)"
    >
      {{ nextText }}
    </button>
    
    <button 
      class="pagination-button"
      :class="{ disabled: currentPage >= totalPages }"
      :disabled="currentPage >= totalPages"
      @click="changePage(totalPages)"
      v-if="showFirstLast"
    >
      {{ lastText }}
    </button>
    
    <div class="pagination-size" v-if="showPageSize">
      <span>每页显示</span>
      <select 
        v-model="localPageSize"
        @change="changePageSize"
      >
        <option
          v-for="size in pageSizeOptions"
          :key="size"
          :value="size"
        >
          {{ size }}
        </option>
      </select>
      <span>条</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    required: true
  },
  pageSizeOptions: {
    type: Array as () => number[],
    default: () => [10, 20, 50, 100]
  },
  pageRange: {
    type: Number,
    default: 5
  },
  showPageNumbers: {
    type: Boolean,
    default: true
  },
  showPageSize: {
    type: Boolean,
    default: true
  },
  showFirstLast: {
    type: Boolean,
    default: true
  },
  showInfo: {
    type: Boolean,
    default: true
  },
  prevText: {
    type: String,
    default: '上一页'
  },
  nextText: {
    type: String,
    default: '下一页'
  },
  firstText: {
    type: String,
    default: '首页'
  },
  lastText: {
    type: String,
    default: '末页'
  }
});

const emit = defineEmits(['update:currentPage', 'update:pageSize', 'change']);

const localPageSize = ref(props.pageSize);

watch(() => props.pageSize, (newSize) => {
  localPageSize.value = newSize;
});

// Computed values
const totalPages = computed(() => Math.max(1, Math.ceil(props.total / localPageSize.value)));

const startIndex = computed(() => (props.currentPage - 1) * localPageSize.value + 1);

const endIndex = computed(() => Math.min(startIndex.value + localPageSize.value - 1, props.total));

const infoText = computed(() => {
  return `${startIndex.value}-${endIndex.value} / ${props.total}`;
});

const visiblePages = computed(() => {
  const half = Math.floor(props.pageRange / 2);
  let start = props.currentPage - half;
  let end = props.currentPage + half;
  
  if (start < 1) {
    end = Math.min(totalPages.value, end + (1 - start));
    start = 1;
  }
  
  if (end > totalPages.value) {
    start = Math.max(1, start - (end - totalPages.value));
    end = totalPages.value;
  }
  
  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Methods
const changePage = (page: number) => {
  if (page === props.currentPage) return;
  
  emit('update:currentPage', page);
  emit('change', { page, pageSize: localPageSize.value });
};

const changePageSize = () => {
  emit('update:pageSize', localPageSize.value);
  
  // Adjust current page if needed
  const newTotalPages = Math.ceil(props.total / localPageSize.value);
  if (props.currentPage > newTotalPages) {
    changePage(newTotalPages);
  } else {
    emit('change', { page: props.currentPage, pageSize: localPageSize.value });
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin: var(--space-md) 0;
}

.pagination-button {
  padding: var(--space-sm) var(--space-md);
  background-color: white;
  border: 1px solid var(--gray-medium);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

.pagination-button:hover:not(.disabled) {
  background-color: var(--gray-light);
  border-color: var(--gray-dark);
}

.pagination-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.pagination-page {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid var(--gray-medium);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

.pagination-page:hover:not(.active) {
  background-color: var(--gray-light);
}

.pagination-page.active {
  background-color: var(--primary-blue);
  color: white;
  border-color: var(--primary-blue);
  cursor: default;
}

.pagination-info {
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-sm);
  color: var(--gray-dark);
}

.pagination-size {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--font-size-sm);
  margin-left: var(--space-md);
}

.pagination-size select {
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--gray-medium);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  background-color: white;
}
</style>
