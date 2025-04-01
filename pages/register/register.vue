<template>
  <view class="container">
    <view class="form-container">
      <view class="avatar-container">
        <view class="avatar-options">
          <view class="avatar-option" :class="{ selected: form.avatarUrl === maleAvatar }" @click="selectAvatar(maleAvatar)">
            <image class="avatar" :src="maleAvatar"></image>
            <text class="avatar-label">男</text>
          </view>
          <view class="avatar-option" :class="{ selected: form.avatarUrl === femaleAvatar }" @click="selectAvatar(femaleAvatar)">
            <image class="avatar" :src="femaleAvatar"></image>
            <text class="avatar-label">女</text>
          </view>
        </view>
      </view>
      <input class="input" placeholder="请输入学号(必填)" v-model="form.studentId" />
      <input class="input" placeholder="请输入手机号(必填)" v-model="form.phoneNumber" />
      <input class="input" placeholder="请输入昵称(必填)" v-model="form.nickName" />
      <view class="password-container">
        <input class="input" placeholder="请输入密码(必填,6～20位,包含数字和字母)" v-model="form.password" :type="showPassword ? 'text' : 'password'" />
        <view class="eye-icon" @click="showPassword = !showPassword">
          <image :src="showPassword ? eye_show : eye_hide" style="width: 60rpx; height: 60rpx;" />
        </view>
      </view>
      <view class="password-container">
        <input class="input" placeholder="请确认密码" v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" />
        <view class="eye-icon" @click="showConfirmPassword = !showConfirmPassword">
          <image :src="showConfirmPassword ? eye_show : eye_hide" style="width: 60rpx; height: 60rpx;" />
        </view>
      </view>
      <view class="button register-btn" @click="handleRegister">注册</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { register } from '@/api/user';

// 默认头像URL
const maleAvatar = ref('http://stm89m2wy.hd-bkt.clouddn.com/uni/avatarUrl/boy.jpg');
const femaleAvatar = ref('http://stm89m2wy.hd-bkt.clouddn.com/uni/avatarUrl/girl.jpg');
const form = ref({
  avatarUrl: femaleAvatar.value,
  studentId: '',
  phoneNumber: '',
  nickName: '',
  password: '',
  confirmPassword: ''
});
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const eye_show = ref("http://stm89m2wy.hd-bkt.clouddn.com/uni/icon/eye_show.png")
const eye_hide = ref("http://stm89m2wy.hd-bkt.clouddn.com/uni/icon/eye_hide.png")

// 选择头像
const selectAvatar = (url) => {
  form.value.avatarUrl = url;
};

const handleRegister = async () => {
  // 学号验证
  if (!form.value.studentId) {
    uni.showToast({
      title: '请输入学号',
      icon: 'none'
    });
    return;
  }

  // 手机号验证
  if (!form.value.phoneNumber) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none'
    });
    return;
  }

  // 手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(form.value.phoneNumber)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    });
    return;
  }

  // 昵称验证
  if (!form.value.nickName) {
    uni.showToast({
      title: '请输入昵称',
      icon: 'none'
    });
    return;
  }

  // 密码验证
  if (!form.value.password) {
    uni.showToast({
      title: '请输入密码',
      icon: 'none'
    });
    return;
  }

  // 确认密码验证
  if (!form.value.confirmPassword) {
    uni.showToast({
      title: '请确认密码',
      icon: 'none'
    });
    return;
  }

  // 密码一致性验证
  if (form.value.password !== form.value.confirmPassword) {
    uni.showToast({
      title: '两次密码输入不一致',
      icon: 'none'
    });
    return;
  }

  // 密码强度验证（可选）
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!passwordRegex.test(form.value.password)) {
    uni.showToast({
      title: '密码必须包含字母和数字，至少6位',
      icon: 'none'
    });
    return;
  }

  loading.value = true;
  try {
    const params = {
      studentId: form.value.studentId,
      nickName: form.value.nickName,
      phoneNumber: form.value.phoneNumber,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword,
      avatarUrl: form.value.avatarUrl || ''
    };
    
    console.log('注册请求参数:', params);
    
    const result = await register(params);
    
    if (result.code === 0) {
      uni.showToast({
        title: '注册成功',
        icon: 'success'
      });

      // 2秒后跳转到登录界面
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/login/login'
        });
      }, 1500);
    } else {
      uni.showToast({
        title: result.message || '注册失败，请稍后再试',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('注册请求失败', error);
    uni.showToast({
      title: '网络异常，请稍后再试',
      icon: 'none'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.container {
  padding: 20rpx;
}

.form-container {
  margin-top: 50rpx;
}

.avatar-container {
  text-align: center;
  margin-bottom: 40rpx;
}

.avatar-options {
  display: flex;
  justify-content: center;
  gap: 60rpx;
}

.avatar-option {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid #ddd;
  transition: all 0.2s;
}

.avatar-option.selected .avatar {
  border-color: #007AFF;
  transform: scale(1.1);
}

.avatar-label {
  margin-top: 10rpx;
  font-size: 28rpx;
  color: #666;
}

.input {
  background: #fff;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.register-btn {
  background-color: #007AFF;
  color: #fff;
  text-align: center;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  margin-top: 40rpx;
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
</style> 