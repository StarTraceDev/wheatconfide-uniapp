<template>
	<view class="login-box">
		<view class="login-bg">
			<view class="bg-top">
				<image src="/static/login/bg-top.png" class="image"></image>
			</view>
			<view class="bg-top-content">
				<image src="/static/login/logo.png" class="logo"></image>
				<view class="welcome"><text>欢迎来到</text> <text class="txt">「麦苗倾诉」</text></view>
				<view class="msg">欢迎登录麦苗App</view>
			</view>
		</view>
		<view class="login-area">
			<view class="change-login-type">
				<view class="phone-type login-type" @click="changeLoginTypeFn(1)">
					<image src="@/static/login/code-active.png" class="image" v-if="type==1"></image>
					<image src="@/static/login/code.png" class="image" v-else></image>
					<text class="login-msg" :class="type==1?'active':''">手机快速登录</text>
				</view>
				<view class="code-type login-type" @click="changeLoginTypeFn(2)">
					<image src="@/static/login/psd-active.png" class="image" v-if="type==2"></image>
					<image src="@/static/login/psd.png" class="image" v-else></image>
					<text class="login-msg" :class="type==2?'active':''">账号密码登录</text>
				</view>
			</view>
			<view class="login-content">
				<view class="phone"><input class="uni-input" type="number" v-model="state.userName" placeholder="请输入手机号"
						placeholder-class="msg" maxlength="11" /></view>
				<view class="code" v-if="type==1">
					<input class="code-input" v-model="state.code" placeholder="请输入验证码" placeholder-class="msg" />
					<text class="send-code" :disabled="disabled" @click="onSendSms">{{btnText}}</text>
				</view>
				<view class="psd" v-else><input class="uni-input" v-model="state.password" placeholder="请输入密码"
						placeholder-class="msg" />
				</view>
				<view class="login-btn" @click="loginFn">立即登录</view>
				<view style="text-align: center;margin-top: 15rpx;"><text>还没有账号？现在去</text><text @click="gotoRegister"
						style="color: #34A755;">注册>></text></view>
			</view>
			<view class="wechat-login">
				<text class="wechat-msg">第三方登录</text>
				<view class="wechat-content" @click="wxAppLogin">
					<image src="@/static/login/wechat.png" class="wechat"></image>
				</view>
			</view>

		</view>
		<view class="agree">
			注册即代表同意 <text class="txt" @click="gotoPrivacy(1)">《用户注册协议》</text>和<text class="txt"
				@click="gotoPrivacy(2)">《隐私协议》</text>
		</view>
	</view>
</template>

