/**
 * @description 格式化时间
 * @param {String|Number} dateTime 需要格式化的时间戳，毫秒/时间字符串等
 * @param {String} fmt 格式化规则 yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合 默认yyyy-mm-dd
 * @returns {string} 返回格式化后的字符串
 */
 export function timeFormat(dateTime = null, formatStr = 'yyyy-mm-dd') {
  let date
	// 若传入时间为假值，则取当前时间
  if (!dateTime) {
    date = new Date()
  }
  // 若用户传入字符串格式时间戳，new Date无法解析，需做兼容
  else if (typeof dateTime === 'string' && /^\d+$/.test(dateTime.trim())) {
    date = new Date(Number(dateTime))
  }
	// 处理平台性差异，在Safari/Webkit中，new Date仅支持/作为分割符的字符串时间
	// 处理 '2022-07-10 01:02:03'，跳过 '2022-07-10T01:02:03'
	else if (typeof dateTime === 'string' && dateTime.includes('-') && !dateTime.includes('T')) {
		date = new Date(dateTime.replace(/-/g, '/'))
	}
	// 其他都认为符合 RFC 2822 规范
	else {
		date = new Date(dateTime)
	}

	const timeSource = {
		'y': date.getFullYear().toString(), // 年
		'm': (date.getMonth() + 1).toString().padStart(2, '0'), // 月
		'd': date.getDate().toString().padStart(2, '0'), // 日
		'h': date.getHours().toString().padStart(2, '0'), // 时
		'M': date.getMinutes().toString().padStart(2, '0'), // 分
		's': date.getSeconds().toString().padStart(2, '0') // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	}

  for (const key in timeSource) {
    const [ret] = new RegExp(`${key}+`).exec(formatStr) || []
    if (ret) {
      // 年可能只需展示两位
      const beginIndex = key === 'y' && ret.length === 2 ? 2 : 0
      formatStr = formatStr.replace(ret, timeSource[key].slice(beginIndex))
    }
  }

  return formatStr
}

/**
 * @description 时间转为多久之前
 * @param {String|Number} dateTime 需要格式化的时间戳，毫秒/时间字符串等
 * @param {String|Boolean} format
 * 格式化规则如果为时间格式字符串，超出一定时间范围，返回固定的时间格式；
 * 如果为布尔值false，无论什么时间，都返回多久以前的格式
 * @returns {string} 转化后的内容
 */
export function timeFormatToLong(dateTime = null, format = 'yyyy-mm-dd') {
	let date
	// 若传入时间为假值，则取当前时间
	if (!dateTime) {
	  date = new Date()
	}
	// 若用户传入字符串格式时间戳，new Date无法解析，需做兼容
	else if (typeof dateTime === 'string' && /^\d+$/.test(dateTime.trim())) {
	  date = new Date(Number(dateTime))
	}
	// 处理平台性差异，在Safari/Webkit中，new Date仅支持/作为分割符的字符串时间
	// 处理 '2022-07-10 01:02:03'，跳过 '2022-07-10T01:02:03'
	else if (typeof dateTime === 'string' && dateTime.includes('-') && !dateTime.includes('T')) {
		date = new Date(dateTime.replace(/-/g, '/'))
	}
	// 其他都认为符合 RFC 2822 规范
	else {
		date = new Date(dateTime)
	}
	let timer = (new Date()).getTime() - date.getTime();
	timer = parseInt(timer / 1000)
	// 如果小于5分钟,则返回"刚刚",其他以此类推
	let tips = ''
	switch (true) {
		case timer < 300:
			tips = '刚刚'
			break
		case timer >= 300 && timer < 3600:
			tips = `${parseInt(timer / 60)}分钟前`
			break
		case timer >= 3600 && timer < 86400:
			tips = `${parseInt(timer / 3600)}小时前`
			break
		case timer >= 86400 && timer < 2592000:
			tips = `${parseInt(timer / 86400)}天前`
			break
		default:
			// 如果format为false，则无论什么时间戳，都显示xx之前
			if (format === false) {
				if (timer >= 2592000 && timer < 365 * 86400) {
					tips = `${parseInt(timer / (86400 * 30))}个月前`
				} else {
					tips = `${parseInt(timer / (86400 * 365))}年前`
				}
			} else {
				tips = timeFormat(timestamp, format)
			}
	}
	return tips
}

function padStart(number) {
  return number > 9 ? number : '0' + number;
}

/**
 * 倒计时函数
 * @param {string|number} end 
 * @param {string|number} start 
 * @param {boolean} isPadStart 
 * @returns 
 */
export function countDownByStartEnd(end, start, isPadStart){
  const endtime = new Date(end);
  const nowtime = new Date(start);
  if (nowtime >= endtime) {
    return null;
  }
  const leftmillisecond = endtime.getTime() - nowtime.getTime();
  const leftsecond = parseInt(leftmillisecond / 1000);
  if (leftsecond < 0) {
    leftsecond = 0;
  }
  const days = parseInt(leftsecond / 3600 / 24);
  const hours = parseInt((leftsecond / 3600) % 24);
  const minutes = parseInt((leftsecond / 60) % 60); 
  const seconds = parseInt(leftsecond % 60);
  const milliseconds = leftmillisecond % 1000;
  return {
    days: isPadStart ? padStart(days) : days,
    hours: isPadStart ? padStart(hours) : hours,
    minutes: isPadStart ? padStart(minutes) : minutes,
    seconds: isPadStart ? padStart(seconds) : seconds,
    milliseconds: isPadStart ? padStart(milliseconds) : milliseconds
  }
}

/**
 * 倒计时函数
 * @param {number} timeStamp 
 * @param {boolean} isPadStart
 * @returns 
 */
export function countDownBytimeStamp(timeStamp, isPadStart){
  let leftsecond = parseInt(timeStamp / 1000);
  if (leftsecond < 0) {
    leftsecond = 0;
  }
  const days = parseInt(leftsecond / 3600 / 24);
  const hours = parseInt((leftsecond / 3600) % 24);
  const minutes = parseInt((leftsecond / 60) % 60); 
  const seconds = parseInt(leftsecond % 60);
  const milliseconds = timeStamp % 1000;
  return {
    days: isPadStart ? padStart(days) : days,
    hours: isPadStart ? padStart(hours) : hours,
    minutes: isPadStart ? padStart(minutes) : minutes,
    seconds: isPadStart ? padStart(seconds) : seconds,
    milliseconds: isPadStart ? padStart(milliseconds) : milliseconds
  }
}

/**
 * 倒计时函数
 * @param {number} timeStamp 
 * @param {boolean} isPadStart
 * @returns 
 */
export function countDownHMSMBytimeStamp(timeStamp, isPadStart){
  let leftsecond = parseInt(timeStamp / 1000);
  if (leftsecond < 0) {
    leftsecond = 0;
  }
  const hours = parseInt(leftsecond / 3600);
  const minutes = parseInt((leftsecond / 60) % 60); 
  const seconds = parseInt(leftsecond % 60);
  const milliseconds = timeStamp % 1000;
  return {
    hours: isPadStart ? padStart(hours) : hours,
    minutes: isPadStart ? padStart(minutes) : minutes,
    seconds: isPadStart ? padStart(seconds) : seconds,
    milliseconds: isPadStart ? padStart(milliseconds) : milliseconds
  }
}