<template>
  <view class="settled-box">
    <view class="header">
      <uni-nav-bar
        backgroundColor="rgba(255,255,255,0)"
        :border="false"
        :title="titlePage"
        class="header-bar"
        :class="scrollTop > 15 ? 'scrollClass' : ''"
      >
        <template v-slot:left>
          <uni-icons type="left" size="24" @click="backFn"></uni-icons>
        </template>
        <template v-slot:right>
          <view class="right">
            <image
              src="/static/confide/share.png"
              style="width: 40rpx; height: 40rpx"
            ></image>
          </view>
        </template>
      </uni-nav-bar>
    </view>
    <view class="content">
      <view class="feedback-list">
        <view
          class="feedback-item"
          v-for="(item, index) in feedbackList"
          :key="item.id"
        >
          <view class="time-item" @click="toggleDetail(index)">
            <text class="time-text">{{ item.createdTime }}</text>
            <text class="icon">{{ item.isShowDetail ? "▲" : "▼" }}</text>
          </view>
          <view class="detail-box" v-show="item.isShowDetail">
            <radio-group class="clause-group">
              <label
                class="uni-list-cell uni-list-cell-pd"
                v-for="(items, index) in itemLsit"
                :key="items.id"
              >
                <view class="cell-item">
                  <radio
                    :value="items.id"
                    :checked="item.type == items.id"
                    color="#FFCC33"
                    style="transform: scale(0.7)"
                    disabled
                  />
                  <text
                    :style="{ color: item.type == items.id ? '#FFCC33' : '' }"
                    >{{ items.typeName }}</text
                  >
                </view>
              </label>
            </radio-group>
            <view class="content-item" v-if="item.detail">
              <view style="margin-bottom: 10rpx">您填写的详情描述：</view>
              <textarea
                v-model="item.detail"
                placeholder-style="color:#b0b2b4;padding: 20rpx"
                disabled
              />
            </view>
            <view v-if="item.detail" style="margin: 20rpx 0;display: flex;align-items: center;justify-content: flex-end;">
              <view style="color: #5a5c5d;">提交时间：</view>
              <view style="color: #b0b2b4;">{{ item.createdTime }}</view>  
            </view>
            <view class="content-item" v-if="item.replyContent">
              <view style="margin-bottom: 10rpx">平台受理意见:</view>
              <textarea
                v-model="item.replyContent"
                placeholder-style="color:#b0b2b4;padding: 20rpx"
                disabled
              />
            </view>
            <view v-if="item.replyContent" style="margin: 20rpx 0;display: flex;align-items: center;justify-content: flex-end;">
              <view style="color: #5a5c5d;">回复时间：</view>
              <view style="color: #b0b2b4;">{{ item.createdTime }}</view>  
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { useGlobalDataStore } from "@/stores/global.js";
import { onShow, onPageScroll } from "@dcloudio/uni-app";
import { complaintSubmitPost } from "@/common/api/user.js";
import { complaintType } from "@/common/api/worry.js";
import { getFeedback } from "@/common/api/article.js";

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const props = defineProps({
  titlePage: {
    type: String,
    default: "反馈记录",
  },
});

const itemLsit = ref([
  { id: 1, typeName: "使用便捷问题" },
  { id: 2, typeName: "登陆问题" },
  { id: 3, typeName: "安全问题" },
  { id: 4, typeName: "支付问题" },
  { id: 5, typeName: "订单问题" },
  { id: 6, typeName: "账号问题" },
  { id: 7, typeName: "退款问题" },
]);

const scrollTop = ref(0);
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});

const backFn = () => {
  uni.navigateBack({
    delta: 1,
  });
};

onShow(() => {
  initListData();
});

const feedbackList = ref([]);
const splitContent = (content) => {
  let type = "";
  let detail = "";
  if (content && content.trim()) {
    const typeReg = /类型：([^\n]+)/;
    const detailReg = /详情：([\s\S]*)/;
    type = content.match(typeReg)?.[1] || "";
    detail = content.match(detailReg)?.[1] || "";
  }
  return { type: Number(type) || "", detail };
};

const initListData = async () => {
  let { data } = await getFeedback({
    current: 1,
    size: 10,
    userId: globalStore.userInfo.id,
  });
  const newList = data.records.map(item => {
    const { type, detail } = splitContent(item.content)
    return { ...item, type, detail, isShowDetail: false }
  })
  console.log(newList);
  
  feedbackList.value = newList
};

/**
 * ✅ 点击时间 展开/收起详情的核心方法
 * @param {Number} index 当前点击项的索引
 */
const toggleDetail = (index) => {
  // 切换布尔值，true=展开，false=收起
  feedbackList.value[index].isShowDetail =
    !feedbackList.value[index].isShowDetail;
};

// 页面加载完成初始化数据
initListData();
</script>

