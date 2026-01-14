import { ref } from 'vue'

/**
 * 支付渠道常量定义
 * @constant {Object} PAYMENT_CHANNELS
 * @property {string} WECHAT - 微信支付
 * @property {string} ALIPAY - 支付宝支付
 */
export const PAYMENT_CHANNELS = {
  WECHAT: 'wxpay',
  ALIPAY: 'alipay'
}

/**
 * 支付状态常量定义
 * @constant {Object} PAYMENT_STATUS
 * @property {string} SUCCESS - 支付成功
 * @property {string} FAILED - 支付失败
 * @property {string} CANCELED - 支付取消
 * @property {string} UNKNOWN - 支付状态未知
 */
export const PAYMENT_STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELED: 'canceled',
  UNKNOWN: 'unknown'
}

/**
 * 支付相关逻辑的组合式函数
 * 提供获取支付渠道、发起支付、检查支付状态等功能
 * @returns {Object} 支付相关方法和状态
 */
export function usePayment() {
  // 支付渠道映射表（id -> 渠道实例）
  const paymentChannels = ref({})
  // 支付加载状态
  const isLoading = ref(false)
  // 当前支付状态
  const paymentStatus = ref(PAYMENT_STATUS.UNKNOWN)

  /**
   * 获取并初始化支付渠道
   * @returns {Promise<Object>} 支付渠道映射表
   */
  const getPaymentChannels = () => {
    return new Promise((resolve, reject) => {
      if (Object.keys(paymentChannels.value).length) {
        // 已加载过渠道，直接返回缓存
        resolve(paymentChannels.value)
        return
      }

      plus.payment.getChannels((channels) => {
        const channelMap = {}
        channels.forEach(channel => {
          channelMap[channel.id] = channel
        })
        paymentChannels.value = channelMap
        resolve(channelMap)
      }, (error) => {
        console.error('获取支付渠道失败:', error)
        reject(new Error(`获取支付渠道失败: ${error.message || error.code}`))
      })
    })
  }

  /**
   * 获取指定支付渠道
   * @param {string} channelId - 渠道ID（如wxpay/alipay）
   * @returns {Object|null} 渠道实例或null
   */
  const getChannel = (channelId) => {
    return paymentChannels.value[channelId] || null
  }

  /**
   * 生成支付错误信息
   * @param {Object} error - 错误对象
   * @param {string} channelId - 渠道ID
   * @returns {string} 可读性错误信息
   */
  const getErrorMessage = (error, channelId) => {
    const { code, message } = error
    // 通用错误码映射
    const commonErrors = {
      [-1]: '支付失败，请重试',
      [-2]: '用户取消支付',
      [-3]: '支付操作未完成',
      [-4]: '支付渠道不可用',
      [-5]: '网络异常，请检查网络'
    }
    // 渠道特定错误码映射
    const channelErrors = {
      [PAYMENT_CHANNELS.WECHAT]: {
        [-100]: '微信未安装',
        [-101]: '微信版本不支持',
        [-102]: '微信支付参数错误',
        [-103]: '微信登录授权失败'
      },
      [PAYMENT_CHANNELS.ALIPAY]: {
        [-100]: '支付宝未安装',
        [-101]: '支付宝版本不支持',
        [-102]: '支付宝支付参数错误',
        [-103]: '支付宝账号未登录'
      }
    }

    // 优先返回渠道特定错误，再返回通用错误，最后返回原始信息
    return channelErrors[channelId]?.[code] 
      || commonErrors[code] 
      || message 
      || `支付错误: 错误码=${code}`
  }

  /**
   * 发起支付请求
   * @param {string} channelId - 支付渠道ID
   * @param {string|Object} orderInfo - 订单信息（通常为支付平台返回的订单字符串或对象）
   * @returns {Promise<Object>} 支付结果
   * @throws {Error} 支付失败时抛出错误
   */
  const requestPayment = (channelId, orderInfo) => {
    return new Promise((resolve, reject) => {
      // 校验订单信息
      if (!orderInfo) {
        reject(new Error('订单信息不能为空'))
        return
      }

      const channel = getChannel(channelId)
      if (!channel) {
        reject(new Error(`未找到支付渠道: ${channelId}，请先初始化渠道`))
        return
      }

      plus.payment.request(channel, orderInfo, (result) => {
        let rawData = result.rawdata
        try {
          rawData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData
        } catch (e) {
          console.warn('支付返回数据解析失败:', e)
        }
        
        paymentStatus.value = PAYMENT_STATUS.SUCCESS
        resolve({
          status: PAYMENT_STATUS.SUCCESS,
          data: rawData,
          originalResult: result
        })
      }, (error) => {
        console.error(`[${channelId}]支付失败:`, error)
        
        let status = PAYMENT_STATUS.FAILED
        if (error.code === -2) {
          status = PAYMENT_STATUS.CANCELED 
        }
        
        paymentStatus.value = status
        reject({
          status,
          error,
          message: getErrorMessage(error, channelId)
        })
      })
    })
  }

  /**
   * 微信支付
   * @param {string|Object} orderInfo - 微信订单信息
   * @returns {Promise<Object>} 支付结果
   */
  const wechatPay = async (orderInfo) => {
    if (isLoading.value) {
      console.warn('有正在进行的支付，请稍后再试')
      return
    }
    isLoading.value = true
    try {
      if (!getChannel(PAYMENT_CHANNELS.WECHAT)) {
        await getPaymentChannels()
      }
      return await requestPayment(PAYMENT_CHANNELS.WECHAT, orderInfo)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 支付宝支付
   * @param {string|Object} orderInfo - 支付宝订单信息
   * @returns {Promise<Object>} 支付结果
   */
  const alipay = async (orderInfo) => {
    console.log(orderInfo, '196 - - - - - ');
    
    if (isLoading.value) {
      console.warn('有正在进行的支付，请稍后再试')
      return
    }
    isLoading.value = true
    try {
      if (!getChannel(PAYMENT_CHANNELS.ALIPAY)) {
        await getPaymentChannels()
      }
      return await requestPayment(PAYMENT_CHANNELS.ALIPAY, orderInfo)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 通用支付方法（支持指定渠道）
   * @param {string} channelId - 支付渠道ID
   * @param {string|Object} orderInfo - 订单信息
   * @returns {Promise<Object>} 支付结果
   */
  const pay = async (channelId, orderInfo) => {
    if (isLoading.value) {
      console.warn('有正在进行的支付，请稍后再试')
      return
    }
    isLoading.value = true
    try {
      // 重置支付状态
      paymentStatus.value = PAYMENT_STATUS.UNKNOWN
      // 确保渠道已加载
      if (!getChannel(channelId)) {
        await getPaymentChannels()
      }
      return await requestPayment(channelId, orderInfo)
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 初始化支付渠道（建议在页面加载时调用）
   * @returns {Promise<void>}
   */
  const initPaymentChannels = async () => {
    try {
      await getPaymentChannels()
      console.log('支付渠道初始化成功:', Object.keys(paymentChannels.value))
    } catch (error) {
      console.error('支付渠道初始化失败:', error)
      throw error
    }
  }

  /**
   * 检查支付渠道是否可用
   * @param {string} channelId - 渠道ID
   * @returns {boolean} 是否可用
   */
  const isChannelAvailable = (channelId) => {
    return !!getChannel(channelId)
  }

  /**
   * 获取所有可用支付渠道ID
   * @returns {string[]} 渠道ID数组
   */
  const getAvailableChannels = () => {
    return Object.keys(paymentChannels.value)
  }

  return {
    isLoading,               // 支付加载状态
    paymentStatus,           // 当前支付状态
    paymentChannels,         // 支付渠道映射表
    pay,                     // 通用支付方法
    wechatPay,               // 微信支付快捷方法
    alipay,                  // 支付宝支付快捷方法
    initPaymentChannels,     // 初始化支付渠道
    isChannelAvailable,      // 检查渠道是否可用
    getAvailableChannels,    // 获取可用渠道列表
    PAYMENT_CHANNELS,        // 支付渠道常量
    PAYMENT_STATUS           // 支付状态常量
  }
}