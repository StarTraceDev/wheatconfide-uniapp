<template>
  <view class="settled-box">
    <view class="header">
      <uni-nav-bar
        :class="scrollTop > 15 ? 'scrollClass' : ''"
        backgroundColor="rgba(255,255,255,0)"
        :border="false"
        title="订单详情"
        class="header-bar"
      >
        <template v-slot:left>
          <uni-icons type="left" size="24" @click="backFn"></uni-icons>
        </template>
      </uni-nav-bar>
    </view>
    <scroll-view
      scroll-y
      @scroll="onPageScroll"
      style="height: 100vh"
      :show-scrollbar="false"
    >
      <view class="consultation-content">
        <view class="notice-bar">
          <uni-icons type="sound" size="20" color="#F87171"></uni-icons>
          <view class="notice-text">
            为确保沟通顺畅，请提前确认设备是否开启对应麦克风权限>>
          </view>
        </view>

        <view class="appointment-info" v-if="orderInfo.status == 1 || orderInfo.status == 2">
          <view class="info-item" style="margin-top:0">
            <view class="info-label" style="color: #FF8F1F;">
              <uni-icons custom-prefix="iconfont" type="icon-deng" size="18" color="#FF8F1F" class="icon" />
              {{ getStatusText(orderInfo.status) }}
            </view>
          </view>
          <view class="info-item">
            <view v-if="orderInfo.status == 1" class="info-label info-text">订单自动释放剩余 <text>{{ orderInfo.remainingDuration}}</text></view>
            <view v-if="orderInfo.status == 2" class="info-label info-text">订单服务时长剩余 <text>{{ orderInfo.remainingDuration}}</text></view>
          </view>
        </view>
        <view class="user-info-section">
          <view class="user-details">
            <view class="user-name">
              <image :src="orderInfo.teacherAvatar" class="user-avatar" />
              <view class="user-info">
                <view>{{ orderInfo.teacherName }}</view>
                <view class="user-expertise">
                  <text>123{{ serviceExperience.platformHours }}+</text>
                  小时经验
                  <text>13{{ serviceExperience.years }}年</text>
                  从业
                  <text>2{{ serviceExperience.commentCount }}+</text>
                  评价
                </view>
              </view>
            </view>
            <view class="user-but" @click="handleChat">咨询历史</view>
          </view>
          <uni-icons type="chatboxes" color="#35ca95" size="30" @click="handleChat"></uni-icons>
        </view>

        <view class="appointment-info">
          <view class="info-title">服务信息</view>
          <!-- <view class="info-item">
            <view class="info-label">首单体验-电话</view>
          </view> -->
          <view class="info-item">
            <view class="info-label">购买时长：</view>
            <view class="consultation-methods">
              <text class="method-text">{{ orderInfo.buyDuration }}</text>
            </view>
          </view>
          <view class="info-item">
            <view class="info-label">服务方式：</view>
            <view class="consultation-methods">
              <view class="method-item" v-if="orderInfo.consultTypeDesc == '视频'">
                <uni-icons type="videocam" size="20" color="#34A76F" />
                <text class="method-text">视频</text>
              </view>
              <view class="method-item" v-if="orderInfo.consultTypeDesc == '语音'">
                <uni-icons type="mic" size="20" color="#34A76F" />
                <text class="method-text">语音</text>
              </view>
              <view class="method-item" v-if="orderInfo.consultTypeDesc == '文本'">
                <uni-icons type="mic" size="20" color="#34A76F" />
                <text class="method-text">文本</text>
              </view>
            </view>
          </view>
          <view class="info-item">
            <view class="info-label">预约时间：</view>
            <view class="info-value">{{ orderInfo.reserveDate }}</view>
          </view>
        </view>

        <view class="appointment-info">
          <view class="info-title">
            <view>订单信息</view>
            <view v-if="orderInfo.status == 2" class="info-refund" @click="handleClause">我要退款</view>
          </view>
          <view class="info-item">
            <view class="info-label">订单编号</view>
            <view class="consultation-methods" style="display: block;">
              <image
              src="/static/order/ic-copy.png"
              style="width: 22rpx; height: 22rpx; margin-right: 10rpx"
              @click="copyText(orderInfo.orderSn)"
            ></image>
              <text class="method-text">{{ orderInfo.orderSn }}</text>
            </view>
          </view>
          <view class="info-item">
            <view class="info-label">创建时间</view>
            <view class="info-value">{{ orderInfo.createTime  }}</view>
          </view>
          <view class="info-item">
            <view class="info-label">订单金额</view>
            <view class="info-value">￥{{ orderInfo.orderMoney}}</view>
          </view>
          <view class="info-item">
            <view class="info-label">支付方式</view>
            <view class="consultation-methods">
              <view class="method-item" v-if="orderInfo.payType == 'wxpay'">
                <image src="http://cdn.yupao.com/pc/images/zgp/recharge-pay-wechatimg.png"/>
                <text class="method-text">微信支付</text>
              </view>
              <view class="method-item" v-else>
                <image src="http://cdn.yupao.com/pc/images/zgp/recharge-pay-alipayimg.png"/>
                <text class="method-text">支付宝支付</text>
              </view>
            </view>
          </view>
        </view>
        <view class="appointment-info">
          <view class="info-protocol">
            <view>查看<text style="color: #34a76f" @click="gotoPrivacy('用户下单服务协议')">《用户下单服务协议》</text></view>
            <view style="color: #898686;" @click="handleComplaint">投诉</view>
          </view>
        </view>
        <view v-if="orderInfo.status == 1" @click="orderPay" class="appointment-but">立即支付</view>
        <view v-if="orderInfo.status == 2" @click="handleChat" class="appointment-but">立即联系</view>
        <view v-if="orderInfo.status == 3" @click="handleComment" class="appointment-but">立即评价</view>
      </view>
    </scroll-view>

    <uni-popup ref="popup" type="center" :animation="false">
			<view class="popup-container">
				<view class="popup-title">
          <view>退款须知</view>
          <image src="/static/index/warnings.png" style="width: 33rpx; height: 33rpx; margin-right: 10rpx"></image>
				</view>
				<view class="popup-content">
          <view class="list-item">订单剩余未服务时长在有效期内可退</view>
          <view class="list-item">如拨打过且通话时长>3分钟，根据实际使用时长，按照原价进行扣减后退费;</view>
          <view class="list-item">文字倾诉订单下单后未回复的，自动退款;</view>
				</view>
				<view class="popup-btn">
					<view class="popup-btn-text" @tap="closePopup">我知道了</view>
				</view>
			</view>
		</uni-popup>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";
