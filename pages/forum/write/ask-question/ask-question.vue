<template>
	<view class="ask-question-box">
		<uni-nav-bar :backgroundColor="'#F4F6F8'" :border="false" title="提问题" class="header-bar" :statusBar="true"
			fixed>
			<template v-slot:left>
				<uni-icons type="left" size="24" @click="backFn"></uni-icons>
			</template>
			<template v-slot:right>
				<view class="right" @click="releaseQuestion">
					发布
				</view>
			</template>
		</uni-nav-bar>
		<view class="question-content">
			<view class="question-title">
				<input class="uni-input" maxlength="25" placeholder="请说出您的问题（5-25字）"
					placeholder-class="placeholder-title" v-model="form.title" />
			</view>
			<view class="content">
				<textarea class="uni-textarea" v-model="form.content" placeholder="示例：25岁女孩，近期情绪很焦虑，怎么去缓解？
包含年龄、性别信息
明确具体困扰与症状，以便得到更专业解答？" placeholder-class="placeholder-content" maxlength="1000"  />
				<view class="char-count">{{content.length}}/1000</view>
			</view>
		</view>
		<view class="question-tag">
			<view class="tag-content" @click="openHandler">
				<image src="/static/forum/tag.png" class="img"></image><text class="txt">{{tagContent.label}}</text>
			</view>
		</view>


		<uni-popup class="tag-popup" ref="tagPopupRef" type="bottom" background-color="#fff"
			border-radius="24rpx 24rpx 0rpx 0rpx" :is-mask-click="false">
			<view class="tag-header">
				<view class="tag-header-content">
					<view class="cancel" @click="cancelHandler">取消</view>
					<view class="title">选择标签</view>
					<view class="confirm" @click="confirmHandler">确认</view>
				</view>
			</view>
			<view class="tag-content">
				<view class="tag-left">
					<scroll-view scroll-y="true" class="scroll-content" :show-scrollbar="false">
						<view class="tag-item" v-for="i in 20" :key="i" :class="tabActive==i?'active':''"
							@click="changeTabHandler(i)">
							健康
						</view>
					</scroll-view>
				</view>
				<view class="tag-right">
					<scroll-view scroll-y="true" class="scroll-content" :show-scrollbar="false">
						<view class="tag-right-content">
							<text class="content-item" v-for="i in 20" :key="i" :class="contentActive==i?'active':''"
								@click="changeContentHandler(i)">
								天气很好
							</text>
						</view>

					</scroll-view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';
	
	import {
		publishQuestion
	} from '@/common/api/answer.js'

	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	
	const form = ref({})

	const content = ref("");

	const tagContent = ref({
		id: null,
		label: '添加标签'
	});

	const tagPopupRef = ref(null);

	const releaseQuestion = async() => {
		let resp =  await publishQuestion(form.value)
		console.log(resp);
		if(resp.code==0){
			uni.showToast({
				title:"发布成功",
				icon:"success",
				success(res) {
					uni.navigateBack()
				}
			})
		}
	}


	const tabActive = ref(1);

	const changeTabHandler = (i) => {
		if (tabActive.value != i) {
			tabActive.value = i;
		}
	}

	const contentActive = ref(1);
	const changeContentHandler = (i) => {
		if (contentActive.value != i) {
			contentActive.value = i;
		}
	}

	const openHandler = () => {
		tagPopupRef.value.open();
	}
	const cancelHandler = () => {
		tagPopupRef.value.close();
	}

	const confirmHandler = () => {
		tagPopupRef.value.close();
		tagContent.value = {
			id: 1,
			label: "天气不错"
		}
	}
</script>

<style lang="scss" scoped>
	.ask-question-box {
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

		.question-tag {
			border-radius: 40rpx;
			background: #F7F7F7;
			display: inline-block;
			padding: 8rpx 20rpx;
			margin-left: 38rpx;
			margin-top: 64rpx;

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

		.tag-popup {
			.tag-header {
				.tag-header-content {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0rpx 32rpx;
					height: 88rpx;

					.cancel {
						font-size: 28rpx;
						color: rgba(0, 0, 0, 0.6);
					}

					.title {
						font-size: 32rpx;
						font-weight: 500;
						color: #000000;
					}

					.confirm {
						font-size: 28rpx;
						color: #35CA95;
					}
				}
			}

			.tag-content {
				border-radius: 24rpx 24rpx 0rpx 0rpx;
				height: 852rpx;
				background: #fff;
				display: flex;

				.tag-left,
				.tag-right {
					height: 100%;
					flex-shrink: 0;

					.scroll-content {
						height: 100%;
					}
				}

				.tag-left {
					width: 160rpx;
					background: #F7F7F7;

					.tag-item {
						width: 100%;
						height: 120rpx;
						display: flex;
						align-items: center;
						color: rgba(0, 0, 0, 0.5);
						justify-content: center;
						font-size: 26rpx;
					}

					.active {
						background: #fff;
						color: rgba(0, 0, 0, 0.85);
						font-weight: 500;
						position: relative;

						&::before {
							content: "";
							width: 6rpx;
							height: 40rpx;
							background: #38CC98;
							position: absolute;
							left: 0rpx;

						}
					}
				}

				.tag-right {
					width: 590rpx;

					.tag-right-content {
						display: flex;
						flex-wrap: wrap;
						padding: 20rpx 0rpx 40rpx 0rpx;
					}

					.content-item {
						padding: 14rpx 34rpx;
						line-height: 1;
						border-radius: 120rpx;
						background: #F7F7F7;
						font-size: 26rpx;
						color: rgba(0, 0, 0, 0.6);
						margin-top: 40rpx;
						margin-left: 20rpx;
					}

					.active {
						background-color: #35CA95;
						color: #fff;
					}
				}
			}
		}
	}
</style>