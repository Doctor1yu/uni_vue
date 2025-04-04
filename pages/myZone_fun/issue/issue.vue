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
        :key="index" 
        :order="order" 
        @click="handleOrderClick(order)"
      />
    </view>

    <!-- 进行中界面 -->
    <view v-if="activeTab === 'inProgress'" class="order-list">
      <view v-if="inProgressOrders.length === 0" class="no-data">
        没有新数据
      </view>
      <OrderCard 
        v-for="(order, index) in inProgressOrders" 
        :key="index" 
        :order="order" 
        @click="handleOrderClick(order)"
      />
    </view>

    <!-- 已完成界面 -->
    <view v-if="activeTab === 'completed'" class="order-list">
      <view v-if="completedOrders.length === 0" class="no-data">
        没有新数据
      </view>
      <OrderCard 
        v-for="(order, index) in completedOrders" 
        :key="index" 
        :order="order" 
        @click="handleOrderClick(order)"
      />
    </view>

    <!-- 弹窗组件 -->
    <uni-popup ref="popup" type="center">
      <view class="popup-content">
        <view class="popup-title">订单详情</view>
        <view class="popup-item">
          <text class="label">发布人：</text>
          <text class="value">{{ currentOrder.publisherName }}</text>
        </view>
        <view class="popup-item">
          <text class="label">拿货地点：</text>
          <text class="value">{{ currentOrder.pickupPoint }}</text>
        </view>
        <view class="popup-item">
          <text class="label">收货地点：</text>
          <text class="value">{{ currentOrder.location }}</text>
        </view>
        <view class="popup-item">
          <text class="label">配送时间：</text>
          <text class="value">{{ currentOrder.sendAt }}</text>
        </view>
        <view class="popup-item">
          <text class="label">联系电话：</text>
          <text class="value">{{ currentOrder.phoneNumber }}</text>
        </view>
        <view class="popup-item">
          <text class="label">取件码：</text>
          <text class="value">{{ currentOrder.description }}</text>
        </view>
        <view class="popup-item">
          <text class="label">金额：</text>
          <text class="value">￥{{ currentOrder.amount }}</text>
        </view>
        <view class="popup-item">
          <text class="label">备注：</text>
          <text class="value">{{ currentOrder.remark || '无' }}</text>
        </view>
        <view class="popup-item">
          <text class="label">发布时间：</text>
          <text class="value">{{ currentOrder.publishTime }}</text>
        </view>
        <!-- 展示接单人信息 -->
        <view v-if="currentOrder.status === '2'" class="popup-item">
          <text class="label">接单人：</text>
          <text class="value">{{ currentOrder.acceptorId }}</text>
        </view>
        <view v-if="currentOrder.status === '2'" class="popup-item">
          <text class="label">接单时间：</text>
          <text class="value">{{ currentOrder.acceptTime }}</text>
        </view>
        <view v-if="currentOrder.status === '3'" class="popup-item">
          <text class="label">接单人：</text>
          <text class="value">{{ currentOrder.acceptorId }}</text>
        </view>
        <view v-if="currentOrder.status === '3'" class="popup-item">
          <text class="label">完成时间：</text>
          <text class="value">{{ currentOrder.completedTime }}</text>
        </view>
        <view class="button-group">
          <button class="popup-button return-button" @click="closePopup">返回</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getOrdersByStatus } from '@/api/order';
import { useUserStore } from '@/stores/user';
import OrderCard from '@/components/OrderCard/OrderCard.vue';
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';

const userStore = useUserStore();
const activeTab = ref('myPosts');
const popup = ref(null);
const currentOrder = ref({});

// 格式化时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

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

    const res = await getOrdersByStatus(publisherId, status);
    myOrders.value = res.data.map(order => ({
      ...order,
      publishTime: formatDateTime(order.createdAt), // 格式化发布时间
      acceptTime: formatDateTime(order.acceptorAt), // 格式化接单时间
      completedTime: formatDateTime(order.acceptorAt), // 格式化完成时间（使用 acceptorAt 字段）
      acceptorId: order.acceptorId // 接单人 studentId
    }));
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
const publishedOrders = computed(() => myOrders.value.filter(order => order.status === '1'));
const inProgressOrders = computed(() => myOrders.value.filter(order => order.status === '2'));
const completedOrders = computed(() => myOrders.value.filter(order => order.status === '3'));

// 处理点击订单卡片逻辑
const handleOrderClick = (order) => {
  currentOrder.value = order;
  popup.value.open();
};

// 关闭弹窗
const closePopup = () => {
  popup.value.close();
};
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

/* 弹窗样式 */
.popup-content {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  width: 600rpx;
}

.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
}

.popup-item {
  margin-bottom: 20rpx;
}

.label {
  color: #666;
  margin-right: 10rpx;
}

.value {
  color: #333;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
}

.popup-button {
  flex: 1;
  margin: 0 10rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  height: 80rpx;
  line-height: 80rpx;
}

.return-button {
  background-color: #ccc;
  color: #333;
}

.accept-button {
  background-color: #007AFF;
  color: #fff;
}
</style>
