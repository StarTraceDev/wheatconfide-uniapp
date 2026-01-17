


<template>
  <view class="message-box">
    <uni-nav-bar
      :backgroundColor="'#f4f6f8'"
      :border="false"
      class="header-bar"
      :statusBar="true"
      fixed
      leftWidth="260rpx"
      rightWidth="200rpx"
      height="128rpx"
    >
      <template v-slot:left>
        <view class="left">
          <view
            class="tab-item"
            :class="activeIndex == 0 ? 'active' : ''"
            @click="tabActiveHandler(0)"
          >
            <uni-badge
              class="uni-badge-left-margin"
              :text="privateChantNum"
              absolute="rightTop"
              v-if="privateChantNum && privateChantNum > 0"
              :max-num="99"
            >
              <text class="txt">私聊</text>
            </uni-badge>
            <text class="txt" v-else>私聊</text>
          </view>
          <view
            class="tab-item"
            :class="activeIndex == 1 ? 'active' : ''"
            @click="tabActiveHandler(1)"
          >
            <text class="txt">通知</text>
          </view>
        </view>
      </template>
      <template v-slot:right>
        <view class="right">
          <view class="img-txt" @click="customerService">
            <image src="/static/consult/contect.png" class="img"></image>
            <text class="txt">客服</text>
          </view>
          <view class="img-txt" @click="alreadReadHandler">
            <image src="/static/message/use-read.svg" class="img"></image>
            <text class="txt">已读</text>
          </view>
        </view>
      </template>
    </uni-nav-bar>

    <view class="message-content" v-if="activeIndex == 0">
      <view class="content-tab-box">
        <view
          class="tab-item"
          v-for="(item, index) in contentTabLists"
          :key="index"
          :class="contentTabActiveIndex == item.id ? 'active' : ''"
          @click="contentTabHandler(item.id)"
        >
          {{ item.label }}
        </view>
      </view>
      <view class="scroll-content-box">
        <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
          <view v-if="conversations.length > 0">
            <view
              class="content-item"
              v-for="(item, index) in conversations"
              :key="index"
              :class="item.isPinned ? 'item-bg' : ''"
              @click="chatHandler(item)"
            >
              <view class="content-item-left">
                <image :src="item.avatar" class="img"></image>
              </view>
              <view class="content-item-right">
                <view class="content-user-date">
                  <view class="name">{{ item.realName }}</view>
                  <view class="date">{{ formatDate(item.lastMessage?.lastTime || item.lastMessageTime) }}</view>
                </view>
                <view class="item-info-bottom-item">
                  <view class="item-info-top_content">
                    <text class="unread-text" v-if="item.unreadCount > 0">[未读]</text>
                    <text>{{ messageType(item.lastMessage?.type || item.lastMsgType) }}</text>
                  </view>
                  <view class="item-info-bottom_action" @click.stop="showAction(item)">
                    <uni-icons
                      type="more-filled"
                      size="24"
                      color="rgba(0,0,0,.35)"
                    />
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="no-conversation" v-else>当前没有会话</view>
        </scroll-view>
      </view>
    </view>

    <view class="message-content notice-content" v-else>
      <view class="scroll-content-box">
        <scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
          <view class="content-item" v-for="i in 1" :key="i">
            <view class="content-item-left">
              <image src="/static/consult/user.png" class="img"></image>
            </view>
            <view class="content-item-right">
              <view class="content-user-date">
                <view class="name">消息推送</view>
                <view class="date">昨天</view>
              </view>
              <view class="item-info-bottom-item">
                <view class="item-info-top_content"
                  >咨询、测评、课程马上领</view
                >
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    
    <uni-popup
      ref="conversationPopup"
      type="center"
      border-radius="8rpx"
      class="conversation-popup"
    >
      <view class="item-box">
        <view class="item" @click="topConversation">{{
          currentConversation.isPinned ? "取消置顶" : "置顶聊天"
        }}</view>
        <view class="item" @click="deleteConversation">删除聊天</view>
      </view>
    </uni-popup>

    <uni-popup
      ref="alreadReadPopup"
      type="center"
      border-radius="24rpx"
      class="alread-read-popup"
    >
      <view class="item-box">
        <view class="title">全部已读</view>
        <view class="content">确认将所有信息标记为已读？</view>
        <view class="btn">
          <view class="cancel" @click="cancelHandler">取消</view>
          <view class="confirm" @click="confirmHandler">已读</view>
        </view>
      </view>
    </uni-popup>
    <CustomerService ref="serviceRef"></CustomerService>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { formatDate } from "@/lib/utils";
