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
      <view class="clause">
        <view class="clause-type">
          <view>请选择您需要反馈的问题类型：</view>
          <radio-group @change="checkboxChange" class="clause-group">
            <label
              class="uni-list-cell uni-list-cell-pd"
              v-for="item in items"
              :key="item.id"
            >
              <view class="cell-item">
                <radio
                  :value="item.id"
                  :checked="feedbackFrom.complaintTypeId == item.id"
                  color="#FFCC33"
                  style="transform: scale(0.7)"
                />
                <text
                  :style="{
                    color:
                      feedbackFrom.complaintTypeId == item.id ? '#FFCC33' : '',
                  }"
                  >{{ item.typeName }}</text
                >
              </view>
            </label>
          </radio-group>
        </view>
        <view>
          <view style="margin-bottom: 20rpx">请在下方文本框内详情描述：</view>
          <textarea
            v-model="feedbackFrom.content "
            placeholder-style="color:#9E9E9E;padding: 20rpx"
            placeholder="请输入详情描述"
          />
        </view>

        <view style="margin-top: 300rpx">
          <u-button
            type="primary"
            size="large"
            shape="circle"
            block
            @click="complaintSubmit"
            >确认提交</u-button
          >
        </view>
        <view
          style="margin-top: 50rpx; text-align: center; color: #9e9e9e"
          @click="toRecord"
          >反馈记录</view
        >
      </view>
    </view>
    <uni-popup ref="popup" background-color="#fff" class="unipopup">
      <view class="shutdown" @click="unipopupClose">
        <uni-icons type="closeempty" size="20" color="#A6A6A6"></uni-icons>
      </view>
      <view class="title">您的反馈已提交！</view>
      <view class="text">可在“反馈记录”查看审核进度</view>
      <view class="but" @click="toRecord">反馈记录</view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { useGlobalDataStore } from "@/stores/global.js";
import { onShow, onPageScroll } from "@dcloudio/uni-app";
import { complaintSubmitPost, feedbackSubmit } from "@/common/api/user.js";

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const props = defineProps({
  titlePage: {
    type: String,
    default: "意见反馈",
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
  content : "",
});

const items = ref([
  { id: 1, typeName: "使用便捷问题" },
  { id: 2, typeName: "登陆问题" },
  { id: 3, typeName: "安全问题" },
  { id: 4, typeName: "支付问题" },
  { id: 5, typeName: "订单问题" },
  { id: 6, typeName: "账号问题" },
  { id: 7, typeName: "退款问题" },
]);

const complaintSubmit = async () => {
  try {
    const { content, complaintTypeId } = feedbackFrom.value
    const data = {
      content,
      types: [complaintTypeId],
    }
    let resp = await feedbackSubmit(data);
    popup.value.open("center");
  } catch {
    console.log("err");
  }
};

const unipopupClose = () => {
  popup.value.close();
};

const checkboxChange = (e) => {
  feedbackFrom.value.complaintTypeId = e.detail.value;
};

const toRecord = () => {
  uni.navigateTo({
    url: "/pages/settings/record",
  });
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
  .scrollClass {
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
        .clause-group {
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
.unipopup {
  .shutdown {
    text-align: right;
  }
  .title {
    color: #5e5c5c;
    font-size: 30rpx;
    font-weight: bold;
    padding-top: 30rpx;
  }
  .text {
    padding-top: 30rpx;
  }
  .but {
    font-size: 30rpx;
    padding-top: 50rpx;
    color: #9e9e9e;
  }
}
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
::v-deep uni-textarea{
	width: 94%;
}
::v-deep .uni-textarea-wrapper{
	background-color: #F6F6F6 !important;
	border-radius: 20rpx;
}
::v-deep .uni-textarea-textarea{
	padding: 20rpx !important;
}
::v-deep .uni-checkbox-input{
	border-radius: 50%;
	width: 30rpx;
	height: 30rpx;
}
</style>
