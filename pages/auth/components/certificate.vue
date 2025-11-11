<template>
	<view class="certificate-box">
		<view class="certificate-content-box">
			<view class="certificate-content">
				<view class="title">
					<view>
						我的资质<text class="require">(必填)</text>
					</view>
					<view class="tips">
						<image src="/static/auth/remark.png" class="img"></image>说明
					</view>
				</view>
				<view class="remark">此项信息正式上线后会公开展示在个人资料</view>
				<view class="id-card-form-box">
					<view class="id-card-form-content" v-for="(item,index) in certificateLists" :key="index">
						<view class="form-item">
							<view class="label require">证书名称</view>
							<view class="content" :class="!value?'weight':''">
								<uni-easyinput trim="all" type="text" placeholder="请输入证书名称" :inputBorder="false"
									:clearable="false" style="text-align: end;" v-model="item.name">
								</uni-easyinput>
							</view>
						</view>
						<view class="form-item">
							<view class="label require">发证机构</view>
							<view class="content" :class="!value?'weight':''">
								<uni-easyinput trim="all" type="text" placeholder="请输入发证机构" :inputBorder="false"
									:clearable="false" style="text-align: end;" v-model="item.authority">
								</uni-easyinput>
							</view>
						</view>
						<view class="form-item user-sign">
							<view class="label require">证书编号</view>
							<view class="content-input" style="width: 400rpx;">
								<uni-easyinput trim="all" type="text" placeholder="请输入证书编号" :inputBorder="false"
									:clearable="false" v-model="item.number" style="text-align: end;">
								</uni-easyinput>
							</view>
						</view>
						<view class="form-item ">
							<view class="label require">发证日期</view>
							<view class="content">
								<view @click="showCertificateTimePicker"><text style="font-size: 24rpx;">{{item.date?item.date:'请选择'}}<u-icon name="arrow-right"></u-icon></text></view>
								
								<!-- <uni-datetime-picker @change="certificateDateChange($event,item,index)" type="date"
									:clear-icon="false" v-model="item.date"
									@maskClick="maskClick">{{item.date==''?'请选择':item.date}}<uni-icons type="right"
										size="14" color="rgba(0, 0, 0, 0.3)"></uni-icons></uni-datetime-picker> -->
							</view>
						</view>
						<u-picker mode="time" v-model="certificatePickerShow" @confirm="confirmCertificateDate(item,$event)" :params="certificateDateParam"></u-picker>
						<view class="form-item user-introduction">
							<view class="label require">证件照片</view>
							<view class="introduction-content">
								<u-upload :fileList="item.photoList" :before-upload="beforeUpload" :header="headers"
									@on-success="(data, i, lists, name) => uploadComplete(data, i, lists, name, index)"
									@on-remove="(event, i, lists, name) => deletePic(event, i, lists, name, index)" name="file" :action="uploadUrl" multiple
									:maxCount="3"></u-upload>
							</view>
						</view>


						<view class="line-box">
							<view class="line" :class="index>0?'line-delete':''"></view>
							<view v-if="index>0" class="delete-item" @click="removeCertificateListHandler(index)">
								<uni-icons type="minus-filled" size="30" color="#FA5151"></uni-icons>
								移除
							</view>
						</view>

					</view>
					<view class="add-certificate-btn" @click="addCertificateListHandler">
						<view class="btn"><uni-icons type="plus-filled" size="18"
								color="rgba(0,0,0,.85)"></uni-icons>增加一项</view>
					</view>
				</view>
			</view>
			<!-- <view class="certificate-content">
				<view class="title">
					<view>
						经历信息<text class="require">(选填)</text>
					</view>
					<view class="tips">
						<image src="/static/auth/remark.png" class="img"></image>说明
					</view>
				</view>
				<view class="remark">此项信息正式上线后会公开展示在个人资料</view>
				<view class="id-card-form-box">
					<view class="id-card-form-content" v-for="(item,index) in certificateLists" :key="index">
						<view class="form-item">
							<view class="label require">类别</view>
							<picker :range="certificates" @change="changeCertificate($event,index)">
								<view class="content" :class="!value?'weight':''">
									{{item.type==null?'请选择':item.type}}<uni-icons type="right" size="14"
										color="rgba(0, 0, 0, 0.3)"></uni-icons>
								</view>
							</picker>
						</view>
						<view class="form-item">
							<view class="label require">时间</view>
							<view class="content" :class="!value?'weight':''">
								<uni-datetime-picker @change="certificateDateChange($event,item,index)" type="date"
									:clear-icon="false" v-model="item.date"
									@maskClick="maskClick">{{item.date==null?'请选择':item.date}}<uni-icons type="right"
										size="14" color="rgba(0, 0, 0, 0.3)"></uni-icons></uni-datetime-picker>
							</view>
						</view>
						<view class="form-item user-sign">
							<view class="label require">证书编号</view>
							<view class="content-input" style="width: 400rpx;">
								<uni-easyinput trim="all" type="text" placeholder="请输入证书编号" :inputBorder="false"
									:clearable="false" v-model="item.number" :placeholderStyle="{'text-align':'right'}">
								</uni-easyinput>
							</view>
						</view>
						<view class="form-item user-sign">
							<view class="label require">内容</view>
							<view class="content-input" style="width: 400rpx;">
								<uni-easyinput trim="all" type="text" placeholder="请输入证书编号" :inputBorder="false"
									:clearable="false" v-model="item.content" :placeholderStyle="{'text-align':'right'}">
								</uni-easyinput>
							</view>
						</view>
						<!-- <view class="form-item user-introduction">
							<view class="label require">证件照片</view>
							<view class="introduction-content">
								<view class="img-list">

									<view class="img-item" v-for="(pic,i) in item.imgUrl" :key="i">
										<image :src="pic" class="img"></image>
										<view class="delete-item-img" @click="deletePic(item,i)">
											删除({{i}})
										</view>
									</view>
								</view>
								<view class="upload-image" v-if="item.imgUrl.length<3" @click="uploadPics(item)">
									<view class="icon">
										<uni-icons type="plusempty" size="30" color="rgba(0,0,0,.3)"></uni-icons>
									</view>
									<view class="txt">最多三张</view>
								</view>
							</view>
						</view> 
			<view class="line-box">
							<view class="line" :class="index>0?'line-delete':''"></view>
							<view v-if="index>0" class="delete-item" @click="removeCertificateListHandler(index)">
								<uni-icons type="minus-filled" size="30" color="#FA5151"></uni-icons>
								移除
							</view>
						</view>

					</view>
					<view class="add-certificate-btn" @click="addCertificateListHandler">
						<view class="btn"><uni-icons type="plus-filled" size="18"
								color="rgba(0,0,0,.85)"></uni-icons>增加一项</view>
					</view>
				</view>
			</view> -->


			<view class="certificate-content">
				<view class="title">
					<view>
						学历信息<text class="require">(选填)</text>
					</view>
					<view class="tips">
						<image src="/static/auth/remark.png" class="img"></image>说明
					</view>
				</view>
				<view class="remark">此项信息正式上线后会公开展示在个人资料</view>
				<view class="id-card-form-box">
					<view class="id-card-form-content" v-for="(item,index) in educationLists" :key="index">
						<view class="form-item">
							<view class="label">起始时间</view>
							<view class="content"  @click="showTimePicker(item,index,1)">
								{{item.startTime==null?"请选择":item.startTime}}<uni-icons type="right" size="14"
									color="rgba(0, 0, 0, 0.3)"></uni-icons>
							</view>
						</view>
						<view class="form-item">
							<view class="label">截止时间</view>
							<view class="content"  @click="showTimePicker(item,index,2)">
								{{item.endTime==null?'请选择':item.endTime}}<uni-icons type="right" size="14"
									color="rgba(0, 0, 0, 0.3)"></uni-icons>
							</view>
						</view>
						<u-picker mode="time" v-model="timePickerShow" @confirm="confirmSchoolTime(item,$event)"
							:params="timePickerParams"></u-picker>

						<view class="form-item user-sign">
							<view class="label">毕业院校</view>
							<view class="content-input" style="width: 400rpx;">
								<uni-easyinput trim="all" type="text" placeholder="请输入毕业院校" v-model="item.schoolName"
									:inputBorder="false" :clearable="false">
								</uni-easyinput>
							</view>
						</view>

						<view class="form-item user-sign">
							<view class="label">证书编号</view>
							<view class="content-input" style="width: 400rpx;">
								<uni-easyinput trim="all" style="text-align: end;" type="text" placeholder="请输入证书编号" v-model="item.number"
									:inputBorder="false" :clearable="false">
								</uni-easyinput>
							</view>
						</view>

						<view class="form-item user-introduction">
							<view class="label">证件照片</view>
							<view class="introduction-content">
								<u-upload :fileList="item.photoList" :before-upload="beforeUpload" :header="headers"
									@on-success="(data, i, lists, name) => uploadComplete1(data, i, lists, name, index)"
									@on-remove="(event, i, lists, name) => deletePic1(event, i, lists, name, index)" name="file" :action="uploadUrl" multiple
									:maxCount="1"></u-upload>
							</view>
						</view>
						<view class="line-box">
							<view class="line line-delete"></view>
							<view class="delete-item" @click="removeEducationListsHandler(index)">
								<uni-icons type="minus-filled" size="30" color="#FA5151"></uni-icons>
								移除
							</view>
						</view>
					</view>
				</view>
				<view class="add-certificate-btn" @click="addEducationListsHandler">
					<view class="btn" v-if="educationLists.length>0"><uni-icons type="plus-filled" size="18"
							color="rgba(0,0,0,.85)"></uni-icons>增加一项</view>
					<view class="btn edit-btn" v-else>
						<image src="/static/auth/edit.png" class="img"></image>编辑
					</view>
				</view>
			</view>

			<view class="certificate-content" style="display: none;">
				<view class="title">
					<view>
						我的经历<text class="require">(选填)</text>
					</view>
					<view class="tips">
						<image src="/static/auth/remark.png" class="img"></image>说明
					</view>
				</view>
				<view class="remark">此项信息正式上线后会公开展示在个人资料</view>
				<view class="id-card-form-box">
					<view class="id-card-form-content" v-for="(item,index) in trainLists" :key="index">
						<view class="form-item">
							<view class="label">起始时间</view>
							<view class="content" :class="!value?'weight':''">请选择<uni-icons type="right" size="14"
									color="rgba(0, 0, 0, 0.3)"></uni-icons></view>
						</view>
						<view class="form-item">
							<view class="label">截止时间</view>
							<view class="content" :class="!value?'weight':''">请选择<uni-icons type="right" size="14"
									color="rgba(0, 0, 0, 0.3)"></uni-icons></view>
						</view>

						<view class="form-item user-sign">
							<view class="label">培训课程</view>
							<view class="content-input" style="width: 400rpx;">
								<uni-easyinput trim="all" type="text" placeholder="请输入培训课程" :inputBorder="false"
									:clearable="false" :placeholderStyle="{'text-align':'right'}">
								</uni-easyinput>
							</view>
						</view>
						<view class="form-item user-introduction">
							<view class="label">证件照片</view>
							<view class="introduction-content">
								<view class="img-list">
									<view class="img-item">
										<image src="/static/login/logo.png" class="img"></image>
										<view class="delete-item-img">
											删除
										</view>
									</view>
								</view>
								<view class="upload-image" v-if="certificateImgs.length<3">
									<view class="icon">
										<uni-icons type="plusempty" size="30" color="rgba(0,0,0,.3)"></uni-icons>
									</view>
									<view class="txt">最多三张</view>
								</view>
							</view>
						</view>
						<view class="line-box">
							<view class="line line-delete"></view>
							<view class="delete-item" @click="removeTrainListsHandler(index)">
								<uni-icons type="minus-filled" size="30" color="#FA5151"></uni-icons>
								移除
							</view>
						</view>
					</view>
					<view class="add-certificate-btn" @click="addTrainListsHandler">
						<view class="btn" v-if="trainLists.length>0"><uni-icons type="plus-filled" size="18"
								color="rgba(0,0,0,.85)"></uni-icons>增加一项</view>
						<view class="btn edit-btn" v-else>
							<image src="/static/auth/edit.png" class="img"></image>编辑
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		reactive,
		ref,
		onMounted
	} from 'vue';

	import {
		onShow
	} from '@dcloudio/uni-app'

	import {
		uploadFile
	} from '@/utils/common';
	import {
		registerConsultantStep3
	} from '@/common/api/consultant';

	import {
		registerListenerStep3
	} from '@/common/api/listener.js'
	import {
		baseURL
	} from '@/utils/request';
	const certificateImgs = ref([]);
	const certificatePickerShow = ref(false)

	let certificateLists = ref([{
		name: null,
		date: null,
		photoList: [],
		authority: null,
		number: null
	}]);

	const confirmCertificateDate = (item,e)=>{
		item.date = e.year+"-"+e.month+"-"+e.day
	}
	const uploadUrl = ref("")
	uploadUrl.value = baseURL+'/api/common/upload'

	const certificateDateChange = (e, data, i) => {
		console.log(e, data);
		certificateLists.value[i].date = e
		// this.$forceUpdate()
	}

	let educationLists = ref([]);

	const trainLists = ref([]);
	const uploadPics = (item) => {
		uni.chooseImage({
			count: 1,
			success: async function(res) {
				// item.imgUrl.push(res.tempFilePaths[0])
				let resp = await uploadFile(baseURL+'/api/common/upload', res.tempFilePaths[0]);
				item.imgUrl.push(resp.data.url)
			}
		})
	}
	
	const showCertificateTimePicker = ()=>{
		certificatePickerShow.value = true
	}

	
	/** 删除图片后同步更新 */
	const deletePic = (event, i, lists, name, index) => {
	  console.log('图片已被移除', index, lists)
	
	  // lists 是删除后的列表（u-upload 已处理好）
	  certificateLists.value[index].photoList = lists
	
	  // 如果你需要同步后端字段（例如 photo 字段）
	  certificateLists.value[index].photos = JSON.stringify(lists.map(v => v.url))
	}
	
	const deletePic1 = (event, i, lists, name, index) => {
	  console.log('图片已被移除', index, lists)
	
	  // lists 是删除后的列表（u-upload 已处理好）
	  educationLists.value[index].photoList = lists
	
	  // 如果你需要同步后端字段（例如 photo 字段）
	  educationLists.value[index].photo = JSON.stringify(lists.map(v => v.url))
	}
	const timePickerParams = ref({
		year: true,
		month: true,
		day: false,
		hour: false,
		minute: false,
		second: false,
		// 选择时间的时间戳
		timestamp: true,
	})
	
	const certificateDateParam = ref({
		year: true,
		month: true,
		day: true,
		hour: false,
		minute: false,
		second: false,
		// 选择时间的时间戳
		timestamp: true,
	})
	const currentIndex = ref(-1)
	const confirmSchoolTime = (item, e) => {
		console.log("schoolTime", item, e);
		const date = `${e.year}-${String(e.month).padStart(2, '0')}`
		console.log(date);
		console.log(currentIndex.value);
		if (currentIndex.value === -1) return
		
			if (type.value === 1) {
					// ✅ 通过 .value 改动 ref 数组的某个对象字段，确保响应式
					educationLists.value[currentIndex.value].startTime = date
				} else {
					educationLists.value[currentIndex.value].endTime = date
				}
			
				// ✅ 确保视图更新
				educationLists.value = [...educationLists.value]
		

				// timePickerShow.value = false
		// if (type.value == 1) { //开始时间
		// 	item.startTime = e.year + '-' + e.month
		// } else {
		// 	item.endTime = e.year + '-' + e.month
		// }
	}
	const timePickerShow = ref(false)

	const showTimePicker = (item, index, t) => {
		type.value = t
		currentIndex.value = index
		timePickerShow.value = true
	}

	const beforeUpload = (index, list) => {
		// 只上传偶数索引的文件
		// uni.showLoading({
		// 	title:"上传中..."
		// })
	}
	// const deletePic = (item, i) => {
	// 	item.imgUrl.splice(i, 1)
	// }


	const token = uni.getStorageSync('token')
	const headers = ref({
		'token': token
	})
	const type = ref(0)

	const emit = defineEmits(['commited'])
	const submit = async () => {
		//判断certificate中是否有files为空的情况
		if (props.consultantType == 1) {
			let containEmpty = false
			certificateLists.value.forEach(c => {
				console.log(c);
				if (c.photoList.length == 0) {
					uni.showToast({
						title: "您还有证件照片没有上传",
						icon: "none"
					})
					containEmpty = true;
					return
				}
			})
			if (containEmpty) {
				return
			}
			if (certificateLists.value.length == 0) {
				uni.showToast({
					title: "请上传至少一张资质证书",
					icon: 'error'
				})
				return
			}
			certificateLists.value.forEach(e => {
				e.photos = JSON.stringify(e.photoList)
			})
			educationLists.value.forEach(e => {
				if (e.photoList && e.photoList.length > 0) {
					e.photo = JSON.stringify(e.photoList)
				}
			})
			console.log(educationLists.value);

			let data = {
				...props.modelValue,
				certificateList: certificateLists.value,
				educationList: educationLists.value,
				careerList: trainLists.value,
				consultantType: props.consultantType
			}
			let res = await registerConsultantStep3(data)
			if (res.code == 0) {
				uni.showToast({
					title: "提交成功"
				})
				emit("commited", "")
			}
		} else {

			certificateLists.value.forEach(e => {
				e.photos = JSON.stringify(e.photoList)
			})

			let data = {
				...props.modelValue,
				certificateList: certificateLists.value,
				educationList: educationLists.value,
				careerList: trainLists.value,
				consultantType: props.consultantType
			}
			let res = await registerListenerStep3(data)
			if (res.code == 0) {
				uni.showToast({
					title: "提交成功"
				})
				emit("commited", "")
			}
		}
	}
	const props = defineProps({
		consultantType: Number,
		modelValue: Object
	})


	const refreshData = () => {

		if (props.modelValue?.certificateList && props.modelValue?.certificateList.length > 0) {
			certificateLists.value = props.modelValue.certificateList.map(e => {
				let photos = JSON.parse(e.photos)
				let ps = []
				photos.forEach(p => {
					ps.push({
						url: p
					})
				})
				e.photoList = ps
				return e
			})

		}
		if (props.modelValue?.educationList && props.modelValue?.educationList.length > 0) {
			console.log('refreshData called:', props.modelValue.educationList)
			props.modelValue.educationList.forEach(e => {
				if (e.photo) {
					let photos = JSON.parse(e.photo)
					let ps = []
					photos.forEach(p => {
						ps.push({
							url: p
						})
					})
					e.photoList = ps
				}
			})
			educationLists.value = props.modelValue.educationList


		}
	}

	onMounted(() => {
		refreshData()
	})

	defineExpose({
		submit,
		refreshData
	})


	const uploadComplete = (data, i, lists, name, index) => {
		let t = certificateLists.value[index]
		t.photoList.push(data.data.url)
	}


	const uploadComplete1 = (data, i, lists, name, index) => {
		let t = educationLists.value[index]
		if (!t.photoList) {
			t.photoList = []
		}
		t.photoList.push(data.data.url)
	}


	const addCertificateListHandler = () => {
		certificateLists.value.push({
			name: '',
			date: '',
			photoList: [],
			authority: '',
			number: ''
		});
	}

	const removeCertificateListHandler = (index) => {
		certificateLists.value.splice(index, 1);
	}

	const addEducationListsHandler = () => {
		educationLists.value.push({
			startTime: null,
			endTime: null,
			schoolName: null,
			idNumber: null,
			photoList: [],
			code: null,

		});
	}

	const removeEducationListsHandler = (index) => {
		educationLists.value.splice(index, 1);
	}


	const certificates = ref(['学历', '工作经历', '培训经历'])

	const changeCertificate = (e, i) => {
		certificateLists[i].type = certificates.value[e.detail.value]
	}
	const removeTrainListsHandler = (index) => {
		trainLists.value.splice(index, 1);
	}

	const uploadImgHandler = () => {}
