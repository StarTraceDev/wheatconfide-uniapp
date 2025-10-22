<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed, watch, nextTick, getCurrentInstance } from 'vue';

// 定义类型
interface DanmuItem {
  id: string | number;
  text: string;
  color?: string;
  fontSize?: number;
  avatar?: string;
  username?: string;
  userId?: string | number;
  time?: number;
  trackId?: number;
  type?: string;
  duration?: number;
  extraData?: Record<string, any>;
  // 内部属性
  createTime?: number;
  top?: number;
  visible?: boolean;
  animationEnded?: boolean;
  animation?: Animation;
  customAnimationName?: string;
}

interface Animation {
  duration: number;
  timingFunction: string;
  keyframes: Array<Record<string, any>>;
}

interface Track {
  id: number;
  height: number;
  danmus: DanmuItem[];
}

interface DanmuTypeConfig {
  createAnimation: (danmu: DanmuItem, track?: Track) => Animation;
  render?: (h: any, danmu: DanmuItem) => any;
}

interface DanmuConfig {
  trackHeight?: number;
  trackNumber?: number;
  speed?: number;
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
  trackMode?: string;
  looping?: boolean;
  direction?: string;
  duration?: number;
  density?: number;
  randomTrack?: boolean;
  blockEnabled?: boolean;
  blockWords?: string[];
  blockUsers?: (string | number)[];
  clickable?: boolean;
  opacity?: number;
  hoverPause?: boolean;
  maxTextLength?: number;
  allowLineBreak?: boolean;
}

interface Plugin {
  name?: string;
  install: (context: any) => void;
}

// 声明uni类型，避免TypeScript错误
declare const uni: any;

// 定义组件属性
const props = defineProps({
  // 弹幕数据
  danmuList: { type: Array as () => DanmuItem[], default: () => [] },
  
  // 配置对象
  config: { type: Object as () => DanmuConfig, default: () => ({}) },
  
  // 自动播放
  autoplay: { type: Boolean, default: true },
  
  // 最大弹幕数量
  maxNumber: { type: Number, default: 100 },
  
  // z-index
  zIndex: { type: Number, default: 10 }
});

// 定义事件
const emit = defineEmits([
  'send',    // 发送弹幕
  'click',   // 点击弹幕
  'enter',   // 弹幕进入
  'leave',   // 弹幕离开
  'play',    // 播放
  'pause',   // 暂停
  'clear'    // 清空
]);

// 获取组件实例
const instance = getCurrentInstance();

// 默认配置
const defaultConfig: DanmuConfig = {
  trackHeight: 40,         // 轨道高度
  trackNumber: 5,          // 轨道数量
  speed: 100,              // 弹幕速度（像素/秒）
  fontSize: 16,            // 默认字体大小
  fontColor: '#ffffff',    // 默认字体颜色
  backgroundColor: 'transparent', // 弹幕背景颜色
  trackMode: 'overlap',    // 轨道模式: 'overlap', 'separate', 'fixed'
  looping: false,          // 是否循环播放
  direction: 'rtl',        // 弹幕方向: 'rtl', 'ltr'
  duration: 8000,          // 动画持续时间(ms)
  density: 0.5,            // 弹幕密度(0-1)
  randomTrack: true,       // 是否随机选择轨道
  blockEnabled: false,     // 是否启用弹幕屏蔽功能
  blockWords: [],          // 屏蔽词列表
  blockUsers: [],          // 屏蔽用户ID列表
  clickable: true,         // 弹幕是否可点击
  opacity: 1,              // 弹幕透明度
  hoverPause: false,       // 鼠标悬停时是否暂停
  maxTextLength: 50,       // 添加最大文本长度限制
  allowLineBreak: false,   // 默认不允许换行
};

// 合并配置
const mergedConfig = computed(() => {
  return Object.assign({}, defaultConfig, props.config) as DanmuConfig;
});

