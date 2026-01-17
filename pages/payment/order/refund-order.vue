<template>
  <view class="settled-box">
    <view class="header">
      <uni-nav-bar
        :class="scrollTop > 15 ? 'scrollClass' : ''"
        backgroundColor="rgba(255,255,255,0)"
        :border="false"
        title="申请退款"
        class="header-bar"
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
        <view class="user-info">
          <view class="user-name">
            <image :src="orderInfo.teacherAvatar" class="user-avatar" />
            <view>{{ orderInfo.teacherName }}</view>
          </view>
          <view class="order-info">
            <view>订单号：{{ orderInfo.orderSn }}</view>
            <image
              src="/static/order/ic-copy.png"
              style="width: 22rpx; height: 22rpx; margin-left: 10rpx"
              @click="copyText('Z20251119874653')"
            ></image>
          </view>
        </view>
        <view style="margin-top: 10rpx;">{{ orderInfo.serviceInfo }}</view>
        <view class="time">购买时长：<text>{{ orderInfo.buyDuration }}</text></view>
        <view class="time">服务方式：<text>{{ orderInfo.consultTypeDesc }}</text></view>
        <view class="time">剩余时长：<text>{{ orderInfo.remainingDuration }}</text></view>
        <view class="time">下单时间：<text>{{ orderInfo.createTime }}</text></view>
        <view class="time">到期时间：<text>{{ orderInfo.expireTime }}</text><view class="time-money">¥ {{ orderInfo.orderMoney }}</view></view>
      </view>
    </view>

    <view class="refund-reason">
      <view class="reason-title">请选择退款类型:<text>*</text></view>
      <view>
        <uni-data-select
          v-model="orderRefund.refundType"
          :localdata="range"
          @change="change"
          placeholder="请选择退款原因"
        ></uni-data-select>
      </view>
    </view>

    <view class="refund-reason">
      <view class="reason-title">请选择退款原因:<text>*</text></view>
      <view class="radio-group">
        <radio-group @change="radioChange">
          <radio
            v-for="(item, index) in radioList"
            :value="item.value"
            :key="index"
            activeBackgroundColor="#35CA95"
            style="margin: 0 20rpx 30rpx 0;"
          >
            <text>{{ item.value }}</text>
          </radio>
        </radio-group>
      </view>
    </view>

    <view class="refund-description">
      <view class="radio-group">
        <view style="margin-bottom: 20rpx">请在下方文本框内详情描述:</view>
        <textarea
          v-model="orderRefund.refundDesc"
          placeholder-style="color:#9E9E9E;padding: 20rpx"
          placeholder="请输入详情描述"
        />
      </view>
    </view>

    <view class="refund-btn-container">
      <view class="refund-btn" @click="applyRefundBut">确认退款</view>
    </view>

    <uni-popup ref="popup" type="center" :animation="false">
			<view class="popup-container">
        <image src="/static/auth/refund.png"></image>
				<view v-if="orderType =='continue'" class="popup-title">很遗憾</view>
				<view v-if="orderType =='continue'" class="popup-content">未能给你一个满意的服务体验</view>
				<view v-if="orderType =='continue'" class="popup-btn">
					<view class="popup-btn-text" @click="handleRefund">继续退款</view>
          <view class="popup-btn-text">|</view>
          <view class="popup-btn-text" @click="handleTeacher">换一位老师</view>
				</view>
				<view v-if="orderType =='success'" class="popup-content" style="margin-top: 50rpx;">退款成功</view>
        <view v-if="orderType =='success'" class="popup-title" style="margin: 0;">期待与您更好的重逢</view>
				<view v-if="orderType =='success'" class="popup-btn">
					<view class="popup-btn-text" @click="cancelPopup">关闭</view>
          <view class="popup-btn-text">|</view>
          <view class="popup-btn-text" @click="handleTeacher">看看其他老师</view>
				</view>
			</view>
		</uni-popup>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { useGlobalDataStore } from "@/stores/global.js";
import { onLoad, onPageScroll } from "@dcloudio/uni-app";
import { applyRefund } from "@/common/api/order.js";

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const scrollTop = ref(0);
const orderInfo = ref({});
const orderType = ref('continue');
const orderRefund = ref({
  orderSn: "",
  refundType: "",
  refundReason: "",
  refundDesc: "",
});

onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});

const backFn = () => {
  uni.navigateBack({
    delta: 1,
  });
};

const copyText = (text) => {
  uni.setClipboardData({
    data: text,
    success(e) {
      uni.showToast({
        title: "已复制",
      });
    },
  });
};

const range = ref([
  { value: '老师原因', text: "老师原因" },
  { value: '个人原因', text: "个人原因" },
  { value: '其他原因', text: "其他原因" },
])
const change = (e) => {
  orderRefund.value.refundType = e
}

