// 引入 request 文件
import request from '../utils/request.js'

// 提交申请
export const submit = (data) => {
	// 确保必要的参数都包含在内
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