import http from "@/utils/request.js"
// 登录
export const quickReg = (params, config = {}) => http.post('/api/user/quickReg',
	params, config)

export const userlnfo = (params, config = {}) => http.post('/api/user/userInfo',
	params, config)


export const sendSms = (params, config = {}) => http.post('/api/sms/sms/sendSms',
	params, config)

export const smsLogin = (params, config = {}) => http.post('/api/user/smsLogin',
	params, config)