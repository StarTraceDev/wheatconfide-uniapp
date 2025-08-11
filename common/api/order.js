import http from "@/utils/request.js"
// 获取心事列表
export const wxPay = (params, config = {}) => http.post('/api/order/order/wxPay',
	params, config)
