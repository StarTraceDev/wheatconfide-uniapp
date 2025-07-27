<template>
	<view class="forum-index-box">
		<view class="navbar">
			<view class="header">
				<view class="left">
					<uni-icons type="left" size="24" color="#000" @click="backFn"></uni-icons>
					<view class="tabs">
						<text class="tab-item" @click="headerTabsHandler(item)" v-for="(item,index) in headerTabsList"
							:key="index" :class="headerTabsActive==item.id?'active':''">{{item.label}}</text>
					</view>
				</view>
				<view class="user" @click="openUserHandler">
					<uni-icons type="person" size="24" color="rgba(0,0,0,.85)"></uni-icons>
				</view>
			</view>
		</view>
		<view class="worry-box" v-if="headerTabsActive==0">
			<worry></worry>
		</view>
		<view class="qa-box" v-else>
			<qa></qa>
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
	import worry from './components/worry.vue'
	import qa from './components/qa.vue'

	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
	const scrollTop = ref(0);



	const headerTabsList = ref([{
		id: 0,
		label: "心事"
	}, {
		id: 1,
		label: "问答"
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
	
	const openUserHandler=()=>{
		uni.navigateTo({
			url:"/pages/forum/my/my"
		})
	}
</script>
<style lang="scss" scoped>
	.forum-index-box {
		$statusBarHeight: v-bind(statusBarHeight);
		width: 750rpx;
		background: #F4F6F8;
		height: 100vh;

		.navbar {
			height: calc($statusBarHeight + 88rpx);
			width: 750rpx;
			// background: linear-gradient(180deg, #D4FFF0 0%, #F4F6F8 100%);
			background-image: url("@/static/forum/bg.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;
			display: flex;
			align-items: end;
			position: fixed;
			top: 0rpx;
			z-index: 1;

			.header {
				height: 88rpx;
				width: 750rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0rpx 32rpx;

				.left {
					display: flex;
					align-items: center;

					.tabs {
						margin-left: 80rpx;
						font-size: 32rpx;
						font-weight: normal;
						color: #687581;

						.tab-item:first-child {
							margin-right: 60rpx;
						}

						.active {
							font-size: 36rpx;
							font-weight: 600;
							color: #212528;
							position: relative;
						}

						.active::after {
							position: absolute;
							content: '';
							width: 40rpx;
							height: 8rpx;
							background-color: #35CA95;
							border-radius: 4px;
							bottom: -8rpx;
							left: 16rpx;
						}
					}
				}

			}
		}

		.worry-box {
			height: calc(100vh - $statusBarHeight - 138rpx);
			padding-top: calc($statusBarHeight + 88rpx);
		}

		.qa-box {
			height: calc(100vh - $statusBarHeight - 128rpx);
			padding-top: calc($statusBarHeight + 88rpx);
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