import { onShow } from "@dcloudio/uni-app";
import { useGlobalDataStore } from "@/stores/global.js";
import { postAdminList } from "@/common/api/consultant.js";
import CustomerService from "@/components/Customer-Service.vue";
import { TencentImSdk } from "@/utils/imSdk.js"; // 替换原useTIM，导入封装的IM SDK

// ====================  全局顶部 =====================
const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");

// ====================  IM 核心变量 =====================
const conversations = ref([]); // 会话列表
const privateChantNum = ref(0); // 未读总数
const activeIndex = ref(0); // 顶部tab：0=私聊 1=通知
const contentTabLists = ref([
  { id: 1, label: "全部" },
  { id: 2, label: "服务中" },
  { id: 3, label: "服务过" },
]);
const contentTabActiveIndex = ref(1); // 内容分类tab
const conversationPopup = ref(null); // 会话操作弹窗
const currentConversation = ref(null); // 当前操作的会话
const alreadReadPopup = ref(null); // 全部已读弹窗
const serviceRef = ref(null); // 客服组件ref
const currentUser = ref(uni.getStorageSync("currentUser") || {}); // 当前用户信息

// ====================  IM 初始化 & 登录 =====================
// 初始化IM并登录
const initIM = async () => {
  if (!currentUser.value.id) {
    uni.showToast({ title: "用户信息缺失", icon: "none" });
    return;
  }
  // 调用imSdk中的登录方法
  const loginResult = await TencentImSdk.loginIm(currentUser.value.id);
  
  if (loginResult) {
    await getConversationList(); // 登录成功后获取会话列表
  } else {
    uni.showToast({ title: "IM登录失败", icon: "none" });
  }
};

// ====================  会话列表相关 =====================
// 获取会话列表（核心）
const getConversationList = async () => {
  try {
    // 获取TIM实例
    const timInstance = TencentImSdk.getTimInstance(); 
    if (!timInstance) {
      console.warn("TIM实例未初始化完成，无法获取会话列表");
      return;
    }
    // 获取会话列表
    const { data } = await timInstance.getConversationList();
    
    const conversationList = data.conversationList || [];
    // 计算总未读消息数
    const totalUnread = conversationList.reduce((total, item) => {
      return total + (item.unreadCount || 0);
    }, 0);
    
    // 赋值未读数
    privateChantNum.value = totalUnread;
    await handleConversationUserInfo(conversationList);

  } catch (err) {
    console.error("获取会话列表失败：", err);
    conversations.value = [];
    privateChantNum.value = 0;
  }
};

// 处理会话列表，拼接用户信息（头像、昵称）
const handleConversationUserInfo = async (list) => {
  if (!Array.isArray(list) || list.length == 0) {
    conversations.value = [];
    return;
  }

  try {
    // 提取对方用户ID列表
    const idList = list.map(item => {
      // C2C会话：toAccount是对方ID；群聊可根据业务调整
      return item.type === 'C2C' ? item.toAccount : item.groupID;
    }).filter(id => id);
    
    if (idList.length === 0) {
      conversations.value = [...list];
      return;
    }

    // 调用接口获取用户信息
    const { data } = await postAdminList({ params: { id: idList } });
    const recordMap = {};
    const records = Array.isArray(data.records) ? data.records : [data.records];

    records.forEach(item => {
      if (item.id) {
        recordMap[item.id] = {
          avatar: item.avatar,
          realName: item.realName
        };
      }
    });

    // 拼接会话列表和用户信息
    const processedList = list.map(item => {
      const targetId = item.type === 'C2C' ? item.toAccount : item.groupID;
      const userInfo = recordMap[targetId] || {};
      return {
        ...item,
        avatar: userInfo.avatar || '',
        realName: userInfo.realName || '未知用户',
        // 兼容消息时间和类型字段
        lastMessageTime: item.lastMessage?.time * 1000 || Date.now(),
        lastMsgType: item.lastMessage?.type || 'TIMTextElem'
      };
    });

    // 按置顶+时间排序（置顶的在前，然后按最后消息时间降序）
    processedList.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1; // 置顶的排前面
      }
      return b.lastMessageTime - a.lastMessageTime; // 最新消息排前面
    });
    
    conversations.value = processedList;
  } catch (err) {
    console.error('获取用户信息失败：', err);
    conversations.value = list.map(item => ({
      ...item,
      avatar: '',
      realName: '未知用户',
      lastMessageTime: item.lastMessage?.time * 1000 || Date.now(),
      lastMsgType: item.lastMessage?.type || 'TIMTextElem'
    }));
  }
};

// 消息类型转换
const messageType = (val) => {
  switch (val) {
    case "TIMTextElem":
      return "[文字消息]";
    case 'TIMImageElem':
      return "[图片消息]";
    case 'TIMSoundElem':
      return "[语音消息]";
    case 'TIMVideoElem':
      return "[视频消息]";
    default:
      return "[未识别内容]";
  }
};

