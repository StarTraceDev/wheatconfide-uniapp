/**
 * uniapp请求方法封装
 * 支持配置baseUrl
 * 支持配置请求拦截器 requestIntercept
 * 支持配置响应拦截器 responIntercept
 */
export class Request {
	baseUrl = '';
	requestIntercept = {};
	requestIntercepts = [];
	responIntercept = {};
	responIntercepts = [];
	initConfig = {};
	constructor(config) {
		if (config) {
			this.initConfig = config;
		}
		// 请求拦截
		this.requestIntercept.add = (fn) => {
			const len = this.requestIntercepts.push(fn);
			return () => this.requestIntercepts.splice(len-1, 1);
		}
		// 响应拦截
		this.responIntercept.add = (fn) => {
			const len = this.responIntercepts.push(fn);
			return () => this.responIntercepts.splice(len-1, 1);
		}
	}
	
	/**
	 * @param {String} url 请求的接口地址
	 * @param {Object} data 请求的要传的参,如没有则传空
	 * @param {Object} config 一些请求额外配置，详见小程序的wx.request参数，只是不需要传回调和url,data
	 */
	request(url, data, config) {
		// 默认需要把参数处理成表单形式
		let realData = data;
		let realConfig = Object.assign({
			url: url.startsWith('http') ? url : this.baseUrl + url,
			data: realData,
			method: "POST",
			dataType: "json",
			header: {
				'Content-Type': 'application/json;charset=utf-8'
			}
		}, this.initConfig, config);
		// 处理请求拦截队列
		let requestInterceptPrevent = false;
		if (this.requestIntercepts.length > 0) {
			const fnReturns = [];
			this.requestIntercepts.forEach((fn) => {
				if (fn) {
					fnReturns.push(fn(realConfig))
				}
			})
			requestInterceptPrevent = fnReturns.some(fnReturn => fnReturn === true);
		}
		// 如果请求拦截有一个返回true 则会阻止请求接着走下去
		if (requestInterceptPrevent) {
			return;
		}
		const requestKey = `${realConfig.url}_${realConfig.method}`;
		const _this = this;

		// 响应拦截处理
		const responHandle = (res, realConfig) => {
			// 处理响应拦截
			let responInterceptPrevent = false;
			if (_this.responIntercepts.length > 0) {
				const fnReturns = [];
				_this.responIntercepts.forEach((fn) => {
					if (fn) {
						fnReturns.push(fn(res, realConfig))
					}
				})
				responInterceptPrevent = fnReturns.some(fnReturn => fnReturn === true);
			}
			return responInterceptPrevent;
		}

		const requestPromise = new Promise(function(resolve, reject) {
			const requestTask = uni.request({
				...realConfig,
				success: function(res) {
					console.log(`${url}请求拿到的数据:`, res);
					
					// 请求响应拦截。如果响应栏截有一个返回true 则不走余下逻辑
					if (responHandle(res, realConfig)) {
						requestTask.abort();
						return new Promise(()=>{});
					}
					
					if (res && res.statusCode == 200) {
						resolve(res.data);
					} else {
						reject(res);
					}
				},
				fail: function(err) {
					console.log(`${url}请求失败:`, err);
					// 请求响应拦截，如果响应栏截有一个返回true 则不走余下逻辑
					if (responHandle(err, realConfig)) {
						requestTask.abort();
						return new Promise(()=>{});
					}
					reject(err);
				}
			});
		})
    // 请求中断
    requestPromise.cancel = () => {
      requestTask.abort();
    }
    return requestPromise;
	}
}