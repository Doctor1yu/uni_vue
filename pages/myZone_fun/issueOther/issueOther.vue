<template>
  <view class="container">
    <!-- 添加顶部选项卡 -->
    <view class="tabs">
      <view 
        :class="['tab-item', activeTab === 'inProgress' ? 'active' : '']" 
        @click="switchTab('inProgress')"
      >
        正在接单
      </view>
      <view 
        :class="['tab-item', activeTab === 'completed' ? 'active' : '']" 
        @click="switchTab('completed')"
      >
        已完成接单
      </view>
    </view>
    
    <!-- 正在接单界面 -->
    <view v-if="activeTab === 'inProgress'" class="order-list">
      <view v-if="inProgressOrders.length === 0" class="no-data">
        没有新数据
      </view>
      <OrderCard 
        v-for="(order, index) in inProgressOrders" 
        v-else
        :key="index" 
        :order="order" 
      />
    </view>

    <!-- 已完成接单界面 -->
    <view v-if="activeTab === 'completed'" class="order-list">
      <view v-if="completedOrders.length === 0" class="no-data">
        没有新数据
      </view>
      <OrderCard 
        v-for="(order, index) in completedOrders" 
        v-else
        :key="index" 
        :order="order" 
      />
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import OrderCard from '@/components/OrderCard/OrderCard.vue';

// 当前激活的选项卡
const activeTab = ref('inProgress');

// 切换选项卡
const switchTab = (tab) => {
  activeTab.value = tab;
};

// 测试数据
const myOrders = ref([
  {
    publisherAvatarUrl: 'https://mp-b58e33c4-f164-4150-809d-6e1f78c8b7bb.cdn.bspapp.com/icons/avatar1.png',
    publisherNickName: '用户A',
    pickupPoint: '云逸酒店隔壁',
    location: '德馨苑1',
    amount: 5,
    createdAt: '2023-10-01T12:00:00Z',
    status: '2' // 正在进行中
  },
  {
    publisherAvatarUrl: 'https://mp-b58e33c4-f164-4150-809d-6e1f78c8b7bb.cdn.bspapp.com/icons/avatar1.png',
    publisherNickName: '用户B',
    pickupPoint: '学校超市',
    location: '尚行楼1',
    amount: 8,
    createdAt: '2023-10-02T14:30:00Z',
    status: '3' // 已完成
  }
]);

// 计算属性
const inProgressOrders = computed(() => myOrders.value.filter(order => order.status === '2'));
const completedOrders = computed(() => myOrders.value.filter(order => order.status === '3'));
</script>

<style scoped>
.container {
  padding: 20rpx;
}

/* 订单列表 */
.order-list {
  margin-top: 20rpx;
}

/* 新增选项卡样式 */
.tabs {
  display: flex;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 20rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
}

.tab-item.active {
  color: #007AFF;
  border-bottom: 4rpx solid #007AFF;
}

/* 没有数据时的样式 */
.no-data {
  text-align: center;
  font-size: 28rpx;
  color: #999;
  padding: 40rpx 0;
}
</style>
