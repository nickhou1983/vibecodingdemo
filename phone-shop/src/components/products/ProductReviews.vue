<template>
  <div class="product-reviews">
    <div class="reviews-header">
      <h3>用户评价 ({{ reviews.length }})</h3>
      <div class="reviews-actions">
        <Button variant="outline" @click="showReviewForm = true">
          写评价
        </Button>
        <div class="reviews-sort">
          <select v-model="sortOption" class="sort-select">
            <option value="newest">最新</option>
            <option value="rating-high">评分: 高到低</option>
            <option value="rating-low">评分: 低到高</option>
            <option value="helpful">最有帮助</option>
          </select>
        </div>
      </div>
    </div>
    
    <div v-if="reviews.length > 0">
      <div class="reviews-summary">
        <div class="rating-summary">
          <h4 class="rating-average">{{ averageRating.toFixed(1) }}</h4>
          <StarRating :modelValue="averageRating" :readonly="true" />
          <div class="review-count">基于 {{ reviews.length }} 条评价</div>
        </div>
        
        <div class="rating-bars">
          <div v-for="i in 5" :key="i" class="rating-bar-container">
            <div class="star-label">{{ 6 - i }} 星</div>
            <div class="rating-bar">
              <div 
                class="rating-bar-fill" 
                :style="`width: ${getStarPercentage(6 - i)}%`"
              ></div>
            </div>
            <div class="rating-count">{{ getStarCount(6 - i) }}</div>
          </div>
        </div>
      </div>
      
      <div class="reviews-list">
        <div 
          v-for="review in sortedReviews" 
          :key="review.id" 
          class="review-item"
        >
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">
                <img 
                  v-if="review.avatar" 
                  :src="review.avatar" 
                  :alt="review.name" 
                />
                <div v-else class="avatar-placeholder">
                  {{ review.name.charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="reviewer-details">
                <div class="reviewer-name">{{ review.name }}</div>
                <div class="review-date">{{ formatDate(review.date) }}</div>
              </div>
            </div>
            <div class="review-rating">
              <StarRating :modelValue="review.rating" :readonly="true" :size="'small'" />
            </div>
          </div>
          
          <div class="review-content">
            <h4 class="review-title">{{ review.title }}</h4>
            <p class="review-text">{{ review.content }}</p>
            
            <div v-if="review.images && review.images.length > 0" class="review-images">
              <div 
                v-for="(image, idx) in review.images" 
                :key="idx" 
                class="review-image"
              >
                <img :src="image" alt="User review image" />
              </div>
            </div>
          </div>
          
          <div class="review-footer">
            <div class="helpful-container">
              <span>这条评价对您有帮助吗？</span>
              <button 
                class="helpful-button"
                :class="{ active: review.isHelpful }"
                @click="markHelpful(review.id)"
              >
                <span class="helpful-icon">👍</span>
                <span>{{ review.helpfulCount || 0 }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="hasMoreReviews" class="load-more">
        <Button variant="outline" @click="loadMoreReviews">
          加载更多评价
        </Button>
      </div>
    </div>
    
    <div v-else class="no-reviews">
      <div class="no-reviews-icon">🔍</div>
      <h4>暂无评价</h4>
      <p>成为第一个评价此商品的用户</p>
      <Button variant="primary" @click="showReviewForm = true">
        写评价
      </Button>
    </div>
    
    <Modal v-model="showReviewForm" title="写评价">
      <div class="review-form">
        <div class="form-group">
          <label for="review-rating">您的评分</label>
          <StarRating v-model="newReview.rating" :readonly="false" />
        </div>
        
        <div class="form-group">
          <label for="review-title">标题</label>
          <input 
            id="review-title" 
            v-model="newReview.title" 
            type="text" 
            placeholder="用简短的标题概括您的体验"
          />
        </div>
        
        <div class="form-group">
          <label for="review-content">评价内容</label>
          <textarea 
            id="review-content" 
            v-model="newReview.content" 
            rows="5" 
            placeholder="分享您对产品的详细评价..."
          ></textarea>
        </div>
        
        <div class="form-actions">
          <Button variant="outline" @click="showReviewForm = false">取消</Button>
          <Button variant="primary" @click="submitReview" :disabled="!isReviewValid">提交评价</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Button from '@/components/common/Button.vue';
import StarRating from '@/components/common/StarRating.vue';
import Modal from '@/components/common/Modal.vue';

// Props
const props = defineProps<{
  productId: string;
}>();

// Reviews data structure
interface Review {
  id: string;
  productId: string;
  name: string;
  avatar?: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  images?: string[];
  helpfulCount: number;
  isHelpful: boolean;
}

// State
const reviews = ref<Review[]>([]);
const sortOption = ref('newest');
const visibleReviewCount = ref(5);
const showReviewForm = ref(false);

const newReview = ref({
  rating: 0,
  title: '',
  content: ''
});

// Computed properties
const sortedReviews = computed(() => {
  const sorted = [...reviews.value];
  
  switch (sortOption.value) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'rating-high':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'rating-low':
      return sorted.sort((a, b) => a.rating - b.rating);
    case 'helpful':
      return sorted.sort((a, b) => b.helpfulCount - a.helpfulCount);
    default:
      return sorted;
  }
});

const visibleReviews = computed(() => {
  return sortedReviews.value.slice(0, visibleReviewCount.value);
});

const hasMoreReviews = computed(() => {
  return visibleReviewCount.value < reviews.value.length;
});

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  
  const sum = reviews.value.reduce((total, review) => total + review.rating, 0);
  return sum / reviews.value.length;
});

const isReviewValid = computed(() => {
  return newReview.value.rating > 0 && 
    newReview.value.title.trim() !== '' && 
    newReview.value.content.trim() !== '';
});

