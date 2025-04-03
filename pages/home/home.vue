<template>
	<view>
		<!-- 添加轮播图 -->
		<swiper class="swiper" indicator-dots autoplay circular v-if="showSwiper && swiperList.length > 0">
			<swiper-item v-for="(item, index) in swiperList" :key="index">
				<image :src="item" mode="aspectFill" :alt="item.theme"></image>
			</swiper-item>
		</swiper>

		<!-- 订单显示区域 -->
		<view class="order-section">
			<view class="order-title">最新订单</view>
			<view v-if="orders.length > 0" class="order-list">
				<HomeOrder v-for="(order, index) in orders" :key="index" :order="order" :on-accept="handleAccept"
					v-lazy="index" />
			</view>
			<view v-else class="no-order">
				———— 暂无新订单 ————
			</view>
		</view>

		<!-- 展示弹窗 -->
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
					<text class="value">{{ formatPhone(currentOrder.phoneNumber) }}</text>
				</view>
				<view class="popup-item">
					<text class="label">取件码：</text>
					<text class="value">{{ formatDescription(currentOrder.description) }}</text>
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
					<text class="value">{{ formatDateTime(currentOrder.publishTime) }}</text>
				</view>
				<view class="button-group">
					<button class="popup-button return-button" @click="closePopup">返回</button>
					<button class="popup-button accept-button" @click="handleAcceptConfirm">接单</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import HomeOrder from '@/components/HomeOrder/HomeOrder.vue';
import { getOrders, acceptOrders } from '@/api/order.js';
import { getRotations } from '@/api/rotation.js';
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';
import { useUserStore } from '@/stores/user';

// 轮播图数据
const swiperList = ref([]);

// 控制轮播图显示
const showSwiper = ref(true);

const orders = ref([]);

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

// 获取轮播图数据
const fetchRotations = async () => {
	try {
		const response = await getRotations();
		if (response.code === 0) {
			swiperList.value = response.data.map(item => item.rotationUrl);
		}
	} catch (error) {
		console.error('获取轮播图失败:', error);
	}
};

// 获取订单数据
const fetchOrders = async () => {
	try {
		const response = await getOrders();

		if (response.code === 0) {
			orders.value = response.data.map(order => ({
				id: order.id, // 确保获取订单 ID
				avatarUrl: order.publisherAvatarUrl,
				nickname: order.publisherNickName,
				publisherName: order.publisherName,
				publisherId: order.publisherId,
				pickupPoint: order.pickupPoint,
				location: order.location,
				sendAt: order.sendAt, // 配送时间
				phoneNumber: order.phoneNumber, // 联系电话
				description: order.description, // 取件码
				amount: order.amount,
				remark: order.remark,
				publishTime: formatDateTime(order.createdAt)
			}));
		}
	} catch (error) {
		console.error('获取订单失败:', error);
	}
};

// 页面加载时获取轮播图数据和订单数据
onMounted(() => {
	fetchRotations();
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

// 格式化电话号码
const formatPhone = (phone) => {
	return phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '';
};

// 格式化描述
const formatDescription = (desc) => {
	return desc ? desc.replace(/(\d{2})-(\d{4})/, '**-****') : '';
};

// 处理接单逻辑
const handleAccept = (order) => {
	// 格式化发布人姓名
	const formatPublisherName = (name) => {
		if (!name) return '';
		return name.length > 1 ? name[0] + '**' : name;
	};

	currentOrder.value = {
		id: order.id, // 确保传入订单 ID
		publisherName: formatPublisherName(order.publisherName), // 脱敏处理
		publisherId: order.publisherId, // 确保传入 publisherId
		pickupPoint: order.pickupPoint,
		location: order.location,
		sendAt: order.sendAt, // 配送时间
		phoneNumber: order.phoneNumber, // 联系电话
		description: order.description, // 取件码
		amount: order.amount,
		remark: order.remark,
		publishTime: order.publishTime
	};
	popup.value.open();
};

const closePopup = () => {
	popup.value.close();
};

// 处理接单确认逻辑
const handleAcceptConfirm = async () => {
	const userStore = useUserStore();

	// 检查 userInfo 是否存在
	if (!userStore.userInfo) {
		uni.showModal({
			title: '提示',
			content: '用户信息未加载，请重新登录',
			showCancel: false,
			confirmText: '确定'
		});
		return; // 阻止后续逻辑执行
	}

	// 检查是否是自己发布的订单
	if (userStore.userInfo.studentId === currentOrder.value.publisherId) {
		uni.showModal({
			title: '提示',
			content: '你接自己的单作甚么',
			showCancel: false,
			confirmText: '确定'
		});
		return; // 阻止后续逻辑执行
	}

	// 检查用户角色
	if (userStore.userInfo.role == 1) {
		uni.showModal({
			title: '提示',
			content: '请先申请成为接单员',
			showCancel: false,
			confirmText: '确定'
		});
		return; // 阻止后续逻辑执行
	}

	// 检查 orderId 是否存在
	if (!currentOrder.value.id) {
		uni.showModal({
			title: '提示',
			content: '订单信息不完整，无法接单',
			showCancel: false,
			confirmText: '确定'
		});
		return; // 阻止后续逻辑执行
	}

	try {
		// 调用接单 API
		const response = await acceptOrders(
			parseInt(currentOrder.value.id), // 确保 orderId 是整数
			parseInt(userStore.userInfo.studentId) // 确保 acceptorId 是整数
		);

		if (response.code === 0) {
			// 接单成功逻辑
			uni.showToast({
				title: '接单成功',
				icon: 'success',
				duration: 1000
			});

			// 关闭弹窗
			closePopup();

			// 延迟 1 秒后刷新订单列表
			setTimeout(() => {
				fetchOrders();
			}, 1000);
		} else {
			// 接单失败逻辑
			uni.showModal({
				title: '提示',
				content: response.message || '接单失败，请重试',
				showCancel: false,
				confirmText: '确定'
			});
		}
	} catch (error) {
		console.error('接单失败:', error);
		uni.showModal({
			title: '提示',
			content: '接单失败，请重试',
			showCancel: false,
			confirmText: '确定'
		});
	}
};

// 将方法传递给子组件
const orderProps = {
	onAccept: handleAccept
};

// 添加懒加载指令
const vLazy = {
	mounted(el, binding) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					el.classList.add('visible');
					observer.unobserve(el);
				}
			});
		});
		observer.observe(el);
	}
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

/* 添加懒加载动画 */
.order-card {
	opacity: 0;
	transform: translateY(20px);
	transition: opacity 0.5s, transform 0.5s;
}

.order-card.visible {
	opacity: 1;
	transform: translateY(0);
}

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
