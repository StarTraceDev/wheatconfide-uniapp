<template>
	<view class="certificate-box">
		<view class="certificate-content-box">
			<view class="certificate-content">
				<view class="title">
					<view>
						资质信息<text class="require">(必填)</text>
					</view>
					<view class="tips">
						<image src="/static/auth/remark.png" class="img"></image>说明
					</view>
				</view>
				<view class="remark">此项信息正式上线后会公开展示在个人资料</view>
				<view class="id-card-form-box">
					<view class="id-card-form-content" v-for="(item,index) in certificateLists" :key="index">
						<view class="form-item">
							<view class="label require">资质类别</view>
							<view class="content" :class="!value?'weight':''">请选择<uni-icons type="right" size="14"
									color="rgba(0, 0, 0, 0.3)"></uni-icons></view>
						</view>
						<view class="form-item">
							<view class="label require">发证时间</view>
							<view class="content" :class="!value?'weight':''">
								<uni-datetime-picker type="date" :clear-icon="false" v-model="single"
									@maskClick="maskClick">请选择<uni-icons type="right" size="14"
										color="rgba(0, 0, 0, 0.3)"></uni-icons></uni-datetime-picker>
							</view>
						</view>
						<view class="form-item user-sign">
							<view class="label require">证书编号</view>
							<view class="content-input" style="width: 400rpx;">
								<uni-easyinput trim="all" type="text" placeholder="请输入证书编号" :inputBorder="false"
									:clearable="false" :placeholderStyle="{'text-align':'right'}">
								</uni-easyinput>
							</view>
						</view>
						<view class="form-item user-introduction">
							<view class="label require">证件照片</view>
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


			<view class="certificate-content">
				<view class="title">
					<view>
						教育背景<text class="require">(选填)</text>
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
							<view class="content" :class="!value?'weight':''">请选择<uni-icons type="right" size="14"
									color="rgba(0, 0, 0, 0.3)"></uni-icons></view>
						</view>
						<view class="form-item">
							<view class="label">截止时间</view>
							<view class="content" :class="!value?'weight':''">请选择<uni-icons type="right" size="14"
									color="rgba(0, 0, 0, 0.3)"></uni-icons></view>
						</view>

						<view class="form-item user-sign">
							<view class="label">毕业院校</view>
							<view class="content-input" style="width: 400rpx;">
								<uni-easyinput trim="all" type="text" placeholder="请输入毕业院校" :inputBorder="false"
									:clearable="false" :placeholderStyle="{'text-align':'right'}">
								</uni-easyinput>
							</view>
						</view>

						<view class="form-item user-sign">
							<view class="label">证书编号</view>
							<view class="content-input" style="width: 400rpx;">
								<uni-easyinput trim="all" type="text" placeholder="请输入证书编号" :inputBorder="false"
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

			<view class="certificate-content">
				<view class="title">
					<view>
						伦理培训<text class="require">(选填)</text>
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
		ref
	} from 'vue';

	const certificateImgs = ref([]);

	const certificateLists = ref([{
		type: 0,
		date: "2022-02-02 02:02:02",
		number: "9527",
		imgUrl: []
	}]);

	const educationLists = ref([]);
	const trainLists = ref([]);

	const addCertificateListHandler = () => {
		certificateLists.value.push({
			type: 0,
			date: "2022-02-02 02:02:02",
			number: "9527",
			imgUrl: []
		});
	}

	const removeCertificateListHandler = (index) => {
		certificateLists.value.splice(index, 1);
	}

	const addEducationListsHandler = () => {
		educationLists.value.push({
			startDate: null,
			endDate: null,
			schoolName: null,
			idNumber: null,
			imgUrl: []
		});
	}

	const removeEducationListsHandler = (index) => {
		educationLists.value.splice(index, 1);
	}



	const addTrainListsHandler = () => {
		trainLists.value.push({
			startDate: null,
			endDate: null,
			courseName: null,
			imgUrl: []
		});
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
							height: 190rpx;
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