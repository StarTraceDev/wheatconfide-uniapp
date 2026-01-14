<template>
	<view class="mailbox-contaior">
		<view class="navbar" :style="{'backgroundImage':type=='old' ? 'url(/static/forum/old-bg.png)':type=='new'
			? 'url(/static/forum/new-bg.png)': 'url(/static/forum/future-bg.png)'}">
			<view class="header">
				<view class="content">
					<uni-icons type="left" size="24" color="#000" @click="backFn" class="left"></uni-icons>
					<uni-icons type="more-filled" size="18" color="#808080"></uni-icons>
				</view>
				<view class="title">写给从前的自己的一封信</view>
				<view class="item-header">
					<view class="item-header-left">
						<view class="header-pic">
							<image src="/static/my/profile.png" class="img"></image>
						</view>
						<view class="header-info">
							<view class="name">张三</view>
							<view class="time">咨询师 | 认证作家</view>
						</view>
					</view>
					<view class="item-header-right">
						<image
							:src="type=='new'?'@/static/forum/new-logo.png':type=='old'?'@/static/forum/old-logo.png':'@/static/forum/future-logo.png'"
							class="img"></image>
					</view>
				</view>

			</view>
		</view>

		<view class="info">
			<scroll-view scroll-y="true" class="scroll-content" :show-scrollbar="false">
				<view class="info-box">
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
					心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题心理健康问题。
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
	import {
		nextTick,
		onMounted,
		ref
	} from 'vue';
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		useGlobalDataStore
	} from '@/stores/global.js';

	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
	const scrollTop = ref(0);
	const type = ref(null);
	onLoad((e) => {
		type.value = e.type;
	})

	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}
</script>

<style lang="scss" scoped>
	.mailbox-contaior {
		$statusBarHeight: v-bind(statusBarHeight);
		height: 100vh;
		background-color: #f4f6f8;

		.navbar {
			height: calc($statusBarHeight + 272rpx);
			width: 750rpx;
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.header {
				height: 60rpx;
				width: 750rpx;
				padding: calc($statusBarHeight + 20rpx) 0rpx;

				.content {
					padding: 0rpx 32rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.left {
						display: flex;
						align-items: center;
					}
				}

				.title {
					padding: 0rpx 32rpx;
					margin-top: 42rpx;
				}

				.item-header {
					display: flex;
					justify-content: space-between;
					height: 80rpx;
					align-items: center;
					padding: 0rpx 32rpx;
					margin-top: 32rpx;

					.item-header-left {
						display: flex;

						.header-pic {
							.img {
								width: 72rpx;
								height: 72rpx;
							}
						}

						.header-info {
							margin-left: 32rpx;

							.name {
								font-size: 30rpx;
								color: #212528;
							}

							.time {
								color: rgba(0, 0, 0, 0.35);
								font-size: 24rpx;
							}
						}
					}

					.item-header-right {
						display: flex;
						align-items: center;

						.img {
							width: 72rpx;
							height: 72rpx;
						}
					}
				}

			}
		}

		.info {
			height: calc(100vh - $statusBarHeight - 312rpx);
			font-size: 24rpx;
			color: rgba(0, 0, 0, 0.65);
			padding: 0rpx 40rpx;
			margin-top: 40rpx;
			.scroll-content{
				height: 100%;
				.info-box{
					padding-bottom: 40rpx;
				}
			}
		}
	}
</style>