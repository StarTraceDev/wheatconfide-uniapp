<template>
	<view class="charge-test-box">
		<scroll-view scroll-y="true" class="scroll-content" :show-scrollbar="false">
			<uni-nav-bar :backgroundColor="'#9DDDC7'" :border="false" title="" class="header-bar" :statusBar="true"
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
			<view class="charge-test-content-box">
				<view class="content-box">
					<!-- :style="{backgroundImage:'url('+examDetail.icon==null?'/static/forum/bg.png':examDetail.icon+')'}" -->
					<view class="content-banner">
						<image :src="examDetail.icon==null?'/static/forum/bg.png':examDetail.icon" mode="aspectFill"
							class="img"></image>
						<view class="banner-text">
							<text style="color: white;font-size: 42rpx;">{{examDetail.title}}</text>
							<text style="color: white;font-size: 28rpx;">{{examDetail.oneWord}}</text>
						</view>
					</view>
					<view class="charge-test-options">
						<view class="option-item">
							<text class="weight">{{examDetail.examNum}}</text>人已测
						</view>
						<view class="option-item">
							<text class="weight">{{examDetail.examOptionNum}}道</text>精选问题
						</view>
						<view class="option-item">
							<text class="weight">16页</text>专业报告
						</view>
					</view>
					<view class="content-info">
						{{examDetail.description}}
					</view>
				</view>
				<view class="test-notice">
					<view class="test-notice-content">
						<view class="title">评测须知</view>
						<view class="info">
							<rich-text :nodes="rule"></rich-text>
						</view>
					</view>
				</view>

				<view class="recommend-content-box">
					<view class="recommend-content">
						<view class="recommend-content-header">
							<view class="title">
								相关推荐
							</view>
							<view class="label" @click="gotoChargeList">更多<uni-icons type="right" size="12"></uni-icons>
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

				<view class="user-comment-content-box">
					<view class="user-comment-content">
						<view class="user-comment-content-header">
							<view class="title">
								用户评价
							</view>
						</view>

						<view class="comment-content-list">
							<view class="comment-list-header">
								<view class="left">
									<view class="star">
										<text>4.9</text><uni-rate :readonly="true" :value="4" size="12" />
									</view>
									<view class="txt">评分</view>
								</view>
								<view class="right">
									<view class="comment-num">
										<view class="num">2000+</view>
										<view class="txt">真实评价</view>
									</view>
									<view class="percent">
										<view class="num">99%</view>
										<view class="txt">满意度</view>
									</view>
								</view>
							</view>
							<view class="comment-content-item" v-for="i in 10" :key="i">
								<view class="content-item-header">
									<view class="left">
										<view>
											<image src="/static/my/profile.png" class="img"></image>
										</view>
										<view>匿名</view>
									</view>
									<view class="right">2024-04-03</view>
								</view>
								<view class="content">
									评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论
								</view>

							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="footer">
			<view class="price-box">
				<view class="price" v-if="examDetail.payType==1">
					<text class="use-price">¥{{examDetail.discountPrice}}</text>
					<text class="under-price">¥{{examDetail.price}}</text>
				</view>
				<view class="price" v-else>免费</view>
				<view class="txt">开通会员享受免费测试</view>
			</view>
			<view class="member">会员免费</view>
			<view class="start-test" @click="startTestHandler">立即测试</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'

	import {
		getExamDetail,
		getExamRule
	} from '@/common/api/exam.js'
	const id = ref(0)

	const rule = ref('')
	const examDetail = ref({})
	onLoad((e) => {
		id.value = e.id
		console.log(id.value);
		getDetail()
		getRule()
	})
	
	const gotoChargeList = ()=>{
		uni.navigateTo({
			url:"/pages/psychological-test/test-type/test-type"
		})
	}

	const getRule = async () => {
		let resp = await getExamRule();
		rule.value = resp.data
	}

	const getDetail = async () => {
		let resp = await getExamDetail({
			id: id.value
		})
		console.log(resp);
		examDetail.value = resp.data
	}

	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const startTestHandler = () => {
		if (examDetail.value.payType == 0) {
			uni.navigateTo({
				url: '/pages/psychological-test/start-test/start-test?title='+examDetail.value.title+"&id="+examDetail.value.id
			})
		}else{
			//支付
			
		}
	}
</script>

