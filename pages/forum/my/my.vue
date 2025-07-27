<template>
	<view class="forum-my-box">
		<view class="navbar">
			<view class="header">
				<uni-icons type="left" size="24" color="#000" @click="backFn" class="left"></uni-icons>
			</view>
			<view class="user-info">
				<view class="user-info-content">
					<image src="@/static/my/profile.png" class="profile"></image>
					<view>
						<view class="nick-name">大石头</view>
						<view class="id-num">
							<text>ID：12367263732</text>
						</view>
					</view>
				</view>

				<view class="edit-user-box">
					<view class="edit-user" @click="editUserHandler">编辑资料</view>
				</view>
			</view>
			<view class="remark">倾听师寄语倾听师寄语倾听师寄语倾听师寄</view>
			<view class="num-box">
				<view class="num-content-box">
					<view class="content-item">
						<text class="num">9999</text>
						<text class="txt">获赞</text>
					</view>
					<view class="content-item">
						<text class="num">9999</text>
						<text class="txt">关注</text>
					</view>
					<view class="content-item">
						<text class="num">9999</text>
						<text class="txt">粉丝</text>
					</view>
					<view class="content-item">
						<text class="num">9999</text>
						<text class="txt">访客</text>
					</view>
				</view>
			</view>
		</view>
		<view class="tabs">
			<view @click="headerTabsHandler(item)" class="tab-item" v-for="(item,index) in headerTabsList" :key="index"
				:class="headerTabsActive==item.id?'active':''">{{item.label}}</view>
		</view>
		<view class="mood-log-box" v-if="headerTabsActive==0">
			<modeLog></modeLog>
		</view>
		<view class="mood-log-box mailbox-box" v-else>
			<mailBox></mailBox>
		</view>
		<view class="fab-button" @click="openWrite">
			<image src="/static/common/forum-fab.png" class="img"></image>
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
		useGlobalDataStore
	} from '@/stores/global.js';

	import modeLog from './components/mood-log.vue'
	import mailBox from './components/mail-box.vue'
	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
	const scrollTop = ref(0);

	const headerTabsList = ref([{
		id: 0,
		label: "心情日志"
	}, {
		id: 1,
		label: "信箱"
	}]);



	const headerTabsActive = ref(0);
	const headerTabsHandler = (options) => {
		if (headerTabsActive.value != options.id) {
			headerTabsActive.value = options.id
		}
	}


	const openWrite = () => {
		uni.navigateTo({
			url: "/pages/forum/write/write"
		})
	}

	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	
	const editUserHandler=()=>{
		uni.navigateTo({
			url:'/pages/forum/my/userInfo'
		})
	}
</script>
<style lang="scss" scoped>
	.forum-my-box {
		$statusBarHeight: v-bind(statusBarHeight);
		width: 750rpx;
		background: #F4F6F8;
		height: 100vh;

		.navbar {
			height: calc($statusBarHeight + 464rpx);
			width: 750rpx;
			background-image: url("@/static/forum/bg.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;

			.header {
				height: 60rpx;
				width: 750rpx;
				justify-content: space-between;
				padding-top:$statusBarHeight;
				.left {
					display: flex;
					align-items: center;
					padding-left: 32rpx;
				}
			}

			.user-info {
				display: flex;
				align-items: center;
				color: #000000;
				justify-content: space-between;
				padding: 0 32rpx;
                padding-top: 40rpx;
				.user-info-content {
					display: flex;
					align-items: center;
				}

				.profile {
					width: 120rpx;
					height: 120rpx;
					margin-right: 20rpx;
				}

				.nick-name {
					font-weight: 500;
					font-size: 36rpx;
					color: #212528;
				}

				.id-num {
					font-size: 26rpx;
					margin-top: 12rpx;
					font-weight: 400;
					color: rgba(0, 0, 0, 0.6);

				}

				.edit-user-box {
					.edit-user {
						width: 144rpx;
						height: 56rpx;
						border-radius: 32rpx;
						opacity: 1;
						text-align: center;
						line-height: 56rpx;
						background: #34A755;
						font-size: 26rpx;
						color: #fff;
					}
				}
			}

			.remark {
				padding: 0 32rpx;
				font-size: 26rpx;
				color: rgba(0, 0, 0, 0.85);
				margin-top: 26rpx;
			}

			.num-box {
				width: 686rpx;
				height: 136rpx;
				margin-top: 40rpx;
				border-radius: 20rpx;
				margin-left: 32rpx;
				background: #FFFFFF;
				display: flex;
				align-items: center;

				.num-content-box {
					padding: 0rpx 36rpx;
					display: flex;
					width: 100%;
					justify-content: space-between;

					.content-item {
						display: flex;
						justify-content: center;
						flex-direction: column;

						.num {
							font-size: 32rpx;
							color: rgba(0, 0, 0, 0.85);
						}

						.txt {
							font-size: 24rpx;
							color: rgba(0, 0, 0, 0.5);
						}
					}

				}
			}
		}

		.tabs {
			display: flex;
			font-size: 32rpx;
			color: rgba(0, 0, 0, 0.65);
			margin-top: 48rpx;
			padding-left: 36rpx;
			width: 272rpx;
			justify-content: space-between;
			height: 48rpx;

			.tab-item {
				display: flex;
				justify-content: center;
			}

			.active {
				position: relative;
				color: rgba(0, 0, 0, 0.85);

				&::after {
					width: 28rpx;
					height: 28rpx;
					content: '';
					background-image: url("/static/common/forum-content-tab-active.png");
					position: absolute;
					background-size: 100% 100%;
					bottom: -20rpx;
				}
			}
		}

		.mood-log-box {
			height: calc(100vh - $statusBarHeight - 610rpx);
		}

		.fab-button {
			position: fixed;
			right: 32rpx;
			bottom: 112rpx;
			width: 88rpx;
			height: 88rpx;
			background: #00B578;
			border-radius: 88rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.img {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
</style>