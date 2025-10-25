<template>
	<view class="id-card-box">
		<view class="id-card-content-box">
			<view class="id-card-content">
				<view class="title">身份认证</view>
				<view class="remark">仅用于身份实名核验，信息会严格保密</view>
				<view class="unload-card-box">
					<view class="upload-card-item" @click="uploadPhoto(1)">
						<image :src="localData.idcardFront==null?'/static/auth/id-card-front.png':localData.idcardFront"
							class="img"></image>
						<view class="txt">身份证人像面</view>
					</view>
					<view class="upload-card-item" @click="uploadPhoto(2)">
						<image
							:src="localData.idcardBackend==null?'/static/auth/id-card-back.png':localData.idcardBackend"
							class="img">
						</image>
						<view class="txt">身份证国徽面</view>
					</view>
				</view>
				<view class="id-card-form-content">
					<view class="form-item">
						<view class="label require">姓名</view>
						<view class="content">
							<input type="text" style="font-size: 28rpx;" v-model="localData.consultantName"
								placeholder="请输入姓名" />
						</view>
					</view>
					<view class="form-item">
						<view class="label require">身份证号</view>
						<view class="content">
							<input type="text" v-model="localData.idcardNum" style="font-size: 28rpx;"
								placeholder="请输入身份证号" />
						</view>
					</view>
					<!-- <view class="form-item">
						<view class="label require">职业</view>
						<view class="content" :class="!value?'weight':''" @click="openPopupHandler">
							{{profession}}<uni-icons type="right" size="14" color="rgba(0, 0, 0, 0.3)"></uni-icons>
						</view>
					</view> -->
					<view class="form-item">
						<view class="label require">星座</view>
						<picker :range="stars" @change="starChange">
							<view class="content" :class="!value?'weight':''">
								{{localData.constellation==null?'请选择':localData.constellation}}<uni-icons type="right"
									size="14" color="rgba(0, 0, 0, 0.3)"></uni-icons>
							</view>
						</picker>
					</view>
					<view class="form-item">
						<view class="label require">所在地区</view>

						<view class="content" :class="!value?'weight':''" @click="openCityHandler">
							{{localData.address}}<uni-icons type="right" size="14"
								color="rgba(0, 0, 0, 0.3)"></uni-icons>
						</view>
					</view>
					<!-- <view class="form-item" @click="serviceShow = true">
						<view class="label require">服务类型</view>
						 <picker :range="serviceType" @change="serviceTypeChange">
							<view class="content weight">{{service}}<uni-icons type="right"
									size="14" color="rgba(0, 0, 0, 0.3)"></uni-icons></view>
						</picker> 
						<view @click="">{{services}}<uni-icons type="right" size="14" 
								 color="rgba(0, 0, 0, 0.3)"></uni-icons></view> 
						 <u-picker mode="selector" v-model="serviceShow" :range="serviceType" :default-selector="[0]" :range-key="'name'"></u-picker> 
					</view> -->
					<view class="form-item user-sign">
						<view class="label">个人签名</view>
						<view class="content-input" style="width: 400rpx;">
							<uni-easyinput trim="all" type="text" placeholder="请输入个人签名" :inputBorder="false"
								:clearable="false" v-model="localData.signature" :style="{'text-align':'right'}">
							</uni-easyinput>
						</view>
					</view>
					<view class="form-item user-introduction">
						<view class="label">个人简介</view>
						<view class="introduction-content">
							<uni-easyinput type="textarea" placeholder="请输入个人简介" v-model="localData.profile"
								:inputBorder="false" :clearable="false"
								:styles="{'background-color':'#f6f6f6'}"></uni-easyinput>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- <u-popup v-model="serviceShow" mode="bottom">
			<view style="padding: 30rpx;">
				<view class="title">请选择服务类型</view>
				<u-checkbox-group @change="serviceTypeChange">
					<view v-for="(item,index) in serviceType" :key="index" style="height: 60rpx;margin-left: 30rpx;">
						<u-checkbox v-model="item.checked" :name="item.id">{{item.name}}</u-checkbox>
					</view>
				</u-checkbox-group>
				<view style="display: flex;flex-direction: row;">
					<u-button size="medium" type="primary" plain @click="chooseServiceType">确定</u-button>
					<u-button size="medium" @click="serviceShow=false">取消</u-button>
				</view>
			</view>
		</u-popup> -->

		<uni-popup ref="popup" type="bottom" border-radius="24rpx 24rpx 0 0" class="career-popup">
			<view class="career-popup-box">
				<view class="career-popup-header">
					<view></view>
					<view class="title">选择职业</view>
					<view @click="closeCareerHandler">
						<uni-icons type="closeempty" size="14" color="rgba(0,0,0,0.3)"></uni-icons>
					</view>
				</view>
				<view class="career-popup-content-list">
					<view class="career-popup-content-item" v-for="i in 20" @click="selectPosition(i)" :key="i">
						心理咨询师{{i}}</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref,
		computed,
		defineProps
	} from 'vue';
	import cityJson from "@/static/city-json/city-list.js"
	import {
		uploadFile
	} from '@/utils/common';
	import {
		onShow,
		onUnload
	} from '@dcloudio/uni-app'
	import {
		registerConsultantStep1
	} from '@/common/api/consultant.js'

	import {
		registerListenerStep1
	} from '@/common/api/listener.js'
	const cityList = ref(cityJson);
	const idNum = ref('');
	const popup = ref(null);
	const cityPopup = ref(null);
	const profession = ref('请选择');
	const address = ref('请选择')
	const frontPhoto = ref(null)
	const backendPhoto = ref(null)
	const services = ref('请选择')
	const stars = ref(['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'])
	const openPopupHandler = () => {
		popup.value.open();
	}


	const serviceShow = ref(false)

	const serviceType = ref([])
	// const constellation = ref('请选择')
	const emit = defineEmits(['update:modelValue', 'committed']);
	const starChange = (e) => {
		localData.value.constellation = stars.value[e.detail.value]
		// console.log(e);
	}

	const chooseServiceType = () => {

	}

	const serviceTypeChange = (e) => {
		console.log(e);
		console.log(e.length);
		// service.value = serviceType.value[e.detail.value]
	}

	const props = defineProps({
		consultantType: String,
		modelValue: Object
	})
	const selectPosition = (i) => {
		profession.value = '心理咨询师' + i
		popup.value.close()
	}

	const submit = async () => {
		console.log("子组件收到父组件调用，");
		if (localData.value.idcardFront == null) {
			uni.showToast({
				title: "请上传身份证人像页",
				icon: 'none'
			})
			return
		}
		if (localData.value.idcardBackend == null) {
			uni.showToast({
				title: "请上传身份证国徽页",
				icon: 'error'
			})
			return
		}
		if (localData.value.consultantName == null) {
			uni.showToast({
				title: "请输入姓名",
				icon: 'error'
			})
			return
		}
		if (localData.value.idcardNum == null) {
			uni.showToast({
				title: "请输入身份证号",
				icon: 'error'
			})
			return
		}
		// if (!localData.value.idcardFront.startsWith('http')) {

		// }
		// if (!localData.value.idcardBackend.startsWith('http')) {
		// 	console.log(localData.value.idcardBackend);

		// }
		localData.value.consultantType = props.consultantType

		uni.showLoading({
			title: "提交中"
		})
		if (props.consultantType == 1) {
			let res = await registerConsultantStep1(localData.value)
			uni.hideLoading()
			// console.log(res);
			localData.value = res.data
			emit("committed", "")
		} else {
			let res = await registerListenerStep1(localData.value)
			uni.hideLoading()
			console.log(res);
			localData.value = res.data
			emit("committed", "")
		}
	}

	defineExpose({
		submit
	})

	const areaChange = (e) => {
		console.log(e);
	}
	const openCityHandler = () => {
		uni.navigateTo({
			url: "/pages/auth/cityChoose"
		})
	}

	onShow(() => {
		const city = uni.getStorageSync("verifyAddress")
		// console.log(city);
		if (city) {
			localData.value.address = city
		}
		if (props.consultantType == 1) { //是咨询师认证
			serviceType.value = JSON.parse(uni.getStorageSync("consultantMenu"))
		} else { //倾听师认证
			serviceType.value = JSON.parse(uni.getStorageSync("listenerMenu"))
		}
	})

	onUnload(() => {
		uni.removeStorageSync("verifyAddress")
	})

	const setAddress = (addr) => {
		console.log(addr);
		// address.value = addr
	}

	const closeCareerHandler = () => {
		popup.value.close();
	}
	const closeCityPopupHandler = () => {
		cityPopup.value.close();
	}

	const cityClick = () => {

	}

	const uploadPhoto = (type) => {
		uni.chooseImage({
			count: 1,
			success: async function(res) {
				if (type == 1) {
					let frontUrl = await uploadFile('/api/common/upload', res.tempFilePaths[0])
					// console.log(frontUrl);
					if (frontUrl.code == 0) {
						localData.value.idcardFront = frontUrl.data.url
					}
					// localData.value.idcardFront = res.tempFilePaths[0];
				} else {
					let backUrl = await uploadFile('/api/common/upload', res.tempFilePaths[0])
					if (backUrl.code == 0) {
						localData.value.idcardBackend = backUrl.data.url
					}
					// localData.value.idcardBackend = res.tempFilePaths[0];
				}
			}
		})
	}

	// const props = defineProps({

	// });



	const localData = computed({
		get: () => props.modelValue,
		set: (value) => emit('update:modelValue', value)
	});
