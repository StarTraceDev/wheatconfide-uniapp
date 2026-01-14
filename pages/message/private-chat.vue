<template>
  <view class="settled-box">
    <view class="header">
      <uni-nav-bar
        :class="scrollTop > 15 ? 'scrollClass' : ''"
        backgroundColor="rgba(255,255,255,0)"
        :border="false"
        leftWidth="300rpx"
        class="header-bar"
      >
        <template v-slot:left>
          <uni-icons type="left" size="24" @click="backFn"></uni-icons>
          <image :src="friend.avatar" style="width: 50rpx;height: 50rpx;border-radius: 50%;margin: 0 10rpx;" />
          <view>{{ friend.name }}</view>
        </template>
         <template v-slot:container>
        </template>
        <template v-slot:right>
          <view class="right" @click="chattingFunction">
            <uni-icons type="more-filled" size="30" @click="moreFn"></uni-icons>
          </view>
        </template>
      </uni-nav-bar>
      <view class=" uni-padding-wrap">
        <uni-icons type="info" size="15" color="#FF8F1F"></uni-icons>
        <view>为了保障您的合法权益，请不要脱离平台与老师私下联系、缴费。</view>
      </view>
    </view>
    <view class="scroll-view">
      <!-- <image
          v-if="history.loading"
          class="history-loaded"
          src="/static/message/loading.svg"
        /> -->
        
      <view :class="isCompleteds ? 'history-loaded' : ''">
        <view>{{ isCompleteds ? "已经没有更多的历史消息" : "" }}</view>
      </view>
      <checkbox-group @change="selectMessages">
        <view v-for="(message, index) in history.messages" :key="message.ID">
          <view v-if="shouldShowTime(index, history.messages)" class="message-time">
            {{ formatMessageTime(message.time) }}
          </view>
          <view class="message-item">
            <view class="message-item-right" v-if="message.flow === 'in'">
              <view class="right-content">
                <image :src="friend.avatar" />
                <view
                  v-if="message.type === 'TIMTextElem'"
                  class="text-content"
                  v-html="renderTextMessage(message)"
                ></view>
              </view>
            </view>
            <view class="message-item-left" v-else>
              <view class="left-content">
                <view
                  v-if="message.type === 'TIMTextElem'"
                  class="text-content"
                  v-html="renderTextMessage(message)"
                ></view>
                <image :src="currentUserAvatar" />
              </view>
            </view>
          </view>
        </view>
      </checkbox-group>
    </view>
    <view
      class="action-box"
      v-if="!videoPlayer.visible && !messageSelector.visible"
    >
      <view class="action-top">
        <view class="action-middle">
          <view class="action-item">立即倾诉</view>
          <view class="action-item">老师简介</view>
          <view class="action-item">查看评论</view>
        </view>
        <view class="action-bottom-box">
          <view @click="switchAudioKeyboard">
            <image
              class="more"
              v-if="audioVisible"
              src="/static/message/jianpan.png"
            ></image>
            <image class="more" v-else src="/static/message/audio.png"></image>
          </view>
          <view
            v-if="audioVisible"
            class="record-input"
            @touchend.stop="onRecordEnd"
            @touchstart.stop="onRecordStart"
          >
            {{ recorderManager.recording ? "松开发送" : "按住说话" }}
          </view>
          <input
            v-else
            v-model="text"
            @confirm="sendTextMessage"
            class="consult-input"
            maxlength="700"
            placeholder="发送消息"
            type="text"
          />
          <view @click="switchEmojiKeyboard">
            <image
              class="more"
              v-if="emoji.visible"
              src="/static/message/jianpan.png"
            ></image>
            <image class="more" v-else src="/static/message/emoji.png"></image>
          </view>
          <view>
            <image
              @click="showOtherTypesMessagePanel()"
              class="more"
              src="/static/message/more.png"
            />
          </view>
          <view v-if="text" class="send-btn-box">
            <text class="btn" @click="sendTextMessage()">发送</text>
          </view>
        </view>
      </view>
      <view class="action-bottom action-bottom-emoji" v-if="emoji.visible">
        <image
          class="emoji-item"
          v-for="(emojiItem, emojiKey, index) in emoji.map"
          :key="index"
          :src="emoji.url + emojiItem"
          @click="chooseEmoji(emojiKey)"
        ></image>
      </view>
      <view v-if="otherTypesMessagePanelVisible" class="action-bottom">
        <view class="more-icon">
          <image
            @click="sendImageMessage()"
            class="operation-icon"
            src="/static/message/picture.png"
          ></image>
          <view class="operation-title">图片</view>
        </view>
        <view class="more-icon">
          <image
            @click="privateCall()"
            class="operation-icon"
            src="/static/message/rtc.png"
          ></image>
          <view class="operation-title">视频通话</view>
        </view>
      </view>
    </view>
    <view
      class="action-popup"
      @touchmove.stop.prevent
      v-if="actionPopup.visible"
    >
      <view class="layer"></view>
      <view class="action-list">
        <view class="action-item" @click="deleteSingleMessage">删除</view>
        <view
          class="action-item"
          v-if="actionPopup.recallable"
          @click="recallMessage"
          >撤回</view
        >
        <view class="action-item" @click="showCheckBox">多选</view>
        <view class="action-item" @click="hideActionPopup">取消</view>
      </view>
    </view>
    <view class="messageSelector-box" v-if="messageSelector.visible">
      <image
        class="messageSelector-btn"
        @click="deleteMultipleMessages"
        src="/static/message/delete.png"
      ></image>
    </view>
    <view class="record-loading" v-if="recorderManager.recording"></view>
    <video
      v-if="videoPlayer.visible"
      :src="videoPlayer.url"
      id="videoPlayer"
      @fullscreenchange="onVideoFullScreenChange"
    ></video>
    <view v-if="orderList.visible" class="order-list">
      <view class="orders-content">
        <view class="title">
          <view>请选择一个订单</view>
          <view class="close" @click="hideOrderMessageList">×</view>
        </view>
        <view class="orders">
          <view
            v-for="(order, index) in orderList.orders"
            :key="index"
            class="order-item"
            @click="sendOrderMessage(order)"
          >
            <view class="order-id">订单号：{{ order.id }}</view>
            <view class="order-body">
              <image :src="order.url" class="order-img"></image>
              <view class="order-name">{{ order.name }}</view>
              <view class="order-right">
                <view class="order-price">{{ order.price }}</view>
                <view class="order-count">共{{ order.count }}件</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <uni-popup ref="popup" type="message">
      <view class="popup-content">
        <view 
          v-for="(item, index) in chattingList"
          :key="index"
          @click="selectChatting(item.type)"
          class="popup-item"
        >{{ item.name }}
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, reactive, nextTick, getCurrentInstance } from "vue";
import {
  onLoad,
  onShow,
  onReady,
  onUnload,
  onPullDownRefresh,
} from "@dcloudio/uni-app";
import { useGlobalDataStore } from "@/stores/global.js";
import EmojiDecoder from "@/lib/EmojiDecoder";
import restApi from "@/lib/restapi";
import TIM from "tim-js-sdk";
import { formatDate } from "@/lib/utils";
import RecorderManager from "@/lib/RecorderManager";
import { tencentSigIm, tencentSigTrtc, checkPolicy } from "@/common/api/consultant.js";
import { useTIM } from "@/utils/useTIM.js"; // 引入腾讯云TIM
import { formatMessageTime, shouldShowTime } from './messageTimeUtils.js';
import { useTUICallKit } from '@/utils/tencentCallKit.js'

