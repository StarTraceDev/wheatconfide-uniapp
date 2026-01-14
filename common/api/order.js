import http from "@/utils/request.js";

export const wxPay = (params, config = {}) =>
  http.post("/api/order/order/wxPay", params, config);

export const aliPay = (params, config = {}) =>
  http.post("/api/order/order/aliPay", params, config);

export const payment = (params, config = {}) =>
  http.post("/api/order/order/getPaymentList", params, config);

export const summary = (params, config = {}) =>
  http.get("/api/wallet/summary", params, config);

export const wallet = (params, config = {}) =>
  http.post("/api/wallet/income/page", params, config);

export const withdraw = (params, config = {}) =>
  http.post("/api/wallet/withdraw/page", params, config);

export const apply = (params, config = {}) =>
  http.post("/api/wallet/apply", params, config);

export const bank = (params, config = {}) =>
  http.get("/api/wallet/bank-cards", params, config);

export const addBank = (params, config = {}) =>
  http.post("/api/wallet/bank-card/add", params, config);

export const saveComment = (params, config = {}) =>
  http.post("/api/comment/comment/saveComment", params, config);

export const createConsult = (params, config = {}) =>
  http.post("/api/order/order/create", params, config);

export const applyRefund = (params, config = {}) =>
  http.post("/api/order/order/applyRefund", params, config);

export const payResult = (params, config = {}) =>
  http.get("/api/order/order/payResult", params, config);

// 获取订单
export const orderDetail = (params, config = {}) =>
  http.get(`/api/order/order/detail?orderSn=${params}`, config);

// 物流
export const express = (params, config = {}) =>
  http.get(`/api/mall/express/query`, params, config);

// 获取订单列表
export const orderList = (params, config = {}) =>
  http.post(`/api/order/order/createConsult`, params, config);

// 提交倾听订单
export const createListen = (params, config = {}) =>
  http.post(`/api/order/order/createListen`, params, config);

// 商品列表
export const orderMy = (params, config = {}) =>
  http.post(`/api/mall/order/my`, params, config);