<script setup>
	import {
		login,
		quickReg,
		sendSms,
		smsLogin
	} from "@/common/api/apis.js"
	// 在组件中使用
	import {
		useGlobalDataStore
	} from '@/stores/global';

	import {
		ref
	} from 'vue';
	const store = useGlobalDataStore();
	let type = ref(1);
	const state = ref({
		"userName": "",
		"password": "",
		"code": ""
	})

	const gotoPrivacy = (type) => {
		if(type==1){
			uni.navigateTo({
				url:"/pages/webview/webview?type=用户协议"
			})
		}else{
			uni.navigateTo({
				url:"/pages/webview/webview?type=隐私政策"
			})
		}
	}

	const changeLoginTypeFn = (val) => {
		console.log(val);
		type.value = val;
	}
	let GoEasy = uni.$GoEasy

	const loginFn = async () => {
		if (type.value == 2) {
			let res = await quickReg(state.value);
			console.log('userInfo1', res);
			uni.setStorageSync('token', res.data.token)
			store.setToken(res.data.token);
			uni.setStorageSync("currentUser", res.data)
			let user = res.data

			uni.switchTab({
				url: '/pages/index/index'
			})
		}
		if (type.value == 1) {
			let res = await smsLogin(state.value);
			if (res.code == 0) {
				uni.setStorageSync('token', res.data.token)
				store.setToken(res.data.token);
				uni.setStorageSync("currentUser", res.data)
				let user = res.data
				console.log("userInfo2", user);

				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}

	}

	const gotoRegister = () => {
		uni.navigateTo({
			url: "/pages/register/register"
		})
	}
	const userInfo = ref(null);

	const wxAppLogin = async () => {
		try {
			// Uni-app login
			const loginRes = await uni.login({
				provider: 'weixin'
			});
			console.log(JSON.stringify(loginRes));

			// Get user info
			const infoRes = await uni.getUserInfo({
				provider: 'weixin'
			});
			console.log(JSON.stringify(infoRes.userInfo));

			userInfo.value = {
				...infoRes.userInfo,
				openid: infoRes.userInfo.openId,
				unionid: infoRes.userInfo.unionId
			};

			// Call login API
			const res = await login({
				openid: userInfo.value.openid,
				logintype: 'wxApp'
			});

			console.log('======================');
			console.log(res.data);

			if (res.success) {
				uni.setStorageSync('token', res.data.token);
				uni.setStorageSync('currentUser', res.data);
				let user = res.data;

				// If using Vue Router
				// router.push('/tabBar/mine/mine');

				// Uni-app navigation
				uni.switchTab({
					url: '/pages/index/index'
				});
			} else {
				// If using Vue Router
				// router.push(`/wx-bind/wx-bind?userInfo=${JSON.stringify(userInfo.value)}`);

				// Uni-app navigation
				uni.navigateTo({
					url: `../wx-bind/wx-bind?userInfo=${JSON.stringify(userInfo.value)}`
				});
			}
		} catch (error) {
			console.error('Login failed:', error);
			// Handle error here
		}
	}

	/**
	 * 点击获取验证码
	 */
	const onSendSms = async () => {
		if (disabled.value) return;

		let res = await sendSms({
			phone: state.value.userName,
			type:1
		})
		if (res.code == 0) {
			getCurrentDown();
		}
		console.log(res)
	}

	const disabled = ref(false);
	const btnText = ref('获取验证码');
	const second = ref(60);

	const getCurrentDown = () => {
		disabled.value = true;
		var interval = setInterval(() => {
			btnText.value = second.value + 's 重新获取';
			second.value--;
			if (second.value == 0) {
				clearInterval(interval);
				second.value = 60;
				btnText.value = '获取验证码';
				disabled.value = false;
			}
		}, 1000);
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

			.bg-top-content {
				position: absolute;
				top: 168rpx;
				left: 60rpx;

				.logo {
					width: 112rpx;
					height: 112rpx;
				}

				.welcome {
					line-height: 1;
					margin-top: 40rpx;
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
					color: #000000;
					margin-top: 24rpx;
					font-weight: 400;
					font-size: 26rpx;
				}
			}
		}

		.login-area {
			padding: 0rpx 58rpx;
			border-radius: 32rpx;
			position: relative;
			top: -90rpx;
			background: #fff;

			.change-login-type {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				font-size: 28rpx;
				padding-top: 50rpx;

				.login-type {
					position: relative;

					.image {
						width: 320rpx;
						height: 96rpx;
					}

					.login-msg {
						position: absolute;
						width: 320rpx;
						height: 96rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #34A755;
						font-size: 28rpx;
						top: 0;
					}

					.active {
						color: #fff;
					}
				}

				.phone-type {}
			}

			.login-content {

				.code,
				.uni-input {
					border-radius: 30px;
					width: 630rpx;
					height: 96rpx;
					background: #F6F6F6;
					padding: 0rpx 20rpx;
					margin-top: 40rpx;
				}

				.code {
					display: flex;
					flex-direction: row;
					align-items: center;

					.code-input {
						width: 450rpx;
					}

					.send-code {
						font-size: 26rpx;
						color: #34A755;
					}
				}

				.msg {
					color: #9E9E9E;
					font-size: 26rpx;
				}

				.login-btn {
					width: 630rpx;
					height: 96rpx;
					background-color: #34A755;
					border-radius: 60rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #fff;
					font-size: 32rpx;
					font-weight: 500;
					margin-top: 40rpx;
				}
			}

			.wechat-login {
				margin-top: 40rpx;
				display: flex;
				justify-content: center;
				flex-direction: column;

				.wechat-msg {
					color: #9F9F9F;
					font-size: 24rpx;
					font-weight: 400;
					position: relative;
					text-align: center;
				}

				.wechat-msg::after {
					width: 234rpx;
					height: 1rpx;
					background-color: rgba(0, 0, 0, 0.08);
					position: absolute;
					content: '';
					left: 0;
					top: 14rpx;
				}

				.wechat-msg::before {
					width: 234rpx;
					height: 1rpx;
					background-color: rgba(0, 0, 0, 0.08);
					position: absolute;
					content: '';
					right: 0;
					top: 14rpx;
				}

				.wechat-content {
					display: flex;
					justify-content: center;
					align-items: center;

					.wechat {
						width: 80rpx;
						height: 80rpx;
						margin-top: 20rpx;
					}
				}
			}


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
				color: #000;
			}
		}
	}
</style>