// #ifdef APP-PLUS
const tuicallkit = uni.requireNativePlugin('TencentCloud-TUICallKit')
uni.showToast({ title: tuicallkit, icon: 'none' })
if (!tuicallkit) {
  // uni.showToast({ title: 'TUICallKit插件加载失败', icon: 'none' })
}
// #endif

// #ifndef APP-PLUS
uni.showToast({ title: '仅APP端支持原生插件', icon: 'none' })
// #endif

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const backFn = () => {
  uni.navigateBack({
    delta: 1,
  });
}
// 聊天文本框
const text = ref("");
let friend = null;
let conversationID = ""; // 腾讯云会话ID

// 从useTIM获取IM实例和相关方法
const {
  tim,
  isLogin,
  userId,
  sdkReady,
  checkLoginStatus,
  waitSDKReady,
  onTIMEvent,
} = useTIM("1600116083");

// 当前用户信息（实际项目中应从登录信息获取）
const currentUserAvatar = ref(); // 当前用户头像
let { avatar } = uni.getStorageSync("currentUser")
currentUserAvatar.value = avatar;
const instance = getCurrentInstance();
const IMAGE_MAX_WIDTH = 200;
const IMAGE_MAX_HEIGHT = 150;
const emojiUrl = "https://imgcache.qq.com/open/qcloud/tim/assets/emoji/";
const emojiMap = {
  "[么么哒]": "emoji_3@2x.png",
  "[乒乓]": "emoji_4@2x.png",
  "[便便]": "emoji_5@2x.png",
  "[信封]": "emoji_6@2x.png",
  "[偷笑]": "emoji_7@2x.png",
  "[傲慢]": "emoji_8@2x.png",
  "[咪咪]": "emoji_9@2x.png",
  "[咖啡]": "emoji_10@2x.png",
};
const recorderManager = reactive(new RecorderManager());

// 定义表情列表
const emoji = reactive({
  url: emojiUrl,
  map: emojiMap,
  visible: false,
  decoder: new EmojiDecoder(emojiUrl, emojiMap),
});