</script>

<style scoped lang="scss">
	.certificate-box {
		width: 750rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		.certificate-content-box {
			width: 686rpx;
			background: #fff;
			border-radius: 20rpx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			padding-bottom: 40rpx;

			.certificate-content {
				width: 630rpx;

				.title {
					color: #212528;
					font-size: 36rpx;
					margin-top: 36rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.require {
						font-size: 26rpx;
						color: rgba(0, 0, 0, 0.85);
					}

					.tips {
						color: rgba(0, 0, 0, .5);
						font-size: 24rpx;
						display: flex;
						align-items: center;

						.img {
							width: 26rpx;
							height: 26rpx;
							padding-right: 12rpx;
						}
					}
				}

				.remark {
					color: rgba(0, 0, 0, .5);
					font-size: 26rpx;
					margin-top: 12rpx;
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

							::v-deep .uni-calendar-item--checked {
								background-color: #35CA95 !important;
							}

							::v-deep .uni-datetime-picker--btn {
								background-color: #35CA95 !important;
							}

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
							margin-top: 24rpx;
							display: flex;
							align-items: center;

							.upload-image {
								width: 160rpx;
								height: 160rpx;
								border-radius: 8rpx;
								background: #F4F6F8;
								box-sizing: border-box;
								border: 1px dashed rgba(0, 0, 0, 0.16);
								display: flex;
								align-items: center;
								justify-content: center;
								flex-direction: column;

								.txt {
									color: rgba(0, 0, 0, .3);
									font-size: 24rpx;
									margin-top: 10rpx;
								}
							}

							.img-list {
								display: flex;
								align-items: center;
								height: 160rpx;

								.img-item {
									position: relative;
									margin-right: 20rpx;

									.img {
										width: 160rpx;
										height: 160rpx;
									}

									.delete-item-img {
										height: 38rpx;
										width: 100%;
										background: rgba(0, 0, 0, 0.6);
										color: #fff;
										font-size: 22rpx;
										line-height: 38rpx;
										text-align: center;
										position: absolute;
										top: 122rpx;
									}
								}
							}
						}
					}

					.line-box {
						display: flex;
						align-items: center;

						.line {
							width: 630rpx;
							height: 2rpx;
							background-color: #f4f6f8;
						}

						.line-delete {
							width: 502rpx;
						}

						.delete-item {
							width: 128rpx;
							height: 52rpx;
							border-radius: 6rpx;
							display: flex;
							background: #FFFFFF;
							box-sizing: border-box;
							border: 0.5px solid #FA5151;
							justify-content: center;
							align-items: center;
							font-size: 28rpx;
							color: #FA5151;
						}
					}

				}

				.add-certificate-btn {
					margin-top: 20rpx;

					.btn {
						display: flex;
						align-items: center;
						width: 200rpx;
						height: 64rpx;
						justify-content: center;
						color: rgba(0, 0, 0, 0.85);
						font-size: 28rpx;
						box-sizing: border-box;
						border: 1px solid rgba(0, 0, 0, 0.6);
						border-radius: 10rpx;
					}

					.edit-btn {
						display: flex;
						align-items: center;
						width: 148rpx;

						.img {
							width: 28rpx;
							height: 28rpx;
							padding-right: 20rpx;
						}
					}
				}
			}
		}
	}
</style>