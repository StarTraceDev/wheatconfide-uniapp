import http from "@/utils/request.js"

export const getExamDetail = (params,config={})=>http.get('/api/psychology/exam/paperDetail',params,config)

export const getExamRule = (params,config={})=>http.get('/api/config/examRuleDescription',params,config)

export const getExamOptions = (params,config={})=>http.get('/api/psychology/exam/options',params,config)

export const saveExamRecord = (params,config={})=>http.post('/api/psychology/examRecord/save',params,config)

export const updateUserAnswer = (params,config={})=>http.post('/api/psychology/examRecord/update',params,config)

export const examResult = (params,config={})=>http.get('/api/psychology/examRecord/getExamResult',params,config)

export const publishExamComment = (params,config={})=>http.post('/api/comment/comment/saveComment',params,config)

export const examRecord = (params,config={})=>http.get('/api/psychology/examRecord/listMyRecord',params,config)

export const recordDetail = (params,config={})=>http.get('/api/psychology/examRecord/userRecordDetail',params,config)

export const commentSatus = (params,config={})=>http.get('/api/psychology/examRecord/commentStatus',params,config)

export const examListByTypes = (params,config={})=>http.get('/api/psychology/exam/listByType',params,config)

export const recommendExams = (params,config={})=>http.get('/api/psychology/exam/recommendExams',params,config)

export const dailyRecommend = (params,config={})=>http.get('/api/psychology/exam/dailyRecommend',params,config)

export const examListData = (params,config={})=>http.get('/api/psychology/exam/list',params,config)

export const articleComment = (params,config={})=>http.get('/api/psychology/exam/commentInfo',params,config)

export const articleCommentList = (params,config={})=>http.get('/api/psychology/exam/commentList',params,config)