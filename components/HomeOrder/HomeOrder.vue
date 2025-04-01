<template>
    <view class="order-card">
      <!-- 头像、昵称 -->
      <view class="order-header">
        <image class="avatar" :src="order.avatarUrl" lazy-load></image>
        <text class="nickname">{{ order.nickname }}</text>
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
  
      <!-- 发布时间 -->
      <view class="order-footer">
        <text class="publish-time">发布时间：{{ order.publishTime }}</text>
        <button class="accept-button" @click="handleClick">接单</button>
      </view>
    </view>
  </template>
  
  <script setup>
  const props = defineProps({
    order: {
      type: Object,
      required: true
    },
    onAccept: {
      type: Function,
      required: true
    }
  });
  
  const handleClick = () => {
    props.onAccept(props.order);
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
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid #eee;
    width: 100%;
  }
  
  .publish-time {
    font-size: 24rpx;
    color: #999;
    flex: 1;
    margin-right: 20rpx;
  }
  .accept-button {
    padding: 6rpx 16rpx;
    background-color: #007AFF;
    color: white;
    border-radius: 6rpx;
    font-size: 24rpx;
    border: none;
    outline: none;
    box-shadow: 0 2rpx 6rpx rgba(0, 122, 255, 0.3);
    min-width: 100rpx;
    height: 50rpx;
    line-height: 50rpx;
    white-space: nowrap;
  }
  </style> 