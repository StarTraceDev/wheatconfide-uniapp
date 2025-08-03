<template>
	<view class="auth-box">
		<view class="children-component">
			<scroll-view scroll-y="true" :show-scrollbar="false" class="scroll-content">
				<view class="children-content">
					<view class="top-bg"></view>
					<view class="current-component">
						<view class="step-box">
							<view class="step-content">
								<view class="step-item" :class="step==1?'step-item-active':''">
									<view class="step-num">1</view>
									<view class="step-txt">基本信息</view>
								</view>
								<view class="step-line"></view>
								<view class="step-item" :class="step==2?'step-item-active':''">
									<view class="step-num">2</view>
									<view class="step-txt">职业信息</view>
								</view>
								<view class="step-line"></view>
								<view class="step-item" :class="step==3?'step-item-active':''">
									<view class="step-num">3</view>
									<view class="step-txt">证书资料</view>
								</view>
							</view>
						</view>
						<view class="handler-components-box">
							<idCard v-show="step==1"></idCard>
							<career v-show="step==2"></career>
							<certificate v-show="step==3"></certificate>
							
							<view class="footer">
								<view class="tip">
									<image src="/static/auth/tip.svg" class="img"></image>个人信息安全保障中
								</view>
								<view class="btn" v-if="step==1">
									<view class="next" @click="nextStepHandler">填好了，下一步</view>
								</view>
							
								<view class="btn step-2" v-if="step==2">
									<view class="next prev" @click="prevStepHandler">上一步</view>
									<view class="next" @click="nextStepHandler">填好了，下一步</view>
								</view>
							
								<view class="btn step-2" v-if="step==3">
									<view class="next prev" @click="prevStepHandler">上一步</view>
									<view class="next" @click="examineHandler">提交审核</view>
								</view>
							</view>
							<!-- <component :is="currentComponent" :key="currentComponent"></component> -->
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
	</view>
</template>
<script setup>
	import {
		ref,
		defineAsyncComponent,
		watch,
		onMounted
	} from 'vue';
	import {
		useGlobalDataStore
	} from '@/stores/global.js';
	
	import {
		getConsultantById
	} from "@/common/api/consultant.js";
	
	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
	import idCard from './components/idCard.vue';
	import career from './components/career.vue';
	import certificate from './components/certificate.vue';
	import { constant } from 'lodash-es';
	const currentComponent = ref(idCard);

	const step = ref(1);
	const popup = ref(null);

	const consultantInfo = ref({
		name: '',
		idNum: ''
	});

	const nextStepHandler = () => {
		step.value = step.value + 1;
	}

	const prevStepHandler = () => {
		step.value = step.value - 1;
	}

	watch(step, (newVal, oldVal) => {
		console.log(newVal);
		if (newVal == 1) {
			currentComponent.value = idCard;
		} else if (newVal == 2) {
			currentComponent.value = career;
		} else if (newVal == 3) {
			currentComponent.value = certificate;
		}
	})

	const examineHandler = () => {
		console.log(consultantInfo.value)
		
		// let res = await saveConsultant(consultantInfo.value)
		
		uni.showToast({
		    title: '发布成功',
		    icon: 'none', // 可选值 'success', 'loading', 'none'
		    duration: 2000 // 持续时长，单位ms
		});
		console.log(res)
	}
</script>

<style lang="scss" scoped>
	$statusBarHeight: v-bind(statusBarHeight);

	.auth-box {
		background: #f4f6f8;
		min-height: 100%;
		height: auto;
		position: relative;

		.children-component {
			height: calc(100vh - 88rpx);
			//	#ifdef APP-PLUS
			height: calc(100vh);
			//	#endif

			.scroll-content {
				width: 750rpx;
				height: 100%;

				.children-content {
					position: relative;
					height: auto;

					.top-bg {
						width: 750rpx;
						height: 546rpx;
						background: linear-gradient(180deg, #E3FFF5 2%, #F4F6F8 100%);
						position: absolute;
						top: 0rpx;
						z-index: 1;
					}

					.current-component {
						padding-top: 24rpx;
						position: relative;
						z-index: 2;
						height: 100%;
						padding-bottom: 220rpx;

						.step-box {
							width: 750rpx;
							height: 96rpx;
							display: flex;
							justify-content: center;

							.step-content {
								width: 622rpx;
								display: flex;
								justify-content: space-between;

								.step-item {
									display: flex;
									justify-content: center;
									align-items: center;
									flex-direction: column;
									position: relative;

									.step-num {
										width: 40rpx;
										height: 40rpx;
										background: #78A494;
										line-height: 40rpx;
										text-align: center;
										font-size: 24rpx;
										color: #fff;
										border-radius: 40rpx;
									}

									.step-txt {
										font-size: 24rpx;
										color: #78A494;
										margin-top: 12rpx;
									}
								}

								.step-item-active {
									.step-num {
										background: #35CA95;
									}

									.step-txt {
										color: #073D2A;
									}
								}

								.step-line {
									width: 130rpx;
									height: 8rpx;
									border-radius: 4rpx;
									background: #B5F4DE;
									margin-top: 20rpx;
								}
							}

						}

						.handler-components-box {
							margin-top: 38rpx;
						}
					}
				}
			}
		}

		.footer {
			width: 750rpx;
			height: 220rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			background: #F4F6F8;
			position: fixed;
			bottom: 0rpx;
			z-index: 0;

			.tip {
				font-size: 24rpx;
				font-weight: normal;
				letter-spacing: normal;
				display: flex;
				align-items: center;
				color: #98A7A2;

				.img {
					width: 28rpx;
					height: 28rpx;
				}
			}

			.btn {
				width: 686rpx;
				height: 88rpx;
				margin-top: 28rpx;
				display: flex;
				justify-content: space-between;

				.next {
					width: 100%;
					height: 100%;
					border-radius: 60rpx;
					background: #35CA95;
					color: #fff;
					font-size: 30rpx;
					font-weight: 500;
					text-align: center;
					line-height: 88rpx;
				}
			}

			.step-2 {
				.next {
					width: 330rpx;
				}

				.prev {
					background: #101922;
				}

			}

		}
	}
</style>