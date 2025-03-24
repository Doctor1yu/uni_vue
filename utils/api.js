// 引入 request 文件
import request from './request.js'
 
// 用户登录接口
export const login = (data) => {
	// 确保参数名称为studentId和password
	const params = {
		studentId: data.studentId,
		password: data.password
	};
	
	return request({
		url: '/user/login',
		method: 'post',
		data: params
	})
}

// 用户注册接口
export const register = (data) => {
	// 确保必要的参数都包含在内
	const params = {
		studentId: data.studentId,
		nickName: data.nickName,
		phoneNumber: data.phoneNumber,
		password: data.password,
		confirmPassword: data.confirmPassword,
		avatarUrl: data.avatarUrl || ''
	};
	
	return request({
		url: '/user/register',
		method: 'post',
		data: params
	})
}

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

// 获取订单列表接口
export const getOrders = () => {
	return request({
		url: '/api/function/orders',
		method: 'get'
	});
};

// 更新用户信息接口
export const updateProfile = (data) => {
	const params = {
		studentId: data.studentId,
		nickName: data.nickName,
		phoneNumber: data.phoneNumber,
		avatarUrl: data.avatarUrl
	};

	return request({
		url: '/user/updateProfile',
		method: 'put',
		data: params
	});
};

// 获取用户反馈接口
export const getFeedbacks = (studentId) => {
	return request({
		url: `/api/feedbacks?studentId=${studentId}`,
		method: 'GET'
	});
};

// 提交反馈接口
export const issueFeedback = (data) => {
	const params = {
		studentId: data.studentId,
		subject: data.subject,
		content: data.content,
		phoneNumber: data.phoneNumber
	};

	return request({
		url: '/api/issue',
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

