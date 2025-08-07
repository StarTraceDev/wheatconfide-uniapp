<template>
	<view class="user-info-box">
		<uni-nav-bar :backgroundColor="'#F4F6F8'" :border="false" title="个人信息" class="header-bar" :statusBar="true"
			fixed>
			<template v-slot:left>
				<uni-icons type="left" size="24" @click="backFn"></uni-icons>
			</template>
			<template v-slot:right>
			</template>
		</uni-nav-bar>

		<view class="user-info-content">
			<view class="info-content-1">
				<view class="info-content-list">
					<view class="content-item auture" @click="uploadImageHandler">
						<view class="label">头像</view>
						<view class="content">
							<image :src="picUrl" v-if="picUrl" class="pic"></image>
							<text class="txt" v-else>请选择<uni-icons type="right" size="14" color="rgba(0,0,0,0.3)"
									class="icon"></uni-icons></text>
						</view>
					</view>
					<view class="content-item">
						<view class="label">昵称</view>
						<view class="content">
							<text class="txt">
								<input type="text" v-model="userlnfo.realName" />
							</text>
						</view>
					</view>
					<view class="content-item">
						<view class="label">生日</view>
						<view class="content">
							<uni-datetime-picker type="date" :clear-icon="false" v-model="birthDate">
								<text class="txt">{{birthDate||'请选择'}}<uni-icons type="right" size="14"
										color="rgba(0,0,0,0.3)" class="icon"></uni-icons></text>
							</uni-datetime-picker>

						</view>
					</view>
					<view class="content-item">
						<view class="label">性别</view>
						<view class="content" @click="openPopupHandler(1)">
							<text class="txt">请选择<uni-icons type="right" size="14" color="rgba(0,0,0,0.3)"
									class="icon"></uni-icons></text>
						</view>
					</view>
				</view>
			</view>

			<view class="info-content-2">
				<view class="info-content-list">
					<view class="content-item">
						<view class="label">婚姻状态</view>
						<view class="content" @click="openPopupHandler(2)">
							<text class="txt">请选择<uni-icons type="right" size="14" color="rgba(0,0,0,0.3)"
									class="icon"></uni-icons></text>
						</view>
					</view>

					<view class="content-item profile">
						<view class="label">简介</view>
						<view class="content">
							<textarea placeholder="请简单介绍一下自己" class="profile-content"
								placeholder-class="profile-placeholder-content"></textarea>
						</view>
					</view>
				</view>
			</view>
			<button type="primary" @click="onUpdateUser">提交</button>
		</view>

		<uni-popup ref="sexPopupRef" type="center" class="sexPopup">
			<view class="content">
				<view class="content-item">男</view>
				<view class="content-item">女</view>
			</view>
		</uni-popup>


		<uni-popup ref="statusPopupRef" type="center" class="statusPopup">
			<view class="content">
				<view class="content-item">已婚</view>
				<view class="content-item">未婚</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		getUserlnfo
	} from "@/common/api/apis.js"
	import {
		updateUser
	} from "@/common/api/user.js"
	const picUrl = ref("");
	const nickName = ref("");
	const birthDate = ref("");
	const sex = ref("");
	const status = ref("");
	const sexPopupRef=ref(null);
	const statusPopupRef=ref(null);
	const uploadImageHandler = () => {
		uni.chooseImage({
			count: 1,
			success: function(res) {
				picUrl.value = res.tempFilePaths[0];
			}
		})
	}

	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}

	const openPopupHandler = (type) => {
		type == 1 ? sexPopupRef.value.open() : statusPopupRef.value.open();
	}
	
	const userlnfo = ref({});
	
	/**
	 * 获取当前用户信息
	 */
	const getlnfo = async () => {
		let res = await getUserlnfo();
		userlnfo.value = res.data;
		console.log(res)
	}
	
	const onUpdateUser = async () => {
		let res = await updateUser(userlnfo.value);
		
		uni.showToast({
		    title: '发布成功',
		    icon: 'none', // 可选值 'success', 'loading', 'none'
		    duration: 2000 // 持续时长，单位ms
		});
		console.log(res)
	}
	
	onMounted(() => {
		getlnfo()
	});
</script>

<style lang="scss" scoped>
	.user-info-box {
		background: #F4F6F8;
		height: 100vh;

		.user-info-content {
			width: 750rpx;
			padding: 0rpx 36rpx;
			margin-top: 40rpx;

			.info-content-1,
			.info-content-2 {
				width: 678rpx;
				height: 452rpx;
				border-radius: 20rpx;
				background-color: #fff;

				.info-content-list {
					.content-item {
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding: 0rpx 36rpx;
						height: 100rpx;

						.label {
							font-size: 28rpx;
							color: rgba(0, 0, 0, 0.6);
						}

						.content {
							.txt {
								font-size: 26rpx;
								color: rgba(0, 0, 0, 0.85);

								.icon {
									// padding-left: rpx;
								}
							}

						}

						&:not(:first-child) {
							border-top: 1rpx solid rgba(0, 0, 0, 0.08);
						}


					}

					.auture {
						height: 152rpx;

						.pic {
							width: 80rpx;
							height: 80rpx;
						}
					}
				}
			}

			.info-content-2 {
				height: 300rpx;

				.info-content-list {
					height: 300rpx;
					margin-top: 32rpx;

					.profile {
						height: 200rpx;
						align-items: start;
						padding-top: 20rpx;

						.profile-content {
							height: 150rpx;
							width: 300rpx;

						}

						.profile-placeholder-content {
							font-size: 26rpx;
							color: rgba(0, 0, 0, 0.3);
							text-align: right;
						}
					}
				}

			}
		}

		.sexPopup,.statusPopup {
			.content {
				width: 508rpx;
				height: 220rpx;
				background: #fff;
				border-radius: 20rpx;
				.content-item{
					width: 100%;
					height: 110rpx;
					display: flex;
					align-items: center;
					 justify-content: center;
					font-size: 30rpx;
					color: rgba(0, 0, 0, 0.85);
					&:not(:first-child){
						border-top: 1rpx solid rgba(0, 0, 0, 0.08);
					}
				}
			}
		}
	}
</style>