import { isNumber, isEmpty } from './regexpTest.js'
import { round } from './digit.js'

/**
 * @description 数字格式化
 * @param {number|string} number 要格式化的数字
 * @param {number} decimals 保留几位小数
 * @param {string} decimalPoint 小数点符号
 * @param {string} thousandsSeparator 千分位符号
 * @returns {string} 格式化后的数字
 */
export function numberFormat(number, decimals = 0, decimalPoint = '.', thousandsSeparator = ',') {
	number = (`${number}`).replace(/[^0-9+-Ee.]/g, '')
	const n = !isFinite(+number) ? 0 : +number
	const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
	const sep = (typeof thousandsSeparator === 'undefined') ? ',' : thousandsSeparator
	const dec = (typeof decimalPoint === 'undefined') ? '.' : decimalPoint
	let s = ''

	s = (prec ? round(n, prec) + '' : `${Math.round(n)}`).split('.')
	const re = /(-?\d+)(\d{3})/
	while (re.test(s[0])) {
		s[0] = s[0].replace(re, `$1${sep}$2`)
	}

	if ((s[1] || '').length < prec) {
		s[1] = s[1] || ''
		s[1] += new Array(prec - s[1].length + 1).join('0')
	}
	return s.join(dec)
}

/**
 * @description 去除空格
 * @param String str 需要去除空格的字符串
 * @param String pos both(左右)|left|right|all 默认both
 */
export function trim(str, pos = 'both') {
	str = String(str)
	if (pos == 'both') {
		return str.replace(/^\s+|\s+$/g, '')
	}
	if (pos == 'left') {
		return str.replace(/^\s*/, '')
	}
	if (pos == 'right') {
		return str.replace(/(\s*$)/g, '')
	}
	if (pos == 'all') {
		return str.replace(/\s+/g, '')
	}
	return str
}

/**
 * @description 打乱数组
 * @param {array} array 需要打乱的数组
 * @param {isClone} boolean 需要需要克隆原数组,是否影响原数组
 * @returns {array} 打乱后的数组
 */
export function randomArray(array = [], isClone = true) {
	let arraySource = array;
	if (isClone) {
		arraySource = deepClone(array)
	}
	// 原理是sort排序,Math.random()产生0<= x < 1之间的数,会导致x-0.5大于或者小于0
	return arraySource.sort(() => Math.random() - 0.5)
}

/**
 * @description 数组扁平化
 * @param {array} arr 需要扁平化的数组
 */
