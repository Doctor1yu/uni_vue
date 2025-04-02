<template>
  <view class="container">
    <!-- 加入流程 box -->
    <view class="process-box">
      <view class="process-title">加入流程</view>
      <view class="process-steps">
        <view class="step">
          <text class="step-number">1</text>
          <text class="step-text">提交资料</text>
        </view>
        <view class="step">
          <text class="step-number">2</text>
          <text class="step-text">平台审核</text>
        </view>
        <view class="step">
          <text class="step-number">3</text>
          <text class="step-text">审核通过</text>
        </view>
      </view>
    </view>

    <!-- 提交 box -->
    <view class="submit-box">
      <view class="submit-title">提交申请</view>
      <view class="form-item">
        <text class="label">学号</text>
        <input class="input" placeholder="请输入学号" v-model="form.studentId" />
      </view>
      <view class="form-item">
        <text class="label">申请理由</text>
        <textarea class="textarea" placeholder="请输入申请理由（不少于10字）" v-model="form.reason" />
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-btn" @click="handleSubmit">提交申请</view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user'; // 导入用户 store
import { submit } from '@/api/submit'; // 导入提交申请接口

const userStore = useUserStore();

const form = ref({
  studentId: userStore.userInfo.studentId || '', // 默认填充当前用户的学号
  reason: '' // 申请理由
});

// 提交申请
const handleSubmit = async () => {
  if (!form.value.studentId) {
    uni.showToast({
      title: '请输入学号',
      icon: 'none'
    });
    return;
  }
  if (!form.value.reason) {
    uni.showToast({
      title: '请输入申请理由',
      icon: 'none'
    });
    return;
  }
  if (form.value.reason.length < 10) {
    uni.showToast({
      title: '申请理由不得少于20字',
      icon: 'none'
    });
    return;
  }

  try {
    // 调用提交申请接口
    const response = await submit({
      studentId: form.value.studentId,
      applyReason: form.value.reason
    });

    if (response.code === 0) {
      uni.showToast({
        title: '申请提交成功',
        icon: 'success'
      });

      // 1秒后跳转到个人中心界面
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/myZone/myZone'
        });
      }, 1000);
    } else {
      uni.showToast({
        title: response.data?.message || '申请提交失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('提交失败:', error);
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none'
    });
  }
};
</script>

<style scoped>
.container {
  padding: 20rpx;
}

/* 加入流程 box */
.process-box {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.process-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.process-steps {
  display: flex;
  justify-content: space-between;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-number {
  width: 50rpx;
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  background: #007AFF;
  color: #fff;
  border-radius: 50%;
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

.step-text {
  font-size: 28rpx;
  color: #666;
}

/* 提交 box */
.submit-box {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
}

.submit-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.form-item {
  margin-bottom: 20rpx;
}

.label {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 10rpx;
}

.input {
  background: #f5f5f5;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.textarea {
  background: #f5f5f5;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
  height: 200rpx;
}

/* 提交按钮 */
.submit-btn {
  background-color: #007AFF;
  color: #fff;
  text-align: center;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  margin-top: 40rpx;
}
</style>
