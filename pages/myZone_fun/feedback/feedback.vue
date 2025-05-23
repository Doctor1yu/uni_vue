<template>
  <view class="container">
    <!-- 我的反馈界面 -->
    <view class="feedback-list">
      <view 
        v-for="(feedback, index) in feedbacks" 
        :key="index" 
        class="feedback-card"
        @click="handleFeedbackClick(feedback)"
      >
        <text class="feedback-content">{{ feedback.content }}</text>
        <text class="feedback-time">{{ feedback.time }}</text>
      </view>
    </view>

    <!-- 反馈详情弹窗 -->
    <uni-popup ref="popup" type="center" :mask-click="false">
      <view class="feedback-modal">
        <view class="modal-header">
          <text class="modal-title">反馈详情</text>
        </view>
        <view class="modal-content">
          <view class="modal-item">
            <text class="label">反馈原因：</text>
            <text class="value">{{ currentFeedback.subject }}</text>
          </view>
          <view class="modal-item">
            <text class="label">反馈内容：</text>
            <text class="value">{{ currentFeedback.content }}</text>
          </view>
          <view class="modal-item">
            <text class="label">反馈状态：</text>
            <text class="value">
              {{
                currentFeedback.status === 1 ? '未解决' :
                currentFeedback.status === 2 ? '处理中' :
                '已解决'
              }}
            </text>
          </view>
          <view class="modal-item">
            <text class="label">反馈时间：</text>
            <text class="value">{{ new Date(currentFeedback.createdAt).toLocaleString() }}</text>
          </view>
          <view v-if="currentFeedback.status !== 1" class="modal-item">
            <text class="label">处理内容：</text>
            <text class="value">{{ currentFeedback.answer }}</text>
          </view>
          <view v-if="currentFeedback.status !== 1" class="modal-item">
            <text class="label">处理人：</text>
            <text class="value">{{ currentFeedback.answerName }}</text>
          </view>
          <view v-if="currentFeedback.status !== 1" class="modal-item">
            <text class="label">处理时间：</text>
            <text class="value">{{ new Date(currentFeedback.updatedAt).toLocaleString() }}</text>
          </view>
        </view>
        <view class="modal-footer">
          <button v-if="currentFeedback.status === 2" class="complete-btn" @click="handleCompleteFeedback">已完成</button>
          <button class="close-btn" @click="popup.close()">关闭</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';
import { useUserStore } from '@/stores/user';
import { getFeedbacks, updateFeedbackStatus } from '@/api/feedback';

const userStore = useUserStore();
const popup = ref(null);
const currentFeedback = ref(null);
const feedbacks = ref([]);

// 获取反馈数据
const fetchFeedbacks = async () => {
  try {
    const response = await getFeedbacks(userStore.userInfo.studentId);
    if (response && response.code === 0 && Array.isArray(response.data)) {
      feedbacks.value = response.data.map(item => ({
        ...item,
        time: new Date(item.createdAt).toLocaleString()
      }));
      
      // 添加空数据提示
      if (feedbacks.value.length === 0) {
        uni.showToast({
          title: '暂无反馈记录',
          icon: 'none'
        });
      }
    } else {
      uni.showToast({
        title: '获取反馈失败，数据异常',
        icon: 'none'
      });
    }
  } catch (error) {
    uni.showToast({
      title: '获取反馈失败，请稍后重试',
      icon: 'none'
    });
  }
};

// 点击反馈项处理
const handleFeedbackClick = (feedback) => {
  currentFeedback.value = feedback;
  popup.value.open();
};

// 处理点击"已完成"按钮逻辑
const handleCompleteFeedback = async () => {
  try {
    const response = await updateFeedbackStatus(currentFeedback.value.id);
    if (response && response.code === 0) {
      // 更新反馈状态为已完成
      currentFeedback.value.status = 3;
      // 更新处理时间为当前时间
      currentFeedback.value.updatedAt = new Date().toISOString();
      uni.showToast({
        title: '反馈状态已更新为已完成',
        icon: 'success'
      });
      // 重新获取反馈数据
      await fetchFeedbacks();
    } else {
      uni.showToast({
        title: '更新反馈状态失败',
        icon: 'none'
      });
    }
  } catch (error) {
    uni.showToast({
      title: '更新反馈状态失败，请稍后重试',
      icon: 'none'
    });
  }
};

onMounted(() => {
  fetchFeedbacks();
});
</script>

<style scoped>
.container {
  padding: 20rpx;
}

/* 我的反馈列表 */
.feedback-list {
  margin-top: 20rpx;
}

/* 反馈卡片 */
.feedback-card {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.feedback-content {
  font-size: 28rpx;
  color: #333;
}

.feedback-time {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
  display: block;
}

/* 新增：反馈弹窗样式 */
.feedback-modal {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  width: 80%;
  margin: 0 auto;
}

.modal-header {
  margin-bottom: 30rpx;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.modal-content {
  margin-bottom: 30rpx;
}

.modal-item {
  margin-bottom: 20rpx;
}

.modal-item .label {
  font-size: 28rpx;
  color: #666;
}

.modal-item .value {
  font-size: 28rpx;
  color: #333;
}

.modal-footer {
  text-align: right;
}

.close-btn {
  background-color: #007AFF;
  color: #fff;
  padding: 10rpx 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
}
</style>