<style lang="scss" scoped>
.settled-box {
  background-color: #f4f6f8;
  $statusBarHeight: v-bind(statusBarHeight);
  width: 100vw;
  min-height: 100vh !important;
  background-image: url("@/static/settled/settled-bg.png");
  background-size: 100vw 632rpx;
  background-repeat: no-repeat;
  padding-bottom: 30rpx;
  .header {
    position: fixed;
    width: 100vw;
    height: 88rpx;
    z-index: 999;

    .header-bar {
      padding-top: calc($statusBarHeight - 122rpx);

      ::v-deep(.uni-nav-bar-text) {
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
      }
    }
  }
  .scrollClass {
    background-color: #fff;
    box-shadow: 0rpx 4rpx 20rpx rgba(0, 0, 0, 0.1);
    ::v-deep(.uni-nav-bar-text) {
      color: #000;
    }
  }

  .content {
    padding-top: calc($statusBarHeight - 20rpx);
  }
}

.clause {
  margin: 0 30rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  background-color: #fff;
}

.clause-type {
  margin-bottom: 30rpx;
}
.clause-group {
  display: flex;
  flex-wrap: wrap;
}
.cell-item {
  margin: 10rpx;
}
// .unipopup{
//   .shutdown{
//     text-align: right;
//   }
//   .title{
//     color: #5E5C5C;
//     font-size: 30rpx;
//     font-weight: bold;
//     padding-top: 30rpx;
//   }
//   .text{
//     padding-top: 30rpx;
//   }
//   .but{
//     font-size: 30rpx;
//     padding-top: 50rpx;
//     color: #9E9E9E;
//   }
// }
::v-deep .uni-popup__wrapper {
  height: 25%;
  width: 70%;
  border-radius: 20rpx;
  padding: 40rpx;
  font-size: 28rpx;
  text-align: center;
}
::v-deep .uni-textarea-wrapper {
  padding: 20rpx !important;
  border-radius: 20rpx !important;
  background-color: #f4f2f2 !important;
}
::v-deep .uni-textarea-textarea {
  padding: 20rpx 20rpx 0 20rpx !important;
}

::v-deep .u-btn--primary {
  background-color: #35ca95 !important;
  padding: 20rpx 0 !important;
}
::v-deep .uni-radio-input {
  border-radius: 0;
}
::v-deep .uni-radio-input {
  border-radius: 0;
}
::v-deep uni-textarea {
  width: 94%;
}
::v-deep .uni-textarea-wrapper {
  background-color: #f6f6f6 !important;
  border-radius: 20rpx;
}
::v-deep .uni-textarea-textarea {
  padding: 20rpx !important;
}
::v-deep .uni-checkbox-input {
  border-radius: 50%;
  width: 30rpx;
  height: 30rpx;
}

.feedback-list {
  width: 100%;
  padding: 20rpx;
  box-sizing: border-box;
}
// 每条反馈的容器
.feedback-item {
  width: 100%;
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  box-sizing: border-box;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}
// 时间点击区域
.time-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}
.time-text {
  flex: 1;
}
.icon {
  color: #666;
  font-size: 24rpx;
  margin-left: 10rpx;
}
// 展开后的详情面板
.detail-box {
  margin-top: 20rpx;
  border-top: 1px solid #f5f5f5;
  padding-top: 20rpx;
}
// 详情每项样式
.content-item {
  display: flex;
  margin-bottom: 50rpx;
  font-size: 26rpx;
  line-height: 1.6;
  flex-direction: column;
}
.label {
  color: #999;
  width: 140rpx;
  flex-shrink: 0;
}
.value {
  color: #333;
  flex: 1;
}
// 状态文字样式
.status-success {
  color: #07c160;
}
.status-wait {
  color: #ff9500;
}
</style>

