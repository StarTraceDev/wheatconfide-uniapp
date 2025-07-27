<template>
	<view class="evaluate-box">
		<scroll-view scroll-y class="scroll-content" @scroll="onPageScroll">
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
					<view class="evaluate-info">
						<view class="user-info">
							<view class="picture">
								<image src="/static/my/profile.png" class="img"></image>
							</view>
							<view class="user">
								<view class="name">张三</view>
								<view class="title">精神分析流派</view>
							</view>
						</view>
						<view class="right">
							<uni-icons type="right" size="18" color="#B6B6C1"></uni-icons>
						</view>
					</view>


					<view class="evaluate-list-box">
						<view class="header-title">咨询感受</view>
						<view class="score-content">
							<view class="score">
								<view class="star"><text class="txt">4.9</text><uni-rate allow-half :value="4" readonly
										size="12" />
								</view>
								<view class="txt">推荐指数</view>
							</view>
							<view class="num">
								<view>
									<view class="txt">2000+</view>
									<view class="txt1">真实评价</view>
								</view>
								<view>
									<view class="txt">99%</view>
									<view class="txt1">满意度</view>
								</view>
							</view>
						</view>
						<view class="sort-box" :class="scrollTop>240?'sortBoxActive':''">
							<view class="sort-content">
								<view class="sort">服务类型<image src="/static/common/arrow.png" class="img"
										style="width: 20rpx;height: 20rpx"></image>
								</view>
								<view class="sort">默认排序<image src="/static/common/sort.png" class="img"></image>
								</view>
							</view>
						</view>
						<view class="tags">
							<text class="tag-item" v-for="i in 10">心理健康(100)</text>
						</view>

						<view class="content-list" v-for="i in 10" :key="i">
							<view class="content-header">
								<view class="user-info">
									<view>
										<image src="/static/my/profile.png" class="picture"></image>
									</view>
									<view class="nickName">匿名</view>
									<view class="reason">压抑心理</view>
								</view>
								<view class="date">2025-05-28</view>
							</view>
							<view class="content">
								<mote-lines-divide :line="2" expandText="展开" foldHint="收起">
									测试测试测试测试测试测试测试213121312试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试
								</mote-lines-divide>
							</view>
							<view class="evaluate-item"><text class="item">态度很好</text><text class="item">很专业</text>
							</view>
							<view class="reply">
								<view class="reply-box">
									<text class="reply-user">张三 回复：</text>
									<text class="reply-content">感谢您对平台和我的信任与认可，只要您需要我会一直在</text>
								</view>

							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="contact-teach">向张三咨询师咨询</view>
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
				background: linear-gradient(180deg, #D5FFF0 2%, #F4F6F8 100%);
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

						.header-title {
							height: 112rpx;
							border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
							padding-left: 28rpx;
							line-height: 112rpx;
						}

						.score-content {
							display: flex;
							margin-top: 32rpx;
							height: 120rpx;

							.score {
								width: 50%;
								padding-left: 32rpx;

								.star {
									display: flex;
									align-items: center;

									.txt {
										color: #FFC300;
										font-size: 40rpx;
										font-weight: 500;
										padding-right: 10rpx;
									}
								}

								.txt {
									font-size: 24rpx;
									color: rgba(0, 0, 0, 0.5);
								}
							}

							.num {
								width: 50%;
								display: flex;
								padding-right: 32rpx;
								justify-content: space-around;

								.txt {
									font-size: 32rpx;
									color: rgba(0, 0, 0, 0.85);
									font-weight: 600;
								}

								.txt1 {
									font-size: 24rpx;
									color: rgba(0, 0, 0, 0.5);
								}
							}
						}

						.sort-box {

							font-size: 30rpx;
							color: rgba(33, 37, 40, 0.85);


							.sort-content {
								padding-left: 32rpx;
								display: flex;
								align-items: center;
								height: 88rpx;
							}

							.sort {
								display: flex;
								align-items: center;
								width: 240rpx;

							}

							.img {
								width: 28rpx;
								height: 28rpx;
								padding-left: 8rpx;
							}
						}

						.sortBoxActive {
							width: 100vw;
							position: fixed;
							top: calc($statusBarHeight + 68rpx);
							background: #fff;
							z-index: 1;
							left: 0;
						}

						.tags {
							padding: 0rpx 32rpx;
							display: flex;
							flex-wrap: wrap;
							justify-content: space-between;

							.tag-item {
								padding: 4rpx 8rpx;
								border-radius: 8rpx;
								background: rgba(53, 202, 149, 0.102);
								color: #35CA95;
								font-size: 26rpx;
								flex-shrink: 0;
								margin-top: 20rpx;
							}
						}


						.content-list {
							margin-top: 40rpx;
							padding: 0rpx 32rpx;
							padding-bottom: 30rpx;

							.content-header {
								display: flex;
								justify-content: space-between;
								align-items: center;

								.user-info {
									display: flex;
									align-items: center;

									.picture {
										width: 48rpx;
										height: 48rpx;
									}

									.nickName,
									.reason {
										color: rgba(0, 0, 0, 0.65);
										font-size: 24rpx;
										margin: 0rpx 10rpx;
									}
								}

								.date {
									color: rgba(0, 0, 0, 0.35);
									font-size: 24rpx;
								}
							}

							.content {
								font-size: 26rpx;
								color: rgba(0, 0, 0, 0.85);
								line-height: 40rpx;
								margin-top: 28rpx;
							}

							.evaluate-item {
								font-size: 24rpx;
								color: rgba(0, 0, 0, 0.5);
								margin-top: 24rpx;

								.item {
									margin-right: 20rpx;
								}
							}

							.reply {
								width: 630rpx;
								border-radius: 8rpx;
								/* 自动布局 */
								background: #F4F6F8;
								margin-top: 24rpx;
								font-size: 26rpx;

								.reply-box {
									padding: 20rpx 32rpx;

									.reply-user {
										color: rgba(0, 0, 0, 0.5)
									}

									.reply-content {
										color: rgba(0, 0, 0, 0.85)
									}
								}

							}
						}

						.content-list:not(:last-of-type) {
							border-bottom: 2rpx solid rgba(0, 0, 0, 0.04);
						}

					}
				}
			}
		}

		.contact-teach {
			width: 686rpx;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 40rpx;
			background: #35CA95;
			text-align: center;
			color: #fff;
			font-size: 30rpx;
			text-align: center;
			position: fixed;
			left: 32rpx;
			bottom: 0rpx;
		}
	}
</style>