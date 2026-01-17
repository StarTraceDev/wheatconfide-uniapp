<template>
	<view class="settled-box">
		<view class="header">
			<uni-nav-bar :class="scrollTop > 15 ? 'scrollClass' : ''" backgroundColor="rgba(255,255,255,0)" :border="false"
				title="确认订单" class="header-bar">
				<template v-slot:left>
					<uni-icons type="left" size="24" @click="backFn"></uni-icons>
				</template>
			</uni-nav-bar>
		</view>
		<scroll-view scroll-y @scroll="onPageScroll" style="height: 100vh;" :show-scrollbar="false">
			<view class="consultation-content">
				<view class="notice-bar">
					<uni-icons type="sound" size="20" color="#F87171"></uni-icons>
					<view class="notice-text">
						为确保沟通顺畅，请提前确认设备是否开启对应麦克风权限>>
					</view>
				</view>
				<view class="user-info-section">
					<image :src="avatarImg" class="user-avatar"></image>
					<view class="user-details">
						<view class="user-name">
							<view>{{ titleName }}</view>
							<image src="/static/consult/user.png"></image>
						</view>
						<view class="user-expertise">{{ planTitle }}</view>
					</view>
				</view>
				<view class="appointment-info">
					<!-- <view class="info-item">
						<view class="info-label">预约时间</view>
						<view class="info-value">2025-11-02 09:25</view>
					</view> -->
					<view class="info-item">
						<view class="info-label">倾听方式</view>
						<view class="consultation-methods">
							<!-- <view class="method-item" :class="consultation == 1 ? 'method-item-active' : ''">
								<uni-icons type="compose" size="20" :color="consultation == 1 ? '#EB9516' : '#959596'"></uni-icons>
								<text class="method-text">视频</text>
							</view> -->
							<view class="method-item" :class="consultation == 3 ? 'method-item-active' : ''" >
								<uni-icons type="compose" size="20" :color="consultation == 3 ? '#EB9516' : '#959596'"></uni-icons>
								<text class="method-text">文字</text>
							</view>
							<view class="method-item" :class="consultation == 2 ? 'method-item-active' : ''" >
								<uni-icons type="mic" size="20" :color="consultation == 2 ? '#EB9516' : '#959596'"></uni-icons>
								<text class="method-text">语音</text>
							</view>
						</view>
					</view>
				</view>

				<view class="consultation-plan-section">
					<view class="plan-title">倾听方案</view>
					<view class="plan-list-container">
						<view class="plan-item" v-for="(plan, index) in planList" :key="index"
							:class="{ 'plan-item--active': plan.selected }" @click="selectPlan(plan, index)">
							<view class="plan-item-content">
								<view class="plan-info">
									<image :src="plan.selected
											? `/static/auth/${selectImg}.png`
											: '/static/auth/not-selected.png'
										" class="plan-select-icon"></image>
									<view class="plan-name">【{{ plan.title }}】{{ plan.serviceDuration }}分钟</view>
								</view>
								<view class="plan-price">￥{{ plan.quoteAmount }}</view>
							</view>
						</view>
					</view>
				</view>

				<view class="consultation-plan-section">
					<view class="plan-title">服务须知</view>
					<view class="please-note">
						<view class="note">
							<view>这里是内容，请仔细阅读了解是否存在以下描述的情况</view>
							<view class="note-text" :style="{'max-height': showMore ? 'none' : '200rpx'}">
								<view v-html="content"></view>
							</view>
							<view class="text-display" @click="showMore = !showMore">
								<uni-icons :type=" showMore ? 'up' :'down'" size="20" color="#959596" />
							</view>
							<view class="clause">
								<view class="clause-text disagree" @click="handleClause('disagree')">
									<image :src="`/static/auth/${clauseVal == 'disagree' ? selectImg : 'not-selected' }.png`" class="plan-select-icon" />
									<view :class="clauseVal == 'disagree'? 'clause-txt' : ''">存在以上情况</view>
								</view>
								<view class="clause-text agree" @click="handleClause('agree')">
									<image :src="`/static/auth/${clauseVal == 'agree' ? selectImg : 'not-selected' }.png`" class="plan-select-icon" />
									<view :class="clauseVal == 'agree'? 'clause-txt' : ''">不存在以上情况，且同意<text :style="{color: textColor}" @click="gotoPrivacy('用户下单服务协议')">《用户下单服务协议》</text></view></view>
							</view>
						</view>
					</view>
				</view>

				<view class="consultation-plan-section" style="margin-bottom: 100rpx;">
					<view class="plan-title">支付方式</view>
					<view class="please-note">
						<view class="note-pay" @click="handlePayment('weixin')">
							<view class="pay-item">
								<image src="http://cdn.yupao.com/pc/images/zgp/recharge-pay-wechatimg.png"></image>
								<view>微信支付</view>
							</view>
							<image :src="`/static/auth/${paymentMethod == 'weixin' ? selectImg : 'not-selected'}.png`" style="width: 25rpx; height: 25rpx"></image>
						</view>
						<view class="note-pay" @click="handlePayment('alipay')">
							<view class="pay-item">
								<image src="http://cdn.yupao.com/pc/images/zgp/recharge-pay-alipayimg.png"></image>
								<view>支付宝支付</view>
							</view>
							<image :src="`/static/auth/${paymentMethod == 'alipay' ? selectImg : 'not-selected'}.png`" style="width: 25rpx; height: 25rpx"></image>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="recharge-pay-footer">
			<view style="display: flex; margin-left: 20rpx">
				<view class="recharge-pay-price">¥{{ orderData.price }}<text>元/分钟</text></view>
			</view>
			<view style="display: flex; margin-right: 20rpx">
				<button :disabled="clauseVal == 'disagree'" class="recharge-sure-price" @click="orderPay">提交订单</button>
			</view>
		</view>
		
		<uni-popup ref="popup" type="center" :animation="false">
			<view class="popup-container" v-if="popupType == 'service'">
				<view class="popup-title">
					<uni-icons type="notification-filled" size="40" color="#35CA95"></uni-icons>
				</view>
				<view class="popup-content">
						抱歉，您存在的情况不适于咨询， 建议您选择更专业治疗，以便于给您提 供更好的服务。
				</view>
				<view class="popup-btn">
					<view class="popup-btn-text" @tap="closePopup">知道了</view>
				</view>
			</view>
			<view class="popup-order" v-if="popupType == 'success'">
				<view class="popup-order-header">
					<uni-icons custom-prefix="iconfont" type="icon-smile-full" size="30" color="#f7db79" class="icon" />
					<view class="popup-order-title">
						<view>恭喜您</view>
						<view>订单已成功支付！</view>
					</view>
				</view>
				<view class="popup-order-btn">
					<view @click="gotoOrder">查看订单</view>
					<view>|</view>
					<view @click="gotoIndex">返回首页</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useGlobalDataStore } from "@/stores/global.js";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { articleByType } from "@/common/api/apis.js";
