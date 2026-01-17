<template>
  <view class="chat-page">
    <!-- 消息列表 -->
    <scroll-view 
      class="msg-list" 
      scroll-y 
      :scroll-top="scrollTop"
      @scrolltolower="loadMoreHistory"
    >
      <view 
        class="msg-item" 
        :class="{ self: item.isSelf }"
        v-for="(item, index) in messageList" 
        :key="index"
      >
        <!-- 文本消息 -->
        <view v-if="item.type === 'TIMTextElem'" class="msg-content">
          {{ item.payload.text }}
        </view>
        <!-- 图片消息 -->
        <image 
          v-if="item.type === 'TIMImageElem'" 
          class="msg-img" 
          :src="item.payload.imageInfoArray[0].url"
          mode="widthFix"
        ></image>
        <!-- 语音消息 -->
        <view 
          v-if="item.type === 'TIMSoundElem'" 
          class="msg-voice"
          @click="playVoice(item.payload.fileUrl)"
        >
          语音消息 {{ item.payload.duration }}秒
        </view>
        <view class="msg-time">{{ item.time }}</view>
      </view>
    </scroll-view>

    <!-- 操作栏 -->
    <view class="chat-footer">
      <!-- 文本输入框 -->
      <input 
        v-model="inputText" 
        class="input-text" 
        placeholder="请输入消息"
      />
      <!-- 功能按钮 -->
      <view class="btn-group">
        <button @click="sendText">发送</button>
        <button @click="sendImage">图片</button>
        <button @click="startRecordVoice">语音</button>
        <button @click="callVoice">语音通话</button>
        <button @click="callVideo">视频通话</button>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { TencentImSdk } from '@/utils/imSdk.js';


// 响应式数据
const inputText = ref('');
const messageList = ref([]);
const scrollTop = ref(0); // 滚动条位置（保持到底部）
const isRecording = ref(false); // 是否正在录音

// 1. 页面挂载：拉取历史消息 + 监听新消息
onMounted(async () => {
  if (!toUserId) {
    uni.showToast({ title: '聊天对象ID不能为空', icon: 'none' });
    return;
  }
  // 拉取第一页历史消息
  await loadHistoryMessage();
  // 监听实时新消息
  uni.$on('im_message_received', handleNewMessage);
  // 监听IM登录状态（兜底）
  uni.$on('im_login_success', () => loadHistoryMessage());
});

// 2. 页面卸载：移除监听
onUnmounted(() => {
  uni.$off('im_message_received', handleNewMessage);
  uni.$off('im_login_success');
  // 停止录音（防止离开页面后仍在录音）
  if (isRecording.value) {
    uni.$emit('im_voice_stop');
    isRecording.value = false;
  }
});

// 3. 拉取历史消息
const loadHistoryMessage = async (isLoadMore = false) => {
  const list = await TencentImSdk.getHistoryMessage(toUserId, isLoadMore);
  messageList.value = list;
  // 滚动到底部（新消息始终在最下方）
  nextTick(() => {
    scrollTop.value = 999999;
  });
};

// 4. 加载更多历史消息（滚动到底部触发）
const loadMoreHistory = async () => {
  await loadHistoryMessage(true);
};

// 5. 处理实时接收的新消息
const handleNewMessage = (newMsgList) => {
  // 过滤当前聊天对象的消息
  const targetMsg = newMsgList.filter(msg => msg.to === toUserId || msg.from === toUserId);
  if (targetMsg.length) {
    messageList.value.push(...TencentImSdk.formatMessage(targetMsg));
    // 滚动到底部
    nextTick(() => {
      scrollTop.value = 999999;
    });
  }
};

// 6. 发送文本消息
const sendText = async () => {
  const isSuccess = await TencentImSdk.sendTextMsg(inputText.value, toUserId);
  if (isSuccess) {
    inputText.value = ''; // 清空输入框
    // 重新拉取历史消息（也可直接push本地消息，优化体验）
    await loadHistoryMessage();
  }
};

// 7. 发送图片消息
const sendImage = async () => {
  const isSuccess = await TencentImSdk.sendImageMsg(toUserId);
  if (isSuccess) {
    await loadHistoryMessage();
  }
};

// 8. 录制并发送语音消息
const startRecordVoice = async () => {
  if (isRecording.value) {
    // 停止录音
    uni.$emit('im_voice_stop');
    isRecording.value = false;
    return;
  }
  // 开始录音
  isRecording.value = true;
  uni.showToast({ title: '正在录音...', icon: 'none' });
  await TencentImSdk.sendVoiceMsg(toUserId);
  isRecording.value = false;
  // 重新拉取消息
  await loadHistoryMessage();
};

// 9. 播放语音消息
const playVoice = (fileUrl) => {
  const innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.src = fileUrl;
  innerAudioContext.play();
  innerAudioContext.onError((err) => {
    console.error('语音播放失败:', err);
    uni.showToast({ title: '语音播放失败', icon: 'none' });
  });
};

// 10. 发起语音通话
const callVoice = async () => {
  await TencentImSdk.callUser(toUserId, false); // false=语音
};

// 11. 发起视频通话
const callVideo = async () => {
  await TencentImSdk.callUser(toUserId, true); // true=视频
};
</script>

<style scoped>
.chat-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.msg-list {
  flex: 1;
  padding: 10rpx;
}
.msg-item {
  margin: 10rpx 0;
  display: flex;
}
.msg-item.self {
  justify-content: flex-end;
}
.msg-content {
  background: #007aff;
  color: #fff;
  padding: 10rpx 15rpx;
  border-radius: 10rpx;
  max-width: 60%;
}
.msg-img {
  width: 200rpx;
  height: auto;
  border-radius: 10rpx;
}
.msg-voice {
  background: #007aff;
  color: #fff;
  padding: 10rpx 15rpx;
  border-radius: 10rpx;
}
.msg-time {
  font-size: 24rpx;
  color: #999;
  margin: 0 10rpx;
}
.chat-footer {
  padding: 10rpx;
  border-top: 1px solid #eee;
}
.input-text {
  width: 100%;
  height: 80rpx;
  border: 1px solid #eee;
  border-radius: 40rpx;
  padding: 0 20rpx;
  margin-bottom: 10rpx;
}
.btn-group {
  display: flex;
  justify-content: space-around;
}
.btn-group button {
  padding: 10rpx 20rpx;
}
</style>