// 是否展示‘其他消息类型面板’
const otherTypesMessagePanelVisible = ref(false);
const orderList = reactive({
  orders: [],
  visible: false,
});
const history = reactive({
  messages: [],
  allLoaded: false,
  loading: true,
  nextReqMessageID: "", // 用于加载更多历史消息
});

const audioVisible = ref(false);
const innerAudioContext = uni.createInnerAudioContext();
const audioPlayer = reactive({
  audio: {},
  playingMessage: null,
});
const videoPlayer = reactive({
  visible: false,
  url: "",
  context: null,
});

// 展示消息删除弹出框
const actionPopup = reactive({
  visible: false,
  message: null,
  recallable: false,
});

// 消息选择
const messageSelector = reactive({
  messages: [],
  visible: false,
  ids: [],
});

onLoad((options) => {
  // 聊天对象
  let id = options.to;
  let name = options.name;
  friend = { id, name, avatar: options.avatar };
  // 初始化会话ID
  conversationID = `C2C${id}`;

  // 检查登录状态
  checkLoginStatus().then((loggedIn) => {
    if (loggedIn) {
      // 已登录，初始化监听器
      initialTIMListeners();
      initialAudioPlayer();
      initRecorderListeners();
      initTUICallKit();
    }
  });
  loadHistoryMessage(true);
  initialTIMLStates();
});

onShow(() => {
  otherTypesMessagePanelVisible.value = false;
  emoji.visible = false;
   if (isLogin.value && sdkReady.value) {
    initialTIMListeners();
  }
});

onReady(async () => {
  // 等待SDK就绪后加载历史消息
  if (isLogin.value && sdkReady.value) {
    loadHistoryMessage(true);
  }
  videoPlayer.context = uni.createVideoContext("videoPlayer", instance);
});
const isCompleteds = ref(false);
onPullDownRefresh(() => {
  console.log(
    1231231231231231231232131232
  );
  
  if (!isCompleteds.value) {
    loadHistoryMessage(true);
  } else {
    uni.stopPullDownRefresh();
  }
});

// 渲染文本消息，如果包含表情，替换为图片
function renderTextMessage(message) {
  return "<span>" + emoji.decoder.decode(message.payload.text) + "</span>";
}

// 像微信那样显示时间，如果有几分钟没发消息了，才显示时间
function renderMessageDate(message, index) {
  if (index === 0) {
    return formatDate(message.time);
  } else {
    if (message.time - history.messages[index - 1].time > 5 * 60 * 1000) {
      return formatDate(message.time);
    }
  }
  return "";
}
const { EVENT: TIM_EVENT } = TIM
const initialTIMListeners = () => {
  // 强制校验 tim 实例是否存在，不存在则初始化
  if (!tim.value) {
    console.warn('TIM 实例未初始化，跳过事件监听注册');
    return;
  }

  // 改用导入的 TIM_EVENT 常量，避免依赖 tim.value.EVENT
  const { MESSAGE_RECEIVED, MESSAGE_REVOKED, MESSAGE_READ_BY_PEER } = TIM_EVENT;

  // 先移除旧监听（避免重复注册）
  tim.value.off(MESSAGE_RECEIVED, onMessageReceived);
  tim.value.off(MESSAGE_REVOKED, onMessageRevoked);
  tim.value.off(MESSAGE_READ_BY_PEER, onMessageReadByPeer);

  // 注册监听（使用修复后的 onTIMEvent + 导入的常量）
  onTIMEvent(MESSAGE_RECEIVED, onMessageReceived);
  onTIMEvent(MESSAGE_REVOKED, onMessageRevoked);
  onTIMEvent(MESSAGE_READ_BY_PEER, onMessageReadByPeer);

  // 监听SDK就绪状态变化（同样改用导入的常量）
  onTIMEvent(TIM_EVENT.SDK_READY, () => {
    console.log("SDK 就绪，加载历史消息 + 确保事件监听生效");
    loadHistoryMessage(true);
  });
};

const initialTIMLStates = () => {
  let promise = tim.value.getUserStatus({userIDList: [friend.id]});
}

const onMessageReceived = (event) => {
  console.log("[实时消息事件触发]", event.data, "当前会话ID：", conversationID);
  if (!event.data || !Array.isArray(event.data)) {
    console.warn("消息数据格式异常", event);
    return;
  }
  const newMessages = event.data;
  newMessages.forEach((message) => {
    // 严格匹配会话ID（区分C2C/群聊）
    if (message.conversationID === conversationID) {
      console.log("[收到当前会话消息]", message);
      // 避免重复添加（极端情况SDK重复推送）
      const isDuplicate = history.messages.some(m => m.ID === message.ID);
      if (!isDuplicate) {
        history.messages.push(message);
        scrollToBottom();
        markMessageAsRead(message);
      }
    }
  });
};

function onMessageRevoked(event) {
  const revokedMessage = event.data[0];
  const index = history.messages.findIndex(
    (msg) => msg.ID === revokedMessage.ID
  );
  if (index !== -1) {
    history.messages.splice(index, 1, revokedMessage);
  }
}

