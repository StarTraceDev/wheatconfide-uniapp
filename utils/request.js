import JSONBig from 'json-bigint'

export const baseURL = 'https://ceshi.maimiaoqingsu.com'
// export const baseURL = process.env.UNI_PLATFORM === 'h5'
//   ? '/' 
//   : 'https://ceshi.maimiaoqingsu.com'

const requestConfig = {
  baseURL,
  timeout: 30000,
  header: {
    'Content-Type': 'application/json'
  },
  dataType: 'text'
}

const request = (options) => {
  const config = { ...requestConfig, ...options }

  // 拼接 URL
  if (config.url && !config.url.startsWith('http')) {
    const baseUrl = config.baseURL.endsWith('/') ? config.baseURL : config.baseURL + '/'
    const path = config.url.startsWith('/') ? config.url.substring(1) : config.url
    config.url = baseUrl + path
  }

  // Token
  const token = uni.getStorageSync('token')
  if (token) {
    config.header = { ...config.header, token }
  }

  return new Promise((resolve, reject) => {
    uni.request({
      ...config,
      success: (res) => {
        if (res.statusCode !== 200) {
          uni.showToast({ title: '服务器异常，请稍后重试', icon: 'none' })
          reject(res)
          return
        }

        let data = res.data
        if (typeof data !== 'string') data = JSON.stringify(data)

        try {
          data = JSONBig.parse(data)
        } catch (e) {
          console.error('JSON解析失败:', e)
          data = res.data
        }
        const custom = config.custom || {}
        if (data.code !== 0 && data.code !== 409999) {
          if (custom.toast !== false) {
            uni.showToast({
              title: data.msg || '请求失败',
              icon: 'error'
            })

            if (data.code === 401 || data.code === 10010002) {
              uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
              uni.removeStorageSync("logoInfo")
              setTimeout(() => {
                uni.reLaunch({ url: "/pages/login/login" })
              }, 1000)
            }
          }
          reject({ statusCode: res.statusCode, data, message: data.msg || '请求失败' })
          return
        }

        resolve(data)
      },
      fail: (err) => {
        uni.showToast({ title: '网络错误，请稍后再试', icon: 'none' })
        reject(err)
      }
    })
  })
}

const http = {
  get(url, data = {}, config = {}) {
    return request({ url, method: 'GET', data, ...config })
  },
  post(url, data = {}, config = {}) {
    return request({ url, method: 'POST', data, ...config })
  },
  put(url, data = {}, config = {}) {
    return request({ url, method: 'PUT', data, ...config })
  },
  delete(url, data = {}, config = {}) {
    return request({ url, method: 'DELETE', data, ...config })
  }
}

export default http
