// 引入 request 文件
import request from '@/utils/request.js'

// 获取反馈接口
// @RequestParam
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

// 根据id修改反馈状态为已完成
export const updateFeedbackStatus = (id) => {
	return request({
		url: `/api/update?id=${id}`,
		method: 'patch'
	});
};