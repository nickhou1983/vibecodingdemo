import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);
  const isAuthenticated = computed(() => currentUser.value !== null);
  
  const login = async (email: string, password: string) => {
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      currentUser.value = {
        id: '1',
        name: 'Demo User',
        email: email,
        avatar: null
      };
      
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };
  
  const register = async (name: string, email: string, password: string) => {
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      currentUser.value = {
        id: '1',
        name,
        email,
        avatar: null
      };
      
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };
  
  const logout = () => {
    currentUser.value = null;
  };
  
  const updateProfile = async (userData: Partial<User>) => {
    try {
      // This would be an API call in a real application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (currentUser.value) {
        currentUser.value = {
          ...currentUser.value,
          ...userData
        };
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };
  
  return {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  };
});
