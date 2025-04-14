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
        <view v-if="currentOrder.status !== '1'" class="popup-item">
          <text class="label">接单者昵称：</text>
          <text class="value">{{ currentOrder.acceptorNickName }}</text>
        </view>
        <view v-if="currentOrder.status !== '1'" class="popup-item">
          <text class="label">接单者学号：</text>
          <text class="value">{{ currentOrder.acceptorId }}</text>
        </view>
        <view v-if="currentOrder.status !== '1'" class="popup-item">
          <text class="label">接单者电话：</text>
          <text class="value">{{ currentOrder.acceptorPhoneNumber }}</text>
        </view>
        <view v-if="currentOrder.status === '2'" class="popup-item">
          <text class="label">接单时间：</text>
          <text class="value">{{ currentOrder.acceptTime }}</text>
        </view>
        <view v-if="currentOrder.status === '3'" class="popup-item">
          <text class="label">完成时间：</text>
          <text class="value">{{ currentOrder.completedTime }}</text>
        </view>
        <view v-if="currentOrder.status === '3'" class="popup-item">
          <view class="collect-url">
            <text class="label">送达照片：</text>
            <image v-if="currentOrder.sendUrl" :src="currentOrder.sendUrl" class="uploaded-image" mode="aspectFit"></image>
            <text v-else>没有上传的照片</text>
          </view>
        </view>
        <view v-if="currentOrder.status === '3'" class="popup-item">
          <view class="collect-url">
            <text class="label">收款码：</text>
            <image :src="currentOrder.collectUrl" class="uploaded-image" mode="aspectFit"></image>
          </view>
        </view>
        <view class="button-group">
          <button v-if="currentOrder.status === '1'" class="popup-button cancel-button" @click="handleCancelOrder">取消订单</button>
          <button class="popup-button return-button" @click="closePopup">返回</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getOrdersByStatus, publisherCancelOrder } from '@/api/order';
import { useUserStore } from '@/stores/user';
import { getUserInfo, getUserCollect } from '@/api/user';
import { formatDateTime } from '@/utils/format'; // 导入公共的时间格式化函数
import OrderCard from '@/components/OrderCard/OrderCard.vue';
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';

const userStore = useUserStore();
const activeTab = ref('myPosts');
const popup = ref(null);
const currentOrder = ref({});

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
    myOrders.value = await Promise.all(res.data.map(async order => {
      // 获取接单者的信息
      let acceptorInfo = {};
      if (order.acceptorId) {
        const userRes = await getUserInfo(order.acceptorId);
        acceptorInfo = {
          acceptorNickName: userRes.data.nickName,
          acceptorPhoneNumber: userRes.data.phoneNumber,
        };
      }

      return {
        ...order,
        orderId: order.id, // 确保 orderId 被正确赋值
        ...acceptorInfo, // 添加接单者的昵称和电话
        publishTime: formatDateTime(order.createdAt), // 格式化发布时间
        acceptTime: formatDateTime(order.acceptorAt), // 格式化接单时间
        completedTime: formatDateTime(order.acceptorAt), // 格式化完成时间
      };
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
const handleOrderClick = async (order) => {
  currentOrder.value = {
    ...order,
    orderId: order.id, // 确保 orderId 被正确赋值
  };
  
  // 如果订单状态为已完成，获取收款码
  if (order.status === '3') {
    const collectRes = await getUserCollect(userStore.userInfo.studentId);
    if (collectRes.code === 0) {
      currentOrder.value.collectUrl = collectRes.data;
    }
  }
  
  popup.value.open();
};

// 处理点击"取消订单"按钮逻辑
const handleCancelOrder = async () => {
  try {
    await publisherCancelOrder(currentOrder.value.orderId);
    uni.showToast({
      title: '订单已取消',
      icon: 'success'
    });
    closePopup();
    await fetchOrders(); // 重新获取订单数据
  } catch (error) {
    uni.showToast({
      title: '操作失败，请稍后重试',
      icon: 'none'
    });
  }
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
  max-height: 80vh; /* 设置最大高度为视口的80% */
  overflow-y: auto; /* 启用垂直滚动 */
}

.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
}

.popup-item {
  margin-bottom: 10rpx;
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

.collect-url {
  display: flex;
  flex-direction: column; /* 使内容垂直排列 */
  align-items: flex-start; /* 使内容靠左对齐 */
}

.uploaded-image {
  width: 100%;
  height: 300rpx;
  margin-left: 10rpx;
}
</style>
