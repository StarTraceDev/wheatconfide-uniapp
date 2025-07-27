let systemInfo = null;

// 获取状态栏高度
export const getStatusBarHeight = () => {
	return new Promise((resolve, reject) => {
		if (systemInfo) {
			return resolve(systemInfo.statusBarHeight);
		}
		uni.getSystemInfo({
			success(res) {
				systemInfo = res;
				resolve(systemInfo.statusBarHeight);
			},
			fail(err) {
				reject(err);
			}
		})
	})
}

// 获取标题栏高度
export const getTitleBarHeight = () => {
	return new Promise(async (resolve, reject) => {
		try{
			const {statusBarHeight} = await getSystemInfo();
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			resolve(menuButtonInfo.height + (menuButtonInfo.top - statusBarHeight) * 2);
		}catch(err){
			//TODO handle the exception
			reject(err);
		}	
	})
}

// 获取顶部header高度
export const getHeaderBarHeight = () => {
	return new Promise(async (resolve, reject) => {
		const statusBarHeight = await getStatusBarHeight();
		const titleBarHeight = await getTitleBarHeight();
		resolve(statusBarHeight + titleBarHeight);
	})
}

// 获取窗口信息
export const getWindowInfo = () => {
	return new Promise((resolve, reject) => {
		if (systemInfo) {
			const {screenWidth,screenHeight,windowWidth,windowHeight,windowTop,windowBottom} = systemInfo;
			return resolve({
				screenWidth,
				screenHeight,
				windowWidth,
				windowHeight,
				windowTop,
				windowBottom
			});
		}
		uni.getSystemInfo({
			success(res) {
				systemInfo = res;
				const {screenWidth,screenHeight,windowWidth,windowHeight,windowTop,windowBottom} = systemInfo;
				resolve({
					screenWidth,
					screenHeight,
					windowWidth,
					windowHeight,
					windowTop,
					windowBottom
				});
			},
			fail(err) {
				reject(err);
			}
		})
	})
}

// 获取系统信息，同uni.getSystemInfo返回
export const getSystemInfo = () => {
	return new Promise((resolve, reject) => {
		if (systemInfo) {
			return resolve(systemInfo);
		}
		uni.getSystemInfo({
			success(res) {
				systemInfo = res;
				resolve(systemInfo);
			},
			fail(err) {
				reject(err);
			}
		})
	})
}