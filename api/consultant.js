import http from "@/utils/request.js"
// 获取咨询师列表
export const getConsultantList = (params, config = {}) => http.post('/api/consultant/consultant/getConsultantList',
	params, config)
	
export const getConsultantById = (params, config = {}) => http.post('/api/consultant/consultant/getConsultantById',
	params, config)
	
export const saveConsultant = (params, config = {}) => http.post('/api/consultant/consultant/saveConsultant',
	params, config)
	
	
	
	