// 状态管理
const containerRef = ref(null);
const containerWidth = ref(0);
const containerHeight = ref(0);
const activeDanmus = ref<DanmuItem[]>([]);
const isPlaying = ref(false);
const trackList = ref<Track[]>([]);
const danmuTypes = reactive<Record<string, DanmuTypeConfig>>({});
const pluginContext = reactive({
  mergedConfig, // 提供配置给插件
  containerWidth, // 提供容器宽度给插件
  containerHeight // 提供容器高度给插件
});
const animationFrameId = ref<number | null>(null);
const lastTimestamp = ref(0);

// 轨道管理
const initTracks = () => {
  trackList.value = Array.from({ length: mergedConfig.value.trackNumber || 5 }, (_, index) => ({
    id: index,
    height: mergedConfig.value.trackHeight || 40,
    danmus: []
  }));
};

// 初始化容器尺寸
const initContainerSize = () => {
  if (!containerRef.value) return;
  
  const query = uni.createSelectorQuery().in(instance?.proxy);
  query.select('.gp-danmu-container')
    .boundingClientRect(rect => {
      if (rect) {
        containerWidth.value = rect.width;
        containerHeight.value = rect.height;
        
        // 确保当容器尺寸改变时，相关组件也能获取到最新尺寸
        if (pluginContext) {
          pluginContext.containerWidth = containerWidth.value;
          pluginContext.containerHeight = containerHeight.value;
        }
      }
    }).exec();
};

// 注册默认弹幕类型
const registerDefaultDanmuTypes = () => {
  // 滚动弹幕
  registerDanmuType('scroll', {
    createAnimation(danmu, trackInfo) {
      const direction = mergedConfig.value.direction;
      const duration = calculateDuration(danmu);
      const danmuWidth = calculateDanmuWidth(danmu);
      
      // 修改起始位置和结束位置计算，确保弹幕完全滚出屏幕
      const startX = direction === 'rtl' ? containerWidth.value : -danmuWidth;
      // 使用120%的宽度确保弹幕完全滚出屏幕
      const endX = direction === 'rtl' ? -danmuWidth - (danmuWidth * 0.2) : containerWidth.value + (danmuWidth * 0.2);
      
      return {
        duration,
        timingFunction: 'linear',
        keyframes: [
          { transform: `translateX(${startX}px)`, offset: 0 },
          { transform: `translateX(${endX}px)`, offset: 1 }
        ]
      };
    }
  });
  
  // 顶部固定弹幕
  registerDanmuType('top', {
    createAnimation(danmu) {
      return {
        duration: danmu.duration || mergedConfig.value.duration || 8000,
        timingFunction: 'ease',
        keyframes: [
          { opacity: 0, transform: 'translateY(-20px)', offset: 0 },
          { opacity: 1, transform: 'translateY(0)', offset: 0.1 },
          { opacity: 1, transform: 'translateY(0)', offset: 0.9 },
          { opacity: 0, transform: 'translateY(-20px)', offset: 1 }
        ]
      };
    }
  });
  
  // 底部固定弹幕
  registerDanmuType('bottom', {
    createAnimation(danmu) {
      return {
        duration: danmu.duration || mergedConfig.value.duration || 8000,
        timingFunction: 'ease',
        keyframes: [
          { opacity: 0, transform: 'translateY(20px)', offset: 0 },
          { opacity: 1, transform: 'translateY(0)', offset: 0.1 },
          { opacity: 1, transform: 'translateY(0)', offset: 0.9 },
          { opacity: 0, transform: 'translateY(20px)', offset: 1 }
        ]
      };
    }
  });
};

// 注册弹幕类型
const registerDanmuType = (typeName: string, typeConfig: DanmuTypeConfig) => {
  danmuTypes[typeName] = typeConfig;
};

