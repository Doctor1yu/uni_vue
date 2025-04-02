import { defineStore } from 'pinia';

// 封装存储和读取带有过期时间的数据
const getStorageWithExpire = (key) => {
  const data = uni.getStorageSync(key);
  if (!data || Date.now() > data.expire) {
    uni.removeStorageSync(key); // 如果过期，清除数据
    return null;
  }
  return data.value;
};

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      applicationStatus: 2, // 默认状态为未申请
      studentId: ''
    },
    isLoggedIn: false
  }),
  
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = {
        id: userInfo.id,
        studentId: userInfo.studentId,
        password: userInfo.password,
        phoneNumber: userInfo.phoneNumber,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        role: userInfo.role,
        status: userInfo.status,
        applicationStatus: userInfo.applicationStatus || 2, // 默认状态为未申请
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt
      };
    },
    
    setIsLoggedIn(status) {
      this.isLoggedIn = status;
    },
    
    logout() {
      this.userInfo = null;
      this.isLoggedIn = false;
      uni.removeStorageSync('studentId');
      uni.removeStorageSync('userInfo');
      uni.removeStorageSync('isLoggedIn');
      uni.removeStorageSync('savedCredentials'); // 清除保存的登录信息
    },
    
    // 初始化状态，从缓存中恢复
    initUserState() {
      const isLoggedIn = getStorageWithExpire('isLoggedIn');
      const userInfo = getStorageWithExpire('userInfo');
      
      if (isLoggedIn && userInfo) {
        this.isLoggedIn = true;
        this.userInfo = userInfo;
      } else {
        // 如果数据已过期，清除存储并重置状态
        this.logout();
      }
    },

    // 清除用户信息
    clearUserInfo() {
      this.userInfo = null
    },

    setApplicationStatus(status) {
      this.userInfo.applicationStatus = status;
    }
  }
}); 