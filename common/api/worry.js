import http from "@/utils/request.js";
// 获取心事列表
export const getWorryList = (params, config = {}) =>
  http.post("/api/emotion/emotion/getEmotionList", params, config);

export const getArticleDetail = (params, config = {}) =>
  http.post("/api/article/article/getArticleDetail", params, config);

export const getCommentById = (params, config = {}) =>
  http.post("/api/comment/comment/getCommentById", params, config);

export const saveEmotion = (params, config = {}) =>
  http.post("/api/emotion/emotion/saveEmotion", params, config);

export const complaintType = (params, config = {}) =>
  http.post("/api/admin/complaint/type/page", params, config);

export const consultantAdd = (params, config = {}) =>
  http.post("/api/admin/consultant/quote/add", params, config);

export const listenerAdd = (params, config = {}) =>
  http.post("/api/admin/listener/quote/add", params, config);

export const consultantList = (params, config = {}) =>
  http.get(`/api/admin/consultant/quote/list?userId=${params}`, {}, config);

export const listenerList = (params, config = {}) =>
  http.get(`/api/admin/listener/quote/list?userId=${params}`, {}, config);

export const listenerDelete= (params, config = {}) =>
  http.post(`/api/admin/listener/quote/delete?id=${params}`, {}, config);

export const consultantDelete= (params, config = {}) =>
  http.post(`/api/admin/consultant/quote/delete?id=${params}`, {}, config);

export const getAgreement = (params, config = {}) =>
  http.get(`/api/agreement/page`, params, config);

export const getOperation = (params, config = {}) =>
  http.get(`/api/operation-settings/page?current=1&size=10`, params, config);

export const listenerUpdate= (params, config = {}) =>
  http.post(`/api/admin/listener/quote/update`, params, config);

export const consultantUpdate= (params, config = {}) =>
  http.post(`/api/admin/consultant/quote/update`, params, config);

export const getCommentByTargetUserId = (params, config = {}) =>
  http.get(`/api/comment/comment/getCommentByTargetUserId`, params, config);

export const setBatch = (params, config = {}) =>
  http.post(`/api/consultant/schedule/setBatch`, params, config);

export const setSchedule = (params, config = {}) =>
  http.post(`/api/consultant/schedule/set`, params, config);

export const getSchedule = (params, config = {}) => http.get('/api/consultant/schedule/available?consultantId=',params, config)
