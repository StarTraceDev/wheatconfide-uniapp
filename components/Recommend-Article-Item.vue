<template>
	<view class="recommend-article-Item">
		<view class="recommend-article-content">
			<view class="content" v-if="info">{{info.title}}</view>
			<view class="info">
				<view class="user">
					<image src="/static/my/profile.png" class="picture"></image>
					<text class="name">MR.Z</text>
				</view>
				<view class="view">
					浏览7876
				</view>
				<view class="date">
					2025/01/02
				</view>
			</view>
		</view>
		<view class="recommend-article-image">
			<image src="/static/consult/user.png"></image>
		</view>
	</view>
</template>

<script setup>
	import {defineProps} from "vue";
	const props=defineProps({
		info:{
			type:Object
		}
	})
</script>

<style lang="scss" scoped>
	.recommend-article-Item {
		width: 686rpx;
		height: 200rpx;
		border-radius: 20rpx;
		background: #FFFFFF;
		display: flex;


		.recommend-article-content {
			width: 480rpx;
			padding-left: 24rpx;
			padding-right: 52rpx;
			padding-top: 32rpx;

			.content {
				font-size: 28rpx;
				color: rgba(0, 0, 0, 0.85);
				font-weight: 500;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}

			.info {
				display: flex;
				flex-direction: row;
				margin-top: 22rpx;
				justify-content: space-between;
				height: 36rpx;
				align-items: center;

				.user {
					.picture {
						width: 36rpx;
						height: 36rpx;
						vertical-align: middle;
					}

					.name {
						font-size: 24rpx;
						color: rgba(0, 0, 0, 0.85);
						margin-left: 10rpx;
					}
				}

				.view,
				.date {
					font-size: 24rpx;
					color: rgba(0, 0, 0, 0.35);
				}
			}
		}

		.recommend-article-image {
			padding-right: 24rpx;
			width: 206rpx;
			padding-top: 32rpx;

			image {
				width: 180rpx;
				height: 136rpx;
				border-radius: 16rpx;
			}
		}
	}
</style>