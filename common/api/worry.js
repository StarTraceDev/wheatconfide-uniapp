import http from "@/utils/request.js"
// 获取心事列表
export const getWorryList = (params, config = {}) => http.post('/api/emotion/emotion/getEmotionList',
	params, config)

export const getArticleDetail = (params, config = {}) => http.post('/api/article/article/getArticleDetail',
	params, config)

export const getCommentById = (params, config = {}) => http.post('/api/comment/comment/getCommentById',
	params, config)
	
export const saveEmotion = (params, config = {}) => http.post('/api/emotion/emotion/saveEmotion',
	params, config)