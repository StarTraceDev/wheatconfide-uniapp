<template>
	<view class="my-order-box">
		<uni-nav-bar :backgroundColor="'#F4F6F8'" :border="false" title="我的评测" class="header-bar" :statusBar="true"
			fixed>
			<template v-slot:left>
				<uni-icons type="left" size="24" @click="backFn"></uni-icons>
			</template>
		</uni-nav-bar>

		<view class="tab-list-box">
			<view class="tab-list-content">
				
				<view class="tab-item" v-for="(item,index) in tabsList" :key="item.id" @click="tabHandler(item)"
					:class="tabActive==item.id?'active':''">
					{{item.label}}
					<view class="is-dot" v-if="item.isDot"></view>
				</view>
			</view>
		</view>

		<view class="order-content-box">
			<scroll-view scroll-y="true" class="scroll-content" :show-scrollbar="false">
				<view class="order-content-list">
					<view class="order-content-item" v-for="i in 10" :key="i">
						<view class="item-box">
							<view class="image-item">
								<image src="/static/consult/user.png" class="img"></image>
							</view>
							<view class="text-content">
								<view class="header">
									<view class="title">谈一段好的爱情</view>
									<view class="date">2025/02/01</view>
								</view>
								<view class="content">现在社会压力越来越大现在社会压力越来越大现在社会压力越来越大</view>
								<view class="footer" v-if="tabActive!=3">
									<view class="free">免费</view>
									<view class="test">继续评测</view>
								</view>
								<view class="footer" v-else>
									<view class="price">￥19.9</view>
									<view class="test">立即支付</view>
								</view>
							</view>
						</view>

					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
import {
		useGlobalDataStore
	} from '@/stores/global.js';
	
	import {onShow} from '@dcloudio/uni-app';
	import {} from '@/common/api/exam.js'
	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	
	onShow(()=>{
		getExamRecord()
	})
	
	const getExamRecord = ()=>{
		
	}

	const tabsList = ref([{
		id: 1,
		label: "未完成",
		isDot: false
	}, {
		id: 2,
		label: "已完成",
		isDot: false
	}, {
		id: 3,
		label: "待支付",
		isDot: true
	}]);
	const tabActive = ref(1);
	
	const tabHandler = (item) => {
		item.id != tabActive.value ? tabActive.value = item.id : ''
	}
</script>

<style lang="scss" scoped>
	.my-order-box {
		$statusBarHeight:v-bind(statusBarHeight);
		height: 100vh;
		background-color: #f4f6f8;
		width: 750rpx;

		.tab-list-box {
			.tab-list-content {
				display: flex;
				align-items: center;
				height: 128rpx;

				.tab-item {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 32rpx;
					color: rgba(0, 0, 0, 0.65);
					position: relative;
					margin-left: 40rpx;
					.is-dot{
						width: 12rpx;
						height: 12rpx;
						border-radius: 12rpx;
						background: #FA5151;
						position: absolute;
						right: -10rpx;
						top: 0rpx;
					}
				}

				.active {
					position: relative;
					font-size: 36rpx;
					color: rgba(0, 0, 0, 0.85);

					&::after {
						content: "";
						width: 36rpx;
						height: 36rpx;
						position: absolute;
						bottom: 0;
						background-image: url("@/static/index/subscript.png");
						background-repeat: no-repeat;
						bottom: -20rpx;
						background-size: 100% 100%;
					}
				}
			}
		}
		.order-content-box {
			width: 750rpx;
			.scroll-content {
				height: calc(100vh - 128rpx - 88rpx - $statusBarHeight);
				.order-content-list {
					padding: 0rpx 32rpx 60rpx 32rpx;
					
					.order-content-item {
						width: 686rpx;

						border-radius: 20rpx;
						background: #fff;

						.item-box {
							display: flex;
							align-items: center;
							padding: 0rpx 20rpx;
							height: 220rpx;

							.image-item {
								.img {
									width: 180rpx;
									height: 180rpx;
								}

							}

							.text-content {
								margin-left: 20rpx;

								.header {
									display: flex;
									justify-content: space-between;
									height: 44rpx;

									.title {
										font-size: 28rpx;
										color: rgba(0, 0, 0, 0.85);
									}

									.date {
										font-size: 20rpx;
										color: rgba(0, 0, 0, 0.35);
									}
								}

								.content {
									color: rgba(0, 0, 0, 0.35);
									font-size: 22rpx;
									height: 60rpx;
								}

								.footer {
									display: flex;
									justify-content: space-between;
									align-items: center;
									margin-top: 28rpx;

									.free {
										font-size: 24rpx;
										color: #38CC98;
									}
									.price{
										font-size: 28rpx;
										color: #FA5151;
									}

									.test {
										width: 140rpx;
										height: 48rpx;
										border-radius: 60rpx;
										background: #35CA95;
										text-align: center;
										line-height: 48rpx;
										color: #fff;
										font-size: 24rpx;
									}
								}
							}
						}

						&:not(:first-child) {
							margin-top: 20rpx;
						}
					}
				}
			}

		}
	}
</style>