function onMessageReadByPeer(event) {
  const { conversationID: convID, readTime } = event.data;
  if (convID === conversationID) {
    history.messages.forEach((message) => {
      if (message.from === userId && message.time <= readTime) {
        message.read = true;
      }
    });
  }
}

function initialAudioPlayer() {
  innerAudioContext.onEnded(() => {
    audioPlayer.playingMessage = null;
  });
  innerAudioContext.onStop(() => {
    audioPlayer.playingMessage = null;
  });
}

const initRecorderListeners = () => {
  recorderManager.onRecordComplete((file, duration) => {
    if (duration < 1000) {
      uni.showToast({
        icon: "none",
        title: "录音时间太短",
        duration: 500,
      });
      return;
    }

    // 发送语音消息
    sendSoundMessage(file, duration);
  });
}

/**
 * 发送语音消息
 */
const sendSoundMessage = async (file, duration) =>{
  const canSend = await checkMessagePolicy();
  if (!canSend) return;
  try {
    // 等待SDK就绪
    await waitSDKReady();

    const message = tim.value.createSoundMessage({
      to: friend.id,
      soundBase64: file.base64,
      fileSize: file.size,
      duration: Math.round(duration),
    });

    sendMessage(message);
  } catch (err) {
    console.error("创建语音消息失败:", err);
  }
}

/**
 * 计算图片高度
 */
function getImageHeight(width, height) {
  if (width < IMAGE_MAX_WIDTH && height < IMAGE_MAX_HEIGHT) {
    return height * 2;
  } else if (width > height) {
    return (IMAGE_MAX_WIDTH / width) * height * 2;
  } else if (width === height || width < height) {
    return IMAGE_MAX_HEIGHT * 2;
  }
}

/**
 * 发送消息通用方法
 */
async function sendMessage(message) {
  try {
    // 等待SDK就绪
    await waitSDKReady();

    // 添加到消息列表，状态为发送中
    message.status = "sending";
    history.messages.push(message);
    scrollToBottom();

    // 发送消息
    const { data: { message: sentMessage }} = await tim.value.sendMessage(message);

    // 发送成功，更新消息状态
    const index = history.messages.findIndex((m) => m.ID === sentMessage.ID);
    if (index !== -1) {
      history.messages.splice(index, 1, sentMessage);
    }
  } catch (imError) {
    console.warn("sendMessage error:", imError);
    // 发送失败，更新消息状态
    const index = history.messages.findIndex((m) => m.ID === message.ID);
    if (index !== -1) {
      history.messages[index].status = "fail";
    }
  }
}

/**
 * 发送文本消息
 */
const sendTextMessage = async () => {
  // const canSend = await checkMessagePolicy(text.value);
  // if (!canSend) return

  try {
    // 1. 创建文本消息
    const message = tim.value.createTextMessage({
      to: friend.id, // 接收方 ID（单聊传用户 ID，群聊传群 ID）
      conversationType: TIM.TYPES.CONV_C2C, // 会话类型：单聊为 TIM.TYPES.CONV_C2C，群聊为 TIM.TYPES.CONV_GROUP
      payload: {
        text: text.value,
      },
      // 可选参数：如消息自定义数据等
      // cloudCustomData: '自定义数据'
    });
    await sendMessage(message);
    text.value = '';
  } catch (error) {
    console.error("发送文本消息失败:", error);
  }
};

/**
 * 发送图片消息
 */
const sendImageMessage = async () => {
  try {
    const canSend = await checkMessagePolicy();
    if (!canSend) return;
    // 等待SDK就绪
    await waitSDKReady();

    uni.chooseImage({
      count: 9,
      success: (res) => {
        res.tempFiles.forEach((file) => {
          uni.getFileSystemManager().readFile({
            filePath: file.path,
            encoding: "base64",
            success: async (fileRes) => {
              const message = tim.value.createImageMessage({
                to: friend.id,
                imageBase64: fileRes.data,
                fileName: file.name,
                fileSize: file.size,
              });

              await sendMessage(message);
              otherTypesMessagePanelVisible.value = false;
            },
          });
        });
      },
    });
  } catch (err) {
    console.error("发送图片消息失败:", err);
  }
}

/**
 * 发送订单消息（自定义消息）
 */
async function sendOrderMessage(order) {
  try {
    // 等待SDK就绪
    await waitSDKReady();

    const message = tim.value.createCustomMessage({
      to: friend.id,
      data: JSON.stringify({
        type: "order",
        ...order,
      }),
      description: "订单消息",
      extension: "",
    });

    await sendMessage(message);
    orderList.visible = false;
    otherTypesMessagePanelVisible.value = false;
  } catch (err) {
    console.error("发送订单消息失败:", err);
  }
}

/**
 * 显示消息操作弹窗
 */
