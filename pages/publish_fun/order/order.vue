<template>
  <view>
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="nav-left" @click="handleBack">
        <uni-icons type="arrowleft" size="24" color="#333"></uni-icons>
        <text>返回</text>
      </view>
      <view class="nav-title">发布订单</view>
      <view class="nav-right"></view>
    </view>

    <!-- 页面内容 -->
    <view v-if="loading" class="loading-container">
      <uni-load-more status="loading"></uni-load-more>
    </view>
    <view v-else class="order-container">
      <!-- 可选项区域 -->
      <view class="option-box">
        <view class="form-item">
          <text class="label">取件地址：</text>
          <picker
            class="picker"
            mode="selector"
            :range="pickupPoints"
            @change="handlePickupPointChange"
          >
            <view class="picker-text">{{ formData.pickupPoint || '请选择取件地址' }}</view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">送货地址：</text>
          <picker
            class="picker"
            mode="selector"
            :range="deliveryLocations"
            @change="handleDeliveryLocationChange"
          >
            <view class="picker-text">{{ formData.location || '请选择送货地址' }}</view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">送货时间：</text>
          <picker
            class="picker"
            mode="selector"
            :range="sendAts"
            @change="handlesendAtChange"
          >
            <view class="picker-text">{{ formData.sendAt || '请选择送货时间' }}</view>
          </picker>
        </view>
      </view>

      <!-- 联系信息区域 -->
      <view class="info-box">
        <span>联系信息</span>
        <view class="form-item">
          <text class="label">姓名：</text>
          <input
            class="input"
            v-model="formData.publisherName"
            placeholder="姓名必须和取件码保持一致"
            placeholder-class="placeholder"
          />
        </view>

        <view class="form-item">
          <text class="label">手机号：</text>
          <input
            class="input"
            v-model="formData.phoneNumber"
            placeholder="手机号必须和取件码保持一致"
            placeholder-class="placeholder"
            type="number"
          />
        </view>

        <view class="form-item">
          <text class="label">取件码：</text>
          <input
            class="input"
            v-model="formData.description"
            placeholder="请输入取件码"
            placeholder-class="placeholder"
          />
        </view>

        <view class="form-item">
          <text class="label">金额：</text>
          <input
            class="input"
            v-model="formData.amount"
            placeholder="小件1元、中件2元、大件3～5元"
            placeholder-class="placeholder"
            type="number"
          />
        </view>

        <view class="form-item">
          <text class="label">备注：</text>
          <input
            class="input"
            v-model="formData.remark"
            placeholder="请输入备注"
            placeholder-class="placeholder"
          />
        </view>
      </view>

      <!-- 提交按钮 -->
      <button class="submit-btn" @click="handleSubmit">确认提交</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { publishOrder } from '@/api/order'; // 导入发布订单接口
import { useUserStore } from '@/stores/user'; // 导入用户 store

const userStore = useUserStore();

// 加载状态
const loading = ref(false);

// 表单数据
const formData = ref({
  pickupPoint: '',
  location: '',
  sendAt: '',
  publisherName: '',
  phoneNumber: '',
  description: '',
  amount: '',
  remark: ''
});

// 可选项数据
const pickupPoints = ref(['图书馆楼下', '大众浴池下', '云逸酒店旁']);
const deliveryLocations = ref(['1栋寝室楼下','2栋寝室楼下','3栋寝室楼下','4栋寝室楼下','5栋寝室楼下','6栋寝室楼下','图书馆楼下']);
const sendAts = ref(['10:00-12:00', '16:00-19:00']);

// 处理取件地址选择
const handlePickupPointChange = (e) => {
  formData.value.pickupPoint = pickupPoints.value[e.detail.value];
};

// 处理送货地址选择
const handleDeliveryLocationChange = (e) => {
  formData.value.location = deliveryLocations.value[e.detail.value];
};

// 处理送货时间选择
const handlesendAtChange = (e) => {
  formData.value.sendAt = sendAts.value[e.detail.value];
};