// ====================  事件监听 =====================
// 监听IM事件（SDK就绪、新消息、会话更新等）
const registerIMEvents = () => {
  // SDK登录成功/就绪
  uni.$on('im_login_success', () => {
    getConversationList();
  });

  // 新消息接收
  uni.$on('im_message_received', () => {
    getConversationList(); // 收到新消息刷新会话列表
  });

  // 账号被踢下线
  uni.$on('im_kicked_out', () => {
    uni.showToast({ title: '账号已在其他设备登录', icon: 'none' });
    conversations.value = [];
    privateChantNum.value = 0;
  });
};

// 移除IM事件监听（防止内存泄漏）
const unregisterIMEvents = () => {
  uni.$off('im_login_success');
  uni.$off('im_message_received');
  uni.$off('im_kicked_out');
};

// ====================  交互逻辑 =====================
// 顶部tab切换（私聊/通知）
const tabActiveHandler = (i) => {
  if (i !== activeIndex.value) {
    activeIndex.value = i;
  }
};

// 内容分类tab切换（全部/服务中/服务过）
const contentTabHandler = (i) => {
  if (i !== contentTabActiveIndex.value) {
    contentTabActiveIndex.value = i;
    // 可根据分类过滤会话列表，此处预留逻辑
    // if (i === 2) { ... } else if (i === 3) { ... }
  }
};

// 打开会话操作弹窗（置顶/删除）
const showAction = (conversation) => {
  currentConversation.value = conversation;
  conversationPopup.value?.open();
};

// 置顶/取消置顶会话
const topConversation = async () => {
  if (!currentConversation.value) return;
  conversationPopup.value?.close();
  
  const timInstance = TencentImSdk.timInstance || TencentImSdk._timInstance;
  if (!timInstance) return;

  const { conversationID, isPinned } = currentConversation.value;
  const description = isPinned ? "取消置顶" : "置顶";
  
  try {
    await timInstance.pinConversation({
      conversationID,
      isPinned: !isPinned
    });
    await getConversationList(); // 刷新会话列表
    uni.showToast({ title: `${description}成功`, icon: "none" });
  } catch (err) {
    console.error(`${description}失败：`, err);
    uni.showToast({ title: `${description}失败`, icon: "none" });
  }
};

// 删除会话
const deleteConversation = async () => {
  if (!currentConversation.value) return;
  conversationPopup.value?.close();
  
  const timInstance = TencentImSdk.timInstance || TencentImSdk._timInstance;
  if (!timInstance) return;

  const { conversationID } = currentConversation.value;
  uni.showModal({
    content: "确认删除这条会话吗？",
    success: async (res) => {
      if (res.confirm) {
        try {
          await timInstance.deleteConversation(conversationID);
          await getConversationList(); // 刷新会话列表
          uni.showToast({ title: "删除成功", icon: "none" });
        } catch (err) {
          console.error("删除会话失败：", err);
          uni.showToast({ title: "删除失败", icon: "none" });
        }
      }
    },
  });
};

// 打开全部已读确认弹窗
const alreadReadHandler = () => {
  alreadReadPopup.value?.open();
};

// 取消全部已读操作
const cancelHandler = () => {
  alreadReadPopup.value?.close();
};

// 确认全部已读
const confirmHandler = async () => {
  const timInstance = TencentImSdk.timInstance || TencentImSdk._timInstance;
  if (!timInstance) return;

  try {
    await timInstance.setAllMessageRead();
    await getConversationList(); // 刷新会话列表
    privateChantNum.value = 0; // 重置未读数
    uni.showToast({ title: "操作成功", icon: "success" });
  } catch (err) {
    console.error("标记全部已读失败：", err);
    uni.showToast({ title: "操作失败", icon: "none" });
  }
  cancelHandler();
};

// 点击会话进入聊天页面
const chatHandler = (item) => {
  const toUserId = item.type === 'C2C' ? item.userProfile.userID : item.groupID;
  uni.navigateTo({
    url: `/pages/message/private-chat?to=${toUserId}&name=${item.realName}&avatar=${item.avatar}`,
  });
};

// 打开客服弹窗
const customerService = () => {
  serviceRef.value?.open();
};

// ====================  生命周期 =====================
onMounted(() => {
  registerIMEvents(); // 注册IM事件
});

onUnmounted(() => {
  unregisterIMEvents(); // 移除IM事件监听
});

onShow(() => {
  currentUser.value = uni.getStorageSync("currentUser") || {};
  initIM(); // 页面显示时初始化IM
});
</script>

<style scoped lang="scss">
$statusBarHeight: v-bind(statusBarHeight);

