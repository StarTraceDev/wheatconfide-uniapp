// 支持设置过期时间的本地存储
export const storage = {
	get(key, defaultValue = null) {
		const store = uni.getStorageSync(key)
		try {
			const object = JSON.parse(store)
			if (object.expiresTime) {
				const currentTime = new Date().getTime()
				if (currentTime - object.startTime > object.expiresTime) {
					uni.removeStorageSync(key)
					return defaultValue;
				} else {
					return object.value
				}
			} else {
				return object.value
			}
		} catch (err) {
      console.log('---- storage get ----:'+key, err);
			return defaultValue;
		}
	},
  
  // expiresTime为过期的秒
	set({ key, value, expiresTime }) {
    try {
      const object = { key, value, expiresTime: expiresTime * 1000, startTime: new Date().getTime() }
      uni.setStorageSync(key, JSON.stringify(object))
    } catch (err){
    	console.log('---- setStorageSync ----:'+key, err);
    }
	},
	remove(key) {
		try {
			uni.removeStorageSync(key)
		} catch (e) {
			console.log(e)
		}
	},
	clear() {
    try {
      uni.clearStorageSync();
    } catch (err){
    	console.log('---- clearStorageSync ----', err);
    }
	}
}

// 本地缓存
export class LocalStorage {
  defaultExpired = 0; // 默认过期秒数
  
  constructor(options) {
    if (options) {
      if (options.defaultExpired) {
        this.defaultExpired = options.defaultExpired
      }
    }
  }
  
  // 设置本地缓存，expiredSeconds过期秒数
	setItem(key, value, expiredSeconds) {
    const now = Date.now();
    let expired = 0;
    // 有设置默认过期时间才处理过期时间
    if (this.defaultExpired) {
      expired = now + 1000 * this.defaultExpired; // 默认过期时间
    }

    // 这里我们限定了 expired 和 maxAge 都是 number 类型，
    if (expiredSeconds) {
      expired = now + expiredSeconds * 1000;
    }
    try {
      uni.setStorageSync(key, expired ? { value, expired } : value);
    } catch (err){
    	console.log('---- uni.setStorageSync ----:'+key, err);
    }
  }

  getItem(key) {
    let result = null;
    // 防错
    try {
      result = uni.getStorageSync(key);
    }
    catch(err){}
    if (!result) {
      // 若key本就不存在，直接返回null
      return null;
    }
    let value = null, expired = null;
    // 支持获取未设置过期时间的本地存储
		if (typeof result === 'object') {
			if (result && result.value && result.expired) {
			  value = result.value;
			  expired = result.expired;
			}
		}
    if (expired) {
      if (Date.now() <= expired) {
        // 还没过期，返回存储的值
        return value;
      } else {
        // 已过期，删除该key，然后返回null
        this.removeItem(key);
        return null;
      }
    }
    return result;
  }

  // 删除key
  removeItem(key) {
    try {
      uni.removeStorageSync(key);
    } catch (err){
    	console.log('---- uni.removeStorageSync ----:'+key, err);
    }
  }

  // 清除所有过期的key
  clearAllExpired() {
    let num = 0;

    // 判断 key 是否过期，然后删除
    const delExpiredKey = (key, value) => {
      if (value) {
        let expired = -1;
        try {
          const valueObj = JSON.parse(value);
          if (valueObj && valueObj.expired) {
            expired = valueObj.expired;
          }
        }
        catch(err){
          console.log('---- JSON.parse ----:', value, err);
        }
        // expired为-1要么是没有设置过期的，要么是parse出错的
        if (expired === -1) {
          return 0;
        }
        if (Date.now() > expired) {
          try {
            // 已过期
            uni.removeStorageSync(key);
          } catch (err){
          	console.log('---- uni.removeStorageSync ----:'+key, err);
          }
          return 1;
        }
      } else {
        try {
          // 若 value 无值，则直接删除
          uni.removeStorageSync(key);
        } catch (err){
        	console.log('---- uni.removeStorageSync ----:'+key, err);
        }
        return 1;
      }
      return 0;
    };

    const { keys } = uni.getStorageInfoSync();
		const length = keys?.length;
    for (let i = 0; i < length; i++) {
      const key = keys[i];

      if (key) {
        try {
          const value = uni.getStorageSync(key);
          num += delExpiredKey(key, value);
        } catch (err){
        	console.log('---- uni.getStorageSync ----:'+key, err);
        }
      }
    }
    return num;
  }
  // 清除所有缓存
  clear() {
    try {
      uni.clearStorageSync();
    } catch (err){
    	console.log('---- clearStorageSync ----', err);
    }
  }
}