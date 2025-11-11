<template>
	<view class="order-page">
		<!-- 顶部标题栏 -->
		<u-navbar title="倾诉订单" :autoBack="true"></u-navbar>

		<!-- 顶部 tabs -->
		<u-tabs :list="tabs" @change="changeTab" :current="currentTab" lineColor="#00C28A"
			activeStyle="color:#000;font-weight:600" inactiveStyle="color:#666"></u-tabs>

		<!-- 订单列表 -->
		<scroll-view scroll-y class="order-list">
			<view v-for="(item,index) in orderList" :key="index" class="order-card"
				:class="getStatusClass(item.status)">
				<!-- 订单头部 -->
				<view class="order-header">
					<text class="order-no">订单号：{{item.orderNo}}
						<image src="/static/order/ic-copy.png" style="width: 28rpx;height: 28rpx;margin-left: 15rpx;"
							@click="copyText(item.orderNo)"></image>
					</text>
					<text class="status" :class="getStatusTextClass(item.status)">{{getStatusText(item.status)}}</text>
				</view>

				<!-- 用户信息 -->
				<view class="user-info">
					<image :src="item.avatar" class="avatar"></image>
					<text class="username">{{item.name}}</text>
				</view>

				<!-- 订单内容 -->
				<view class="order-body">
					<view class="title">{{item.title}}</view>
					<view class="desc">{{item.desc}}</view>
				</view>

				<!-- 时间和价格 -->
				<view class="order-footer">
					<view class="time">下单时间：{{item.time}}</view>
					<view class="price">￥{{item.price}}</view>
				</view>

				<!-- 按钮组 -->
				<view class="btn-group">
					<!-- {{item.status}} -->
					<view style="display: flex;flex-direction: row;gap: 20rpx;">
						<u-button v-if="item.status==='待支付'" class="btn" size="small" shape="circle" plain
							type="info">取消订单</u-button>
						<u-button v-if="item.status==='待支付'" class="btn" size="small" shape="circle" type="success">立即支付</u-button>

						<u-button v-if="item.status==='待咨询'" class="btn" size="small" shape="circle" plain type="info" >退款</u-button>
						<u-button v-if="item.status==='待咨询'" class="btn" size="small" shape="circle" type="success">立即咨询</u-button>

						<u-button v-if="item.status==='待评价'" class="btn" size="small" shape="circle" type="success">去评价</u-button>
					</view>
					<!-- <u-button
						v-if="item.status==='已完成'"
						size="small" shape="circle"
						type="success">q</u-button> -->

					<!-- <u-button
						v-if="item.status==='未完成'"
						size="small" shape="circle"
						type="success" text="继续评测"></u-button> -->
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
			name: '全部'
		},
		{
			name: '待付款'
		},
		{
			name: '待咨询'
		},
		{
			name: '待评价'
		},
		{
			name: '交易完成'
		}
	])
	const currentTab = ref(0)

	const changeTab = (e) => {
		console.log(e);
		currentTab.value = e
	}

	const orderList = ref([{
			orderNo: '78567564565',
			status: '待支付',
			name: '张三',
			avatar: '/static/avatar.png',
			title: '首单体验-电话',
			desc: '购买时长：10分钟\n服务方式：语音\n剩余时长：10:00',
			price: 66,
			time: '2025-11-02 09:25'
		},
		{
			orderNo: '78567564565',
			status: '待咨询',
			name: '张三',
			avatar: '/static/avatar.png',
			title: '首单体验-电话',
			desc: '购买时长：10分钟\n服务方式：语音\n剩余时长：10:00',
			price: 66,
			time: '2025-11-02 09:25'
		},
		{
			orderNo: '78567564565',
			status: '待评价',
			name: '张三',
			avatar: '/static/avatar.png',
			title: '首单体验-电话',
			desc: '购买时长：10分钟\n服务方式：语音\n剩余时长：10:00',
			price: 66,
			time: '2025-11-02 09:25'
		},
		{
			orderNo: '78567564565',
			status: '已完成',
			name: '张三',
			avatar: '/static/avatar.png',
			title: '谈一段好的爱情',
			desc: '现在社会压力越来越大现在社会压力越来越大',
			price: 66,
			time: '2025-11-02 09:25'
		}
	])

	// const changeTab = (e) => {
	// 	currentTab.value = e.index
	// }

	const getStatusText = (status) => {
		switch (status) {
			case '待支付':
				return '待付款'
			case '待咨询':
				return '待咨询'
			case '待评价':
				return '待评价'
			case '已完成':
				return '已完成'
			case '未完成':
				return '未完成'
			default:
				return ''
		}
	}

	const copyText = (text) => {
		uni.setClipboardData({
			data: text,
			success(e) {
				uni.showToast({
					title: "已复制"
				})
			}
		})
	}

	const getStatusTextClass = (status) => {
		return {
			'待支付': 'orange',
			'待咨询': 'green',
			'待评价': 'blue',
			'已完成': 'gray',
			'未完成': 'red'
		} [status]
	}

	const getStatusClass = (status) => {
		return {
			'待支付': '',
			'待咨询': '',
			'待评价': '',
			'已完成': '',
			'未完成': ''
		} [status]
	}
</script>

<style lang="scss" scoped>
	.order-page {
		background-color: #F7F8FA;
		min-height: 100vh;

		.order-list {
			display: flex;
			flex-direction: column;
			height: 90vh;
		}

		.order-card {
			margin: 20rpx 30rpx;
			background-color: #fff;
			border-radius: 20rpx;
			padding: 24rpx;
			margin-bottom: 24rpx;
			box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.03);
			border: 2rpx solid transparent;

			// &.border-blue {
			// 	border-color: #4A90E2;
			// }

			.order-header {
				display: flex;
				justify-content: space-between;
				font-size: 26rpx;
				margin-bottom: 20rpx;

				.order-no {
					display: flex;
					flex-direction: row;
					align-items: center;
					color: #333;
				}

				.status {
					font-weight: 500;
				}

				.orange {
					color: #EB9516;
				}

				.green {
					color: #00C28A;
				}

				.blue {
					color: #2A90FF;
				}

				.gray {
					color: #999;
				}

				.red {
					color: #F76D64;
				}
			}

			.user-info {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;

				.avatar {
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
					margin-right: 16rpx;
				}

				.username {
					font-size: 28rpx;
					font-weight: 500;
					color: #000;
				}
			}

			.order-body {
				background-color: #F9FAFB;
				border-radius: 12rpx;
				padding: 20rpx;
				margin-bottom: 20rpx;

				.title {
					font-size: 30rpx;
					font-weight: 600;
					margin-bottom: 10rpx;
				}

				.desc {
					color: #888;
					font-size: 24rpx;
					line-height: 34rpx;
					white-space: pre-line;
				}
			}

			.order-footer {
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
				flex-direction: row;
				align-items: flex-end;
				justify-content: flex-end;
				.btn{
					padding: 16rpx 30rpx;
					min-width: 160rpx;
				}
			}
		}
	}
</style>