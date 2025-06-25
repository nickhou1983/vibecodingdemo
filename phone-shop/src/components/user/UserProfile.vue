<template>
  <div class="user-profile">
    <div class="profile-header">
      <h2 class="section-title">个人资料</h2>
      <Button 
        variant="outline" 
        class="edit-button"
        @click="startEditing"
        v-if="!isEditing"
      >
        编辑资料
      </Button>
    </div>
    
    <div v-if="loading" class="loading-container">
      <LoadingSpinner />
    </div>
    
    <div v-else class="profile-content">
      <div class="profile-avatar">
        <div class="avatar" v-if="!isEditing">
          <img 
            v-if="user.avatar" 
            :src="user.avatar" 
            :alt="user.name"
          />
          <div v-else class="avatar-placeholder">
            {{ user.name.charAt(0).toUpperCase() }}
          </div>
        </div>
        
        <div v-else class="avatar-upload">
          <div class="current-avatar">
            <img 
              v-if="formData.avatar" 
              :src="formData.avatar" 
              :alt="formData.name"
            />
            <div v-else class="avatar-placeholder">
              {{ formData.name.charAt(0).toUpperCase() }}
            </div>
          </div>
          
          <div class="upload-actions">
            <Button variant="outline" @click="uploadAvatar">上传头像</Button>
            <Button variant="text" @click="removeAvatar" v-if="formData.avatar">移除</Button>
          </div>
        </div>
      </div>
      
      <div class="profile-details">
        <template v-if="!isEditing">
          <div class="detail-item">
            <div class="detail-label">姓名</div>
            <div class="detail-value">{{ user.name }}</div>
          </div>
          
          <div class="detail-item">
            <div class="detail-label">邮箱</div>
            <div class="detail-value">{{ user.email }}</div>
          </div>
          
          <div class="detail-item">
            <div class="detail-label">手机号</div>
            <div class="detail-value">{{ user.phone || '未设置' }}</div>
          </div>
          
          <div class="detail-item">
            <div class="detail-label">性别</div>
            <div class="detail-value">{{ formatGender(user.gender) }}</div>
          </div>
          
          <div class="detail-item">
            <div class="detail-label">生日</div>
            <div class="detail-value">{{ user.birthday || '未设置' }}</div>
          </div>
        </template>
        
        <form v-else class="edit-form" @submit.prevent="saveProfile">
          <div class="form-group">
            <label for="name">姓名</label>
            <input 
              id="name" 
              type="text" 
              v-model="formData.name" 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="email">邮箱</label>
            <input 
              id="email" 
              type="email" 
              v-model="formData.email" 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="phone">手机号</label>
            <input 
              id="phone" 
              type="tel" 
              v-model="formData.phone" 
              placeholder="请输入手机号"
            />
          </div>
          
          <div class="form-group">
            <label>性别</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" v-model="formData.gender" value="male">
                <span>男</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="formData.gender" value="female">
                <span>女</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="formData.gender" value="other">
                <span>其他</span>
              </label>
            </div>
          </div>
          
          <div class="form-group">
            <label for="birthday">生日</label>
            <input 
              id="birthday" 
              type="date" 
              v-model="formData.birthday" 
            />
          </div>
          
          <div class="form-actions">
            <Button variant="outline" type="button" @click="cancelEditing">取消</Button>
            <Button variant="primary" type="submit" :loading="saving">保存</Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import Button from '@/components/common/Button.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';

// Setup
const userStore = useUserStore();

// State
const loading = ref(true);
const isEditing = ref(false);
const saving = ref(false);

// User data
const user = ref({
  id: '',
  name: '',
  email: '',
  phone: '',
  gender: '',
  birthday: '',
  avatar: ''
});

// Form data for editing
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  gender: '',
  birthday: '',
  avatar: ''
});

// Methods
const startEditing = () => {
  // Initialize form with current user data
  Object.assign(formData, { ...user.value });
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const saveProfile = async () => {
  saving.value = true;
  
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update user data
    Object.assign(user.value, { ...formData });
    
    // Exit edit mode
    isEditing.value = false;
  } catch (error) {
    console.error('Failed to save profile:', error);
  } finally {
    saving.value = false;
  }
};

const uploadAvatar = () => {
  // In a real app, this would open a file picker
  // For now, we'll just simulate it with a random avatar
  const avatarId = Math.floor(Math.random() * 8) + 1;
  formData.avatar = `/images/avatars/avatar-${avatarId}.jpg`;
};

const removeAvatar = () => {
  formData.avatar = '';
};

const formatGender = (gender: string): string => {
  if (!gender) return '未设置';
  
  const genderMap: Record<string, string> = {
    male: '男',
    female: '女',
    other: '其他'
  };
  
  return genderMap[gender] || gender;
};

// Fetch user data
const fetchUserData = async () => {
  try {
    // In a real app, this would be an API call
    // For now, we'll use mock data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data
    user.value = {
      id: '123',
      name: '张三',
      email: 'zhangsan@example.com',
      phone: '13800138000',
      gender: 'male',
      birthday: '1990-01-01',
      avatar: '/images/avatars/avatar-1.jpg'
    };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  } finally {
    loading.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
.user-profile {
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  padding: var(--space-lg);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: var(--space-xl);
}

.profile-content {
  display: flex;
  gap: var(--space-xl);
}

.profile-avatar {
  flex-shrink: 0;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
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
  font-size: 2rem;
  font-weight: bold;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.current-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
}

.upload-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.profile-details {
  flex: 1;
}

.detail-item {
  display: flex;
  margin-bottom: var(--space-md);
}

.detail-label {
  width: 100px;
  color: var(--color-text-light);
}

.detail-value {
  flex: 1;
  font-weight: 500;
  color: var(--color-text);
}

.edit-form {
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
  font-size: 0.95rem;
  color: var(--color-text);
}

.form-group input {
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  font-size: 0.95rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.radio-group {
  display: flex;
  gap: var(--space-md);
}

.radio-label {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-md);
}

@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
    align-items: center;
  }
  
  .profile-details {
    width: 100%;
  }
}
</style>