<style lang="scss" scoped>
	.charge-test-box {
		height: 100vh;
		width: 750rpx;
		background: #f4f6f8;
		background: linear-gradient(180deg, #9DDDC7 0%, #FFFFFF 63%);

		.scroll-content {
			height: 100vh;

			.charge-test-content-box {

				width: 750rpx;
				display: flex;
				flex-direction: column;
				align-items: center;

				.content-box {
					width: 686rpx;

					.content-banner {
						position: relative;
						width: 686rpx;
						height: 280rpx;
						display: flex;
						justify-content: center;
						/* 水平居中 */
						align-items: center;

						// margin-left: 30rpx;
						// margin-right: 30rpx;
						// height: 300rpx;
						// background-size: 100% 100%;
						// background-repeat: no-repeat;
						.img {
							width: 100%;
							height: 100%;
							border-radius: 16rpx;
							position: absolute;
							top: 0;
						}

						.banner-text {
							text-align: center;
							margin-top: 30rpx;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: center;
							position: relative;
						}
					}

					.charge-test-options {
						display: flex;
						justify-content: space-between;
						font-size: 26rpx;
						color: rgba(0, 0, 0, 0.5);
						height: 80rpx;
						align-items: center;
						margin-top: 30rpx;
						border-radius: 16rpx;
						background: rgba(255, 255, 255, 0.85);
						box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(0, 0, 0, 0.06);
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
				}

				.test-notice,
				.recommend-content-box,
				.user-comment-content-box {
					background: #f4f6f8;
					width: 750rpx;
					display: flex;
					justify-content: center;
					padding-top: 128rpx;

					.test-notice-content {
						width: 686rpx;

						.title {
							font-size: 36rpx;
							font-weight: 500;
							line-height: 36rpx;
							color: rgba(0, 0, 0, 0.85);
						}

						.info {
							font-size: 26rpx;
							line-height: 48rpx;
							font-weight: 400;
							color: rgba(0, 0, 0, 0.65);
							margin-top: 24rpx;
						}
					}
				}

				.recommend-content-box {
					padding-top: 60rpx;

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

				.user-comment-content-box {
					padding-top: 48rpx;
					padding-bottom: 128rpx;

					.user-comment-content {
						width: 686rpx;

						.user-comment-content-header {
							.title {
								font-size: 36rpx;
								font-weight: 500;
								line-height: 36rpx;
								color: rgba(0, 0, 0, 0.85);
							}
						}

						.comment-content-list {
							background-color: #fff;
							border-radius: 20rpx;
							margin-top: 28rpx;

							.comment-list-header {
								display: flex;
								justify-content: space-between;
								padding: 50rpx 30rpx;

								.left {
									.star {
										display: flex;
										align-items: center;
										font-size: 40rpx;
										font-weight: 500;
										letter-spacing: normal;
										color: #FFC300;

										text {
											padding-right: 10rpx;
										}
									}

									.txt {
										font-size: 24rpx;
										font-weight: normal;
										line-height: normal;
										color: rgba(0, 0, 0, 0.5);
									}
								}

								.right {
									width: 280rpx;
									display: flex;
									justify-content: space-between;

									.comment-num,
									.percent {
										.num {
											font-size: 32rpx;
											font-weight: 600;
											letter-spacing: normal;
											color: rgba(0, 0, 0, 0.85);
										}

										.txt {
											font-size: 24rpx;
											letter-spacing: normal;
											color: rgba(0, 0, 0, 0.5);
										}
									}
								}
							}

							.comment-content-item {
								padding: 30rpx;

								.content-item-header {
									display: flex;
									justify-content: space-between;
									align-items: center;

									.left {
										display: flex;
										align-items: center;
										font-size: 24rpx;
										font-weight: normal;
										letter-spacing: normal;
										color: rgba(0, 0, 0, 0.65);

										.img {
											width: 48rpx;
											height: 48rpx;
											margin-right: 10rpx;
										}
									}

									.right {
										font-size: 22rpx;
										letter-spacing: normal;
										color: rgba(0, 0, 0, 0.35);
									}
								}

								.content {
									font-size: 26rpx;
									font-weight: normal;
									text-align: justify;
									/* 浏览器可能不支持 */
									letter-spacing: normal;
									color: rgba(0, 0, 0, 0.65);
									padding-left: 55rpx;
								}

								&:not(:last-child) {
									border-bottom: 2rpx solid rgba(0, 0, 0, 0.04);
								}
							}
						}
					}
				}

			}
		}

		.footer {
			width: 750rpx;
			height: 108rpx;
			background: #fff;
			position: fixed;
			bottom: 0rpx;
			display: flex;
			align-items: center;

			.member,
			.start-test {
				width: 230rpx;
				height: 108rpx;
				color: #fff;
				background: #FF8F1F;
				font-size: 32rpx;
				line-height: 108rpx;
				text-align: center;
			}

			.start-test {
				background: #35CA95;
			}

			.price-box {
				width: 290rpx;
				height: 108rpx;
				padding-left: 30rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;

				.txt {
					font-size: 20rpx;
					font-weight: normal;
					line-height: normal;
					letter-spacing: normal;
					color: rgba(0, 0, 0, 0.6);
				}

				.price {
					.use-price {
						font-size: 36rpx;
						font-weight: 500;
						letter-spacing: normal;
						color: #FA5151;
					}

					.under-price {
						font-size: 24rpx;
						font-weight: normal;
						text-decoration: line-through;
						color: #D9D9D9;
						padding-left: 20rpx;
					}
				}

			}
		}
	}
</style>