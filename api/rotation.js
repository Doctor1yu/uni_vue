// 引入 request 文件
import request from '../utils/request.js'

// 获取订单列表接口
export const getRotations = () => {
	return request({
		url: '/rotation/show',
		method: 'get'
	});
};