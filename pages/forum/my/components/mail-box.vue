<template>
	<view class="mailbox-box">
		<scroll-view scroll-y="true" class="scroll-content" :show-scrollbar="false">
			<view class="mailbox-list">
				<view class="mailbox-item" v-for="(item,index) in contentLists" :key="index" :class="item.type"
					@click="openMailBoxDetail(item)">
					<view class="content-item">
						<view class="title">{{item.title}}</view>
						<view class="content">
							<mote-lines-divide :line="4" expandText="展开" foldHint="收起">
								{{item.content}}
							</mote-lines-divide>
						</view>
					</view>
					<image :src="item.type=='old'?'/static/forum/old-arrow.png':item.type=='new'?'/static/forum/new-arrow.png':'/static/forum/future-arrow.png'" class="img"></image>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import MoteLinesDivide from "@/components/mote-lines-divide/mote-lines-divide"
	const contentLists = ref([{
		title: "写给从前的自己一封信",
		type: "old",
		content: "从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前从前"
	}, {
		title: "写给现在的自己一封信",
		type: "new",
		content: "现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在现在"
	}, {
		title: "写给未来的自己一封信",
		type: "future",
		content: "未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来未来"
	}])

	const openMailBoxDetail = (item) => {
		uni.navigateTo({
			url: `/pages/forum/mailbox/mailbox?type=${item.type}`
		})
	}
</script>

<style lang="scss" scoped>
	.mailbox-box {
		height: 100%;
		margin-top: 48rpx;

		.scroll-content {
			height: 100%;

			.mailbox-list {
				padding: 0rpx 32rpx;

				.mailbox-item {
					width: 686rpx;
					border-radius: 20rpx;
					position: relative;

					.content-item {
						padding: 32rpx 28rpx;

						.title {
							font-size: 30rpx;
							font-weight: 500;
							color: rgba(0, 0, 0, 0.85);
						}

						.content {
							font-size: 26rpx;
							color: rgba(0, 0, 0, 0.85);
							margin-top: 18rpx;
							line-height: 40rpx;
						}
					}

					.img {
						position: absolute;
						width: 108rpx;
						height: 78rpx;
						top: 0rpx;
						right: 0rpx
					}
				}

				.mailbox-item:not(:first-child) {
					margin-top: 20rpx;
				}

				.old {
					background: linear-gradient(180deg, #CDF7E9 0%, #FFFFFF 44%);
				}

				.new {
					background: linear-gradient(180deg, #F6EBC8 0%, #FFFFFF 44%);
				}

				.future {
					background: linear-gradient(180deg, #CFF0FA 0%, #FFFFFF 44%);
				}
			}
		}
	}
</style>