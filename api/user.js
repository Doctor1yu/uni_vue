// 引入 request 文件
import request from '@/utils/request.js'

// 用户登录接口
// @RequestParam
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

// 更新用户信息接口
// @RequestParam
export const updateProfile = async (studentId, nickName, phoneNumber) => {
    return uni.request({
        url: `/apiUni/user/updateProfile?studentId=${studentId}&nickName=${nickName}&phoneNumber=${phoneNumber}`,
        method: 'put'
    });
};

// 更改用户密码接口
// @RequestParam
export const changePassword = (studentId, oldPassword, newPassword, confirmPassword) => {
    return request({
        url: `/user/changePassword?studentId=${studentId}&oldPassword=${oldPassword}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`,
        method: 'patch'
    });
};

// 获取用户信息接口
// @RequestParam
export const getUserInfo = (studentId) => {
    return request({
        url: `/user/find?studentId=${studentId}`,
        method: 'get'
    });
};

// 获取接单者收款码接口
// @RequestParam
export const getUserCollect = (acceptorId) => {
    return request({
        url: `/api/function/orders/acceptor-collect-url?acceptorId=${acceptorId}`,
        method: 'get'
    });
};