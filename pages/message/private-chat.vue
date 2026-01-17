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
    <scroll-view
      ref="scrollViewRef"
      scroll-y
      :style="{ height: `calc(100vh)`}"
      refresher-enabled="true"     
      :show-scrollbar="false" 
      :refresher-triggered="refresherTriggered" 
      @refresherrefresh="loadMoreHistory" 
      refresher-background="#f5f5f5"
      scroll-with-animation="true" 
      :refresher-threshold="80"  
      class="scroll-view"
      :scroll-top="scrollTop"
    >
      <view :class="isCompleteds ? 'history-loaded' : ''">
        <view>{{ isCompleteds ? "已经没有更多的历史消息" : "" }}</view>
      </view>
      <checkbox-group @change="selectMessages">
        <view v-for="(message, index) in messageList" :key="message.ID">
          <view v-if="shouldShowTime(index, messageList)" class="message-time">
            {{ formatMessageTime(message.clientTime) }}
          </view>
          <view class="message-item">
            <view class="message-item-right" v-if="message.flow === 'in'">
              <view class="right-content">
                <image :src="friend.avatar" />
                <view
                  v-if="message.type === 'TIMTextElem'"
                  class="text-content"
                  v-html="renderTextMessage(message)"
                />
                <image
                  v-if="message.type === 'TIMImageElem'"
                  :src="message.payload.imageInfoArray[0].imageUrl"
                  class="image-content"
                  />
              </view>
            </view>
            <view class="message-item-left" v-else>
              <view class="left-content">
                <view
                  v-if="message.type === 'TIMTextElem'"
                  class="text-content"
                  v-html="renderTextMessage(message)"
                />
                <image
                  v-if="message.type === 'TIMImageElem'"
                  :src="message.payload.imageInfoArray[0].imageUrl"
                  class="image-content"
                  />
                <image :src="currentUserAvatar" />
              </view>
            </view>
          </view>
        </view>
      </checkbox-group>
    </scroll-view>
    <view
      class="action-box"
      v-if="!videoPlayer.visible && !messageSelector.visible"
    >
      <view class="action-top">
        <view class="action-middle">
          <view class="action-item" @click="privateCall()">
            <uni-icons type="phone-filled" size="20" color="#00b275" class="icon-action" />
            立即倾诉
          </view>
          <view class="action-item">
            <uni-icons custom-prefix="iconfont" type="icon-yonghuming" size="15" color="#00b275" class="icon-action" />
            老师简介</view>
          <view class="action-item" @click="toComment">
            <uni-icons custom-prefix="iconfont" type="icon-dianziqingjiantianchong" size="15" color="#00b275" class="icon-action" />
            查看评论
          </view>
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
          <button 
            class="record-button"
            v-if="audioVisible"
            @touchstart="startRecordVoice" 
            @touchend="endRecordVoice"
            longpress="handlePauseRecord"
          >
            {{ isRecording ? '松开发送' : '长按录音' }}
          </button>
          <input
            v-else
            v-model="inputText"
            @confirm="sendText"
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
          <view v-if="inputText" class="send-btn-box">
            <text class="btn" @click="sendText()">发送</text>
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
            @click="sendImage"
            class="operation-icon"
            src="/static/message/picture.png"
          ></image>
          <view class="operation-title">图片</view>
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { onLoad } from "@dcloudio/uni-app";
import { TencentImSdk } from '@/utils/imSdk.js';
import { useGlobalDataStore } from "@/stores/global.js";
import { formatMessageTime, shouldShowTime } from './messageTimeUtils.js';
import EmojiDecoder from "@/lib/EmojiDecoder";

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");

// 下拉刷新状态
const refresherTriggered = ref(false);
const isLoadingMore = ref(false);

// 页面参数：获取聊天对象信息
const pages = getCurrentPages();
const currentPage = pages[pages.length - 1];
console.log(currentPage);
const toUserId = ref(''); 
const friend = ref({
  id: '',
  name: '',
  avatar: ''
});

onLoad((options) => {
  const { to, name, avatar } = options;
  toUserId.value = to || '';
  friend.value = {
    id: toUserId.value,
    name: name || '',
    avatar: avatar || ''
  };
})

// 响应式数据（替换原有逻辑）
const inputText = ref('');
const messageList = ref([]);
const scrollTop = ref(0); // 滚动条位置（保持到底部）
const isRecording = ref(false); // 是否正在录音

// 保留原有模板依赖的基础变量
const currentUserAvatar = ref(); 
const { avatar } = uni.getStorageSync("currentUser") || {};
currentUserAvatar.value = avatar;

const isCompleteds = ref(false); // 历史消息是否加载完成
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
const emoji = ref({
  url: emojiUrl,
  map: emojiMap,
  visible: false,
  decoder: new EmojiDecoder(emojiUrl, emojiMap),
});
const audioVisible = ref(false);
const otherTypesMessagePanelVisible = ref(false);
const videoPlayer = ref({ visible: false, url: "", context: null });
const messageSelector = ref({ messages: [], visible: false, ids: [] });

