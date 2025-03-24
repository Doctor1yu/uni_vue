<template>
  <view>
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="nav-left" @click="handleBack">
        <uni-icons type="arrowleft" size="24" color="#333"></uni-icons>
        <text>返回</text>
      </view>
      <view class="nav-title">平台投诉</view>
      <view class="nav-right"></view>
    </view>

    <!-- 页面内容 -->
    <view class="container">
      <view class="form-container">
        <!-- 反馈主题 -->
        <picker class="picker" mode="selector" :range="subjectOptions" @change="handleSubjectChange">
          <view class="picker-view">
            <text>{{ form.subject || '请选择反馈主题' }}</text>
            <uni-icons type="arrowdown" size="20" color="#999"></uni-icons>
          </view>
        </picker>
        <!-- 反馈内容 -->
        <textarea class="textarea" placeholder="请输入反馈内容" v-model="form.content"></textarea>
        <!-- 联系方式 -->
        <input class="input" placeholder="请输入联系方式" v-model="form.phoneNumber" />
        <!-- 提交按钮 -->
        <view class="submit-btn" @click="handleSubmit">提交</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user'; // 导入用户 store
import { issueFeedback } from '@/utils/api'; // 新增导入

const userStore = useUserStore();

// 反馈主题选项
const subjectOptions = ref([
  '快递员问题',
  '平台问题',
  '送货时间安排',
  '金额问题',
  '其他问题'
]);

const form = ref({
  subject: '',
  content: '',
  phoneNumber: ''
});

// 处理主题选择
const handleSubjectChange = (e) => {
  form.value.subject = subjectOptions.value[e.detail.value];
};

const handleSubmit = async () => {
  if (!form.value.subject) {
    uni.showToast({
      title: '请输入反馈主题',
      icon: 'none'
    });
    return;
  }
  if (!form.value.content) {
    uni.showToast({
      title: '请输入反馈内容',
      icon: 'none'
    });
    return;
  }
  if (!form.value.phoneNumber) {
    uni.showToast({
      title: '请输入联系方式',
      icon: 'none'
    });
    return;
  }

  try {
    const res = await issueFeedback({
      studentId: userStore.userInfo.studentId,
      subject: form.value.subject,
      content: form.value.content,
      phoneNumber: form.value.phoneNumber
    });

    uni.showToast({
      title: '提交成功',
      icon: 'success'
    });

    // 1秒后跳转到首页
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/home/home'
      });
    }, 1000);
  } catch (error) {
    uni.showToast({
      title: '提交失败，请重试',
      icon: 'none'
    });
  }
};

// 处理返回按钮点击
const handleBack = () => {
  // 显示加载动画
  uni.showLoading({
    title: '加载中...',
    mask: true
  });

  // 1秒后跳转到首页
  setTimeout(() => {
    uni.hideLoading(); // 隐藏加载动画
    uni.reLaunch({
      url: '/pages/home/home'
    });
  }, 100);
};

onMounted(() => {
  // 检查用户是否登录
  if (!userStore.userInfo || !userStore.userInfo.studentId) {
    uni.showToast({
      title: '请先登录后操作',
      icon: 'none'
    });
    // 跳转到 myZone 界面并刷新
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/myZone/myZone'
      });
    }, 1000);
    return;
  }
});
</script>

<style>
/* 自定义导航栏 */
.custom-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #e5e5e5;
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-left text {
  font-size: 28rpx;
  color: #333;
  margin-left: 10rpx;
}

.nav-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.nav-right {
  width: 60rpx; /* 占位，保持对称 */
}

/* 页面内容 */
.container {
  padding: 20rpx;
}

.form-container {
  margin-top: 50rpx;
}

.input {
  background: #fff;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.textarea {
  background: #fff;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  width: 100%;
  height: 200rpx;
  box-sizing: border-box;
}

.submit-btn {
  background-color: #007AFF;
  color: #fff;
  text-align: center;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  margin-top: 40rpx;
}

/* 新增选择器样式 */
.picker {
  background: #fff;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.picker-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.picker-view text {
  color: #333;
  font-size: 28rpx;
}

.picker-view text:empty::before {
  content: '请选择反馈主题';
  color: #999;
}
</style>
