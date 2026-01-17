/**
 * 腾讯云IM+TUICallKit音视频 全局封装类 最终定稿版
 * ✅ 改用 import TIM from "tim-js-sdk" 引入方式
 * ✅ 彻底修复【外部获取TIM实例undefined】核心问题
 * ✅ Vue3 setup + uniapp 全端适配
 * ✅ 包含：文字/语音/图片消息+历史记录+实时接收+checkPolicy校验+TUICallKit音视频通话
 * ✅ 对外暴露完整TIM实例，支持外部直接调用原生方法
 */
import TIM from "tim-js-sdk";
import COS from "cos-js-sdk-v5";
import { tencentSigIm, tencentSigTrtc, checkPolicy } from "@/common/api/consultant.js";

// ===================== 常量配置 (只改这里的SDKAPPID即可) =====================
const CONFIG = {
  SDKAPPID: 1600116083, // 腾讯云IM应用ID
  MSG_PAGE_SIZE: 20, // 历史消息每页条数
  VOICE_TIME_MAX: 60, // 语音最长录制秒数
  VOICE_FORMAT: 'mp3', // 语音格式
};

// ===================== 腾讯云IM 常量硬编码 (根治 EVENT undefined 核心) =====================
const TIM_CONST = {
  EVENT: {
    MESSAGE_RECEIVED: 'MESSAGE_RECEIVED',
    SDK_READY: 'SDK_READY',
    SDK_NOT_READY: 'SDK_NOT_READY',
    KICKED_OUT: 'KICKED_OUT',
    NET_STATE_CHANGE: 'NET_STATE_CHANGE'
  },
  CONV_C2C: 'C2C', // 单聊会话类型
  MSG_TYPE: {
    TEXT: "TIMTextElem",
    IMAGE: "TIMImageElem",
    VOICE: "TIMSoundElem"
  }
};

// ===================== 工具函数 =====================
const showToast = (title) => uni.showToast({ title, icon: 'none', duration: 2000 });

// ===================== 核心IM封装类 =====================
class TencentIm {
  constructor() {
    this.timInstance = null; // ✅ 挂载到类实例上【核心修复】外部可直接访问
    this.callKitInstance = null; // ✅ 音视频实例也挂载到类上
    this.imStatus = { isLogin: false, userId: "", userSig: "", trtcSig: "" }; // 登录状态挂载到类
    this.chatCache = { currentToUserId: "", messageList: [], lastMsgSeq: "" }; // 聊天缓存挂载到类
    this.initIM();
    this.initTUICallKit();
  }

  /**
   * 初始化腾讯云IM SDK ✅ 标准tim-js-sdk初始化方式 + COS依赖配置
   */
  initIM() {
    try {
      // 1. 初始化IM实例 - 标准写法
      this.timInstance = TIM.create({
        SDKAppID: CONFIG.SDKAPPID
      });
      if (!this.timInstance) {
        showToast('IM实例初始化失败');
        return;
      }

      // 2. 腾讯云官方必配：COS上传依赖，多媒体消息必须
      this.timInstance.registerPlugin({ 'cos-js-sdk': COS });

      // 3. 设置日志级别 1=开发环境 0=生产环境
      this.timInstance.setLogLevel(1);

      // 4. 注册全局事件监听
      this.registerImEvent();
    } catch (err) {
      console.error('IM初始化异常:', err);
      showToast('IM初始化异常，请重试');
    }
  }

  /**
   * 初始化TUICallKit音视频插件 (不变)
   */
  initTUICallKit() {
    try {
      this.callKitInstance = uni.requirePlugin('TencentCloud-TUICallKit');
      if (!this.callKitInstance) {
        showToast('音视频插件加载失败');
        return;
      }
      // 传入挂载在类上的IM实例，共享登录态
      this.callKitInstance.init({
        SDKAppID: CONFIG.SDKAPPID,
        timInstance: this.timInstance
      });
    } catch (err) {
      console.error('音视频插件初始化异常:', err);
    }
  }

  /**
   * 注册IM全局事件监听 ✅ 无任何undefined风险
   */
  registerImEvent() {
    if (!this.timInstance) return;
    const { EVENT } = TIM_CONST;

    // ✅ 实时接收新消息 - 核心事件
    this.timInstance.on(EVENT.MESSAGE_RECEIVED, (event) => {
      const newMsgList = event.data || [];
      if (newMsgList.length === 0) return;
      this.handleNewMessage(newMsgList);
      uni.$emit('im_message_received', newMsgList);
    });

    // ✅ IM登录就绪/可用
    this.timInstance.on(EVENT.SDK_READY, () => {
      this.imStatus.isLogin = true;
      uni.$emit('im_login_success');
    });

    // ✅ IM未就绪/断开连接
    this.timInstance.on(EVENT.SDK_NOT_READY, () => {
      this.imStatus.isLogin = false;
      uni.$emit('im_login_fail');
    });

    // ✅ 账号被踢下线
    this.timInstance.on(EVENT.KICKED_OUT, () => {
      showToast('你的账号已在其他设备登录');
      this.loginOutIm();
      uni.$emit('im_kicked_out');
    });

    // ✅ 网络状态变更提示
    this.timInstance.on(EVENT.NET_STATE_CHANGE, (event) => {
      if (event.data.state === 'DISCONNECTED') {
        showToast('网络断开，消息将暂存本地');
      }
    });
  }