// 1. 页面挂载：拉取历史消息 + 监听新消息
onMounted(async () => {
  if (!toUserId.value) { // 3. 修改：使用toUserId.value判断
    uni.showToast({ title: '聊天对象ID不能为空', icon: 'none' });
    return;
  }
  // 拉取第一页历史消息
  await loadHistoryMessage();
  // 监听实时新消息
  uni.$on('im_message_received', handleNewMessage);
  // 监听IM登录状态（兜底）
  uni.$on('im_login_success', () => loadHistoryMessage());
  
  // 初始化视频播放器（保留原有模板依赖）
  videoPlayer.value.context = uni.createVideoContext("videoPlayer", currentPage);
});

// 2. 页面卸载：移除监听 + 清理资源
onUnmounted(() => {
  uni.$off('im_message_received', handleNewMessage);
  uni.$off('im_login_success');
  // 停止录音（防止离开页面后仍在录音）
  if (isRecording.value) {
    uni.$emit('im_voice_stop');
    isRecording.value = false;
  }
});

// 拉取历史消息
const loadHistoryMessage = async (isLoadMore = false) => {
  try {
    const list = await TencentImSdk.getHistoryMessage(toUserId.value, isLoadMore);
    if(isLoadMore){
      // 加载更多历史消息 
      messageList.value = [...list.reverse(), ...messageList.value];
    }else{
      // 首次加载
      messageList.value = list.reverse();
    }
    isCompleteds.value = list.length < 10;
    // 滚动到最新消息位置
    nextTick(() => {
      scrollTop.value = 999999;
    });
  } catch (error) {
    console.error('加载历史消息失败:', error);
    uni.showToast({ title: '加载消息失败', icon: 'none' });
    // 兜底：如果是加载更多触发的，关闭刷新动画
    if (isLoadMore) {
      refresherTriggered.value = false;
      isLoadingMore.value = false;
    }
  }
};

// 4. 加载更多历史消息（滚动到底部触发）
const loadMoreHistory = async () => {
  // 防止重复加载 + 无更多数据时直接返回
  if (isCompleteds.value || isLoadingMore.value) {
    refresherTriggered.value = false; // 强制关闭刷新动画
    return;
  }

  try {
    isLoadingMore.value = true;
    refresherTriggered.value = true; // 开启下拉加载动画
    await loadHistoryMessage(true);
  } catch (error) {
    console.error('加载更多历史消息失败:', error);
    uni.showToast({ title: '加载更多消息失败', icon: 'none' });
  } finally {
    refresherTriggered.value = false; // 无论成功/失败，都关闭加载动画
    isLoadingMore.value = false; // 释放加载锁
  }
};

// 处理实时接收的新消息
const handleNewMessage = (newMsgList) => {
  const targetMsg = newMsgList.filter(msg => msg.to === toUserId.value || msg.from === toUserId.value);
  if (targetMsg.length) {
    // 新消息直接追加到数组最后
    messageList.value.push(...TencentImSdk.formatMessage(targetMsg));
    nextTick(() => {
      scrollTop.value = 999999;
    });
  }
};

// 6. 发送文本消息（核心替换）
const sendText = async () => {
  if (!inputText.value.trim()) {
    uni.showToast({ title: '消息内容不能为空', icon: 'none' });
    return;
  }
  // 6. 修改：传递toUserId.value
  const isSuccess = await TencentImSdk.sendTextMsg(inputText.value, toUserId.value);
  if (isSuccess) {
    inputText.value = ''; // 清空输入框
    await loadHistoryMessage(); // 重新拉取历史消息
  } else {
    uni.showToast({ title: '消息发送失败', icon: 'none' });
  }
};

// 7. 发送图片消息（核心替换）
const sendImage = async () => {
  // 7. 修改：传递toUserId.value
  const isSuccess = await TencentImSdk.sendImageMsg(toUserId.value);
  if (isSuccess) {
    otherTypesMessagePanelVisible.value = false;
    await loadHistoryMessage();
  } else {
    uni.showToast({ title: '图片发送失败', icon: 'none' });
  }
};

// 8. 录制并发送语音消息（核心替换）
const startRecordVoice = async () => {
  if (isRecording.value) return;
  isRecording.value = true;
  uni.showToast({ title: '正在录音...', icon: 'none' });
  await TencentImSdk.sendVoiceMsg(toUserId.value);
};
const endRecordVoice = async () => {
  if (!isRecording.value) return;
  uni.$emit('im_voice_stop');
  isRecording.value = false;
  await loadHistoryMessage();
};


// 9. 播放语音消息（核心替换）
const playVoice = (fileUrl) => {
  const innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.src = fileUrl;
  innerAudioContext.play();
  innerAudioContext.onError((err) => {
    console.error('语音播放失败:', err);
    uni.showToast({ title: '语音播放失败', icon: 'none' });
  });
};

// 发起语音/视频通话
const callVoice = async () => {
  await TencentImSdk.callUser(toUserId.value, false); // false=语音
};
const callVideo = async () => {
  await TencentImSdk.callUser(toUserId.value, true); // true=视频
};

