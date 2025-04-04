// 引入 request 文件
import request from '@/utils/request.js'

// 获取订单列表接口
export const getOrders = () => {
	return request({
		url: '/api/function/orders',
		method: 'get'
	});
};

// 发布订单接口
export const publishOrder = (data) => {
	const params = {
		pickupPoint: data.pickupPoint,
		location: data.location,
		sendAt: data.sendAt,
		publisherName: data.publisherName,
		phoneNumber: data.phoneNumber,
		description: data.description,
		amount: parseFloat(data.amount),
		remark: data.remark,
		publisherId: data.publisherId
	};

	return request({
		url: '/api/function/publish',
		method: 'post',
		data: params
	});
};

// 根据学号和状态获取订单列表
// @RequestParam
export const getOrdersByStatus = (publisherId, status) => {
	return request({
		url: `/api/function/orders/by-status?publisherId=${publisherId}&status=${status}`,
		method: 'get'
	});
};

// 根据接单者学号和状态获取订单列表
// @RequestParam
export const getOrdersByAcceptorIdAndStatus = (acceptorId, status) => {
	return request({
		url: `/api/function/orders/received?acceptorId=${acceptorId}&status=${status}`,
		method: 'get'
	});
};

// 接单者接单
// @RequestParam
export const acceptOrders = (orderId, acceptorId) => {
	return request({
		url: `/api/function/orders/accept?orderId=${orderId}&acceptorId=${acceptorId}`,
		method: 'patch'
	});
};

// 接单者更新订单状态
// @RequestParam
export const updateOrderStatus = (orderId) => {
	return request({
		url: `/api/function/orders/update-status?orderId=${orderId}`,
		method: 'patch'
	});
};

// 接单者取消订单
// @RequestParam
export const cancelOrder = (orderId) => {
	return request({
		url: `/api/function/orders/cancel?orderId=${orderId}`,
		method: 'patch'
	});
};