import { usePayment } from '@/utils/usePayment.js'
import { listenerList } from '@/common/api/worry.js'
import { timeStrToSecondTimestamp } from '@/lib/utils.js'
import { payment, wxPay, aliPay, createListen, payResult } from "@/common/api/order.js";

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const consultation = ref(2);
const startColor = ref('#35ca955c');
const selectImg = ref('select-green')
const textColor = ref('#34a76f')
const showMore = ref(false);
const avatarImg = ref('');
const titleName = ref('');
const orderData = ref({
	listenerId: null, // 倾听师ID
	consultType: null, // 倾听方式
	voiceStartTime: null, // 语音开始时间
	duration: null, // 时长
	price: null // 价格
})

const props = defineProps({
  distinguish: {
    type: String,
    default: '1'
  },
});

onLoad((options) => {
	const { id, userId, avatar, name } = options
	avatarImg.value = avatar;
	titleName.value = name
	orderData.value.listenerId = id
	getlnfo(userId);
})

// 获取计划
const planList = ref([]);
const planTitle = ref('');
const getlnfo = async (id) => {
	let { data } = await listenerList(id)
  // let res = await getUserInfo();
	data.map((item, index) => {
		item.selected = index === 0 ? true : false
	})
	const { createTime, quoteAmount, serviceDuration, serviceQuoteType } = data[0]
	orderData.value.consultType = serviceQuoteType
	orderData.value.price = quoteAmount
	orderData.value.voiceStartTime = timeStrToSecondTimestamp(createTime)
	orderData.value.duration = serviceDuration
	planList.value = data
	planTitle.value = data[0].title
};

