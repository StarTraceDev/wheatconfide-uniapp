<template>
	<view class="start-test-box">
		<uni-nav-bar :backgroundColor="'#F4F6F8'" :border="false" title="潜意识投射测试" class="header-bar" :statusBar="true"
			fixed>
			<template v-slot:left>
				<uni-icons type="left" size="24" @click="backFn"></uni-icons>
			</template>
			<template v-slot:right>
				<view class="right">
					<image src="/static/confide/share.png" class="img"></image>
				</view>
			</template>
		</uni-nav-bar>

		<view class="content-box">
			<view class="process-box">
				<view class="process-content">
					<view class="process-txt">评测进度</view>
					<view class="process-percent">
						<view class="use-process" :style="{'width':width+'rpx'}"></view>
					</view>
					<view class="process-num"><text class="use-num">1</text>/13</view>
				</view>
			</view>

			<view class="question-box">
				<view class="q-logo">
					<image src="/static/psychological-test/q-logo.svg" class="img"></image>
				</view>
				<view class="q-content">
					<view class="content">
						您从上床到睡着所消耗的时间 是多少
					</view>
				</view>
			</view>
			<view class="answer-box">
				<view class="answer-content">
					<view class="answer-list">
						<view class="answer-item" v-for="i in 4" :key="i" @click="answerHandler"
							:class="answerActive==i?'active':''">
							<view class="dot"></view>
							<view class="txt">入睡时间从来没有超过30分钟</view>
						</view>
					</view>
				</view>
			</view>

			<view class="pre-btn-box">
				<view class="pre">上一题</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';

	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const width = ref(0);

	const countProcessHandler = () => {
		width.value = (436 / 13 * 2);
	};

	onMounted(() => {
		countProcessHandler();
	})
	const answerActive = ref(1);
	const answerHandler = (i) => {
		answerActive.value != i ? answerActive.value = i : ''
		uni.navigateTo({
			url:'/pages/psychological-test/test-result/test-result'
		})
	}
	
	
</script>

<style lang="scss" scoped>
	.start-test-box {
		background: #f4f6f8;
		height: 100vh;

		.right {
			.img {
				width: 40rpx;
				height: 40rpx;
			}
		}

		.content-box {
			background: linear-gradient(180deg, #D5F9ED 0%, #F4F6F8 42%);
			width: 750rpx;

			.process-box {
				padding: 0rpx 32rpx;

				.process-content {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-top: 40rpx;

					.process-text {
						font-size: 28rpx;
						color: rgba(0, 0, 0, 0.85);
					}

					.process-percent {
						width: 436rpx;
						height: 16rpx;
						border-radius: 58rpx;
						background: #fff;

						.use-process {
							height: 100%;
							border-radius: 58px;
							background: #38CC98;
						}
					}

					.use-num {
						font-size: 40rpx;
						font-weight: 500;
						color: #38CC98;
						padding-right: 10rpx;
					}
				}
			}

			.question-box {
				display: flex;
				padding: 0rpx 32rpx;
				align-items: center;
				margin-top: 60rpx;

				.q-logo {
					.img {
						width: 100rpx;
						height: 100rpx;
					}
				}

				.q-content {
					width: 480rpx;
					display: flex;
					align-items: center;
					border-radius: 28px;
					background: #FFFFFF;
					margin-left: 12rpx;

					.content {
						padding: 26rpx 30rpx;
					}
				}
			}

			.answer-box {
				padding: 0rpx 32rpx;
				margin-top: 40rpx;

				.answer-content {
					width: 686rpx;
					background-color: #fff;
					border-radius: 28rpx;

					.answer-list {
						padding: 32rpx 40rpx;

						.answer-item {
							border-radius: 20rpx;
							background: #F2F4F5;
							padding: 30rpx 34rpx;
							display: flex;
							align-items: center;

							.dot {
								background: #38CC98;
								width: 14rpx;
								height: 14rpx;
								border-radius: 14rpx;
								margin-right: 20rpx;
								flex-shrink: 0;
							}

							&:not(:first-child) {
								margin-top: 32rpx;
							}
						}

						.active {
							background: #DCFFF3;
						}
					}
				}
			}

			.pre-btn-box {
				width: 750rpx;
				display: flex;
				justify-content: center;
				margin-top: 80rpx;

				.pre {
					width: 430rpx;
					height: 92rpx;
					line-height: 92rpx;
					text-align: center;
					color: #fff;
					font-size: 30rpx;
					background: #35CA95;
					border-radius: 80rpx;
				}
			}
		}
	}
</style>