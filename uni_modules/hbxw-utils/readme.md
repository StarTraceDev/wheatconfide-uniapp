# hbxw-utils
### 说明
开发中常用工具方法封装，如节点获取/高精度计算/类型判断/日期格式化/节流防抖等，提高开发效率，避免无效的造轮子，其中部分方法摘自uview

### 方法列表
#### 节点获取篇
| 方法名         | 功能   | 返回    |
| ------------  | ------------  |  ------------ |
| selector         | uniapp中因为没有domapi,如果想单个获取元素尺寸位置信息可以使用此方法 |   返回一个节点信息,[文挡](https://uniapp.dcloud.net.cn/api/ui/nodes-info.html)    |
| selectorAll        | uniapp中因为没有domapi,如果想批量获取元素尺寸位置信息可以使用此方法 |  批量返回数组节点信息,[文挡](https://uniapp.dcloud.net.cn/api/ui/nodes-info.html#selectorquery-selectall)  |

#### 系统信息篇
| 方法名         | 功能   | 返回    |
| ------------  | ------------  |  ------------ |
| getStatusBarHeight         | 获取状栏栏高度 |  返回状态栏高度,单位px |
| getTitleBarHeight        | 获取titleBar的高度 |  返回当前标题栏的高度,单位px  |
| getHeaderBarHeight        | 获取顶部header的高度，也就是状态栏高度+标题栏的高度 |  返回顶部header高度 |
| getWindowInfo        | 获取当前窗口相关的信息 |  返回当前窗口信息{screenWidth,screenHeight,windowWidth,windowHeight,windowTop,windowBottom},[文挡](https://uniapp.dcloud.net.cn/api/system/info.html#success-%E8%BF%94%E5%9B%9E%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E)  |
| getSystemInfo        | 获取当前设备信息 |  返回当前设备信息,[文挡](https://uniapp.dcloud.net.cn/api/system/info.html#success-%E8%BF%94%E5%9B%9E%E5%8F%82%E6%95%B0%E8%AF%B4%E6%98%8E)  |
| systemInfo        | 上面所有方法的整体导出 |  如要不想一个一个方法的导出，可以直接导入它，再通过.调用上面方法,如systemInfo.getStatusBarHeight() |

#### 精度计算篇
| 方法名         | 功能   | 返回    |
| ------------  | ------------  |  ------------ |
| times         | 高精度乘法 |  返回计算结果，解决js在计算过程的精度问题，如0.1*0.2 |
| plus        | 高精度加法 |  返回计算结果，解决js在计算过程的精度问题，如0.1+0.2  |
| minus        | 高精度减法 |  返回计算结果，解决js在计算过程的精度问题，如0.3-0.1|
| divide        | 高精度除法 | 返回计算结果，解决js在计算过程的精度问题，如0.3/0.1  |
| round        | 高精度四舍五入 |  返回计算结果，解决js在计算过程的精度问题  |
| numToMillennials    | 数字转千分位表示,支持设置保留小数位数 |  返回转换结果，如123456转化为123,456.00  |
| digitUppercase    | 数字转大写金额 |  返回转换结果，如123456.56转化为壹拾贰万叁仟肆佰伍拾陆元伍角陆分  |
| mathApi        | 上面所有方法的整体导出 |  如要不想一个一个方法的导出，可以直接导入它，再通过.调用上面方法,如mathApi.times(0.1,0.2) |

#### 类型判断
| 方法名         | 功能   | 返回    |
| ------------  | ------------  |  ------------ |
| isEmail         | 验证电子邮箱格式 |  返回true/false |
| isMobile        | 验证手机格式 |  返回true/false  |
| isUrl        | 验证URL格式 |  返回true/false  |
| isDate        | 验证日期格式 | 返回true/false  |
| isDateISO        | 验证ISO类型的日期格式 |  返回true/false  |
| isNumber        | 验证十进制数字 |  返回true/false |
| isString        | 验证字符串 |  返回true/false |
| isDigits        | 验证整数 |  返回true/false |
| isIdCard        | 验证身份证号码 |  返回true/false |
| isCarNo        | 是否车牌号 |  返回true/false |
| isAmount        | 金额,只允许2位小数 |  返回true/false |
| isChinese        | 中文 |  返回true/false |
| isLetter        | 只能输入字母 |  返回true/false  |
| isEnOrNum        | 只能是字母或者数字 |  返回true/false  |
| isContains        | 验证是否包含某个值 |  返回true/false |
| isRange        | 验证一个值范围[min, max] |  返回true/false |
| isRangeLength        | 验证一个长度范围[min, max] |  返回true/false |
| isLandline        | 是否固定电话 |  返回true/false |
| isEmpty        | 判断是否为空 |  返回true/false |
| isJsonString        | 是否json字符串 |  返回true/false |
| isArray        | 是否数组 |  返回true/false |
| isObject        | 是否对象 |  返回true/false |
| isCode        | 是否短信验证码 |  返回true/false |
| isFunc        | 是否函数方法 |  返回true/false |
| isPromise        | 是否promise对象 |  返回true/false |
| isImage        | 是否图片格式 |  返回true/false  |
| isVideo        | 是否视频格式 |  返回true/false  |
| isRegExp        | 是否为正则对象 |  返回true/false  |
| testApi        | 上面所有方法的集合 |  返回true/false |


#### 日期格式化篇
| 方法名         | 功能   | 说明    |
| ------------            | ------------  |  ------------ |
|   timeFormat            | 格式化时间 |  时间戳或者时间字符串转换为指定的格式，格式规则为yyyy:mm:dd/yyyy:mm/yyyy年mm月dd日/yyyy年mm月dd日 hh时MM分等,可自定义组合 默认yyyy-mm-dd |
|   timeFormatToLong      | 格式化时间 |  时间戳或者时间字符串转换为多久前,如果是5分钟内则返回刚刚，超过依次返回多少分钟/小时/天/月/年，第二个参数如果传时间格式，当时间间隔超过月的时候会返回指定格式的时间  |
|   countDownByStartEnd   | 倒计时     |  传入结束时间和开始时间，获取一个天时分秒毫秒对象{days，hours， minutes，seconds， milliseconds}  |
|   countDownBytimeStamp  | 倒计时     |  传入一个时间戳，获取一个天时分秒毫秒对象{days，hours， minutes，seconds， milliseconds}  |
|   countDownHMSMBytimeStamp  | 倒计时     |  传入一个时间戳，获取一个时分秒毫秒对象{hours， minutes，seconds， milliseconds}  |

#### 性能优化篇
| 方法名         | 功能   | 说明    |
| ------------  | ------------  |  ------------ |
|   debounce    | 防抖方法 |  一定时间内，只有最后一次操作，再过wait毫秒后才执行函数 |
|   throttle    | 节流方法 |  在一定时间内，只能触发一次  |

#### 本地存储方法封装
| 方法名         | 功能   | 说明    |
| ------------  | ------------  |  ------------ |
|   storage    | 对象的形式支持设置过期时间的设置本地存储方法 | 使用前阅读下代码，查看其下可用api  |
|   LocalStorage    | 类的形式支持设置过期时间的设置本地存储方法 |  使用前阅读下代码，查看其下可用api  |

#### 通用方法篇
| 方法名         | 功能   | 说明    |
| ------------  | ------------  |  ------------ |
|   numberFormat    | 数字格式化 |  把数字转换成千分位形式，返回转换后内容 |
|   trim    | 去除空格 |  去除字符串的空格，支持both(左右)/left/right/all 默认both，返回处理后的字符串  |
|   randomArray    | 打乱数组 |  随机打乱数组，返回打乱后的数组  |
|   flattenArray    | 数组扁平化 |  把多维数组转化为一维数组，返回一维数组，如[1,[2,[3],4,[5,[6]]]]转化为[1,2,3,4,5,6]  |
|   shuffleArray    | 洗牌算法，随机排列数组元素 |  数组随机排序 [ 1, 2,3,4, -1, 0 ] => [3, 1, 0, 2, 4, -1] |
|   deepClone    | 深度克隆 |  返回克隆后的对象或者原值（不是对象）  |
|   deepMerge    | 对象深度合并 |  深度合并后的对象或者false（入参有不是对象）  |
|   transformStyle    | 样式转换 |  对象转字符串，或者字符串转对象  |
|   getPx    | 用于获取用户传递值的px值 |  如果用户传递了"xxpx"或者"xxrpx"，取出其数值部分，如果是"xxxrpx"还需要用过uni.upx2px进行转换  |
|   random    | 取一个区间数 |  返回指区间内的一个随机值  |
|   telSecurity    | 手机号脱敏,支持传递脱敏位数 |  对手机号执行星号脱敏如15632569862转化为156****9862  |
|   urlParamToJson    | url参数转对象 |  url参数字符串转对象 a=1&b=2转为 {a:1,b:2}  |
|   jsonToUrlParam    | JSON对象转换为URL参数 |  json对象转url字符串 {a:1,b:2}转为a=1&b=2  |
|   isEmojiCharacter    | 判断字符串是否有emoji表情 |  返回true/false  |
|   typeOf    | 获取变量的类型 |  typeOf('')  string typeOf(0)  number typeOf() undefined typeOf(null)  null typeOf({})  object typeOf([])  array typeOf(0)  number typeOf(() => {}) function  |
|   safeJSONParse    | trycatch安全处理JSON.parse |  trycatch包裹的JSON.parse，错误返回null  |

#### 请求方法封装 Request
绝大部分项目都要用到请求方法，基于uni.request封装了使用更方便的请求方法

**请求方法特性：**
1. 支持baseUrl设置，如果传的接口本身就是http开头就会跳过baseUrl的添加
2. 支持请求拦截，拦截方法可以添加多个，有一个拦截返回true则请求中断
3. 支持响应拦截，拦截方法可以添加多个，有一个拦截返回true则请求中断
4. 支持请求中断，发起的请求返回Promise上默认都会带上cancel方法，调用它会中断当前请求

请求方法使用示例：
``` js
// utils/request.js
import { Request } from '@/uni_modules/hbxw-utils/js_sdk/hbxw-utils.js';

const request = new Request();

request.baseUrl = '这里是请求的baseUrl';

/**
 * 请求拦截，可以通过add方法添加多个
 * 参数为请求配置，可以对请求参数做一些特殊处理
 */
request.requestIntercept.add((requestConfig) => {
	// 如果有传就用传的，没有就去取，为了解决登录默认token
	if (!requestConfig.header.Authorization) {
		let Authorization = undefined
		try {
			Authorization = '登录token';
		} catch (err) {
			console.log(err)
		}
		// 添加Authorization到header中用于服务端登录判断
		requestConfig.header.Authorization = Authorization;
	}
	// 如果返回true则请求会中断
	// return true;
});

/**
 * 响应拦截，可以通过add方法添加多个
 * 第一个参数为请求响应体
 * 第二个参数为请求配置信息
 */
request.responIntercept.add((response, requestConfig) => {
	// 如果接状态码为401，而且当前接口是需要判断登录状态的
	if (response.statusCode == 401 && requestConfig.isLogin) {
		uni.navigateTo({
			url: '/packageUniversal/login/login?type=' + LOGIN_TYPE.relogin
		})
		// 返回true 中断后面处理
		return true;
	}
});

export default request;
```

推荐单起一个文件管理接口api,登录相关的接口示例代码如下:
 ```js
 import request from "../utils/request.js";
 /**
 * 退出登录
 */
export function loginout () {
	return request.request("/auth/authentication/removeToken")
}


/**
 * 获取用户详情信息
 */
export function getUserDetail () {
	return request.request("/admin/api/user/profile", null,{
		method: "GET",
		isLogin: false
	})
}
 ```

更多有用方法持续更新中。。。，如果你有想要的方法欢迎留言

## 使用示例

``` html
<template>
	<view class="test-wrap">
		<text class="title">系统信息：</text>
		<text>当前状态栏高度: {{statusHeight}}</text>
		<text>当前标题栏高度: {{titleBarHeight}}</text>
		<text>当前headerbar高度: {{headerBarHeight}}</text>
		<view class="test-info"><text>当前窗口尺寸信息: </text><text>{{windowInfo}}</text></view>
		<view class="test-info"><text>当前系统信息: </text><text>{{systemInfo}}</text></view>
		
		<text class="title">节点获取：</text>
		<view class="hbxwutil-test-wrap">
			<view class="test0">1</view>
			<view class="test test1">2</view>
			<view class="test test2">3</view>
		</view>
		<view class="test-info"><text>第1个节点尺寸信息</text><text>{{firstInfo}}</text></view>
		<view class="test-info"><text>第2-3个节点尺寸信息</text><text>{{otherInfo}}</text></view>
		
		<text class="title">精度计算：</text>
		<text>0.1*0.2 = {{0.1*0.2}}</text>
		<text>高精度计算0.1*0.2: {{times}}</text>
		<text>0.1+0.2 = {{0.1+0.2}}</text>
		<text>高精度计算0.1+0.2: {{plus}}</text>
		<text>0.3-0.1 = {{0.3-0.1}}</text>
		<text>高精度计算0.3-0.1: {{minus}}</text>
		<text>0.3/0.2 = {{0.3/0.1}}</text>
		<text>高精度计算0.1/0.2: {{divide}}</text>
		
		<text class="title">时间格式化</text>
		<text>当前时间：{{now}}</text>
		<text>格式化时间：{{timeFormat}}</text>
		<text>多久前：{{timeFormatLong}}</text>
		
		<text class="title">类型检测（列举常用的）</text>
		<text>xiewu5550@163.com是一个邮箱：{{isEmail}}</text>
		<text>15023659632是一个电话号码：{{isMobile}}</text>
		<text>http://www.baidu.com是一个网址：{{isUrl}}</text>
		<text>12.5是一个十进制数字：{{isNumber}}</text>
		<text>'abc'是一个字符串：{{isString}}</text>
		<text>12.5是一个整数：{{isDigits}}</text>
		<text>43265632199563213262是一个身份证号码：{{isIdCard}}</text>
		<text>12.23是一个保留二位数字的金额：{{isAmount}}</text>
		<text>'中文'是一个中文字符串：{{isChinese}}</text>
		
		<text class="title">其它常用方法</text>
		<text>1689.35转换为保留二位小数的千分位结果：{{numberFormat}}</text>
		<text>" 123 560 "去除二端空格结果："{{trim}}"</text>
		<view class="test-info"><text>[1,2,3,4,5]随机打乱结果：</text><text>{{randomArray}}</text></view>
		<view class="test-info"><text>{a:1,b:{bb:1}}深拷贝结果：</text><text>{{deepClone}}</text></view>
		<text>{a:1,b:{bb:1}},{b:{bb:2,c:11}}的深入合并结果：{{deepMerge}}</text>
		<view class="test-info"><text>'width:100rpx;height:100px'转换为样式对象结果：</text><text>{{transformStyle}}</text></view>
		<text>getPx('168rpx')结果：{{getPx}}</text>
		<text>random(10,100)结果：{{random}}</text>
    <button @click="setStorage">调置一个key为test123的5秒过期缓存</button>
    <button @click="getStorage">查看key为test123的缓存</button>
	</view>
</template>

<script>
	import {
		getStatusBarHeight,
		getTitleBarHeight, 
		getHeaderBarHeight,
		getWindowInfo,
		getSystemInfo,
		
		selector,
		selectorAll,
		
		throttle, 
		debounce,
		
		times,
		plus,
		minus, 
		divide, 
		round,
		
		timeFormat,
		timeFormatToLong,
		
		isEmail,
		isMobile,
		isUrl,
		isNumber,
		isString,
		isDigits,
		isIdCard,
		isAmount,
		isChinese,
		testApi,
		
		numberFormat,
		trim,
		randomArray,
		deepClone,
		deepMerge,
		transformStyle,
		getPx,
		random,
    storage
	} from '/uni_modules/hbxw-utils/js_sdk/hbxw-utils.js';
	export default {
		data() {
			return {
				statusHeight: 0,
				titleBarHeight: 0,
				headerBarHeight: 0,
				windowInfo: null,
				systemInfo: null,
				
				
				firstInfo: null,
				otherInfo: null,
				
				times: 0,
				plus: 0,
				minus: 0,
				divide: 0,
				round: 0,
				
				now: '',
				timeFormat: '',
				timeFormatLong: '',
				
				isEmail: false,
				isMobile: false,
				isUrl: false,
				isNumber: false,
				isString: false,
				isDigits: false,
				isIdCard: false,
				isAmount: false,
				isChinese: false,
				
				numberFormat: '',
				trim: '',
				randomArray: null,
				deepClone: null,
				deepMerge: null,
				transformStyle: null,
				getPx: null,
				random: null
			}
		},
		onPageScroll() {
			// 防抖 节流
			throttle(() => console.log('---- onPageScroll ----:throttle') , 500);
			debounce(() => console.log('---- onPageScroll ----:debounce') , 500);
		},
		mounted() {
			getStatusBarHeight().then((res) => this.statusHeight = res);
			getTitleBarHeight().then((res) => this.titleBarHeight = res);
			getHeaderBarHeight().then((res) => this.headerBarHeight = res);
			getWindowInfo().then((res) => this.windowInfo = res);
			getSystemInfo().then((res) => this.systemInfo = res);
			
			selector('.test0', this).then((res) => this.firstInfo = res);
			selectorAll('.test', this).then((res) => this.otherInfo = res);
			
			this.times = times(.1,.2);
			this.plus = plus(.1,.2);
			this.minus = minus(.3,.1);
			this.divide = divide(.3,.1);
			this.round = round(0.1+0.2, 2);
			
			this.now = new Date();
			this.timeFormat = timeFormat(this.now, 'yyyy-mm-dd hh:MM:ss');
			this.timeFormatLong = timeFormatToLong(new Date(new Date().setDate(5)));
			
			this.isEmail = isEmail('xiewu5550@163.com')
			this.isMobile = isMobile('15023659632');
			this.isUrl = isUrl('http://www.baidu.com');
			this.isNumber = isNumber(12);
			this.isString = isString('abc');
			this.isDigits = isDigits(12.2);
			this.isIdCard = isIdCard(43265632199563213262);
			this.isAmount = isAmount(12.23);
			this.isChinese = isChinese('中文');
			const isdate = testApi.isDate(new Date())
			console.log('isdate: ',isdate);
			
			this.numberFormat = numberFormat(1689.35, 2);
			this.trim = trim(' 123 560 ');
			this.randomArray = randomArray([1,2,3,4,5]);
			this.deepClone = deepClone({a:1,b:{bb:1}});
			this.deepMerge = deepMerge({a:1,b:{bb:1}},{b:{bb:2,c:11}});
			this.transformStyle = transformStyle('width:100rpx;height:100px');
			this.getPx = getPx('168rpx');
			this.random = random(10,100)
		},
		methods: {
			setStorage() {
        storage.set({
          key: 'test123',
          value: '我是5s后过期的缓存',
          expiresTime: 5
        })
      },
      getStorage() {
        // 5s秒内和5杪是能查到的
        console.log('---- getStorage ----:',  storage.get('test123'));
      }
		}
	}
</script>

<style lang="scss" scoped>
.hbxwutil-test-wrap{
	display: flex;
	.test0,.test1,.test2{
		width: 168rpx;
		height: 168rpx;
		margin-right: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;;
		color: #fff;
		background-color: red;
	}
	.test1{
		height: 268rpx;
	}
	.test2{
		width: 68rpx;
	}
}
.test-info{
	display: flex;
}
.test-wrap{
	width: 100%;
	display: flex;
	flex-direction: column;
}
.title{
	font-size: 28rpx;
	text-align: center;
	font-weight: bold;
	margin: 20rpx 0;
}
</style>

```