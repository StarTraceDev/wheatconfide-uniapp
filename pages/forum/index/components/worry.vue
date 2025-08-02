<template>
	<view class="forum-index-content">
		<view class="tabs">
			<view @click="contentTabsHandler(item)" class="tab-item" v-for="(item,index) in contentTabsList"
				:key="index" :class="contentTabsActive==item.id?'active':''">{{item.label}}</view>
		</view>

		<view class="forum-index-list">
			<scroll-view scroll-y="true" class="scroll-content" :show-scrollbar="false">
				<view class="forum-index-list-item" v-for="(item,index) in data.list" :key="index">
					<view class="item-header">
						<view class="item-header-left" @click="openOtherHandler">
							<view class="header-pic">
								<image src="/static/my/profile.png" class="img"></image>
							</view>
							<view class="header-info">
								<view class="name">张三</view>
								<view class="time">52分钟前</view>
							</view>
						</view>
						<view class="item-header-right">
							<view v-if="contentTabsActive!=2">
								<view class="follow" v-if="item.isFollow==0"><uni-icons type="plusempty" size="12"
										color="#35CA95"></uni-icons>关注</view>
								<view class="follow isFollow" v-else>已关注</view>
							</view>
							<view><uni-icons type="more-filled" size="18" color="#808080"></uni-icons></view>
						</view>
					</view>
					<view class="item-content">
						<mote-lines-divide :line="5" expandText="展开" foldHint="收起">
							{{item.content}}
						</mote-lines-divide>
					</view>
					<view class="item-btn">
						<view v-if="item.isZan==0">
							<image src="/static/common/zan.png" class="img"></image>点赞
						</view>
						<view v-else>
							<image src="/static/common/zan-active.png" class="img"></image>{{item.zanNum}}
						</view>
						<view>
							<image src="/static/common/msg.png" class="img"></image>评论
						</view>
						<view>
							<image src="/static/common/share.png" class="img" @click="openShare"></image>分享
						</view>
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
		getWorryList
	} from "@/common/api/worry.js"
	import share from '@/components/share/share.vue'
	import MoteLinesDivide from "@/components/mote-lines-divide/mote-lines-divide"
	const props = defineProps(['statusBarHeight']);
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
	const contentTabsList = ref([{
		id: 0,
		label: "最新"
	}, {
		id: 1,
		label: "推荐"
	}, {
		id: 2,
		label: "关注"
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
	}, {
		content: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
		isZan: 1,
		zanNum: 536,
		isFollow: 1
	}, {
		content: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
		isZan: 0,
		zanNum: 536,
		isFollow: 1
	}, {
		content: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
		isZan: 0,
		zanNum: 536,
		isFollow: 1
	}, {
		content: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
		isZan: 0,
		zanNum: 536,
		isFollow: 0
	}, {
		content: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
		isZan: 0,
		zanNum: 536,
		isFollow: 0
	}, {
		content: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
		isZan: 0,
		zanNum: 536,
		isFollow: 0
	}, {
		content: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
		isZan: 0,
		zanNum: 536,
		isFollow: 0
	}, {
		content: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
		isZan: 0,
		zanNum: 536,
		isFollow: 0
	}, {
		content: "测试测试测试测试测试测试测试测试测试测试测试测试测试测试试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
		isZan: 0,
		zanNum: 536,
		isFollow: 0
	}]);

	const openShare = () => {
		sharePopup.value.openShare()
	}
	
	const openOtherHandler=()=>{
		uni.navigateTo({
			url:'/pages/forum/other/other'
		})
	}
	
	const getList = async () => {
		let res = await getWorryList(data.listParams);
		data.list=res.data.records
	}
	
	onMounted(()=>{
		getList()
	})
</script>

<style lang="scss" scoped>
	.forum-index-content {
		height: 100%;

		.tabs {
			display: flex;
			font-size: 32rpx;
			color: rgba(0, 0, 0, 0.65);
			margin-top: 48rpx;
			padding-left: 36rpx;
			width: 272rpx;
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

			margin-top: 44rpx;
			padding: 0rpx 32rpx;
			height: calc(100% - 98rpx);

			.scroll-content {
				height: 100%;

				.forum-index-list-item {
					border-radius: 20rpx;
					/* 自动布局 */
					background: #FFFFFF;
					padding: 32rpx;
					margin-bottom: 20rpx;

					.item-header {
						display: flex;
						justify-content: space-between;
						width: 100%;
						height: 80rpx;
						align-items: center;

						.item-header-left {
							display: flex;

							.header-pic {
								.img {
									width: 72rpx;
									height: 72rpx;
								}
							}

							.header-info {
								margin-left: 32rpx;

								.name {
									font-size: 30rpx;
									color: #212528;
								}

								.time {
									color: rgba(0, 0, 0, 0.35);
									font-size: 24rpx;
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
						margin-top: 20rpx;
					}

					.item-btn {
						display: flex;
						justify-items: center;
						justify-content: space-between;
						font-size: 22rpx;
						color: rgba(0, 0, 0, 0.3);
						margin-top: 32rpx;

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