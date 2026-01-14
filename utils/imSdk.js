/**
 * 腾讯云IM+TUICallKit音视频 全局封装类
 * Vue3 setup 全局挂载，uniapp全端适配
 */
import { tencentSigIm, tencentSigTrtc, checkPolicy } from "@/common/api/consultant.js";
import { showToast, showModal } from '@/utils/uniApi.js' // 自己的提示工具类，可替换为uni.showToast

// 腾讯云IM 全局实例
let timInstance = null;
// TUICallKit 音视频实例
let callKitInstance = null;
// IM登录状态
const imStatus = {
  isLogin: false, // 是否已登录IM
  userId: "",     // 当前登录用户ID
  userSig: "",    // IM签名
  trtcSig: ""     // 音视频签名
};
// 聊天核心缓存
const chatCache = {
  currentToUserId: "", // 当前聊天的对方用户ID
  messageList: [],     // 当前会话消息列表
  lastMsgSeq: 0        // 历史消息拉取游标，用于分页加载
};

// ===================== 常量配置 =====================
const CONFIG = {
  SDKAPPID: 你的腾讯云SDKAPPID, // 必填，你的腾讯云IM应用ID
  MSG_PAGE_SIZE: 20, // 历史消息每次拉取条数
  VOICE_TIME_MAX: 60, // 语音最大录制时长(秒)
  IM_TYPE: { // 消息类型常量
    TEXT: "TIMTextElem",
    IMAGE: "TIMImageElem",
    VOICE: "TIMSoundElem",
    CUSTOM: "TIMCustomElem"
  }
};

// ===================== 核心IM类 =====================
class TencentIm {
  constructor() {
    this.initIM(); // 初始化IM SDK
    this.initTUICallKit(); // 初始化音视频插件
  }

  /**
   * 1. 初始化腾讯云IM SDK
   */
  initIM() {
    const TIM = uni.requirePlugin('tim-js-sdk');
    timInstance = TIM.create({
      SDKAppID: CONFIG.SDKAPPID
    });
    // 设置SDK日志级别，线上可改为0
    timInstance.setLogLevel(1);
    // 注册IM全局事件监听（核心：实时消息、连接状态等）
    this.registerImEvent();
  }

  /**
   * 2. 初始化TUICallKit音视频插件 (你已导入的官方插件)
   */
  initTUICallKit() {
    callKitInstance = uni.requirePlugin('TencentCloud-TUICallKit');
    // 初始化插件配置
    callKitInstance.init({
      SDKAppID: CONFIG.SDKAPPID,
      timInstance: timInstance, // 共享IM实例，无需重复登录
    });
  }

  /**
   * 3. 注册IM全局事件监听 - 核心方法【实时接收消息/状态变更】
   */
  registerImEvent() {
    timInstance.on(timInstance.EVENT.MESSAGE_RECEIVED, (event) => {
      // 实时收到新消息，event.data 为消息数组
      const newMsgList = event.data;
      this.handleNewMessage(newMsgList);
      // 可通过uniapp全局事件总线，把消息抛给页面监听
      uni.$emit('im_message_received', newMsgList);
    });
    // 其他事件监听（按需添加）
    timInstance.on(timInstance.EVENT.SDK_READY, () => imStatus.isLogin = true);
    timInstance.on(timInstance.EVENT.SDK_NOT_READY, () => imStatus.isLogin = false);
    timInstance.on(timInstance.EVENT.KICKED_OUT, () => this.loginOutIm());
  }

  /**
   * 4. 用户登录成功后 -> 初始化并登录IM【核心入口】
   * @param {String} userId 登录成功后拿到的用户ID (必传)
   * @returns {Promise<Boolean>} 是否登录成功
   */
  async loginIm(userId) {
    if (!userId) return showToast('用户ID不能为空'), false;
    if (imStatus.isLogin) return true;
    
    try {
      // 1. 获取IM签名 (调用你的接口)
      const { data: imSigData } = await tencentSigIm({ userId });
      imStatus.userId = userId;
      imStatus.userSig = imSigData.userSig;

      // 2. 腾讯云IM官方登录方法
      await timInstance.login({
        userID: userId,
        userSig: imStatus.userSig
      });
      
      imStatus.isLogin = true;
      uni.$emit('im_login_success');
      return true;
    } catch (err) {
      imStatus.isLogin = false;
      showToast(`IM登录失败:${err.message || '签名异常'}`);
      return false;
    }
  }

  /**
   * 5. 拉取历史聊天记录【核心业务】
   * @param {String} toUserId 对方用户ID
   * @param {Boolean} isLoadMore 是否加载更多
   * @returns {Promise<Array>} 格式化后的消息列表
   */
  async getHistoryMessage(toUserId, isLoadMore = false) {
    if (!imStatus.isLogin || !toUserId) return [];
    chatCache.currentToUserId = toUserId;
    
    try {
      const params = {
        conversationID: `C2C${toUserId}`, // C2C单聊会话ID格式
        count: CONFIG.MSG_PAGE_SIZE,
        nextReqMessageID: isLoadMore ? chatCache.lastMsgSeq : ''
      };
      // 腾讯云IM拉取历史消息API
      const { data: { messageList, nextReqMessageID } } = await timInstance.getMessageList(params);
      
      chatCache.lastMsgSeq = nextReqMessageID;
      const formatMsg = this.formatMessageList(messageList);
      chatCache.messageList = isLoadMore ? [...chatCache.messageList, ...formatMsg] : formatMsg;
      return chatCache.messageList;
    } catch (err) {
      showToast('历史消息加载失败');
      return [];
    }
  }

