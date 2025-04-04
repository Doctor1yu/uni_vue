<template>
  <view class="order-card">
    <!-- 头像、昵称、状态 -->
    <view class="order-header">
      <image class="avatar" :src="order.publisherAvatarUrl"></image>
      <text class="nickname">{{ order.publisherNickName }}</text>
      <text class="status">{{ getStatusText(order.status) }}</text>
    </view>

    <!-- 拿货地点 -->
    <view class="order-info">
      <text class="label">拿货地点：</text>
      <text class="value">{{ order.pickupPoint }}</text>
      <text class="amount">￥{{ order.amount }}</text>
    </view>

    <!-- 收货地点 -->
    <view class="order-info">
      <text class="label">收货地点：</text>
      <text class="value">{{ order.location }}</text>
    </view>

    <!-- 发布时间或完成时间 -->
    <view class="order-footer">
      <text class="publish-time">
        {{ order.status === '3' ? '完成时间：' + formatTime(order.completedTime) : '发布时间：' + formatTime(order.createdAt) }}
      </text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  order: {
    type: Object,
    required: true
  }
});

// 新增状态转换函数
const getStatusText = (status) => {
  switch (status) {
    case '1':
      return '已发布';
    case '2':
      return '进行中';
    case '3':
      return '已完成';
    default:
      return '未知状态';
  }
};

// 新增时间格式化函数
const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
</script>

<style scoped>
.order-card {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 10rpx;
}

.nickname {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.status {
  font-size: 28rpx;
  color: #007AFF;
}

.order-info {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.label {
  font-size: 28rpx;
  color: #666;
}

.value {
  font-size: 28rpx;
  color: #333;
  flex: 1;
}

.amount {
  font-size: 28rpx;
  color: #007AFF;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20rpx;
}

.publish-time {
  font-size: 24rpx;
  color: #999;
}
</style> 