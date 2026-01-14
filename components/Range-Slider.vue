<template>
  <!-- 单轨道双滑块组件 -->
  <view class="range-slider-container" :style="{ width: width + 'px' }">
    <!-- 轨道背景 -->
    <view class="slider-track" ref="trackRef">
      <!-- 选中的区间背景（两个滑块之间的部分） -->
      <view class="slider-track-active"
        :style="{ left: leftPercent + '%', width: activeWidth + '%',backgroundColor: colorChange }"></view>
    </view>

    <!-- 左滑块（最小值）- 改为图片滑块 -->
    <view
      class="slider-handle left-handle"
      :class="colorChange == '#35CA95' ? 'slider-img2' : 'slider-img'"
      :style="{ left: leftPercent + '%' }"
      @touchstart="(e) => handleTouchStart(e, 'left')"
      @touchmove="(e) => handleTouchMove(e, 'left')"
      @touchend="handleTouchEnd"
      @mousedown="(e) => handleMouseDown(e, 'left')"
      @mousemove="(e) => handleMouseMove(e, 'left')"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    ></view>
    <!-- 左滑块下方的金额显示（跟随左滑块） -->
    <view class="slider-value-text left-value" :style="{ left: leftPercent + '%' }">
      {{ minValue }}
    </view>

    <!-- 右滑块（最大值）- 改为图片滑块 -->
    <view
      class="slider-handle right-handle"
      :class="colorChange == '#35CA95' ? 'slider-img2' : 'slider-img'"
      :style="{ left: rightPercent + '%' }"
      @touchstart="(e) => handleTouchStart(e, 'right')"
      @touchmove="(e) => handleTouchMove(e, 'right')"
      @touchend="handleTouchEnd"
      @mousedown="(e) => handleMouseDown(e, 'right')"
      @mousemove="(e) => handleMouseMove(e, 'right')"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    ></view>
    <!-- 右滑块下方的金额显示（跟随右滑块） -->
    <view class="slider-value-text right-value" :style="{ left: rightPercent + '%' }">
      {{ maxValue }}
    </view>
  </view>
</template>

<script setup>
import { ref, watch, computed, onMounted, getCurrentInstance } from 'vue';

// 接收父组件的参数
const props = defineProps({
  // 金额最小值
  min: {
    type: Number,
    default: 0
  },
  // 金额最大值
  max: {
    type: Number,
    default: 100
  },
  // 滑块轨道宽度
  width: {
    type: Number,
    default: 300
  },
  // 步长（每次变化的金额）
  step: {
    type: Number,
    default: 1
  },
  // 初始最小值
  initMin: {
    type: Number,
    default: 0
  },
  // 初始最大值
  initMax: {
    type: Number,
    default: 50
  },
  colorChange: {
    type: String,
    default: '#35CA95'
  }
});

// 向父组件传递值（当前选中的金额范围）
const emit = defineEmits(['change', 'update:minValue', 'update:maxValue']);

// 轨道的DOM引用
const trackRef = ref(null);
// 轨道的实际宽度和左边界
const trackInfo = ref({ width: 0, left: 0 });
// 左滑块的百分比位置（0-100）
const leftPercent = ref(0);
// 右滑块的百分比位置（0-100）
const rightPercent = ref(0);
// 当前选中的最小值
const minValue = ref(props.initMin);
// 当前选中的最大值
const maxValue = ref(props.initMax);
// 是否正在拖动
const isDragging = ref(false);
// 当前拖动的滑块类型（left/right）
const draggingType = ref('');

// 计算选中区间的宽度百分比
const activeWidth = computed(() => {
  return rightPercent.value - leftPercent.value;
});

// 初始化滑块位置
const initSlider = () => {
  leftPercent.value = ((props.initMin - props.min) / (props.max - props.min)) * 100;
  rightPercent.value = ((props.initMax - props.min) / (props.max - props.min)) * 100;
  minValue.value = props.initMin;
  maxValue.value = props.initMax;
};

// 获取轨道的实际尺寸和位置
const getTrackInfo = () => {
  return new Promise((resolve) => {
    const query = uni.createSelectorQuery().in(getCurrentInstance());
    query.select('.slider-track').boundingClientRect(rect => {
      trackInfo.value = {
        width: rect.width,
        left: rect.left
      };
      resolve(trackInfo.value);
    }).exec();
  });
};

