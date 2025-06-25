<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__content">
        <div class="footer__section">
          <h3 class="footer__title">Phone Shop</h3>
          <p class="footer__description">The best place to find your next smartphone.</p>
          <div class="footer__social">
            <a href="#" class="social-link"><i class="fab fa-facebook"></i></a>
            <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
        
        <div class="footer__section">
          <h4 class="footer__title">Quick Links</h4>
          <ul class="footer__links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/products">Products</router-link></li>
            <li><router-link to="/deals">Deals</router-link></li>
            <li><router-link to="/support">Support</router-link></li>
          </ul>
        </div>

        <div class="footer__section">
          <h4 class="footer__title">Contact Us</h4>
          <address class="footer__contact">
            <p><i class="fas fa-map-marker-alt"></i> 123 Tech Street, Digital City</p>
            <p><i class="fas fa-phone"></i> +1 (234) 567-8900</p>
            <p><i class="fas fa-envelope"></i> contact@phoneshop.com</p>
          </address>
        </div>
      </div>
      
      <div class="footer__bottom">
        <p class="copyright">© {{ new Date().getFullYear() }} Phone Shop. All rights reserved.</p>
        <div class="footer__payment">
          <span class="payment-icon">Visa</span>
          <span class="payment-icon">Mastercard</span>
          <span class="payment-icon">PayPal</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component logic if needed
</script>

<style scoped>
.footer {
  background-color: #1a2b63;
  color: #fff;
  padding: 3rem 0 1rem;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

.footer__content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer__section {
  flex: 1;
  min-width: 250px;
}

.footer__title {
  color: #fff;
  margin-bottom: 1rem;
  font-weight: 600;
}

.footer__description {
  color: #ccd4e8;
  margin-bottom: 1rem;
}

.footer__social {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
}

.social-link:hover {
  color: #4d8bf8;
}

.footer__links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer__links li {
  margin-bottom: 0.5rem;
}

.footer__links a {
  color: #ccd4e8;
  text-decoration: none;
  transition: color 0.3s;
}

.footer__links a:hover {
  color: #4d8bf8;
}

.footer__contact p {
  margin-bottom: 0.5rem;
  color: #ccd4e8;
}

.footer__bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  color: #ccd4e8;
  font-size: 0.9rem;
}

.footer__payment {
  display: flex;
  gap: 1rem;
}

.payment-icon {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .footer__content,
  .footer__bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .footer__section {
    width: 100%;
  }
}
</style>
