<template>
	<view>
		<view class="new-recharge-box">
			<view class="recharge-info">
				<view class="need-recharge">
					<view>剩余积分：
						<text>{{lastPoint}}</text>
					</view>
					<view>
						充值金额：<text>{{money}}</text>元
					</view>
					<view>
						积分价格：<text>{{rate}}</text>元/个
					</view>
					<view>
						充值积分：<text>{{point}}</text>积分（可查看<text>{{phoneRate}}</text>个电话号码）
					</view>
				</view>
			</view>
			<view class="recharge-wrap">
				<view class="recharge-money-tips">请选择充值金额</view>
				<view class="recharge-new-choose clearfix">
					<view class="recharge-new-item" v-for="(item,index) in list" :key="index">
						<view :class="current == index ? 'recharge-new-box recharge-new-active' : 'recharge-new-box'" @click="handleClick(item,index)">
							<view class="recharge-new-money">
								<text>{{item.money}}</text>元
							</view>
							<view class="recharge-new-integral">
								<text>{{item.point}}</text>积分
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="recharge-pay-species">
				<view class="recharge-pay-wechat" @click="choosePay('wxPay')">
					<view class="recharge-pay-wechatflex">
						<image class="recharge-pay-wechatimg" src="http://cdn.yupao.com/pc/images/zgp/recharge-pay-wechatimg.png"></image>
						<text>微信支付</text>
					</view>
					<image v-if="payType==='wxPay'" class="recharge-pay-selected" src="http://cdn.yupao.com/pc/images/zgp/recharge-pay-selected.png"></image>
					<image v-else class="recharge-pay-select" src="http://cdn.yupao.com/pc/images/zgp/recharge-pay-select.png"></image>
				</view>
				<view class="recharge-pay-line"></view>
				<view class="recharge-pay-alipay" @click="choosePay('aliPay')">
					<view class="recharge-pay-wechatflex">
						<image class="recharge-pay-alipayimg" src="http://cdn.yupao.com/pc/images/zgp/recharge-pay-alipayimg.png"></image>
						<text>支付宝支付</text>
					</view>
					<image v-if="payType==='aliPay'" class="recharge-pay-selected" src="http://cdn.yupao.com/pc/images/zgp/recharge-pay-selected.png"></image>
					<image v-else class="recharge-pay-select" src="http://cdn.yupao.com/pc/images/zgp/recharge-pay-select.png"></image>
				</view>
			</view>
		</view>
		<view class="recharge-pay-footer">
			<view style="display: flex;margin-left: 20rpx;">
				<view class="recharge-pay-text">订单金额：</view>
				<view class="recharge-pay-price">
					￥：<text class="recharge-pay-money">{{money}}</text>
				</view>
			</view>
			<view style="display: flex;margin-right: 20rpx;">
				<button class="recharge-sure-price" @click="orderPay">确认支付</button>
			</view>
		</view>
		<uni-popup ref="popupDialog" type="dialog">
			<uni-popup-dialog :type="msgType" content="充值需要绑定微信,是否绑定?" @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		reactive
	} from 'vue';
	import {
		wxPay
	} from "@/common/api/order.js";
	const list = ref([{
			money:'600',
			point:'600'
		},{
			money:'800',
			point:'900'
		},{
			money:'1200',
			point:'1500'
		},{
			money:'2800',
			point:'4500'
		}
	])
	const current = ref(0)
	const providerList = ref(['wxpay','alipay'])
	const lastPoint = ref(0)
	const money = ref(600)
	const point = ref(600)
	const rate = ref(1.00)
	const msgType = ref('info')
	const payType = ref('wxPay')
	
	const handleClick = (item, index) => {
		current.value = index;
		money.value = item.money;
		point.value = item.point;
		rate.value = (item.money/item.point).toFixed(2);
		phoneRate.value = (item.point/3).toFixed(0);
	}
	
	const choosePay = (e) => {
		payType.value = e
	}
	
	const orderPay = async (id) => {
		let res = await wxPay({
			amount: money.value,
			type: 'wxPay'
		});
		
		uni.requestPayment({
			"provider": "wxpay",
			"orderInfo": res.data.data,
			success(res) {
				console.log(res);
				uni.navigateBack({
					delta:1
				})
			},
			fail(e) {
				console.log(e);
			}
		})

		consultantInfo.value = res.data;
	}
	
	// import wx from '@/api/wechat/wechat.js';
	// import order from '@/api/order/order.js';
	// export default {
	// 	data() {
	// 		return {
	// 		
	// 		}
	// 	},
	// 	onLoad:function(options){
	// 		this.lastPoint = options.point;
	// 		this.ifBind();
	// 	},
	// 	methods: {
	// 		ifBind(){
	// 			wx.isBind ({
	// 				// #ifdef APP-PLUS
	// 				bindType:'app',
	// 				// #endif
	// 				// #ifdef MP-WEIXIN
	// 				bindType:'wx',
	// 				// #endif
	// 			}).then(res => {
	// 				if(!res.data.success){
	// 					this.$refs.popupDialog.open()
	// 				}
	// 			})
	// 		},
	// 		pay(){
	// 			if(this.payType==='wxPay') {
	// 				// #ifdef MP-WEIXIN
	// 				order.wxPay({
	// 					amount: this.money,
	// 					type: 'wxPay'
	// 				}).then(res => {
	// 					uni.requestPayment({
	// 						"provider":"wxpay",
	// 						...res.data.data,
	// 					    success(res) {
	// 							console.log(res);
	// 							uni.navigateBack({
	// 								delta:1
	// 							})
	// 						},
	// 					    fail(e) {
	// 							console.log(e);
	// 						}
	// 					})
	// 				})
	// 				// #endif
	// 				// #ifdef APP-PLUS
	// 				order.wxpayApp({
	// 					amount:this.money,
	// 					type: 'wxPay'
	// 				}).then(res => {
	// 					uni.requestPayment({
	// 						"provider":"wxpay",
	// 						"orderInfo":res.data.data,
	// 					    success(res) {
	// 							console.log(res);
	// 							uni.navigateBack({
	// 								delta:1
	// 							})
	// 						},
	// 					    fail(e) {
	// 							console.log(e);
	// 						}
	// 					})
	// 				})
	// 				// #endif
	// 			} else {
	// 				order.aliPayApp({
	// 					amount:this.money,
	// 					type: 'aliPay'
	// 				}).then(res => {
	// 					uni.requestPayment({
	// 						provider: "alipay",
	// 						orderInfo: res.data.data,
	// 					    success(res) {
	// 							console.log(res);
	// 							uni.navigateBack({
	// 								delta:1
	// 							})
	// 						},
	// 					    fail(e) {
	// 							console.log(e);
	// 						}
	// 					})
	// 				})
	// 			}
	// 		},
	// 		dialogConfirm() {
	// 			uni.navigateTo({
	// 				url:'../../system'
	// 			})
	// 		},
	// 		dialogClose() {
	// 			console.log('ok')
	// 		},
	// 	
	// 	}
	// }