  /**
   * 6. 发送消息前置校验【必须调用】- 你的checkPolicy接口封装
   * @param {String} content 消息内容
   * @param {String} toUserId 对方用户ID
   * @returns {Promise<Boolean>} 是否允许发送
   */
  async checkSendPolicy(content, toUserId) {
    const params = {
      content: content,
      expireSeconds: 0,
      fromUserId: imStatus.userId,
      ordered: true,
      toUserId: toUserId
    };
    try {
      const { data } = await checkPolicy(params);
      if (data.allowed) {
        return true;
      } else {
        // 校验不通过，根据limitType提示对应文案
        const tipText = {
          SENSITIVE: '消息包含敏感词，禁止发送',
          FREE_LIMIT: '未下单，消息发送次数已达上限',
          RATE_LIMIT: '发送频率过高，请稍后再试',
          COMPLAINT_RESTRICT: '你已被投诉，暂时禁止发送消息',
          BANNED: '账号已被封禁，无法发送消息'
        }[data.limitType] || data.message || '发送失败，权限校验不通过';
        showToast(tipText);
        return false;
      }
    } catch (err) {
      showToast('发送校验失败');
      return false;
    }
  }

  /**
   * 7. 发送文字消息【核心】- 带前置校验
   * @param {String} text 文字内容
   * @param {String} toUserId 对方用户ID
   * @returns {Promise<Boolean>}
   */
  async sendTextMsg(text, toUserId) {
    if (!text.trim() || !toUserId) return showToast('消息内容不能为空'), false;
    // 前置校验：调用checkPolicy，不通过直接返回
    const isAllow = await this.checkSendPolicy(text, toUserId);
    if (!isAllow) return false;

    try {
      // 创建文字消息实例
      const message = timInstance.createTextMessage({
        to: toUserId,
        conversationType: timInstance.CONV_C2C,
        payload: { text: text.trim() }
      });
      // 发送消息
      await timInstance.sendMessage(message);
      return true;
    } catch (err) {
      showToast('文字消息发送失败');
      return false;
    }
  }

  /**
   * 8. 发送图片消息【核心】- 带前置校验 + 自动上传腾讯云COS
   * @param {String} toUserId 对方用户ID
   * @returns {Promise<Boolean>}
   */
  async sendImageMsg(toUserId) {
    if (!toUserId) return showToast('参数异常'), false;
    const isAllow = await this.checkSendPolicy('图片消息', toUserId);
    if (!isAllow) return false;

    try {
      // 选择图片(压缩+原图可选)
      const { tempFiles } = await uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      });
      // 创建图片消息，SDK自动上传腾讯云，无需自己处理COS
      const message = timInstance.createImageMessage({
        to: toUserId,
        conversationType: timInstance.CONV_C2C,
        payload: { file: tempFiles[0] }
      });
      await timInstance.sendMessage(message);
      return true;
    } catch (err) {
      showToast('图片发送失败');
      return false;
    }
  }

  /**
   * 9. 发送语音消息【核心】- 带前置校验 + 录音+上传一体化
   * @param {String} toUserId 对方用户ID
   * @returns {Promise<Boolean>}
   */
  async sendVoiceMsg(toUserId) {
    if (!toUserId) return showToast('参数异常'), false;
    const isAllow = await this.checkSendPolicy('语音消息', toUserId);
    if (!isAllow) return false;

    return new Promise((resolve) => {
      const recorderManager = uni.getRecorderManager();
      // 录音配置
      recorderManager.start({
        duration: CONFIG.VOICE_TIME_MAX * 1000,
        format: 'mp3',
        sampleRate: 16000
      });
      // 录音结束回调
      recorderManager.onStop(async (res) => {
        try {
          const message = timInstance.createSoundMessage({
            to: toUserId,
            conversationType: timInstance.CONV_C2C,
            payload: { file: res }
          });
          await timInstance.sendMessage(message);
          showToast('语音发送成功');
          resolve(true);
        } catch (err) {
          showToast('语音发送失败');
          resolve(false);
        }
      });
      // 监听用户主动停止录音
      uni.$once('voice_stop', () => recorderManager.stop());
    });
  }

  /**
   * 10. 集成TUICallKit - 发起音视频通话【核心】
   * @param {String} toUserId 对方用户ID
   * @param {Boolean} isVideo 是否视频通话(true=视频，false=语音)
   * @returns {Promise<Boolean>}
   */
  async callUser(toUserId, isVideo = false) {
    if (!imStatus.isLogin || !toUserId) return showToast('请先登录IM'), false;
    try {
      // 获取音视频专属签名
      const { data: trtcData } = await tencentSigTrtc({ userId: imStatus.userId });
      imStatus.trtcSig = trtcData.userSig;
      
      // 调用TUICallKit发起通话 (完全适配你给的github插件)
      callKitInstance.call({
        userID: toUserId,
        type: isVideo ? 2 : 1, // 1=语音通话 2=视频通话
        userSig: imStatus.trtcSig
      });
      return true;
    } catch (err) {
      showToast('通话发起失败');
      return false;
    }
  }

  /**
   * 工具方法：消息格式化、IM登出、新消息处理等
   */
  formatMessageList(list) { /* 消息列表格式化，按需自定义，如时间/消息类型处理 */ return list.reverse(); }
  handleNewMessage(list) { /* 实时消息处理，追加到当前会话列表 */ chatCache.messageList.push(...list); }
  loginOutIm() { timInstance.logout(); imStatus.isLogin = false; uni.$emit('im_login_out'); }
  getImStatus() { return imStatus; }
  getChatCache() { return chatCache; }
}

// 全局导出单例，防止重复实例化
export const TencentImSdk = new TencentIm();