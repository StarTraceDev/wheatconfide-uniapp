import http from "@/utils/request.js"

export const getUserBaseSetting = (params,config={})=>http.get('/api/user/roleInfo',params,config)