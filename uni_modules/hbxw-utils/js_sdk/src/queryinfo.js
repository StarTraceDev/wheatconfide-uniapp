// 获取单个元素节点信息,在组件中获取需要传obj当前实例过去，页面中获取不需要
export const selector = (selector, obj=null) => {
	return new Promise((resolve, reject) => {
		try{
			const query = obj ? uni.createSelectorQuery().in(obj) : uni.createSelectorQuery();
			query.select(selector).boundingClientRect((data) => {
				resolve(data);
			}).exec();
		}catch(err){
			reject(err)
		}
	})
}

// 获取多个元素节点信息
export const selectorAll = (selector, obj=null) => {
	return new Promise((resolve, reject) => {
		try{
			const query = obj ? uni.createSelectorQuery().in(obj) : uni.createSelectorQuery();
			query.selectAll(selector).boundingClientRect((data) => {
				resolve(data);
			}).exec();
		}catch(err){
			reject(err)
		}
	})
}