<template>
	<view class="read-article-box">
		<view class="header">
			<uni-nav-bar backgroundColor="rgba(255,255,255,0)" :border="false" title="文章阅读" class="header-bar">
				<template v-slot:left>
					<uni-icons type="left" size="24" @click="backFn"></uni-icons>
				</template>
				<template v-slot:right>
					<view class="right">
						<image src="/static/confide/share.png" style="width: 40rpx;height: 40rpx;"></image>
					</view>
				</template>
			</uni-nav-bar>
		</view>
		<view class="article-content">
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
		</view>
		<view class="article-tabs">
			<view class="tab-item" v-for="(item,index) in tabLists" :key="index" @click="changeTabHandler(index)">
				{{item.txt}}
				<image src="/static/index/subscript.png" class="active-img" v-if="index==tabActive"></image>
			</view>
		</view>
		<scroll-view scroll-y="true" class="scroll-content">
			<view class="article-list">
				<RecommendArticleItem :info="i" v-for="i in data.list" class="article-item" @click="openArticleDetailFn(i)">
				</RecommendArticleItem>
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
	import {
		getArticleList
	} from "@/common/api/article.js"
	import RecommendArticleItem from '@/components/Recommend-Article-Item'
	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
	const tabActive = ref(0);
	const data = reactive({
		listParams:{
			"current": 1,
			"size": 10,
			"params":{
				
			}
		},
		list:[]
	})
	const tabLists = ref([{
		txt: "推荐",
		id: 1
	}, {
		txt: "情感",
		id: 2
	}, {
		txt: "文化",
		id: 3
	}, {
		txt: "职场",
		id: 4
	}, {
		txt: "职场",
		id: 5
	}, {
		txt: "职场",
		id: 6
	}, {
		txt: "职场",
		id: 7
	}, {
		txt: "职场",
		id: 7
	}]);

	const changeTabHandler = (index) => {
		tabActive.value = index
	}

	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const openArticleDetailFn = (item) => {
		uni.navigateTo({
			url: "/pages/readArticle/articleDetail?id="+item.id
		})
	}
	const getList = async () => {
		let res = await getArticleList(data.listParams);
		data.list=res.data.records
	}
	
	onMounted(()=>{
		getList()
	})
</script>

<style lang="scss" scoped>
	.read-article-box {
		$statusBarHeight: v-bind(statusBarHeight);
		width: 100vw;
		height: 100%;
		min-height: 100vh;
		background-color: #F4F6F8;

		.header {
			position: fixed;
			width: 100vw;
			height: 88rpx;
			z-index: 1;

			.header-bar {
				padding-top: $statusBarHeight ;

				::v-deep(.uni-nav-bar-text) {
					font-size: 32rpx;
					font-weight: 600;
					color: #fff;
				}
			}
		}

		.headerActive {
			background-color: #fff;
		}

		.article-content {
			display: flex;
			align-items: center;
			flex-direction: column;
			padding-top: calc($statusBarHeight + 122rpx);

			.swiper-content {
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
		}

		.article-tabs {
			display: flex;
			flex-direction: row;
			width: 686rpx;
			margin: 0rpx 32rpx;
			overflow-x: scroll;
			margin-top: 48rpx;
			height: 64rpx;

			.tab-item {
				flex-shrink: 0;
				position: relative;
				display: flex;
				justify-content: center;

				.active-img {
					width: 36rpx;
					height: 36rpx;
					position: absolute;
					bottom: 0;
				}
			}

			.tab-item:not(:last-of-type) {
				margin-right: 68rpx;
			}

			&::-webkit-scrollbar {
				width: 0 !important;
				display: none;
				height: 0 !important;
				color: transparent;
				background-color: transparent;
			}
		}

		.scroll-content {
			height: calc(100vh - $statusBarHeight - 474rpx);

			.article-list {
				width: 100vw;
				margin: 32rpx;

				.article-item {
					margin-top: 20rpx;
				}
			}
		}

	}
</style>