</script>

<style scoped>
	* {
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
	/*伪类清除浮动*/
	.clearfix::after{
		display:block;
		content:"";
		height:0;
		clear:both;
		overflow:hidden;
		visibility:hidden;
		zoom:1;
	}
	/*新充值布局*/
	.new-recharge-box{
		 width: 100%;
		 padding: 5rpx 10rpx;
		 background-color: #f7f6f9;
	}
	.recharge-info{
		 left: 0;
		 top: 0;
		 width: 100%;
		 height: auto;
		 padding: 0.2rem 0 0;
		 background: white;
	}
	.recharge-info .need-recharge{
		padding: 1rpx 20rpx;
		font-style: normal;
		color: #ff6b61;
		line-height: 50rpx;
		font-size:30rpx;
	}
	.recharge-wrap{
		 width: 100%;
		 padding: 0.2rem 0 0;
		 background: white;
		 margin-top: 10rpx;
		 border-radius: 3px;
		 box-shadow: #e7e6e4 0 0 0.1rem;
	}
	.recharge-money-tips{
		 color: #333333;
		 padding: 1rpx 20rpx;
		 line-height: 60rpx;
	}
	.recharge-new-choose{
		 padding: 1rpx;
	}
	.recharge-new-item{
		 /* #ifdef MP-WEIXIN */
		  width: 30.333%;
		 /* #endif */
		 /* #ifndef MP-WEIXIN */
		  width: 33.333%;
		 /* #endif */
		 height: 100rpx;
		 float: left;
		 padding: 0 10rpx;
		 margin-bottom: 20rpx;
		 overflow: hidden;
	}
	.recharge-new-box{
		 background: white;
		 height: 100rpx;
		 border-radius: 3px;
		 padding: 0.15rem 0;
		 border:1px solid #f4f4f4;
	}
	.recharge-new-box view{
		 text-align: center;
		 line-height: 40rpx;
	}
	.recharge-new-money{
		 color: #333;
	}
	.recharge-new-integral{
		 color: #adadad;
	}
	.recharge-new-active{
		 background: #ff6b61;
		 border-color: #ff6b61;
	}
	.recharge-new-active view{
		 color: #fff;
	}
	.recharge-new-active::after{
		 position: absolute;
		 content: '';
		 width: 0.38rem;
		 height: 0.38rem;
		 right: 0px;
		 bottom: 0px;
		 background: url("https://cdn.yupao.com/newyupao/v2.1.8/images/recharge-select.png") no-repeat;
		 background-size: 100% 100%;
	}
	.recharge-btn-sure{
		 height: 0.9rem;
		 line-height: 0.7rem;
		 font-size: 0.3rem;
	}
	.recharge-pay-species {
		width: 100%;
		padding: 2rpx 10rpx ;
		background: white;
		margin-top: 10rpx;
		border-radius: 3px;
		box-shadow: #e7e6e4 0 0 0.1rem;
		font-size: 14px;
	}
	.recharge-pay-species text {
		color: #333;
	}
	.recharge-pay-wechat,
	.recharge-pay-alipay {
		display: flex;
		justify-content: space-between;
		align-items: center;
		line-height: 80rpx;
	}
	
	.recharge-pay-wechatimg,
	.recharge-pay-alipayimg {
		width: 23px;
		height: 23px;
		margin-right: 13px;
	}
	
	.recharge-pay-selected,
	.recharge-pay-select {
		width: 14px;
		height: 14px;
	}
	
	.recharge-pay-wechatflex {
		display: flex;
		align-items: center;
	}
	
	.recharge-pay-line {
		border-bottom: 1px dashed #E6E1E1;
		margin: .2rem 0;
	}
	
	.recharge-pay-footer {
		position: fixed;
		display: flex;
		justify-content: space-between;
		align-items: center;
		left: 0;
		bottom: 0;
		width: 100%;
		padding: 10rpx 10rpx;
		background: white;
		z-index: 100;
		box-shadow: #e8e6e3 0 0 5px;
	}
	.recharge-pay-text {
		font-size: 15px;
		color: #3F3F3F;
		font-weight: 600;
	}
	.recharge-pay-price {
		font-size: 14px;
		color: #FB0808;
	}
	.recharge-sure-price {
		background-color: #ff6b61;
		border: none;
		color: #fff;
	}
</style>
