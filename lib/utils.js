/**
 * 格式化时间戳，按规则显示：
 * - 今天：显示时分（如10:10）
 * - 昨天：显示“昨天”
 * - 超过两天：显示月/日（如10/02）
 * @param {number} timestamp - 秒级时间戳
 * @returns {string} 格式化后的时间字符串
 */
export const formatDate = (timestamp) => {
    const targetDate = new Date(timestamp * 1000);
    const now = new Date(); 

    const padZero = (num) => num.toString().padStart(2, '0');

    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth() + 1; 
    const targetDay = targetDate.getDate();
    const targetHours = targetDate.getHours();
    const targetMinutes = targetDate.getMinutes();

    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth() + 1;
    const nowDay = now.getDate();

    const targetDateStr = `${targetYear}-${padZero(targetMonth)}-${padZero(targetDay)}`;
    const nowDateStr = `${nowYear}-${padZero(nowMonth)}-${padZero(nowDay)}`;

    const yesterday = new Date(now);
    yesterday.setDate(nowDay - 1); 
    const yesterdayYear = yesterday.getFullYear();
    const yesterdayMonth = yesterday.getMonth() + 1;
    const yesterdayDay = yesterday.getDate();
    const yesterdayDateStr = `${yesterdayYear}-${padZero(yesterdayMonth)}-${padZero(yesterdayDay)}`;

    if (targetDateStr === nowDateStr) {
        return `${padZero(targetHours)}:${padZero(targetMinutes)}`;
    } else if (targetDateStr === yesterdayDateStr) {
        return '昨天';
    } else {
        return `${padZero(targetMonth)}/${padZero(targetDay)}`;
    }
};

/**
 * 距当前时间点的时长
 * @prama time 13位时间戳
 * @return str x秒 / x分钟 / x小时
 */
export function formateTime(time) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const now = new Date().getTime();
    const diffValue = now - time;

    // 计算差异时间的量级
    const secondC = diffValue / second;
    const minC = diffValue / minute;
    const hourC = diffValue / hour;
    const dayC = diffValue / day;

    if (dayC >= 1) {
        return parseInt(dayC) + "天";
    } else if (hourC >= 1) {
        return parseInt(hourC) + "小时";
    } else if (minC >= 1) {
        return parseInt(minC) + "分钟";
    } else if (secondC >= 1) {
        return parseInt(secondC) + "秒";
    } else {
        return '0秒';
    }
}

/**
 * 时间格式化工具函数：将"2025-12-11 17:43:42"转为"2025.12"
 * @param {string} timeStr - 原始时间字符串
 * @returns {string} 格式化后的年月字符串（如2025.12）
 */
const formatTimeToYearMonth = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') {
    return '未知时间';
  }
  const datePart = timeStr.split(' ')[0];
  const [year, month] = datePart.split('-');
  if (!year || !month) {
    return '格式错误';
  }
  return `${year}.${month}`;
};

export const handleCareerList = (careerList = []) => {
  return careerList.map((item) => {
    const formattedStartTime = formatTimeToYearMonth(item.startTime);
    const formattedEndTime = formatTimeToYearMonth(item.endTime);
    return {
      title: `${formattedStartTime} - ${formattedEndTime}`, 
      desc: item.career || '无职业信息',
    };
  });
};

/**
 * 根据birthdate（YYYY-MM）判断属于哪个年代（80后、90后、00后等）
 * @param {string} birthdate - 出生年月字符串，格式为"YYYY-MM"（如"1999-06"）
 * @returns {string} 年代描述（如"90后"、"00后"、"格式错误"等）
 */
