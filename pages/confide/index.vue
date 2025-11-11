<template>
	<view class="confide-box">
		<scroll-view scroll-y @scroll="onPageScroll" :scroll-top="scrollTop" class="scroll-content" style="height: 100vh;" scroll-with-animation
			:show-scrollbar="false">
			<view class="search-content" :class="fixed?'activeClass':''">
				<view class="search">
					<uni-search-bar class="uni-mt-10" radius="100" placeholder="请输入倾听师姓名" clearButton="auto"
						cancelButton="none" @confirm="searchFn" />
				</view>
				<view class="contact">
					<image src="/static/my/contect.png"></image>
					<text>客服</text>
				</view>
				<!-- #ifndef MP-WEIXIN -->
				<view class="contact share">
					<image src="/static/confide/share.png"></image>
					<text>分享</text>
				</view>
				<!-- #endif -->
			</view>
			<view class="confide-top">
				<view class="order-content">
					<view class="text">
						<view class="first-msg"><text class="item1">无需预约</text><text class="item2">马上连线</text></view>
						<view class="second-msg">倾听热线全天24小时陪伴着你</view>
					</view>
					<view class="order-image">
						<image src="@/static/confide/people.png" class="img"></image>
					</view>
				</view>
			</view>
			<view class="filter-box">
				<view class="filter-box-2">
					<view v-for="i in 10" class="filter-box-2-item" :key="index">
						<image src="/static/confide/iocn-1.png" class="img"></image>
						<text class="txt">情感陪伴</text>
					</view>
				</view>

				<view class="filter-box-2 server-m">
					<view class="filter-box-2-item-p red">
						<view class="p-title">优惠券</view>
						<view class="p-txt">先到先得</view>
						<image src="/static/confide/red.png" class="logo"></image>
					</view>
					<view class="filter-box-2-item-p yellow">
						<view class="p-title">套餐折扣</view>
						<view class="p-txt">最低8折</view>
						<image src="/static/confide/yellow.png" class="logo"></image>
					</view>
					<view class="filter-box-2-item-p blue">
						<view class="p-title">文字倾诉</view>
						<view class="p-txt">一对一私信</view>
						<image src="/static/confide/blue.png" class="logo"></image>
					</view>
					<view class="filter-box-2-item-p green">
						<view class="p-title">语音倾诉</view>
						<view class="p-txt">面对面</view>
						<image src="/static/confide/green.png" class="logo"></image>
					</view>
				</view>
			</view>

			<u-sticky offset-top="50" @fixed="fixedTop" @unfixed="unFixedTop">
				<view id="stickyBox">
					<view class="sticky-box">
						<view class="sticky-box-1 filter-m">
							<view style="display: flex;flex-direction: row;flex: 1;">
								<view class="sticky-box-1-item" style="margin-right: 30rpx;" @click="showBox(1)">倾听方向<uni-icons type="down"
										size="12" class="icon"></uni-icons>
								</view>
								<view class="sticky-box-1-item" @click="showBox(2)">价格<uni-icons type="down" size="12"
										class="icon"></uni-icons>
								</view>
							</view>
							<view style="display: flex;flex-direction: row;">
								<view class="sticky-box-1-item" style="margin-right: 30rpx;">筛选
									<image src="/static/consult/filter.png" style="width: 32rpx;height: 32rpx;" class="filter icon img"></image>
								</view>
								<view class="sticky-box-1-item" style="margin-right: 60rpx;">
									<image src="/static/consult/order.png" style="width: 32rpx;height: 32rpx;" class="order img"></image>
								</view>
							</view>
						</view>
						<view class="sticky-box-2 item-m">
							<view v-for="i in 50" class="sticky-box-2-item-txt">
								<text class="txt">情感咨询</text>
							</view>
						</view>
					</view>
				</view>
			</u-sticky>

			<view class="doctor-list">
				<view class="doctor-item" v-for="(item,index) in data.list" :key="index" @click="openDetail(item)">
					<view class="doctor-auture">
						<image src="/static/consult/user.png"></image>
					</view>
					<view class="doctor-info">
						<view class="doctor-info-1">
							<view class="name">{{item.name}}</view>
						</view>
						<view class="doctor-info-1">
							<view class="info">
								<text class="age item">80后</text>
								<text class="line"></text>
								<text class="edu item">{{item.education}}</text>
								<text class="line"></text>
								<text class="star item">{{item.constellation}}</text>
							</view>
						</view>
						<view class="doctor-info-1">
							<view class="job">{{item.major}}</view>

						</view>
						<view class="doctor-info-1">
							<view class="exprise">
								<text>5000</text> 服务人次 <text>4500+</text> 小时经验<text> {{item.evaluateNum}} </text>评分
							</view>
						</view>
						<view class="doctor-info-1">
							<view class="point-list">
								<view class="point-item" v-for="(item,index) in item.serviceType.split(',')"
									:key="index">{{item}}</view>
								<!-- <view class="point-item">压力管理</view> -->
								<!-- <view class="point-item">婚姻家庭</view> -->
							</view>
						</view>
						<view class="doctor-info-1">
							<view class="price" v-if="item.price"><text class="unit"
									v-if="item.price">¥</text>{{item.price}}</view>
							<view class="price" v-else>免费</view>
							<view class="address">
								<image src="/static/consult/address.png"></image><text>{{item.address}}</text>
							</view>
						</view>
					</view>
					<view class="server-box">
						<view class="server-status">服务中</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		nextTick,
		onMounted,
		ref,
		reactive,
		getCurrentInstance
	} from 'vue';
	import {
		useGlobalDataStore
	} from '@/stores/global.js';
	import {
		getListenerList
	} from "@/common/api/listener.js"
	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
	const scrollTop = ref(0);
	const currentScroll = ref(0)
	const fixed = ref(false)
	const filterTopHeight = ref(0);
	const filterBox = ref(null);
	const showFilterBox = ref(false)
	const currentFilter = ref(null)
	const instance = getCurrentInstance() // ✅ 在顶层声明
	const proxy = instance?.proxy // ✅ 安全引用
	const data = reactive({
		listParpms: {
			"current": 1,
			"size": 10,
			"params": {
				"consultantType": 2,
			}
		},
		list: []
	})
	const onPageScroll = (e) => {
		currentScroll.value = e.detail.scrollTop;
	}

	const fixedTop = () => {
		fixed.value = true
	}
	const unFixedTop = () => {
		fixed.value = false;
		scrollTop.value = 0
	}

	const searchFn = () => {}
	onMounted(() => {
		uni.createSelectorQuery()
			.select('#filterBox')
			.boundingClientRect(rect => {
				filterTopHeight.value = rect.top;
			}).exec()
	})

	const showBox = async (type) => {
		currentFilter.value = type
		if (!fixed.value) {
			await nextTick()
			const query = uni.createSelectorQuery().in(proxy) // ✅ 用 proxy
			query.select('#stickyBox').boundingClientRect()
			query.selectViewport().scrollOffset()
			query.exec((res) => {
				if (!res || !res[0]) return
				const boxTop = res[0].top
				// const scrollOffset = res[1].scrollTop
				const scrollOffset = currentScroll.value
				scrollTop.value = scrollOffset + boxTop - 50 // 修正 offset-top
				console.log(scrollTop.value);
				setTimeout(() => {
					openFilter(type)
				}, 300)
			})
		} else {
			openFilter(type)
		}
	}

	// 打开筛选弹窗（这里你可以替换为自定义弹窗逻辑）
	const openFilter = (type) => {
		console.log('打开筛选弹窗，类型：', type)
		// TODO: 打开筛选框视图
		showFilterBox.value = true
	}

	const closeFilter = () => {
		showFilterBox.value = false
	}

	const openDetail = (item) => {
		uni.navigateTo({
			url: "/pages/confide/detail?id=" + item.id
		})
	}

	onMounted(() => {
		getList();
	})
	/**
	 * 获取列表
	 */
	const getList = async () => {
		let res = await getListenerList(data.listParpms);
		data.list = res.data.records;
		console.log(res)
	}
