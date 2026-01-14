import http from "@/utils/request.js";
// 获取咨询师列表
export const getListenerList = (params, config = {}) =>
  http.post("/api/listener/getListenerList", params, config);

export const getListenerById = (params, config = {}) =>
  http.post("/api/listener/getListenerByUserId", params, config);

export const getListenerInfo = (params, config = {}) =>
  http.post("/api/listener/getListenerById", params, config);

export const saveListener = (params, config = {}) =>
  http.post("/api/listener/saveListener", params, config);

export const registerListenerStep1 = (params, config = {}) =>
  http.post("/api/listener/step1", params, config);

export const registerListenerStep2 = (params, config = {}) =>
  http.post("/api/listener/step2", params, config);

export const registerListenerStep3 = (params, config = {}) =>
  http.post("/api/listener/step3", params, config);

export const getListenerByUserId = (params, config = {}) =>
  http.post("/api/listener/getListenerByUserId", params, config);

export const getOccupation = (params, config = {}) =>
  http.get("/api/admin/occupation/list", params, config);

export const getQualification = (params, config = {}) =>
  http.get("/api/admin/qualification/list", params, config);

export const getCommentInfo = (params, config = {}) =>
  http.get(`/api/listener/commentInfo?id=${params.id}`, params, config);

export const getCommentList = (params, config = {}) =>
  http.get("/api/listener/commentList", params, config);

export const getServiceExperience = (params, config = {}) =>
  http.get(`/api/listener/serviceExperience?id=${params.id}`, params, config);