.message-box {
  ::v-deep(.header-bar) {
    .uni-navbar__header {
      padding: 0rpx 32rpx;
    }

    .left {
      display: flex;
      width: 200rpx;
      justify-content: space-between;
      color: rgba(0, 0, 0, 0.65);
      font-size: 32rpx;
      padding-right: 20rpx;

      .tab-item {
      }

      .active {
        position: relative;
        display: flex;
        justify-content: center;
        color: rgba(0, 0, 0, 0.85);

        &::after {
          position: absolute;
          content: "";
          width: 40rpx;
          height: 8rpx;
          border-radius: 4rpx;
          background: linear-gradient(270deg, #eafff7 0%, #35ca95 100%), #35ca95;
          bottom: -20rpx;
        }
      }
    }

    .right {
      display: flex;
      justify-content: space-between;
      width: 126rpx;

      .img-txt {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .img {
          width: 40rpx;
          height: 40rpx;
        }

        .txt {
          font-size: 18rpx;
          letter-spacing: normal;
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
  }

  .message-content {
    width: 750rpx;
    min-height: calc(100vh - 128rpx - $statusBarHeight);
    background: #fff;
    height: auto;
    display: flex;
    align-items: center;
    flex-direction: column;

    .content-tab-box {
      width: 686rpx;
      display: flex;
      align-content: center;
      height: 98rpx;
      align-items: center;

      .tab-item {
        border-radius: 24rpx;
        background: #f5f7fa;
        width: 112rpx;
        height: 44rpx;
        line-height: 44rpx;
        text-align: center;
        color: rgba(0, 0, 0, 0.65);
        font-size: 24rpx;
        margin-right: 20rpx;
      }

      .active {
        background: rgba(53, 202, 149, 0.1);
        box-sizing: border-box;
        border: 0.5px solid #35ca95;
        color: #35ca95;
      }
    }

    .scroll-content-box {
      width: 100%;

      .scroll-content {
        height: calc(100vh - 226rpx - $statusBarHeight);

        .item-bg {
          background-color: #f1fffa;
        }
        .content-item {
          display: flex;
          justify-content: center;
          height: 132rpx;
          align-items: center;
          position: relative;

          .content-item-left {
            width: 124rpx;

            .img {
              width: 84rpx;
              height: 84rpx;
              border-radius: 10rpx;
            }
          }

          .content-item-right {
            .content-user-date {
              display: flex;
              justify-content: space-between;

              .name {
                font-size: 28rpx;
                font-weight: normal;
                color: rgba(0, 0, 0, 0.85);
              }

              .date {
                font-size: 22rpx;
                font-weight: normal;
                color: #c7cbce;
              }
            }

            .item-info-bottom-item {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .item-info-top_content {
                font-size: 24rpx;
                color: #a1a6aa;
                width: 528rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-top: 12rpx;
                height: 40rpx;
                line-height: 40rpx;
              }

              .item-info-bottom_action {
                font-size: 34rpx;
              }
            }
          }

          &::after {
            width: 564rpx;
            height: 2rpx;
            background-color: rgba(0, 0, 0, 0.04);
            content: "";
            position: absolute;
            bottom: 0rpx;
            left: 124rpx;
          }
        }

        .no-conversation {
          width: 100%;
          text-align: center;
          height: 80rpx;
          line-height: 80rpx;
          font-size: 34rpx;
          color: #9d9d9d;
        }
      }
    }
  }
  .notice-content {
    .scroll-content-box {
      .scroll-content {
        height: calc(100vh - 128rpx - $statusBarHeight);
      }
    }
  }
  .conversation-popup {
    .item-box {
      width: 520rpx;
      height: 208rpx;
      border-radius: 8rpx;
      background: #ffffff;

      .item {
        height: 104rpx;
        font-size: 28rpx;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.85);
        padding-left: 34rpx;
        line-height: 104rpx;

        &:nth-child(1) {
          border-bottom: 2rpx solid rgba(0, 0, 0, 0.04);
        }
      }
    }
  }

  .alread-read-popup {
    .item-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 520rpx;
      height: 300rpx;
      background-color: #fff;
      border-radius: 24rpx;
      justify-content: center;

      .title {
        font-size: 36rpx;
        font-weight: 500;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.85);
        margin-top: 34rpx;
      }

      .content {
        font-size: 24rpx;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.6);
        margin-top: 24rpx;
      }

      .btn {
        width: 400rpx;
        display: flex;
        justify-content: space-between;
        margin-top: 36rpx;

        .cancel,
        .confirm {
          border-radius: 32rpx;
          background: #b9b9b9;
          width: 180rpx;
          height: 64rpx;
          color: #ffffff;
          font-size: 28rpx;
          text-align: center;
          line-height: 64rpx;
        }

        .confirm {
          background: #35ca95;
        }
      }
    }
  }
}
</style>
