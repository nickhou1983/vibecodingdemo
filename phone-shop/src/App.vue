<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/layout/AppHeader.vue'
import { onMounted } from 'vue'

// Import global styles
import './assets/styles/main.css'

// Add event listener to show active state for buttons when clicked
onMounted(() => {
  const buttons = document.querySelectorAll('button')
  buttons.forEach((button) => {
    button.addEventListener('click', function() {
      this.classList.add('button-active')
      setTimeout(() => {
        this.classList.remove('button-active')
      }, 200)
    })
  })
})
</script>

<template>
  <div class="app">
    <AppHeader />
    
    <main class="main-content">
      <RouterView />
    </main>
    
    <footer class="footer">
      <div class="container">
        <div class="footer__content">
          <div class="footer__section">
            <h3 class="footer__title">Phone Shop</h3>
            <p class="footer__description">The best place to find your next smartphone.</p>
            <div class="footer__social">
              <a href="#" class="social-link">Facebook</a>
              <a href="#" class="social-link">Twitter</a>
              <a href="#" class="social-link">Instagram</a>
            </div>
          </div>
          
          <div class="footer__section">
            <h4 class="footer__title">Quick Links</h4>
            <ul class="footer__links">
              <li><a href="#">Home</a></li>
              <li><a href="#">Products</a></li>
              <li><a href="#">Deals</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          
          <div class="footer__section">
            <h4 class="footer__title">Customer Service</h4>
            <ul class="footer__links">
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Returns</a></li>
            </ul>
          </div>
          
          <div class="footer__section">
            <h4 class="footer__title">Newsletter</h4>
            <p>Subscribe to get special offers and updates.</p>
            <form class="footer__form">
              <input type="email" placeholder="Your email" class="footer__input">
              <button type="submit" class="footer__button">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div class="footer__bottom">
          <p class="footer__copyright">© 2025 Phone Shop. All rights reserved.</p>
          <div class="footer__terms">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
/* We're using global styles imported from main.css */

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}

.footer {
  background-color: var(--primary-blue-dark);
  color: white;
  padding: var(--space-xl) 0 var(--space-md);
  margin-top: var(--space-xxl);
}

.footer__content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.footer__title {
  color: white;
  margin-bottom: var(--space-md);
}

.footer__description {
  margin-bottom: var(--space-md);
  opacity: 0.8;
}

.footer__social {
  display: flex;
  gap: var(--space-md);
}

.social-link {
  color: white;
  opacity: 0.8;
  transition: opacity var(--transition-fast);
}

.social-link:hover {
  opacity: 1;
  color: white;
}

.footer__links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer__links li {
  margin-bottom: var(--space-xs);
}

.footer__links a {
  color: white;
  opacity: 0.8;
  transition: opacity var(--transition-fast);
}

.footer__links a:hover {
  opacity: 1;
  color: white;
}

.footer__form {
  display: flex;
  margin-top: var(--space-sm);
}

.footer__input {
  flex: 1;
  padding: var(--space-xs) var(--space-sm);
  border: none;
  border-radius: var(--border-radius-sm) 0 0 var(--border-radius-sm);
}

.footer__button {
  background-color: var(--primary-blue);
  color: white;
  border: none;
  padding: var(--space-xs) var(--space-sm);
  cursor: pointer;
  border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
  transition: background-color var(--transition-fast);
}

.footer__button:hover {
  background-color: var(--accent-blue);
}

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-md);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer__copyright {
  opacity: 0.8;
  margin: 0;
}

.footer__terms {
  display: flex;
  gap: var(--space-md);
}

.footer__terms a {
  color: white;
  opacity: 0.8;
  font-size: var(--font-size-sm);
}

.button-active {
  transform: scale(0.98) !important;
}

@media (max-width: 768px) {
  .footer__bottom {
    flex-direction: column;
    gap: var(--space-md);
    text-align: center;
  }
  
  .footer__terms {
    justify-content: center;
  }
}
</style>
