<template>
	<view class="teacher-container">
		<view class="card">
			<view class="avatar-wrap">
				<image class="avatar" :src="info.avatar?info.avatar:'@/static/consult/user.png'" mode="aspectFill"></image>
			</view>
			<view class="info-wrap">
				<view class="name-title">{{info.name}}</view>
				<view class="job-title">心理咨询师</view>
				<view class="stats">
					5000+人次·5年从业
				</view>
				<view class="tags">
					<text class="tag" v-for="(item,index) in info.serviceType.split(',')">{{item}}</text>
					<!-- <text class="tag">压力管理</text> -->
					<!-- <text class="tag">婚姻家庭</text> -->
				</view>
				<view class="price-button">
					<view class="price" v-if="info.price"><text class="unit">¥</text>{{info.price}}<text class="txt">起</text></view>
					<view style="font-size: 26rpx;color: red;" v-else>限时免费</view>
					<view class="contact">找ta聊</view>
				</view>
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

<style scoped lang="scss">
	.teacher-container {
		height: 304rpx;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 24rpx 24rpx 0rpx 24rpx;

		.card {
			display: flex;

			.avatar-wrap {
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;

				.avatar {
					border-radius: 15rpx;
					width: 168rpx;
					height: 168rpx;
				}

				.txt {
					font-size: 20rpx;
					color: #fff;
					padding: 8rpx 20rpx;
					background: #35CA95;
					border-radius: 20rpx;
					position: absolute;
					top: 148rpx;
				}
			}

			.info-wrap {
				margin-left: 20rpx;

				.name-title {
					color: rgba(0, 0, 0, 0.85);
					font-size: 32rpx;
				}

				.job-title {
					color: rgba(0, 0, 0, 0.85);
					font-size: 24rpx;
					padding-top: 12rpx;
				}

				.stats {
					display: flex;
					padding-top: 12rpx;
					font-size: 24rpx;
					color: rgba(0, 0, 0, 0.5);

					.stat {}
				}

				.tags {
					padding-top: 12rpx;

					.tag {
						color: #35CA95;
						font-size: 20rpx;
						border-radius: 8rpx;
						border: 1px solid #35CA95;
						padding: 4rpx 6rpx;
						margin-right: 10rpx;
					}
				}

				.price-button {
					display: flex;
					padding-top: 30rpx;
					justify-content: space-between;
				    align-items: center;
					.price {
						color: #FA5151;
						font-size: 40rpx;
				
						.unit,
						.txt {
							font-size: 20rpx;
						}
					}
				
					.contact {
						width: 140rpx;
						height: 60rpx;
						border-radius: 60rpx;
						/* 自动布局 */
						background: #35CA95;
						text-align: center;
						line-height: 60rpx;
						font-size: 28rpx;
						color: #fff;
					}
				}
			}
		}
	}
</style>