// 计算弹幕宽度
const calculateDanmuWidth = (danmu: DanmuItem) => {
  // 文本长度限制，超过maxTextLength个字符将被截断
  const maxLength = mergedConfig.value.maxTextLength || 50;
  let text = danmu.text || '';
  
  // 如果不允许换行且超出长度限制，进行截断并添加省略号
  if (!mergedConfig.value.allowLineBreak && text.length > maxLength) {
    text = text.substring(0, maxLength) + '...';
    // 更新弹幕文本
    danmu.text = text;
  }
  
  const fontSize = danmu.fontSize || mergedConfig.value.fontSize || 16;
  
  // 如果允许换行，需要计算弹幕宽度不超过容器宽度的60%
  if (mergedConfig.value.allowLineBreak) {
    // 换行时限制最大宽度为容器的60%
    const maxWidth = containerWidth.value * 0.6;
    // 估算总宽度
    let totalWidth = 0;
    for (let i = 0; i < text.length; i++) {
      if (/[\u4e00-\u9fa5]|[^\x00-\xff]/.test(text[i])) {
        totalWidth += fontSize;
      } else {
        totalWidth += fontSize * 0.6;
      }
    }
    
    return Math.min(totalWidth + 20, maxWidth);
  }
  
  // 不允许换行时的宽度计算
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    // 中文和全角字符占用更多宽度
    if (/[\u4e00-\u9fa5]|[^\x00-\xff]/.test(text[i])) {
      width += fontSize;
    } else {
      // 英文、数字、普通符号
      width += fontSize * 0.6;
    }
  }
  
  return width + 20; // 加上内边距
};

// 计算弹幕持续时间
const calculateDuration = (danmu: DanmuItem) => {
  if (danmu.duration) return danmu.duration;
  
  const speed = mergedConfig.value.speed || 100;
  const distance = containerWidth.value + calculateDanmuWidth(danmu);
  return distance / speed * 1000; // 转换为毫秒
};

// 判断弹幕是否被屏蔽
const isDanmuBlocked = (danmu: DanmuItem) => {
  if (!mergedConfig.value.blockEnabled) return false;
  
  // 检查用户是否被屏蔽
  if (danmu.userId && mergedConfig.value.blockUsers?.includes(danmu.userId)) {
    return true;
  }
  
  // 检查内容是否含有屏蔽词
  if (danmu.text && mergedConfig.value.blockWords) {
    for (const word of mergedConfig.value.blockWords) {
      if (danmu.text.includes(word)) {
        return true;
      }
    }
  }
  
  return false;
};

// 寻找可用轨道
const findAvailableTrack = (danmu: DanmuItem): Track => {
  // 固定位置的弹幕类型处理
  if (danmu.type === 'top') {
    return trackList.value[0]; // 返回顶部轨道
  }
  
  if (danmu.type === 'bottom') {
    return trackList.value[trackList.value.length - 1]; // 返回底部轨道
  }
  
  // 如果指定了轨道，尝试使用指定轨道
  if (danmu.trackId !== undefined && danmu.trackId >= 0 && danmu.trackId < trackList.value.length) {
    return trackList.value[danmu.trackId];
  }
  
  // 随机选择轨道或查找最空闲的轨道
  if (mergedConfig.value.randomTrack) {
    return trackList.value[Math.floor(Math.random() * trackList.value.length)];
  } else {
    // 查找最空闲的轨道（当前弹幕数量最少的）
    return trackList.value.sort((a, b) => a.danmus.length - b.danmus.length)[0];
  }
};

