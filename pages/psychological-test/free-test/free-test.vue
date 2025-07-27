<template>
	<view class="free-test-box">
		<scroll-view scroll-y="true" class="scroll-content" :show-scrollbar="false">
			<uni-nav-bar :backgroundColor="'#f4f6f8'" :border="false" title="心理测试" class="header-bar" :statusBar="true"
				fixed>
				<template v-slot:left>
					<uni-icons type="left" size="24" @click="backFn"></uni-icons>
				</template>
				<template v-slot:right>
					<view class="right">
						<image src="/static/confide/share.png" class="img" style="width: 40rpx;height: 40rpx;"></image>
					</view>
				</template>
			</uni-nav-bar>
			<view class="free-test-content-box">
				<view class="content-box">
					<view class="content-banner">
						<image src="/static/forum/bg.png" class="img"></image>
					</view>
					<view class="free-test-options">
						<view class="option-item">
							<text class="weight">23.4W</text>人已测
						</view>
						<view class="option-item">
							<text class="weight">49道</text>精选问题
						</view>
						<view class="option-item">
							<text class="weight">16页</text>专业报告
						</view>
					</view>
					<view class="content-info">
						很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人
						很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人
						很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人
						很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人
						很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人很多人在谈恋爱,但病是不是说每个人
					</view>
					<view class="start-test" @click="startTestHandler">开始测试</view>
				</view>


				<view class="recommend-content-box">
					<view class="recommend-content">
						<view class="recommend-content-header">
							<view class="title">
								相关推荐
							</view>
							<view class="label">更多<uni-icons type="right" size="12"></uni-icons>
							</view>
						</view>
						<view class="content-list">
							<view class="content-item" v-for="i in 2" :key="i">
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
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	
	const startTestHandler=()=>{
		uni.navigateTo({
			url:'/pages/psychological-test/start-test/start-test'
		})
	}
</script>

<style lang="scss" scoped>
	.free-test-box {
		height: 100vh;
		width: 750rpx;
		background: #f4f6f8;

		.scroll-content {
			height: 100vh;

			.free-test-content-box {
				width: 750rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				background-color: #fff;

				.content-box {
					width: 686rpx;
					padding-top: 40rpx;
					padding-bottom: 60rpx;

					.content-banner {
						.img {
							width: 686rpx;
							height: 280rpx;
							border-radius: 16rpx;
						}
					}

					.free-test-options {
						display: flex;
						justify-content: space-between;
						font-size: 26rpx;
						color: rgba(0, 0, 0, 0.5);
						height: 80rpx;
						align-items: center;
						border-radius: 16rpx;
						width: 686rpx;

						.option-item {
							position: relative;
							display: flex;
							justify-content: center;
							flex: 1;

							&:not(:last-child) {
								&::after {
									width: 2rpx;
									height: 30rpx;
									content: '';
									background-color: rgba(0, 0, 0, 0.3);
									position: absolute;
									top: 5rpx;
									right: 0rpx;
								}
							}
						}

						.weight {
							color: rgba(0, 0, 0, 0.85)
						}
					}

					.content-info {
						font-size: 26rpx;
						font-weight: normal;
						line-height: 48rpx;
						color: rgba(0, 0, 0, 0.65);
						margin-top: 40rpx;
					}

					.start-test {
						height: 92rpx;
						width: 686rpx;
						line-height: 92rpx;
						text-align: center;
						line-height: 92rpx;
						border-radius: 80rpx;
						background: #35CA95;
						color: #fff;
						margin-top: 140rpx;
					}
				}



				.recommend-content-box {
					background: #f4f6f8;
					width: 750rpx;
					display: flex;
					justify-content: center;
					padding-top: 48rpx;
					padding-bottom: 60rpx;

					.recommend-content {
						width: 686rpx;

						.recommend-content-header {
							display: flex;
							justify-content: space-between;
							align-items: center;

							.title {
								font-size: 36rpx;
								font-weight: 500;
								letter-spacing: normal;
								color: rgba(0, 0, 0, 0.85);
							}

							.label {
								font-size: 24rpx;
								font-weight: normal;
								letter-spacing: normal;
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
			}
		}
	}
</style>