watch(() => props.distinguish, (newVal) =>{
	if(newVal == 'consultation') {
		startColor.value = '#35ca955c'
		selectImg.value = 'select-green'
		textColor.value = '#34a76f'
	} else {
		startColor.value = '#ffbb4166'
		selectImg.value = 'select-yellow'
		textColor.value = '#EB9516'
	}
	
}, {
	immediate: true,
	deep: true,
})

onShow(() => { });
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

const content = ref("");
const getAgreementByType = async () => {
  try {
		const queryParams = {
        current: 1,
        size: 10,
        title: '倾听服务须知',
      }
		let { data } = await articleByType(queryParams);		
    content.value = data.records[0].content;
	} catch (error) {
		console.log(error);
	}
};

const selectPlan = (plan, index) => {
	console.log(plan);
	
	planList.value.forEach((plan, i) => {
		plan.selected = i === index;
	});
	consultation.value = plan.serviceQuoteType
	const { createTime, quoteAmount, serviceDuration, serviceQuoteType } = plan
	orderData.value.consultType = serviceQuoteType
	orderData.value.price = quoteAmount
	orderData.value.voiceStartTime = timeStrToSecondTimestamp(createTime)
	orderData.value.duration = serviceDuration
	planTitle.value = plan.title
};

// 用户协议
const clauseVal = ref('agree');
const popupType = ref('service')
const popup = ref(null)
const handleClause = (val) => {
	popupType.value = 'service'
	if(val == 'disagree') {
		popup.value.open('center');
	}
	clauseVal.value = val
}

const closePopup = () => {
	popup.value.close();
}

// 查看订单
const gotoOrder = () => { 
	uni.navigateTo({
			url: `/pages/payment/order/listener-order`
	})
}

// 返回首页
const gotoIndex = () => {
	uni.switchTab({
		url: '/pages/index/index'
	})
}

const paymentMethod = ref('weixin')
const handlePayment = (val) => {
	paymentMethod.value = val
}

const { 
  isLoading, 
  paymentStatus, 
  initPaymentChannels, 
  wechatPay, 
  alipay,
  PAYMENT_STATUS
} = usePayment()

