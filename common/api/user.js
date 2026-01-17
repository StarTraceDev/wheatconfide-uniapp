import http from "@/utils/request.js";

export const updateUser = (params, config = {}) =>
  http.post("/api/user/update", params, config);

export const changeConsultant = (params, config = {}) =>
  http.post("/api/user/changeConsultant", params, config);

export const getVerifyStatus = (params, config = {}) =>
  http.get("/api/user/verifyStatus", params, config);

export const saveRoleInfo = (params, config = {}) =>
  http.post("/api/user/saveRoleInfo", params, config);

export const complaintSubmitPost = (params, config = {}) =>
  http.post("/api/complaint/submit", params, config);

// 提交意见反馈
export const feedbackSubmit = (params, config = {}) =>
	http.post("/api/feedback/submit", params, config);

// 用户关注咨询师/倾听师
export const follow = (params, config = {}) =>
  http.post("/api/user/follow/add", params, config);

// 取消关注
export const collect = (params, config = {}) =>
  http.post("/api/user/follow/cancel", params, config);

// 查询是否已关注
export const followStatus = (params, config = {}) =>
  http.get("/api/user/follow/status", params, config);

// 用户收藏商品
export const collectAdd = (params, config = {}) =>
  http.post("/api/user/collect/add", params, config);

// 取消收藏
export const collectCancel = (params, config = {}) =>
  http.post("/api/user/collect/cancel", params, config);

// 查询是否已收藏
export const collectStatus = (params, config = {}) =>
  http.get("/api/user/collect/status", params, config);
