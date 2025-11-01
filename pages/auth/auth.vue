<template>
	<view class="auth-box">
		<view class="children-component">
			<scroll-view scroll-y="true" v-if="certificate.verifyStatus==null || certificate.verifyStatus==0"
				:show-scrollbar="false" class="scroll-content">
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
							<idCard v-show="step == 1" :modelValue="consultant" :consultantType="consultantType"
								@committed="step1Commit" ref="idCardRef" v-model="formData.idCard"></idCard>
							<career v-show="step==2" ref="careerRef" :modelValue="consultant"
								:consultantType="consultantType" @committed="setp2Commit"></career>
							<certificate v-show="step==3" @commited="finalCommit" :modelValue="consultant"
								:consultantType="consultantType" ref="finalStep"></certificate>

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
			<view v-else-if="consultant.verifyStatus==1"> -->
				<!--认证审核中-->
				<!--图标-->
				<view>
					<u-icon name="info-circle-fill"></u-icon>
				</view>
				<view><text>认证审核中，请稍后查看</text></view>
				<view><text @click="recheck" style="color: red;">重新审核</text></view>
			</view>
			<view v-else-if="consultant.verifyStatus==2">
				<!--审核通过-->
				<view><text>您已认证成为心理咨询师</text></view>
			</view>
			<view v-else>
				<view><text>您的资料未通过审核~</text></view>
			</view>
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
		onLoad
	} from '@dcloudio/uni-app'

	import {
		getConsultantById,
		getConsultantByUserId,
		saveConsultant,
		registerConsultantStep2
	} from "@/common/api/consultant.js";

	import {
		getListenerById,
		getListenerByUserId,
		saveListener,
		registerListenerStep2
	} from "@/common/api/listener.js";

	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
	import idCard from './components/idCard.vue';
	import career from './components/career.vue';
	import certificate from './components/certificate.vue';
	import {
		constant
	} from 'lodash-es';
	const currentComponent = ref(idCard);

	const step = ref(1);
	const popup = ref(null);
	const consultant = ref({})

	const type = ref(0)

	const idCardRef = ref(null)
	const careerRef = ref(null)
	const finalStep = ref(null)
	const consultantType = ref('')
	onLoad((e) => {
		console.log(e);
		consultantType.value = e.type
		if (e.type == 1) {
			uni.setNavigationBarTitle({
				title: "咨询师认证"
			})
		} else {
			uni.setNavigationBarTitle({
				title: "倾听师认证"
			})
		}
		getConsultantDetail()
	})

	const getConsultantDetail = () => {
		if (consultantType.value == 1) {
			getConsultantByUserId({
				consultantType: consultantType.value
			}).then(res => {
				console.log(res);
				consultant.value = res.data
			})
		}else{
			getListenerByUserId({
				consultantType:1
			}).then(res=>{
				consultant.value = res.data
			})
		}
	}

	// 集中管理表单数据
	const formData = ref({
		idCard: {
			consultantName: '',
			idNum: '',
			// 其他身份证信息字段
		},
		career: {
			profession: '',
			experience: '',
			// 其他职业信息字段
		},
		certificate: {
			files: [],
			// 其他证书字段
		}
	});

	const nextStepHandler = () => {
		if (step.value == 1) {
			idCardRef.value?.submit()
		}
		if (step.value == 2) {
			careerRef.value?.submit()

			// if (consultantType.value == 1) {
			// 	consultant.value.consultantType = consultantType.value
			// 	console.log(consultant);
			// 	registerConsultantStep2(consultant.value).then(res => {
			// 		// console.log(res);
			// 		step.value = step.value + 1
			// 	})
			// }else{

			// }
			// step.value = step.value+1
		}

	}

	const step1Commit = () => {
		step.value = step.value + 1;
	}

	const setp2Commit = () => {
		step.value = step.value + 1;
	}

	const finalCommit = () => {
		uni.showToast({
			title: "资料已提交，请等待审核"
		})
		uni.navigateBack()
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
			finalStep.value?.refreshData()
			currentComponent.value = certificate;
		}
	})

	const examineHandler = async () => {
		const submitData = {
			...formData.value.idCard,
			...formData.value.career,
			certificates: formData.value.certificate.files
		};

		console.log(submitData);
		// let res = await saveConsultant(submitData);
		finalStep.value?.submit()

		// uni.showToast({
		// 	title: '发布成功',
		// 	icon: 'none', // 可选值 'success', 'loading', 'none'
		// 	duration: 2000 // 持续时长，单位ms
		// });
		// console.log(res)
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