// 添加弹幕
const addDanmu = (danmu: DanmuItem) => {
  if (!danmu || !danmu.id || !danmu.text) {
    console.error('添加弹幕失败: 无效的弹幕数据');
    return;
  }
  
  // 检查是否超过最大数量
  if (activeDanmus.value.length >= props.maxNumber) {
    return;
  }
  
  // 检查是否被屏蔽
  if (isDanmuBlocked(danmu)) {
    return;
  }
  
  // 补充默认属性
  const newDanmu: DanmuItem = {
    ...danmu,
    type: danmu.type || 'scroll',
    color: danmu.color || mergedConfig.value.fontColor,
    fontSize: danmu.fontSize || mergedConfig.value.fontSize,
    createTime: Date.now(),
    visible: true,
    animationEnded: false
  };
  
  // 寻找可用轨道
  const track = findAvailableTrack(newDanmu);
  newDanmu.trackId = track.id;
  newDanmu.top = track.id * (track.height || 40);
  
  // 创建动画
  const danmuType = danmuTypes[newDanmu.type || 'scroll'];
  if (!danmuType) {
    console.error(`未知的弹幕类型: ${newDanmu.type}`);
    return;
  }
  
  const animation = danmuType.createAnimation(newDanmu, track);
  newDanmu.animation = animation;
  
  // 生成并应用动画样式
  createDanmuAnimation(newDanmu);
  
  // 添加到活动弹幕列表
  activeDanmus.value.push(newDanmu);
  track.danmus.push(newDanmu);
  
  // 触发事件
  emit('send', newDanmu);
  
  return newDanmu;
};

// 为弹幕创建CSS动画
const createDanmuAnimation = (danmu: DanmuItem) => {
  if (!danmu.animation || !danmu.animation.keyframes) return;
  
  // 生成keyframes
  const keyframesName = `danmu-${danmu.type}-${danmu.id}`;
  
  // 在uni-app环境中使用内联样式
  // 注意：这种方式生成的动画只能在浏览器环境中工作
  // 在App或小程序环境可能需要其他方式实现
  if (typeof document !== 'undefined') {
    const styleId = `gp-danmu-style-${danmu.id}`;
    let styleEl = document.getElementById(styleId);
    
    // 如果已存在，先移除
    if (styleEl) {
      styleEl.remove();
    }
    
    // 创建新的style元素
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    
    let keyframesCSS = `@keyframes ${keyframesName} {`;
    
    danmu.animation.keyframes.forEach(frame => {
      const props: string[] = [];
      let offset = frame.offset * 100;
      
      // 添加所有动画属性
      Object.keys(frame).forEach(key => {
        if (key !== 'offset') {
          props.push(`${key}: ${frame[key]}`);
        }
      });
      
      keyframesCSS += `${offset}% { ${props.join('; ')}; }`;
    });
    
    keyframesCSS += '}';
    styleEl.textContent = keyframesCSS;
    
    // 将样式添加到文档
    document.head.appendChild(styleEl);
  }
  
  // 更新弹幕元素的animation属性
  danmu.customAnimationName = keyframesName;
};

// 批量添加弹幕
const addBatchDanmus = (danmuList: DanmuItem[]) => {
  if (!Array.isArray(danmuList)) return;
  
  danmuList.forEach(danmu => {
    addDanmu(danmu);
  });
};

// 移除弹幕
const removeDanmu = (id: string | number) => {
  const index = activeDanmus.value.findIndex(d => d.id === id);
  if (index !== -1) {
    const danmu = activeDanmus.value[index];
    const trackIndex = trackList.value.findIndex(t => t.id === danmu.trackId);
    
    if (trackIndex !== -1) {
      const trackDanmuIndex = trackList.value[trackIndex].danmus.findIndex(d => d.id === id);
      if (trackDanmuIndex !== -1) {
        trackList.value[trackIndex].danmus.splice(trackDanmuIndex, 1);
      }
    }
    
    // 清理弹幕创建的样式表元素
    if (typeof document !== 'undefined') {
      const styleId = `gp-danmu-style-${id}`;
      const styleEl = document.getElementById(styleId);
      if (styleEl) {
        styleEl.remove();
      }
    }
    
    activeDanmus.value.splice(index, 1);
    emit('leave', danmu);
  }
};

// 清空所有弹幕
const clearDanmus = () => {
  activeDanmus.value = [];
  trackList.value.forEach(track => {
    track.danmus = [];
  });
  emit('clear');
};

// 播放/暂停切换
const togglePlay = () => {
  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
};

// 播放弹幕
const play = () => {
  if (isPlaying.value) return;
  
  isPlaying.value = true;
  lastTimestamp.value = performance.now();
  animationFrameId.value = requestAnimationFrame(updateDanmus);
  emit('play');
};

