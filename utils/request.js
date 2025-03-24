// 全局请求封装
const base_url = '/api'
// 请求超出时间
const timeout = 5000
 
//请求封装start
export default (params) => {
	let url = params.url;
	let method = params.method || "get";
	let data = params.data || {};
	let header = {
		'Content-Type': 'application/json;charset=UTF-8',
		...params.header
	}
//请求封装end
	
	// 处理参数，确保POST请求参数正确传递
	if (method.toLowerCase() === 'post') {
		// 修改Content-Type为form-data格式
		header['Content-Type'] = 'application/x-www-form-urlencoded';
		// 对于POST请求，不需要额外处理，uni.request会根据Content-Type自动处理
	}
	
	return new Promise((resolve, reject) => {
		uni.request({
			url: base_url + url,
			method: method,
			header: header,
			data: data,  // 直接传递data对象，uni.request会根据Content-Type自动处理
            timeout: 10000,
			success(response) {
				const res = response
				if (res.statusCode == 200) {
					resolve(res.data);
				} else {
					switch (res.statusCode) {
						case 401:
							uni.showModal({
								title: "提示",
								content: "请登录",
								showCancel: false,
								success() {
									setTimeout(() => {
										uni.navigateTo({
											url: "/pages/login/login",
										})
									}, 1000);
								},
							});
							break;
						case 404:
							uni.showToast({
								title: '请求地址不存在...',
								duration: 2000,
							})
							break;
						default:
							uni.showToast({
								title: '请重试...',
								duration: 2000,
							})
							break;
					}
				}
			},
			fail(err) {
				console.log(err)
				if (err.errMsg.indexOf('request:fail') !== -1) {
					uni.showToast({
						title: '网络异常',
						icon: "error",
						duration: 2000
					})
				} else {
					uni.showToast({
						title: '未知异常',
						duration: 2000
					})
				}
				reject(err);
			},
			complete() {
				uni.hideLoading();
				uni.hideToast();
			}
		});
	}).catch(() => {});
};