// 初始化
onMounted(async () => {
  await getTrackInfo();
  initSlider();
});

// 监听props变化，重新初始化
watch([() => props.min, () => props.max, () => props.initMin, () => props.initMax], () => {
  initSlider();
});

// 触摸/鼠标按下开始拖动
const handleTouchStart = (e, type) => {
  isDragging.value = true;
  draggingType.value = type;
  e.preventDefault();
};

// 兼容H5端鼠标按下
const handleMouseDown = (e, type) => {
  isDragging.value = true;
  draggingType.value = type;
  e.preventDefault();
};

// 触摸移动
const handleTouchMove = (e, type) => {
  if (!isDragging.value || !trackInfo.value.width) return;
  const touchX = e.touches[0].clientX;
  calculatePosition(touchX, draggingType.value);
};

// 兼容H5端鼠标移动
const handleMouseMove = (e, type) => {
  if (!isDragging.value || !trackInfo.value.width) return;
  const mouseX = e.clientX;
  calculatePosition(mouseX, draggingType.value);
};

// 统一计算滑块位置的逻辑
const calculatePosition = (clientX, type) => {
  let currentX = clientX - trackInfo.value.left;
  // 限制滑块在轨道内
  currentX = Math.max(0, Math.min(currentX, trackInfo.value.width));
  const percent = (currentX / trackInfo.value.width) * 100;
  const value = Math.round(((props.max - props.min) * percent / 100 + props.min) / props.step) * props.step;

  // 处理边界：左滑块≤右滑块
  if (type === 'left') {
    if (value >= maxValue.value) return;
    minValue.value = value;
    leftPercent.value = percent;
  } else {
    if (value <= minValue.value) return;
    maxValue.value = value;
    rightPercent.value = percent;
  }

  // 向父组件传递值
  emit('change', { min: minValue.value, max: maxValue.value });
  emit('update:minValue', minValue.value);
  emit('update:maxValue', maxValue.value);
};

// 触摸结束
const handleTouchEnd = () => {
  isDragging.value = false;
  draggingType.value = '';
};

// 兼容H5端鼠标松开/离开
const handleMouseUp = () => {
  isDragging.value = false;
  draggingType.value = '';
};
</script>

<style scoped>
.range-slider-container {
  position: relative;
  margin: 60rpx auto;
  padding: 30rpx 0;
  user-select: none; /* 禁止文本选中 */
}

/* 滑块轨道样式 */
.slider-track {
  position: relative;
  height: 15rpx;
  border: 1.5rpx solid #e5e5e5;
  border-radius: 10rpx;
  width: 100%;
}

/* 选中的区间背景样式 */
.slider-track-active {
  position: absolute;
  height: 100%;
  /* background-color: #35ca95; */
  border-radius: 4rpx;
}
.slider-img {
  background-image: url('@/static/consult/water.png');
}
.slider-img2 {
  background-image: url('@/static/consult/water2.png');
}
/* 滑块样式 - 核心修改：替换为图片 */
.slider-handle {
  position: absolute;
  top: 85%;
  transform: translate(-50%, -50%); /* 保持滑块居中 */
  width: 30rpx; /* 可根据图片大小调整 */
  height: 36rpx; /* 可根据图片大小调整 */
  /* 加载指定图片 */
  /* 让图片填充滑块容器 */
  background-size: 100% 100%;
  /* 禁止图片重复 */
  background-repeat: no-repeat;
  /* 图片居中显示 */
  background-position: center center;
  z-index: 10;
  cursor: pointer; /* H5端鼠标指针 */
  border: none; /* 去掉原来的边框 */
  background-color: transparent; /* 去掉原来的背景色 */
}

/* 右滑块样式（如果需要区分，可单独设置图片，这里用同一张） */
.right-handle {
  /* 若需要右滑块用不同图片，可重新设置background-image，否则保留空 */
  /* background-image: url('/static/consult/water2.png'); */
}

/* 滑块下方的金额文本样式 */
.slider-value-text {
  position: absolute;
  top: calc(50% + 40rpx); /* 图片滑块下方 */
  transform: translate(-50%, 0);
  font-size: 28rpx;
  color: #A4A1A1;
  white-space: nowrap;
  padding: 4rpx 8rpx;
  border-radius: 4rpx;
}

/* 区分左右金额文本的颜色 */
/* .left-value {
  color: #35ca95;
}
.right-value {
  color: #ff6600;
} */
</style>