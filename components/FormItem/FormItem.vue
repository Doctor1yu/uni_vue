<template>
  <view class="form-item">
    <view class="label">{{ label }}</view>
    <slot></slot>
  </view>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true
  }
});
</script>

<style>
.form-item {
  margin-bottom: 30rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
}
</style>