export const flattenArray = (arr) => {
  let result = [];

  for(let i = 0; i < arr.length; i++) {
    if(Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

/**
 * @description 深度克隆
 * @param {object} obj 需要深度克隆的对象
 * @param cache 缓存
 * @returns {*} 克隆后的对象或者原值（不是对象）
 */
export function deepClone(obj, cache = new WeakMap()) {
	if (obj === null || typeof obj !== 'object') return obj;
	if (cache.has(obj)) return cache.get(obj);
	let clone;
	if (obj instanceof Date) {
		clone = new Date(obj.getTime());
	} else if (obj instanceof RegExp) {
		clone = new RegExp(obj);
	} else if (obj instanceof Map) {
		clone = new Map(Array.from(obj, ([key, value]) => [key, deepClone(value, cache)]));
	} else if (obj instanceof Set) {
		clone = new Set(Array.from(obj, value => deepClone(value, cache)));
	} else if (Array.isArray(obj)) {
		clone = obj.map(value => deepClone(value, cache));
	} else if (Object.prototype.toString.call(obj) === '[object Object]') {
		clone = Object.create(Object.getPrototypeOf(obj));
		cache.set(obj, clone);
		for (const [key, value] of Object.entries(obj)) {
			clone[key] = deepClone(value, cache);
		}
	} else {
		clone = Object.assign({}, obj);
	}
	cache.set(obj, clone);
	return clone;
}

/**
 * @description 对象深度合并
 * @param {object} target 需要拷贝的对象
 * @param {object} source 拷贝的来源对象
 * @returns {object|boolean} 深度合并后的对象或者false（入参有不是对象）
 */
export function deepMerge(target = {}, source = {}) {
	target = deepClone(target)
	if (typeof target !== 'object' || target === null || typeof source !== 'object' || source === null) return target;
	const merged = Array.isArray(target) ? target.slice() : Object.assign({}, target);
	for (const prop in source) {
		if (!source.hasOwnProperty(prop)) continue;
		const sourceValue = source[prop];
		const targetValue = merged[prop];
		if (sourceValue instanceof Date) {
			merged[prop] = new Date(sourceValue);
		} else if (sourceValue instanceof RegExp) {
			merged[prop] = new RegExp(sourceValue);
		} else if (sourceValue instanceof Map) {
			merged[prop] = new Map(sourceValue);
		} else if (sourceValue instanceof Set) {
			merged[prop] = new Set(sourceValue);
		} else if (typeof sourceValue === 'object' && sourceValue !== null) {
			merged[prop] = deepMerge(targetValue, sourceValue);
		} else {
			merged[prop] = sourceValue;
		}
	}
	return merged;
}

/**
 * @description 样式转换
 * 对象转字符串，或者字符串转对象
 * @param {object | string} customStyle 需要转换的目标
 * @param {String} target 转换的目的，object-转为对象，string-转为字符串
 * @returns {object|string}
 */
export function transformStyle(customStyle, target = 'object') {
	// 字符串转字符串，对象转对象情形，直接返回
	if (isEmpty(customStyle) || typeof(customStyle) === 'object' && target === 'object' || target === 'string' &&
		typeof(customStyle) === 'string') {
		return customStyle
	}
	// 字符串转对象
	if (target === 'object') {
		// 去除字符串样式中的两端空格(中间的空格不能去掉，比如padding: 20px 0如果去掉了就错了)，空格是无用的
		customStyle = trim(customStyle)
		// 根据";"将字符串转为数组形式
		const styleArray = customStyle.split(';')
		const style = {}
		// 历遍数组，拼接成对象
		for (let i = 0; i < styleArray.length; i++) {
			// 'font-size:20px;color:red;'，如此最后字符串有";"的话，会导致styleArray最后一个元素为空字符串，这里需要过滤
			if (styleArray[i]) {
				const item = styleArray[i].split(':')
				style[trim(item[0])] = trim(item[1])
			}
		}
		return style
	}
	// 这里为对象转字符串形式
	let string = ''
	for (const i in customStyle) {
		// 驼峰转为中划线的形式，否则css内联样式，无法识别驼峰样式属性名
		const key = i.replace(/([A-Z])/g, '-$1').toLowerCase()
		string += `${key}:${customStyle[i]};`
	}
	// 去除两端空格
	return trim(string)
}

/**
 * @description 用于获取用户传递值的px值  如果用户传递了"xxpx"或者"xxrpx"，取出其数值部分，如果是"xxxrpx"还需要用过uni.upx2px进行转换
 * @param {number|string} value 用户传递值的px值
 * @param {boolean} unit
 * @returns {number|string}
 */
export function getPx(value, unit = false) {
	if (isNumber(value)) {
		return unit ? `${value}px` : Number(value)
	}
	// 如果带有rpx，先取出其数值部分，再转为px值
	if (/(rpx|upx)$/.test(value)) {
		return unit ? `${uni.upx2px(parseInt(value))}px` : Number(uni.upx2px(parseInt(value)))
	}
	return unit ? `${parseInt(value)}px` : parseInt(value)
}


/**
 * @description 取一个区间数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
export function random(min, max) {
	if (min >= 0 && max > 0 && max >= min) {
		const gab = max - min + 1
		return Math.floor(Math.random() * gab + min)
	}
	return 0
}

/**
 * @description 手机号脱敏
 * @param {Number} tel 要脱敏的手机号
 * @param {Number} digit 脱敏的位数
 */
export const telSecurity = (tel, digit = 4) => {
  	tel = String(tel); 
    return tel.substr(0,3) + "*".repeat(digit) + tel.substr(3+digit);
};

/**
 * @description url参数转对象
 * @param {string} paramsStr url参数字符串
 */
export const urlParamToJson = (urlParam) => {
    let json = {};
    urlParam.trim()
      .split('&')
      .forEach(item => json[item.split('=')[0]] = item.split('=')[1]);
    return json;
}

/**
 * @description JSON对象转换为URL参数
 * @param {object} json json对象
 */
export const jsonToUrlParam = (json) => {
  return Object.keys(json).map(key => key + '=' + json[key]).join('&');
}

/**
 * @description 判断字符串是否有emoji表情
 * @param {string} value 要判断的字符串 
 */
export const isEmojiCharacter = (value) => {
  value = String(value);
  for (let i = 0; i < value.length; i++) {
    const hs = value.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (value.length > 1) {
        const ls = value.charCodeAt(i + 1);
        const uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (value.length > 1) {
      const ls = value.charCodeAt(i + 1);
      if (ls == 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2B05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
          || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
          || hs == 0x2b50) {
        return true;
      }
    }
  }
  return false;
}

/**
 * @description 获取变量的类型
 * @param {any} obj 要判断的这是 
 */
export const typeOf = (obj) => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();

/**
 * @description 洗牌算法，随机排列数组元素
 * @param {array} array 要打乱的数组
 */
export const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

/**
 * @description trycatch安全处理JSON.parse
 * @param {string} str 要执行JSON.parse的json字符串
 */
export const safeJSONParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};