<template>
	<view class="forum-Item">
		<view class="forum-content">
			<view class="content">{{info.content}}</view>
			<view class="forum-image">
				<scroll-view class="scroll-view_H" scroll-x="true">
					<view class="forum-image-list">
						<image src="/static/consult/user.png" v-for="i in 10" class="img"></image>
					</view>
				</scroll-view>
			</view>
			<view class="info">
				<text class="date">
					2025/01/02
				</text>
				<text class="date">·</text>
				<text class="view">
					浏览7876
				</text>
			</view>
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
	.forum-Item {
		width: 686rpx;
		min-height: 380rpx;
		border-radius: 20rpx;
		background: #FFFFFF;
		display: flex;

		.forum-content {
			padding: 32rpx;
			width: 686rpx;
			.content {
				font-size: 28rpx;
				color: rgba(0, 0, 0, 0.85);
				font-weight: 500;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}

			.forum-image {
				margin-top: 20rpx;
				.forum-image-list {
					display: flex;
					flex-direction: row;
					.img {
						width: 196rpx;
						height: 196rpx;
						margin-right: 18rpx;
						flex-shrink: 0;
					}
				}

			}

			.info {
				display: flex;
				flex-direction: row;
				margin-top: 22rpx;
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
				.date{
					padding: 0rpx 10rpx;
				}
			}
		}
	}
</style>