const radioList = ref([
  { value: '暂不需要' },
  { value: '协商一致' },
  { value: '联系不上' },
  { value: '时间冲突' },
  { value: '期望落差' },
  { value: '老师原因' },
  { value: '其他原因' },
  { value: '服务太多不好', checked: 'true' },
])

onLoad((options) => {
  console.log(SON.parse(options.order));
  
  orderInfo.value = JSON.parse(options.order);
  orderRefund.value.orderSn = orderInfo.value.orderSn
})

const radioChange = (e) => {
  orderRefund.value.refundReason = e.detail.value
}

// 申请退款
const popup = ref(null)
const applyRefundBut = async () => {
if(orderRefund.value.refundType == '' || orderRefund.value.refundReason == '') {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    })
    return
  }
  popup.value.open('center');
}

// 退款
const handleRefund = async () => {
  try{
    const res = await applyRefund(orderRefund.value)
    uni.showToast({
      title: '申请退款成功',
      icon: 'success'
    });
    orderType.value = 'success'
  } catch(e) {

  }
}

// 换一位老师
const handleTeacher = () => {
  backFn()
}

// 关闭弹窗
const cancelPopup = () => {
  popup.value.close();
  backFn()
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

  .header {
    position: fixed;
    width: 100vw;
    height: 88rpx;
    z-index: 999;

    .header-bar {
      padding-top: calc($statusBarHeight - 80rpx);

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
    padding-top: calc($statusBarHeight);
    .clause {
      margin: 0 30rpx;
      padding: 30rpx;
      border-radius: 20rpx;
      background-color: #fff;
      .user-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10rpx;
        border-bottom: 1rpx solid #bdbdbd;
        .user-name {
          display: flex;
          align-items: center;
          image {
            width: 50rpx;
            height: 50rpx;
            border-radius: 50%;
            flex-shrink: 0;
            margin-right: 10rpx;
          }
        }
        .order-info {
          display: flex;
          align-items: center;
        }
      }
      .time {
        position: relative;
        padding: 10rpx 0;
        display: flex;
        align-items: center;
        color: #8C8C8C;
        text {
          color: #000000;
          margin-left: 10rpx;
        }
         .time-money{
          color: #000; font-size: 40rpx;font-weight: 500; position: absolute; top: 0rpx; right: 0;
        }
      }
    }
  }
  .refund-reason{
    margin: 30rpx;
    .reason-title{
      font-size: 28rpx;
      margin-bottom: 20rpx;
      text{
        color: #FF0000;
      }
    }
    .radio-group{
      background-color: #fff;
      border-radius: 20rpx;
      padding: 30rpx 30rpx 0;
    }
  }
  .refund-description{
    margin: 30rpx;
    background-color: #fff;
    padding: 20rpx;
    border-radius: 20rpx;
    height: 350rpx;
  }
  .refund-btn-container{
    display: flex;
    justify-content: center;
    .refund-btn{
      width: 350rpx;
      height: 70rpx;
      line-height: 70rpx;
      text-align: center;
      background-color: #35CA95;
      border-radius: 40rpx;
      color: #fff;
    }
  }
}
::v-deep .uni-select{
  border: none !important;
  padding: 10rpx 40rpx !important;
  height: 50px !important;
  border-radius: 20rpx !important;
}
::v-deep .uni-icons{
  color: #35CA95 !important;
}
::v-deep .uni-select__input-text{
  font-size: 25rpx !important;
  color: #35CA95 !important;
}
::v-deep .uni-radio-input{
  width: 15px !important;
  height: 15px !important;
}
::v-deep .uni-textarea-wrapper {
  height: 200rpx !important;
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
.popup-container{
  width: 500rpx;
  height: 280rpx;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: space-between;
  background-color: #fff;
  background-repeat: no-repeat;
  // padding: 50rpx 50rpx 0;
  border-radius: 20rpx;
  background-image: url("@/static/settled/settled-bg.png");
  background-size: 100vw 632rpx;
  background-repeat: no-repeat;
  position: relative;
  image{
    width: 100rpx;
    height: 100rpx;
    position: absolute;
    top: -20%;
    right: 40%;
  }
  .popup-title{
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 30rpx;
    font-size: 30rpx;
    font-weight: bold;
    margin-top: 50rpx;
    justify-content: center;
  }
  .popup-btn{
    display: flex;
    color: #a9a9a9;
    border-top: 1px solid #a9a9a9;
    margin-top: 30rpx;
    width: 100%;
    padding: 20rpx 0;
    justify-content: space-evenly;
    align-items: center;
    font-weight: bold;
  }
}
.popup-content{
  font-size: 25rpx;
  color: #a9a9a9;
}
</style>
