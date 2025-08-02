<template>
	<view class="consult-box">
		<scroll-view scroll-y @scroll="onPageScroll" class="scroll-content" :show-scrollbar="false">
			<view class="search-content" :class="scrollTop>15?'activeClass':''">
				<view class="search">
					<uni-search-bar class="uni-mt-10" radius="100" placeholder="请输入咨询师或问题类型" clearButton="auto"
						cancelButton="none" @confirm="searchFn" />
				</view>
				<view class="contact">
					<image src="/static/my/contect.png"></image>
					<text>客服</text>
				</view>
			</view>
			<view class="operate-box">
				<view class="operate-content">
					<view class="operate-left">
						<view class="find-teacher">
							<view class="teach-1">寻找倾听师</view>
							<view class="teach-2">为你寻找适合的咨询师</view>
							<view class="teach-3">了解详情<uni-icons type="right" size="10" color="#35CA95"></uni-icons>
								<image class="find-teacher-image" src="/static/consult/find-teacher-image.png"></image>
							</view>
							<!-- <image></image> -->
						</view>
					</view>
					<view class="operate-right">
						<view class="try-consult">
							<view class="txt-1">试咨询</view>
							<view class="txt-2" style="color: #F0AE45;">即时咨询<uni-icons type="right" size="10"
									color="#F0AE45"></uni-icons></view>
							<image class="try-consult-image" src="/static/consult/try-consult-image.png"></image>
						</view>
						<view class="free-consult">
							<view class="txt-1">免费咨询</view>
							<view class="txt-2" style="color: #E8746E;">即时咨询<uni-icons type="right" size="10"
									color="#E8746E"></uni-icons></view>
							<image class="free-consult-image" src="/static/consult/free-consult-image.png"></image>
						</view>
					</view>
				</view>
			</view>

			<view class="filter-box" :class="scrollTop>137?'fixedFilter':''">
				<view class="filter-box-1">
					<view class="filter-box-1-item">困扰<uni-icons type="down" size="12" class="icon"></uni-icons>
					</view>
					<view class="filter-box-1-item">城市<uni-icons type="down" size="12" class="icon"></uni-icons>
					</view>
					<view class="filter-box-1-item">价格<uni-icons type="down" size="12" class="icon"></uni-icons>
					</view>
					<view class="filter-box-1-item">筛选<image src="/static/consult/filter.png" class="filter icon">
						</image>
					</view>
					<view class="filter-box-1-item">
						<image src="/static/consult/order.png" class="order"></image>
					</view>
				</view>
				<view class="filter-box-2">
					<text class="filter-box-2-item" v-for="i in 100" :key="i">咨询数优先</text>
				</view>
			</view>

			<view class="doctor-list">
				<view class="doctor-item" v-for="(item,index) in data.list" :key="index" @click="openDetail(item)">
					<view class="doctor-auture">
						<image src="/static/consult/user.png"></image>
					</view>
					<view class="doctor-info">
						<view class="doctor-info-1">
							<view class="name">{{item.consultantName}}</view>
							<view class="date">今天20:00可约</view>
						</view>
						<view class="doctor-info-1">
							<view class="job">{{item.major}}</view>
							<view class="address">
								<image src="/static/consult/address.png"></image><text>{{item.address}}</text>
							</view>
						</view>
						<view class="doctor-info-1">
							<view class="exprise">
								<text>1700+</text> 小时经验 <text>{{item.experience}}</text> 从业<text> {{item.evaluateNum}}+ </text>评价
							</view>
						</view>
						<view class="doctor-info-1">
							<view class="point-list">
								<view class="point-item">自我探索</view>
								<view class="point-item">压力管理</view>
								<view class="point-item">婚姻家庭</view>
							</view>
						</view>
						<view class="doctor-info-1">
							<view class="discount">5节起立减200元</view>
							<view class="price"><text class="unit">¥</text>{{item.consultantPrice}}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		getConsultantList
	} from "@/common/api/consultant.js"
	import {
		quickReg,
		sendSms,
		smsLogin
	} from "@/common/api/apis.js"
	import {
		onMounted,
		ref,
		reactive
	} from 'vue';
	import {
		useGlobalDataStore
	} from '@/stores/global.js';
	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
	const scrollTop = ref(0);
	const data = reactive({
		listParpms: {
			"current": 1,
			"size": 10,
			"params": {
				"consultantType": 1,
			}
		},
		list: []
	})
	const onPageScroll = (e) => {
		scrollTop.value = e.detail.scrollTop;
	}


	const searchFn = () => {}

	const openDetail = (item) => {
		uni.navigateTo({
			url: "/pages/consult/detail?id="+item.id
		})
	}
	onMounted(() => {
		getList();
	})
	/**
	 * 获取列表
	 */
	const getList = async () => {
		let res = await getConsultantList(data.listParpms);
		data.list = res.data.records;
		console.log(res)
	}
