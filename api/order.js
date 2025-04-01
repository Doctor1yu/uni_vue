// 引入 request 文件
import request from '../utils/request.js'

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

// 根据状态获取订单列表
export const getOrdersByStatus = (publisherId, status) => {
	return request({
		url: `/api/function/orders/by-status?publisherId=${publisherId}&status=${status}`,
		method: 'get'
	});
};