<template>
  <view class="container">
    <!-- 顶部地区栏 -->
    <view class="top-region-bar">
      <view class="current-region">
        <text class="region-label">当前地区：</text>
        <text class="region-value">
          {{ selectedText }}
        </text>
      </view>
      <view class="locate-btn" @click="getCurrentCity">
        <image src="/static/auth/current-address.png" class="img" style="width: 30rpx;height: 30rpx;"></image>
        <view>自动定位</view>
      </view>
    </view>

    <view class="select-title">选择地区</view>
     <view class="top-region-bar">
      <text class="region-label">{{ getCurrentSelectedRegion }}</text>
    </view>

    <!-- 核心左右分栏布局 -->
    <view class="selector-wrap">
      <!-- 左侧：省级列表 -->
      <scroll-view
        class="left-scroll"
        scroll-y
        :scroll-top="leftScrollTop"
        @scroll="onLeftScroll"
      >
        <view
          v-for="(cat, idx) in localCategories"
          :key="cat.id"
          class="province-item"
          :class="{ 'province-item--active': currentCategoryIndex === idx }"
          @click="handleProvinceClick(idx)"
        >
          <view>{{ cat.name }}</view>
          <uni-icons type="right" size="16" :color="currentCategoryIndex === idx ? colorSelected : '#333'" class="arrow-icon"></uni-icons>
        </view>
      </scroll-view>
      <view class="split-line"></view>
      <!-- 右侧：仅显示当前选中省份的城市 -->
      <scroll-view
        class="right-scroll"
        scroll-y
        @scroll="onRightScroll"
        :scroll-top="rightScrollTop"
      >
        <!-- 关键修改：只渲染当前选中省份的城市 -->
        <view v-if="localCategories[currentCategoryIndex]" class="city-block">
          <!-- 全部选项 -->
          <view 
            class="city-item" 
            :class="{ 'city-item--selected-1': localCategories[currentCategoryIndex].allSelected }"
            @click.stop="selectChild(currentCategoryIndex, -1)"
          >
            全部
          </view>
          <!-- 当前省份的城市列表 -->
          <view
            v-for="(child, cidx) in localCategories[currentCategoryIndex].children"
            :key="child.id"
            class="city-item"
            :class="{ 'city-item--selected': child.selected }"
            @click.stop="selectChild(currentCategoryIndex, cidx)"
          >
            {{ child.name }}
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed } from "vue";
const props = defineProps({
  categories: { type: Array, default: () => [] },
  colorType: { type: Number, default: 1 },
});
const instance = getCurrentInstance();
const emit = defineEmits(["update:selected"]);

// 核心响应式变量
const currentCategoryIndex = ref(0); // 当前选中的省级索引
const rightScrollTop = ref(0); // 右侧滚动条位置
const leftScrollTop = ref(0); // 左侧滚动条位置
const localCategories = ref([]);
const selectedText = ref('');

// 获取当前城市
const getCurrentCity = async () => {
  uni.getLocation({
    type: 'gcj02', // 国测局坐标系，国内地图必用，无偏移
    altitude: false,
    // 定位成功回调
    success: async (res) => {
      // 经纬度转省市区
      const { data } = await uni.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/',
        method: 'GET',
        data: {
          location: `${res.latitude},${res.longitude}`,
          key: 'OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77',
          get_poi: 0
        }
      })      

      // 解析省市区数据
      if (data.status === 0) {
        const address = data.result.address_component
        selectedText.value = address.city || address.province
      } else {
        uni.showToast({ title: '城市解析失败', icon: 'none', duration: 2000 })
      }
    },
    // 定位失败/授权拒绝
    fail: (err) => {
      console.log('定位失败：', err)
      const errMsg = err.errMsg || ''
      // 用户拒绝定位权限
      if (errMsg.includes('auth deny')) {
        uni.showModal({
          title: '权限提示',
          content: '你已拒绝定位权限，无法获取城市信息',
          confirmText: '去开启',
          cancelText: '取消',
          success: (modalRes) => {
            if (modalRes.confirm) uni.openSetting() // 跳转权限设置页
          }
        })
      } 
      // 网络/GPS/设备原因定位失败
      else {
        uni.showToast({ title: '定位失败，请检查网络和GPS', icon: 'none', duration: 2000 })
      }
    }
  })
}

const colorSelected = ref('#35c996');
// 初始化
onMounted(() => {
  getCurrentCity();

  props.colorType == 1 ? colorSelected.value = "#35c996" : colorSelected.value = "#ffa767";
  // 初始化本地副本
  localCategories.value = props.categories.map((cat) => ({
    ...cat,
    allSelected: false,
    children: (cat.children || []).map((c) => ({ ...c, selected: false })),
  }));
});

