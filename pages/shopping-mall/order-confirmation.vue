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
		<scroll-view scroll-y @scroll="onPageScroll" style="height: 100vh" :show-scrollbar="false">
			<view class="consultation-content">
				<view class="consultation-plan-section">
					<view class="plan-list-container">
						<view class="address-item">
							<view class="address-info" v-if="address.receiverPhone">
								<uni-icons type="location" size="30" color="#8D8D8D" class="icon"></uni-icons>
								<view>
									<view>{{ address.detailAddress }}</view>
									<view class="info-user">
										<view>{{ address.receiverName }}</view>
										<view>{{ address.receiverPhone }}</view>
									</view>
								</view>
							</view>
							<view class="address-info" v-else>请添加默认收货地址</view>
							<uni-icons type="right" size="30" @click="handleAddress"></uni-icons>
						</view>
					</view>
				</view>

				<view class="consultation-plan-section" v-for="(item, index) in orderData">
					<view class="plan-list-container" style="padding: 20rpx ;">
						<view class="cart-item-info">
							<image class="cart-item-img" :src="item.thumbnail" mode="widthFix"></image>
							<view class="cart-item-detail">
								<text class="cart-item-title">{{ item.productName }}</text>
								<view class="cart-item-spec">
									<text>{{ Object.values(item.specValues).join(";") }}</text>
									<text class="cart-item-price">¥{{ item.totalAmount }}</text>
								</view>
								<view class="count-group">
									<view class="count-btn minus-btn" @click="handleMinus(index)" :disabled="item.quantity <= 1">
										<view>-</view>
										<view class="line"></view>
									</view>
									<view class="count">{{ item.quantity }}</view>
									<view class="count-btn plus-btn" @click="handlePlus(index)">
										<view class="line"></view>
										<view>+</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="consultation-plan-section">
					<view class="plan-list-container">
						<view class="plan-item">
							<view>配送</view>
							<view>48小时发货</view>
						</view>
						<view class="plan-item">
							<view>运费</view>
							<view>{{ orderData.freeShipping == 1 ? '免运费' : `¥${goodsTotal}` }}</view>
						</view>
						<view class="plan-item">
							<view>商品总价</view>
							<view style="color: #de1718;">¥{{ freightTotal }}</view>
						</view>
						<view class="plan-item">
							<view>应付金额</view>
							<view style="color: #de1718;">¥{{ allTotal }}</view>
						</view>
					</view>
				</view>

				<view class="consultation-plan-section">
					<view class="please-note">
						备注
						<textarea
            v-model="orderData.remark"
            placeholder-style="color:#9E9E9E;padding: 20rpx"
            placeholder="这里是备注内容"
          />
					</view>
				</view>

				<view class="consultation-plan-section">
					<view class="plan-title">支付方式</view>
					<view class="please-note">
						<view class="note-pay" @click="handlePayment('weixin')">
							<view class="pay-item">
								<image src="http://cdn.yupao.com/pc/images/zgp/recharge-pay-wechatimg.png"></image>
								<view>微信支付</view>
							</view>
							<image :src="`/static/auth/${ paymentMethod == 'weixin' ? selectImg : 'not-selected'}.png`" style="width: 25rpx; height: 25rpx"></image>
						</view>
						<view class="note-pay" @click="handlePayment('alipay')">
							<view class="pay-item">
								<image src="http://cdn.yupao.com/pc/images/zgp/recharge-pay-alipayimg.png"></image>
								<view>支付宝支付</view>
							</view>
							<image :src="`/static/auth/${ paymentMethod == 'alipay' ? selectImg : 'not-selected'}.png`" style="width: 25rpx; height: 25rpx"></image>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="recharge-pay-footer">
			<button class="recharge-sure-price" @click="orderPay">立即支付 ¥{{ allTotal }}</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from "vue";
import { useGlobalDataStore } from "@/stores/global.js";
import { useOrderStore } from "@/stores/orderStore.js";
import { onShow, onLoad, onUnload } from "@dcloudio/uni-app";
import { payment, wxPay, aliPay, payResult } from "@/common/api/order.js";
import { usePayment } from '@/utils/usePayment.js'
import { getDefaultAddress, submitOrder } from '@/common/api/shoppingMall.js'

const scrollTop = ref(0);
const globalStore = useGlobalDataStore();
const orderStore = useOrderStore();
const purchaseType = ref('')
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const orderData = ref([]) // 订单数据

const onPageScroll = (e) => {
	scrollTop.value = e.detail.scrollTop;
};
const backFn = () => {
	uni.navigateBack({
		delta: 1,
	});
};

const selectImg = ref('select-green')
// 默认收货地址
const address = ref({})
const getDefaultAddressFn = async () => {
	try {
		const { data } = await getDefaultAddress()
		if(!data) return
		orderData.value.addressId = data.id
		address.value = data
	} catch (err) {
		console.log(err)
	}
}

