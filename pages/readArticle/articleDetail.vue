<template>
	<view class="read-article-box">
		<view class="header">
			<uni-nav-bar backgroundColor="#F4F6F8" :border="false" title="" class="header-bar" :statusBar="true" fixed>
				<template v-slot:left>
					<uni-icons type="left" size="24" @click="backFn"></uni-icons>
				</template>
				<template v-slot:right>
					<view class="right">
						<uni-icons type="more-filled" size="24" @click="backFn"></uni-icons>
					</view>
				</template>
			</uni-nav-bar>
		</view>
		<view class="article-content">
			<view class="detail-box">
				<view class="title">{{info?.title}}</view>
				<view class="article-user">
					<view class="user">
						<view>
							<image src="/static/my/profile.png" class="picture"></image>
						</view>
						<view class="name-box">
							<view class="name">咨询师</view>
							<view class="auth">咨询师 | 认证作家</view>
						</view>
					</view>
					<view class="follow"><uni-icons type="plusempty" size="12" color="#35CA95"></uni-icons><text
							class="txt">关注</text></view>
				</view>
				<view class="content">
					{{info?.content}}
				</view>
				<view class="date-num">
					<view>2025-05-06</view>
					<view style="padding-left: 20rpx;">阅读 7876</view>
				</view>
				<view class="contact">文章转载/侵权，请联系邮箱：<text class="txt">6757567@163.com</text></view>
			</view>
			<view style="background-color: white;margin: 30rpx;padding: 18rpx;">
				<view style="margin-bottom: 30rpx;"><text style="font-size: 42rpx;font-weight: bold;">热门评论</text></view>
			<view v-for="(item,index) in commentList" :key="index" style="margin-bottom: 20rpx;">
				<view style="display: flex;flex-direction: row;">
					<image style="width: 48rpx;height: 48rpx;border-radius: 24rpx;" :src="item.avatar==null?'@/static/my/profile.png':item.avatar"></image>
					<view style="margin-left: 20rpx;display: flex;flex-direction: column;">
					<text style="font-size: 26rpx;">{{item.nickname}}</text>
					<text style="margin-top: 10rpx;font-size: 28rpx;color: #666666;">{{ item.content }}</text>
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
						<ConsultTeacherListItem class="list-item" v-for="i in 10" @click="switchTabsFn(2)">
						</ConsultTeacherListItem>
					</view>
				</scroll-view>
			</view>

			<view class="recommend-article-box">
				<view class="recommend-article-header">
					<view class="title">
						<view>相关阅读</view>
					</view>
					<view class="more" @click="openArticleFn(1)">更多<uni-icons type="right" size="12"
							color="rgba(0, 0, 0, 0.5)"></uni-icons>
					</view>
				</view>
				<view class="article-list">
					<RecommendArticleItem :info="i" v-for="i in recommendArticles" class="article-item" @click="openArticleFn(i)">
					</RecommendArticleItem>
				</view>
			</view>
		</view>
		<view class="reply-box">
			<view class="reply-contaior">
				<view class="reply-content">
					<uni-easyinput @change="onSaveComment" prefix-icon="chat" :clearable="false" v-model="replyContent"
						placeholder="写点什么" :trim="true" class="reply-input">
					</uni-easyinput>
				</view>
				<view class="reply-icons">
					<uni-icons type="star" size="24" color="rgba(0, 0, 0, 0.35)"></uni-icons>
					<uni-icons type="hand-up" size="24" color="rgba(0, 0, 0, 0.35)"></uni-icons>
					<uni-icons type="redo" size="24" color="rgba(0, 0, 0, 0.35)"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref,
		reactive
	} from 'vue';
	import { onLoad,onBackPress } from '@dcloudio/uni-app'
	import {
		useGlobalDataStore
	} from '@/stores/global.js';
	import {
		getArticleDetail,
		getCommentById,
		saveComment,
		relativeArticle
	} from "@/common/api/article.js"
	import RecommendArticleItem from '@/components/Recommend-Article-Item';
	import ConsultTeacherListItem from '@/components/Consult-Teacher-List-Item.vue';
	import {
		useRoute
	} from 'vue-router'; // 引入路由钩子
	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
	// 获取路由实例，用于获取参数
	const route = useRoute();
	const recommendArticles = ref([])
	const tabActive = ref(0);
	const replyContent = ref("");
	let id=ref();
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
	const info = ref()
	
	const commentList = ref()
	const getRecommend =  async()=>{
		let res = await relativeArticle()
		// console.log(res);
		recommendArticles.value =res.data
		console.log(recommendArticles.value);
	}
	getRecommend()
	
	const changeTabHandler = (index) => {
		tabActive.value = index
	}

	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const switchTabsFn = (type) => {
		if (type == 1) {
			uni.switchTab({
				url: '/pages/consult/index'
			})
		} else {
			uni.navigateTo({
				url: '/pages/consult/detail'
			})
		}

	}

	const openArticleFn = (item) => {
		// let url = type == '1' ? '/pages/readArticle/readArticle' : ''
		// uni.navigateTo({
		// 	url
		// })
		uni.navigateTo({
			url: "/pages/readArticle/articleDetail?id="+item.id
		})
	}

	const getInfo = async () => {
		let res = await getArticleDetail({
			id: id.value
		});
		info.value = res.data;
	}
	
	const getList = async () => {
		data.listParams.params.articleId = id.value
		let res = await getCommentById(data.listParams);
		
		commentList.value = res.data.records;
	}

	const onSaveComment = async () => {
		let res = await saveComment({
			"content": replyContent.value,
			"articleId": id.value
		});
		replyContent.value=""
		uni.showToast({
		    title: '发布成功',
		    icon: 'none', // 可选值 'success', 'loading', 'none'
		    duration: 2000 // 持续时长，单位ms
		});
		console.log(res)
	}
	
	onLoad((options) => {
		id.value = options.id
		getInfo();
		getList();
	})
	onMounted(() => {
	
	})
