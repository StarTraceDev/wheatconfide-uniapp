import http from "@/utils/request.js"

// 获取商品分类列表
export const postCategoryList = (params, config = {}) => 
  http.post(`/api/mall/category/list`, params, config)

// 根据分类获取商品列表
export const getProductsByCategory = (params, config = {}) => 
  http.get(`/api/mall/product/category`, params, config)

// 推荐商品
export const getRecommendedProducts = (params, config = {}) => 
  http.get(`/api/mall/product/recommended`, params, config)

// 获取商品详情
export const getProductDetail = (params, config = {}) => 
  http.get(`api/mall/product/detail?id=${params}`, config)

// 加入购物车
export const addCart = (data, config = {}) => 
  http.post(`/api/mall/cart/add`, data, config)

// 获取购物车列表
export const getCartList = (params, config = {}) => 
  http.get(`/api/mall/cart/list`, params, config)

// 删除购物车商品
export const deleteCartItem = (data, config = {}) => 
  http.post(`/api/mall/cart/delete`, data, config)

// 删除购物车商品（批量）
export const batchDeleteCartItems = (data, config = {}) => 
  http.post(`/api/mall/cart/batchDelete`, data, config)

// 获取收货地址列表
export const getAddressList = (params, config = {}) => 
  http.get(`/api/mall/address/list`, params, config)

// 添加收货地址
export const addAddress = (data, config = {}) => 
  http.post(`/api/mall/address/add`, data, config)

// 修改收货地址
export const updateAddress = (data, config = {}) => 
  http.post(`/api/mall/address/update`, data, config)

// 删除收货地址
export const deleteAddress = (data, config = {}) => 
  http.post(`/api/mall/address/delete`, data, config)

// 获取收货地址详情
export const getAddressDetail = (params, config = {}) => 
  http.get(`/api/mall/address/detail`,params, config)

// 获取默认收货地址
export const getDefaultAddress = (params, config = {}) => 
  http.get(`/api/mall/address/default`,params, config)

// 售后详情
export const getRefundDetail = (params, config = {}) => 
  http.get(`/api/mall/refund/detail?id=${params}`, config)

// 修改购物车商品数量
export const updateCartItem = (data, config = {}) => 
  http.post(`/api/mall/cart/update`, data, config)

// 获取购物车商品数量
export const getCartItemCount = (params, config = {}) => 
  http.get(`/api/mall/cart/count`, params, config)

// 提交订单
export const submitOrder = (data, config = {}) => 
  http.post(`/api/mall/order/create`, data, config)

// 获取订单列表
export const getOrderList = (params, config = {}) => 
  http.get(`/api/mall/order/list`, params, config)

// 获取订单详情
export const getOrderDetail = (params, config = {}) => 
  http.get(`/api/mall/order/detail?id=${params}`, config)

// 取消订单
export const cancelOrder = (data, config = {}) => 
  http.post(`/api/mall/order/cancel`, data, config)

// 确认收货
export const confirmReceipt = (data, config = {}) => 
  http.post(`/api/mall/order/confirm`, data, config)

// 获取支付参数
export const getPaymentParams = (data, config = {}) => 
  http.post(`/api/mall/order/pay`, data, config) 