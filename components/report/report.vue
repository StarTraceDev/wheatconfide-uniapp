<template>
	<uni-popup ref="report" background-color="#fff" :is-mask-click="false" borderRadius="24rpx 24rpx 0rpx 0rpx"
		type="bottom">
		<view class="report-popup-box">
			<view class="report-header">
				<view></view>
				<view class="title">选择举报理由</view>
				<view>
					<uni-icons type="closeempty" size="14" color="rgba(0,0,0,0.3)" @click="closeReport"></uni-icons>
				</view>
			</view>
			<view class="report-content-list">
				<view class="report-content-item" v-for="(item,index) in reportLists" :key="index">{{item.label}}</view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	const report = ref(null);
	const openReport = () => {
		report.value.open();
	}

	const closeReport = () => {
		report.value.close();
	}

	const reportLists = [{
		id: 1,
		label: '政治反动'
	}, {
		id: 2,
		label: '色情内容'
	}, {
		id: 3,
		label: '人身攻击'
	}, {
		id: 4,
		label: '抄袭侵权'
	}, {
		id: 5,
		label: '未成年人'
	}, {
		id: 6,
		label: '血腥暴力'
	}, {
		id: 7,
		label: '广告欺诈'
	}, {
		id: 8,
		label: '灌水'
	}, {
		id: 9,
		label: '自杀倾向'
	}, {
		id: 9,
		label: '其他'
	}]
	defineExpose({
		openReport,
		closeReport
	})
</script>


<style lang="scss" scoped>
	.report-popup-box {
		width: 750rpx;
		height: 578rpx;
		background: #fff;
		border-radius: 24rpx 24rpx 0rpx 0rpx;

		.report-header {
			display: flex;
			justify-content: space-between;
			padding: 36rpx;

			.title {
				font-size: 32rpx;
				font-weight: 500;
				line-height: normal;
				color: #000000;
			}
		}

		.report-content-list {
			display: flex;
			flex-wrap: wrap;
            justify-content: space-between;
			padding: 0rpx 36rpx;
			.report-content-item {
				border-radius: 120rpx;
				background: #F1F1F1;
				color: rgba(0, 0, 0, 0.6);
				font-size: 26rpx;
				flex-shrink: 0;
				width: 200rpx;
				height: 64rpx;
				line-height: 64rpx;
				text-align: center;
				margin-top: 32rpx;
			}

			&::after {
				content: '';
				flex: auto;
				/* 或者flex: 1 */
			}
			}
		}
</style>