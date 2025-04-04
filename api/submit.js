// 引入 request 文件
import request from '@/utils/request.js'

// 提交申请
// @RequestParam
export const submit = (data) => {
	const params = {
		studentId: data.studentId,
		applyReason: data.applyReason,
	};
	
	return request({
		url: '/applications/submit',
		method: 'post',
		data: params
	})
}

// 重置状态
// @RequestParam
export const resetStatus = (studentId) => {
	return request({
		url: `/applications/reset-status?studentId=${studentId}`,
		method: 'patch'
	});
};

// 获取最新的申请信息
// @RequestParam
export const getLatestApplication = (studentId) => {
	return request({
		url: `/applications/latest?studentId=${studentId}`,
		method: 'get',
	});
};
