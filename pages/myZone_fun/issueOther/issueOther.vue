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
        :key="index" 
        :order="order" 
      />
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getOrdersByAcceptorIdAndStatus } from '@/api/order';
import { useUserStore } from '@/stores/user';
import OrderCard from '@/components/OrderCard/OrderCard.vue';

const userStore = useUserStore();
const activeTab = ref('inProgress');

// 切换选项卡
const switchTab = async (tab) => {
  activeTab.value = tab;
  await fetchOrders();
};

// 获取订单数据
const fetchOrders = async () => {
  try {
    const status = activeTab.value === 'inProgress' ? '2' : '3';
    const acceptorId = userStore.userInfo.studentId;

    const res = await getOrdersByAcceptorIdAndStatus(acceptorId, status);
    myOrders.value = res.data;
  } catch (error) {
    uni.showToast({
      title: '获取订单失败，请稍后重试',
      icon: 'none'
    });
  }
};

// 监听选项卡变化
onMounted(() => {
  fetchOrders();
});

// 订单数据
const myOrders = ref([]);

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