</script>

<style scoped lang="scss">
	.confide-box {
		background-color: #F4F6F8;
		width: 100vw;
		height: 100vh;

		display: flex;
		flex-direction: column;
		background-color: #F4F6F8;

		$statusBarHeight: v-bind(statusBarHeight);

		.scroll-content {
			height: 100vh;

			.activeClass {
				background: #fff;
			}

			.search-content {
				display: flex;
				position: fixed;
				height: 134rpx;
				z-index: 1;
				width: 100vw;
				align-items: center;
				padding-top: calc($statusBarHeight);

				.search {
					width: 580rpx;
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
					margin-left: 20rpx;

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

			.confide-top {
				width: 100vw;
				height: calc($statusBarHeight + 157px);
				background: url("@/static/confide/bg.png");
				background-size: 100% 100%;
				background-repeat: no-repeat;
				position: relative;

				.order-content {
					line-height: 1;
					width: 686rpx;
					height: 160rpx;
					border-radius: 20rpx;
					display: flex;
					background: linear-gradient(270deg, #FFD17A 3%, #F5E5C5 100%);
					align-items: center;
					justify-content: space-between;
					position: absolute;
					top: calc($statusBarHeight + 134rpx);
					;
					margin: 0rpx 32rpx;

					.text {
						margin-left: 32rpx;
					}

					.first-msg {
						font-size: 36rpx;
						font-weight: 500;
						color: #3F1600;

						.item2 {
							margin-left: 30rpx;
						}
					}

					.second-msg {
						font-size: 22rpx;
						color: #7A531C;
						font-weight: 400;
						margin-top: 14rpx;
					}

					.order-image {
						margin-right: 32rpx;
						height: 100%;
						display: flex;
						align-items: end;

						.img {
							width: 244rpx;
							height: 148rpx;
						}
					}
				}
			}

			.filter-box {
				width: 100vw;
				background-color: #F4F6F8;
				line-height: 1;

				.filter-box-1 {
					display: flex;
					margin-left: 32rpx;

					.filter-box-1-item {
						font-size: 28rpx;
						color: rgba(0, 0, 0, 0.85);
						display: flex;
						align-items: center;
						font-weight: 500;

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

				.server-m {
					margin-top: 34rpx;
				}

				.filter-m {
					margin-top: 28rpx;
				}

				.item-m {
					margin-top: 28rpx;
				}

				.fixedFilter {
					position: fixed;
					top: calc(v-bind(statusBarHeight) + 134rpx);
					z-index: 1;
					background-color: #F4F6F8;
					width: 100vw;
					height: 140rpx;
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
							margin-top: 12rpx;
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
						flex-grow: 0;
						flex-shrink: 0;
						display: flex;
						flex-direction: column;
						margin-right: 20rpx;
						align-items: center;

						.txt {
							padding-top: 18rpx;
						}

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


			.sticky-box {
				width: 100vw;
				background-color: #F4F6F8;
				height: 170rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;

				.sticky-box-1 {
					display: flex;
					flex-direction: row;
					margin-left: 32rpx;

					.sticky-box-1-item {
						font-size: 28rpx;
						color: rgba(0, 0, 0, 0.85);
						display: flex;
						align-items: center;
						font-weight: 500;

						.img {
							height: 48rpx;
							width: 48rpx;
						}

						.sticky {
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

				.sticky-box-2 {

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

					.sticky-box-2-item-p {
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

					.sticky-box-2-item {
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

					.sticky-box-2-item-txt {
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

				.sticky-box-2::-webkit-scrollbar {
					width: 0 !important;
					display: none;
					height: 0 !important;
					color: transparent;
					background-color: transparent;
				}
			}

			.doctor-list {
				height: 100vh;

				.doctor-item {
					width: 100vw;
					background: #fff;
					display: flex;
					height: 328rpx;
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

							.name {
								font-size: 32rpx;
								color: rgba(0, 0, 0, 0.85);
								font-weight: 500;
							}

							.info {
								display: flex;
								font-size: 24rpx;
								color: rgba(0, 0, 0, 0.85);
								align-items: center;

								.line {
									display: inline-block;
									width: 2rpx;
									height: 20rpx;
									background: rgba(0, 0, 0, 0.16);
									margin: 0 16rpx;
								}
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

						.doctor-info-1:not(:first-of-type) {
							margin-top: 16rpx;
						}
					}

					.server-box {
						position: absolute;
						top: 36rpx;
						right: 32rpx;
						width: 88rpx;
						height: 88rpx;
						/* 自动布局 */
						display: flex;
						align-items: center;
						justify-content: center;
						background: linear-gradient(149deg, rgba(255, 167, 103, .4) 12%, rgba(255, 159, 86, .4) 81%);
						border-radius: 88rpx;

						.server-status {
							width: 76rpx;
							height: 76rpx;
							/* 自动布局 */
							display: flex;
							background: linear-gradient(149deg, #FFA767 12%, #FF9F56 81%);
							align-items: center;
							justify-content: center;
							border-radius: 76rpx;
							color: #FFFFFF;
							font-size: 20rpx;
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

	.mask {
		position: fixed;
		top: 230rpx;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 999;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		animation: fadeIn 0.3s;
	}

	/* 下拉弹窗 */
	.filter-popup {
		width: 100%;
		background: #fff;
		border-radius: 0 0 20rpx 20rpx;
		animation: slideDown 0.3s;
	}

	.popup-header {
		text-align: center;
		padding: 30rpx 0;
		font-weight: bold;
		border-bottom: 1px solid #eee;
	}

	.popup-body {
		max-height: 600rpx;
		overflow-y: auto;
		padding: 20rpx;
	}

	.popup-item {
		padding: 20rpx 0;
		border-bottom: 1px solid #f1f1f1;
	}

	.popup-footer {
		padding: 20rpx;
		text-align: center;
	}

	.btn {
		background: #35ca95;
		color: #fff;
		border-radius: 10rpx;
		width: 60%;
		padding: 20rpx;
	}

	// @keyframes slideDown {
	//   from {
	//     transform: translateY(-100%);
	//   }
	//   to {
	//     transform: translateY(0);
	//   }
	// }
	@keyframes fadeIn {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}
</style>