// 暂停弹幕
const pause = () => {
  if (!isPlaying.value) return;
  
  isPlaying.value = false;
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
    animationFrameId.value = null;
  }
  emit('pause');
};

// 更新弹幕位置和状态
const updateDanmus = (timestamp: number) => {
  if (!isPlaying.value) return;
  
  const deltaTime = timestamp - lastTimestamp.value;
  lastTimestamp.value = timestamp;
  
  // 检查是否需要移除弹幕
  const danmusToRemove: (string | number)[] = [];
  
  activeDanmus.value.forEach(danmu => {
    // 检查动画是否结束 - 两种方式：
    // 1. 通过animationend事件设置的标志
    // 2. 通过计算动画是否已超过持续时间
    if (danmu.animationEnded) {
      danmusToRemove.push(danmu.id);
      return;
    }
    
    const elapsed = timestamp - (danmu.createTime || 0);
    // 增加一些延迟以确保动画真正完成
    const delay = 200; // 200ms的缓冲时间
    if (danmu.animation && elapsed >= danmu.animation.duration + delay) {
      danmu.animationEnded = true;
      danmusToRemove.push(danmu.id);
    }
  });
  
  // 移除已结束的弹幕
  danmusToRemove.forEach(id => {
    removeDanmu(id);
  });
  
  // 如果开启循环播放，检查是否需要补充弹幕
  if (mergedConfig.value.looping && activeDanmus.value.length === 0 && props.danmuList.length > 0) {
    addBatchDanmus(props.danmuList);
  }
  
  // 继续下一帧
  animationFrameId.value = requestAnimationFrame(updateDanmus);
};

// 点击弹幕处理
const handleDanmuClick = (danmu: DanmuItem, event: Event) => {
  if (!mergedConfig.value.clickable) return;
  emit('click', danmu, event);
};

// 获取弹幕对象
const getDanmu = (id: string | number) => {
  return activeDanmus.value.find(d => d.id === id);
};

// 屏蔽用户
const blockUser = (userId: string | number) => {
  if (mergedConfig.value.blockUsers && !mergedConfig.value.blockUsers.includes(userId)) {
    mergedConfig.value.blockUsers.push(userId);
    
    // 移除该用户的所有弹幕
    activeDanmus.value.forEach(danmu => {
      if (danmu.userId === userId) {
        removeDanmu(danmu.id);
      }
    });
  }
};

// 添加屏蔽词
const blockWord = (word: string) => {
  if (mergedConfig.value.blockWords && !mergedConfig.value.blockWords.includes(word)) {
    mergedConfig.value.blockWords.push(word);
    
    // 移除包含该词的所有弹幕
    activeDanmus.value.forEach(danmu => {
      if (danmu.text && danmu.text.includes(word)) {
        removeDanmu(danmu.id);
      }
    });
  }
};

// 动态设置配置
const setConfig = (config: Partial<DanmuConfig>) => {
  Object.assign(props.config, config);
};

// 插件系统
const use = (plugin: Plugin) => {
  if (!plugin || typeof plugin.install !== 'function') {
    console.error('无效的插件：插件必须提供 install 方法');
    return;
  }
  
  try {
    plugin.install({
      registerDanmuType,
      pluginContext,
      mergedConfig: mergedConfig.value,
      containerWidth: containerWidth.value,
      containerHeight: containerHeight.value
    });
    console.log(`插件 ${plugin.name || '未命名'} 已安装`);
  } catch (error) {
    console.error('安装插件时出错:', error);
  }
};

// 初始化组件
onMounted(() => {
  initContainerSize();
  initTracks();
  registerDefaultDanmuTypes();
  
  // 监听窗口大小变化
  window.addEventListener('resize', initContainerSize);
  
  // 如果有初始弹幕列表且设置了自动播放，则开始播放
  if (props.danmuList.length > 0 && props.autoplay) {
    nextTick(() => {
      addBatchDanmus(props.danmuList);
      play();
    });
  }
});

