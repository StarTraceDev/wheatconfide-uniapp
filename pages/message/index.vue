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
            <!-- <uni-badge
              class="uni-badge-left-margin"
              :text="noticeNum"
              v-if="noticeNum && noticeNum > 0"
              absolute="rightTop"
              :max-num="99"
            >
              <text class="txt">通知</text>
            </uni-badge>
            <text class="txt" v-else>通知</text> -->
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
                  <view class="date">{{
                    formatDate(item.lastMessage.lastTime)
                  }}</view>
                </view>
                <view class="item-info-bottom-item">
                  <view class="item-info-top_content">
                    <text class="unread-text">
                      <!-- {{
                        conversation.lastMessage.read === false &&
                        conversation.lastMessage.senderId === currentUser.id
                          ? "[未读]"
                          : ""
                      }} -->
                      <!-- [未读] -->
                    </text>
                    <text>{{ messageType(item.lastMessage.type) }}</text>
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

    <!-- <view class="message-content notice-content" v-else>
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
    </view> -->
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
import { ref, onMounted } from "vue";
import { formatDate } from "@/lib/utils";
import { useTIM } from "@/utils/useTIM.js";
import { onShow } from "@dcloudio/uni-app";
import { useGlobalDataStore } from "@/stores/global.js";
import { tencentSigIm, postAdminList } from "@/common/api/consultant.js";
import CustomerService from "@/components/Customer-Service.vue";

// ====================  全局顶部 =====================
const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");

// ====================  TIM 会话列表 =====================
const SDKAppID = 1600116083;
const {
  tim,
  loading,
  errorMsg,
  isLogin,
  sdkReady,
  loginTIM,
  waitSDKReady,
  onTIMEvent,
} = useTIM(SDKAppID);

const testUser = {
  userId: uni.getStorageSync("currentUser").id,
  userSig: "",
};

const initIM = async () => {
  try {
    await getConversationList();
  } catch (e) {
    console.log(e);
  }
};

const conversations = ref([]);
const getConversationList = async () => {
  await waitSDKReady();
  try {
    const message = await tim.value.getConversationList({ hasUnreadCount: true }); // count: 20, // 获取20条会话
    const unread = await tim.value.getTotalUnreadMessageCount();
    userList(message.data.conversationList);
    // conversations.value = message.data.conversationList;
    // conversationList.value = res.data.conversationList
  } catch (err) {
    console.error("获取会话列表失败：", err);
  }
};

const userList = async (list) => {
  if (!Array.isArray(list) || list.length === 0) {
    conversations.value = [];
    console.log('list为空，无需处理');
    return;
  }
  try {
    const idList = list.map(item => item.toAccount).filter(id => id);
    if (idList.length === 0) {
      conversations.value = [...list];
      return;
    }
    const { data } = await postAdminList({
      params: {
        id: idList
      }
    });
    const recordMap = {};
    const records = Array.isArray(data.records) ? data.records : [data.records];
    records.forEach(item => {
      if (item.id) { // 确保id存在
        recordMap[item.id] = {
          avatar: item.avatar,
          realName: item.realName
        };
      }
    });
    const processedList = list.map(item => {
      const matched = recordMap[item.toAccount] || {};
      return {
        ...item,
        avatar: matched.avatar || '', 
        realName: matched.realName || ''
      };
    });
    console.log(processedList);
    
    
    conversations.value = processedList;
  } catch (err) {
    console.error('请求postAdminList失败：', err);
    // conversationList.value = [...list];
  }
};
    

onMounted(() => {
  onTIMEvent(TIM.EVENT.SDK_READY, () => {
    if (isLogin) {
      getConversationList();
    }
  });
  onTIMEvent(TIM.EVENT.CONVERSATION_LIST_UPDATED, (event) => {
    conversationList.value = event.data.conversationList;
  });
  if (isLogin && sdkReady) {
    getConversationList();
  }
});
// ====

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

const privateChantNum = ref(0);
const noticeNum = ref(101);
const activeIndex = ref(0);

// =================== 客服弹窗 ===================
const serviceRef = ref(null);
const customerService = () => {
  serviceRef.value.open();
};
// ===================

const tabActiveHandler = (i) => {
  i != activeIndex.value ? (activeIndex.value = i) : "";
};

const contentTabLists = ref([
  { id: 1, label: "全部" },
  { id: 2, label: "服务中" },
  { id: 3, label: "服务过" },
]);
const contentTabActiveIndex = ref(1);

const contentTabHandler = (i) => {
  i != contentTabActiveIndex.value ? (contentTabActiveIndex.value = i) : "";
};
const currentUser = ref({});

onShow(() => {
  initIM();
  currentUser.value = uni.getStorageSync("currentUser");
});

// ================== 会话列表操作 ==================
const conversationPopup = ref(null);
const currentConversation = ref(null);

const showAction = (conversation) => {
  currentConversation.value = conversation;
  conversationPopup.value?.open();
};

//会话置顶
const topConversation = () => {
  conversationPopup.value?.close();
  const { isPinned, conversationID } = currentConversation.value;
  let description = isPinned ? "取消置顶" : "置顶";

  let promise = tim.value.pinConversation({
    conversationID,
    isPinned: !isPinned,
  });
  promise.then(() => {
    getConversationList();
    uni.showToast({
      title: description + "成功",
      icon: "none",
    });
  })
};
// 删除会话
const deleteConversation = () => {
  conversationPopup.value?.close();
  const { conversationID } = currentConversation.value;

  uni.showModal({
    content: "确认删除这条会话吗？",
    success: (res) => {
      if (res.confirm) {
        let promise = tim.value.deleteConversation(conversationID);
        promise.then(() => {
          getConversationList();
          uni.showToast({
            title: "删除成功",
            icon: "none",
          });
        })
      }
    },
  });
};

// 全部已读
const alreadReadPopup = ref(null);
const alreadReadHandler = () => {
  alreadReadPopup.value?.open();
};
const cancelHandler = () => {
  alreadReadPopup.value?.close();
};

const confirmHandler = () => {
  let promise = tim.value.setAllMessageRead()
  promise.then(() => {
    getConversationList();
    uni.showToast({
      title: "操作成功",
    });
  })
  
  cancelHandler();
};

const chatHandler = (val) => {
  const { userProfile, realName, avatar } = val;
  uni.navigateTo({
    url: `/pages/message/private-chat?to=${userProfile.userID}&name=${realName} &avatar=${avatar}`,
  });
};
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
                /* 隐藏溢出的文本 */
                text-overflow: ellipsis;
                /* 显示省略号 */
                white-space: nowrap;
                /* 禁止文本换行 */
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
