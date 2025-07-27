<template>
	<view class="write-mailbox-box">
		<uni-nav-bar :backgroundColor="'#F4F6F8'" :border="false" title="评论" class="header-bar" :statusBar="true" fixed>
			<template v-slot:left>
				<uni-icons type="left" size="24" @click="backFn"></uni-icons>
			</template>
		</uni-nav-bar>

		<view class="question-content-box">
			<view class="question-content">
				<view class="content">
					<textarea class="uni-textarea" placeholder="写下您的真实评价有机会获得红包哦~(1000字以内)"
						placeholder-class="placeholder-content" maxlength="1000" v-model="content" />
					<view class="char-count">{{content.length}}/1000</view>
				</view>
			</view>
			<view class="upload-image">
				<view class="upload-image-content">
					<text class="txt">满意度打分</text>
					<view><uni-rate :value="4" activeColor="#38CC98" size=16 /></view>
				</view>
			</view>
		</view>
		<view class="send-content-box">
			<view class="send-content-btn">发布</view>
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
	const content = ref("");
</script>

<style lang="scss" scoped>
	.write-mailbox-box {
		background: #f4f6f8;
		height: 100vh;

		.right {
			border-radius: 16px;
			background: #34A755;
			width: 100rpx;
			height: 48rpx;
			font-size: 28rpx;
			color: #fff;
			line-height: 48rpx;
			text-align: center;
		}

		.question-content-box {
			background: #fff;
			padding: 10rpx 0rpx 48rpx 0rpx;

			.question-content {
				padding: 0rpx 32rpx;
			}

			.content {
				margin-top: 32rpx;
				position: relative;

				.uni-textarea {
					width: 100%;
					padding-bottom: 40rpx;
					height: 560rpx;
				}

				.placeholder-content {
					font-size: 28rpx;
					white-space: pre-wrap;
					color: rgba(0, 0, 0, 0.3);
				}

				.char-count {
					position: absolute;
					right: 0rpx;
					bottom: 0rpx;
					font-size: 24rpx;
					color: rgba(0, 0, 0, 0.5);
				}
			}

			.upload-image {
				.upload-image-content {
					display: flex;
					padding: 0rpx 38rpx;
					font-size: 26rpx;
					color: rgba(0, 0, 0, 0.65);
					align-items: center;

					.txt {
						margin-right: 36rpx;
					}
				}
			}

		}

		.send-content-box {
			width: 750rpx;
			height: 148rpx;
			display: flex;
			justify-content: center;
			position: fixed;
			bottom: 0rpx;
			background: #fff;
			.send-content-btn{
				margin-top: 20rpx;
				text-align: center;
				width: 686rpx;
				height: 88rpx;
				line-height: 88rpx;
				color: #fff;
				background-color: #38CC98;
				border-radius: 44rpx;
			}
		}


	}
</style>