function showActionPopup(message) {
  const MAX_RECALLABLE_TIME = 3 * 60 * 1000; // 3分钟以内的消息才可以撤回
  messageSelector.messages = [message];

  if (
    Date.now() - message.time < MAX_RECALLABLE_TIME &&
    message.from === userId &&
    message.status === "success"
  ) {
    actionPopup.recallable = true;
  } else {
    actionPopup.recallable = false;
  }

  actionPopup.visible = true;
  actionPopup.message = message;
}

/**
 * 隐藏消息操作弹窗
 */
function hideActionPopup() {
  actionPopup.visible = false;
  actionPopup.message = null;
}

/**
 * 删除单条消息
 */
function deleteSingleMessage() {
  uni.showModal({
    content: "确认删除？",
    success: (res) => {
      actionPopup.visible = false;
      if (res.confirm) {
        deleteMessage();
      }
    },
  });
}

/**
 * 删除多条消息
 */
function deleteMultipleMessages() {
  if (messageSelector.messages.length > 0) {
    uni.showModal({
      content: "确认删除？",
      success: (res) => {
        messageSelector.visible = false;
        if (res.confirm) {
          deleteMessage();
        }
      },
    });
  }
}

/**
 * 删除消息
 */
async function deleteMessage() {
  try {
    // 等待SDK就绪
    await waitSDKReady();

    const messageIDs = messageSelector.messages.map((msg) => msg.ID);

    await tim.value.deleteMessage(messageIDs);

    // 从本地消息列表中移除
    messageSelector.messages.forEach((message) => {
      const index = history.messages.findIndex((m) => m.ID === message.ID);
      if (index > -1) {
        history.messages.splice(index, 1);
      }
    });
    messageSelector.messages = [];
  } catch (imError) {
    console.warn("deleteMessage error:", imError);
  }
}

/**
 * 撤回消息
 */
async function recallMessage() {
  actionPopup.visible = false;

  try {
    // 等待SDK就绪
    await waitSDKReady();

    await tim.value.revokeMessage(actionPopup.message.ID);
    console.log("撤回成功");
  } catch (imError) {
    console.warn("撤回失败:", imError);
    uni.showToast({
      title: "撤回失败",
      icon: "none",
    });
  }
}

/**
 * 编辑撤回的消息
 */
function editRecalledMessage(content) {
  if (audioVisible.value) {
    audioVisible.value = false;
  }
  text.value = content;
}

/**
 * 显示多选框
 */
function showCheckBox() {
  messageSelector.messages = [];
  messageSelector.visible = true;
  actionPopup.visible = false;
}

/**
 * 选择消息
 */
function selectMessages(e) {
  const selectedMessageIds = e.detail.value;
  let selectedMessages = [];
  history.messages.forEach((message) => {
    if (selectedMessageIds.includes(message.ID)) {
      selectedMessages.push(message);
    }
  });
  messageSelector.messages = selectedMessages;
}

/**
 * 加载历史消息
 */
 const loadHistoryMessage = async(isScrollToBottom) => {
  history.loading = true;
  try {
    // 等待SDK就绪
    await waitSDKReady();
    const count = 10;
    const options = {
      conversationID,
      count,
    };
    // 如果有下一页，添加nextReqMessageID
    if (history.nextReqMessageID) {
      options.nextReqMessageID = history.nextReqMessageID;
    }
    const { data } = await tim.value.getMessageList(options);
    uni.stopPullDownRefresh();
    history.loading = false;

    const { messageList, nextReqMessageID, isCompleted } = data;

    isCompleteds.value = isCompleted;
    if (messageList.length === 0) {
      history.allLoaded = true;
      return;
    }

    // 下拉加载更多时，将新消息添加到前面
    if (history.nextReqMessageID) {
      history.messages = [...messageList, ...history.messages];
    } else {
      history.messages = messageList;
    }

    // 更新下一页消息ID
    history.nextReqMessageID = nextReqMessageID;

    // 如果返回的消息数量小于请求数量，说明没有更多消息了
    if (messageList.length < count) {
      history.allLoaded = true;
    }

    if (isScrollToBottom) {
      scrollToBottom();
      // 标记已读
      markConversationAsRead();
    }
  } catch (imError) {
    console.warn("getMessageList error:", imError);
    uni.stopPullDownRefresh();
    history.loading = false;
  }
}

/**
 * 切换语音和键盘输入
 */
function switchAudioKeyboard() {
  audioVisible.value = !audioVisible.value;
  if (audioVisible.value) {
    recorderManager
      .authorize()
      .then(() => {
        console.log("录音权限获取成功");
      })
      .catch((err) => {
        console.log("err:", err);
        uni.showModal({
          title: "获取录音权限失败",
          content: "请先授权才能发送语音消息！",
        });
      });
  }
}

/**
 * 开始录音
 */
function onRecordStart() {
  recorderManager.start();
}

/**
 * 结束录音
 */
