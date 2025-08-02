import http from "@/utils/request.js"
// 获取文章列表
export const getArticleList = (params, config = {}) => http.post('/api/article/article/getArticleList',
	params, config)

export const getArticleDetail = (params, config = {}) => http.post('/api/article/article/getArticleDetail',
	params, config)

export const getCommentById = (params, config = {}) => http.post('/api/comment/comment/getCommentById',
	params, config)
	
export const saveComment = (params, config = {}) => http.post('/api/comment/comment/saveComment',
	params, config)