  /**
   * 用户登录成功后 登录IM【核心入口】
   * @param {String} userId 用户ID
   * @returns {Promise<Boolean>}
   */
  async loginIm(userId) {
    if (!userId) { showToast('用户ID不能为空'); return false; }
    if (this.imStatus.isLogin && this.imStatus.userId === userId) return true;
    if (!this.timInstance) { showToast('IM未初始化'); return false; }

    try {
      const { data: imSigData } = await tencentSigIm({ userId });
      if (!imSigData?.userSig) { showToast('IM签名获取失败'); return false; }

      this.imStatus.userId = userId;
      this.imStatus.userSig = imSigData.userSig;
      await this.timInstance.login({ userID: userId, userSig: imSigData.userSig });
      this.imStatus.isLogin = true;
      return true;
    } catch (err) {
      this.imStatus.isLogin = false;
      console.error('IM登录失败:', err);
      showToast(`IM登录失败：${err.message || '签名异常'}`);
      return false;
    }
  }

  /**
   * 拉取历史聊天记录【分页加载】
   * @param {String} toUserId 对方用户ID
   * @param {Boolean} isLoadMore 是否加载更多
   * @returns {Promise<Array>}
   */
  async getHistoryMessage(toUserId, isLoadMore = false) {
    if (!this.imStatus.isLogin || !toUserId || !this.timInstance) return [];
    this.chatCache.currentToUserId = toUserId;

    try {
      const reqParams = {
        conversationID: `C2C${toUserId}`,
        count: CONFIG.MSG_PAGE_SIZE,
        nextReqMessageID: isLoadMore ? this.chatCache.lastMsgSeq : ''
      };
      const { data } = await this.timInstance.getMessageList(reqParams);
      this.chatCache.lastMsgSeq = data.nextReqMessageID || '';
      const formatMsg = this.formatMessage(data.messageList || []);
      this.chatCache.messageList = isLoadMore ? [...this.chatCache.messageList, ...formatMsg] : formatMsg;
      return this.chatCache.messageList;
    } catch (err) {
      console.error('拉取历史消息失败:', err);
      showToast('历史消息加载失败');
      return [];
    }
  }

  /**
   * 发送消息前置校验【必调】- 你的接口完整适配
   * @param {String} content 消息内容
   * @param {String} toUserId 对方ID
   * @returns {Promise<Boolean>}
   */
  async checkSendPolicy(content, toUserId) {
    const params = {
      content: content,
      expireSeconds: 0,
      fromUserId: this.imStatus.userId,
      ordered: true,
      toUserId: toUserId
    };
    try {
      const { data } = await checkPolicy(params);
      if (data?.allowed) return true;
      const tipMap = {
        SENSITIVE: '消息包含敏感词，禁止发送',
        FREE_LIMIT: '未下单，消息发送次数已达上限',
        RATE_LIMIT: '发送频率过高，请稍后再试',
        COMPLAINT_RESTRICT: '你已被投诉，暂时禁止发送消息',
        BANNED: '账号已被封禁，无法发送消息'
      };
      const tipText = tipMap[data.limitType] || data.message || '发送权限校验失败';
      showToast(tipText);
      return false;
    } catch (err) {
      console.error('发送校验失败:', err);
      showToast('发送校验失败，请重试');
      return false;
    }
  }

  /**
   * 发送文字消息 ✅ 带校验
   */
  async sendTextMsg(text, toUserId) {
    const trimText = text.trim();
    if (!trimText || !toUserId) { showToast('消息内容不能为空'); return false; }
    const isAllow = await this.checkSendPolicy(trimText, toUserId);
    if (!isAllow) return false;

    try {
      const message = this.timInstance.createTextMessage({
        to: toUserId,
        conversationType: TIM_CONST.CONV_C2C,
        payload: { text: trimText }
      });
      await this.timInstance.sendMessage(message);
      return true;
    } catch (err) {
      console.error('文字消息发送失败:', err);
      showToast('文字消息发送失败');
      return false;
    }
  }

  /**
   * 发送图片消息 ✅ 带校验 + 自动上传COS
   */
  async sendImageMsg(toUserId) {
    if (!toUserId) { showToast('参数异常'); return false; }
    const isAllow = await this.checkSendPolicy('图片消息', toUserId);
    if (!isAllow) return false;

    try {
      const { tempFiles } = await uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      });
      console.log(tempFiles);
      
