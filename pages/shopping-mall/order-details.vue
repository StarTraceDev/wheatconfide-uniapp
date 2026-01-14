<template>
  <view class="settled-box">
    <view class="header">
      <uni-nav-bar
        :class="scrollTop > 15 ? 'scrollClass' : ''"
        backgroundColor="rgba(255,255,255,0)"
        :border="false"
        :title="scrollTopTitle(orderInfo.orderStatus)"
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
      style="height: calc(100vh - 130rpx)"
      :show-scrollbar="false"
    >
      <view class="consultation-content">
        <view class="notice-bar">
          <uni-icons type="sound" size="20" color="#F87171"></uni-icons>
          <view class="notice-text">{{ getStatusInstruction(orderInfo.orderStatus) }}</view>
        </view>

        <view class="refund-info" v-if="orderInfo.orderStatus == 7">
          <view class="refund-title">{{ refundProgress(showRefundInfo.refundType, showRefundInfo.status) }}</view>
          <view class="refund-text">{{ refundContent(showRefundInfo.refundType, showRefundInfo.status) }}</view>
        </view>

        <view class="appointment-info" style="display: flex;padding: 30rpx 50rpx;">
          <uni-icons type="location" size="23" color="#888888" style="margin-right: 10rpx"></uni-icons>
          <view class="info-item" style="width: 100%;align-items: normal;flex-direction: column;margin-top: 0;">
            <view class="info-label">{{ orderInfo.receiverAddress }}</view>
            <view class="info-label info-text">
              <text>{{ orderInfo.receiverName }}</text>
              <text>{{ orderInfo.receiverPhone }}</text>
            </view>
          </view>
        </view>

        <!-- 商品信息 -->
        <view class="user-info-section">
          <view class="user-details">
            <image :src="orderInfo.items[0].thumbnail" class="user-avatar" />
            <view class="user-info">
              <view>{{ orderInfo.items[0].productName }}</view>
              <view class="info-item">
                <view class="item-text">{{ Object.values(JSON.parse(orderInfo.items[0].specValues)).join(";") }}</view>
                <view>¥{{ orderInfo.items[0].price }}</view>
              </view>
              <view class="item-text">x {{ orderInfo.items[0].quantity }}</view>
            </view>
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
              />
              <text class="method-text">{{ orderInfo.orderSn }}</text>
            </view>
          </view>
          <view class="info-item">
            <view class="info-label">创建时间</view>
            <view class="info-value">{{ orderInfo.createTime  }}</view>
          </view>
          <view class="info-item" v-if="orderInfo.payTime">
            <view class="info-label">支付时间</view>
            <view class="info-value">{{ orderInfo.payTime }}</view>
          </view>
          <view class="info-item">
            <view class="info-label">订单金额</view>
            <view class="info-value">￥{{ orderInfo.totalAmount }}</view>
          </view>
          <view class="info-item" v-if="orderInfo.orderStatus != 1">
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
        <!-- 快递 -->
        <view class="appointment-info" v-if="orderInfo.expressNo">
          <view class="info-express">
            <uni-icons custom-prefix="iconfont" type="icon-xiaohuoche" size="20" color="#9a9a9a" class="icon" />
            <view class="express-text">{{ orderInfo.expressCompany }}</view>
            <view class="express-code">
              <view>{{ orderInfo.expressNo }}</view>
              <image
                src="/static/order/ic-copy.png"
                style="width: 22rpx; height: 22rpx; margin-left: 10rpx"
                @click="copyText(orderInfo.orderSn)"
              />
            </view>
          </view>
          <view class="logistics-container">
            <view class="logistics-item" v-for="(item, index) in logisticsList.tracks" :key="index">
              <view class="logistics-node-wrap">
                <view class="logistics-node" :class="{ 'completed': item.isCompleted }"></view>
                <view class="logistics-line" v-if="index < logisticsList.tracks.length - 1"></view>
              </view>
              <view class="logistics-info">
                <view class="logistics-time">{{ item.time }}</view>
                <view class="logistics-status">{{ item.context }}</view>
              </view>
            </view>
          </view>
        </view>
        <RecommendedProduct v-if="!orderInfo.expressNo" style="margin-bottom: 50rpx;"/>
      </view>
    </scroll-view>

    <view class="footer">
      <view v-if="orderInfo.orderStatus == 1" class="btn-cart" @click="handleCancel">取消订单</view>
      <view v-if="orderInfo.orderStatus == 1" class="btn-buy"  @click="handleBuy">继续支付</view>
      <!-- <view class="btn-buy" @click="addToCart">退款</view>
      <view class="btn-buy"  @click="handleBuy">确认收货</view>
      <view class="btn-buy"  @click="handleBuy">查看评价</view>
      <view class="btn-buy"  @click="handleBuy">去评价</view> -->
    </view>

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
import { payment, wxPay, aliPay, express } from "@/common/api/order.js";
import { usePayment } from "@/utils/usePayment.js";
import { getOrderDetail, getRefundDetail } from '@/common/api/shoppingMall.js'
import { cancel } from '@/common/api/settings.js'
import RecommendedProduct from '@/components/Recommended-Product.vue';

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const orderInfo = ref({}); // 订单详情

