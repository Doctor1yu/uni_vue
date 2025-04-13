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
        @click="handleOrderClick(order)"
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
        <view v-if="currentOrder.status === '2'" class="popup-item">
          <text class="label">接单时间：</text>
          <text class="value">{{ currentOrder.acceptTime }}</text>
        </view>
        <view v-if="currentOrder.status === '3'" class="popup-item">
          <text class="label">完成时间：</text>
          <text class="value">{{ currentOrder.completedTime }}</text>
        </view>
        <view v-if="currentOrder.status === '2'" class="popup-item">
          <text class="label">上传送达照片：</text>
          <button class="upload-button" @click="chooseImage">选择照片</button>
        </view>
        <view v-if="currentOrder.status === '3'" class="popup-item">
          <text class="label">送达照片：</text>
          <image v-if="currentOrder.sendUrl" :src="currentOrder.sendUrl" class="uploaded-image" mode="aspectFit"></image>
          <text v-else>没有上传的照片</text>
          
          <view class="collect-url">
            <text class="label">收款码：</text>
            <image :src="currentOrder.collectUrl" class="uploaded-image" mode="aspectFit"></image>
          </view>
        </view>
        <view class="button-group">
          <button v-if="currentOrder.status === '2'" class="popup-button cancel-button" @click="handleCancelOrder">取消订单</button>
          <button v-if="currentOrder.status === '2'" class="popup-button complete-button" @click="handleCompleteOrder">已完成</button>
          <button v-if="currentOrder.status === '3'" class="popup-button return-button" @click="closePopup">返回</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getOrdersByAcceptorIdAndStatus, updateOrderStatus, acceptorCancelOrder } from '@/api/order';
import { useUserStore } from '@/stores/user';
import OrderCard from '@/components/OrderCard/OrderCard.vue';
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';
import { formatDateTime } from '@/utils/format'; // 导入公共的时间格式化函数
import { getUserCollect } from '@/api/user'; // 导入获取收款码的函数

const userStore = useUserStore();
const activeTab = ref('inProgress');
const popup = ref(null);
const currentOrder = ref({});
const sendImage = ref(null); // 存储上传的照片文件

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
    myOrders.value = res.data.map(order => ({
      ...order,
      orderId: order.id,
      publishTime: formatDateTime(order.createdAt),
      acceptTime: formatDateTime(order.acceptorAt),
      completedTime: formatDateTime(order.acceptorAt),
    }));

    // 只有在已完成接单界面时才获取收款码
    if (status === '3') {
      const collectRes = await getUserCollect(acceptorId);
      if (collectRes.code === 0) {
        currentOrder.value.collectUrl = collectRes.data; // 确保使用 .value 赋值
      }
    }
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

// 处理点击订单卡片逻辑
const handleOrderClick = async (order) => {
  currentOrder.value = order;
  
  // 如果订单状态为已完成，获取收款码
  if (order.status === '3') {
    const collectRes = await getUserCollect(userStore.userInfo.studentId);
    if (collectRes.code === 0) {
      currentOrder.value.collectUrl = collectRes.data;
    }
  }
  
  popup.value.open();
};

// 上传照片
const chooseImage = () => {
  uni.chooseImage({
    count: 1, // 只允许选择一张照片
    sizeType: ['compressed'], // 压缩图片
    sourceType: ['album', 'camera'], // 从相册或相机选择
    success: (res) => {
      const tempFilePaths = res.tempFilePaths; // 获取临时文件路径
      const orderId = currentOrder.value.orderId; // 动态获取 orderId

      // 上传文件
      uni.uploadFile({
        url: '/apiUni/api/send/upload', // 后端接口地址
        filePath: tempFilePaths[0], // 上传第一张照片
        name: 'file', // 后端接收文件的参数名
        formData: {
          orderId: orderId, // 其他参数
        },
        success: (uploadRes) => {
          console.log('上传成功:', uploadRes.data);
          uni.showToast({ title: '上传成功', icon: 'success' });
          sendImage.value = tempFilePaths[0]; // 更新显示的图片
        },
        fail: (error) => {
          console.error('上传失败:', error);
          uni.showToast({ title: '上传失败', icon: 'none' });
        }
      });
    },
    fail: (error) => {
      console.error('选择照片失败:', error);
      uni.showToast({ title: '选择照片失败', icon: 'none' });
    }
  });
};

// 处理点击"已完成"按钮逻辑
const handleCompleteOrder = async () => {
  if (!sendImage.value) {
    uni.showToast({
      title: '请上传照片',
      icon: 'none'
    });
    return;
  }

  try {
    // 调用 API 更新订单状态
    await updateOrderStatus(currentOrder.value.orderId);
    
    uni.showToast({
      title: '订单已完成',
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

// 处理点击"取消订单"按钮逻辑
const handleCancelOrder = async () => {
  try {
    await acceptorCancelOrder(currentOrder.value.orderId);
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

.cancel-button {
  background-color: #ff4d4f;
  color: #fff;
}

.complete-button {
  background-color: #007AFF;
  color: #fff;
}

.return-button {
  background-color: #ccc;
  color: #333;
}

/* 上传按钮样式 */
.upload-button {
  background-color: #007AFF;
  color: #fff;
  border-radius: 10rpx;
  font-size: 28rpx;
  height: 60rpx;
  line-height: 60rpx;
  padding: 0 20rpx;
}

/* 上传照片预览样式 */
.uploaded-image {
  width: 300rpx;
  height: 300rpx;
  border-radius: 10rpx;
}

/* 收款码样式 */
.collect-url {
  margin-top: 20rpx; /* 调整与其他元素的间距 */
}
</style>
