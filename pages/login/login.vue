<template>
	<view class="login-box">
		<view class="login-bg">
			<view class="bg-top">
				<image src="/static/login/bg-top.png" class="image"></image>
			</view>
			<view class="bg-top-content">
				<image src="/static/login/logo.png" class="logo"></image>
				<view class="welcome"><text>欢迎来到</text> <text class="txt">「麦苗倾诉」</text></view>
				<view class="msg">未注册手机号验证后自动创建账号</view>
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
					<text class="send-code" @click="onSendSms">获取验证码</text>
				</view>
				<view class="psd" v-else><input class="uni-input" v-model="state.password" placeholder="请输入密码"
						placeholder-class="msg" />
				</view>
				<view class="login-btn" @click="loginFn">立即登录</view>
			</view>
			<view class="wechat-login">
				<text class="wechat-msg">第三方登录</text>
				<view class="wechat-content">
					<image src="@/static/login/wechat.png" class="wechat"></image>
				</view>
			</view>

		</view>
		<view class="agree">
			注册即代表同意 <text class="txt">《用户注册协议》</text>和<text class="txt">《隐私协议》</text>
		</view>
	</view>
</template>

<script setup>
	import {
		quickReg,
		sendSms,
		smsLogin
	} from "@/api/apis.js"
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
		"userName": "18805340665",
		"password": "123456",
		"code": "2328"
	})

	const changeLoginTypeFn = (val) => {
		console.log(val);
		type.value = val;
	}

	const loginFn = async () => {
		if (type.value == "2") {
			let res = await quickReg(state.value);
			store.setToken(res.data.token);
		}
		if (type.value == "1") {
			let res = await smsLogin(state.value);
		}
		uni.switchTab({
			url: '/pages/index/index'
		})
	}

	/**
	 * 点击获取验证码
	 */
	const onSendSms = async () => {
		let res = await sendSms({
			phone: state.value.userName
		})
		console.log(res)
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