<!-- <template>
  <view class="settled-box">
    <view class="header">
      <uni-nav-bar
        backgroundColor="rgba(255,255,255,0)"
        :border="false"
        :title="titlePage"
        class="header-bar"
        :class="scrollTop > 15 ? 'scrollClass' : ''"
      >
        <template v-slot:left>
          <uni-icons type="left" size="24" @click="backFn"></uni-icons>
        </template>
        <template v-slot:right>
          <view class="right">
            <image
              src="/static/confide/share.png"
              style="width: 40rpx; height: 40rpx"
            ></image>
          </view>
        </template>
      </uni-nav-bar>
    </view>
    <view class="content">
      <view class="clause">
        <view class="clause-type">
          <view>您提交投诉的原因：</view>
          <radio-group @change="checkboxChange" class="clause-group">
            <label
              class="uni-list-cell uni-list-cell-pd"
              v-for="item in items"
              :key="item.id"
            >
              <view class="cell-item">
                <radio :value="item.id" :checked="feedbackFrom.complaintTypeId == item.id" color="#FFCC33" style="transform:scale(0.7)" />
                <text :style="{ color: feedbackFrom.complaintTypeId == item.id ? '#FFCC33' : '' }">{{ item.typeName }}</text>
              </view>
            </label>
          </radio-group>
        </view>
        <view>
          <view style="margin-bottom: 20rpx;">您的详情描述：</view>
          <textarea v-model="feedbackFrom.description" placeholder-style="color:#9E9E9E;padding: 20rpx"  placeholder="请输入详情描述"/>
        </view>

        <view style="margin-top: 300rpx;">
          <u-button type="primary" size="large" shape="circle" block @click="complaintSubmit">确认提交</u-button>
        </view>
        <view style="margin-top: 50rpx;text-align: center;color: #9E9E9E;">反馈记录</view>
      </view>
    </view>
    <uni-popup ref="popup" background-color="#fff" class="unipopup">
        <view class="shutdown" @click="unipopupClose">
          <uni-icons type="closeempty" size="20" color="#A6A6A6"></uni-icons>
        </view>
        <view class="title">您的投诉已提交！</view>
        <view class="text">可在“投诉记录”查看审核进度</view>
        <view class="but">投诉记录</view>
		</uni-popup>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { useGlobalDataStore } from "@/stores/global.js";
import { onShow, onPageScroll } from "@dcloudio/uni-app";
import { complaintSubmitPost } from '@/common/api/user.js';
import { complaintType } from '@/common/api/worry.js';
import { getFeedback } from '@/common/api/article.js';

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const props = defineProps({
  titlePage: {
    type: String,
    default: "投诉记录",
  },
});

const scrollTop = ref(0);
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});

const backFn = () => {
  uni.navigateBack({
    delta: 1,
  });
};

const popup = ref(null);
const feedbackFrom = ref({
  complaintTypeId: null, 
  description: "",
  accusedUserId: null,
});
const items = ref([]);

const typeList = async () => {
  let { data } = await getFeedback();
  items.value = data.records;
};

typeList();

const complaintSubmit = async () => {
  try {
    const data = Object.assign(feedbackFrom.value, { accusedUserId: 1018 })
    let resp = await complaintSubmitPost(data);
    popup.value.open('center');
  } catch {
    console.log('err'); 
  }
};

const unipopupClose = () => {
  popup.value.close();
}

const checkboxChange = (e) => {
  feedbackFrom.value.complaintTypeId = e.detail.value;
};
onShow(() => {});
</script>

<style lang="scss" scoped>
.settled-box {
  background-color: #f4f6f8;
  $statusBarHeight: v-bind(statusBarHeight);
  width: 100vw;
  min-height: 100vh !important;
  background-image: url("@/static/settled/settled-bg.png");
  background-size: 100vw 632rpx;
  background-repeat: no-repeat;
  padding-bottom: 30rpx;
  .header {
    position: fixed;
    width: 100vw;
    height: 88rpx;
    z-index: 999;

    .header-bar {
      padding-top: calc($statusBarHeight - 122rpx);

      ::v-deep(.uni-nav-bar-text) {
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
      }
    }
  }
  .scrollClass{
    background-color: #fff;
    box-shadow: 0rpx 4rpx 20rpx rgba(0, 0, 0, 0.1);
    ::v-deep(.uni-nav-bar-text) {
      color: #000;
    }
  }

  .content {
    padding-top: calc($statusBarHeight - 20rpx);
    .clause {
      margin: 0 30rpx;
      padding: 30rpx;
      border-radius: 20rpx;
      background-color: #fff;
      &-type {
        margin-bottom: 30rpx;
        .clause-group{
          margin-top: 20rpx;
          display: flex;
          flex-wrap: wrap;

          .cell-item {
            margin: 10rpx;
          }
        }
      }
    }
  }
}
// .unipopup{
//   .shutdown{
//     text-align: right;
//   }
//   .title{
//     color: #5E5C5C;
//     font-size: 30rpx;
//     font-weight: bold;
//     padding-top: 30rpx;
//   }
//   .text{
//     padding-top: 30rpx;
//   }
//   .but{
//     font-size: 30rpx;
//     padding-top: 50rpx;
//     color: #9E9E9E;
//   }
// }
::v-deep .uni-popup__wrapper{
  height: 25%;
  width: 70%;
  border-radius: 20rpx;
  padding: 40rpx;
  font-size: 28rpx;
  text-align: center;
}
::v-deep .uni-textarea-wrapper{
  padding: 20rpx !important;
  border-radius: 20rpx !important;
  background-color: #F4F2F2 !important;
}
::v-deep .uni-textarea-textarea{
  padding: 20rpx 20rpx 0 20rpx !important;
}

::v-deep .u-btn--primary{
  background-color:#35CA95 !important;
  padding: 20rpx 0 !important;
}
::v-deep .uni-radio-input{
  border-radius: 0;
}
</style> -->