// Methods
function getStarCount(stars: number): number {
  return reviews.value.filter(review => Math.round(review.rating) === stars).length;
}

function getStarPercentage(stars: number): number {
  if (reviews.value.length === 0) return 0;
  return (getStarCount(stars) / reviews.value.length) * 100;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function loadMoreReviews(): void {
  visibleReviewCount.value += 5;
}

function markHelpful(reviewId: string): void {
  const review = reviews.value.find(r => r.id === reviewId);
  if (review) {
    if (!review.isHelpful) {
      review.helpfulCount += 1;
      review.isHelpful = true;
    } else {
      review.helpfulCount -= 1;
      review.isHelpful = false;
    }
    // In a real app, you would send this to the server
  }
}

function submitReview(): void {
  if (!isReviewValid.value) return;
  
  // In a real app, you would send this to the server
  // For now, we'll just add it to our local array
  const newReviewData: Review = {
    id: `temp-${Date.now()}`,
    productId: props.productId,
    name: '当前用户', // In real app, this would come from user profile
    rating: newReview.value.rating,
    title: newReview.value.title,
    content: newReview.value.content,
    date: new Date(),
    helpfulCount: 0,
    isHelpful: false
  };
  
  reviews.value.unshift(newReviewData);
  
  // Reset form
  newReview.value = {
    rating: 0,
    title: '',
    content: ''
  };
  
  showReviewForm.value = false;
}

// Lifecycle hooks
onMounted(async () => {
  // In a real app, we would fetch reviews from an API
  // For now, we'll use mock data
  reviews.value = [
    {
      id: '1',
      productId: props.productId,
      name: '李明',
      avatar: '/images/avatars/user1.jpg',
      rating: 5,
      title: '非常满意的购物体验',
      content: '手机质量很好，拍照效果特别棒。电池续航也比我想象中要好。包装很精美，快递很快。总体来说非常满意这次购物体验。',
      date: new Date('2023-06-15'),
      helpfulCount: 24,
      isHelpful: false
    },
    {
      id: '2',
      productId: props.productId,
      name: '王芳',
      avatar: '/images/avatars/user2.jpg',
      rating: 4,
      title: '性价比很高',
      content: '这款手机性价比很高，处理器性能强劲，运行很流畅。唯一的缺点可能是充电速度不是很快。',
      date: new Date('2023-05-23'),
      images: ['/images/products/review-image1.jpg', '/images/products/review-image2.jpg'],
      helpfulCount: 15,
      isHelpful: false
    },
    {
      id: '3',
      productId: props.productId,
      name: '张伟',
      rating: 3,
      title: '还可以，但不够完美',
      content: '总体感觉还不错，但是摄像头的夜间模式效果不如预期。系统优化不够好，有时候会有卡顿现象。希望后续系统更新能够改进。',
      date: new Date('2023-04-10'),
      helpfulCount: 8,
      isHelpful: false
    }
  ];
});
</script>

<style scoped>
.product-reviews {
  padding: var(--space-md) 0;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.reviews-header h3 {
  font-size: 1.3rem;
  font-weight: 500;
  color: var(--color-text);
}

.reviews-actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.reviews-sort {
  position: relative;
  min-width: 120px;
}

.sort-select {
  appearance: none;
  width: 100%;
  padding: 8px 24px 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: white;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
  font-size: 0.9rem;
}

.reviews-summary {
  display: flex;
  gap: var(--space-xl);
  margin-bottom: var(--space-xl);
  padding: var(--space-md);
  background-color: var(--color-background-soft);
  border-radius: var(--border-radius);
}

.rating-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.rating-average {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1;
  color: var(--color-text);
}

.review-count {
  margin-top: var(--space-xs);
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.rating-bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-xs);
}

.rating-bar-container {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.star-label {
  width: 40px;
  font-size: 0.9rem;
  text-align: right;
}

.rating-bar {
  flex: 1;
  height: 8px;
  background-color: var(--color-border-light);
  border-radius: 4px;
  overflow: hidden;
}

.rating-bar-fill {
  height: 100%;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.rating-count {
  width: 30px;
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.review-item {
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-border-light);
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.reviewer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: bold;
}

.reviewer-details {
  display: flex;
  flex-direction: column;
}

.reviewer-name {
  font-weight: 500;
  color: var(--color-text);
}

.review-date {
  font-size: 0.85rem;
  color: var(--color-text-light);
}

.review-content {
  margin-bottom: var(--space-md);
}

.review-title {
  font-weight: 600;
  margin-top: 0;
  margin-bottom: var(--space-xs);
  color: var(--color-text);
}

.review-text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.review-images {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}

.review-image {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius);
  overflow: hidden;
  cursor: pointer;
}

.review-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-footer {
  display: flex;
  justify-content: flex-end;
}

.helpful-container {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.helpful-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.helpful-button:hover {
  background-color: var(--color-background-soft);
}

.helpful-button.active {
  color: var(--color-primary);
  border-color: var(--color-primary-light);
  background-color: var(--color-primary-light);
}

.helpful-icon {
  font-size: 0.85rem;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: var(--space-lg);
}

.no-reviews {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) 0;
  color: var(--color-text-light);
  text-align: center;
}

.no-reviews-icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-md);
}

.no-reviews h4 {
  font-size: 1.2rem;
  margin-bottom: var(--space-xs);
  font-weight: 500;
}

.no-reviews p {
  margin-bottom: var(--space-md);
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.form-group label {
  font-weight: 500;
  color: var(--color-text);
}

.form-group input, .form-group textarea {
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-md);
}

@media (max-width: 768px) {
  .reviews-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }
  
  .reviews-summary {
    flex-direction: column;
  }
  
  .rating-summary {
    align-items: flex-start;
  }
}
</style>
