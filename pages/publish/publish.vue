<template>
  <view>
    <!-- 空页面，仅用于处理点击事件 -->
  </view>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user'; // 导入用户 store

const userStore = useUserStore();

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

  // 页面加载时直接显示弹窗
  uni.showActionSheet({
    itemList: ['发布订单', '提交反馈'],
    success: (res) => {
      if (res.tapIndex === 0) {
        // 跳转到发布订单页面
        uni.navigateTo({
          url: '/pages/publish_fun/order/order'
        });
      } else if (res.tapIndex === 1) {
        // 跳转到提交反馈页面
        uni.navigateTo({
          url: '/pages/publish_fun/complain/complain'
        });
      }
    },
    fail: () => {
      // 如果用户取消选择，跳转到首页
      uni.reLaunch({
        url: '/pages/home/home'
      });
    }
  });
});
</script>

<style>
/* 空页面无需样式 */
</style> 