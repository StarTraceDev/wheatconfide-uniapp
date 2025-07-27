<template>
	<view class="evaluate-box">
		<scroll-view scroll-y class="scroll-content" @scroll="onPageScroll" :show-scrollbar="false">
			<view class="evaluate-content">
				<uni-nav-bar :backgroundColor="scrollTop>15?'#fff':'transparent'" :border="false" title="张三咨询师"
					class="header-bar" :statusBar="true" fixed>
					<template v-slot:left>
						<uni-icons type="left" size="24" @click="backFn"></uni-icons>
					</template>
					<template v-slot:right>
						<view class="right">
							<image src="@/static/confide/share.png" style="width: 40rpx;height: 40rpx;"></image>
						</view>
					</template>
				</uni-nav-bar>
				<view class="evaluate-info-box">
					<view class="evaluate-list-box">
						<view class="info">
							<view class="feel-type-box">
								<view class="first">
									<view class="percent">99<text class="txt">%好评率</text></view>
								</view>
								<view class="second">
									<view class="second-item">
										<text class="txt-1">真实评价</text>
										<text class="txt-2">788条</text>
									</view>
									<view class="second-item">
										<text class="txt-1">用户推荐</text>
										<text class="txt-2">100%</text>
									</view>
								</view>
							</view>
						
							<view class="comment-list">
								<view class="comment-item" v-for="i in 10" :key="10">
									<view class="user-box">
										<view class="user-info">
											<image src="/static/my/profile.png" class="img"></image>
											<text class="txt">匿名</text>
										</view>
										<view class="star"><uni-rate :disabled="true" disabledColor="#FFC300"
												:value="5" size="12" /></view>
									</view>
									<view class="comment-content">
										评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容
									</view>
									<view class="tags">
										<text class="tag-item">亲切温暖</text>
										<text class="tag-item">亲切温暖</text>
										<text class="tag-item">亲切温暖</text>
									</view>
									<view class="theme-date">
										<view class="theme">
											咨询主题:<text class="txt">心理压抑</text>
										</view>
										<view class="date">2025-06-04</view>
									</view>
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
	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
	const replyContent = ref("");
	const scrollTop = ref(0);

	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const onPageScroll = (e) => {
		scrollTop.value = e.detail.scrollTop;
	}
</script>

<style lang="scss" scoped>
	.evaluate-box {
		$statusBarHeight: v-bind(statusBarHeight);
		width: 100vw;
		min-height: 100vh;
		height: auto;
		background-color: #F4F6F8;

		.scroll-content {
			height: 100vh;

			.evaluate-content {
				background:  linear-gradient(180deg, #FCEED4 2%, #F4F6F8 100%);
				height: 480rpx;
				width: 100vw;

				.header {
					.header-bar {
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

				.evaluate-info-box {
					width: 750rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					padding-bottom: 40rpx;
					margin-top: 30rpx;

					.evaluate-info {
						width: 686rpx;
						background: #fff;
						height: 176rpx;
						border-radius: 20rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						.user-info {
							display: flex;
							align-items: center;
							padding-left: 32rpx;

							.picture {
								.img {
									width: 112rpx;
									height: 112rpx;
									border-radius: 112rpx;
								}
							}

							.user {
								margin-left: 20rpx;
								color: rgba(0, 0, 0, 0.85);
								line-height: 1;

								.name {
									font-size: 36rpx;
									font-weight: 500;
								}

								.title {
									font-size: 28rpx;
									margin-top: 20rpx;
								}
							}
						}

						.right {
							padding-right: 32rpx;
						}
					}

					.evaluate-list-box {
						width: 686rpx;
						background-color: #fff;
						border-radius: 20rpx;
						margin-top: 20rpx;
						padding-bottom: 60rpx;

						.info {
							padding: 0 28rpx;
							.feel-type-box {
								width: 630rpx;
								height: 100rpx;
								border-radius: 10rpx;
								/* 自动布局 */
								display: flex;
								background: #FDF9F0;
								align-items: center;
						       margin-top: 32rpx;
								.first {
									width: 272rpx;
									position: relative;
									padding-left: 32rpx;
						
									.percent {
										font-size: 48rpx;
										font-weight: bold;
										color: #B17940;
									}
						
									.txt {
										font-size: 24rpx;
										color: #B17940;
										font-weight: 400;
									}
								}
						
								.first::after {
									content: '';
									position: absolute;
									width: 2rpx;
									height: 54rpx;
									background: rgba(0, 0, 0, 0.04);
									right: 0;
									top: 0;
								}
						
								.second {
									display: flex;
						
									.second-item {
										display: flex;
										flex-direction: column;
						
										.txt-1 {
											font-size: 22rpx;
											color: rgba(0, 0, 0, 0.3);
										}
						
										.txt-2 {
											font-size: 26rpx;
											color: rgba(0, 0, 0, 0.85);
										}
									}
						
									.second-item:first-child {
										margin-left: 68rpx;
										margin-right: 48rpx;
									}
								}
							}
						
							.comment-list {
								margin-top: 32rpx;
						
								.comment-item:not(:last-child) {
									border-bottom: 1px solid rgba(0, 0, 0, 0.04);
								}
						
								.comment-item {
									padding-bottom: 32rpx;
									margin-top: 32rpx;
									.user-box {
										display: flex;
										justify-content: space-between;
						
										.user-info {
											display: flex;
											align-items: center;
						
											.img {
												width: 48rpx;
												height: 48rpx;
											}
						
											.txt {
												font-size: 24rpx;
												color: rgba(0, 0, 0, 0.65);
												padding-left: 14rpx;
											}
										}
									}
						
									.comment-content {
										font-size: 26rpx;
										line-height: 40rpx;
										color: rgba(0, 0, 0, 0.65);
										margin-top: 22rpx;
									}
						
									.tags {
										margin-top: 12rpx;
						
										.tag-item {
											padding: 6rpx 8rpx;
											border: 0.8rpx solid rgba(0, 0, 0, 0.2);
											margin-right: 8rpx;
											background: #FFFFFF;
											box-sizing: border-box;
											border-radius: 4rpx;
											font-size: 20rpx;
											color: rgba(0, 0, 0, 0.5);
										}
									}
						
									.theme-date {
										margin-top: 36rpx;
										display: flex;
										justify-content: space-between;
						
										.theme {
											color: rgba(0, 0, 0, 0.5);
											font-size: 24rpx;
						
											.txt {
												color: rgba(0, 0, 0, 0.65);
											}
										}
						
										.date {
											color: rgba(0, 0, 0, 0.35);
											font-size: 24rpx;
										}
									}
						
								}
							}
						}

					}
				}
			}
		}
	}
</style>