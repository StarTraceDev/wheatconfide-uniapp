<template>
	<view class="home-box" ref="homBox">
		<scroll-view scroll-y @scroll="onPageScroll" class="scroll-content" :show-scrollbar="false">
			<!-- 页面内容 -->
			<view class="header">
				<view class="grass">
					<image src="@/static/index/grass.png" class="img"></image>
				</view>
				<!--  :style="{'top':statusBarHeight+'px'}" -->
				<view class="contaior">
					<view class="search-content" :class="scrollTop>15?'scrollClass':''">
						<view class="search">
							<uni-search-bar class="uni-mt-10" radius="100" placeholder="请输入咨询师或问题类型" clearButton="auto"
								cancelButton="none" @confirm="searchFn" />
						</view>
						<view class="contact">
							<image :src="scrollTop>15?'/static/index/scroll-notice.png':'/static/index/notice.png'">
							</image>
						</view>
					</view>
					<view class="swiper-content">
						<view class="uni-margin-wrap">
							<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="5000"
								:duration="500">
								<swiper-item v-for="i in 2" :key="i" class="swiper-item">
									<view class="swiper-item uni-bg-red">
										<image src="https://odd.dzjob.net/profile/upload/20250519/20250520113143.png"
											class="img"></image>
									</view>
								</swiper-item>
							</swiper>
						</view>
					</view>
					<view class="job-content">
						<view class="job-item consult-box" @click="switchTabsFn(1)">
							<view class="title">心理咨询师</view>
							<view class="certificate">持有国家相关资格证书</view>
							<view class="reservation">去预约<uni-icons type="right" size="12" color="#fff"></uni-icons>
							</view>
							<image src="@/static/index/Consultant.png" class="img"></image>
						</view>
						<view class="job-item listen-box" @click="switchTabsFn(2)">
							<view class="title">心理倾听师</view>
							<view class="certificate">免预约，即可咨询</view>
							<view class="reservation">去咨询<uni-icons type="right" size="12" color="#fff"></uni-icons>
							</view>
							<image src="@/static/index/Listening.png" class="img"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="psychological-box">
				<!-- 页面标题 -->
				<view class="psychological-header">
					<view class="title">
						<text>心理咨询师专区</text>
						<image src="/static/index/subscript.png" class="subscript"></image>
					</view>

				</view>
				<!-- 说明栏 -->
				<view class="info-bar">
					<text class="bar-txt">本专区咨询师都持有国家相关资格证书</text>
				</view>
				<!-- 图标网格 -->
				<view class="icon-grid">
					<view class="icon-item" v-for="(item,index) in iconList" :key="index">
						<view class="icon-circle">
							<image :src="item.url" class="img"></image>
						</view>
						<text class="icon-text">{{item.txt}}</text>
					</view>
				</view>
				<view class="test-item-box">
					<view class="test-item pink">
						<view class="title">心理测试</view>
						<view class="txt">看看能打几分</view>
					</view>

					<view class="test-item purple">
						<view class="title">免费咨询</view>
						<view class="txt">名额免费抢</view>
					</view>

					<view class="test-item green">
						<view class="title">公益活动</view>
						<view class="txt">一起做公益</view>
					</view>
				</view>
			</view>

			<view class="listening-box">
				<view class="listening-header">
					<view class="title">
						<text>倾听师专区</text>
						<image src="/static/index/subscript.png" class="subscript"></image>
					</view>

				</view>
				<view class="listening-content-box">
					<view class="content-box" v-for="i in 3">
						<view class="content-item first-content-item">
							<view class="txt">文案</view>
							<image src="/static/index/listening-content-box-img.png" class="content-img"></image>
						</view>
						<view class="content-item">
							<view class="txt">文案</view>
						</view>
						<view class="content-item">
							<view class="txt">文案</view>
						</view>
					</view>
				</view>
			</view>

			<view class="hot-psychological-box">
				<view class="hot-psychological-header">
					<view class="title">热门咨询师</view>
					<view class="more" @click="switchTabsFn(1)">更多<uni-icons type="right" size="12"
							color="rgba(0, 0, 0, 0.5)"></uni-icons>
					</view>
				</view>
				<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0" :show-scrollbar="false">
					<view class="list">
						<ConsultTeacherListItem class="list-item" v-for="i in 10" @click="openTeacherFn(1)">
						</ConsultTeacherListItem>
					</view>
				</scroll-view>

			</view>

			<view class="hot-psychological-box">
				<view class="hot-psychological-header">
					<view class="title">热门倾听师</view>
					<view class="more" @click="switchTabsFn(2)">更多<uni-icons type="right" size="12"
							color="rgba(0, 0, 0, 0.5)"></uni-icons>
					</view>
				</view>
				<scroll-view class="scroll-view_H" scroll-x="true" scroll-left="0" :show-scrollbar="false">
					<view class="list">
						<ConfideTeacherListItem class="list-item" v-for="i in 10" @click="openTeacherFn(2)">
						</ConfideTeacherListItem>
					</view>
				</scroll-view>
			</view>


			<view class="psychology-test-box">
				<!-- 心理测试 -->
				<image class="img" src="/static/index/psychology-tree.png"></image>
				<view class="psychology-content">
					<view class="psychology-content-header">
						<view class="title">心理测试</view>
						<view class="more" @click="openPsyTestHandler"><text>更多</text><uni-icons type="right" size="12"
								color="rgba(0, 0, 0, 0.5)"></uni-icons>
						</view>
					</view>

					<view class="psychology-content-img">
						<image src="@/static/index/psychology-content-img.png" class="content-img"></image>
					</view>

					<view class="content-list">
						<view class="content-item" v-for="i in 8">
							<view class="lock">
								<image src="@/static/index/lock.png" class="lock-img"></image>
							</view>
							<view class="info">
								<div class="title">抑郁测评</div>
								<div class="num">39W 人已测</div>
								<div class="test-btn">开始测试</div>
							</view>
							<image src="/static/index/psychology-content-icon.png" class="content-item-img"></image>
						</view>
					</view>
				</view>
			</view>

			<view class="recommend-article-box">
				<view class="recommend-article-header">
					<view class="title">
						<view>文章推荐</view>
						<image src="/static/index/subscript.png" class="subscript"></image>
					</view>
					<view class="more" @click="openArticleFn(1)">更多<uni-icons type="right" size="12"
							color="rgba(0, 0, 0, 0.5)"></uni-icons>
					</view>
				</view>
				<view class="article-list">
					<RecommendArticleItem :info="i" v-for="i in data.list" class="article-item" @click="openArticleDetailFn(i)">
					</RecommendArticleItem>
				</view>
			</view>
			<view class="mm-forum-box">
				<view class="mm-forum-header">
					<view class="title">
						<view>麦苗论坛</view>
						<image src="/static/index/subscript.png" class="subscript"></image>
					</view>
					<view class="more" @click="openForumHandler">更多<uni-icons type="right" size="12"
							color="rgba(0, 0, 0, 0.5)"></uni-icons>
					</view>
				</view>
				<view class="forum-list">
					<ForumItem v-for="i in 10" class="forum-content"></ForumItem>
				</view>
			</view>
			<view class="remark-box">
				<!-- 标题 -->
				<view class="title">专业的心理服务平台</view>

				<!-- 热线电话 -->
				<view class="hotline">
					7×24 小时专属顾问热线：
					<text class="phone">400-6688-999</text>
				</view>

				<!-- 服务特性 Flex容器 -->
				<view class="feature-container">
					<!-- 每个特性项 -->
					<view class="feature-item" v-for="(item,index) in serverList" :key="index">
						<image class="icon" :src="item.icon" mode="aspectFit" />
						<view class="content">
							<text class="feature-title">{{ item.title }}</text>
							<text class="feature-desc">{{ item.desc }}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script setup>
	import {
		userlnfo
	} from "@/common/api/apis.js"
	import {
		getArticleList
	} from "@/common/api/article.js"
	import {
		ref,
		onMounted,
		reactive
	} from 'vue';
	import ConfideTeacherListItem from '@/components/Confide-Teacher-List-Item.vue';
	import ConsultTeacherListItem from '@/components/Consult-Teacher-List-Item.vue';
	import RecommendArticleItem from '@/components/Recommend-Article-Item'
	import ForumItem from '@/components/Forum-Item'
	import {
		useGlobalDataStore
	} from '@/stores/global.js';
	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 20 + 'rpx');
	const searchContentHeight = ref(globalStore.statusBarHeight + 56 + 'rpx');
	let scrollTop = ref(0);
	const data = reactive({
		listParams:{
			"current": 1,
			"size": 10,
			"params":{
				
			}
		},
		list:[]
	})
	let iconList = ref([{
		txt: "人际关系",
		url: "/static/index/icon1.png"
	}, {
		txt: "情绪管理",
		url: "/static/index/icon1.png"
	}, {
		txt: "心理健康",
		url: "/static/index/icon1.png"
	}, {
		txt: "婚姻家庭",
		url: "/static/index/icon1.png"
	}, {
		txt: "恋爱心理",
		url: "/static/index/icon1.png"
	}, {
		txt: "人际关系",
		url: "/static/index/icon1.png"
	}, {
		txt: "情绪管理",
		url: "/static/index/icon1.png"
	}, {
		txt: "心理健康",
		url: "/static/index/icon1.png"
	}, {
		txt: "婚姻家庭",
		url: "/static/index/icon1.png"
	}, {
		txt: "恋爱心理",
		url: "/static/index/icon1.png"
	}]);

	const serverList = ref([{
			icon: '/static/index/remark-icon1.png',
			title: '严选师资',
			desc: '5.2万认证咨询师'
		},
		{
			icon: '/static/index/remark-icon2.png',
			title: '专业咨询',
			desc: '累计时长7亿+分钟'
		},
		{
			icon: '/static/index/remark-icon3.png',
			title: '免费退改',
			desc: '承诺限时内可退改'
		},
		{
			icon: '/static/index/remark-icon4.png',
			title: '隐私保障',
			desc: '咨询过程全保密'
		}
	]);
	const searchFn = () => {

	}

	const onPageScroll = (e) => {
		scrollTop.value = e.detail.scrollTop;
	}

	const openArticleFn = (type) => {
		let url = type == 1 ? '/pages/readArticle/readArticle' : '/pages/readArticle/articleDetail'
		uni.navigateTo({
			url
		})
	}

	const openTeacherFn = (type) => {
		let url = type == 1 ? '/pages/consult/detail' : '/pages/confide/detail'
		uni.navigateTo({
			url
		})
	}

	const switchTabsFn = (type) => {
		let url = type == 1 ? '/pages/consult/index' : '/pages/confide/index'
		uni.switchTab({
			url
		})
	}

	const openForumHandler = () => {
		uni.navigateTo({
			url: "/pages/forum/index/index"
		})
	}

	const openPsyTestHandler = () => {
		uni.navigateTo({
			url: '/pages/psychological-test/index/index'
		})
	}

	/**
	 * 获取当前用户信息
	 */
	const getUserlnfo = async () => {
		let res = await userlnfo();
		globalStore.setUserInfo(res.data);
		// console.log(res)
	}
	
	const openArticleDetailFn = (item) => {
		uni.navigateTo({
			url: "/pages/readArticle/articleDetail?id="+item.id
		})
	}
	
	const getList = async () => {
		let res = await getArticleList(data.listParams);
		data.list = res.data.records
		console.log('========================')
	}
	
	onMounted(() => {
		// getUserlnfo()
		
		getList()
	});
