<template>
	<view class="forum-index-content">
		<view class="header"><text class="num">172,567</text> 个问题在这里收获了答案</view>
		<scroll-view scroll-x="true" class="scroll-content-x" :show-scrollbar="false">
			<view class="qa-content-list">
				<view class="qa-content-item" v-for="(item,index) in hotQas" :key="index">
					<view class="item-box">
						<view class="title">{{item.title}}</view>
						<view class="content"><text class="txt">{{item.totalComment==null?0:item.totalComment}} 个回答</text><uni-icons type="help-filled" size="14"
								color="rgba(104, 117, 129, 1)"></uni-icons>
						</view>
					</view>

				</view>
			</view>
		</scroll-view>
		<view class="tabs">
			<view @click="contentTabsHandler(item)" class="tab-item" v-for="(item,index) in contentTabsList"
				:key="index" :class="contentTabsActive==item.id?'active':''">{{item.label}}</view>
		</view>
		<view class="forum-index-list">
			<scroll-view scroll-y="true" class="scroll-content" :show-scrollbar="false">
				<view class="forum-index-list-item" v-for="i in data.list" :key="index" @click="openQaDetailFn(i.id)">
					<view class="question">
						<image src="/static/forum/question.svg" class="img"></image>
						<text class="txt">{{i.title}}</text>
					</view>
					<view class="item-header">
						<view class="item-header-left">
							<view class="header-pic">
								<image :src="i.avatar==null?'/static/my/profile.png':i.avatar" class="img"></image>
								<view class="name">{{i.realName}}</view>
								<text class="tip">咨询师</text>
							</view>
						</view>
					</view>
					<view class="item-content">
						<mote-lines-divide :line="5" expandText="展开" foldHint="收起">
							{{i.content}}
						</mote-lines-divide>
					</view>
					<view class="item-btn">
						<view v-if="i.isZan==0">
							<image src="/static/common/zan.png" class="img"></image>点赞
						</view>
						<view v-else>
							<image src="/static/common/zan-active.png" class="img"></image>{{i.zanNum}}
						</view>
						<view>
							<image src="/static/common/msg.png" class="img"></image>评论
						</view>
						<view>
							<image src="/static/common/share.png" class="img" @click="openShare"></image>分享
						</view>
						<view><uni-icons type="more-filled" size="18" color="#808080"></uni-icons></view>
					</view>
				</view>
			</scroll-view>
		</view>
		<share ref="sharePopup"></share>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref,
		reactive
	} from 'vue';
	import {
		getAnswerList,
		getHotQa
	} from "@/common/api/answer.js"
	import share from '@/components/share/share.vue'
	import MoteLinesDivide from "@/components/mote-lines-divide/mote-lines-divide"
	const sharePopup = ref(null)
	const data = reactive({
		listParams:{
			"current": 1,
			"size": 10,
			"params":{
				
			}
		},
		list:[]
	})
	const hotQas = ref([])
	
	const contentTabsList = ref([{
		id: 0,
		label: "最新"
	}, {
		id: 1,
		label: "推荐"
	}]);
	const contentTabsActive = ref(0);
	const contentTabsHandler = (options) => {
		if (contentTabsActive.value != options.id) {
			contentTabsActive.value = options.id
		}
	}

	const newContens = ref([{
		content: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
		isZan: 0,
		zanNum: 536,
		isFollow: 0
	}]);

	const openShare = () => {
		sharePopup.value.openShare()
	}
	
	const getList = async () => {
		let res = await getAnswerList(data.listParams);
		console.log(res);
		data.list=res.data.records
	}
	
	const getRecommendList = async ()=>{
		let res = await getHotQa()
		console.log(res);
		hotQas.value = res.data
	}
	getRecommendList()
	
	const openQaDetailFn = (item) => {
		console.log('====================' + item)
		uni.navigateTo({
			url: "/pages/forum/index/qaDetail?id="+item
		})
	}
	
	onMounted(()=>{
		getList()
	})
</script>

