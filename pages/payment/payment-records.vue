<template>
	<div id="root">
	    <div class="main___9FDcp full-view-height">
	        <div class="full-width full-height">
	            <div class="page___2I6dD">
					<div class="itembox___3bAaX">
						<div class="seat___1RmSx"></div>
						<div class="monthSummary___2DL3P" style="position: static;">
							<div class="pick___3RLMZ">
								<div class="content___1ecku">
									<span>交易记录</span>
									<svg class="icon downIcon___Q4qac" aria-hidden="true">
										<use xlink:href="#icon-icon_tab_sx_nor"></use>
									</svg>
								</div>
							</div>
						</div>
						<div v-for="(item,index) in data.list" :key="index" class="recordItem___2uOUg">
							<div class="recordItem-right___2fZAr">
								<div class="recordItem-right-bom___2A4Xc">
									<div class="recordItem-right-bom-time___16iEH">
										{{item.createTime}}
									</div>
									<div class="recordItem-right-bom-time___16iEH">
										{{item.orderId}}
									</div>
									<div class="recordItem-right-bom-r___3rFTN">
										{{item.amount}}元
									</div>
									<div class="recordItem-right-bom-r___3rFTN" style="color: red;" v-if="item.status === 0">
										未支付
									</div>
									<div class="recordItem-right-bom-r___3rFTN" style="color: green;" v-else-if="item.status === 1">
										已支付
									</div>
									<div class="recordItem-right-bom-r___3rFTN" style="color: blue;" v-else-if="item.status === 3">
										已提现
									</div>
								</div>
							</div>
						</div>
						<div v-if="paymentList===[]" class="nodata___2AAad">
							该月暂无积分记录
						</div>
					</div>
	            </div>
	        </div>
	    </div>
	</div>
</template>

<script setup>
	import {
		onMounted,
		ref,
		reactive
	} from 'vue';
	import {
		getPaymentList
	} from "@/common/api/payment.js"
	const data = reactive({
		listParams:{
			"current": 1,
			"size": 10,
			"params":{
				
			}
		},
		list:[]
	})
	
	const getList = async () => {
		let res = await getPaymentList(data.listParams);
		data.list = res.data.records
	}
	
	onMounted(()=>{
		getList()
	})
	// import order from '@/api/order/order.js';
	// export default {
	// 	data() {
	// 		return {
	// 			listQuery: {
	// 				current: 1,
	// 				size: 20,
	// 				params: {
						
	// 				}
	// 			},
	// 			userInfo: {},
	// 			paymentList: []
	// 		}
	// 	},
	// 	onLoad() {
	// 		this.getPaymentRecords();
	// 	},
	// 	onReachBottom() {
	// 		this.listQuery.current++;
	// 		this.pageStatus = 'loading'
	// 		this.getPaymentRecords();
	// 	},
	// 	methods: {
	// 		getPaymentRecords(){
	// 			order.getPaymentRecords(this.listQuery)
	// 				.then(res => {
	// 					if(res.data.success){
	// 						console.log(res.data)
	// 						if(res.data.data.records.length==0){
	// 							this.pageStatus = 'noMore'
	// 						}
	// 						if(this.listQuery.current != 1){
	// 							this.paymentList = this.paymentList.concat(res.data.data.records);
	// 						} else {
	// 							this.paymentList = res.data.data.records;
	// 						}
	// 					}
	// 			})
	// 		},
	// 		toPayment(){
	// 			uni.navigateTo({
	// 				url:'/pages/mine/payment/payment'
	// 			})
	// 		},
	// 		toMyInvite(){
	// 			uni.navigateTo({
	// 				url:'/pages/my-invite/my-invite'
	// 			})
	// 		}
	// 	}
	// }
</script>

<style scoped>
	.recordItem-left___3Cmy5 {
		width: 4vw;
		height: 4vw;
		margin-right: 3.2vw
	}
	
	.recordItem-left___3Cmy5 image {
		display: block;
		width: 100%
	}
	
	.page___2I6dD>footer {
		position: fixed;
		right: 0;
		bottom: 0;
		z-index: 70 -1;
		width: 100%;
		height: 13.333vw;
		background: #fff;
		box-shadow: 0 -.533vw 1.067vw 0 rgba(50, 52, 60, .05)
	}
	
	.page___2I6dD>footer .box___3klne {
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
		-webkit-justify-content: space-between;
		-ms-flex-pack: justify;
		justify-content: space-between;
		box-sizing: border-box;
		height: 13.333vw;
		padding: 0 4vw
	}
	
	.page___2I6dD>footer .box___3klne>view {
		box-sizing: border-box;
		width: 92.534vw;
		height: 10.667vw;
		padding: 2.133vw 3.2vw;
		color: #0092ff;
		font-weight: 600;
		font-size: 4.267vw;
		line-height: 6.4vw;
		text-align: center;
		border: 1px solid #0092ff;
		border-radius: 1.067vw
	}
	
	.page___2I6dD>footer .box___3klne .feedback___2b_Uc {
		color: hsla(0, 0%, 100%, .95);
		background: #0092ff
	}
	
	.page___2I6dD>footer .box___3klne .red-spot___z55KT {
		position: relative
	}
	
	.page___2I6dD>footer .box___3klne .red-spot___z55KT:before {
		position: absolute;
		top: 1.867vw;
		right: 11.733vw;
		display: inline-block;
		width: 2.133vw;
		height: 2.133vw;
		background-color: #f74742;
		border-radius: 50%;
		content: ""
	}
</style>
