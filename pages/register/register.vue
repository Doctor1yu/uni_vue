<template>
  <view class="container">
    <view class="form-container">
      <view class="avatar-container">
        <image class="avatar" :src="form.avatarUrl || defaultAvatar"></image>
        <text class="upload-text" @click="uploadAvatar">上传头像</text>
      </view>
      <input class="input" placeholder="请输入学号" v-model="form.studentId" />
      <input class="input" placeholder="请输入手机号" v-model="form.phoneNumber" />
      <input class="input" placeholder="请输入昵称" v-model="form.nickName" />
      <input class="input" placeholder="请输入密码" v-model="form.password" type="password" />
      <input class="input" placeholder="请确认密码" v-model="form.confirmPassword" type="password" />
      <view class="button register-btn" @click="handleRegister">注册</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { register } from '../../utils/api.js';

const defaultAvatar = ref('/static/images/avatar1.png');
const form = ref({
  avatarUrl: '',
  studentId: '',
  phoneNumber: '',
  nickName: '',
  password: '',
  confirmPassword: ''
});
const loading = ref(false);

const uploadAvatar = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      form.value.avatarUrl = res.tempFilePaths[0];
    }
  });
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

.avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  border: 4rpx solid #ddd;
}

.upload-text {
  display: block;
  margin-top: 10rpx;
  color: #007AFF;
  font-size: 28rpx;
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
</style> 