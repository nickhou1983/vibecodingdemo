<template>
  <div class="deals">
    <h1>Special Deals</h1>
    <p>Don't miss out on our amazing deals and discounts!</p>
    <div class="deals-grid">
      <div class="deal-item featured">
        <span class="deal-badge">Featured Deal</span>
        <h3>50% Off Selected Phones</h3>
        <p>Get up to 50% off on premium smartphones. Limited time offer!</p>
        <span class="deal-timer">Ends in 2 days</span>
      </div>
      <div class="deal-item">
        <span class="deal-badge">Hot Deal</span>
        <h3>Free Shipping</h3>
        <p>Free shipping on all orders over $100. No code needed!</p>
      </div>
      <div class="deal-item">
        <span class="deal-badge">Weekend Sale</span>
        <h3>Accessory Bundle</h3>
        <p>Buy any phone and get accessories at 30% off!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.deals {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.deals h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.deals > p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #666;
  text-align: center;
}

.deals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  width: 100%;
}

.deal-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  position: relative;
  color: white;
  transition: transform 0.2s ease;
}

.deal-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.deal-item.featured {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.deal-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  backdrop-filter: blur(10px);
}

.deal-item h3 {
  font-size: 1.4rem;
  margin: 1rem 0 0.5rem 0;
}

.deal-item p {
  margin-bottom: 1rem;
  opacity: 0.9;
  line-height: 1.5;
}

.deal-timer {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

@media (min-width: 1024px) {
  .deals {
    align-items: center;
  }
}
</style>