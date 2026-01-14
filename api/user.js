import http from '@/utils/request.js'
import request from '@/utils/request.js'

// 提交投诉建议
export const complaintSubmitPost = (params, config = {}) => http.post('/api/complaint/submit', params, config)

