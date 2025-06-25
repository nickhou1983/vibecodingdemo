<template>
  <div class="categories">
    <h1>Categories</h1>
    <p>Browse our product categories to find what you're looking for.</p>
    <div class="categories-grid">
      <div class="category-item">
        <h3>Smartphones</h3>
        <p>Latest smartphones from top brands</p>
      </div>
      <div class="category-item">
        <h3>Accessories</h3>
        <p>Cases, chargers, and more</p>
      </div>
      <div class="category-item">
        <h3>Tablets</h3>
        <p>Powerful tablets for work and play</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.categories {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.categories h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.categories p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #666;
  text-align: center;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 800px;
  width: 100%;
}

.category-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.2s ease;
}

.category-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-item h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.category-item p {
  color: #666;
  margin: 0;
}

@media (min-width: 1024px) {
  .categories {
    align-items: center;
  }
}
</style>