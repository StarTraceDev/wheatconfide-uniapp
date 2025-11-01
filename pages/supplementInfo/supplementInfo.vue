<template>
	<view class="profile-page">
		
		<u-navbar title="个人资料">
			<template #right>
				<u-button size="mini" type="success" @click="saveInfo" style="margin-right: 30rpx;">保存</u-button>
			</template>
		</u-navbar>

		<!-- 上传头像 -->
		<view class="avatar-section">
			<view class="avatar-box" >
				<u-avatar :src="avatar" size="128" @click="chooseAvatar"></u-avatar>
				<!-- <image v-if="avatar" :src="avatar" mode="aspectFill" class="avatar-img" /> -->
				<!-- <view v-else class="avatar-placeholder"> -->
					<!-- <text>上传头像</text> -->
				<!-- </view> -->
			</view>
		</view>

		<!-- 信息输入区 -->
		<view class="info-list">
			<!-- 昵称 -->
			<view class="info-item">
				<text class="label">昵称</text>
				<input class="input" type="text" v-model="nickname" placeholder="请输入" placeholder-style="color:#ccc;" />
			</view>

			<!-- 性别 -->
			<view class="info-item" @click="chooseGender">
				<text class="label">性别</text>
				<view class="right">
					<text class="value">{{ genderText }}</text>
					<u-select></u-select>
					<text class="arrow" v-if="genderText==null">请选择</text><u-icon
							name="arrow-right"></u-icon>

				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,computed
	} from 'vue'
	const showGender = ref(false)

	import {
		uploadFile
	} from '@/utils/common';
	import { baseURL } from '@/utils/request';

	import {
		updateUser
	} from '@/common/api/user.js'

	const avatar = ref('')
	const nickname = ref('')
	const gender = ref(null)
	const genders = ref(['男', '女'])

	const genderText = computed(() => (gender.value === 'male' ? '男' : '女'))

	// 上传头像
	const chooseAvatar = () => {
		console.log("选择头像");
		uni.chooseImage({
			count: 1,
			success: (res) => {
				avatar.value = res.tempFilePaths[0]
			}
		})
	}

	// 性别选择
	const chooseGender = () => {
		uni.showActionSheet({
			itemList: ['男', '女'],
			success: (res) => {
				gender.value = res.tapIndex === 0 ? 'male' : 'female'
			}
		})
	}

	// 返回
	const goBack = () => {
		uni.navigateBack()
	}

	// 保存
	const saveInfo = async() => {
		if(nickname.value==''){
			uni.showToast({
				title:"请输入昵称",
				icon:'error'
			})
			return
		}
		if(genderText==null){
			uni.showToast({
				title:"请选择性别",
				icon:'error'
			})
			return
		}
		if(avatar.value==''){
			uni.showToast({
				title:"请选择头像",
				icon:'error'
			})
			return
		}
		let resp = await uploadFile(baseURL+'/api/common/upload',avatar.value)
		let userInfo = uni.getStorageSync("currentUser")
		userInfo.avatar = resp.data.url
		console.log(resp.data.url);
		userInfo.realName = nickname.value
		userInfo.gender = genderText.value
		console.log(userInfo);
		let response = await updateUser(userInfo)
		if(response.code==0){
			uni.reLaunch({
				url:'/pages/index/index'
			})
		}
		uni.showToast({
			title: '保存成功',
			icon: 'success'
		})
	}
</script>

<style scoped>
	.profile-page {
		background-color: #f7f8fa;
		min-height: 100vh;
	}

	/* 顶部导航栏 */
	.nav-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 60rpx 40rpx 20rpx;
		background-color: #f7f8fa;
		font-size: 34rpx;
	}

	.title {
		font-weight: 600;
	}

	.back {
		font-size: 38rpx;
		color: #333;
	}

	.save {
		color: #32b67a;
		font-size: 28rpx;
	}

	/* 上传头像部分 */
	.avatar-section {
		display: flex;
		justify-content: center;
		margin: 40rpx 0;
	}
/* 
	.avatar-box {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border: 2rpx dashed #a0cfc3;
	} */

	.avatar-placeholder text {
		color: #3aa376;
		font-size: 28rpx;
	}

	.avatar-img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	/* 信息区域 */
	.info-list {
		background-color: #fff;
		border-radius: 20rpx;
		margin: 0 30rpx;
		overflow: hidden;
	}

	.info-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.info-item:last-child {
		border-bottom: none;
	}

	.label {
		color: #333;
		font-size: 30rpx;
	}

	.input {
		flex: 1;
		text-align: right;
		color: #333;
		font-size: 30rpx;
	}

	.right {
		display: flex;
		align-items: center;
	}

	.value {
		color: #333;
		font-size: 30rpx;
		margin-right: 10rpx;
	}

	.arrow {
		color: #ccc;
		font-size: 36rpx;
	}
</style>