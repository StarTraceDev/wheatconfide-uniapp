<template>
	<view>
		<uni-popup ref="share" background-color="#fff" :is-mask-click="false" borderRadius="24rpx 24rpx 0rpx 0rpx"
			type="bottom">
			<view class="share-popup-box">
				<view class="share-content">
					<view class="title">分享到</view>
					<view class="share-list">
						<view class="share-item" v-for="(item,index) in channelList" :key="index" @click="item.fn">
							<view class="share-item-img" :style="{backgroundColor:item.backgroundColor}">
								<image :src="item.img" class="img" :style="{width:item.imgWidth,height:item.imgHeight}"
									mode="widthFix">
								</image>
							</view>
							<view class="txt">{{item.text}}</view>
						</view>
					</view>
					<view class="cancel" @click="closeShare">
						取消
					</view>
				</view>
			</view>
		</uni-popup>
		<report ref="reportRef"></report>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import report from '@/components/report/report.vue'
	const share = ref(null);
	const reportRef = ref(null);
	const channelList = ref([{
		type: "wechat",
		img: "/static/share/wechat.svg",
		backgroundColor: "#00B578",
		text: "微信",
		imgWidth: '38rpx',
		imgHeight: '32rpx',
		fn: () => new Function()
	}, {
		type: "friend",
		img: "/static/share/friend.svg",
		backgroundColor: "#00B578",
		text: "朋友圈",
		imgWidth: '32rpx',
		imgHeight: '32rpx',
		fn: () => new Function()
	}, {
		type: "zone",
		img: "/static/share/zone.svg",
		backgroundColor: "#FFC300",
		text: "QQ空间",
		imgWidth: '38rpx',
		imgHeight: '32rpx',
		fn: () => new Function()
	}, {
		type: "QQ",
		img: "/static/share/qq.svg",
		backgroundColor: "#43ADF9",
		text: "QQ",
		imgWidth: '26rpx',
		imgHeight: '30rpx',
		fn: () => new Function()
	}, {
		type: "link",
		img: "/static/share/link.svg",
		backgroundColor: "rgba(0, 0, 0, 0.85)",
		text: "复制链接",
		imgWidth: '34rpx',
		imgHeight: '34rpx',
		fn: () => new Function()
	}, {
		type: "report",
		img: "/static/share/report.svg",
		backgroundColor: "#f3f3f3",
		text: "举报",
		imgWidth: '36rpx',
		imgHeight: '28rpx',
		fn: () => reportFn()
	}, {
		type: "delete",
		img: "/static/share/delete.svg",
		backgroundColor: "#f3f3f3",
		text: "删除",
		imgWidth: '32rpx',
		imgHeight: '30rpx',
		fn: () => new Function()
	}])

	const openShare = () => {
		share.value.open();
	}

	const closeShare = () => {
		share.value.close();
	}



	const changeShare = () => {}

	const reportFn = () => {
		console.log(1)
		closeShare();
		console.log(reportRef.value);
		reportRef.value.openReport();
	}
	defineExpose({
		openShare,
		closeShare
	})
</script>


<style lang="scss" scoped>
	.share-popup-box {
		width: 750rpx;
		height: 578rpx;
		background: #fff;
		border-radius: 24rpx 24rpx 0rpx 0rpx;

		.share-content {
			padding: 36rpx;

			.title {
				font-size: 32rpx;
				color: #000;
			}
		}

		.share-list {
			display: flex;
			flex-wrap: wrap;

			.share-item {
				width: 20%;
				flex-shrink: 0;
				margin-top: 32rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.share-item-img {
					width: 80rpx;
					height: 80rpx;
					border-radius: 80rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.txt {
					color: rgba(0, 0, 0, 0.6);
					font-size: 24rpx;
					margin-top: 10rpx;
				}
			}

		}

		.cancel {
			font-size: 28rpx;
			color: rgba(0, 0, 0, 0.85);
			display: flex;
			justify-content: center;
			align-items: center;
			position: fixed;
			bottom: 0rpx;
			left: 32rpx;
			width: 686rpx;
			border-top: 2rpx solid rgba(0, 0, 0, 0.04);
			height: 92rpx;
		}
	}
</style>