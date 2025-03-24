<template>
    <view class="container">
        <!-- 自定义顶部栏 -->
        <view class="custom-header">
            <!-- 背景渐变 -->
            <view class="header-bg"></view>

            <!-- 添加头像 -->
            <view class="avatar-container" @click="navigateToLogin">
                <image class="avatar" :src="userInfo.avatarUrl || defaultAvatar"></image>
                <text class="login-text">{{ userInfo.nickName || '点击登录' }}</text>
            </view>

            <!-- 订单页面 -->
            <view class="order-section">
                <view class="order-header">
                    <text>滴答订单</text>
                </view>
                <view class="order-icons">
                    <view class="icon-item" @click="applyCampus">
                        <image :src="icons.campus" class="icon"></image>
                        <text>申请校区</text>
                    </view>
                    <view class="icon-item" @click="applyOrder">
                        <image :src="icons.applyOrder" class="icon"></image>
                        <text>申请接单</text>
                    </view>
                    <view class="icon-item" @click="navigateToKefu">
                        <image :src="icons.feedback" class="icon"></image>
                        <text>我的反馈</text>
                    </view>
                </view>
            </view>

            <!-- 其他功能 -->
            <view class="function-section">
                <view class="function-item" @click="navigateToOrders">
                    <image :src="icons.orders" class="function-icon"></image>
                    <text>我的订单</text>
                    <image :src="icons.arrow" class="arrow-icon"></image>
                </view>
                <view class="function-item" @click="navigateToIssueOther">
                    <image :src="icons.issueOther" class="function-icon"></image>
                    <text>我的接单</text>
                    <image :src="icons.arrow" class="arrow-icon"></image>
                </view>
                <view class="function-item" @click="editProfile">
                    <image :src="icons.edit" class="function-icon"></image>
                    <text>编辑资料</text>
                    <image :src="icons.arrow" class="arrow-icon"></image>
                </view>
                <view class="function-item" @click="navigateToRePwd">
                    <image :src="icons.password" class="function-icon"></image>
                    <text>修改密码</text>
                    <image :src="icons.arrow" class="arrow-icon"></image>
                </view>
                <view class="function-item" @click="logout">
                    <image :src="icons.logout" class="function-icon"></image>
                    <text>退出登录</text>
                    <image :src="icons.arrow" class="arrow-icon"></image>
                </view>
            </view>

            <!-- 版本信息 -->
            <view class="version-info">
                当前版本: 1.0
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const userInfo = ref({});
const defaultAvatar = ref('https://mp-b58e33c4-f164-4150-809d-6e1f78c8b7bb.cdn.bspapp.com/icons/avatar1.png');

// 初始化用户信息
onMounted(() => {
  if (userStore.isLoggedIn) {
    userInfo.value = userStore.userInfo || {};
  }
});

// 图标路径
const icons = {
  // 申请校区图标
  campus: 'http://stm89m2wy.hd-bkt.clouddn.com/uni/icon/xiaoyuan.png',
  // 申请接单图标
  applyOrder: 'http://stm89m2wy.hd-bkt.clouddn.com/uni/icon/jiedan.png',
  // 我的反馈图标
  feedback: 'http://stm89m2wy.hd-bkt.clouddn.com/uni/icon/fankui.png',
  // 我的订单图标
  orders: 'http://stm89m2wy.hd-bkt.clouddn.com/uni/icon/dingdan.png',
  // 我的接单图标
  issueOther: 'http://stm89m2wy.hd-bkt.clouddn.com/uni/icon/daina.png',
  // 编辑资料图标
  edit: 'http://stm89m2wy.hd-bkt.clouddn.com/uni/icon/bianji.png',
  // 修改密码图标(有问题)
  password: 'http://stm89m2wy.hd-bkt.clouddn.com/uni/icon/gaimi.png',
  // 退出登录图标
  logout: 'http://stm89m2wy.hd-bkt.clouddn.com/uni/icon/tuichu.png',
  // 右侧箭头图标
  arrow: 'http://stm89m2wy.hd-bkt.clouddn.com/uni/icon/right.png'
  
};

// 修改头像点击事件
const navigateToLogin = () => {
  if (!userStore.isLoggedIn) {
    uni.navigateTo({
      url: '/pages/login/login'
    });
  }
};

// 修改退出登录逻辑
const logout = () => {
  if (!userStore.userInfo) {
    uni.showToast({
      title: '请先登录后重试',
      icon: 'none'
    });
    return;
  }
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: function (res) {
      if (res.confirm) {
        userStore.logout();
        userInfo.value = {};
        uni.reLaunch({
          url: '/pages/home/home'
        });
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        });
      }
    }
  });
};

