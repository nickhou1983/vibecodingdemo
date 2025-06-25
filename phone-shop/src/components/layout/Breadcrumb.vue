<template>
  <nav class="breadcrumb" aria-label="breadcrumb">
    <ol class="breadcrumb__list">
      <li 
        v-for="(item, index) in breadcrumbItems" 
        :key="index" 
        class="breadcrumb__item"
        :class="{ 'breadcrumb__item--active': index === breadcrumbItems.length - 1 }"
      >
        <router-link v-if="index < breadcrumbItems.length - 1" :to="item.path" class="breadcrumb__link">
          {{ item.name }}
        </router-link>
        <span v-else class="breadcrumb__text">{{ item.name }}</span>
        <span v-if="index < breadcrumbItems.length - 1" class="breadcrumb__separator">
          <i class="fas fa-chevron-right"></i>
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

interface BreadcrumbItem {
  name: string;
  path: string;
}

// Props
const props = defineProps<{
  items?: BreadcrumbItem[];
}>();

const route = useRoute();

// Compute breadcrumb items based on props or current route
const breadcrumbItems = computed(() => {
  if (props.items && props.items.length) {
    return props.items;
  }

  // Automatically generate breadcrumbs from the current route path
  const pathSegments = route.path.split('/').filter(Boolean);
  
  const generatedItems: BreadcrumbItem[] = [
    { name: 'Home', path: '/' },
  ];

  let currentPath = '';
  
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`;
    
    // Convert path segments to readable names
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    generatedItems.push({
      name: name,
      path: currentPath
    });
  });

  return generatedItems;
});
</script>

<style scoped>
.breadcrumb {
  padding: 0.75rem 0;
  margin-bottom: 1rem;
}

.breadcrumb__list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

.breadcrumb__item {
  display: flex;
  align-items: center;
  color: #555;
  font-size: 0.9rem;
}

.breadcrumb__link {
  color: #1a2b63;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb__link:hover {
  color: #4d8bf8;
  text-decoration: underline;
}

.breadcrumb__separator {
  display: inline-flex;
  align-items: center;
  margin: 0 0.5rem;
  font-size: 0.7rem;
  color: #aaa;
}

.breadcrumb__text {
  color: #777;
}

.breadcrumb__item--active {
  font-weight: 500;
  color: #555;
}

@media (max-width: 576px) {
  .breadcrumb {
    font-size: 0.8rem;
  }

  .breadcrumb__separator {
    margin: 0 0.3rem;
  }
}
</style>
