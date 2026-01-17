/*
 * @Description: 当前页面描述
 * @Author: StarTraceDev
 * @Date: 2025-11-10 17:47:02
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2026-01-15 15:12:25
 */
import http from "@/utils/request.js";
// 获取咨询师列表
export const getConsultantList = (params, config = {}) =>
  http.post("/api/consultant/consultant/getConsultantList", params, config);

export const getCommentInfo = (params, config = {}) =>
  http.get(`/api/consultant/consultant/commentInfo?id=${params.id}`, params, config);

export const getCommentList = (params, config = {}) =>
  http.get("/api/consultant/consultant/commentList", params, config);

export const getServiceExperienceCon = (params, config = {}) =>
  http.get(`/api/consultant/consultant/serviceExperience?id=${params.id}`, params, config);

export const getConsultantById = (params, config = {}) =>
  http.post("/api/consultant/consultant/getConsultantById", params, config);

export const saveConsultant = (params, config = {}) =>
  http.post("/api/consultant/consultant/saveConsultant", params, config);

export const registerConsultantStep1 = (params, config = {}) =>
  http.post("/api/consultant/consultant/step1", params, config);

export const registerConsultantStep2 = (params, config = {}) =>
  http.post("/api/consultant/consultant/step2", params, config);

export const registerConsultantStep3 = (params, config = {}) =>
  http.post("/api/consultant/consultant/step3", params, config);

export const getConsultantByUserId = (params, config = {}) =>
  http.post("/api/consultant/consultant/getConsultantByUserId", params, config);

export const consultMenus = (params, config = {}) =>
  http.get("api/consultant/consultant/menu");

export const tencentSigIm = (params, config = {}) =>
  http.post("/api/tencent/sig/im", params, config);

export const tencentSigTrtc = (params, config = {}) =>
  http.post("/api/tencent/sig/trtc", params, config);

export const checkPolicy = (params, config = {}) =>
  http.post("/api/chat/policy/check", params, config);

export const postAdminList = (params, config = {}) =>
  http.post("/exam/api/sys/user-admin/paging", params, config);