// 状态说明
const getStatusInstruction = (status) => {
  const statusTextMap = {
    1: '未付款订单自动取消剩余：15分钟',
    2: '您订单的商品正在紧锣密鼓打包中',
    3: '快递正在途中快马加鞭，小主耐心等待',
    4: '感谢小主的耐心等待，希望商品让您满意',
    7: '非常抱歉没有让您选中满意的商品'
  }
  return statusTextMap[status] || '订单状态更新中...';
}

// 顶部标题
const scrollTopTitle = (val) => {
  const titleMap = {
    1: '待付款',
    2: '待发货',
    3: '待收货',
    4: '待评价',
    5: '已完成',
    6: '已取消',
    7: '售后中'
  }
  return titleMap[val] || '订单详情';
}

// 退款进度
const refundProgress = (refundType, status) => {
  const progressMap = {
     1: { // 1:仅退款
      1: '退款审核中',
      2: '退款请求通过',
      3: '退款申请拒绝',
      4: '退款成功'
    },
    2: { // 2:退货退款
      1: '退货审核中',
      2: '退货请求通过',
      3: '退货申请拒绝',
      4: '退款成功'
    },
    3: { // 3:换货
      1: '换货审核中',
      2: '换货请求通过',
      3: '换货申请拒绝',
      4: '换货成功'
    }
  }
  return progressMap[val]?.[status] || '退款中';
}

// 退款内容
const refundContent = (refundType, status) => {
  const contentMap = {
    1: { // 1:仅退款
      1: '请耐心等待工作人员审核',
      2: '仅退款请求已通过',
      3: '仅退款申请已拒绝',
      4: '退款金额已原路退回'
    },
    2: { // 2:退货退款
      1: '请耐心等待工作人员审核',
      2: '请及时上传退货物流信息',
      3: '退货退款申请已拒绝',
      4: '退款金额已原路退回'
    },
    3: { // 3:换货
      1: '请耐心等待工作人员审核换货申请',
      2: '请及时上传退货物流信息',
      3: '换货申请已拒绝',
      4: '退款金额已原路退回'
    }
  }
  return contentMap[refundType]?.[status] || '退款中';
}

// 快递查询
const logisticsList = ref({});
const expressApi = async () => {
  try {
    const { expressCompany, expressNo } = orderInfo.value;
    const { data } = await express({ expressCompany: '韵达快递' , expressNo: '428163465007284'  });
    data.tracks.forEach((item, index) => {
      item.isCompleted = index === 0;
    });
    logisticsList.value = data;
  } catch (e) {
    console.log(e);
  }
};

onLoad((options) => {  
  expressApi();
  getOrderDetail(options.id).then(res => {
    orderInfo.value = res.data
    console.log(res.data);
    if(res.data.orderStatus == 7) {
      getRefundDetailApi()
    } 
    if(res.data.orderStatus == 3) {
      expressApi();
    }
  })


  // typeId.value = JSON.parse(options.type);
  // orderInfo.value = JSON.parse(options.status);
  // const api = options.colorType == 1 ? getServiceExperienceCon : getServiceExperience
  // api({ id }).then((res) => {
  //   serviceExperience.value = res.data
  // });
});

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


// 售后详情
const showRefundInfo = ref({});
const getRefundDetailApi = async () => {
  try {
    const { data } = await getRefundDetail(orderInfo.value.id);
    showRefundInfo.value = data
  } catch (err) {
    console.log(err);
  }
}

const gotoPrivacy = (type) => {
  uni.navigateTo({
    url: `/pages/webview/webview?type=${type}`,
  });
};

