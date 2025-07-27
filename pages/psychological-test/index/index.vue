<template>
	<view class="psychological-box">
		<scroll-view scroll-y="true" class="scroll-y" :show-scrollbar="false">
			<view class="psychological-header">
				<view class="header-nav-bar">
					<view class="header-left">
						<uni-icons type="left" size="24" @click="backFn"></uni-icons>
						<text>心理测试</text>
					</view>
					<view class="header-title">
						<uni-search-bar class="uni-mt-10" radius="90" placeholder="抑郁测试" clearButton="auto"
							cancelButton="none" @confirm="searchHandler" />
					</view>
					<view class="header-right" @click="myOrderHandler">
						<image src="@/static/psychological-test/logo.svg" class="logo-svg"></image>
						<text class="txt">我的测评</text>
					</view>
				</view>

				<view class="scroll-content">
					<scroll-view scroll-x="true" class="scroll-x" :show-scrollbar="false">
						<view class="test-list">
							<view class="test-item" v-for="i in 10" :key="i">
								<image src="/static/forum/bg.png" class="img"></image>
								<view class="test-title">抑郁测试</view>
								<view class="use-test">23W人已测</view>
								<view class="start-test">开始测试<uni-icons type="right" size="12"
										color="#35CA95"></uni-icons>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>

				<view class="emotion-room">
					<view class="emotion-room-header">
						<text class="room-title">情绪小房间</text>
						<text class="room-remark">500+倾听师深度解读情绪困惑</text>
					</view>
					<view class="emotion-room-content">
						<div class="danmu-container">
							<div v-for="(danmu, index) in danmuList" :key="index" class="danmu-item">
								{{ danmu.text }}
							</div>
						</div>
					</view>
					<view class="send-msg">

					</view>
				</view>

				<view class="bg1"></view>
				<view class="bg2"></view>
			</view>

			<view class="tabs">
				<view class="tabs-list">
					<view class="tab-item" v-for="(item,index) in tabLists" :key="index" @click="openAllTypeHandler">
						<image :src="item.url" class="img"></image>
						<text class="txt">{{item.text}}</text>
					</view>
				</view>
			</view>

			<view class="day-recommend-box">
				<view class="day-recommend-content">
					<view class="recommend-heaader">
						<view class="title">每日推荐</view>
						<view class="label">换一换<uni-icons type="reload" size="12" color="#38CC98"></uni-icons>
						</view>
					</view>
					<view class="content-list">
						<view class="content-item" v-for="i in 4" :key="i">
							<image src="/static/forum/bg.png" class="img"></image>
							<view>
								<view class="title">潜意识投射测试</view>
								<view class="price-box">
									<view class="price">免费</view>
									<view class="use-test"><uni-icons type="fire-filled" size="18"
											color="#FA5151"></uni-icons><text class="num">1W</text>人已测</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="menu-tabs">
				<view class="menu-tabs-conetnt">
					<view class="menu-tabs-header">
						<view class="title">
							<view class="title-item" v-for="(item,index) in menuTabs" :key="index"
								@click="menuTabHandler(index)" :class="menuTabActive==index?'active':''">{{item.txt}}
							</view>
						</view>
						<view class="label">更多<uni-icons type="right" size="12"></uni-icons>
						</view>
					</view>
					<view class="content-list">
						<view class="content-item" v-for="i in 10" :key="i">
							<view class="content-item-content">
								<view>
									<view class="title">潜意识投射测试</view>
									<view class="remark">14张图片，揭露你的潜意识</view>
									<view class="price-box"><text class="price">￥19.9</text><text
											class="under-price">￥59.9</text></view>
									<view class="test-handler">
										<view class="handler-btn">去测试</view>
										<view class="use-test"><text class="num">23.4W</text>人已测</view>
									</view>
								</view>
								<view class="img-box">
									<image src="/static/consult/user.png" class="img"></image>
								</view>
							</view>

						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';
	import {
		useGlobalDataStore
	} from '@/stores/global.js';
	import MoteLinesDivide from "@/components/mote-lines-divide/mote-lines-divide"
	// import Danmaku from "@/components/danma/danma.vue"
	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');



	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const searchHandler = () => {}

	const tabLists = ref([{
		id: 1,
		text: "性格",
		url: "/static/login/logo.png"
	}, {
		id: 2,
		text: "情感",
		url: "/static/login/logo.png"
	}, {
		id: 3,
		text: "健康",
		url: "/static/login/logo.png"
	}, {
		id: 4,
		text: "职场",
		url: "/static/login/logo.png"
	}, {
		id: 5,
		text: "全部",
		url: "/static/login/logo.png"
	}])

	const menuTabs = ref([{
		id: 1,
		txt: "免费测试"
	}, {
		id: 2,
		txt: "付费测试"
	}])

	const menuTabActive = ref(0);

	const menuTabHandler = (i) => {
		menuTabActive.value != i ? menuTabActive.value = i : '';
	}


	const myOrderHandler = () => {
		uni.navigateTo({
			url: "/pages/psychological-test/order/order"
		})
	}
	const danmuList = ref([]);

	onMounted(() => {
		// setInterval(() => {
		// 	addDanmu("这是一条弹幕");
		// }, 500);
	})

	const addDanmu = (text) => {
		danmuList.value.push({
			text
		}); // 添加新的弹幕到列表末尾
	}
	
	const openAllTypeHandler=()=>{
		uni.navigateTo({
			url:"/pages/psychological-test/test-type/test-type"
		})
	}
