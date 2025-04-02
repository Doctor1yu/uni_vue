// 引入 request 文件
import request from '../utils/request.js'

// 提交申请
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
export const resetStatus = (studentId) => {
	return request({
		url: `/applications/reset-status?studentId=${studentId}`,
		method: 'patch'
	});
};