// 投诉
const handleComplaint = () => {
  uni.navigateTo({
    url: "/pages/settings/complaint?id=" + orderInfo.value.userId,
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
	const { userId, teacherName, teacherAvatar } = orderInfo.value
	uni.navigateTo({
		url: `/pages/message/private-chat?to=${userId}&name=${teacherName}&avatar=${teacherAvatar}`
	})
}

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
  PAYMENT_STATUS,
} = usePayment();

// const paymentList = async () => {
// 	const res = await payment({ userId: "1018" });
// 	console.log(res);
// }
// paymentList();

// // 微信支付处理
// const handleWechatPay = async () => {
//   try {
//     // 从后端获取微信支付订单信息（示例）
//     const orderInfo = await getWechatOrder()
//     const result = await wechatPay(orderInfo)
//     if (result.status === PAYMENT_STATUS.SUCCESS) {
//       message.value = '微信支付成功'
//       // 处理支付成功逻辑（如跳转到成功页）
//     }
//   } catch (err) {
//     message.value = err.message || '微信支付失败'
//   }
// }

// // 支付宝支付处理
// const handleAlipay = async () => {
//   try {
//     // 从后端获取支付宝订单信息（示例）
//     const orderInfo = await getAlipayOrder()
//     const result = await alipay(orderInfo)
//     if (result.status === PAYMENT_STATUS.SUCCESS) {
//       message.value = '支付宝支付成功'
//       // 处理支付成功逻辑
//     }
//   } catch (err) {
//     message.value = err.message || '支付宝支付失败'
//   }
// }


const getAlipayOrder = async (val) => {
  const { data } = await aliPay(val);
  return data.orderString;
};

const orderPay = async (id) => {
  try {
    const { data } = await payment({ userId: "1018" });
    const orderInfo = await getAlipayOrder({
      amount: 0.01,
      orderId: data.records[0].orderId,
    });
    const result = await alipay(orderInfo);

    if (result.status === PAYMENT_STATUS.SUCCESS) {
      message.value = "支付宝支付成功";
    }
  } catch (err) {
    message.value = err.message || "支付宝支付失败";
  }
};

// 取消
const handleCancel = async () => {
  try {
    const res = await cancel({ orderSn: orderInfo.value.orderSn });
    uni.showToast({
      title: "取消成功",
      icon: "none",
    })
  } catch (err) {
    console.log(err);
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
      padding: $spacing-small;
      justify-content: flex-start;

      .notice-text {
        margin-left: 10rpx;
      }
    }

    .refund-info{
      @include flex-center;
      flex-direction: column;
      
      .refund-title{
        font-size: 38rpx;
      }
      .refund-text{
        font-size: 25rpx;
        color: $notice-color;
        margin: 15rpx 0 30rpx;
      }
    }

    .user-info-section {
      @include border-bg;
      @include flex-between;
      padding: 20rpx 50rpx 20rpx 20rpx;

      .user-details {
        width: 100%;
        display: flex;
        .user-avatar {
          width: 130rpx;
          height: 130rpx;
          border-radius: 20rpx;
          flex-shrink: 0;
        }
        .user-info {
          width: 100%;
          margin-left: 20rpx;
          .info-item {
            display: flex;
            justify-content: space-between;
          }
          .item-text{
            margin: 5rpx 0;
            color: #a2a2a2;
            font-size: 24rpx;
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
            margin-right: 10rpx;
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
      .info-express{
        display: flex;
        align-items: center;
        .express-text{
          margin: 0 20rpx;
        }
        .express-code{
          display: flex;
          align-items: center;
        }
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


.logistics-container {
  padding: 30rpx 20rpx;
}

.logistics-item {
  display: flex;
  position: relative;
}

.logistics-node.completed {
  background-color: #4cd964;
  border: none;
}

.logistics-node-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-right: 20rpx;
  width: 20rpx;
  flex-shrink: 0;
}

.logistics-node {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  border: 2rpx solid #ccc;
  background-color: #fff;
  z-index: 2;
  margin-bottom: -20rpx;
}

.logistics-line {
  width: 2rpx;
  min-height: 130rpx; 
  height: 100%;       
  background: repeating-linear-gradient(to bottom, #ccc, #ccc 6rpx, transparent 6rpx, transparent 12rpx);
  margin-top: 0;
  flex-shrink: 0;
}

.logistics-info {
  flex: 1;
}

.logistics-time {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.logistics-status {
  font-size: 26rpx;
  color: #737373;
  line-height: 40rpx;
  margin-bottom: 15rpx;
}

  .footer {
    width: 100vw;
    height: 108rpx;
    display: flex;
    background: #ffffff;
    position: fixed;
    bottom: 0rpx;
    justify-content: flex-end;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    .btn-cart{
      padding: 10rpx 50rpx;
      background-color: #f7f7f7;
      color: #939393;
      margin-right: 30rpx;
      border-radius: 10rpx;
    }
    .btn-buy{
      padding: 10rpx 50rpx;
      color: #fff;
      background-color: #ea9713;
      border-radius: 10rpx;
    }
  }
</style>
