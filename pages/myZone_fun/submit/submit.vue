<template>
  <view class="container">
    <!-- 加入流程 box -->
    <view class="process-box">
      <view class="process-title">加入流程</view>
      <view class="process-steps">
        <view class="step">
          <text :class="['step-number', { 'step-number-active': applicationStatus == 2 }]">1</text>
          <text class="step-text">提交资料</text>
        </view>
        <view class="step">
          <text :class="['step-number', { 'step-number-active': applicationStatus == 1 }]">2</text>
          <text class="step-text">平台审核</text>
        </view>
        <view class="step">
          <text :class="['step-number', { 'step-number-active': applicationStatus == 3 || applicationStatus == 4 }]">3</text>
          <text class="step-text">审核结果</text>
        </view>
      </view>
    </view>

    <!-- 根据 applicationStatus 显示不同内容 -->
    <view v-if="applicationStatus == 2" class="submit-box">
      <view class="submit-title">提交申请</view>
      <view class="form-item">
        <text class="label">学号</text>
        <view class="input">{{ form.studentId }}</view>
      </view>
      <view class="form-item">
        <text class="label">申请理由</text>
        <textarea class="textarea" placeholder="请输入申请理由（不少于10字）" v-model="form.reason" />
      </view>
      <view class="form-item">
        <text class="label">收款码照片</text>
        <button class="upload-button" @click="choosePaymentCode">选择照片</button>
      </view>
      <view v-if="paymentCodeImage" class="form-item">
        <image :src="paymentCodeImage" class="uploaded-image" mode="aspectFit"></image>
      </view>
      <view class="submit-btn" @click="handleSubmit">提交申请</view>
    </view>

    <view v-else-if="applicationStatus == 1" class="status-box">
      <view class="status-title">平台审核</view>
      <view class="status-text">已提交申请，请耐心等待</view>
    </view>

    <view v-else-if="applicationStatus == 3" class="status-box">
      <view class="status-title">审核结果</view>
      <view class="status-text">申请通过</view>
      <view class="reviewer">审核人：{{ reviewerName }}</view>
      <view class="remark">通过理由：{{ remark }}</view>
      <view class="reviewed-at">审核时间：{{ reviewedAt }}</view>
      <view class="collect-url">
        <text class="label">收款码：</text>
        <image v-if="paymentCodeImage" :src="paymentCodeImage" class="uploaded-image" mode="aspectFit"></image>
        <text v-else>没有上传的收款码</text>
      </view>
      <view class="reset-btn" @click="handleReset">重新提交申请</view>
    </view>

    <view v-else-if="applicationStatus == 4" class="status-box">
      <view class="status-title">审核结果</view>
      <view class="status-text">拒绝申请</view>
      <view class="reviewer">审核人：{{ reviewerName }}</view>
      <view class="remark">拒绝理由：{{ remark }}</view>
      <view class="reviewed-at">审核时间：{{ reviewedAt }}</view>
      <view class="reset-btn" @click="handleReset">重新提交申请</view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { submit, resetStatus, getLatestApplication } from '@/api/submit';
import { getUserInfo ,getUserCollect} from '@/api/user';
import { formatDateTime } from '@/utils/format';
const userStore = useUserStore();
const applicationStatus = ref(2); // 默认状态为未申请
const reviewerName = ref('');
const remark = ref('');
const reviewedAt = ref('');
const paymentCodeImage = ref(null); // 存储收款码照片

const form = ref({
  studentId: userStore.userInfo.studentId || '',
  reason: ''
});

// 获取申请状态
const fetchApplicationStatus = async () => {
  try {
    const response = await getUserInfo(userStore.userInfo.studentId);
    if (response.code === 0) {
      applicationStatus.value = response.data.applicationStatus;
      if (response.data.applicationStatus == 3 || response.data.applicationStatus == 4) {
        fetchLatestApplication();
      }
    } else {
      uni.showToast({
        title: response.message || '获取申请状态失败',
        icon: 'none'
      });
    }
  } catch (error) {
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none'
    });
  }
};

// 获取最新的申请信息
const fetchLatestApplication = async () => {
  try {
    const response = await getLatestApplication(userStore.userInfo.studentId);
    if (response.code === 0) {
      reviewerName.value = response.data.reviewerName;
      remark.value = response.data.remark;
      reviewedAt.value = formatDateTime(response.data.reviewedAt);

      // 如果审核通过，获取收款码
      if (applicationStatus.value == 3) {
        const collectRes = await getUserCollect(userStore.userInfo.studentId);
        if (collectRes.code === 0) {
          paymentCodeImage.value = collectRes.data; // 更新收款码照片
        }
      }
    } else {
      uni.showToast({
        title: response.message || '获取申请信息失败',
        icon: 'none'
      });
    }
  } catch (error) {
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none'
    });
  }
};