import { useGlobalDataStore } from "@/stores/global.js";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { payment, wxPay, aliPay, orderList, payResult } from "@/common/api/order.js";
import { getUserInfo } from "@/common/api/apis.js";
import { usePayment } from "@/utils/usePayment.js";
import { orderDetail } from "@/common/api/order.js";
import { getServiceExperience } from "@/common/api/listener.js";
import { getServiceExperienceCon } from "@/common/api/consultant.js";

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const orderInfo = ref({});
const typeId = ref({});
const serviceExperience = ref({});

const getStatusText = (status) => {
  switch (status) {
    case 1:
      return "待付款";
    case 2:
      return "待咨询";
    case 3:
      return "待评价";
    case 4:
      return "已完成";
    case 5:
      return "交易关闭";
    case 6:
      return "退款";
    default:
      return "";
  }
};
onLoad((options) => {  
  typeId.value = JSON.parse(options.type);
  orderInfo.value = JSON.parse(options.status);
  console.log(typeId.value, orderInfo.value);
  orderDetailApi(orderInfo.value.orderSn);
  const api = options.colorType == 1 ? getServiceExperienceCon : getServiceExperience
  api({ id }).then((res) => {
    serviceExperience.value = res.data
  });
});

// 订单详情
const orderDetailApi = async (id) => {
  try {
    const { data } = await orderDetail(id);
    console.log(data);
    
  } catch (error) {
    console.log(error);
  }
}

onShow(() => {});
const scrollTop = ref(0);

