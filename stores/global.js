// src/stores/counterStore.js
import { defineStore } from 'pinia';

const systemInfo = uni.getSystemInfoSync();
export const useGlobalDataStore = defineStore('global', {
	state: () => ({
		statusBarHeight: systemInfo.statusBarHeight + 50 || 0,
		token: uni.getStorageSync('token') || '', // 从本地存储初始化Token
		userInfo: uni.getStorageSync('userInfo') || '', // 从本地存储初始化Token
		mallSwitch: uni.getStorageSync('mallSwitch') || '', // 商城状态
	}),
	actions: {
		// 设置Token并保存到本地存储
		setToken(token) {
			this.token = token;
			uni.setStorageSync('token', token);
		},
		setMallSwitch(mallSwitch) {
			this.mallSwitch = mallSwitch;
			uni.setStorageSync('mallSwitch', mallSwitch);
		},
		// 清除Token（用于登出）
		clearToken() {
			this.token = '';
			uni.removeStorageSync('token');
		},
		setUserInfo(userInfo) {
			this.userInfo = userInfo;
			uni.setStorageSync('userInfo', userInfo);
		},
	},

	getters: {
		// 获取Token（可用于计算属性或组件）
		getToken: (state) => state.token,
		getUserInfo: (state) => state.userInfo,
		getMallSwitch: (state) => state.mallSwitch,
		// 判断是否已登录
		isLoggedIn: (state) => !!state.token,
	},
});