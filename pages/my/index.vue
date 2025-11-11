<template>
	<view class="my-box">
		<view class="my-top-content">
			<image src="@/static/my/my-top-bg.png"></image>
		</view>
		<view class="container">
			<view class="user-info">
				<view>
					<image :src="userlnfo.avatar==null?'/static/my/profile.png':userlnfo.avatar" mode="aspectFill" class="profile"></image>
				</view>
				<view class="user-info-content">
					<view>
						<view class="nick-name" @click="toUserInfo">{{userlnfo.realName}}<uni-icons type="right"
								size="16"></uni-icons></view>
					</view>
					<view style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;">
						<view class="id-num" style="flex: 1;">
							<text>ID：{{userlnfo.id}}</text>
							<image src="/static/my/copy.png" class="copy"></image>
						</view>
						<picker :range="userRole" @change="changeRoleFunc" style="margin-right: 50rpx;">
							<!--  @click="changeRole" -->
							<view class="change-user-box">
								<view class="change-user">{{currRole}}
									<image src="@/static/my/bottom-arrow.png" class="bottom-arrow"></image>
								</view>
							</view>
						</picker>
						<!-- <view class="change-user-box" @click="changeRole1">
							<view class="change-user">咨询师
								<image src="@/static/my/bottom-arrow.png" class="bottom-arrow"></image>
							</view>
						</view> -->
					</view>
				</view>


			</view>
			<view class="my-record-number">
				<view class="item">
					<view class="num">401</view>
					<view class="txt">我的咨询</view>
				</view>
				<view class="item" @click="toPublish">
					<view class="num">20</view>
					<view class="txt">我的发布</view>
				</view>
				<view class="item">
					<view class="num">30</view>
					<view class="txt">我的关注</view>
				</view>
				<view class="item">
					<view class="num">33</view>
					<view class="txt">我的收藏</view>
				</view>
			</view>
			<view class="consult-box">
				<image class="" src="@/static/my/consult_bg.png"></image>
				<view class="consult-content">
					<view class="content">
						<image src="@/static/my/red-package.png" class="red-package"></image>
						<view class="package-info">
							<view class="txt1">咨询体验</view>
							<view class="txt2">首次咨询最高节省500元</view>
						</view>
					</view>
					<view class="goto">去体验</view>
				</view>

			</view>
			<view class="my-server">
				<view class="title">我的服务</view>
				<view class="grid-box">
					<view v-for="(item, index) in gridList" :key="index" class="grid-item" @click="toNav(index)">
						<image :src="item.url" class="image"></image>
						<view class="txt">{{item.txt}}</view>
					</view>
				</view>
			</view>

			<view class="other-server">
				<view class="title">其他服务</view>
				<view class="other-list">
					<view class="other-item" @click="settledFn" v-if="userlnfo.userRole=='0'">
						<view class="item-left">
							<image src="/static/my/join.png"></image> <text>入驻平台</text>
						</view>
						<view class="item-right">
							<text>麦苗倾诉·心理从业者招章</text>
							<uni-icons type="right" size="14" color="#868686"></uni-icons>
						</view>
					</view>
					<view class="other-item" v-if="userlnfo.userRole!='0'" @click="gotoServiceCenter">
						<view class="item-left">
							<image src="/static/my/service-setting.png"></image> <text>服务设置</text>
						</view>
					</view>
					<view class="other-item">
						<view class="item-left">
							<image src="/static/my/help.png"></image> <text>帮助中心</text>
						</view>
					</view>
					<view class="other-item">
						<view class="item-left">
							<image src="/static/my/advice.png"></image> <text>意见反馈</text>
						</view>
					</view>
					<view class="other-item">
						<view class="item-left">
							<image src="/static/my/contect.png"></image> <text>联系客服</text>
						</view>
					</view>
					<view class="other-item" @click="toPage('/pages/settings/settings')">
						<view class="item-left">
							<image src="/static/my/setting.png"></image> <text>设置</text>
						</view>
					</view>
				</view>
			</view>
			<!-- <view style="margin-left: 30rpx;margin-right: 30rpx;margin-top: 30rpx;">
				<button type="primary" @click="toLogout">
					退出登录
				</button>
			</view> -->

		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		getUserInfo
	} from "@/common/api/apis.js"

	import {
		changeConsultant
	} from "@/common/api/user.js"
	
	import {onShow} from '@dcloudio/uni-app'
	const toPage = (url)=>{
		uni.navigateTo({
			url:url
		})
	}

	const gridList = ref([{
		url: "/static/my/grid-1.png",
		txt: "咨询订单"
	}, {
		url: "/static/my/grid-2.png",
		txt: "倾诉订单"
	}, {
		url: "/static/my/grid-3.png",
		txt: "我的套餐"
	}, {
		url: "/static/my/grid-4.png",
		txt: "优惠券"
	}, {
		url: "/static/my/grid-5.png",
		txt: "评测记录"
	}, {
		url: "/static/my/grid-6.png",
		txt: "兑换中心"
	}, {
		url: "/static/my/grid-7.png",
		txt: "足迹"
	}, {
		url: "/static/my/grid-8.png",
		txt: "邀请有礼"
	}])
	
	const gotoServiceCenter = ()=>{
		uni.navigateTo({
			url:"/pages/settings/serviceSettings"
		})
	}

	const changeRole = async () => {
		let res = await changeConsultant({
			consultantType: 0
		});

		console.log('=======================')
		console.log(res)

		userlnfo.value = res.data;
	}

	const changeRole1 = async () => {
		let res = await changeConsultant({
			consultantType: 1
		});

		console.log('=======================')
		console.log(res)

		userlnfo.value = res.data;
	}
	
	const userRole = ref(['用户','咨询师'])
	const currRole = ref('用户')
	const changeRoleFunc = (e)=>{
		console.log(e);
		currRole.value = userRole.value[e.detail.value]
		if(currRole.value=='用户'){
			changeRole()
		}else{
			changeRole1()
		}
	}

	const toUserInfo = () => {
		uni.navigateTo({
			url: "/pages/forum/my/userInfo"
		})
	}

	const toPublish = () => {
		uni.navigateTo({
			url: "/pages/forum/my/my"
		})
	}

	const toNav = (index) => {
		let url;
		if (index == 0) {
			url = "/pages/payment/order/consult-order"
		}else if(index==1){
			url="/pages/payment/order/listener-order"
		}else if (index==4){
			url = "/pages/payment/order/exam-order"
		}
		uni.navigateTo({
			url: url
		})
	}

	const settledFn = () => {
		uni.navigateTo({
			url: "/pages/settled/settled"
		})
	}

	const toLogout = () => {
		uni.clearStorageSync()
		uni.navigateTo({
			url: "/pages/login/login"
		})
	}

	const userlnfo = ref({});

	/**
	 * 获取当前用户信息
	 */
	const getlnfo = async () => {
		let res = await getUserInfo();
		userlnfo.value = res.data;

		console.log('=======================')
		console.log(res.data)
	}

	onShow(() => {
		getlnfo()
	});
