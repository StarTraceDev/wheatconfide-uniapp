<template>
	<view class="write-mailbox-box">
		<uni-nav-bar :backgroundColor="'#F4F6F8'" :border="false" title="写给从前的一封信" class="header-bar" :statusBar="true"
			fixed>
			<template v-slot:left>
				<uni-icons type="left" size="24" @click="backFn"></uni-icons>
			</template>
			<template v-slot:right>
				<view class="right">
					发布
				</view>
			</template>
		</uni-nav-bar>
		<view class="question-content">
			<view class="content">
				<textarea class="uni-textarea" placeholder="给从前的自己写一份信" placeholder-class="placeholder-content"
					maxlength="1000" v-model="content" />
					<view class="char-count">{{content.length}}/1000</view>
			</view>
		</view>
		<view class="upload-image">
			<view class="upload-image-content">
				<view class="uploadImageLogo">
					<image src="/static/forum/upload-image.svg" class="image" @click="uploadImageHandler"></image>
				</view>
				<view class="upload-image-item" v-for="(item,index) in imageArr" :key="index">
					<image :src="item" class="image"></image>
					<view class="del-img" @click="delImageHandler(index)">
						<uni-icons type="closeempty" size="12" color="#fff"></uni-icons>
					</view>
				</view>
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
	const content = ref("");
	const imageArr = ref([]);
	const uploadImageHandler = () => {
		uni.chooseImage({
			count: 1,
			success: function(res) {
				imageArr.value.push(res.tempFilePaths[0]);
			}
		})
	}
	
	const delImageHandler=(index)=>{
		imageArr.value.splice(index,1)
	}
	
</script>

<style lang="scss" scoped>
	.write-mailbox-box {
		background: #fff;
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
				flex-wrap: wrap;

				.image {
					width: 160rpx;
					height: 160rpx;
					border-radius: 6px;
					margin-right: 20rpx;
				}

				.upload-image-item {
					position: relative;

					.del-img {
						position: absolute;
						top: 10rpx;
						right: 20rpx;
						width: 32rpx;
						height: 32rpx;
						background: rgba(0, 0, 0, 0.3);
						border-radius: 32rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}
			}
		}

		.question-tag {
			border-radius: 40rpx;
			background: #F7F7F7;
			display: inline-block;
			padding: 8rpx 20rpx;
			margin-left: 38rpx;
			margin-top: 34rpx;

			.tag-content {
				display: flex;
				align-items: center;

				.img {
					width: 28rpx;
					height: 28rpx;
				}

				.txt {
					font-size: 24rpx;
					color: rgba(0, 0, 0, 0.85);
				}

			}
		}

		
	}
</style>