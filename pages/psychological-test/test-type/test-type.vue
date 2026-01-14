<template>
	<view class="psychological-box">
		<view class="psychological-header">
			<view class="header-nav-bar">
				<view class="header-left">
					<uni-icons type="left" size="24" @click="backFn"></uni-icons>
				</view>
				<view class="header-title">
					<uni-search-bar class="uni-mt-10" @input="input" @clear="reset" radius="90" placeholder="请输入搜索内容" clearButton="auto"
						cancelButton="none" @confirm="searchHandler" />
				</view>
				<view class="header-right" @click="myOrderHandler">
					<image src="/static/psychological-test/logo.svg" class="logo-svg"></image>
					<text class="txt">我的测评</text>
				</view>
			</view>
		</view>

		<view class="tab-list-box">
			<view class="tab-list-content">
				<view class="tab-item" v-for="(item,index) in tabsList" :key="item.id" @click="tabHandler(item)"
					:class="tabActive==item.id?'active':''">
					{{item.label}}
				</view>
			</view>
			<!-- <view class="sort-box">综合排序<uni-icons type="down" size="14" color="#999999"></uni-icons></view> -->
		</view>


		<view class="choose-topic-content">
			<view class="tag-content">
				<view class="tag-left">
					<scroll-view scroll-y="true" class="scroll-content" :show-scrollbar="false">
						<view class="tag-item" v-for="(item,index) in types" :key="index"
							:class="typeActive==index?'active':''" @click="changeTabHandler(index)">
							{{item}}
						</view>
					</scroll-view>
				</view>
				<view class="tag-right">
					<scroll-view scroll-y="true" class="scroll-content" :show-scrollbar="false">
						<view class="tag-right-content">
							<view class="content-item" v-for="(item,index) in exams" :key="index" @click="openTestHandler(item)">
								<view class="content-item-content">
									<view class="content-txt">
										<view class="title">{{item.title}}</view>
										<view class="remark">{{item.oneWord}}</view>
										<view class="price-box">
											<view v-if="item.payType==1">
												<text class="price">￥{{item.discountPrice}}</text><text class="under-price">￥{{item.price}}</text>
											</view>
											<view v-else>
												<text class="price">免费</text>
											</view>
											<view class="use-test">
												<text class="use-num">{{item.examNum}}</text>人已测
											</view>
										</view>
									</view>
									<view class="img-box">
										<image :src="item.icon?item.icon:'@/static/consult/user.png'" class="img"></image>
									</view>
								</view>

							</view>
						</view>

					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';
	import {
		useGlobalDataStore
	} from '@/stores/global.js';

	import {
		onLoad,
		onReachBottom
	} from '@dcloudio/uni-app'
	
	import {examListByTypes} from '@/common/api/exam.js'
	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');

	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	
	const hasMore = ref(false)
	
	const page = ref(1)
	const payType = ref(-1)
	const count = ref(12)


	const types = ref(['情感', '性格', '健康', '家庭', '人际', '职业'])
	const searchHandler = () => {
		getExamListByType()
	}
	
	const reset = ()=>{
		getExamListByType()
	}
	const myOrderHandler = () => {
		uni.navigateTo({
			url: "/pages/psychological-test/order/order"
		})
	}

	const tabActive = ref(1);
	const exams = ref([])

	onLoad((e) => {
		let type = e.type
		if (type) {
			const index = types.value.findIndex(e => e == type)
			typeActive.value = index
		}
		getExamListByType()
	})
	
	onReachBottom(()=>{
		if(hasMore){
			page.value++
			getExamListByType()
		}
	})
	const searchContent = ref('')

	const input = (e)=>{
		console.log(e);
		searchContent.value = e
	}
	const total = ref(0)
	
	const getExamListByType = async ()=>{
		let resp = await examListByTypes({type:types.value[typeActive.value],page:page.value,count:count.value,payType:payType.value,keyword:searchContent.value})
		console.log(resp);
		total.value = resp.data.total
		exams.value = resp.data.records
		if(exams.value.length>=total.value){
			hasMore.value = false
		}else{
			hasMore.value = true
		}
	}
	const tabsList = ref([{
		id: 1,
		label: "全部"
	}, {
		id: 2,
		label: "付费"
	}, {
		id: 3,
		label: "免费"
	}]);
	
	
	const tabHandler = (item) => {
		item.id != tabActive.value ? tabActive.value = item.id : ''
		if(item.id==1){
			payType.value = -1
		}else if(item.id==2){
			payType.value = 1
		}else{
			payType.value = 0
		}
		getExamListByType()
	}

	const openTestHandler = (i) => {
		let url = `/pages/psychological-test/charge-test/charge-test?id=${i.id}` //i % 2 == '0' ? '/pages/psychological-test/free-test/free-test' :
			
		uni.navigateTo({
			url
		})
	}

	const typeActive = ref(0);

	const changeTabHandler = (item) => {
		typeActive.value != item ? typeActive.value = item : ''
		page.value = 1
		getExamListByType()
	}
