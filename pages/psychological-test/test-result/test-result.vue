<template>
	<view class="test-result-box">
		<uni-nav-bar :backgroundColor="'#F4F6F8'" :border="false" title="测试结果" class="header-bar" :statusBar="true"
			fixed>
			<template v-slot:left>
				<uni-icons type="left" size="24" @click="backFn"></uni-icons>
			</template>
		</uni-nav-bar>
		<view class="test-result-content-box">
			<view class="test-result-content">
				<view class="content">
					<view class="banner">
						<image src="/static/forum/bg.png" class="img"></image>
					</view>
					<view class="result-analysis-box">
						<view class="tip">结果分析</view>
						<view class="title">潜意识投射测试</view>
						<view class="result">
							很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人
							很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人
							很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人
						</view>
					</view>
				</view>
			</view>
		</view>


		<view class="footer-box">
			<view class="footer-content">
				<view @click="openHandler('/pages/psychological-test/comment/comment')">
					<image src="/static/psychological-test/comment.svg"></image>
					<text>去评价</text>
				</view>
				<view @click="shareHandler">
					<image src="/static/psychological-test/save-share.svg"></image>
					<text>保存分享</text>
				</view>
				<view @click="openHandler('/pages/psychological-test/contact-consult/contact-consult')">
					<image src="/static/psychological-test/send-consult.svg"></image>
					<text>发送咨询师
					</text>
				</view>
				<view class="new-consult-btn">新人0元倾诉</view>
			</view>
		</view>


		<uni-popup ref="share" background-color="#fff" :is-mask-click="false" borderRadius="24rpx 24rpx 0rpx 0rpx"
			type="bottom">
			<view class="share-popup-box">
				<view class="share-content">
					<view class="title">分享到</view>
					<view class="share-list">
						<view class="share-item" v-for="(item,index) in channelList" :key="index" @click="item.fn">
							<view class="share-item-img" :style="{backgroundColor:item.backgroundColor}">
								<image :src="item.img" class="img" :style="{width:item.imgWidth,height:item.imgHeight}"
									mode="widthFix">
								</image>
							</view>
							<view class="txt">{{item.text}}</view>
						</view>
					</view>
					<view class="cancel" @click="closeShare">
						取消
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue'
	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const openHandler = (url) => {
		uni.navigateTo({
			url
		})
	}
	const share = ref(null);
	const shareHandler = () => {
		share.value.open();
	}


	const channelList = ref([{
		type: "wechat",
		img: "/static/share/wechat.svg",
		backgroundColor: "#00B578",
		text: "微信",
		imgWidth: '57rpx',
		imgHeight: '57rpx',
		fn: () => new Function()
	}, {
		type: "friend",
		img: "/static/share/friend.svg",
		backgroundColor: "#41B7FF",
		text: "朋友圈",
		imgWidth: '57rpx',
		imgHeight: '57rpx',
		fn: () => new Function()
	}]);
	
	const closeShare = () => {
		share.value.close();
	}
</script>

<style lang="scss" scoped>
	.test-result-box {
		height: 100vh;
		background: #f4f6f8;
		width: 750rpx;

		.test-result-content-box {
			background: #f4f6f8;
			width: 750rpx;
			padding-bottom: 180rpx;

			.test-result-content {
				padding-top: 40rpx;
				width: 750rpx;
				background: #fff;
				display: flex;
				flex-direction: column;
				align-items: center;


				.content {
					width: 686rpx;
					padding-bottom: 60rpx;

					.banner {
						.img {
							width: 686rpx;
							height: 280rpx;
						}
					}

					.result-analysis-box {
						.tip {
							font-size: 32rpx;
							font-weight: 500;
							color: rgba(0, 0, 0, 0.6);
							position: relative;
							display: flex;
							align-items: center;
							margin-left: 20rpx;
							margin-top: 32rpx;

							&:before {
								content: '';
								width: 6rpx;
								height: 30rpx;
								position: absolute;
								background: #38CC98;
								left: -20rpx;
							}
						}

						.title {
							font-size: 40rpx;
							font-weight: 500;
							color: rgba(0, 0, 0, 0.85);
							margin-top: 24rpx;
						}

						.result {
							font-size: 26rpx;
							font-weight: normal;
							line-height: 48rpx;
							color: rgba(0, 0, 0, 0.65);
							margin-top: 32rpx;
						}
					}
				}

			}
		}


		.footer-box {
			width: 750rpx;
			background: #fff;
			height: 108rpx;
			display: flex;
			justify-content: center;
			position: fixed;
			bottom: 0rpx;
			align-items: center;

			.footer-content {
				width: 686rpx;
				display: flex;
				justify-content: space-between;

				view {
					display: flex;
					flex-direction: column;
					align-items: center;
					font-size: 22rpx;
					color: rgba(0, 0, 0, 0.65);

					image {
						width: 40rpx;
						height: 40rpx;
					}
				}

				.new-consult-btn {
					width: 300rpx;
					height: 88rpx;
					line-height: 88rpx;
					text-align: center;
					color: #fff;
					font-size: 32rpx;
					background: #35CA95;
					border-radius: 44rpx;
				}


			}
		}

		.share-popup-box {
			width: 750rpx;
			height: 420rpx;
			background: #fff;
			border-radius: 24rpx 24rpx 0rpx 0rpx;

			.share-content {
				padding: 36rpx;

				.title {
					font-size: 32rpx;
					color: #000;
				}
			}

			.share-list {
				display: flex;
				justify-content: center;

				.share-item {
					width: 50%;
					flex-shrink: 0;
					margin-top: 32rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.share-item-img {
						width: 108rpx;
						height: 108rpx;
						border-radius: 108rpx;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					.txt {
						color: rgba(0, 0, 0, 0.6);
						font-size: 24rpx;
						margin-top: 10rpx;
					}
				}

			}

			.cancel {
				font-size: 28rpx;
				color: rgba(0, 0, 0, 0.85);
				display: flex;
				justify-content: center;
				align-items: center;
				position: fixed;
				bottom: 0rpx;
				left: 32rpx;
				width: 686rpx;
				border-top: 2rpx solid rgba(0, 0, 0, 0.04);
				height: 92rpx;
			}
		}
	}
</style>