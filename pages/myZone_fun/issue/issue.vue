<template>
  <view class="container">
    <!-- 添加顶部选项卡 -->
    <view class="tabs">
      <view 
        :class="['tab-item', activeTab === 'myPosts' ? 'active' : '']" 
        @click="switchTab('myPosts')"
      >
        已发布
      </view>
      <view 
        :class="['tab-item', activeTab === 'inProgress' ? 'active' : '']" 
        @click="switchTab('inProgress')"
      >
        进行中
      </view>
      <view 
        :class="['tab-item', activeTab === 'completed' ? 'active' : '']" 
        @click="switchTab('completed')"
      >
        已完成
      </view>
    </view>
    
    <!-- 已发布界面 -->
    <view v-if="activeTab === 'myPosts'" class="order-list">
      <view v-if="publishedOrders.length === 0" class="no-data">
        没有新数据
      </view>
      <OrderCard 
        v-for="(order, index) in publishedOrders" 
        v-else
        :key="index" 
        :order="order" 
      />
    </view>

    <!-- 进行中界面 -->
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

    <!-- 已完成界面 -->
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
import { ref, computed, onMounted } from 'vue';
import { getOrdersByStatus } from '@/api/order';
import { useUserStore } from '@/stores/user';
import OrderCard from '@/components/OrderCard/OrderCard.vue';

const userStore = useUserStore();
const activeTab = ref('myPosts');

// 切换选项卡
const switchTab = async (tab) => {
  activeTab.value = tab;
  await fetchOrders();
};

// 获取订单数据
const fetchOrders = async () => {
  try {
    const status = activeTab.value === 'myPosts' ? '1' : 
                   activeTab.value === 'inProgress' ? '2' : '3';
    const publisherId = userStore.userInfo.studentId;

    // 打印上传的数据
    console.log('上传的数据:', {
      publisherId,
      status
    });


    const res = await getOrdersByStatus(publisherId, status);
    console.log('接口返回数据:', res.data); // 打印返回数据
    myOrders.value = res.data;
  } catch (error) {
    console.error('获取订单失败:', error.response ? error.response.data : error.message);
  }
};

// 监听选项卡变化
onMounted(() => {
  fetchOrders();
});

// 订单数据
const myOrders = ref([]);

// 计算属性
const publishedOrders = computed(() => myOrders.value.filter(order => order.status === '1'));
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