export const getGenerationByBirthdate = (birthdate) => {
  if (!birthdate || typeof birthdate !== 'string') {
    return '出生年月格式错误';
  }

  const [yearStr, monthStr] = birthdate.split('-');
  if (!yearStr || !monthStr || yearStr.length !== 4 || monthStr.length !== 2) {
    return '出生年月格式错误（需为YYYY-MM）';
  }

  const birthYear = Number(yearStr);
  if (isNaN(birthYear)) {
    return '出生年份不是有效数字';
  }

  if (birthYear >= 1980 && birthYear <= 1989) {
    return '80后';
  } else if (birthYear >= 1990 && birthYear <= 1999) {
    return '90后';
  } else if (birthYear >= 2000 && birthYear <= 2009) {
    return '00后';
  } else if (birthYear >= 2010 && birthYear <= 2019) {
    return '10后';
  } else if (birthYear >= 2020 && birthYear <= 2029) {
    return '20后';
  } else if (birthYear >= 1970 && birthYear <= 1979) {
    return '70后';
  } else {
    return `${Math.floor(birthYear / 10) * 10}后`; 
  }
};

/**
 * 将时间字符串转换为秒级时间戳
 * @param {string} timeStr - 时间字符串，例如 "2025-12-15 16:25:30"
 * @returns {number|null} 秒级时间戳，无效时间返回 null
 */
export const timeStrToSecondTimestamp = (timeStr) => {
  if (typeof timeStr !== 'string' || timeStr.trim() === '') {
    console.error('输入的时间必须是非空字符串');
    return null;
  }

  const isoTimeStr = timeStr.replace(' ', 'T');
  const date = new Date(isoTimeStr);
  const timestampMs = date.getTime();
  if (isNaN(timestampMs)) {
    console.error('输入的时间格式无效，请检查时间字符串');
    return null;
  }

  const timestampSecond = Math.floor(timestampMs / 1000);
  return timestampSecond;
}

// 时间格式化
export const formatTime = (timestamp) =>{
  const date = new Date(timestamp * 1000); // 核心：10位戳 × 1000
  const Y = date.getFullYear();
  const M = (date.getMonth() + 1 + '').padStart(2, '0'); // 月份+1，补0成两位
  const D = (date.getDate() + '').padStart(2, '0'); // 日期补0成两位
  const h = (date.getHours() + '').padStart(2, '0'); // 小时补0成两位
  const m = (date.getMinutes() + '').padStart(2, '0'); // 分钟补0成两位
  const s = (date.getSeconds() + '').padStart(2, '0'); // 秒数补0成两位
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

/**
 * 精准格式化地址：
 * 1. 有省份 → 只显示「xxx省/自治区 • xxx市」 （市以下内容全部移除）
 * 2. 无省份 → 只显示「xxx市 • xxx区/县」    （区/县以下内容全部移除）
 * 3. 兼容四大直辖市特殊格式处理，去重+精准截取
 * 4. 空值/非字符串 安全兜底返回空
 */
export const formatAddress = (addr) => {
  if (!addr || typeof addr !== 'string') return '';
  const address = addr.trim();
  // 单独处理四大直辖市
  const municipalities = ['上海市', '北京市', '天津市', '重庆市'];
  for (const city of municipalities) {
    if (address.startsWith(city)) {
      const replaceAddr = address.replace(city + city, city);
      const cityReg = new RegExp(`(${city})(.*?(区|县|旗))`);
      if (cityReg.test(replaceAddr)) {
        const [, mCity, mArea] = replaceAddr.match(cityReg);
        return `${mCity} • ${mArea}`;
      }
      return city;
    }
  }

  // 有省份的地址【优先级最高
  // 任意省/自治区 + 任意市
  const provinceCityReg = /(.*?(省|自治区))(.*?市)/;
  if (provinceCityReg.test(address)) {
    const [, province, , city] = address.match(provinceCityReg);
    return `${province} • ${city}`;
  }

  // 无省份的地址 
  const cityAreaReg = /(.*?市)(.*?(区|县|旗|镇))/;
  if (cityAreaReg.test(address)) {
    const [, city, area] = address.match(cityAreaReg);
    return `${city} • ${area}`;
  }

  return address;
};

/**
 * 从任意中国地址字符串中提取【城市】
 * @param {String} address 地址字符串（如：北京市北京市丰台区、河北省石家庄市长安区）
 * @returns {String} 提取后的城市名
 */
export const getCityFromAddress = (address) => {
  const reg = /[^\s省市区县盟旗街道镇乡]{2,8}市/g;
  const matchArr = address.match(reg);
  return matchArr ? matchArr[0] : '';
}