/**
 * 腾讯云TUICallKit 一对一音视频通话封装 (Vue3 Setup+新版插件终极适配版)
 * 适配：Vue3 + uniapp + 腾讯云9035插件【最新版】 + @/common/api/consultant.js tencentSigTrtc接口
 * 核心修复：适配新版插件的callTUICallKit单一入口API，彻底解决【无init方法】报错
 * 接口要求：tencentSigTrtc入参 { expireSeconds, userId } 返回 {data:{userSig}}
 */
import { reactive } from 'vue'
import { tencentSigTrtc } from "@/common/api/consultant.js";

export function useTUICallKit() {
  // 响应式状态，替代this，Vue3组合式API规范
  const state = reactive({
    SDKAppID: '',
    userID: '',
    userSig: '',
    calleeUserID: '',
    callMediaType: 2, // 1=语音通话  2=视频通话
    tuiCallKit: null, // 新版插件实例
    expireSeconds: 86400, // UserSig有效期24小时，腾讯云推荐值
    eventCallback: null, // 保存事件监听回调，用于销毁
  })

  // 第一步：加载新版腾讯云插件（必走）
  const loadTuiCallKit = () => {
    const tuiCallKit = uni.requireNativePlugin('TencentCloud-TUICallKit');
    if (!tuiCallKit) {
      throw new Error('加载腾讯云插件失败，请检查是否已在uniapp后台安装9035云端插件');
    }
    // 新版插件唯一判断：是否存在【callTUICallKit】方法
    if (typeof tuiCallKit.callTUICallKit !== 'function') {
      throw new Error('当前插件非新版9035，或插件加载异常，请重新打包真机测试');
    }
    state.tuiCallKit = tuiCallKit;
    console.log('✅ 新版TUICallKit插件加载成功');
    return tuiCallKit;
  }

  // 第二步：调用你的接口获取UserSig签名 【完全保留你的逻辑，无任何修改】
  const getUserSig = async () => {
    try {
      const res = await tencentSigTrtc({
        expireSeconds: state.expireSeconds,
        userId: state.userID
      });
      if (res.data?.userSig) {
        state.userSig = res.data.userSig;
        console.log('✅ UserSig签名获取成功', state.userSig);
        return Promise.resolve();
      } else {
        throw new Error('UserSig获取失败：' + (res.msg || '接口返回数据异常'));
      }
    } catch (err) {
      throw new Error('签名接口请求失败：' + (err.message || '网络异常，请重试'));
    }
  }

  // 第三步：注册通话事件监听【新版插件专用写法】 对方占线/拒接/无人接听/通话接通/挂断 都在这里
  const watchCallEvent = () => {
    // 先销毁旧的监听，防止重复注册
    if (state.eventCallback) {
      state.tuiCallKit.callTUICallKit({
        action: 'offCallEvent',
        params: { callback: state.eventCallback }
      })
    }
    // 新版事件监听回调
    const callback = (event) => {
      console.log('📞 通话状态回调：', event);
      const { type, message } = event;
      // 通话状态码完全兼容旧版，无需修改业务逻辑
      switch (type) {
        case 1001: uni.showToast({ title: '对方正在通话中', icon: 'none', duration: 3000 }); break;
        case 1002: uni.showToast({ title: '对方无人接听', icon: 'none', duration: 3000 }); break;
        case 1003: uni.showToast({ title: '对方拒绝接听通话', icon: 'none', duration: 3000 }); break;
        case 2001: uni.showToast({ title: '通话已接通', icon: 'none', duration: 2000 }); break;
        case 2002: uni.showToast({ title: '通话已挂断', icon: 'none' }); destroy(); break;
        case 3001: uni.showToast({ title: '通话异常：' + message, icon: 'none' }); destroy(); break;
      }
    }
    state.eventCallback = callback;
    // 新版插件注册监听的方式
    state.tuiCallKit.callTUICallKit({
      action: 'onCallEvent',
      params: { callback }
    })
  }

  // 主方法：发起一对一音视频通话 【外部调用唯一入口，参数不变】
  const startCall = async (params) => {
    try {
      // 每次发起通话前，先销毁旧的资源，防止冲突
      destroy();
      // 参数赋值 + 容错处理
      const { SDKAppID, userID, calleeUserID, callMediaType, expireSeconds } = params;
      state.SDKAppID = SDKAppID;
      state.userID = userID;
      state.calleeUserID = calleeUserID;
      state.callMediaType = callMediaType || 2;
      state.expireSeconds = expireSeconds || state.expireSeconds;

      console.log('📤 开始发起通话参数：', params);

      // 1. 加载新版插件
      loadTuiCallKit();
      // 2. 获取签名
      await getUserSig();
      // 3. 注册通话事件监听
      watchCallEvent();
      // 4. 发起通话【新版插件核心：无需init，直接调用call，内部自动完成初始化】
      state.tuiCallKit.callTUICallKit({
        action: 'call', // 新版API：发起通话的动作标识
        params: {
          SDKAppID: Number(state.SDKAppID), // 强制转数字，腾讯云要求
          userID: state.userID,
          userSig: state.userSig,
          calleeUserID: state.calleeUserID,
          callMediaType: state.callMediaType,
          isFromGroup: false, // 一对一通话固定为false
        },
        callback: (res) => {
          if (res.code === 0) {
            console.log('✅ 通话已发起，等待对方接听');
          } else {
            uni.showToast({ title: '拨打失败：' + res.message, icon: 'none', duration: 3000 });
            destroy();
          }
        }
      })
      return Promise.resolve('发起通话成功');
    } catch (error) {
      console.error('❌ 发起通话失败', error);
      uni.showToast({ title: error.message, icon: 'none', duration: 3500 });
      destroy();
      return Promise.reject(error);
    }
  }

  // 主动挂断通话【新版插件写法】
  const hangupCall = () => {
    if (!state.tuiCallKit) return;
    state.tuiCallKit.callTUICallKit({
      action: 'hangup',
      params: {},
      callback: (res) => {
        if (res.code === 0) {
          console.log('✅ 已主动挂断通话');
        }
      }
    })
    destroy();
  }

  // 销毁插件资源+重置状态【重中之重，防止内存泄漏，Vue3必加】
  const destroy = () => {
    if (state.tuiCallKit && state.eventCallback) {
      // 销毁事件监听
      state.tuiCallKit.callTUICallKit({
        action: 'offCallEvent',
        params: { callback: state.eventCallback }
      })
    }
    // 重置所有状态
    state.tuiCallKit = null;
    state.userSig = '';
    state.calleeUserID = '';
    state.eventCallback = null;
    console.log('✅ 通话资源已全部销毁，状态重置完成');
  }

  // 向外暴露方法，供Vue3 setup调用
  return {
    startCall, // 发起通话
    hangupCall, // 挂断通话
    destroy, // 销毁资源
  }
}