const onPageScroll = (e) => {
  scrollTop.value = e.detail.scrollTop;
};
const backFn = () => {
  uni.navigateBack({
    delta: 1,
  });
};

const gotoPrivacy = (type) => {
  uni.navigateTo({
    url: `/pages/webview/webview?type=${type}`,
  });
};

// 投诉
const handleComplaint = () => {
  uni.navigateTo({
    url: "/pages/settings/complaint?id=" + orderInfo.value.teacherUserId,
  });
};

// 评价
const handleComment = () => {
  uni.navigateTo({
    url: `/pages/payment/order/evaluation-order?order=${JSON.stringify(orderInfo.value)}&colorType=1`,
  });
};

// 咨询
const handleChat = () => {
	const { teacherUserId, teacherName, teacherAvatar } = orderInfo.value
	uni.navigateTo({
		url: `/pages/message/private-chat?to=${teacherUserId}&name=${teacherName}&avatar=${teacherAvatar}&purchase=true`
	})
}

const content = ref("");
const getAgreementByType = async () => {
  try {
    const queryParams = {
      current: 1,
      size: 10,
      title: "咨询服务须知",
    };
    let { data } = await articleByType(queryParams);
    content.value = data.records[0].content;
  } catch (error) {
    console.log(error);
  }
};
getAgreementByType();

// const handleWay = (val) => {
//   consultation.value = !consultation.value;
// };

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

const popup = ref(null)
const handleClause = (val) => {
		popup.value.open('center');
	// clauseVal.value = val
}
const closePopup = () => {
  uni.navigateTo({
    url: `/pages/payment/order/refund-order?order=${JSON.stringify(orderInfo.value)}`,
  });
	popup.value.close();
}

const paymentMethod = ref("weixin");
const { 
  isLoading, 
  paymentStatus, 
  initPaymentChannels, 
  wechatPay, 
  alipay,
  PAYMENT_STATUS
} = usePayment()

// 微信支付处理
const orderPay = async (id) => {
	try {
		const api = paymentMethod.value == 'weixin' ? wxPay : aliPay
			const type = paymentMethod.value == 'weixin' ? 'wxPay' : 'aliPay'
			const res = await orderList(orderData.value)
			const { data } = await api({
					orderId: res.data.orderSn,
					amount: res.data.amount,
					type,
					status: 1
				})
				if(paymentMethod.value == 'weixin') {
					handleWechatPay(data.orderString)
				} else {
					handleAlipay(data.orderString, res.data.orderSn)
				}
		} catch (err) {
			message.value = err.message || '支付宝支付失败'
		}
}

// 支付宝支付处理
const handleAlipay = async (orderInfo, orderSn) => {
  try {
    const result = await alipay(orderInfo)
    payResultApi(orderSn)
  } catch (err) {
    message.value = err.message || '支付宝支付失败'
  }
}

// 微信支付处理
const handleWechatPay = async (orderInfo) => {
  try {
    const result = await wechatPay(orderInfo)
    if (result.status === PAYMENT_STATUS.SUCCESS) {
      message.value = '微信支付成功'
      // 处理支付成功逻辑（如跳转到成功页）
    }
  } catch (err) {
    message.value = err.message || '微信支付失败'
  }
}

// 支付结果
const payResultApi = async (orderSn) => {
	try {
		const result = await payResult({ orderSn })
		if (result.data.status == 2) {
			popupType.value = 'success'
			popup.value.open('center');
		}
	} catch (err) {
		message.value = err.message || '支付失败'
	}
}

</script>

<style lang="scss" scoped>
$primary-color: #333;
$secondary-color: #666;
$border-color: #d8d8d8;
$notice-color: #898686;
$spacing-small: 20rpx;
$spacing-medium: 30rpx;
$spacing-large: 40rpx;
$border-radius: 10rpx;

