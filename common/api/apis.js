import http from "@/utils/request.js"

// 登录
export const login = (params, config = {}) => http.post('/api/user/login',
	params, config)
	
export const quickReg = (params, config = {}) => http.post('/api/user/quickReg',
	params, config)

export const getUserInfo = (params, config = {}) => http.post('/api/user/userInfo',
	params, config)


export const sendSms = (params, config = {}) => http.post('/api/sms/sms/sendSms',
	params, config)

export const smsLogin = (params, config = {}) => http.post('/api/user/smsLogin',
	params, config)
	
	
export const register = (params,config={})=>http.post('/api/user/register',params,config)


export const articleByType = (params,config={}) => http.get('/api/agreement/getByTitle',params,config)

export const cities = (params,config={})=>http.get("/api/city/list")