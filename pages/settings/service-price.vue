<template>
  <view class="settled-box">
    <view class="header">
      <uni-nav-bar
        :class="scrollTop > 15 ? 'scrollClass' : ''"
        backgroundColor="#f4f6f8"
        :border="false"
        :title="BarTitle"
        class="header-bar"
      >
        <template v-slot:left>
          <uni-icons type="left" size="24" @click="backFn"></uni-icons>
        </template>
        <template v-slot:right>
          <view
            class="right"
            :class="`right-${point.userRole}`"
            @click="serviceAdd"
            >提交</view
          >
        </template>
      </uni-nav-bar>
    </view>
    <view class="content">
      <view class="content-details">
        <view class="tips">修改价格需平台审核，每个月份可修改 2次</view>
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">名称</view>
          <view
            class="uni-list-cell-db"
            :class="`uni-list-cell-db-${point.userRole}`"
          >
            <!-- <image
              :src="`/static/my/${point.userRole == '1' ? 'pen' : 'yen'}.png`"
              style="width: 30rpx; height: 30rpx"
            ></image> -->
            <input
              class="uni-input"
              v-model="titleName"
              style="text-align: right;"
            />
          </view>
        </view>
        <view class="uni-list-cell">
          <view class="uni-list-cell-left">
            价格<text style="color: #a9a9a9">（含服务费）</text>
          </view>
          <view
            class="uni-list-cell-db"
            :class="`uni-list-cell-db-${point.userRole}`"
          >
            <image
              :src="`@/static/my/${point.userRole == '1' ? 'pen' : 'yen'}.png`"
              style="width: 30rpx; height: 30rpx"
            ></image>
            <input
              class="uni-input"
              v-model="price"
              style="text-align: right; max-width: 65rpx"
            />
            <text style="margin-left: 10rpx">元</text>
          </view>
        </view>
        <view class="text-tips"
          >{{
            barTime(
              price,
              index == 0 ? 15 : index == 1 ? 30 : index == 2 ? 60 : 90
            )
          }}
          元/分钟</view
        >
        <view class="text-tips" style="padding-bottom: 20rpx"
          >不含服务费价：{{ calculateCommission(price, percent) }} 元</view
        >
        <view class="uni-list-cell" style="margin-top: 20rpx">
          <view class="uni-list-cell-left"> 最低服务时长 </view>
          <view
            class="uni-list-cell-db"
            :class="`uni-list-cell-db-${point.userRole}`"
          >
            <image
              :src="`@/static/my/${point.userRole == '1' ? 'pen' : 'yen'}.png`"
              style="width: 30rpx; height: 30rpx"
            ></image>
            <picker @change="bindPickerChange" :value="index" :range="array">
              <view class="uni-input">{{ array[index] }}</view>
            </picker>
          </view>
        </view>
      </view>
      <view class="protocol">
        <view>温馨提示：</view>
        <text
          >1.{{
            BarTitle
          }}为预约服务，为保证服务质量，请您提前做好预约服务准备。\n</text
        >
        <text
          >2.平台将按最低15分钟展示含服务费的价格，服务费为订单金额的{{
            percent
          }}%，订单收益按不含服务费交易额计算。\n</text
        >
        <text
          >3.请您根据自身经验合理填写价格，平台后续也会依据您的评价率、响应率等标准进行审核。\n</text
        >
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useGlobalDataStore } from "@/stores/global.js";
import { onShow, onPageScroll } from "@dcloudio/uni-app";
import {
  consultantAdd,
  listenerAdd,
  listenerUpdate,
  consultantUpdate,
} from "@/common/api/worry.js";
import { getUserInfo } from "@/common/api/apis.js";
import { getOperation } from "@/common/api/worry.js";

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const array = ref(["15分钟", "30分钟", "60分钟", "90分钟"]);
const index = ref(0);
const price = ref("");
const titleName = ref("");
const userInfo = ref({});
const Info = async () => {
  try {
    const res = await getUserInfo();
    userInfo.value = res.data;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
  }
};

const percent = ref(0);
const operation = async () => {
  try {
    const { data } = await getOperation();
    const { consultantCommissionPercent, listenerCommissionPercent } =
      data.records[0];
    percent.value =
      point.value.userRole == "1"
        ? consultantCommissionPercent
        : listenerCommissionPercent;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
  }
};
const barTime = (price, time) => {
  return (price / time).toFixed(2);
};
onShow(() => {
  operation();
  Info();
});

const calculateCommission = (base, ratePercent) => {
  if (isNaN(base) || isNaN(ratePercent)) {
    console.error("基数或提成比例必须是数字");
    return 0;
  }
  const rate = ratePercent / 100;
  const rawValue = base * (1 - rate);
  const roundedValue = Math.round(rawValue * 100) / 100;
  const commission = roundedValue.toFixed(2);
  return Number(commission);
};

