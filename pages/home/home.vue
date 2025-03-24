<template>
	<view>
		<!-- 添加轮播图 -->
		<swiper class="swiper" indicator-dots autoplay circular v-if="showSwiper">
			<swiper-item v-for="(item, index) in swiperList" :key="index">
				<image :src="item" mode="aspectFill"></image>
			</swiper-item>
		</swiper>

		<!-- 订单显示区域 -->
		<view class="order-section">
			<view class="order-title">最新订单</view>
			<view v-if="orders.length > 0" class="order-list">
				<HomeOrder v-for="(order, index) in orders" :key="index" :order="order" :on-accept="handleAccept" />
			</view>
			<view v-else class="no-order">
				———— 暂无新订单 ————
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import HomeOrder from '@/components/HomeOrder/HomeOrder.vue';
import { getOrders } from '@/utils/api';

// 轮播图数据
const swiperList = ref([
	'/static/swiper/s1.jpg',
	'/static/swiper/s2.jpg',
	'/static/swiper/s3.jpg'
]);

// 控制轮播图显示
const showSwiper = ref(true);

const orders = ref([]);

// 格式化时间
const formatDateTime = (dateTime) => {
	if (!dateTime) return ''; // 如果时间为空，返回空字符串
	const date = new Date(dateTime);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 获取订单数据
const fetchOrders = async () => {
	try {
		const response = await getOrders();

		if (response.code === 0) {
			orders.value = response.data.map(order => ({
				avatarUrl: order.publisherAvatarUrl,
				nickname: order.publisherNickName,
				pickupPoint: order.pickupPoint,
				location: order.location,
				amount: order.amount,
				publishTime: formatDateTime(order.createdAt) // 确保调用 formatDateTime
			}));

			// 打印格式化后的订单数据
			console.log('格式化后的订单数据:', orders.value);
		}
	} catch (error) {
		console.error('获取订单失败:', error);
	}
};

// 页面加载时获取订单数据
onMounted(() => {
	fetchOrders();

	try {
		if (uni.onBackPress) {
			uni.onBackPress(() => {
				// 显示加载动画
				uni.showLoading({
					title: '加载中...', // 确保 title 是字符串
					mask: true // 可选
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

// 处理接单逻辑
const handleAccept = () => {
	uni.showToast({
		title: '接单成功',
		icon: 'success',
		duration: 1000
	});
};

// 将方法传递给子组件
const orderProps = {
	onAccept: handleAccept
};

const handleBack = () => {
	// 显示加载动画
	uni.showLoading({
		title: '加载中...', // 确保 title 是字符串
		mask: true // 可选
	});

	// 0.1秒后跳转到首页
	setTimeout(() => {
		uni.hideLoading(); // 隐藏加载动画
		uni.reLaunch({
			url: '/pages/home/home'
		});
	}, 100);
};
</script>

<style scoped>
/* 轮播图样式 */
.swiper {
	width: calc(100% - 40rpx);
	height: 350rpx;
	margin: 20rpx;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.swiper image {
	width: 100%;
	height: 100%;
}

/* 订单区域样式 */
.order-section {
	margin: 20rpx;
	padding: 20rpx;
	background-color: #fff;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.order-title {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
	color: #333;
	padding-left: 10rpx;
	border-left: 6rpx solid #007AFF;
}

.no-order {
	text-align: center;
	color: #999;
	padding: 40rpx 0;
	font-size: 28rpx;
}

/* 新增全局样式 */
view {
	box-sizing: border-box;
}
</style>