// 更改地址
const handleAddress = () => {
	uni.navigateTo({
		url: '/pages/shopping-mall/delivery-address'
	})
}

// 数量加
const handlePlus = (index) => {
	orderData.value[index].quantity++
}

// 数量减
const handleMinus = (index) => {
	if(orderData.value[index].quantity > 1) {
		orderData.value[index].quantity--
	}
}

// 商品的总价
const goodsTotal = computed(() => {
  return orderData.value.reduce((total, item) => {
    // 只计算选中的商品: 单价 * 数量
    if (item.checked) {
      total += item.price * item.quantity
    }
    return total
  }, 0).toFixed(2) // 保留2位小数，金额必备
})

// 快递总运费
const freightTotal = computed(() => {
  return orderData.value.reduce((total, item) => {
    // 规则：选中+不包邮(freeShipping=0)的商品，才累加运费
    if (item.checked && item.freeShipping === 0) {
      total += item.freightFee
    }
    return total
  }, 0).toFixed(2)
})

// 所有费用合计总价
const allTotal = computed(() => {
  // 转数字计算，避免字符串拼接，再保留2位小数
  const total = Number(goodsTotal.value) + Number(freightTotal.value)
  return total.toFixed(2)
})

// 支付方式
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

// 微信支付处理
const orderPay = async (id) => {
	if(address.value.id == null) {
		uni.showToast({
			title: '请选择收货地址',
			icon: 'none'
		})
		return
	}
	try {
			const api = paymentMethod.value == 'weixin' ? wxPay : aliPay
			const type = paymentMethod.value == 'weixin' ? 'wxPay' : 'aliPay'
			const { id, addressId, currentSku, remark } = orderData.value
			const OrderInfo = {
				addressId,
				remark
			}
			if(purchaseType.value == 'shoppingCart') {
				OrderInfo.cartItemIds = orderData.value.map(item => item.id)
			} else {
				OrderInfo.directBuyItem = {
					productId: id,
					quantity: currentSku.quantity,
					skuId: currentSku.id
				}
			}
			const res = await submitOrder(OrderInfo)
			const { data } = await api({
					orderId: res.data.orderId,
					amount: res.data.orderAmount,
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
		}
	} catch (err) {
		message.value = err.message || '支付失败'
	}
}

onLoad((options) => {
	purchaseType.value = options.type
	
  if(options.type == 'purchase') {
		console.log([orderStore.order]);
		orderData.value = [orderStore.order]; 
  } else {
		orderData.value = orderStore.orderList
	}
})

onShow(() => {
	getDefaultAddressFn()
});

onUnload(() => {
	orderStore.clearOrder()
	orderStore.clearOrderList()
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
	background-image: linear-gradient(to bottom, #35ca955c, rgba(255, 0, 0, 0));
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
				.address-item{
					display: flex;
					align-items: center;
					justify-content: space-between;
					.address-info{
						display: flex;
						.icon{
							margin-right: 10rpx;
						}
						.info-user{
							margin-top: 10rpx;
							display: flex;
							align-items: center;
							view{
								margin-right: 20rpx;
							}
						}
					}
				}
				.cart-item-info {
					flex: 1;
					display: flex;
					gap: 20rpx;
					.cart-item-img {
						width: 160rpx;
						height: 160rpx;
						border-radius: 20rpx;
					}
					.cart-item-detail {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              margin-right: 30rpx;

              .cart-item-title {
                font-size: 28rpx;
                color: #333;
                line-height: 44rpx;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
              .cart-item-spec {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 28rpx;
                color: #999;
                margin: 10rpx 0;
              }
              .cart-item-price {
                font-size: 28rpx;
                color: #f00;
                font-weight: bold;
              }
              .count-group {
                display: flex;
                align-items: center;
                width: 180rpx;
                margin-top: 10rpx;
                background: #F6F5F6;
                color: #A2A2A2;
                padding: 0 10rpx;
                border-radius: 8rpx;
                .count-btn {
                  height: 50rpx;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 34rpx;
                  .line {
                    margin: 0 15rpx;
                    width: 2rpx;
                    height: 20rpx;
                    background: #A2A2A2;
                  }
                }
                .count {
                  width: 60rpx;
                  text-align: center;
                }
              }
            }
				}
				.plan-item {
					padding: 10rpx 0;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
			}
			.please-note{
				background: #fff;
				margin: 10rpx 30rpx 20rpx;
				padding: 30rpx;
				border-radius: 20rpx;
				font-size: 26rpx;
				color: #575050;


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
	padding: 20rpx 10rpx;
	background: white;
	z-index: 100;
	box-shadow: #e8e6e3 0 0 5px;
}

.recharge-sure-price {
	width: 100%;
	background-color: #34ca94;
	border-radius: 10rpx;
	padding: 0 40rpx;
	margin: 0 30rpx;
	font-size: 24rpx;
	border: none;
	color: #fff;
}

::v-deep .uni-radio-input {
  border-radius: 0;
}
::v-deep uni-textarea{
	width: 100%;
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