</script>

<style lang="scss" scoped>
	.consult-box {
		width: 100vw;
		min-height: 100vh;
		background-color: #F4F6F8;

		.activeClass {
			background: #fff;
		}

		$statusBarHeight: v-bind(statusBarHeight);

		.scroll-content {
			height: 100vh;

			.search-content {
				display: flex;
				position: fixed;
				height: 134rpx;
				z-index: 1;
				width: 100vw;
				align-items: center;
				padding-top: calc($statusBarHeight);

				.search {
					width: 680rpx;
					height: 100%;
					display: flex;
					align-items: center;

					.uni-searchbar {
						padding: 0rpx 20rpx;
						width: 680rpx;
					}
				}

				.contact {
					display: flex;
					flex-direction: column;
					justify-content: center;

					image {
						width: 40rpx;
						height: 40rpx;
					}

					text {
						color: rgba(0, 0, 0, 0.85);
						font-size: 18rpx;
					}
				}
			}

			.operate-box {
				width: 100vw;
				height: calc($statusBarHeight + 210px);
				background: url("@/static/consult/bg.png");
				background-size: 100% 100%;
				background-repeat: no-repeat;

				.operate-content {
					display: flex;
					position: relative;
					justify-content: center;
					padding-top: calc($statusBarHeight + 67px);

					.operate-left {
						.find-teacher {
							position: relative;
							width: 334rpx;
							height: 280rpx;
							border-radius: 20rpx;
							background: linear-gradient(314deg, #D7EFEF 4%, #FDFFFD 90%);
							box-sizing: border-box;
							border: 2rpx solid #FFFFFF;
							padding: 36rpx 0rpx 0rpx 24rpx;
							line-height: 1;

							.teach-1 {
								color: rgba(0, 0, 0, 0.85);
								font-size: 28rpx;
								font-weight: 500;
							}

							.teach-2 {
								color: rgba(0, 0, 0, 0.6);
								font-size: 22rpx;
								margin-top: 12rpx;
							}

							.teach-3 {
								color: #35CA95;
								font-size: 22rpx;
								margin-top: 114rpx;
							}

							.find-teacher-image {
								position: absolute;
								width: 118rpx;
								height: 112rpx;
								right: 0rpx;
								bottom: 0rpx;
							}
						}
					}

					.operate-right {
						margin-left: 20rpx;

						.try-consult,
						.free-consult {
							position: relative;
							width: 334rpx;
							height: 130rpx;
							border-radius: 20rpx;
							/* 自动布局 */
							display: flex;
							flex-direction: column;
							justify-content: center;
							box-sizing: border-box;
							border: 2rpx solid #FFFFFF;
							padding-left: 24rpx;

							.txt-1 {
								font-size: 28rpx;
								color: #000000;
								font-weight: 500;
							}

							.txt-2 {
								font-size: 22rpx;
							}
						}

						.try-consult {
							background: linear-gradient(294deg, #FFEFD5 6%, #FFFDF5 89%);

							.try-consult-image {
								width: 82rpx;
								height: 90rpx;
								position: absolute;
								bottom: 0;
								right: 0;
							}
						}

						.free-consult {
							margin-top: 20rpx;
							background: linear-gradient(294deg, #FFF4F3 6%, #FFFBFA 89%);

							.free-consult-image {
								width: 84rpx;
								height: 88rpx;
								position: absolute;
								bottom: 0;
								right: 0;
							}
						}
					}
				}
			}

			.fixedFilter {
				position: fixed;
				top: calc(v-bind(statusBarHeight) + 134rpx);
				z-index: 1;
			}

			.filter-box {
				width: 100vw;
				background-color: #F4F6F8;
				height: 170rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;

				.filter-box-1 {
					display: flex;
					width: 686rpx;
					margin-left: 32rpx;

					.filter-box-1-item {
						font-size: 28rpx;
						color: rgba(0, 0, 0, 0.85);
						display: flex;
						align-items: center;
						font-weight: 500;
						width: 25%;

						.filter {
							width: 20rpx;
							height: 20rpx;
						}

						.order {
							width: 20rpx;
							height: 24rpx;
						}

						.icon {
							padding-left: 14rpx;
						}
					}
				}

				.filter-box-2 {

					width: 686rpx;
					margin-left: 32rpx;
					overflow-x: scroll;
					display: flex;
					flex-direction: row;
					box-sizing: border-box;
					flex-wrap: nowrap;
					-ms-overflow-style: none;
					overflow: -moz-scrollbars-none;
					margin-top: 34rpx;

					.filter-box-2-item-p {
						width: 200rpx;
						height: 120rpx;
						border-radius: 20rpx;
						margin-right: 16rpx;
						flex-grow: 0;
						flex-shrink: 0;
						position: relative;
						padding: 20rpx 0rpx 0rpx 16rpx;

						.p-title {
							font-size: 30rpx;
							font-weight: 600;
						}

						.p-txt {
							font-size: 20rpx;
							font-weight: normal;
						}

						.logo {
							width: 80rpx;
							height: 80rpx;
							position: absolute;
							right: 0rpx;
							bottom: 0;
						}
					}

					.red {
						background: linear-gradient(360deg, #FEF1F1 -1%, #FED2D3 99%);
						color: #F76D64 !important;
					}

					.yellow {
						background: linear-gradient(360deg, #FFF8E6 -1%, #F9E8BD 99%);
						color: #EB9516 !important;
					}

					.blue {
						background: linear-gradient(360deg, #F3F8FF -1%, #C8E3FF 99%);
						color: #2990FC !important;
					}

					.green {
						background: linear-gradient(360deg, #EEFBE9 -1%, #DEFCD0 99%);
						color: #87A54A !important;
					}

					.filter-box-2-item {
						padding: 6rpx 10rpx;
						border-radius: 24rpx;
						font-size: 24rpx;
						background-color: #fff;
						flex-grow: 0;
						flex-shrink: 0;
						display: flex;
						flex-direction: column;
						margin-right: 20rpx;
						align-items: center;


					}

					.filter-box-2-item-txt {
						padding: 6rpx 10rpx;
						border-radius: 24rpx;
						color: rgba(0, 0, 0, 0.65);
						font-size: 24rpx;
						background-color: #fff;
						flex-grow: 0;
						flex-shrink: 0;
						margin-right: 20rpx;
					}

					.img {
						height: 48rpx;
						width: 48rpx;
					}

					.txt {
						font-size: 24rpx;
						color: #5F5F5F;
					}
				}

				.filter-box-2::-webkit-scrollbar {
					width: 0 !important;
					display: none;
					height: 0 !important;
					color: transparent;
					background-color: transparent;
				}
			}

			.doctor-list {
				.doctor-item {
					width: 100vw;
					background: #fff;
					display: flex;
					height: 280rpx;
					position: relative;

					.doctor-auture {
						padding-top: 32rpx;
						width: 184rpx;

						image {
							width: 132rpx;
							height: 132rpx;
							padding-left: 16rpx;
						}
					}

					.doctor-info {
						padding-top: 32rpx;
						width: 534rpx;
						line-height: 1;

						.doctor-info-1 {
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin-top: 12rpx;

							.name {
								font-size: 32rpx;
								color: rgba(0, 0, 0, 0.85);
								font-weight: 500;
							}

							.date {
								width: 168rpx;
								height: 32rpx;
								border-radius: 4rpx;
								background-color: #D8FAEE;
								color: #35CA95;
								font-size: 20rpx;
								text-align: center;
								line-height: 32rpx;
							}

							.job {
								color: rgba(0, 0, 0, 0.85);
								font-size: 24rpx;
							}

							.address {
								color: rgba(0, 0, 0, 0.4);
								font-size: 20rpx;
								display: flex;
								align-items: center;

								image {
									width: 24rpx;
									height: 24rpx;
								}
							}

							.exprise {
								color: rgba(0, 0, 0, 0.5);
								font-size: 24rpx;

								text {
									color: rgba(0, 0, 0, 0.85);
								}
							}

							.point-list {
								display: flex;

								.point-item {
									border-radius: 6rpx;
									padding: 6rpx 10rpx;
									border: 1rpx solid #B2B2B2;
									color: rgba(0, 0, 0, 0.6);
									font-size: 20rpx;
									margin-right: 20rpx;
								}
							}

							.discount {
								border-radius: 6rpx;
								padding: 6rpx 10rpx;
								border: 1rpx solid #FB6A6A;
								color: #FA5151;
								font-size: 20rpx;
							}

							.price {
								font-size: 36rpx;
								color: #FA5151;
								font-weight: 500;

								.unit {
									font-size: 20rpx;
									color: #FA5151;
									font-weight: 400;
								}
							}
						}
					}

				}

				.doctor-item:not(:last-of-type)::before {
					width: 686rpx;
					height: 1rpx;
					background: rgba(0, 0, 0, 0.08);
					position: absolute;
					content: '';
					left: 32rpx;
					bottom: 0;
				}
			}
		}
	}
</style>