// 重置表单
const resetForm = () => {
  formData.value = {
    pickupPoint: '',
    location: '',
    sendAt: '',
    publisherName: '',
    phoneNumber: '',
    description: '',
    amount: '',
    remark: ''
  };
};

// 表单提交
const handleSubmit = async () => {
  // 检查是否登录
  if (!userStore.userInfo.studentId) {
    uni.showToast({
      title: '请登录后再重试',
      icon: 'none'
    });
    return;
  }

  // 表单验证
  if (!formData.value.pickupPoint) {
    uni.showToast({
      title: '请选择取件地址',
      icon: 'none'
    });
    return;
  }
  if (!formData.value.location) {
    uni.showToast({
      title: '请选择送货地址',
      icon: 'none'
    });
    return;
  }
  if (!formData.value.sendAt) {
    uni.showToast({
      title: '请选择送货时间',
      icon: 'none'
    });
    return;
  }
  if (!formData.value.publisherName) {
    uni.showToast({
      title: '请填写姓名',
      icon: 'none'
    });
    return;
  }
  if (!formData.value.phoneNumber) {
    uni.showToast({
      title: '请填写手机号',
      icon: 'none'
    });
    return;
  }
  if (!formData.value.description) {
    uni.showToast({
      title: '请填写取件码',
      icon: 'none'
    });
    return;
  }
  if (!formData.value.amount) {
    uni.showToast({
      title: '请填写金额',
      icon: 'none'
    });
    return;
  }

  try {
    const response = await publishOrder({
      ...formData.value,
      publisherId: userStore.userInfo.studentId
    });
    if (response.code === 0) {
      uni.showToast({
        title: '订单发布成功',
        icon: 'success'
      });

      // 重置表单
      resetForm();

      // 1秒后跳转到首页并刷新
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/home/home'
        });
      }, 500);
    } else {
      uni.showToast({
        title: response.message || '订单发布失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('发布订单失败:', error);
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none'
    });
  }
};

// 处理返回按钮点击
const handleBack = () => {
  // 显示加载动画
  uni.showLoading({
    title: '加载中...',
    mask: true
  });

  // 0.1秒后跳转到首页
  setTimeout(() => {
    uni.hideLoading(); // 隐藏加载动画
    uni.reLaunch({
      url: '/pages/home/home'
    });
  }, 100);
};

// 监听返回按钮事件
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

  try {
    if (uni.onBackPress) {
      uni.onBackPress(() => {
        // 显示加载动画
        uni.showLoading({
          title: '加载中...',
          mask: true
        });

        // 1秒后跳转到首页
        setTimeout(() => {
          uni.hideLoading(); // 隐藏加载动画
          uni.reLaunch({
            url: '/pages/home/home'
          });
        }, 1000);

        // 阻止默认返回行为
        return true;
      });
    }
  } catch (error) {
    console.error('监听返回按钮失败:', error);
  }
});
</script>

<style scoped>
/* 自定义导航栏 */
.custom-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #e5e5e5;
}

.nav-left {
  display: flex;
  align-items: center;
}

.nav-left text {
  font-size: 28rpx;
  color: #333;
  margin-left: 10rpx;
}

.nav-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.nav-right {
  width: 60rpx; /* 占位，保持对称 */
}

/* 页面内容 */
.order-container {
  padding: 30rpx;
}

/* 可选项区域 */
.option-box {
  background-color: #f0f8ff; /* 浅蓝色背景 */
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

/* 联系信息区域 */
.info-box {
  background-color: #f5f5f5; /* 浅灰色背景 */
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  width: 150rpx; /* 固定 label 宽度 */
  flex-shrink: 0; /* 防止 label 被压缩 */
}

.input {
  flex: 1;
  height: 80rpx;
  padding: 0 20rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  font-size: 28rpx;
  background-color: #fff;
}

.picker {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  background-color: #fff;
}

.picker-text {
  font-size: 28rpx;
  color: #333;
}

.placeholder {
  color: #999;
  font-size: 28rpx;
}

.submit-btn {
  margin-top: 40rpx;
  background-color: #007AFF;
  color: #fff;
  font-size: 32rpx;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 8rpx;
}

.submit-btn:active {
  opacity: 0.8;
}
</style>