</script>

<style lang="scss" scoped>
	.my-box {
		width: 100vw;
		box-sizing: border-box;
		overflow-y: scroll;
		position: relative;
		background-color: #F4F6F8;
		height: 100vh;

		.my-top-content {
			image {
				width: 100%;
				height: 906rpx;
			}
		}

		.container {
			position: absolute;
			top: 0rpx;
			width: 750rpx;
			height: 906rpx;

			.change-user-box {
				position: relative;
				margin-left: 20rpx;
				display: flex;
				justify-content: right;
				padding-right: 20rpx;

				.change-user {
					width: 120rpx;
					height: 52rpx;
					border-radius: 40rpx;
					background: #FFFFFF;
					display: flex;
					align-items: center;
					justify-content: center;
					border: 1rpx solid #34A755;
					font-size: 26rpx;
					color: #000;
					font-weight: 400;

					.bottom-arrow {
						width: 16rpx;
						height: 16rpx;
						padding-left: 8rpx;
					}
				}
			}

			.user-info {
				flex-direction: row;
				display: flex;
				color: #000000;
				width: 750rpx;
				margin-top: 152rpx;

				.user-info-content {
					flex: 1;
					display: flex;
					flex-direction: column;
				}

				.profile {
					width: 128rpx;
					height: 128rpx;
					margin-right: 20rpx;
					border-radius: 64rpx;
					margin-left: 64rpx;
				}

				.nick-name {
					font-weight: 500;
					font-size: 40rpx;
				}

				.id-num {
					font-size: 26rpx;
					margin-top: 12rpx;
					display: flex;
					flex-direction: row;
					align-items: center;
					font-weight: 400;

					.copy {
						width: 25rpx;
						height: 25rpx;
						padding-left: 16rpx;
						vertical-align: bottom;
					}
				}
			}

			.my-server,
			.consult-box,
			.my-record-number,
			.other-server {
				width: 678rpx;
				margin-left: 32rpx;
				margin-top: 56rpx;
			}

			.my-record-number {
				display: flex;

				.item {
					width: 25%;
					text-align: center;
					position: relative;

					.num {
						color: #282C38;
						font-size: 40rpx;
						font-weight: 500;
					}

					.txt {
						color: #000;
						font-size: 22rpx;
					}
				}

				.item:not(:last-of-type)::after {
					position: absolute;
					content: '';
					width: 2rpx;
					height: 28rpx;
					background: rgba(0, 0, 0, 0.08);
					top: 30rpx;
					right: 0rpx;
				}
			}


			.consult-box {
				position: relative;
				margin-top: 58rpx;

				image {
					height: 140rpx;
					width: 100%;
				}

				.consult-content {
					position: absolute;
					display: flex;
					justify-content: space-between;
					top: 0;
					width: 678rpx;
					height: 140rpx;
					align-items: center;

					.content {
						display: flex;
						padding-left: 20rpx;
						align-items: center;

						.red-package {
							width: 96rpx;
							height: 96rpx;
						}

						.package-info {
							padding-left: 20rpx;

							.txt1 {
								font-weight: 500;
								font-size: 30rpx;
								color: #fff;
							}

							.txt2 {
								font-weight: 400;
								font-size: 24rpx;
								color: #FDD8AA;
							}
						}
					}

					.goto {
						margin-right: 30rpx;
						width: 144rpx;
						height: 64rpx;
						border-radius: 32rpx;
						color: #fff;
						font-size: 28rpx;
						background: #34A755;
						text-align: center;
						line-height: 64rpx;
					}

				}
			}


			.my-server {
				height: 346rpx;
				background: #fff;
				border-radius: 22rpx;
				margin-top: 32rpx;

				.title {
					padding: 28rpx 0rpx 14rpx 28rpx;
					font-size: 30rpx;
					color: #121836;
					font-weight: 500;
				}

				.grid-box {
					display: flex;
					flex-wrap: wrap;
					width: 100%;

					.grid-item {
						width: 25%;
						text-align: center;
						margin-top: 36rpx;

						.image {
							width: 40rpx;
							height: 40rpx;
						}

						.txt {
							font-size: 22rpx;
							color: rgba(0, 0, 0, 0.85);
						}
					}
				}
			}


			.other-server {

				background: #fff;
				height: 570rpx;
				border-radius: 22rpx;
				margin-top: 32rpx;

				.title {
					padding: 28rpx 0rpx 14rpx 28rpx;
					font-size: 30rpx;
					color: #121836;
					font-weight: 500;
				}

				.other-list {
					width: 100%;

					.other-item {
						display: flex;
						margin: 0rpx 24rpx;
						height: 96rpx;
						justify-content: space-between;
						align-items: center;

						.item-left {
							display: flex;
							align-items: center;

							image {
								width: 28rpx;
								height: 28rpx;
							}

							text {
								font-size: 26rpx;
								color: #373737;
								padding-left: 14rpx;
							}
						}

						.item-right {
							font-size: 22rpx;
							color: #868686;
							display: flex;
							align-items: center;
						}
					}

					.other-item:not(:last-of-type) {
						border-bottom: 1rpx solid rgba(0, 0, 0, 0.08);
						;
					}
				}




			}
		}
	}
</style>