</script>

<style lang="scss" scoped>
	.psychological-box {
		$statusBarHeight: v-bind(statusBarHeight);
		height: 100vh;
		background-color: #f4f6f8;

		.psychological-header {
			position: relative;
			overflow: hidden;

			.header-nav-bar {
				display: flex;
				height: 88rpx;
				align-items: center;
				padding-top: $statusBarHeight;
				position: fixed;
				width: 750rpx;
				z-index: 99;
				justify-content: space-between;

				.header-left {
					font-size: 32rpx;
					font-weight: 600;
					color: #000000;
					display: flex;
					align-items: center;
					padding-left: 24rpx;
				}

				.header-title {
					width: 520rpx;
					height: 72rpx;

					.uni-searchbar {
						padding: 0;

						::v-deep .uni-searchbar__box {
							background: #fff !important;
						}

					}
				}

				.header-right {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 115rpx;
					font-size: 18rpx;
					color: rgba(0, 0, 0, 0.85);

					.logo-svg {
						width: 40rpx;
						height: 40rpx;
					}
				}
			}
		}

		.tab-list-box {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: calc($statusBarHeight + 88rpx) 40rpx 0rpx 40rpx;

			.tab-list-content {
				display: flex;
				align-items: center;
				height: 88rpx;

				.tab-item {
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 32rpx;
					color: rgba(0, 0, 0, 0.65);
					position: relative;
					margin-right: 40rpx;
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

			.sort-box {
				font-size: 28rpx;
				color: rgba(0, 0, 0, 0.65);
			}
		}

		.choose-topic-content {
			margin-top: 32rpx;

			.tag-content {
				height: calc(100vh - $statusBarHeight - 208rpx);
				background: #fff;
				display: flex;

				.tag-left,
				.tag-right {
					height: 100%;
					flex-shrink: 0;

					.scroll-content {
						height: 100%;
					}
				}

				.tag-left {
					width: 160rpx;
					background: #F4F6F8;

					.tag-item {
						width: 100%;
						height: 120rpx;
						display: flex;
						align-items: center;
						color: rgba(0, 0, 0, 0.5);
						justify-content: center;
						font-size: 26rpx;
					}

					.active {
						background: #fff;
						color: rgba(0, 0, 0, 0.85);
						font-weight: 500;
						position: relative;

						&::before {
							content: "";
							width: 6rpx;
							height: 40rpx;
							background: #38CC98;
							position: absolute;
							left: 0rpx;

						}
					}
				}

				.tag-right {
					width: 590rpx;

					.content-item {
						width: 100%;

						background: #fff;

						.content-item-content {
							padding: 16rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;
							height: 192rpx;
							border-bottom: 2rpx solid rgba(0, 0, 0, 0.04);

							.content-txt {
								width: 360rpx;
							}
						}

						.title {
							font-size: 32rpx;
							color: rgba(0, 0, 0, 0.85);
							font-weight: 500;
						}

						.remark {
							font-size: 24rpx;
							color: rgba(0, 0, 0, 0.35);
						}

						.price-box {
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin-top: 42rpx;

							.price {
								color: #FA5151;
								font-size: 24rpx;
							}

							.under-price {
								font-size: 24rpx;
								color: #D9D9D9;
								text-decoration: line-through;
							}

							.use-test {
								font-size: 22rpx;
								color: rgba(0, 0, 0, 0.5)
							}

							.use-num {
								color: rgba(0, 0, 0, 0.85)
							}
						}


						.img {
							width: 160rpx;
							height: 160rpx;
							border-radius: 16rpx;
						}
					}

					.active {
						// background-color: #35CA95;
						// color: #fff;
					}
				}
			}
		}
	}
</style>