// 组件销毁前清理资源
onBeforeUnmount(() => {
  pause();
  window.removeEventListener('resize', initContainerSize);
});

// 监听弹幕列表变化
watch(() => props.danmuList, (newList, oldList) => {
  if (newList !== oldList && isPlaying.value) {
    // 如果弹幕列表变化且当前正在播放，添加新弹幕
    const oldIds = new Set((oldList as DanmuItem[]).map(d => d.id));
    const newDanmus = (newList as DanmuItem[]).filter(d => !oldIds.has(d.id));
    
    if (newDanmus.length > 0) {
      addBatchDanmus(newDanmus);
    }
  }
}, { deep: true });

// 监听配置变化
watch(() => props.config, () => {
  // 重新初始化轨道
  initTracks();
}, { deep: true });

// 对外暴露的方法
defineExpose({
  add: addDanmu,
  addBatch: addBatchDanmus,
  play,
  pause,
  clear: clearDanmus,
  setConfig,
  getDanmu,
  blockUser,
  blockWord,
  use
});
</script>

<template>
  <view 
    class="gp-danmu-container" 
    ref="containerRef"
    :style="{
      zIndex: zIndex,
      height: `${mergedConfig.trackNumber * mergedConfig.trackHeight}px`
    }"
  >
    <!-- 弹幕列表 -->
    <view 
      v-for="danmu in activeDanmus" 
      :key="danmu.id"
      class="gp-danmu-item"
      :class="[`gp-danmu-${danmu.type}`, { 'gp-danmu-clickable': mergedConfig.clickable }]"
      :style="{
        top: `${danmu.top}px`,
        color: danmu.color,
        fontSize: `${danmu.fontSize}px`,
        opacity: mergedConfig.opacity,
        backgroundColor: mergedConfig.backgroundColor,
        animation: danmu.customAnimationName ? 
          `${danmu.customAnimationName} ${danmu.animation?.duration}ms ${danmu.animation?.timingFunction} 0s 1 normal forwards` : 
          `danmu-${danmu.type} ${danmu.animation?.duration}ms ${danmu.animation?.timingFunction} 0s 1 normal forwards`,
        animationPlayState: isPlaying ? 'running' : 'paused'
      }"
      @click="handleDanmuClick(danmu, $event)"
      @animationend="() => { danmu.animationEnded = true; }"
    >
      <!-- 自定义弹幕内容插槽 -->
      <slot name="danmu" :danmu="danmu">
        <text class="gp-danmu-text">{{ danmu.text }}</text>
      </slot>
    </view>
    
    <!-- 插槽：用于自定义控制按钮等 -->
    <slot name="controls"></slot>
  </view>
</template>

<style>
.gp-danmu-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.gp-danmu-item {
  position: absolute;
  white-space: v-bind("mergedConfig.allowLineBreak ? 'normal' : 'nowrap'");
  padding: 4px 8px;
  border-radius: 4px;
  transform: translateZ(0); /* 启用硬件加速 */
  will-change: transform; /* 提示浏览器元素会频繁变化 */
  pointer-events: none;
  max-width: v-bind("mergedConfig.allowLineBreak ? containerWidth * 0.6 + 'px' : 'none'");
}

.gp-danmu-clickable {
  pointer-events: auto;
  cursor: pointer;
}

.gp-danmu-text {
  display: inline-block;
  word-break: v-bind("mergedConfig.allowLineBreak ? 'break-word' : 'keep-all'");
  white-space: v-bind("mergedConfig.allowLineBreak ? 'normal' : 'nowrap'");
  max-width: v-bind("mergedConfig.allowLineBreak ? '100%' : 'none'");
  line-height: 1.2;
}

/* 动态生成动画类 */
@keyframes danmu-scroll {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(-120%); /* 改为-120%确保完全滚出屏幕 */
  }
}

@keyframes danmu-top {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}

@keyframes danmu-bottom {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  10% {
    opacity: 1;
    transform: translateY(0);
  }
  90% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(20px);
  }
}
</style> 