</script>

<style lang="scss" scoped>
	.psychological-box {
		$statusBarHeight: v-bind(statusBarHeight);

		.scroll-y {
			background-color: #f7f8fa;
			height: 100vh;
		}

		.psychological-header {
			height: calc(834rpx + $statusBarHeight);
			background: linear-gradient(180deg, #B0E7EE 0%, #F7F8FA 100%);
			position: relative;
			overflow: hidden;

			.header-nav-bar {
				display: flex;
				height: 88rpx;
				align-items: center;
				padding-top: $statusBarHeight;
				position: fixed;
				width: 750rpx;
				z-index: 99;
				background-color: #B0E7EE;

				.header-left {
					width: 278rpx;
					font-size: 32rpx;
					font-weight: 600;
					color: #000000;
					display: flex;
					align-items: center;
					padding-left: 36rpx;
				}

				.header-title {
					width: 348rpx;
					height: 72rpx;

					.uni-searchbar {
						padding: 0;
					}
				}

				.header-right {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 124rpx;
					font-size: 18rpx;
					color: rgba(0, 0, 0, 0.85);

					.logo-svg {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}

			.scroll-content {
				padding-left: 36rpx;
				margin-top: calc(128rpx + $statusBarHeight);

				.test-list {
					display: flex;
					align-items: center;

					.test-item {
						width: 252rpx;
						height: 320rpx;
						border-radius: 24rpx;
						opacity: 0.8;
						background: #FFFFFF;
						flex-shrink: 0;
						margin-right: 24rpx;

						.img {
							width: 100%;
							height: 160rpx;
							border-top-right-radius: 24rpx;
							border-top-left-radius: 24rpx;
						}

						.test-title,
						.use-test,
						.start-test {
							padding-left: 22rpx;
						}

						.test-title {
							font-size: 28rpx;
							font-weight: 500;
							line-height: normal;
							letter-spacing: normal;
							color: rgba(0, 0, 0, 0.85);
						}

						.use-test {
							font-size: 20rpx;
							font-weight: normal;
							line-height: normal;
							letter-spacing: normal;
							color: #9E9E9E;
						}

						.start-test {
							font-size: 24rpx;
							color: #35CA95;
							margin-top: 24rpx;
						}
					}
				}
			}

			.emotion-room {
				padding-left: 36rpx;
				margin-top: 28rpx;

				.room-title {
					font-size: 32rpx;
					font-weight: 500;
					color: #000000;
					position: relative;

					&:before {
						content: "";
						width: 142rpx;
						height: 12rpx;
						border-radius: 12rpx;
						background: linear-gradient(90deg, #59E2B1 0%, rgba(89, 226, 177, 0) 100%);
						position: absolute;
						bottom: 10rpx;
					}
				}

				.room-remark {
					font-size: 22rpx;
					color: #626970;
					padding-left: 14rpx;
				}

				.emotion-room-content {
					margin-top: 22rpx;
					height: 160rpx;

				}
			}

			.bg1 {
				width: 240rpx;
				height: 502rpx;
				opacity: 0.4;
				background: #CFB7F7;
				filter: blur(100rpx);
				position: absolute;
				bottom: 0;
			}

			.bg2 {
				width: 344rpx;
				height: 610rpx;
				background-image: url("@/static/psychological-test/index-bg.svg");
				position: absolute;
				bottom: 0;
				right: -60px;
				background-size: 100% 100%;
				background-repeat: no-repeat;
				bottom: -80rpx;
			}
		}

		.tabs {
			width: 750rpx;
			height: 88rpx;
			margin-top: 40rpx;

			.tabs-list {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 36rpx;

				.tab-item {
					.img {
						width: 56rpx;
						height: 56rpx;
						display: flex;
						flex-direction: column;
					}

					.txt {
						font-size: 24rpx;
						color: #626970;
					}
				}
			}
		}

		.day-recommend-box {
			margin-top: 60rpx;

			.day-recommend-content {
				padding: 0rpx 36rpx;

				.recommend-heaader {
					display: flex;
					justify-content: space-between;

					.title {
						font-size: 32rpx;
						font-weight: 600;
						color: rgba(0, 0, 0, 0.85);
					}

					.label {
						font-size: 24rpx;
						letter-spacing: normal;
						color: rgba(0, 0, 0, 0.5);
					}
				}

				.content-list {

					display: flex;
					justify-content: space-between;
					flex-wrap: wrap;

					.content-item {
						width: 334rpx;
						height: 340rpx;
						border-radius: 20rpx;
						background: #fff;
						box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
						flex-shrink: 0;
						margin-top: 32rpx;

						.img {
							height: 200rpx;
							border-radius: 20rpx 20rpx 0rpx 0rpx;
							width: 100%;
						}

						.title {
							font-size: 30rpx;
							font-weight: 500;
							color: rgba(0, 0, 0, 0.85);
							padding: 0rpx 24rpx;
							margin-top: 20rpx;
						}

						.price-box {
							display: flex;
							align-items: center;
							justify-content: space-between;
							padding: 0rpx 24rpx;
							margin-top: 14rpx;

							.price {
								font-size: 28rpx;
								color: #FA5151;
							}

							.use-test {
								font-size: 22rpx;
								color: rgba(0, 0, 0, 0.65);

							}
						}
					}
				}
			}
		}

		.menu-tabs {
			margin-top: 60rpx;

			.menu-tabs-conetnt {
				padding: 0rpx 36rpx;

				.menu-tabs-header {
					display: flex;
					justify-content: space-between;

					.title {
						display: flex;
						font-size: 32rpx;
						color: rgba(0, 0, 0, 0.65);

						.title-item {
							margin-right: 30rpx;

						}

						.active {
							color: rgba(0, 0, 0, 0.85);
							position: relative;
							font-size: 36rpx;
							font-weight: 500;
							display: flex;
							justify-content: center;

							&:before {
								position: absolute;
								content: '';
								height: 36rpx;
								width: 36rpx;
								background-image: url("@/static/index/subscript.png");
								bottom: -20rpx;
								background-repeat: no-repeat;
								background-size: 100% 100%;
							}
						}
					}

					.label {
						font-size: 24rpx;
						color: rgba(0, 0, 0, 0.5);

					}

				}

				.content-list {
					margin-top: 32rpx;

					.content-item {
						width: 686rpx;
						height: 280rpx;
						background: #fff;
						border-radius: 20rpx;
						box-shadow: 0px 8rpx 20rpx 0px rgba(0, 0, 0, 0.1);
						margin-top: 32rpx;

						.content-item-content {
							padding: 0rpx 20rpx 0rpx 28rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;
							height: 100%;
						}

						.title {
							font-size: 32rpx;
							color: rgba(0, 0, 0, 0.85);
							font-weight: 500;
						}

						.remark {
							font-size: 24rpx;
							color: rgba(0, 0, 0, 0.35);
						}

						.price {
							color: #FA5151;
							font-size: 28rpx;
						}

						.under-price {
							font-size: 24rpx;
							color: #D9D9D9;
							text-decoration: line-through;
						}

						.test-handler {
							display: flex;
							margin-top: 24rpx;
							align-items: center;
							justify-content: space-between;

							.handler-btn {
								width: 160rpx;
								height: 60rpx;
								color: #fff;
								background-color: #35CA95;
								color: #FFFFFF;
								font-size: 28rpx;
								border-radius: 60rpx;
								line-height: 60rpx;
								text-align: center;
							}

							.use-test {
								font-size: 24rpx;
								font-weight: normal;
								color: rgba(0, 0, 0, 0.5);
								padding-left: 16rpx;

								.num {
									color: rgba(0, 0, 0, 0.85);
								}
							}
						}

						.img {
							width: 240rpx;
							height: 240rpx;
						}
					}
				}
			}
		}


		.danmu-container {
			position: relative;
			width: 100%;
			height: 50px;
			/* 根据需要调整 */
			overflow: hidden;
		}

		.danmu-item {
			position: absolute;
			white-space: nowrap;
			animation: danmu 10s linear infinite;
			/* 调整时间和速度 */
		}

		@keyframes danmu {
			from {
				transform: translateX(100%);
				/* 从右向左移动 */
			}

			to {
				transform: translateX(-100%);
				/* 完全移出屏幕 */
			}
		}
	}
</style>