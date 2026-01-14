import http from "@/utils/request.js";

export const getUserBaseSetting = (params, config = {}) =>
  http.get("/api/user/roleInfo", params, config);

export const getSchedule = (params, config = {}) =>
  http.get(
    "/api/consultant/schedule/available?consultantId=&date=",
    params,
    config
  );
export const setSchedule = (params, config = {}) =>
  http.post("/api/consultant/schedule/set", params, config);

export const initSchedule = (params, config = {}) =>
  http.post(`/api/consultant/schedule/init?consultantId=${params.consultantId}`, params, config);

export const getPaymentList = (params, config = {}) =>
  http.post(`/api/order/order/getPaymentList`, config);

export const postOrder = (params, config = {}) =>
  http.post(`/api/admin/order/manage/paging`, params, config);

export const cancel = (params, config = {}) =>
  http.post(`/api/order/order/cancel`, params, config);