</script>

<style lang="scss" scoped>
	.read-article-box {
		$statusBarHeight: v-bind(statusBarHeight);
		width: 100vw;
		min-height: 100vh;
		height: auto;
		background-color: #F4F6F8;

		.header {

			// position: fixed;
			// width: 100vw;
			// height: calc($statusBarHeight + 88rpx);
			// z-index: 1;
			// color: #F4F6F8;
			.header-bar {

				// padding-top: $statusBarHeight ;
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
			// padding-top: calc($statusBarHeight);
			padding-bottom: 132rpx;

			.detail-box {
				padding: 32rpx;
				// padding-right: 32rpx;
				background: #fff;

				.title {
					font-size: 36rpx;
					font-weight: bold;
					line-height: 52rpx;
					letter-spacing: 0rpx;
					color: rgba(0, 0, 0, 0.85);
					padding-top: 24rpx;
				}

				.article-user {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: 32rpx;

					.user {
						display: flex;
						align-items: center;

						.picture {
							width: 72rpx;
							height: 72rpx;
						}

						.name-box {
							padding-left: 20rpx;

							.name {
								font-size: 28rpx;
								color: rgba(0, 0, 0, 0.85);
								font-weight: bold;
							}

							.auth {
								font-size: 22rpx;
								color: rgba(0, 0, 0, 0.3);
							}
						}
					}

					.follow {
						display: flex;
						align-items: center;
						width: 108rpx;
						height: 48rpx;
						border: 1px solid #35CA95;
						color: #35CA95;
						font-size: 24rpx;
						border-radius: 26px;
						justify-content: center;

						.txt {
							padding-left: 10rpx;
						}
					}
				}

				.content {
					color: rgba(0, 0, 0, 0.65);
					font-size: 24rpx;
					line-height: 40rpx;
					margin-top: 42rpx;
				}

				.date-num {
					display: flex;
					color: #9E9E9E;
					font-size: 24rpx;
					margin-top: 40rpx;
					align-items: center;
				}

				.contact {
					margin-top: 20rpx;
					font-size: 24rpx;
					color: rgba(0, 0, 0, 0.35);

					.txt {
						color: rgba(0, 0, 0, 0.65);
					}
				}
			}

			.hot-psychological-box {
				padding: 0rpx 32rpx;
				margin-top: 60rpx;

				.hot-psychological-header {
					display: flex;
					justify-content: space-between;

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
		}

		.reply-box {
			width: 100vw;
			bottom: 0;
			height: 112rpx;
			/* 自动布局 */
			position: fixed;
			background: #FFFFFF;

			.reply-contaior {
				padding: 0rpx 32rpx;
				display: flex;

				.reply-content {
					width: 410rpx;
					display: flex;
					align-items: center;
					height: 112rpx;

					::v-deep(.reply-input) {
						.is-input-border {
							border-radius: 40rpx !important;
							background-color: #F1F1F1 !important;
							border: none;
							padding-right: 20rpx !important;
						}

						.uni-input-wrapper {}
					}
				}

				.reply-icons {
					width: 240rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-left: 20rpx;
				}
			}

		}
	}
</style>