const bindPickerChange = (e) => {
  index.value = e.detail.value;
};
const backFn = () => {
  uni.navigateBack({
    delta: 1,
  });
};

const scrollTop = ref(0);
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});
const BarTitle = ref("语音服务");
const type = ref("");
const point = ref({});
const updata = ref({});

onLoad((options) => {
  point.value = JSON.parse(options.point);
  type.value = options.type;
  if (options.update) {
    updata.value = JSON.parse(options.update);
    const { userId, serviceQuoteType, quoteAmount, serviceDuration, title } = updata.value;
    userInfo.value.id = userId;
    type.value = serviceQuoteType;
    price.value = quoteAmount;
    titleName.value = title;    
    index.value = serviceDuration == 15 ? 0 : serviceDuration == 30 ? 1 : serviceDuration == 60 ? 2 : 3;
  }
  options.type == 1 ? (BarTitle.value = "视频服务") : options.type == 2 ? (BarTitle.value = "语音服务") : (BarTitle.value = "文字服务");
});

const serviceAdd = () => {
  if(titleName.value == '') {
    uni.showToast({
      title: "请输入名称",
      icon: "none",
    });
    return;
  }
  if (price.value == "") {
    uni.showToast({
      title: "建议报价金额",
      icon: "none",
    });
    return;
  }
  const params = {
    userId: userInfo.value.id,
    serviceQuoteType: type.value,
    quoteAmount: price.value,
    title: titleName.value,
    serviceDuration:
      index.value == 0
        ? 15
        : index.value == 1
        ? 30
        : index.value == 2
        ? 60
        : 90,
  };
  if (updata.value.id != undefined) {
    const api = point.value.userRole == "1" ? consultantUpdate : listenerUpdate;
    api({ id: updata.value.id, ...params })
      .then((res) => {
        uni.showToast({ title: "报价成功", icon: "none" });
        setTimeout(() => {
          uni.navigateBack({ delta: 1 });
        }, 1500);
        updata.value = {};
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: "none",
        });
      });
  } else {
    const api = point.value.userRole == "1" ? consultantAdd : listenerAdd;
    api(params)
      .then((res) => {
        uni.showToast({ title: "报价成功", icon: "none" });
        setTimeout(() => {
          uni.navigateBack({ delta: 1 });
        }, 1500);
      })
      .catch((err) => {
        uni.showToast({
          title: err.message,
          icon: "none",
        });
      });
  }
};
</script>

<style lang="scss" scoped>
.settled-box {
  $statusBarHeight: v-bind(statusBarHeight);
  width: 100vw;
  min-height: 100vh !important;
  background-color: #f4f6f8;
  padding-bottom: 30rpx;

  .header {
    position: fixed;
    width: 100vw;
    height: 88rpx;
    z-index: 999;
    background-color: #f4f6f8;

    .header-bar {
      padding-top: calc($statusBarHeight - 122rpx);

      ::v-deep(.uni-nav-bar-text) {
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
      }
      .right {
        text-align: center;
        width: 250rpx;
        font-size: 28rpx;
        color: #fff;
        padding: 6rpx 20rpx;
        border-radius: 50rpx;
      }
      .right-1 {
        background-color: #35ca95;
      }
      .right-2 {
        background-color: #eb9516;
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
    padding-top: calc($statusBarHeight - 10rpx);

    .content-details {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: space-between;
      border-radius: 20rpx;
      .tips {
        width: 100%;
        padding: 20rpx 30rpx;
        font-size: 24rpx;
        color: #dd7c1e;
        background-color: #fffde4;
        border-radius: 20rpx 20rpx 0 0;
      }
      .content-list {
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .content-list-item {
          position: relative;
          font-size: 30rpx;
          font-weight: bold;
          image {
            position: absolute;
            top: 30rpx;
            width: 30rpx;
            height: 24rpx;
          }
        }
      }
      .content-header {
        width: 100%;
        border-bottom: 1rpx solid #f4f6f8;
        padding: 30rpx 0;
        .content-header-item {
          display: flex;
          justify-content: space-between;
          font-size: 28rpx;
        }
      }
      .text-tips {
        width: 100%;
        text-align: right;
        font-size: 24rpx;
        color: #a9a9a9;
        padding-right: 30rpx;
        background-color: #fff;
      }
    }
    .uni-list-cell {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 30rpx;
      background-color: #fff;

      .uni-list-cell-db {
        display: flex;
        align-items: center;
        image {
          margin-right: 20rpx;
        }
      }
      .uni-list-cell-db-1 {
        color: #35ca95;
      }
      .uni-list-cell-db-2 {
        color: #eb9516;
      }
    }
    .protocol {
      padding: 30rpx;
      color: #929495;
      view {
        padding: 10rpx 0;
      }
      text {
        font-size: 25rpx;
        padding-bottom: 10rpx;
      }
    }
  }
}
</style>