const orderPay = async (id) => {
	try {
			const api = paymentMethod.value == 'weixin' ? wxPay : aliPay
			const type = paymentMethod.value == 'weixin' ? 'wxPay' : 'aliPay'
			const res = await createListen(orderData.value)
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
			console.log(err);
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
onMounted(() => {
	getAgreementByType();
})
</script>

<style lang="scss" scoped>
::v-deep .uni-scroll-view-content{
	padding-bottom: 450rpx !important;
}
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

.settled-box {
	$statusBarHeight: v-bind(statusBarHeight);
	width: 100vw;
	min-height: 100vh !important;
	// background-image: url("@/static/settled/settled-bg.png");
	background-size: 100vw 232rpx;
	background-repeat: no-repeat;
	background-image: linear-gradient(to bottom, #FFE3B0 10%, rgba(255, 0, 0, 0) 45%, rgba(255, 0, 0, 0) 100%);
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
			display: flex;
			margin: $spacing-large 60rpx;
			padding-bottom: $spacing-medium;
			border-bottom: 2rpx solid $border-color;

			.user-avatar {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				flex-shrink: 0;
			}

			.user-details {
				width: 100%;
				margin-left: $spacing-medium;

				.user-name {
					display: flex;
					padding: 0 $spacing-small 10rpx 0;
					color: $primary-color;
					justify-content: space-between;
					image{
						width: 40rpx;
						height: 40rpx;
					}
				}

				.user-expertise {
					padding: 0 $spacing-small 0 0;
					color: $secondary-color;
				}
			}
		}

		.appointment-info {
			margin: 0 60rpx 50rpx;

			.info-item {
				display: flex;
				flex-direction: column;
				margin-bottom: $spacing-medium;

				.info-label {
					margin-bottom: 10rpx;
					font-size: 35rpx;
					font-weight: 500;
					color: #333;
				}

				.info-value {
					font-size: 28rpx;
				}

				.consultation-methods {
					display: flex;
					align-items: center;
					justify-content: space-evenly;
					gap: 40rpx;

					.method-item {
						@include flex-center;
							width: 170rpx;
							height: 60rpx;
							text-align: center;
							line-height: 60rpx;

						.method-text {
							margin-left: 10rpx;
							font-size: 26rpx;
						}
					}
					.method-item-active {
						border: 2rpx solid #EB9516;
						border-radius: 40rpx;
						color:#000;
						// padding: 10rpx 40rpx;
					}
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

			.plan-list-container {
				background: #fff;
				margin: 10rpx 30rpx 30rpx;
				padding: 20rpx 50rpx;
				border-radius: 20rpx;
				box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			}

			.plan-item {
				padding: 15rpx 0;
				border-radius: 12rpx;
				transition: all 0.3s ease;
				color: $secondary-color;

				&.plan-item--active {
					.plan-name {
						color: #000;
						font-weight: 500;
					}

					.plan-price {
						font-size: 35rpx;
						color: #000;
						font-weight: 500;
					}
				}

				.plan-item-content {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 15rpx;

					.plan-info {
						display: flex;
						align-items: center;
						flex: 1;
					}

					.plan-price {
						font-size: 35rpx;
						font-weight: 500;
						margin-left: 30rpx;
					}
				}

				&:active {
					opacity: 0.7;
					transform: scale(0.98);
				}
			}

			.plan-select-icon {
				width: 25rpx;
				height: 25rpx;
			}

			.please-note{
				background: #fff;
				margin: 10rpx 30rpx 20rpx;
				padding: 30rpx;
				border-radius: 20rpx;
				font-size: 26rpx;
				color: #575050;
				.note{
					.note-text{
						overflow: hidden;
						padding: 20rpx;
						view {
							padding: 10rpx 0;
						}
					}
					.text-display{
						text-align: center;
					}
					.clause{
						.clause-text{
							@include flex-center;
							justify-content: normal;
							padding-bottom: 20rpx;
							image {
								padding-right: 15rpx;
							}
							.clause-txt{
								color: #000;
							}
						}
					}
				}
				.note-pay{
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin: 20rpx 0;
					.pay-item{
						display: flex;
						align-items: center;
						image {
							width: 50rpx;
							height: 50rpx;
							margin-right: 30rpx
						}
					}
				}
			}
		}
	}
}

.recharge-pay-footer {
	position: fixed;
	display: flex;
	justify-content: space-between;
	align-items: center;
	left: 0;
	bottom: 0;
	width: 100%;
	padding: 30rpx 10rpx 10rpx;
	background: white;
	z-index: 100;
	box-shadow: #e8e6e3 0 0 5px;
}

.recharge-pay-price {
	font-size: 40rpx;
	color: v-bind(textColor);

	text {
		padding-left: 10rpx;
		font-size: 20rpx;
	}
}

.recharge-sure-price {
	background-color: v-bind(textColor);
	border-radius: 50rpx;
	padding: 0 40rpx;
	font-size: 24rpx;
	border: none;
	color: #fff;
}
.popup-container{
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	position: relative;
}
.popup-title{
	position: absolute;
	top: 10rpx;
	width: 22%;
	padding: 40rpx;
	border-radius: 50%;
	background-color: #fff;
	@include flex-center;
	z-index: 100;
}
.popup-content{
	width: 65%;
	margin-top: 100rpx;
	padding: 69rpx 40rpx 0;
	font-size: 28rpx;
	color: #333;
	line-height: 40rpx;
	background-color: #fff;
	border-radius: 20rpx 20rpx 0 0;
	line-height: 60rpx;
}
.popup-btn{	
	@include flex-center;
	background-color: #fff;
	width: 65%;
	border-radius: 0 0 20rpx 20rpx;
}
.popup-btn-text{
	@include flex-center;
	padding: 5rpx ;
	border-radius: 50rpx;
	font-size: 28rpx;
	width: 200rpx;
	color: #35CA95;
	border: 2rpx solid #35CA95;
	margin: 20rpx 0;
}
.popup-order{
	width: 500rpx;
	height: 300rpx;
	padding: 20rpx;
	border-radius: 20rpx;
	background-color: #fff;
}
.popup-order-header{
	@include flex-center;
	height: 80%;
}
.popup-order-title{
	margin-left: 40rpx;
}
.popup-order-btn{
	@include flex-center;
	justify-content: space-around;
	color: #9f9f9f;
	height: 20%;
}
</style>