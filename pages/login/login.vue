<template>
  <view class="container">
    <view class="form-container">
      <input class="input" placeholder="请输入学号" v-model="form.studentId" />
      <view class="password-container">
        <input class="input" placeholder="请输入密码" v-model="form.password" :type="showPassword ? 'text' : 'password'">
        <view class="eye-icon" @click="showPassword = !showPassword">
          <image :src="showPassword ? eye_show : eye_hide" style="width: 60rpx; height: 60rpx;" />
        </view>
      </view>
      <!-- 将记住密码和忘记密码放在同一行 -->
      <view class="remember-row">
        <checkbox v-model="rememberMe" style="margin-right: 10rpx;">记住密码</checkbox>
        <view class="forget-password" @click="showSimpleDialog">忘记密码</view>
      </view>
      
      <view class="button-group">
        <view class="button login-btn" @click="handleLogin">登录</view>
        <view class="button register-btn" @click="navigateToRegister">注册</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { login } from '@/api/user';
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';
import uniPopupDialog from '@dcloudio/uni-ui/lib/uni-popup-dialog/uni-popup-dialog.vue';

// 封装存储和读取带有过期时间的数据
const setStorageWithExpire = (key, value, expire) => {
  const data = {
    value,
    expire: Date.now() + expire * 1000 // 过期时间（毫秒）
  };
  uni.setStorageSync(key, data);
};

const getStorageWithExpire = (key) => {
  const data = uni.getStorageSync(key);
  if (!data || Date.now() > data.expire) {
    uni.removeStorageSync(key); // 如果过期，清除数据
    return null;
  }
  return data.value;
};

const userStore = useUserStore();

const form = ref({
  studentId: '',
  password: ''
});
const rememberMe = ref(false);
const showPassword = ref(false);

const eye_show = ref("http://stm89m2wy.hd-bkt.clouddn.com/uni/icon/eye_show.png")
const eye_hide = ref("http://stm89m2wy.hd-bkt.clouddn.com/uni/icon/eye_hide.png")

// 显示忘记密码弹窗
const showSimpleDialog = () => {
  uni.showModal({
    title: '忘记密码',
    content: '请联系管理员：13088889999',
    showCancel: false,
    confirmText: '确定'
  });
};

// 关闭忘记密码弹窗
const closeForgotPasswordDialog = () => {
  forgotPasswordDialog.value.close();
};


const handleLogin = async () => {
  if (!form.value.studentId) {
    uni.showToast({
      title: '请输入学号',
      icon: 'none'
    });
    return;
  }
  if (!form.value.password) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none'
    });
    return;
  }
  
  try {
    const params = {
      studentId: form.value.studentId,
      password: form.value.password
    };
    
    const result = await login(params);
    
    // 检查账号状态
    if (result.data.status != 1) {
      uni.showToast({
        title: '您的账号已被限制登录，请联系管理员',
        icon: 'none'
      });
      return; // 直接返回，不执行后续操作
    }
    
    if (result.code === 0) {
      const userInfo = result.data || {
        studentId: form.value.studentId,
        nickName: `用户${form.value.studentId}`,
        avatarUrl: 'https://mp-b58e33c4-f164-4150-809d-6e1f78c8b7bb.cdn.bspapp.com/icons/avatar1.png'
      };
      
      // 更新全局状态
      userStore.setUserInfo(userInfo);
      userStore.setIsLoggedIn(true);
      
      // 更新本地存储，设置过期时间为 1 小时（3600 秒）
      setStorageWithExpire('studentId', form.value.studentId, 3600);
      setStorageWithExpire('isLoggedIn', true, 3600);
      setStorageWithExpire('userInfo', userInfo, 3600);
      
      // 如果勾选"记住密码"，保存账号密码
      if (rememberMe.value) {
        setStorageWithExpire('savedCredentials', {
          studentId: form.value.studentId,
          password: form.value.password
        }, 3600);
      }

      uni.showToast({
        title: '登录成功',
        icon: 'success'
      });

      // 先刷新页面，再跳转到首页
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/home/home'
        });
      }, 1500);
    } else {
      // 登录失败，显示错误信息
      uni.showToast({
        title: result.data.message || '登录失败，请检查账号和密码',
        icon: 'none'
      });
    }
  } catch (error) {
    // 登录失败，显示错误信息
    uni.showToast({
        title: error.response?.data?.message || '登陆失败，请检查账号和密码',
        icon: 'none'
    });
  }
};

// 页面加载时检查是否有保存的登录信息
onMounted(() => {
  const savedCredentials = getStorageWithExpire('savedCredentials');
  if (savedCredentials) {
    form.value.studentId = savedCredentials.studentId;
    form.value.password = savedCredentials.password;
    rememberMe.value = true;
  }
});

const navigateToRegister = () => {
  uni.navigateTo({
    url: '/pages/register/register'
  });
};
</script>

<style scoped>
.container {
  padding: 20rpx;
}

.form-container {
  margin-top: 100rpx;
}

.input {
  background: #fff;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 40rpx;
}

.button {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.login-btn {
  background-color: #007AFF;
  color: #fff;
  margin-right: 10rpx;
}

.register-btn {
  background-color: #f0f0f0;
  color: #333;
  margin-left: 10rpx;
}

.password-container {
  position: relative;
  margin-bottom: 20rpx;
}

.eye-icon {
  position: absolute;
  right: 20rpx;
  top: 60%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 40rpx;
}

/* 新增记住密码行样式 */
.remember-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

/* 调整忘记密码样式 */
.forget-password {
  color: #007AFF;
  font-size: 28rpx;
}
</style>