// 混合器
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin border-bg {
  background: #fff;
  margin: 10rpx 30rpx 30rpx;
  padding: 25rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.settled-box {
  $statusBarHeight: v-bind(statusBarHeight);
  width: 100vw;
  min-height: 100vh !important;
  background-color: #f4f6f8;

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

  .consultation-content {
    min-height: calc(100% + $statusBarHeight + 30rpx);
    padding-top: calc($statusBarHeight - 20rpx);

    .notice-bar {
      @include flex-center;
      font-size: 22rpx;
      padding: $spacing-small 0;

      .notice-text {
        color: $notice-color;
        margin-left: 10rpx;
      }
    }

    .user-info-section {
      @include border-bg;
      @include flex-between;
      padding: 20rpx 50rpx;
  
      .user-avatar {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .user-details {
        .user-name{
          display: flex;
          .user-info {
            margin-left: 20rpx;
          }
        }
        .user-but {
          margin-top: 20rpx;
          font-size: 23rpx;
          border-radius: 50rpx;
          border: 2rpx solid $border-color;
          padding: 5rpx;
          text-align: center;
          color: #35ca95;
        }
        .user-expertise {
          font-size: 23rpx;
          color: $secondary-color;

          text {
            color: #35ca95;
          }
        }
      }
    }

    .appointment-info {
      @include border-bg;

      .info-title {
        display: flex;
        justify-content: space-between;
        font-size: 35rpx;
        font-weight: 500;
        color: #333;
        .info-refund{
          font-size: 28rpx;
          color: #B2B2B2;
        }
      }
      .info-item {
        @include flex-between;
        margin-top: $spacing-small;
        .info-label {
          font-size: 28rpx;
          color: $primary-color;
        }

        .info-text {
          font-size: 23rpx !important;
          text {
            color: #898686;
          }
        }

        .info-value {
          font-size: 28rpx;
        }

        .consultation-methods {
          position: relative;
          display: flex;
          align-items: center;
          gap: 40rpx;

          .method-item {
            @include flex-center;
            image {
              width: 25rpx;
              height: 25rpx;
            }
            .method-text {
              margin-left: 10rpx;
              font-size: 26rpx;
            }
          }
        }
      }
      .info-protocol{
        @include flex-between;
        width: 100%;
      }
    }

    .consultation-plan-section {
      .plan-title {
        margin: 0 45rpx;
        font-size: 35rpx;
        font-weight: 500;
        color: #333;
      }
    }
    .appointment-but{
      margin: 50rpx 20rpx;
      padding: 10rpx;
      border-radius: 50rpx;
      @include flex-center;
      font-size: 32rpx;
      color: #fff;
      background: #35ca95
    }
  }
}
.popup-container{
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
  background-color: #fff;
  margin: 50rpx;
  padding: 30rpx;
  border-radius: 20rpx;
  .popup-title{
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 30rpx;
    padding-left: 30rpx;
    font-size: 30rpx;
  }
  .popup-btn{
    color: #fff;
    background-color: #35ca95;
    border-radius: 50rpx;
    padding: 10rpx 70rpx;
    margin-top: 30rpx;
  }
}
.popup-content{
  font-size: 25rpx;
  color: #333;
}
.list-item {
  position: relative; /* 相对定位，用于编号的绝对定位 */
  padding-left: 50rpx; /* 左侧留出空间放编号（编号宽度+间距） */
  margin-bottom: 20rpx; /* 项与项之间的间距 */
  line-height: 1.5; /* 行高，优化换行后的可读性 */
  counter-increment: list-counter; /* 计数器自增（用于自动生成编号） */
}

/* 生成编号（1.、2.、3. ...） */
.list-item::before {
  content: counter(list-counter) "."; /* 显示计数器值 + 点 */
  position: absolute; /* 绝对定位到左侧预留空间 */
  left: 0; /* 靠左对齐 */
  width: 40rpx; /* 固定编号宽度（确保1.和10.等宽度一致） */
  text-align: right; /* 编号靠右对齐，避免数字位数不同导致偏移 */
  color: #333; /* 编号颜色 */
  font-weight: bold; /* 编号加粗，与文字区分 */
  margin-right: 10rpx; /* 编号与文字之间的间距 */
}

/* 初始化计数器（从1开始） */
.numbered-list {
  counter-reset: list-counter 1;
}
</style>
