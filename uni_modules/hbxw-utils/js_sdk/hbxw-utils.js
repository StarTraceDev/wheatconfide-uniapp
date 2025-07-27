export { selector, selectorAll } from './src/queryinfo.js';
export { 
	getStatusBarHeight,
	getWindowInfo,
	getSystemInfo, 
	getTitleBarHeight, 
	getHeaderBarHeight,
	
} from './src/systemInfo.js';
export * as systemInfo from './src/systemInfo.js';
export { 
	times, 
	plus, 
	minus, 
	divide, 
	round,
  numToMillennials,
  digitUppercase
} from './src/digit.js';
export * as mathApi from './src/digit.js';

export { throttle, debounce } from './src/optimization.js'
export { 
	isEmail,
	isMobile,
	isUrl,
	isDate,
	isDateISO,
	isNumber,
	isString,
	isDigits,
	isIdCard,
	isCarNo,
	isAmount,
	isChinese,
	isLetter,
	isEnOrNum,
	isContains,
	isRange,
	isRangeLength,
	isLandline,
	isEmpty,
	isJsonString,
	isArray,
	isObject,
	isCode,
	isFunc,
	isPromise,
	isImage,
	isVideo,
	isRegExp
} from './src/regexpTest.js';
export * as testApi from './src/regexpTest.js';

export { 
  timeFormat,
  timeFormatToLong, 
  countDownByStartEnd, 
  countDownBytimeStamp,
  countDownHMSMBytimeStamp
 } from './src/date.js';

export { 
	numberFormat, 
	trim, 
	randomArray,
  flattenArray,
  shuffleArray,
	deepClone, 
	deepMerge, 
	transformStyle, 
	getPx, 
	random,
  telSecurity,
  urlParamToJson,
  jsonToUrlParam,
  isEmojiCharacter,
  typeOf,
  safeJSONParse
} from './src/common.js'; 
export * as common from './src/common.js'; 

export { Request } from './src/request.js';

export { storage , LocalStorage } from './src/storage.js';