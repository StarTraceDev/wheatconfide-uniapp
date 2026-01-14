import { ref, reactive, onUnmounted } from 'vue'
import TIM from 'tim-js-sdk'
import TIMUploadPlugin from 'tim-upload-plugin'

// 全局单例IM实例
let timInstance = null
// 全局状态缓存
const globalLoginState = reactive({
  isLogin: false,
  userId: '',
  sdkAppID: '',
  sdkReady: false // 新增：SDK 是否就绪
})

// 兼容旧版本常量
const LOGIN_STATUS_LOGINED = TIM.TYPES?.LOGIN_STATUS_LOGINED || 'logined'
const LOGIN_STATUS_UNLOGINED = TIM.TYPES?.LOGIN_STATUS_UNLOGINED || 'unlogined'

export function useTIM(SDKAppID) {
  // 响应式状态
  const loading = ref(false)
  const errorMsg = ref('')
  const tim = ref(null)

  // 初始化IM实例
  const initTIM = () => {
    if (timInstance) {
      tim.value = timInstance;
      if (timInstance.sdkReadyState === 'ready') {
        globalLoginState.sdkReady = true
      }
      return timInstance;
    }
    if (!SDKAppID) {
      console.error('TIM 初始化失败：SDKAppID 不能为空');
      return null;
    }
    try {
      timInstance = TIM.create({
        SDKAppID: SDKAppID,
        logLevel: 1, // 建议临时开启日志，便于调试
      });
      if (timInstance.registerPlugin) {
        timInstance.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
      }
      tim.value = timInstance; // 强制赋值
      console.log('TIM 实例初始化成功');
      return timInstance;
    } catch (err) {
      console.error('TIM 实例创建失败：', err);
      tim.value = null;
      return null;
    }
  };

  // 新增：等待 SDK Ready 的通用方法（Promise 封装）
  const waitSDKReady = () => {
  return new Promise((resolve) => {
    // 新增：主动检查 TIM 实例的就绪状态（兼容 SDK 已就绪但事件已触发的场景）
    if (timInstance?.sdkReadyState === 'ready' || globalLoginState.sdkReady) {
      globalLoginState.sdkReady = true
      resolve(true)
      return
    }
    // 未就绪则监听事件，触发后resolve
    const onReady = () => {
      globalLoginState.sdkReady = true
      timInstance.off(TIM.EVENT.SDK_READY, onReady) // 移除一次性监听
      resolve(true)
    }
    timInstance.on(TIM.EVENT.SDK_READY, onReady)
  })
}

  // 检查登录状态（兼容新旧版本）
  const checkLoginStatus = () => {
    if (!timInstance) initTIM()
    if (!timInstance) return Promise.resolve(false)

    if (typeof timInstance.checkLoginStatus === 'function') {
      return new Promise(async (resolve) => {
        try {
          const status = await timInstance.checkLoginStatus()
          globalLoginState.isLogin = status === LOGIN_STATUS_LOGINED
          resolve(globalLoginState.isLogin)
        } catch (err) {
          resolve(false)
        }
      })
    } else {
      const loginStatus = timInstance.loginStatus || LOGIN_STATUS_UNLOGINED
      globalLoginState.isLogin = loginStatus === LOGIN_STATUS_LOGINED
      return Promise.resolve(globalLoginState.isLogin)
    }
  }

  // 登录IM（改造：登录后等待SDK Ready）
  const loginTIM = async (options) => {
    const { userId, userSig } = options
    if (!userId || !userSig) {
      errorMsg.value = '用户ID和UserSig不能为空'
      return false
    }

    loading.value = true
    errorMsg.value = ''

    try {
      const instance = initTIM()
      if (!instance) {
        loading.value = false
        errorMsg.value = 'TIM 实例初始化失败'
        return false
      }

      // 检查当前登录状态
      const isLogined = await checkLoginStatus()
      if (isLogined && globalLoginState.userId === userId) {
        // 已登录同账号，等待SDK Ready后返回
        await waitSDKReady()
        loading.value = false
        return true
      }

      // 登出旧账号（若有）
      if (isLogined) {
        await timInstance.logout()
        globalLoginState.isLogin = false
        globalLoginState.userId = ''
        globalLoginState.sdkReady = false // 登出后重置Ready状态
      }

      // 执行登录
      const res = await timInstance.login({
        userID: userId,
        userSig: userSig
      })

      // 登录成功后，等待SDK Ready
      await waitSDKReady()

      // 更新全局状态
      if (res.data && res.data.repeatLogin === false) {
        globalLoginState.isLogin = true
        globalLoginState.userId = userId
        globalLoginState.sdkAppID = SDKAppID
      }

      loading.value = false
      return true
    } catch (err) {
      loading.value = false
      const repeatLoginCodes = [20009, 10012]
      if (repeatLoginCodes.includes(err.code)) {
        globalLoginState.isLogin = true
        globalLoginState.userId = userId
        // 重复登录时也需等待SDK Ready
        await waitSDKReady()
        errorMsg.value = '当前账号已登录'
        return true
      }
      errorMsg.value = err.message || `登录失败：${err.code}`
      console.error('IM登录失败：', err)
      return false
    }
  }

  // 登出IM
  const logoutTIM = async () => {
    if (!timInstance) return
    loading.value = true
    try {
      await timInstance.logout()
      globalLoginState.isLogin = false
      globalLoginState.userId = ''
      globalLoginState.sdkReady = false // 登出后重置Ready状态
      errorMsg.value = ''
      loading.value = false
      return true
    } catch (err) {
      loading.value = false
      errorMsg.value = err.message || '登出失败'
      console.error('IM登出失败：', err)
      return false
    }
  }

  // 事件监听
  const onTIMEvent = (eventName, callback) => {
    if (!timInstance) initTIM();
    if (!timInstance || typeof timInstance.on !== 'function') {
      console.error('TIM实例未初始化，无法注册事件监听', eventName);
      return;
    }
    timInstance.on(eventName, callback);
    onUnmounted(() => {
      if (timInstance && typeof timInstance.off === 'function') {
        timInstance.off(eventName, callback);
      }
    });
  };

  // 初始化
  initTIM()

  return {
    tim,
    loading,
    errorMsg,
    isLogin: globalLoginState.isLogin,
    userId: globalLoginState.userId,
    sdkReady: globalLoginState.sdkReady, // 暴露SDK Ready状态
    loginTIM,
    logoutTIM,
    checkLoginStatus,
    waitSDKReady, // 暴露等待Ready的方法
    onTIMEvent
  }
}