// 左侧省份点击事件
const handleProvinceClick = (index) => {
  currentCategoryIndex.value = index;
  
  // 重置右侧滚动条到顶部（切换省份时回到城市列表开头）
  rightScrollTop.value = 0;
  
  // 取消所有选中状态
  localCategories.value.forEach((cat) => {
    cat.allSelected = false;
    if (cat.children) cat.children.forEach((c) => (c.selected = false));
  });
  
  // 默认选中当前省的“全部”
  localCategories.value[index].allSelected = true;
  
  // 触发选中事件
  emitSelectedChange();
  
  // 左侧滚动到当前省份位置
  // leftScrollTop.value = index * 70; // 按省份项高度计算
};

// 右侧滚动事件（移除错误的同步逻辑，避免跳转）
const onRightScroll = (e) => {
  // 仅记录滚动位置，不再修改左侧选中状态
  rightScrollTop.value = e.detail.scrollTop;
};

// 左侧滚动事件
const onLeftScroll = (e) => {
  leftScrollTop.value = e.detail.scrollTop;
};

// 选中城市/全部的逻辑
const selectChild = (catIdx, childIdx) => {
  // 取消所有选中
  localCategories.value.forEach((cat) => {
    cat.allSelected = false;
    if (cat.children) cat.children.forEach((c) => (c.selected = false));
  });
  
  // 选中当前项（-1代表“全部”）
  const cat = localCategories.value[catIdx];
  if (childIdx === -1) cat.allSelected = true;
  else cat.children[childIdx].selected = true;
  
  // 触发选中事件
  emitSelectedChange();
};

// 统一触发选中变更
const emitSelectedChange = () => {
  const selected = [];
  localCategories.value.forEach((cat) => {
    if (cat.allSelected)
      selected.push({ catId: cat.id, childId: "all", name: cat.name });
    else if (cat.children) {
      cat.children.forEach((c) => {
        if (c.selected)
          selected.push({ catId: cat.id, childId: c.id, name: c.name });
      });
    }
  });

  selectedText.value = selected[0].name
  emit("update:selected", selected);
};

// 重置功能
const reset = () => {
  localCategories.value.forEach((e) => {
    e.allSelected = false;
    e.children.forEach((d) => {
      d.selected = false;
    });
  });
  
  if (localCategories.value.length > 0) {
    handleProvinceClick(0);
  }
};

// 计算当前选中的地区名称
const getCurrentSelectedRegion = computed(() => {
  const currentCat = localCategories.value[currentCategoryIndex.value];
  if (!currentCat) return "未选择";
  if (currentCat.allSelected) return currentCat.name;
  const selectedChild = currentCat.children?.find(c => c.selected);
  return selectedChild ? `${currentCat.name} / ${selectedChild.name}` : currentCat.name;
});

defineExpose({
  reset,
});
</script>

<style scoped lang="scss">
/* 样式保持不变 */
.container {
  padding: 20rpx;
  width: 100%;
  background-color: #ffffff;
  box-sizing: border-box;
}

.top-region-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;
  background-color: #F9F9F9;
  border-bottom: 1rpx solid #f0f0f0;
}
.region-label {
  font-size: 28rpx;
  color: #666666;
  margin-right: 10rpx;
}
.region-value {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
}
.locate-btn {
  display: flex;
  align-items: center;
  color: v-bind(colorSelected);
  font-size: 26rpx;
}
.select-title {
  color: #333333;
  margin: 20rpx 0;
}
.selector-wrap {
  display: flex;
  height: 23vh;
  padding: 20rpx;
  align-items: center;
  background-color: #F9F9F9;
}

.split-line {
  display: flex;
  height: 80%;
  border: 2rpx solid #D8D8D8;
}

.left-scroll {
  width: 50%;
  height: 100%;
  
}
.province-item {
  display: flex;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  font-size: 25rpx;
  color: #333;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #f0f0f0;
}
.arrow-icon{
  padding: 0 30rpx;
}
.province-item--active {
  color: v-bind(colorSelected);
  font-weight: 600;
}

.right-scroll {
  flex: 1;
  height: 100%;
  box-sizing: border-box;
}
.city-block {
  width: 100%;
}
.city-item {
  text-align: center;
  height: 70rpx;
  line-height: 70rpx;
  font-size: 25rpx;
  color: #333;
  border-bottom: 1rpx solid #f5f5f5;
}
.city-item--selected {
  color: v-bind(colorSelected);
  font-weight: 600;
}
</style>
<style>
scroll-view ::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
  opacity: 0 !important;
}
</style>