import App from './App'
import { createPinia } from 'pinia';
// import GoEasy from '@/uni_modules/GOEASY-IM/js_sdk/goeasy-2.13.21.esm.min.js'
// import GRTC from './lib/goeasy-rtc-0.3.7.esm.min.js'
// import GRTC from './lib/goeasy-rtc-0.4.1.esm.min.js'
import uView from './uni_modules/vk-uview-ui';

// GoEasy.init({
// 	host: "hangzhou.goeasy.io", //应用所在的区域地址: 【hangzhou.goeasy.io |singapore.goeasy.io】
// 	appkey: "BC-2a25b89557b940cbadaf694c9e6879f4",
// 	modules: ['im'],
// 	// true表示支持通知栏提醒，false则表示不需要通知栏提醒
// 	allowNotification: true //仅有效于app,小程序和H5将会被自动忽略
// });
// GRTC.init(GoEasy);
let user = uni.getStorageSync("currentUser")
// console.log(user);
// if (user) {
// 	GoEasy.connect({
// 		id: user.id,
// 		data: {
// 			"avatar": user.avatar,
// 			"nickname": user.nickname
// 		},
// 		onSuccess: function() {
// 			console.log("GoEasy connect successfully.") //连接成功
// 		},
// 		onFailed: function(error) { //连接失败
// 			console.log("Failed to connect GoEasy, code:" + error.code + ",error:" + error.content);
// 		},
// 		onProgress: function(attempts) { //连接或自动重连中
// 			console.log("GoEasy is connecting", attempts);
// 		}
// 	})
// }
// uni.$GoEasy = GoEasy;
// uni.$GRTC = GRTC;

// GoEasy.onClickNotification((message) => {
// 	let currentUrl;
// 	const routes = getCurrentPages();

// 	if (routes && routes.length) {
// 		const curRoute = routes[routes.length - 1].route;
// 		const curParam = routes[routes.length - 1].options;
// 		currentUrl = '/' + curRoute + `?to=${curParam.to}`;
// 	}

// 	let newUrl;
// 	switch (message.toType) {
// 		case GoEasy.IM_SCENE.PRIVATE:
// 			newUrl = '/pages/message/private-chat?to=' + message.senderId;
// 			break;
// 		case GoEasy.IM_SCENE.GROUP:
// 			console.log("暂无群消息")
// 			break;
// 	}

// 	if (currentUrl !== newUrl) {
// 		uni.navigateTo({
// 			url: newUrl,
// 		});
// 	}

// });


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
	return {
		app
	}
}
// #endif