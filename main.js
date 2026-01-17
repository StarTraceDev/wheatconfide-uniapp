import App from './App'
import { createPinia } from 'pinia';
import { TencentImSdk } from '@/utils/imSdk.js';
import uView from './uni_modules/vk-uview-ui';

let user = uni.getStorageSync("currentUser")

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'

export function createApp() {
	const app = createSSRApp(App);
	const pinia = createPinia();
	app.use(uView);
	app.use(pinia);
	app.config.globalProperties.$im = TencentImSdk;
	return {
		app
	}
}
// #endif