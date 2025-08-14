import http from "@/utils/request.js"

// 获取支付列表
export const getPaymentList = (params, config = {}) => http.post('/api/order/order/getPaymentList',
	params, config)