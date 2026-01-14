/**
 * 消息时间处理工具类
 * 功能：格式化消息时间、判断是否显示时间戳
 */

/**
 * 工具函数：获取指定日期的0点时间戳（毫秒）
 * @param {Date} date - 目标日期，默认当前日期
 * @returns {number} 当天0点的毫秒时间戳
 */
export const getDayStartTimestamp = (date = new Date()) => {
  // 防御：确保是有效的Date对象
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    date = new Date();
  }
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return new Date(year, month, day).getTime();
};

/**
 * 格式化消息时间
 * @param {number|string} timestamp - 消息时间戳（秒级）
 * @returns {string} 格式化后的时间（今天：HH:mm | 昨天：昨天 HH:mm | 更早：MM-DD HH:mm）
 */
export const formatMessageTime = (timestamp) => {
  // 防御1：校验timestamp有效性
  if (!timestamp || isNaN(Number(timestamp))) {
    return "未知时间";
  }

  // 秒转毫秒
  const msgTime = Number(timestamp) * 1000;
  const msgDate = new Date(msgTime);

  // 防御2：校验Date对象有效性
  if (isNaN(msgDate.getTime())) {
    return "未知时间";
  }

  // 提取时分（复用逻辑）
  const getHHMM = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // 计算时间边界
  const now = Date.now();
  const todayStart = getDayStartTimestamp();
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

  // 今天的消息
  if (msgTime >= todayStart) {
    return getHHMM(msgDate);
  }

  // 昨天的消息
  if (msgTime >= yesterdayStart && msgTime < todayStart) {
    return `昨天 ${getHHMM(msgDate)}`;
  }

  // 更早的消息
  const month = (msgDate.getMonth() + 1).toString().padStart(2, '0');
  const day = msgDate.getDate().toString().padStart(2, '0');
  return `${month}-${day} ${getHHMM(msgDate)}`;
};

/**
 * 判断消息是否需要显示时间戳
 * @param {number} index - 当前消息在列表中的索引
 * @param {Array} messageList - 消息列表数组
 * @returns {boolean} 是否显示时间
 */
export const shouldShowTime = (index, messageList) => {
  // 防御1：校验消息列表是否为有效数组
  if (!Array.isArray(messageList) || messageList.length === 0) {
    return false;
  }

  // 防御2：校验索引是否越界
  if (index < 0 || index >= messageList.length) {
    return false;
  }

  // 第一条消息必显示
  if (index === 0) {
    return true;
  }

  // 防御3：校验当前/上一条消息是否存在且有time字段
  const currentMsg = messageList[index];
  const prevMsg = messageList[index - 1];
  if (!currentMsg || !prevMsg || !currentMsg.time || !prevMsg.time) {
    return true; // 数据异常时兜底显示
  }

  // 转换为毫秒时间戳
  const currentTime = Number(currentMsg.time) * 1000;
  const prevTime = Number(prevMsg.time) * 1000;

  // 计算时间差（分钟）
  const timeDiff = (currentTime - prevTime) / (60 * 1000);

  // 判断是否同一天
  const isSameDay = (time1, time2) => {
    if (isNaN(time1) || isNaN(time2)) return false;
    return getDayStartTimestamp(new Date(time1)) === getDayStartTimestamp(new Date(time2));
  };

  // 显示规则：间隔超5分钟 或 跨日期
  return timeDiff > 5 || !isSameDay(currentTime, prevTime);
};

// 导出所有方法（兼容不同导入方式）
export default {
  getDayStartTimestamp,
  formatMessageTime,
  shouldShowTime
};