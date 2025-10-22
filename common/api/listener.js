import http from "@/utils/request.js"
// 获取咨询师列表
export const getListenerList = (params, config = {}) => http.post('/api/listener/listenerList',
	params, config)
	
	
export const getListenerById = (params, config = {}) => http.post('/api/listener/getListenerById',
	params, config)
	
export const saveListener= (params, config = {}) => http.post('/api/listener/saveListener',
	params, config)
	
export const registerListenerStep1 = (params,config={}) => http.post('/api/listener/step1',params,config)
export const registerListenerStep2 = (params,config={}) => http.post('/api/listener/step2',params,config)
export const registerListenerStep3 = (params,config={}) => http.post('/api/listener/step3',params,config)

export const getListenerByUserId = (params,config={}) =>http.post('/api/listener/getListenerByUserId',params,config)
	
	