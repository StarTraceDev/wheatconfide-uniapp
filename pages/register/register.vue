<template>
	<view class="login-box">
		<view class="login-bg">
			<view class="bg-top">
				<image src="/static/register/register-bg.png" class="image"></image>
			</view>
			<view class="bg-top-content">
				<u-icon name="arrow-left" size="42"></u-icon>
				<view style="margin-left: 30rpx;margin-right: 30rpx;">
					<view class="welcome"><text>欢迎注册</text> <text class="txt">「麦苗倾诉」</text></view>
					<view class="msg">注册账号发现更多精彩</view>
					<view style="">
						<view class="login-form">
							<!-- 手机号 -->
							<view class="input-box">
								<input class="input" type="number" v-model="form.userName" placeholder="请输入手机号" />
							</view>

							<!-- 验证码 -->
							<view class="input-box code-box">
								<input class="input" type="number" v-model="form.code" placeholder="请输入验证码" />
								<view class="divider"></view>
								<text class="get-code"
									@click="getCode">{{ countdown > 0 ? countdown + 's' : '获取验证码' }}</text>
							</view>

							<!-- 密码 -->
							<view class="input-box">
								<input class="input" type="password" v-model="form.password" placeholder="请输入密码" />
							</view>
							<view style="margin-top: 80rpx;">
								<u-button type="success" shape="circle" @click="gotoRegister">确定注册</u-button>
							</view>
							<view style="text-align: center;margin-top: 20rpx;">
								<text>已有账号，现在去</text><text style="color: #34A755;" @click="gotoLogin">登录>></text>
							</view>
						</view>
					</view>

				</view>
			</view>

		</view>
		<view class="agree">
			<u-checkbox shape="circle" active-color="#1EBC80" v-model="agree" label-size="24">注册即代表同意 <text class="txt"
					@click="gotoPrivacy(1)">《用户注册协议》</text>和<text class="txt"
					@click="gotoPrivacy(2)">《隐私协议》</text></u-checkbox>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		sendSms,
		register
	} from "@/common/api/apis.js"
	const border = ref(true)
	const agree = ref(false)
	const codeText = ref('获取验证码')
	const form = ref({
		userName: null,
		code: null,
		password:null
	})
	const uCode = ref(null)
	const countdown = ref(0)
	const gotoLogin = () => {
		uni.navigateBack()
	}

	const gotoPrivacy = () => {
		uni.switchTab({
			url: "/pages/index/index"
		})
	}


	const isValidPhone = (num) => /^1[3-9]\d{9}$/.test(num)
	const getCode = async () => {
		if (countdown.value > 0) return
		if (!form.value.userName) {
			uni.showToast({
				title: '请输入手机号',
				icon: 'none'
			})
			return
		}
		if (!isValidPhone(form.value.userName)) {
			uni.showToast({
				title: '手机号格式不正确',
				icon: 'none'
			})
			return
		}
		let resp = await sendSms({
			phone: form.value.userName,
			type: 2
		})
		if (resp.code == 0) {
			uni.showToast({
				title: '验证码已发送',
				icon: 'none'
			})

			countdown.value = 60
			const timer = setInterval(() => {
				countdown.value--
				if (countdown.value <= 0) clearInterval(timer)
			}, 1000)
		}
	}




	const gotoRegister = async () => {
		if(!form.value.userName){
			uni.showToast({
				title:"请输入手机号",
				icon:'error'
			})
			return
		}
		if(!form.value.code){
			uni.showToast({
				title:"请输入验证码",
				icon:"error"
			})
			return
		}
		if(!form.value.password){
			uni.showToast({
				title:"请输入密码",
				icon:"error"
			})
			return
		}
		let resp = await register(form.value)
		let userInfo = resp.data
		console.log(resp);
		uni.setStorageSync("token",resp.data.token)
		uni.setStorageSync("currentUser",userInfo);
		if (resp.code == 0) {
			uni.navigateTo({
				url: '/pages/supplementInfo/supplementInfo'
			})
		}
	}
</script>

<style lang="scss">
	.login-box {
		background: #fff;
		height: 100vh;
		width: 100vw;

		.login-bg {
			position: relative;
			width: 750rpx;
			height: 574rpx;

			.bg-top {
				width: 100%;
				height: 100%;
				position: relative;

				.image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.bg-top-content {
			position: absolute;
			top: 110rpx;
			left: 30rpx;
			width: 720rpx;

			.welcome {
				line-height: 1;
				margin-top: 80rpx;
				font-size: 48rpx;
				font-weight: 600;
				display: flex;

				flex-direction: row;
				color: #212528;

				.txt {
					color: #35CA95;
				}
			}

			.msg {
				color: rgba(0, 0, 0, 0.35);
				margin-top: 24rpx;
				font-weight: 400;
				font-size: 26rpx;
			}
		}

		.login-form {
			margin: 60rpx auto;
		}

		.input-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #f7f7f7;
			border-radius: 50rpx;
			height: 90rpx;
			padding: 0 30rpx;
			margin-bottom: 30rpx;
		}

		.input {
			flex: 1;
			font-size: 30rpx;
			color: #333;
		}

		.input::placeholder {
			color: #aaa;
		}

		.code-box {
			position: relative;
		}

		.divider {
			width: 2rpx;
			height: 50rpx;
			border-right: 2rpx dashed #d8d8d8;
			margin: 0 20rpx;
		}

		.get-code {
			color: #32b67a;
			font-size: 28rpx;
			white-space: nowrap;
		}

		.agree {
			font-size: 24rpx;
			color: #9F9F9F;
			position: absolute;
			bottom: 40rpx;
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;

			.txt {
				color: #1EBC80;
			}
		}
	}
</style>