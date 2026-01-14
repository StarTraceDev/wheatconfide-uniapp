<template>
	<view class="psychological-box">
		<scroll-view scroll-y="true" class="scroll-y" :show-scrollbar="false" @scrolltolower="reachBottom">
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
						<image src="/static/psychological-test/logo.svg" class="logo-svg"></image>
						<text class="txt">我的测评</text>
					</view>
				</view>

				<view class="scroll-content">
					<scroll-view scroll-x="true" class="scroll-x" :show-scrollbar="false">
						<view class="test-list">
							<view class="test-item" v-for="(item,index) in recommend" :key="index"
								@click="gotoDetail(item)">
								<image :src="item.icon?item.icon:'@/static/forum/bg.png'" mode="aspectFill" class="img">
								</image>
								<view class="test-title">{{item.title}}</view>
								<view class="use-test">{{item.examNum}}人已测</view>
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
							<!-- <div v-for="(danmu, index) in danmuList" :key="index" class="danmu-item">
								{{ danmu.text }}
							</div> -->
							<gp-danmu ref="danmuRef" :danmuList="danmuList" :config="danmuConfig">
								<template #danmu="{ danmu }">
									<view class="custom-danmu">
										<image v-if="danmu.avatar" :src="danmu.avatar" class="avatar" />
										<text class="username">{{danmu.username}}</text>
										<text class="content">{{danmu.text}}</text>
									</view>
								</template>
							</gp-danmu>
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
					<view class="tab-item" v-for="(item,index) in tabLists" :key="index"
						@click="openAllTypeHandler(item)">
						<image :src="item.url" class="img"></image>
						<text class="txt">{{item.text}}</text>
					</view>
				</view>
			</view>

			<view class="day-recommend-box">
				<view class="day-recommend-content">
					<view class="recommend-heaader">
						<view class="title">每日推荐</view>
						<view class="label" @click="getDailyRecommend">换一换<uni-icons type="reload" size="12"
								color="#38CC98"></uni-icons>
						</view>
					</view>
					<view class="content-list">
						<view class="content-item" v-for="(item,index) in dailyRecommendExams" :key="index"
							@click="gotoDetail(item)">
							<image :src="item.icon?item.icon:'@/static/forum/bg.png'" mode="aspectFill" class="img">
							</image>
							<view>
								<view class="title">{{item.title}}</view>
								<view class="price-box">
									<view class="price">{{item.payType==0?'免费':'￥'+item.discountPrice}}</view>
									<view class="use-test"><uni-icons type="fire-filled" size="18"
											color="#FA5151"></uni-icons><text class="num">{{item.examNum}}</text>人已测
									</view>
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
						<view class="label" @click="gotoPage()">更多<uni-icons type="right" size="12"></uni-icons>
						</view>
					</view>
					<view class="content-list">
						<view class="content-item" v-for="(item,index) in examList" :key="index" @click="gotoDetail(item)">
							<view class="content-item-content">
								<view>
									<view class="title">{{item.title}}</view>
									<view class="remark">{{item.oneWord}}</view>
									<view class="price-box" v-if="item.payType==1"><text
											class="price">￥{{item.discountPrice}}</text><text
											class="under-price">￥{{item.price}}</text></view>
											<view class="price-box">
												<text class="price"></text>免费</view>
									<view class="test-handler">
										<view class="handler-btn">去测试</view>
										<view class="use-test"><text class="num">{{item.examNum}}</text>人已测</view>
									</view>
								</view>
								<view class="img-box">
									<image :src="item.icon?item.icon:'@/static/consult/user.png'" mode="aspectFill"
										class="img"></image>
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
		ref,
		reactive
	} from 'vue';
	import {
		useGlobalDataStore
	} from '@/stores/global.js';
	import MoteLinesDivide from "@/components/mote-lines-divide/mote-lines-divide"
	import {
		recommendExams,
		dailyRecommend,
		examListData
	} from '@/common/api/exam.js'

	import {
		onLoad,
		onReachBottom
	} from '@dcloudio/uni-app'
	// import Danmaku from "@/components/danma/danma.vue"
	const globalStore = useGlobalDataStore();
	const danmuRef = ref(null)
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
	// 弹幕配置
	const danmuConfig = reactive({
		trackHeight: 40, // 轨道高度
		trackNumber: 3, // 轨道数量
		speed: 100, // 弹幕速度
		fontSize: 16, // 默认字体大小
		fontColor: '#000000', // 默认字体颜色
		backgroundColor: 'white', // 弹幕背景色
		trackMode: 'separate', // 轨道模式：overlap(重叠)、separate(分离)
		looping: true, // 是否循环播放
		direction: 'rtl', // 弹幕方向：rtl(从右到左)、ltr(从左到右)
		duration: 1000, // 弹幕动画持续时间（毫秒）
		density: 0.5, // 弹幕密度(0-1)
		randomTrack: true, // 是否随机选择轨道
		opacity: 1, // 弹幕透明度
		hoverPause: true
	});

	const gotoDetail = (item) => {
		uni.navigateTo({
			url: "/pages/psychological-test/charge-test/charge-test?id=" + item.id
		})
	}



	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const gotoPage = () => {
		uni.navigateTo({
			url: '/pages/psychological-test/test-type/test-type'
		})
	}



	const dailyRecommendExams = ref([])
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
		text: "职业",
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

	const recommend = ref([])
	const menuTabActive = ref(0);

	const menuTabHandler = (i) => {
		menuTabActive.value != i ? menuTabActive.value = i : '';
		examList.value = []
		getExamList()
	}

	const getRecommendExams = async () => {
		let resp = await recommendExams()
		recommend.value = resp.data

	}

	const getDailyRecommend = async () => {
		let resp = await dailyRecommend()
		console.log(resp);
		dailyRecommendExams.value = resp.data
	}

	const playDanmu = () => {
		danmuRef.value.play()
	}

	const freePage = ref(1)
	const pageSize = ref(10)
	const payPage = ref(1)

	const examList = ref([])
	const freeExamList = ref([])

	const payExamList = ref([])

	const freeHasMore = ref(false)
	const payHasMore = ref(false)
	const getExamList = async () => {
		let page = menuTabActive.value == 0 ? freePage.value : payPage.value
		let resp = await examListData({
			payType: menuTabActive.value,
			page: page,
			size: pageSize.value
		})
		console.log(resp);
		if (menuTabActive.value == 0) {
			if (freePage.value == 1) {
				freeExamList.value = resp.data.records
			} else {
				freeExamList.value = freeExamList.value.concat(resp.data.records)
			}
			console.log(freeExamList.value.length);
			if (resp.data.total <= freeExamList.value.length) {
				freeHasMore.value = false
			} else {
				freeHasMore.value = true
			}
			examList.value = freeExamList.value
		} else {
			if (payPage.value == 1) {
				payExamList.value = resp.data.records
			} else {
				payExamList.value = payExamList.value.concat(resp.data.records)
			}
			if (resp.data.total <= payExamList.value.length) {
				payHasMore.value = false
			} else {
				payHasMore.value = true
			}
			examList.value = payExamList.value
		}
	}

	onLoad(() => {
		// playDanmu()
		getRecommendExams()
		getDailyRecommend()
		getExamList()

	})

	const reachBottom = () => {
		console.log("reach bottom");
		if (menuTabActive.value == 0) {
			if (freeHasMore.value) {
				freePage.value++
				getExamList()
			}
		} else {
			if (payHasMore.value) {
				payPage++
				getExamList()
			}
		}
	}
	const myOrderHandler = () => {
		uni.navigateTo({
			url: "/pages/psychological-test/order/order"
		})
	}
	const danmuList = ref([{
			id: 1,
			text: '这是一条普通弹幕',
			color: '#000000'
		},
		{
			id: 2,
			text: '这是一条彩色弹幕',
			color: '#FF6600'
		},
		{
			id: 3,
			text: '这是一条顶部弹幕',
			color: '#00FFFF'
		},
		{
			id: 4,
			text: '这是一条底部弹幕',
			color: '#FFFF00'
		},
	]);

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

	const openAllTypeHandler = (item) => {
		if (item.id < 5) {


			uni.navigateTo({
				url: `/pages/psychological-test/test-type/test-type?type=${item.text}`
			})
		} else {
			uni.navigateTo({
				url: `/pages/psychological-test/test-type/test-type`
			})
		}
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
							padding-left: 15rpx;
						}

						.test-title {
							font-size: 24rpx;
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
			/* 根据需要调整 */
			overflow: hidden;

			.custom-danmu {
				background-color: white;
				border-radius: 50rpx;
			}
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