      if (!tempFiles.length) return false;
      const message = this.timInstance.createImageMessage({
        to: toUserId,
        conversationType: TIM_CONST.CONV_C2C,
        payload: { file: tempFiles[0] }
      });
      await this.timInstance.sendMessage(message);
      return true;
    } catch (err) {
      console.error('图片消息发送失败:', err);
      showToast('图片发送失败');
      return false;
    }
  }

  /**
   * 发送语音消息 ✅ 带校验 + 完整录音逻辑
   */
  async sendVoiceMsg(toUserId) {
    if (!toUserId) { showToast('参数异常'); return false; }
    const isAllow = await this.checkSendPolicy('语音消息', toUserId);
    if (!isAllow) return false;

    return new Promise((resolve) => {
      const recorderManager = uni.getRecorderManager();
      recorderManager.start({
        duration: CONFIG.VOICE_TIME_MAX * 1000,
        format: CONFIG.VOICE_FORMAT,
        sampleRate: 16000,
        numberOfChannels: 1
      });

      recorderManager.onStop(async (res) => {
        try {
          const message = this.timInstance.createSoundMessage({
            to: toUserId,
            conversationType: TIM_CONST.CONV_C2C,
            payload: { file: res }
          });
          await this.timInstance.sendMessage(message);
          showToast('语音发送成功');
          resolve(true);
        } catch (err) {
          console.error('语音消息发送失败:', err);
          showToast('语音发送失败');
          resolve(false);
        }
      });

      recorderManager.onError(() => {
        showToast('录音失败，请重试');
        resolve(false);
      });

      uni.$once('im_voice_stop', () => recorderManager.stop());
    });
  }

  /**
   * 发起音视频通话 ✅ TUICallKit完整集成
   * @param {String} toUserId 对方ID
   * @param {Boolean} isVideo true=视频 false=语音
   */
  async callUser(toUserId, isVideo = false) {
    if (!this.imStatus.isLogin || !toUserId || !this.callKitInstance) {
      showToast('请先完成IM登录');
      return false;
    }

    try {
      const { data: trtcData } = await tencentSigTrtc({ userId: this.imStatus.userId });
      if (!trtcData?.userSig) { showToast('音视频签名获取失败'); return false; }
      this.imStatus.trtcSig = trtcData.userSig;

      this.callKitInstance.call({
        userID: toUserId,
        type: isVideo ? 2 : 1,
        userSig: this.imStatus.trtcSig
      });
      return true;
    } catch (err) {
      console.error('发起通话失败:', err);
      showToast('通话发起失败，请重试');
      return false;
    }
  }

  /**
   * ✅ 新增：对外暴露TIM实例的【推荐方法】- 最稳妥，统一入口
   */
  getTimInstance() {
    return this.timInstance;
  }

  /**
   * ✅ 新增：对外暴露TUICallKit实例
   */
  getCallKitInstance() {
    return this.callKitInstance;
  }

  /**
   * 消息格式化处理
   */
  formatMessage(msgList) {
    if (!msgList.length) return [];
    return msgList.reverse().map(item => ({
      ...item,
      isSelf: item.from === this.imStatus.userId,
      time: this.formatMsgTime(item.time)
    }));
  }

  /**
   * 处理实时接收的新消息
   */
  handleNewMessage(newMsgList) {
    const formatMsg = this.formatMessage(newMsgList);
    this.chatCache.messageList.push(...formatMsg);
  }

  /**
   * 格式化消息时间
   */
  formatMsgTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return `${date.getHours().toString().padStart(2,0)}:${date.getMinutes().toString().padStart(2,0)}`;
  }

  /**
   * 退出IM登录
   */
  async loginOutIm() {
    if (this.timInstance && this.imStatus.isLogin) {
      await this.timInstance.logout();
    }
    this.imStatus.isLogin = false;
    this.imStatus.userId = '';
    this.imStatus.userSig = '';
    this.chatCache.messageList = [];
    this.chatCache.lastMsgSeq = '';
    uni.$emit('im_logout');
  }

  // 暴露状态和缓存
  getImStatus() { return { ...this.imStatus }; }
  getChatCache() { return { ...this.chatCache }; }
}

// 全局单例导出 + 异常兜底
let TencentImSdk = null;
try {
  TencentImSdk = new TencentIm();
} catch (err) {
  console.error('IM单例初始化失败:', err);
  TencentImSdk = {
    loginIm: () => { showToast('IM初始化异常'); return false; },
    getHistoryMessage: () => [],
    sendTextMsg: () => false,
    sendImageMsg: () => false,
    sendVoiceMsg: () => false,
    callUser: () => false,
    loginOutIm: () => {},
    getTimInstance: () => null,
    timInstance: null
  };
}

export { TencentImSdk };