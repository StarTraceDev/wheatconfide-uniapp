<template>
	<view class="evaluate-page">
		<!-- 顶部导航 -->
		<u-navbar title="评测记录" :autoBack="true"></u-navbar>

		<!-- tabs -->
		<u-tabs :list="tabs" @click="changeTab" :current="currentTab" lineColor="#00C28A"
			activeStyle="color:#000;font-weight:600" inactiveStyle="color:#666">
		</u-tabs>

		<!-- 列表 -->
		<scroll-view scroll-y class="record-list">
			<view v-for="(item, index) in recordList" :key="index" class="record-card">
				<!-- 订单号 -->
				<view class="order-header">
					<text class="order-no">订单号：{{item.orderNo}}</text>
					<text class="status" :class="statusClass(item.status)">
						{{ item.status }}
					</text>
				</view>

				<!-- 用户 -->
				<view class="user-info">
					<image :src="item.avatar" class="avatar"></image>
					<text class="name">{{item.name}}</text>
				</view>

				<!-- 内容 -->
				<view class="record-content">
					<image :src="item.image" class="cover"></image>
					<view class="info">
						<view class="title">{{item.title}}</view>
						<view class="desc">{{item.desc}}</view>
					</view>
				</view>

				<!-- 时间 & 价格 -->
				<view class="record-footer">
					<text class="time">下单时间：{{item.time}}</text>
					<text class="price">￥{{item.price}}</text>
				</view>

				<!-- 按钮 -->
				<view class="btn-group">
					<view style="display: flex;flex-direction: row;gap: 10rpx;">
						<u-button v-if="item.status === '未完成'" class="btn" size="small" shape="circle"
							type="success">继续评测</u-button>

						<u-button v-if="item.status === '已完成'" class="btn" size="small" shape="circle"
							type="success">查看报告</u-button>

						<u-button v-if="item.status === '待支付'" class="btn" size="small" shape="circle" plain
							type="info">取消订单</u-button>

						<u-button v-if="item.status === '待支付'" class="btn" size="small" shape="circle"
							type="success">立即支付</u-button>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const tabs = ref([{
			name: '已付款'
		},
		{
			name: '待支付'
		}
	])

	const currentTab = ref(0)

	const recordList = ref([{
			orderNo: '78567564565',
			status: '未完成',
			name: '张三',
			avatar: '/static/avatar.png',
			image: '/static/test.png',
			title: '谈一段好的爱情',
			desc: '现在社会压力越来越大现在社会压力越来越大现在社会压力越来越大',
			price: 66,
			time: '2025-11-02 09:25'
		},
		{
			orderNo: '78567564565',
			status: '已完成',
			name: '张三',
			avatar: '/static/avatar.png',
			image: '/static/test.png',
			title: '谈一段好的爱情',
			desc: '现在社会压力越来越大现在社会压力越来越大现在社会压力越来越大',
			price: 66,
			time: '2025-11-02 09:25'
		},
		{
			orderNo: '78567564565',
			status: '待支付',
			name: '张三',
			avatar: '/static/avatar.png',
			image: '/static/test.png',
			title: '谈一段好的爱情',
			desc: '现在社会压力越来越大现在社会压力越来越大现在社会压力越来越大',
			price: 66,
			time: '2025-11-02 09:25'
		}
	])

	const changeTab = (e) => {
		currentTab.value = e.index
	}

	const statusClass = (status) => {
		return {
			'未完成': 'red',
			'已完成': 'green',
			'待支付': 'orange'
		} [status]
	}
</script>

<style lang="scss" scoped>
	.evaluate-page {
		background-color: #F7F8FA;
		min-height: 100vh;

		.record-list {
			height: 90vh;
		}

		.record-card {
			background-color: #fff;
			border-radius: 20rpx;
			padding: 24rpx;
			margin-bottom: 24rpx;
			margin: 20rpx 30rpx;
			box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.03);

			.order-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 26rpx;
				margin-bottom: 20rpx;

				.order-no {
					color: #333;
				}

				.status {
					font-weight: 500;

					&.red {
						color: #F76D64;
					}

					&.green {
						color: #00C28A;
					}

					&.orange {
						color: #EB9516;
					}
				}
			}

			.user-info {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;

				.avatar {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					margin-right: 16rpx;
				}

				.name {
					font-size: 28rpx;
					font-weight: 500;
					color: #000;
				}
			}

			.record-content {
				display: flex;
				align-items: flex-start;
				background-color: #F9FAFB;
				border-radius: 12rpx;
				padding: 20rpx;
				margin-bottom: 20rpx;

				.cover {
					width: 160rpx;
					height: 120rpx;
					border-radius: 12rpx;
					margin-right: 20rpx;
				}

				.info {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;

					.title {
						font-size: 30rpx;
						font-weight: 600;
						margin-bottom: 6rpx;
					}

					.desc {
						font-size: 24rpx;
						color: #888;
						line-height: 32rpx;
					}
				}
			}

			.record-footer {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 26rpx;
				color: #666;
				margin-bottom: 20rpx;

				.price {
					font-size: 30rpx;
					font-weight: 600;
					color: #000;
				}
			}

			.btn-group {
				display: flex;
				justify-content: flex-end;
				gap: 20rpx;
				.btn{
					padding-top: 16rpx;
					padding-bottom: 16rpx;
				}
			}
		}
	}
</style>