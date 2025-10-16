import http from "@/utils/request.js"
// 获取咨询师列表
export const getConsultantList = (params, config = {}) => http.post('/api/consultant/consultant/consultantList',
	params, config)
	
	
export const getConsultantById = (params, config = {}) => http.post('/api/consultant/consultant/getConsultantById',
	params, config)
	
export const saveConsultant = (params, config = {}) => http.post('/api/consultant/consultant/saveConsultant',
	params, config)
	
export const registerConsultantStep1 = (params,config={}) => http.post('/api/consultant/consultant/step1',params,config)
export const registerConsultantStep2 = (params,config={}) => http.post('/api/consultant/consultant/step2',params,config)
export const registerConsultantStep3 = (params,config={}) => http.post('/api/consultant/consultant/step3',params,config)

export const getConsultantByUserId = (params,config={}) =>http.post('/api/consultant/consultant/getConsultantByUserId',params,config)
	
	