function onRecordEnd() {
  recorderManager.stop();
}

/**
 * 全屏显示图片
 */
function showImageFullScreen(e) {
  let imagesUrl = [e.currentTarget.dataset.url];
  uni.previewImage({
    urls: imagesUrl,
  });
}

/**
 * 播放视频
 */
function playVideo(e) {
  videoPlayer.visible = true;
  videoPlayer.url = e.currentTarget.dataset.url;
  nextTick(() => {
    videoPlayer.context.requestFullScreen({
      direction: 0,
    });
    videoPlayer.context.play();
  });
}

/**
 * 播放音频
 */
function playAudio(audioMessage) {
  let playingMessage = audioPlayer.playingMessage;

  if (playingMessage) {
    innerAudioContext.stop();
    // 如果点击的消息正在播放，就认为是停止播放操作
    if (playingMessage.ID === audioMessage.ID) {
      return;
    }
  }

  audioPlayer.playingMessage = audioMessage;
  innerAudioContext.src = audioMessage.payload.url;
  innerAudioContext.play();
}

/**
 * 视频全屏变化事件
 */
function onVideoFullScreenChange(e) {
  // 当退出全屏播放时，隐藏播放器
  if (videoPlayer.visible && !e.detail.fullScreen) {
    videoPlayer.visible = false;
    videoPlayer.context.stop();
  }
}

/**
 * 切换表情键盘
 */
function switchEmojiKeyboard() {
  emoji.visible = !emoji.visible;
  otherTypesMessagePanelVisible.value = false;
}

/**
 * 显示其他类型消息面板
 */
function showOtherTypesMessagePanel() {
  otherTypesMessagePanelVisible.value = !otherTypesMessagePanelVisible.value;
  emoji.visible = false;
}

/**
 * 选择表情
 */
function chooseEmoji(emojiKey) {
  text.value += emojiKey;
}

/**
 * 私人通话
 */
const privateCall = () => {
  uni.showActionSheet({
    itemList: ["视频通话", "音频通话"],
    success: (res) => {
      if (res.tapIndex === 0) {
        // 视频通话
        // startCall(true);
        videoCalling(2);
        
      } else if (res.tapIndex === 1) {
        // 音频通话
        // startCall(false);
        videoCalling(1);
      }
    },
    fail: (res) => {
      console.log(res.errMsg);
    },
  });
}



const { startCall, hangupCall, destroy } = useTUICallKit()


// const videoCalling = (val) => {
//   const currentUser = uni.getStorageSync("currentUser")
//   tencentCallKit.startCall({
//     SDKAppID: 1600116083,
//     userID: currentUser.id,
//     calleeUserID: friend.id,
//     callMediaType: val // 2=视频通话
//   });
// }

const videoCalling = async (val) => {
  const currentUser = uni.getStorageSync("currentUser")
  console.log({
      SDKAppID: '1600116083',
      userID: currentUser.id,
      calleeUserID: friend.id,
      callMediaType: val // 视频通话
    });
  
  try {
    const currentUser = uni.getStorageSync("currentUser")
    await startCall({
      SDKAppID: '1600116083',
      userID: currentUser.id,
      calleeUserID: friend.id,
      callMediaType: val // 视频通话
    })
  } catch (err) {
    console.error('发起通话失败', err)
  }
}



/**
 * 滚动到底部
 */
function scrollToBottom() {
  nextTick(() => {
    uni.pageScrollTo({
      scrollTop: 2000000,
      duration: 0,
    });
  });
}

/**
 * 标记会话为已读
 */
async function markConversationAsRead() {
  try {
    // 等待SDK就绪
    await waitSDKReady();

    await tim.value.setMessageRead({ conversationID });
    console.log("标记会话已读成功");
  } catch (imError) {
    console.warn("标记会话已读失败:", imError);
  }
}

/**
 * 标记单条消息为已读
 */
async function markMessageAsRead(message) {
  if (message.from !== userId) {
    try {
      // 等待SDK就绪
      await waitSDKReady();

      await tim.value.setMessageRead({
        conversationID,
        messageID: message.ID,
      });
    } catch (imError) {
      console.warn("标记消息已读失败:", imError);
    }
  }
}

/**
 * 检查消息发送权限
 * @param {string} content - 消息内容，非文本消息可为空
 * @returns {boolean} 是否允许发送
 */
