<template>
	<view class="choose-topic-box">
		<uni-nav-bar :backgroundColor="'#F4F6F8'" :border="false" title="选择话题" class="header-bar" :statusBar="true"
			fixed>
			<template v-slot:left>
				<uni-icons type="left" size="24" @click="backFn"></uni-icons>
			</template>
		</uni-nav-bar>
		<view class="choose-topic-content">
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
							<view class="content-item" v-for="i in 20" :key="i" :class="contentActive==i?'active':''"
								@click="changeContentHandler(i)">
								 <view class="topic-image">
									 <image src="/static/forum/topic-b.png" class="img"></image>
								 </view>
								 <view class="content">
									  <view class="title">潜意识投射测试</view>
									    <view class="remark"><text class="num">234</text>篇内容</view>
								 </view>
							</view>
						</view>

					</scroll-view>
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
	import {
		useGlobalDataStore
	} from '@/stores/global.js';
	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
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
</script>

<style lang="scss" scoped>
	.choose-topic-box {
		$statusBarHeight: v-bind(statusBarHeight);
		background: #fff;
		height: 100vh;

		.choose-topic-content {
			.tag-content {
				height: calc(100vh - $statusBarHeight - 88rpx);
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
						padding: 20rpx 0rpx 40rpx 0rpx;
					}

					.content-item {
						height: 116rpx;
						line-height: 1;
						font-size: 26rpx;
						color: rgba(0, 0, 0, 0.6);
						margin-left: 20rpx;
						display: flex;
						align-items: center;
						&:not(:first-child){
							border-top: 2rpx solid rgba(0, 0, 0, 0.04);
						}
						.topic-image{
							margin-right:20rpx;
							.img{
								width: 80rpx;
								height: 80rpx;
							}
						}
						.content{
							.title{
								color: rgba(0, 0, 0, 0.85);
								font-size: 28rpx;
							}
							.remark{
								font-size: 24rpx;
								color: rgba(0, 0, 0, 0.35);
								margin-top: 20rpx;
								.num{
									color: rgba(0, 0, 0, 0.85);
								}
							}
						}
					}

					.active {
						// background-color: #35CA95;
						// color: #fff;
					}
				}
			}
		}
	}
</style>