// 选择收款码照片
const choosePaymentCode = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePaths = res.tempFilePaths;
      uni.uploadFile({
        url: '/apiUni/api/collect/upload', // 上传收款码的接口
        filePath: tempFilePaths[0],
        name: 'file',
        formData: {
          studentId: form.value.studentId, // 传递学号
        },
        success: () => {
          console.log('上传成功');
          uni.showToast({ title: '上传成功', icon: 'success' });
          paymentCodeImage.value = tempFilePaths[0]; // 更新显示的图片
        },
        fail: (error) => {
          console.error('上传失败:', error);
          uni.showToast({ title: '上传失败', icon: 'none' });
        }
      });
    },
    fail: (error) => {
      console.error('选择照片失败:', error);
      uni.showToast({ title: '选择照片失败', icon: 'none' });
    }
  });
};

// 提交申请
const handleSubmit = async () => {
  if (!form.value.studentId) {
    uni.showToast({ title: '请输入学号', icon: 'none' });
    return;
  }
  if (!form.value.reason) {
    uni.showToast({ title: '请输入申请理由', icon: 'none' });
    return;
  }
  if (form.value.reason.length < 10) {
    uni.showToast({ title: '申请理由不得少于10字', icon: 'none' });
    return;
  }
  if (!paymentCodeImage.value) {
    uni.showToast({ title: '请上传收款码照片', icon: 'none' });
    return;
  }

  try {
    const response = await submit({
      studentId: form.value.studentId,
      applyReason: form.value.reason,
      paymentCode: paymentCodeImage.value // 传递收款码照片路径
    });
    if (response.code === 0) {
      uni.showToast({ title: '申请提交成功', icon: 'success' });
      applicationStatus.value = 1;
      setTimeout(() => {
        uni.switchTab({ url: '/pages/myZone/myZone' });
      }, 1000);
    } else {
      uni.showToast({ title: response.data?.message || '申请提交失败', icon: 'none' });
    }
  } catch (error) {
    uni.showToast({ title: '网络错误，请重试', icon: 'none' });
  }
};

// 重置申请状态
const handleReset = async () => {
  try {
    const response = await resetStatus(userStore.userInfo.studentId);
    if (response.code === 0) {
      applicationStatus.value = 2; // 重置为未申请
      uni.showToast({
        title: '已重置申请状态',
        icon: 'success'
      });
    } else {
      uni.showToast({
        title: response.data?.message || '重置状态失败',
        icon: 'none'
      });
    }
  } catch (error) {
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none'
    });
  }
};

// 页面加载时获取申请状态
onMounted(() => {
  fetchApplicationStatus();
});
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
  background: #007AFF; /* 默认蓝色 */
  color: #fff;
  border-radius: 50%;
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

.step-number-active {
  background: #ff4d4f; /* 激活步骤的红色 */
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

.input, .textarea {
  width: 92%; /* 设置相同的宽度 */
  background: #f5f5f5;
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 28rpx;
}

.textarea {
  height: 200rpx; /* 保持 textarea 的高度 */
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

/* 状态 box */
.status-box {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.status-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.status-text {
  font-size: 32rpx;
  color: #666;
}

.reviewer, .remark, .reviewed-at {
  font-size: 32rpx;
  color: #666;
  margin-top: 10rpx;
}

/* 重置按钮 */
.reset-btn {
  background-color: #ff4d4f;
  color: #fff;
  text-align: center;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  margin-top: 20rpx;
}

/* 新增：上传收款码按钮 */
.upload-button {
  background-color: #007AFF;
  color: #fff;
  text-align: center;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
  margin-top: 20rpx;
}

/* 新增：上传收款码图片预览 */
.uploaded-image {
  width: 400rpx; /* 增加宽度 */
  height: 400rpx; /* 增加高度 */
  object-fit: cover;
  border-radius: 8rpx;
  margin: auto; /* 确保图片居中显示 */
}

.collect-url {
  display: flex;
  flex-direction: column; /* 使内容垂直排列 */
  align-items: flex-start; /* 使标签左对齐 */
  margin-top: 20rpx; /* 调整与其他元素的间距 */
}
</style>