async function checkMessagePolicy(content = "") {
  try {
    const currentUser = uni.getStorageSync("currentUser");
    if (!currentUser || !currentUser.id || !friend || !friend.id) {
      uni.showToast({ title: "用户信息不完整", icon: "none" });
      return false;
    }
    
    // 构造请求参数
    const params = {
      fromUserId: currentUser.id,
      toUserId: friend.id,
      content: content,
      ordered: false, // 根据实际业务逻辑确定是否已下单
      // expireSeconds: 1 // 可选参数，根据需要添加
    };
    
    // 调用检查接口
    const { data, code } = await checkPolicy(params);
    
    // 处理接口返回结果
    if (code !== 0) {
      uni.showToast({ title: data.msg || "检查失败", icon: "none" });
      return false;
    }
    
    if (!data.allowed) {
      // 根据不同限制类型显示对应提示
      let message = data.message || "发送消息失败";
      if (!message) {
        switch(data.limitType) {
          case "SENSITIVE":
            message = "消息包含敏感词，请修改后重试";
            break;
          case "FREE_LIMIT":
            message = `未下单，剩余免费条数: ${data.remainFreeMessages}`;
            break;
          case "RATE_LIMIT":
            message = `发送频率过高，请稍后再试`;
            break;
          case "COMPLAINT_RESTRICT":
            message = "因被投诉，您的消息发送受到限制";
            break;
          case "BANNED":
            message = "您已被封禁，无法发送消息";
            break;
          default:
            message = "不允许发送消息";
        }
      }
      uni.showToast({ title: message, icon: "none" });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("检查消息发送权限失败:", error);
    uni.showToast({ title: "检查权限失败", icon: "none" });
    return false;
  }
}

// ================== 聊天操作 ==================
const chattingList = reactive([
   { name: '备注', type: 'remark' },
   { name: '关注', type: 'attention' },
   { name: '置顶', type: 'top' },
   { name: '举报/投诉', type: 'report' },
   { name: '取消', type: 'cancel' },
])
const popup = ref(null);
const chattingFunction = () => {
  popup.value.open('bottom')
}
const selectChatting = (item) => {
  switch (item) {
    case 'remark':
      console.log('remark')
      break;
    case 'attention':
      console.log('attention')
      break;
    case 'top':
      let promise = tim.value.pinConversation({
        conversationID,
        isPinned: true,
      });
      promise.then(() => {
        uni.showToast({
          title: "置顶成功",
          icon: "none",
        });
      })
      break;
    case 'report':
      uni.navigateTo({
        url: `/pages/settings/complaint?id=${friend.id}`
      })
      break;
    case 'cancel':
      popup.value.close()
      break;
    default:
      break;
  }
  popup.value.close()
}

// 动态申请Android权限
const requestPermissions = async () => {
  return new Promise((resolve, reject) => {
    // #ifdef APP-PLUS
    // 定义需要申请的权限列表（对应清单中的危险权限）
    const permissions = [
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO'
    ]

    plus.android.requestPermissions(permissions, (result) => {
      // 检查所有权限是否都被授予
      const allGranted = result.every(item => item.granted)
      if (allGranted) {
        resolve(true)
      } else {
        // 存在权限被拒绝
        uni.showToast({
          title: '请授予相机和麦克风权限，否则无法使用通话功能',
          icon: 'none',
          duration: 3000
        })
        reject(false)
      }
    }, (error) => {
      uni.showToast({ title: '权限申请失败：' + error.message, icon: 'none' })
      reject(false)
    })
    // #endif
    // #ifndef APP-PLUS
    resolve(true) // 非App端直接返回成功
    // #endif
  })
}

const initTUICallKit = async () => {
  if (!tuicallkit) return;
  
  try {
    const hasPermission = await requestPermissions()
    
    if (!hasPermission) return;

    // 获取当前用户信息
    const currentUser = uni.getStorageSync("currentUser");
    if (!currentUser || !currentUser.id) {
      uni.showToast({ title: "请先登录", icon: "none" });
      return false;
    }
    
    // 获取TRTC签名
    const { data } = await tencentSigTrtc({ userId: currentUser.id });
    if (!data.userSig) {
      uni.showToast({ title: "获取通话签名失败", icon: "none" });
      return false;
    }
    
    // 初始化TUICallKit
    const result = tuicallkit.init({
      sdkAppID: 1600116083, // 替换为你的SDKAppID
      userId: currentUser.id,
      userSig: data.userSig
    });
    
    if (result.code === 0) {
      console.log("TUICallKit初始化成功");
      setupTUICallKitListener();
      return true;
    } else {
      console.error("TUICallKit初始化失败:", result.msg);
      uni.showToast({ title: "初始化通话失败", icon: "none" });
      return false;
    }
  } catch (error) {
    console.error("初始化通话异常:", error);
    uni.showToast({ title: "初始化通话异常", icon: "none" });
    return false;
  }
};
// 设置TUICallKit监听事件
const setupTUICallKitListener = () => {
  if (!tuicallkit) return;
  tuicallkit.setListener((event) => {
    switch (event.type) {
      case 'callReceived':
        // 收到来电
        handleIncomingCall(event.data);
        break;
      case 'callBegin':
        // 通话开始
        uni.showToast({ title: "通话开始", icon: "none" });
        break;
      case 'callEnd':
        // 通话结束
        uni.showToast({ title: `通话结束，时长${event.data.duration}秒`, icon: "none" });
        break;
      case 'callFailed':
        // 通话失败
        uni.showToast({ title: `通话失败: ${event.data.message}`, icon: "none" });
        break;
      case 'userEnter':
        // 用户加入通话
        break;
      case 'userLeave':
        // 用户离开通话
        break;
    }
  });
};
// 处理来电
const handleIncomingCall = (data) => {
  if (!tuicallkit) return;
  
  uni.showModal({
    title: `收到${data.callType === 1 ? '视频' : '语音'}通话`,
    content: `来自 ${data.caller} 的通话`,
    showCancel: true,
    confirmText: '接听',
    cancelText: '挂断',
    success: (res) => {
      if (res.confirm) {
        // 接听通话
        tuicallkit.accept({
          callID: data.callID
        });
      } else if (res.cancel) {
        // 拒绝通话
        tuicallkit.reject({
          callID: data.callID
        });
      }
    }
  });
};
// 发起通话
// const startCall = async (isVideoCall) => {
//   if (!tuicallkit) {
//     uni.showToast({ title: 'TUICallKit插件未加载', icon: 'none' });
//     return;
//   }
  
//   // 确保TUICallKit已初始化
//   const initialized = await initTUICallKit();
//   if (!initialized) return;
  
//   if (!friend || !friend.id) {
//     uni.showToast({ title: "获取通话对象失败", icon: "none" });
//     return;
//   }
  
//   try {
//     // 发起通话
//     const result = tuicallkit.call({
//       userID: friend.id, // 被叫用户ID
//       callType: isVideoCall ? 1 : 0, // 1: 视频通话, 0: 语音通话
//     });
    
//     if (result.code === 0) {
//       console.log(`${isVideoCall ? '视频' : '语音'}通话发起成功`);
//     } else {
//       console.error(`通话发起失败:`, result.msg);
//       uni.showToast({ title: `通话发起失败`, icon: "none" });
//     }
//   } catch (error) {
//     console.error("发起通话异常:", error);
//     uni.showToast({ title: "发起通话异常", icon: "none" });
//   }
// };

onUnload(() => {
  // 停止播放音频
  innerAudioContext.stop();
  if (tuicallkit) {
    // 退出通话
    tuicallkit.hangupAll();
    // 移除监听
    tuicallkit.removeListener();
  }
  // 移除TIM事件监听
  if (tim.value) {
    tim.value.off(tim.value.EVENT.MESSAGE_RECEIVED, onMessageReceived);
    tim.value.off(tim.value.EVENT.MESSAGE_REVOKED, onMessageRevoked);
    tim.value.off(tim.value.EVENT.MESSAGE_READ_BY_PEER, onMessageReadByPeer);
  }
  destroy();
});
</script>

<style>
@import url("@/static/style/chatInterface.css");
</style>
<style lang="scss" scoped>
.settled-box {
  $statusBarHeight: v-bind(statusBarHeight);
  width: 100vw;
  padding-bottom: 30rpx;

  .header {
    position: fixed;
    width: 100vw;
    height: 88rpx;
    z-index: 9999;
    background-color: #fff;

    .header-bar {
      padding-top: calc($statusBarHeight - 122rpx);
      background-color: #fff;
      ::v-deep(.uni-nav-bar-text) {
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
      }
    }
    .uni-padding-wrap{
      width: 100%;
      display: flex;
      font-size: 20rpx;
      color: #FF8F1F;
      padding: 10rpx 30rpx;
      align-items: center;
      background-color: #FDF6DE;
    }
  }
  .scrollClass {
    background-color: #fff;
    box-shadow: 0rpx 4rpx 20rpx rgba(0, 0, 0, 0.1);
    ::v-deep(.uni-nav-bar-text) {
      color: #000;
    }
  }
  .scroll-view {
    padding-top: calc($statusBarHeight + 20rpx);
    z-index: 1;
    background-color: #f4f6f8;
    min-height: 100vh;
    .history-loaded {
      text-align: center;
      color: #999;
      font-size: 24rpx;
      padding: 20rpx 0;
    }
    .message-item {
      &-right {
        display: flex;
        align-items: center;
        margin: 20rpx 0;
        .right-content {
          display: flex;
          image {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
          }
          .text-content {
            background-color: #fff;
            padding: 20rpx;
            border-radius: 0rpx 20rpx 20rpx 20rpx;
            margin-left: 20rpx;
            max-width: 500rpx;
            word-wrap: break-word;
          }
        }
      }
      &-left {
        display: flex;
        justify-content: flex-end;
        margin: 20rpx 0;
        .left-content {
          display: flex;
          image {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
          }
          .text-content {
            background-color: #8fff6e;
            padding: 20rpx;
            border-radius: 20rpx 0rpx 20rpx 20rpx;
            margin-right: 20rpx;
            max-width: 500rpx;
            word-wrap: break-word;
          }
        }
      }
    }
  }
}
</style>