</script>
<style lang="scss" scoped>
	.home-box {
		width: 100vw;
		position: relative;
		background: #F5F9FA;

		.scroll-content {
			height: 100vh;

			.header {
				width: 100vw;
				height: 712rpx;
				background: linear-gradient(180deg, #5FC484 4%, #F5F9FA 100%);
				position: relative;

				.grass {
					position: absolute;
					z-index: 1;
					left: 32rpx;

					// top: 30rpx;
					.img {
						width: 686rpx;
						height: 250rpx;
					}
				}

				.contaior {
					position: absolute;
					z-index: 2;

					.search-content {
						display: flex;
						align-items: center;
						position: fixed;
						z-index: 999;
						height: v-bind(searchContentHeight);
						width: 100vw;
						// background: #fff;
						padding-top: v-bind(statusBarHeight);

						.search {
							width: 680rpx;
						}

						.contact {
							display: flex;
							flex-direction: column;
							justify-content: center;

							image {
								width: 48rpx;
								height: 48rpx;
							}

							text {
								color: rgba(0, 0, 0, 0.85);
								font-size: 18rpx;
							}
						}
					}

					.scrollClass {
						background: #fff;
					}

					.swiper-content {
						margin: 212rpx 32rpx 0rpx 32rpx;

						.uni-margin-wrap {
							width: 686rpx;
							height: 240rpx;

							.swiper {
								height: 100%;
								width: 100%;

								.swiper-item {
									border-radius: 20rpx;

									.img {
										width: 686rpx;
										height: 240rpx;
										border-radius: 20rpx;
									}
								}


								::v-deep .uni-swiper-dots {
									.uni-swiper-dot {
										width: 6px;
										height: 3px;
										border-radius: 3px;
										background: rgba(255, 255, 255, 0.16);
									}

									.uni-swiper-dot-active {
										background: #FFFFFF;
									}

								}
							}
						}
					}

					.job-content {
						display: flex;
						padding: 0rpx 32rpx;
						justify-content: space-between;
						margin-top: 32rpx;

						.consult-box {
							background: linear-gradient(180deg, #FFFFFF 3%, #E6FEEA 100%);
							box-shadow: 0px 4px 10px 0px rgba(53, 202, 149, 0.2);
						}

						.listen-box {
							background: linear-gradient(180deg, #FFFFFF 3%, #FFEDCF 100%);
							box-shadow: 0px 4px 10px 0px rgba(249, 194, 93, 0.2);
						}

						.job-item {
							width: 332rpx;
							height: 288rpx;
							border-radius: 20rpx;
							position: relative;

							.title {
								font-size: 36rpx;
								color: rgba(0, 0, 0, 0.85);
								font-weight: 600;
								margin-top: 40rpx;
								margin-left: 32rpx;

							}

							.certificate {
								font-size: 24rpx;
								color: rgba(0, 0, 0, 0.5);
								margin-top: 20rpx;
								margin-left: 32rpx;
							}

							.reservation {
								width: 124rpx;
								height: 44rpx;
								border-radius: 24rpx;
								/* 自动布局 */
								display: flex;
								align-items: center;
								justify-content: center;
								font-size: 24rpx;
								color: #FFFFFF;
								margin-top: 26rpx;
								margin-left: 32rpx;
							}

							.img {
								width: 92rpx;
								height: 100rpx;
								position: absolute;
								right: 25rpx;
								bottom: 0rpx;
							}
						}

						.consult-box .reservation {
							background: #1EBC80;
						}

						.listen-box .reservation {
							background: #F9BC21;
						}

					}
				}
			}

			.psychological-box {
				margin-top: 120rpx;

				.psychological-header {
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					position: relative;

					.title {
						font-size: 40rpx;
						font-weight: bold;
						color: #333;
						position: relative;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;

						.subscript {
							width: 36rpx;
							height: 36rpx;
							position: absolute;
							top: 40rpx;
						}
					}
				}

				.info-bar {
					background: rgba(0, 152, 83, 0.1);
					border-radius: 10rpx;
					margin-bottom: 20rpx;
					color: #009853;
					font-size: 24rpx;
					width: 686rpx;
					height: 56rpx;
					border-radius: 8rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-left: 32rpx;
					position: relative;
					margin-top: 30rpx;

					.bar-txt {
						position: relative;
					}

					.bar-txt::before {
						width: 22px;
						height: 4rpx;
						transform: rotate(180deg);
						/* 自动布局 */
						background: linear-gradient(270deg, #009853 0%, rgba(0, 152, 83, 0) 100%);
						content: "";
						position: absolute;
						left: -64rpx;
						top: 14rpx
					}

					.bar-txt::after {
						width: 22px;
						height: 4rpx;
						background: linear-gradient(270deg, #009853 0%, rgba(0, 152, 83, 0) 100%);
						content: "";
						position: absolute;
						right: -64rpx;
						top: 14rpx
					}
				}

				.icon-grid {
					display: flex;
					flex-wrap: wrap;

					.icon-item {
						width: 150rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						margin-bottom: 20rpx;

						.icon-circle {
							width: 88rpx;
							height: 88rpx;

							.img {
								width: 88rpx;
								height: 88rpx;
							}
						}

						.icon-text {
							color: rgba(0, 0, 0, 0.6);
							font-size: 24rpx;
						}
					}

				}

				.test-item-box {
					width: 686rpx;
					display: flex;
					flex-direction: row;
					margin-left: 32rpx;
					justify-content: space-between;

					.test-item {
						width: 216rpx;
						height: 132rpx;
						border-radius: 20rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;

						.title {
							color: rgba(0, 0, 0, 0.85);
							font-size: 28rpx;
						}

						.txt {
							color: rgba(0, 0, 0, 0.5);
							font-size: 24rpx;
						}
					}

					.pink {
						background: #F6E5EB;
					}

					.purple {
						background: #F0EDFE;
					}

					.green {
						background: #D7EFEF;
					}
				}
			}

			.listening-box {
				margin-top: 60rpx;

				.listening-header {
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					position: relative;

					.title {
						font-size: 40rpx;
						font-weight: bold;
						color: #333;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;

						.subscript {
							position: absolute;
							width: 36rpx;
							height: 36rpx;
							top: 40rpx;
						}
					}
				}

				.listening-content-box {
					padding: 0rpx 32rpx;
					margin-top: 40rpx;

					.content-box {
						display: flex;
						justify-content: space-between;
						margin-top: 20rpx;

						.content-item {
							width: 182rpx;
							height: 120rpx;
							border-radius: 12rpx;
							/* 自动布局 */
							background: #FDEED8;

							.txt {
								color: rgba(0, 0, 0, 0.85);
								font-size: 28rpx;
								padding-top: 24rpx;
								padding-left: 34rpx;
							}
						}

						.first-content-item {
							width: 282rpx;
							height: 120rpx;
							border-radius: 12rpx;
							background: #E7F1F9;
							position: relative;

							.content-img {
								width: 108rpx;
								height: 83rpx;
								position: absolute;
								bottom: 0;
								right: 0;
							}
						}


					}
				}
			}

			.hot-psychological-box {
				padding: 0rpx 32rpx;
				margin-top: 60rpx;

				.hot-psychological-header {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.title {
						color: rgba(0, 0, 0, 0.85);
						font-size: 36rpx;
						font-weight: 500;
					}

					.more {
						color: rgba(0, 0, 0, 0.5);
						font-size: 24rpx;
						font-size: 400;
					}
				}

				.scroll-view_H {
					margin-top: 32rpx;

					.list {
						display: flex;
						flex-direction: row;

						.list-item {
							margin-right: 24rpx;
							flex-shrink: 0;
						}
					}
				}
			}

			.psychology-test-box {
				margin-top: 60rpx;
				width: 100vw;
				background: linear-gradient(148deg, #C9EAD8 4%, #EEF8FE 57%);
				position: relative;
				// height: 100%;

				.img {
					width: 390rpx;
					height: 142rpx;
					position: absolute;
					left: 0;
					top: 0;
					z-index: 1;
				}

				.psychology-content {
					// position: absolute;
					padding: 0rpx 32rpx;
					z-index: 1;

					.psychology-content-header {
						display: flex;
						width: 686rpx;
						justify-content: space-between;
						padding-top: 40rpx;
						align-items: center;

						.title {
							color: rgba(0, 0, 0, 0.85);
							font-size: 36rpx;
							font-weight: 500;
						}

						.more {
							color: rgba(0, 0, 0, 0.5);
							font-size: 24rpx;
							font-size: 400;
						}
					}

					.psychology-content-img {
						padding-top: 40rpx;

						.content-img {
							width: 686rpx;
							height: 168rpx;
						}
					}
				}

				.content-list {
					display: flex;
					width: 100vw;
					flex-wrap: wrap;

					// padding-top: 32rpx;
					.content-item {
						width: 334rpx;
						height: 200rpx;
						border-radius: 20rpx;
						background: #fff;
						margin-right: 20rpx;
						flex-shrink: 0;
						position: relative;
						display: flex;
						line-height: 1;
						margin-top: 32rpx;

						.lock {
							margin-left: 20rpx;
							margin-top: 36rpx;

							.lock-img {
								width: 28rpx;
								height: 28rpx;
							}

						}

						.info {
							margin-left: 8rpx;
							margin-top: 36rpx;

							.title {
								font-size: 28rpx;
								color: rgba(0, 0, 0, 0.85);
								font-weight: 500;
							}

							.num {
								color: rgba(0, 0, 0, 0.5);
								font-size: 24rpx;
								font-weight: normal;
								margin-top: 12rpx;
							}

							.test-btn {
								font-size: 24rpx;
								color: #35CA95;
								margin-top: 68rpx;
							}
						}

						.content-item-img {
							position: absolute;
							width: 90rpx;
							height: 90rpx;
							right: 0rpx;
							bottom: 0rpx;
						}
					}
				}
			}

			.recommend-article-box {
				margin-top: 60rpx;

				.recommend-article-header {
					padding: 0rpx 32rpx;
					display: flex;
					justify-content: space-between;

					.title {
						color: rgba(0, 0, 0, 0.85);
						font-size: 36rpx;
						font-weight: 500;
						display: flex;
						justify-content: center;
						flex-direction: column;
						align-items: center;
						position: relative;

						.subscript {
							width: 36rpx;
							height: 36rpx;
							position: absolute;
							top: 36rpx;
						}
					}

					.more {
						color: rgba(0, 0, 0, 0.5);
						font-size: 24rpx;
						font-size: 400;
					}
				}

				.article-list {
					width: 100vw;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.article-item {
						margin-top: 20rpx;
					}
				}
			}

			.mm-forum-box {
				margin-top: 60rpx;

				.mm-forum-header {
					padding: 0rpx 32rpx;
					display: flex;
					justify-content: space-between;

					.title {
						color: rgba(0, 0, 0, 0.85);
						font-size: 36rpx;
						font-weight: 500;
						display: flex;
						justify-content: center;
						flex-direction: column;
						align-items: center;
						position: relative;

						.subscript {
							width: 36rpx;
							height: 36rpx;
							position: absolute;
							top: 36rpx;
						}
					}

					.more {
						color: rgba(0, 0, 0, 0.5);
						font-size: 24rpx;
						font-size: 400;
					}
				}

				.forum-list {
					padding: 0rpx 32rpx;

					.forum-content {
						margin-top: 20rpx;
					}
				}
			}

			.remark-box {
				padding: 40rpx;

				.title {
					font-size: 28rpx;
					font-weight: bold;
					color: rgba(0, 0, 0, 0.85);
					text-align: center;
					margin-bottom: 40rpx;
					position: relative;

				}

				.title::after {

					position: absolute;
					width: 186rpx;
					height: 4rpx;
					transform: rotate(180deg);
					opacity: 0.6;
					content: '';
					right: -24rpx;
					top: 24rpx;
					/* 自动布局 */
					background: linear-gradient(270deg, rgba(0, 0, 0, 0.27) 0%, rgba(0, 0, 0, 0) 100%);
				}

				.title::before {
					left: -24rpx;
					top: 24rpx;
					position: absolute;
					width: 186rpx;
					height: 4rpx;
					transform: rotate(180deg);
					opacity: 0.6;
					content: '';
					background: linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.27) 100%);
				}

				.hotline {
					text-align: center;
					font-size: 24rpx;
					color: rgba(0, 0, 0, 0.5);
					margin-bottom: 60rpx;
				}

				.feature-container {
					display: flex;
					flex-wrap: wrap;

					/* 两列布局：每个item占50% */
					.feature-item {
						width: 50%;
						padding: 20rpx;
						box-sizing: border-box;
						display: flex;
						align-items: center;
						margin-bottom: 40rpx;

						.icon {
							width: 40rpx;
							height: 40rpx;
							margin-right: 20rpx;
						}

						.content {
							display: flex;
							flex-direction: column;
						}

						.feature-title {
							font-size: 24rpx;
							color: rgba(0, 0, 0, 0.85);
							font-weight: 500;
							margin-bottom: 8rpx;
						}

						.feature-desc {
							font-size: 20rpx;
							color: rgba(0, 0, 0, 0.5);
						}
					}


				}
			}
		}
	}
</style>