// request.js - 封装uni.request解决Long类型精度丢失问题

import JSONBig from 'json-bigint'

// 创建一个配置对象
const requestConfig = {
	// baseURL: 'https://ceshi.maimiaoqingsu.com', // API基础URL
	baseURL: '/',
	timeout: 30000, // 请求超时时间
	header: {
		'Content-Type': 'application/json'
	},
	dataType: 'text' // 关键：设置为text确保以字符串形式返回
}
// 创建一个封装后的请求方法
const request = (options) => {
	// 合并默认配置和用户配置
	// console.log('请求配置:', options)
	const config = {
		...requestConfig,
		...options
	}

	// 处理URL - 关键修改：将baseURL与url拼接
	if (config.url && !config.url.startsWith('http')) {
		// 确保baseURL以/结尾，url不以/开头，避免重复
		const baseUrl = config.baseURL.endsWith('/') ? config.baseURL : config.baseURL + '/'
		const path = config.url.startsWith('/') ? config.url.substring(1) : config.url
		config.url = baseUrl + path
	}

	// 获取token（根据实际项目调整）
	if (uni.getStorageSync('token')) {
		const token = uni.getStorageSync('token')

		// 添加token到请求头
		if (token) {
			config.header = {
				...config.header,
				'token': token
			}
		}
	}
	// console.log('处理后的配置:', config)

	// 返回一个Promise
	return new Promise((resolve, reject) => {
		uni.request({
			...config,
			success: (res) => {
				// console.log('原始响应数据:', res.data)

				// 处理响应数据
				let data = res.data
				// 从请求配置中获取custom参数（修正：应该从config中获取而不是res）
				const custom = config.custom || {}

				// 确保数据是字符串并使用json-bigint解析
				if (typeof data !== 'string') {
					data = JSON.stringify(data)
				}

				try {
					// 使用json-bigint解析，确保大整数不丢失精度
					data = JSONBig.parse(data)
				} catch (e) {
					console.error('JSON解析失败:', e)
					data = res.data // 解析失败时使用原始数据
				}
				// console.log(data)

				// 根据业务逻辑处理响应
				console.log('响应状态码:', data.code)

				// 优化：使用更清晰的条件判断
				if (data.code !== 0 && data.code !== 409999) {
					// 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
					if (custom.toast !== false) {
						uni.showToast(data.message || '请求失败')
						if (data.code == 401 || data.code==10010002) {
							uni.removeStorageSync("logoInfo")
							uni.reLaunch({
								url: "/pages/login/login"
							})
						}
					}
					// 拒绝Promise并传递错误数据
					return reject({
						statusCode: res.statusCode,
						data: data,
						message: data.message || '请求失败'
					})
				}

				// 解析成功，返回数据
				resolve(data)
			},
			fail: (err) => {
				console.error('请求失败:', err)
				// 处理网络错误
				uni.$u.toast('网络错误，请稍后再试')
				reject(err)
			},
			complete: () => {
				// 请求完成后的统一处理（可选）
			}
		})
	})
}

// 封装常用的HTTP方法
const http = {
	get(url, data = {}, config = {}) {
		return request({
			url,
			method: 'GET',
			data,
			...config
		})
	},

	post(url, data = {}, config = {}) {
		return request({
			url,
			method: 'POST',
			data,
			...config
		})
	},

	put(url, data = {}, config = {}) {
		return request({
			url,
			method: 'PUT',
			data,
			...config
		})
	},

	delete(url, data = {}, config = {}) {
		return request({
			url,
			method: 'DELETE',
			data,
			...config
		})
	}
}

export default http