// 保留原有模板依赖的基础方法
const backFn = () => {
  uni.navigateBack({ delta: 1 });
};

const renderTextMessage = (message) => {
  return "<span>" + emoji.value.decoder.decode(message.payload.text) + "</span>";
};

const switchAudioKeyboard = () => {
  audioVisible.value = !audioVisible.value;
  if (audioVisible.value) {
    // 录音权限授权（保留原有逻辑）
    uni.authorize({
      scope: 'scope.record',
      success() {
        console.log("录音权限获取成功");
      },
      fail() {
        uni.showModal({
          title: "获取录音权限失败",
          content: "请先授权才能发送语音消息！",
        });
      }
    });
  }
};

const switchEmojiKeyboard = () => {
  emoji.value.visible = !emoji.value.visible;
  otherTypesMessagePanelVisible.value = false;
};

const showOtherTypesMessagePanel = () => {
  otherTypesMessagePanelVisible.value = !otherTypesMessagePanelVisible.value;
  emoji.value.visible = false;
};

const chooseEmoji = (emojiKey) => {
  inputText.value += emojiKey;
};

const privateCall = () => {
  uni.showActionSheet({
    itemList: ["视频通话", "音频通话"],
    success: (res) => {
      if (res.tapIndex === 0) {
        callVideo(); // 视频通话
      } else if (res.tapIndex === 1) {
        callVoice(); // 音频通话
      }
    },
    fail: (res) => {
      console.log(res.errMsg);
    },
  });
};

// 以下为保留的非核心方法（模板依赖）
const selectMessages = (e) => {
  const selectedMessageIds = e.detail.value;
  let selectedMessages = [];
  messageList.value.forEach((message) => {
    if (selectedMessageIds.includes(message.ID)) {
      selectedMessages.push(message);
    }
  });
  messageSelector.value.messages = selectedMessages;
};

const toComment = () => {
  console.log('跳转到评论页:', friend.value.id);
  // 保留原有跳转逻辑，如需启用请解开注释
  // uni.navigateTo({
  //   url: `pages/consult-feel/consult-feel?userId=${friend.value.id}`,
  // });
};

const chattingList = ref([
  { name: '备注', type: 'remark' },
  { name: '关注', type: 'attention' },
  { name: '置顶', type: 'top' },
  { name: '举报/投诉', type: 'report' },
  { name: '取消', type: 'cancel' },
]);
const popup = ref(null);
const chattingFunction = () => {
  popup.value?.open('bottom');
};
const selectChatting = (type) => {
  switch (type) {
    case 'remark':
      console.log('备注');
      break;
    case 'attention':
      console.log('关注');
      break;
    case 'top':
      uni.showToast({ title: '置顶功能已迁移至IM SDK', icon: 'none' });
      break;
    case 'report':
      uni.navigateTo({
        url: `/pages/settings/complaint?id=${friend.value.id}`
      });
      break;
    case 'cancel':
      popup.value?.close();
      break;
    default:
      break;
  }
  popup.value?.close();
};
// 补充：修复原代码中缺失的moreFn方法（模板中调用但未定义）
const moreFn = () => {
  console.log('更多按钮点击');
};
// 补充：修复原代码中缺失的handlePauseRecord方法（模板中调用但未定义）
const handlePauseRecord = () => {
  console.log('长按录音暂停');
};
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
    // 核心修复：
    padding: calc(#{$statusBarHeight} + 60rpx ) 0 150rpx; 
    z-index: 1;
    background-color: #f4f6f8;
    -webkit-overflow-scrolling: auto; /* 关闭iOS弹性滚动 */
    overflow-scrolling: auto;
    touch-action: pan-x; /* 仅允许横向滑动，禁止纵向下拉操作 */
    box-sizing: border-box;
    height: 100vh; // 确保scroll-view高度正确（原style里的height是calc(100vh)，这里显式确认）

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
          .image-content {
            margin-right: 20rpx;
            max-width: 300rpx;
            max-height: 300rpx;
            min-width: 200rpx;
            min-height: 200rpx;
            word-wrap: break-word;
            border-radius: 20rpx;
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
          .image-content {
            margin-right: 20rpx;
            max-width: 300rpx;
            max-height: 300rpx;
            min-width: 200rpx;
            min-height: 200rpx;
            word-wrap: break-word;
            border-radius: 20rpx;
          }
        }
      }
    }
  }
}
.message-item-left,
.message-item-right {
  padding: 20rpx;
}
.record-button{
  width: 100%;
  height: 70rpx;
  font-size: 25rpx;
  line-height: 70rpx;
  border-radius: 40px;
  margin: 20rpx;
	margin-left: 0;
  background: #fff;
  border: none;
}
.popup-content{
  display: flex;
  background-color: #fff;
  align-items: center;
  flex-direction: column;
  .popup-item{
    margin: 20rpx 0;
  }
}
.icon-action{
  margin-right: 10rpx;
}
</style>