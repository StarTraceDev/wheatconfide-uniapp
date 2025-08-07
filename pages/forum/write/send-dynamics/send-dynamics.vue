<template>
	<view class="send-dynamics-box">
		<uni-nav-bar :backgroundColor="'#F4F6F8'" :border="false" title="发动态" class="header-bar" :statusBar="true"
			fixed>
			<template v-slot:left>
				<uni-icons type="left" size="24" @click="backFn"></uni-icons>
			</template>
			<template v-slot:right>
				<view class="right" @click="onSaveArticle">
					发布
				</view>
			</template>
		</uni-nav-bar>
		<view class="question-content">
			<view class="content">
				<textarea class="uni-textarea" placeholder="分享您此刻的心情，随时记录" placeholder-class="placeholder-content"
					maxlength="1000" v-model="content" />
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
		<view class="question-tag" @click="addTopicHandler">
			<view class="tag-content" @click="openHandler">
				<image src="/static/forum/topic.png" class="img"></image><text class="txt">{{tagContent.label}}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';
	
	import {
		saveArticle
	} from "@/common/api/article.js"
	
	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const content = ref("");
	const imageUrl = ref("");
	const tagContent = ref({
		id: null,
		label: '添加话题'
	});
	const imageArr = ref([]);
	const uploadImageHandler = () => {
		uni.chooseImage({
			count: 1,
			success: function(res) {
				imageArr.value.push(res.tempFilePaths[0]);
				
				uni.uploadFile({
					url: 'https://ceshi.maimiaoqingsu.com/api/common/upload',
					filePath: res.tempFilePaths[0],
					name: 'file',
					header: {
						"token": uni.getStorageSync('token')
					},
					success: (res) => {
						console.log(JSON.parse(res.data));
						imageUrl.value = JSON.parse(res.data).data.url
					}
				});
			}
		})
	}
	
	const delImageHandler=(index)=>{
		imageArr.value.splice(index,1)
	}
	
	const addTopicHandler=()=>{
		uni.navigateTo({
			url:"/pages/forum/write/choose-topic/choose-topic"
		})
	}
	
	const onSaveArticle = async () => {
		let res = await saveArticle({
			"content": content.value,
			"imageUrl": imageUrl.value 
		});
		
		uni.showToast({
		    title: '发布成功',
		    icon: 'none', // 可选值 'success', 'loading', 'none'
		    duration: 2000 // 持续时长，单位ms
		});
		console.log(res)
	}
</script>

<style lang="scss" scoped>
	.send-dynamics-box {
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

			.question-title {
				::v-deep .uni-input {
					height: 106rpx;
					font-size: 36rpx;
					color: rgba(0, 0, 0, 0.85);
					font-weight: 500;
					border-bottom: 2rpx solid rgba(0, 0, 0, 0.04) !important;
				}

				.placeholder-title {
					color: rgba(0, 0, 0, 0.3);
				}
			}
		}

		.content {
			margin-top: 32rpx;
			position: relative;

			.uni-textarea {
				width: 100%;
				padding-bottom: 40rpx;
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