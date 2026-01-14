<template>
  <view class="settled-box">
    <view class="header">
      <uni-nav-bar
        :class="scrollTop > 15 ? 'scrollClass' : ''"
        backgroundColor="rgba(255,255,255,0)"
        :border="false"
        title="账单"
        class="header-bar"
      >
        <template v-slot:left>
          <uni-icons type="left" size="24" @click="backFn"></uni-icons>
        </template>
      </uni-nav-bar>
    </view>

    <view class="content">
      <view class="content-title">
         <view :class="tabInexd == 1 ? 'hove-view' : 'view'" @click="tabClick(1)">收入记录</view>
         <view :class="tabInexd == 2 ? 'hove-view' : 'view'" @click="tabClick(2)">提现记录</view>
    </view>
      <view class="content-details">
        <view class="detail-item">
          <view>{{ tabInexd == 1 ? '当前收益' : '累计提现' }}</view>
          <text>{{ tabInexd== 1 ? moneyData.monthlyIncome : moneyData.unsettledAmount }}</text>
        </view>
        <!-- <view class="detail-item" v-if="tabInexd == 2">
          <view>累计提现</view>
          <text>{{ moneyData.unsettledAmount }}</text>
        </view> -->
        <view class="uni-list-cell" @click="showTimePicker">
          <view class="uni-list-cell-left">
            <uni-icons type="calendar" size="20" color="#fff"></uni-icons>
            <text>{{ timeText }}</text>
          </view>
          <view class="uni-list-cell-db">
            <u-picker
              type="text"
              v-model="birthdayShow"
              :params="timeParams"
              mode="time"
              @confirm="confirmBirthday"
            ></u-picker>
          </view>
        </view>
      </view>
      <view class="clause" v-if="tabInexd == 1">
        <view class="clause-item" v-for="(item, index) in withdrawalData" :key="index">
          <view class="item-head">
            <view class="head-left">
              <view>订单编号</view>
              <view class="order-number">{{ item.orderSn }}</view>
              <image src="/static/order/ic-copy.png" @click="pasteId(item.orderSn)"></image>
            </view>
            <view class="head-right">{{ item.createTime }}</view>
          </view>
          <view class="item-content">
            <view class="content-left">
              <view class="left-top">
                <image :src="type.avatar"></image>
                <view>{{ type.realName }}</view>
              </view>
              <view class="left-bottom">
                <view><text>服务方式：</text>{{ item.consultTypeDesc }}</view>
                <view><text>购买时长：</text>{{ item.serviceInfo }} </view>
              </view>
            </view>
            <view class="content-right">
               <view>+{{ item.amount }}</view>
               <text>{{ item.statusDesc }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="clause" v-if="tabInexd == 2">
        <view class="clause-item" style="flex-direction: row" v-for="(item, index) in withdrawalData" :key="index">
          <view class="item-gold">
            <view class="gold-icon">
              <image src="/static/order/gold-coin.png"></image>
            </view>
            <view class="gold-content">
              <view>提现</view>
              <view class="gold-time">{{ item.applyTime }}</view>
            </view>
          </view>
          <view class="item-coin">
            <view class="gold-num">-{{ item.amount }}</view>
            <view class="gold-status">(审核中)</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useGlobalDataStore } from "@/stores/global.js";
import { onLoad, onPageScroll } from "@dcloudio/uni-app";
import { summary, withdraw, wallet } from "@/common/api/order.js";

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const paramsList = ref({
  current: 1,
  size: 10,
  params: {
    startTime: "", //开始时间
  }, 
})
const timeParams = ref({
  year: true,
  month: true,
  day: true,
  hour: false,
  minute: false,
  second: false,
});
const tabInexd = ref(1)
const birthdayShow = ref(false);
const timeText = ref('请选择时间')
const confirmBirthday = (e) => {
  timeText.value = `${e.year}-${e.month}-${e.day}`
  paramsList.value.params.startTime = `${e.year}-${e.month}-${e.day}`
  list(tabInexd.value)
};
const type = ref({})
onLoad((options) => {
  type.value = JSON.parse(options.type);
})
const showTimePicker = () => {
  birthdayShow.value = true;
};

