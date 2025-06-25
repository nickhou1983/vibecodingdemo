<template>
  <div class="support">
    <h1>Customer Support</h1>
    <p>We're here to help! Find answers to common questions or get in touch with our team.</p>
    
    <div class="support-options">
      <div class="support-section">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-list">
          <div class="faq-item">
            <h4>How can I track my order?</h4>
            <p>You can track your order by logging into your account and visiting the order history section.</p>
          </div>
          <div class="faq-item">
            <h4>What is your return policy?</h4>
            <p>We offer a 30-day return policy for all unopened items in original packaging.</p>
          </div>
          <div class="faq-item">
            <h4>Do you offer warranty on phones?</h4>
            <p>Yes, all phones come with manufacturer warranty. Extended warranty is also available.</p>
          </div>
        </div>
      </div>
      
      <div class="support-section">
        <h2>Contact Us</h2>
        <div class="contact-methods">
          <div class="contact-item">
            <h4>📞 Phone Support</h4>
            <p>Call us at: +1 (555) 123-4567</p>
            <p>Hours: Monday-Friday 9AM-6PM EST</p>
          </div>
          <div class="contact-item">
            <h4>✉️ Email Support</h4>
            <p>Email: support@phoneshop.com</p>
            <p>Response time: Within 24 hours</p>
          </div>
          <div class="contact-item">
            <h4>💬 Live Chat</h4>
            <p>Available on our website</p>
            <p>Hours: Monday-Sunday 8AM-10PM EST</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.support {
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.support h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
}

.support > p {
  font-size: 1.1rem;
  margin-bottom: 3rem;
  color: #666;
  text-align: center;
}

.support-options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

.support-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
}

.support-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.faq-item {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.faq-item h4 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #007bff;
}

.faq-item p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.contact-item {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.contact-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.contact-item h4 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #333;
}

.contact-item p {
  color: #666;
  margin: 0.5rem 0;
  line-height: 1.5;
}

@media (min-width: 768px) {
  .support-options {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .support {
    padding: 2rem 4rem;
  }
}
</style>