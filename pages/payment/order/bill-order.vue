<template>
  <view class="settled-box">
    <view class="header" >
      <uni-nav-bar :class="scrollTop > 15 ? 'scrollClass' : ''" backgroundColor="rgba(255,255,255,0)" :border="false" title="账单" class="header-bar">
        <template v-slot:left>
          <uni-icons type="left" size="24" @click="backFn"></uni-icons>
        </template>
        <template v-slot:right>
          <view class="right">
            <image src="/static/confide/share.png" style="width: 40rpx;height: 40rpx;"></image>
          </view>
        </template>
      </uni-nav-bar>
    </view>
    <view class="content">
      <view class="content-details">
        <view class="detail-item">
          <view>支出</view>
          <view>158 元</view>
        </view>
        <view>｜</view>
        <view class="detail-item">
          <view>退款</view>
          <view>56 元</view>
        </view>
      </view>
      <view class="content-tiem">
        <uni-datetime-picker
          type="date"
          placeholder="选择开始日期"
          :value="single"
          @change="change"
        />
        <view>——</view>
        <uni-datetime-picker
          type="date"
          placeholder="选择结束日期"
          :value="single"
          @change="change"
        />
      </view>
      <view class="clause" v-for="(item, index) in clauses">
        <view class="clause-item">
          <view class="item-head">
            <view class="head-left">
              <view>头像</view>
              <view>张三</view>
            </view>
            <view class="head-right">
              <view>订单号：{{ item.orderNumber }}</view>
              <image src="/static/order/ic-copy.png" style="width: 28rpx;height: 28rpx;margin-left: 15rpx;"
                @click="copyText(item.orderNo)"></image>
            </view>
          </view>
          <view class="item-content">
            <view class="content-left">
              <view>{{ item.title }}</view>
              <view><text>购买时长：</text>{{ item.time }}</view>
              <view><text>服务方式：</text>{{ item.service }}</view>
              <view><text>剩余时间：</text>{{ item.remainingTime }}</view>
              <view><text>下单时间：</text>{{ item.timeOrder }}</view>
              <view><text>到期时间：</text>{{ item.timeExpiration }}</view>
              <view><text>订单金额：</text>{{ item.amountOrder }}</view>
            </view>
            <view class="content-right">
              <view>{{ item.amountOrder }}</view>
              <text>支出</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { useGlobalDataStore } from '@/stores/global.js';
import { onShow, onPageScroll } from '@dcloudio/uni-app'

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + 'px');

onShow(() => {})

const backFn = () => {
  uni.navigateBack({
    delta: 1
  })
}
const scrollTop = ref(0);

onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});

const clauses = ref([
  {
    orderNumber: 78567564565,
    title: "婚姻关系咨询",
    time: '10分钟',
    service: '语音咨询',
    remainingTime: '10:00',
    timeOrder: '2024-06-01 14:30',
    timeExpiration: '2024-06-01 15:30',
    amountOrder: '￥200',
  },
  {
    orderNumber: 78567564565,
    title: "婚姻关系咨询",
    time: '10分钟',
    service: '语音咨询',
    remainingTime: '10:00',
    timeOrder: '2024-06-01 14:30',
    timeExpiration: '2024-06-01 15:30',
    amountOrder: '￥200',
  },
  {
    orderNumber: 78567564565,
    title: "婚姻关系咨询",
    time: '10分钟',
    service: '语音咨询',
    remainingTime: '10:00',
    timeOrder: '2024-06-01 14:30',
    timeExpiration: '2024-06-01 15:30',
    amountOrder: '￥200',
  },
]);

const copyText = (text) => {
  uni.setClipboardData({
    data: text,
    success(e) {
      uni.showToast({
        title: "已复制"
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.settled-box {
  $statusBarHeight: v-bind(statusBarHeight);
  width: 100vw;
  min-height: 100vh !important;
  background-image: url("@/static/settled/settled-bg.png");
  background-size: 100vw 632rpx;
  background-repeat: no-repeat;
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
  .scrollClass{
    background-color: #fff;
    box-shadow: 0rpx 4rpx 20rpx rgba(0, 0, 0, 0.1);
    ::v-deep(.uni-nav-bar-text) {
      color: #000;
    }
  }

  .content {
    padding-top: calc($statusBarHeight - 20rpx);
    .content-details{
      margin: 30rpx;
      padding: 50rpx;
      color: #fff;
      background-color: #35CA95;
      display: flex;
      align-items: center;
      justify-content: space-around;
      border-radius: 20rpx;
      .detail-item{
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
    .content-tiem{
      margin: 30rpx;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      view{
        color: #D8D8D8;
        margin: 0 10rpx;
      }
    }
    .clause {
      margin: 30rpx;
      padding: 30rpx;
      border-radius: 20rpx;
      background-color: #fff;
        &-item{
          .item-head{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding-bottom: 10rpx;
            border-bottom: 3rpx solid #F0F0F0;

            .head-left{
              display: flex;
              flex-direction: row;
            }
            .head-right{
              display: flex;
              flex-direction: row;
              align-items: center;
              image{
                width: 28rpx;
                height: 28rpx;
                margin-left: 15rpx;
              }
            }
          }
          .item-content{
            padding-top: 20rpx;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            .content-left{
              view{
                margin-top: 10rpx;
              }
              text {
                color: #9E9E9E;
              }
            }
            .content-right{
              padding-right: 40rpx;
              display: flex;
              flex-direction: column;
              align-items: center;
              view{
                font-size: 36rpx;
                font-weight: 600;
              }
              text{
                color:#35CA95;
              }
            }
          }
        }
    }
  }
}
</style>