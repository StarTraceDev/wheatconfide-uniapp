/**
 * @Descripttion: 基础配置
 * @Version: 1.0.0
 * @Author: lgen
 */

export default {
	// 黑白名单只能二选一
	
	// 白名单，不需要登录的页面路径
	whiteList:[
		// '/pages/tabPage/index',
		'/pages/login/login',
		// '/pages/login/register'
		{'pattern':RegExp(/register/)}
	],
	
	// 黑名单，需要登录的页面路径
	blackList:[
		'/pages/home/home',
		// '/pages/index/detail',
		{'pattern':RegExp(/detail/)}
	],
	
	// getStorageSync 获取本地存储的用户登录标识
	uInfo:'token',
	
	// 登录页面地址，用于未登录时跳转
	loginPath:'/pages/login/login',
	
	// 点击跳转到需要登录的页面时，未登录是否跳转到登录页面，true | false
	toLogin:true
}