</script>

<style scoped lang="scss">
	.id-card-box {
		width: 750rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		.id-card-content-box {
			width: 686rpx;
			height: 1444rpx;
			background: #fff;
			border-radius: 20rpx;
			display: flex;
			justify-content: center;

			.id-card-content {
				width: 630rpx;
			}

			.title {
				font-size: 36rpx;
				font-weight: 500;
				letter-spacing: normal;
				color: #212528;
				margin-top: 36rpx;
			}

			.remark {
				font-size: 26rpx;
				letter-spacing: normal;
				color: rgba(0, 0, 0, 0.5);
				margin-top: 12rpx;
			}

			.unload-card-box {
				display: flex;
				justify-content: space-between;
				margin-top: 26rpx;

				.upload-card-item {
					width: 296rpx;
					height: 268rpx;
					border-radius: 10rpx;
					background: #F5F5F5;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;

					.img {
						width: 192rpx;
						height: 132rpx;
					}

					.txt {
						font-size: 24rpx;
						font-weight: normal;
						letter-spacing: normal;
						color: rgba(0, 0, 0, 0.6);
						margin-top: 40rpx;
					}
				}
			}

			.id-card-form-content {
				margin-top: 54rpx;

				.form-item {
					display: flex;
					justify-content: space-between;
					align-items: start;
					margin-top: 52rpx;

					.label {
						position: relative;
						font-size: 28rpx;
						color: rgba(0, 0, 0, 0.85)
					}

					.require {
						&::after {
							content: '*';
							color: #FA5151;
							position: absolute;
							right: -20rpx;
						}
					}

					.content {
						font-size: 28rpx;
						text-align: right;
						letter-spacing: normal;
						color: rgba(0, 0, 0, 0.35);

						.textarea {}
					}

					.weight {
						color: rgba(0, 0, 0, 0.65);
					}
				}

				.user-sign {
					align-items: center;
					margin-top: 42rpx;

					.content-input {
						::v-deep .uni-input-input {
							color: rgba(0, 0, 0, 0.35);
							text-align: right !important;

						}
					}
				}

				.user-introduction {
					flex-direction: column;

					.introduction-content {
						width: 630rpx;
						height: 190rpx;
						margin-top: 24rpx;

						::v-deep .uni-easyinput__content-textarea {
							padding: 0rpx 12rpx !important;
						}

						.uni-easyinput {
							background-color: #f6f6f6;
							color: rgba(0, 0, 0, 0.35);
						}
					}
				}

			}
		}

		::v-deep .career-popup {
			z-index: 99999999 !important;
		}

		.career-popup-box,
		.city-popup {
			width: 750rpx;
			height: 578rpx;
			background: #fff;
			border-radius: 24rpx 24rpx 0rpx 0rpx;


			.career-popup-header,
			.city-popup-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 88rpx;
				padding-right: 36rpx;

				.title {
					font-size: 32rpx;
					font-weight: 500;
					line-height: normal;
					color: #000000;
				}
			}

			.career-popup-content-list,
			.city-popup-content-list {
				padding: 0rpx 36rpx;
				height: 490rpx;
				overflow-y: scroll;

				.career-popup-content-item {
					color: rgba(0, 0, 0, 0.6);
					font-size: 28rpx;
					flex-shrink: 0;
					line-height: 64rpx;
					margin-top: 32rpx;
				}

				&::after {
					content: '';
					flex: auto;
					/* 或者flex: 1 */
				}
			}
		}
	}
</style>