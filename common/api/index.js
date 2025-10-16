import http from '@/utils/request.js'

export const bannerList = (params, config = {}) => http.get('/api/banner/list',
	params, config)

export const getConsultantMenus = (params, config = {}) => http.get('/api/appMenu/menus', params, config)

export const listHomeExams = (params,config={}) => http.get("/api/psychology/exam/listHome",params,config)