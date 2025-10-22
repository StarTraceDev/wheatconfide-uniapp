import http from "@/utils/request.js"
	
export const updateUser = (params, config = {}) => http.post('/api/user/update',
	params, config)
	
export const changeConsultant = (params, config = {}) => http.post('/api/user/changeConsultant',
	params, config)
	
	
export const getVerifyStatus = (params,config={}) =>http.get('/api/user/verifyStatus',params,config)