const moneyData = ref({
  monthlyIncome: 0, //本月收益
  unsettledAmount: 1, //未结算金额
  withdrawableAmount: 0, //可提现余额
  totalAssets: 0, //我的资产
});

const tabClick = (index) => {
  tabInexd.value = index
  list(index)
};
const withdrawalData = ref([]);
const list = async (index) => {
  try {
    const api = index == 1 ? wallet : withdraw
    const { data } = await api(paramsList.value);
    withdrawalData.value = data.records;
  } catch (error) {
    console.log(error);
  }
};
const withdrawal = async () => {
  try {
    const { data } = await summary();
    moneyData.value = data
  } catch (error) {
    console.log(error);
  }
};


onMounted(() => {
  list(1);
  withdrawal();
});

const backFn = () => {
  uni.navigateBack({
    delta: 1,
  });
};
const scrollTop = ref(0);

onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});

const pasteId = (id) => {
  console.log(id);
  
  uni.setClipboardData({
    data: id
  });
  uni.showToast({
    title: "复制成功",
    icon: "none",
  });
}
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
      .content-title {
         display: flex;
             align-items: center;

    justify-content: space-between;
    margin:0 60rpx;
    .hove-view{
       font-size: 35rpx;border-bottom: 10rpx solid #35ca95;padding-bottom: 10rpx;
    }
      .view{
        font-size: 30rpx;
        padding-bottom: 10rpx;
      }
      }
    .content-details {
      margin: 30rpx;
      padding: 50rpx;
      color: #fff;
      background-color: #35ca95;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 20rpx;

      .detail-item {
        display: flex;
        flex-direction: column;

        text {
          margin-top: 10rpx;
          font-size: 36rpx;
        }
      }
    }

    .clause {
      margin: 30rpx;
      border-radius: 20rpx;
      background-color: #fff;

      &-item {
        padding: 30rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 20rpx;
         flex-direction: column;
         border-bottom: 3rpx solid #f4f6f8;
        .item-head {
          display: flex;
          align-items: center;
          font-size: 23rpx;
          width: 100%;
          justify-content: space-between;
          .head-left {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .order-number {
              color: #9e9e9e;
              margin-left: 10rpx;
            }
            image {
              width: 15rpx;
              height: 20rpx;
              margin-left: 10rpx;
            }
          }
          .head-right {
            color: #9e9e9e;
          }
        }
        .item-content{
         display: flex;
         align-items: center;
         justify-content: space-between;
         width: 100%;
         .content-left{
                
         .left-top{
            display: flex;
            align-items: center;
            margin: 15rpx 0;
            image {
               margin-right: 10rpx;
              width: 70rpx;
              height: 70rpx;
              border-radius: 50%;
            }
         }
         .left-bottom{
            font-size: 23rpx;
            display: flex;
            align-items: center;
            view{
               margin-right: 15rpx;
            }
            text{
               color: #9E9E9E;
               margin-right: 10rpx;
            }
         }
         }
         .content-right{
                display: flex;
               flex-direction: column;
               align-items: center;
               view{
                  font-size: 35rpx;
                  color: #35CA95;
               }
               text{
                  font-size: 20rpx;
                  color: red;
               }
         }
        }
        .item-gold{
          display: flex;
          align-items: center;
          .gold-icon{
            background-color: #f7f6f9;
            width: 70rpx;
            height: 70rpx;
            border-radius: 50%;
            margin-right: 10rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            image {
              width: 35rpx;
              height: 38rpx;
              
            }
          }
          .gold-content{
            .gold-time{
              font-size: 26rpx;
              color: #b8bab9;
            }
          }
        }
        .item-coin{
          display: flex;
          flex-direction: column;
          align-items: center;

          .gold-num{
            color: #eca350;
            font-weight: bold;
            font-size: 35rpx;
          }
          .gold-status{
            font-size: 20rpx;
            color:#dd5f62;
          }
        }
      }
    }
  }
}
.uni-list-cell-left {
  display: flex;
  align-items: center;
  text {
    margin-left: 20rpx;
  }
}
</style>