<style lang="scss" scoped>
	.forum-index-content {
		height: 100%;
		.header {
			padding-left: 32rpx;
			margin-top: 40rpx;
			.num {
				font-size: 36rpx;
				font-weight: 500;
				color: #35CA95;
			}
		}
		.scroll-content-x {
			margin-top: 32rpx;
			::v-deep .uni-scroll-view-content {
				width: 750rpx;
				display: flex;
				justify-content: center;

				.qa-content-list {
					height: 240rpx;
					display: flex;
					width: 678rpx;

					.qa-content-item {
						width: 300rpx;
						height: 200rpx;
						border-radius: 20rpx;
						background: #FFFFFF;
						flex-shrink: 0;
						margin-right: 20rpx;

						.item-box {
							padding: 28rpx;
							position: relative;

							.title {
								font-size: 28rpx;
								font-weight: 500;
								letter-spacing: normal;
								color: rgba(0, 0, 0, 0.65);
								height: 80rpx;
							}

							.content {
								display: flex;
								justify-content: space-between;
								margin-top: 32rpx;

								.txt {
									font-size: 24rpx;
									font-weight: normal;
									color: rgba(0, 0, 0, 0.5);
								}
							}
						}

						&:last-child {
							margin-right: 0rpx;
						}
					}
				}
			}


		}


		.tabs {
			display: flex;
			font-size: 32rpx;
			color: rgba(0, 0, 0, 0.65);
			margin-top: 30rpx;
			padding-left: 36rpx;
			width: 182rpx;
			justify-content: space-between;
			height: 48rpx;

			.tab-item {
				display: flex;
				justify-content: center;
			}

			.active {
				position: relative;
				color: rgba(0, 0, 0, 0.85);

				&::after {
					width: 28rpx;
					height: 28rpx;
					content: '';
					background-image: url("/static/common/forum-content-tab-active.png");
					position: absolute;
					background-size: 100% 100%;
					bottom: -20rpx;
				}
			}
		}

		.forum-index-list {
			height: calc(100% - 460rpx);
			margin-top: 44rpx;
			padding: 0rpx 32rpx;
           
			.scroll-content {
				height: 100%;

				.forum-index-list-item {
					border-radius: 20rpx;
					/* 自动布局 */
					background: #FFFFFF;
					padding: 32rpx;
					margin-bottom: 20rpx;

					.question {
						display: flex;
						align-items: center;

						.img {
							width: 40rpx;
							height: 40rpx;
						}

						.txt {
							font-size: 30rpx;
							font-weight: 500;
							letter-spacing: normal;
							color: rgba(0, 0, 0, 0.85);
							padding-left: 4rpx;
						}
					}

					.item-header {
						display: flex;
						justify-content: space-between;
						width: 100%;
						height: 80rpx;
						align-items: center;

						.item-header-left {
							display: flex;

							.header-pic {

								display: flex;
								align-items: center;

								.img {
									width: 48rpx;
									height: 48rpx;
									border-radius: 24rpx;
								}

								.name {
									font-size: 24rpx;
									color: #212528;
									padding-left: 12rpx;
								}

								.tip {
									font-size: 20rpx;
									color: #35CA95;
									border-radius: 2px;
									background: #E3FAF2;
									padding: 4rpx;
									margin-left: 16rpx;
								}
							}
						}

						.item-header-right {
							display: flex;
							align-items: center;

							.follow {
								margin-right: 24rpx;
								width: 100rpx;
								height: 44rpx;
								display: flex;
								align-items: center;
								justify-content: center;
								border-radius: 24rpx;
								box-sizing: border-box;
								border: 1rpx solid #35CA95;
								color: #35CA95;
								font-size: 24rpx;
							}

							.isFollow {
								color: #808080;
								border: 1rpx solid #808080;
							}
						}
					}

					.item-content {
						font-size: 26rpx;
						color: rgba(0, 0, 0, 0.85);
					}

					.item-btn {
						display: flex;
						justify-items: center;
						justify-content: space-between;
						font-size: 22rpx;
						color: rgba(0, 0, 0, 0.3);
						margin-top: 20rpx;

						.img {
							width: 36rpx;
							height: 36rpx;
							vertical-align: bottom;
						}
					}

				}
			}

		}
	}
</style>