const applyCampus = () => {
    uni.showToast({
        title: '暂未开放该功能',
        icon: 'none',
        duration: 2000
    });
};

const applyOrder = () => {
  if (!userStore.userInfo) {
    uni.showToast({
      title: '请先登录后重试',
      icon: 'none'
    });
    return;
  }
  uni.showToast({
    title: '暂未开放该功能',
    icon: 'none',
    duration: 2000
  });
};

// 编辑资料
const editProfile = () => {
  if (!userStore.userInfo) {
    uni.showToast({
      title: '请先登录后重试',
      icon: 'none'
    });
    return;
  }
  uni.navigateTo({
    url: '/pages/myZone_fun/editProfile/editProfile'
  });
};

//我的反馈
const navigateToKefu = () => {
  if (!userStore.userInfo) {
    uni.showToast({
      title: '请先登录后重试',
      icon: 'none'
    });
    return;
  }
  uni.navigateTo({
    url: '/pages/myZone_fun/feedback/feedback'
  });
};

//修改密码
const navigateToRePwd = () => {
  if (!userStore.userInfo) {
    uni.showToast({
      title: '请先登录后重试',
      icon: 'none'
    });
    return;
  }
  uni.navigateTo({
    url: '/pages/myZone_fun/rePwd/rePwd'
  });
};

//我的订单
const navigateToOrders = () => {
  if (!userStore.userInfo) {
    uni.showToast({
      title: '请先登录后重试',
      icon: 'none'
    });
    return;
  }
  uni.navigateTo({
    url: '/pages/myZone_fun/issue/issue'
  });
};

// 新增：我的接单点击事件
const navigateToIssueOther = () => {
  if (!userStore.userInfo) {
    uni.showToast({
      title: '请先登录后重试',
      icon: 'none'
    });
    return;
  }
  if (userStore.userInfo.rule == 1) {
    uni.showToast({
      title: '请先申请成为接单员',
      icon: 'none'
    });
    return;
  }
  uni.navigateTo({
    url: '/pages/myZone_fun/issueOther/issueOther'
  });
};
</script>

<style scoped>
.container {
    position: relative;
    width: 100%;
    height: 100vh;
    background: linear-gradient(to bottom, #79b6e8, #ffffff);
}

.custom-header {
    position: relative;
    height: auto;
    padding: 20rpx;
    padding-top: var(--status-bar-height);
}

/* 背景渐变 */
.header-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 300rpx;
    background: linear-gradient(to right, #79b6e8, #4a90e2);
    z-index: 0;
}

/* 头像 */
.avatar-container {
    position: relative;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    padding-top: 70rpx;
    z-index: 2;
}

.avatar {
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
    border: 4rpx solid #fff;
}

.login-text {
    display: block;
    margin-top: 10rpx;
    margin-bottom: 40rpx;
    font-size: 36rpx;
    color: #fff;
    font-weight: 500;
}

/* 调整订单区域样式 */
.order-section {
    background-color: #fff;
    margin: 20rpx;
    border-radius: 20rpx;
    padding: 20rpx;
    position: relative;
    z-index: 1;
    margin-top: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 20rpx;
    margin-left: 20rpx;
    margin-bottom: 20rpx;
    font-size: 34rpx;
    font-weight: 500;
}

.order-icons {
    display: flex;
    justify-content: space-around;
    margin-top: 20rpx;
    margin-bottom: 10rpx;
}

.icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.2s;
}

.icon-item:active {
    transform: scale(0.95);
}

.icon {
    width: 70rpx;
    height: 70rpx;
    margin: 14rpx;
}

.icon-item text {
    font-size: 30rpx;
    color: #666;
    margin-top: 10rpx;
}

/* 其他功能样式 */
.function-section {
    background-color: #fff;
    margin: 40rpx 20rpx 20rpx 20rpx;
    border-radius: 20rpx;
    padding: 20rpx 20rpx 20rpx 40rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.function-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #eee;
    position: relative;
}

.function-item:last-child {
    border-bottom: none;
}

.function-icon {
    width: 50rpx;
    height: 50rpx;
    margin-right: 20rpx;
}

.function-item text {
    font-size: 34rpx;
    color: #333;
    font-weight: 500;
}

.arrow-icon {
    width: 30rpx;
    height: 30rpx;
    position: absolute;
    right: 20rpx;
}

/* 版本信息样式 */
.version-info {
    text-align: center;
    color: #999;
    font-size: 30rpx;
    margin-top: 20rpx;
}
</style>