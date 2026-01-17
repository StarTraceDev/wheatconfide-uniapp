<template>
  <div :class="['layout-container', `layout-type-${layoutType}`]">
    <div v-if="layoutType == 1">
      <linkage-selector
      @update:selected="changeServiceType"
      :colorType="colorType"
      :categories="serviceTypes"
      ></linkage-selector>
    </div>
    <div v-if="layoutType == 2">
      <single-linage-selector
        @update:selected="changeCity"
        :categories="confusionList"
        :colorType="colorType"
      >
      </single-linage-selector>
    </div>
    <div v-if="layoutType == 3">
      <range-slider
        :minPrice="0"
        :maxPrice="100"
        :width="300"
        :step="1"
        :initMin="10"
        :initMax="60"
        :colorChange="colorChange"
        @change="onRangeChange"
      ></range-slider>
      <div class="slider-value">
        <div class="text-value">{{ currentRange.minPrice }}</div>
        <div class="slider-value-line">至</div>
        <div class="text-value">{{ currentRange.maxPrice }}</div>
      </div>
    </div>
    <div v-if="layoutType == 4">
      <uni-data-checkbox :selectedColor="colorChange" v-model="sortType" :localdata="sortLsit" />
    </div>
    <div v-if="layoutType == 5">
      <div v-for="(item, index) in screeningArry" :key="index">
        <div>{{ item.title }}</div>
        <uni-data-checkbox
          mode="tag"
          v-model="item.selected"
          :localdata="item.arrSelect"
          :selectedColor="colorCheckbox"
          :selectedTextColor="colorCheckboxText"
          @change="(e) => change(item.id, e)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import SingleLinageSelector from "./SingleLinageSelector.vue";
import LinkageSelector from "./LinkageSelector.vue";
import RangeSlider from "./range-slider.vue";

const props = defineProps({
  colorType: {
    type: Number,
    default: 1,
  },
  layoutType: {
    type: Number,
    default: 1, // 1排序 2筛选
  },
  serviceTypes: {
    type: Array,
    default: () => [],
  },
  confusionList: {
    type: Array,
    default: () => [],
  }
});
// ========================== 城市 =========================
const colorChange = computed(() => {
  if (props.colorType == 1) {
    return "#35CA95";
  }
  return "#ffa767";
})

const colorCheckbox = computed(() => {
  if (props.colorType == 1) {
    return "#ebf9f5";
  }
  return "#f9f4ea"
})

const colorCheckboxText = computed(() => {
  if (props.colorType == 1) {
    return "#35CA95";
  }
  return "#ffa767"
})
// ========================== 排序 =========================
const sortType = ref(1);
const sortLsit = ref([
  { value: 1, text: "综合排序" },
  { value: 2, text: "价格高优先" },
  { value: 3, text: "价格低优先" },
  { value: 4, text: "好评率高" },
  { value: 5, text: "经验最多" },
  { value: 6, text: "从业年限" },
]);

const screeningArry = ref([
  {
    id: 1,
    title: "咨询师性别",
    arrSelect: [
      { value: '', text: "不限" },
      { value: '男', text: "男性咨询师" },
      { value: '女', text: "女性咨询师" },
    ],
  },
  {
    id: 2,
    title: "年龄筛选",
    arrSelect: [
      { value: '', text: "不限" },
      { value: '60后', text: "60后" },
      { value: '70后', text: "70后" },
      { value: '80后', text: "80后" },
      { value: '90后', text: "90后" },
      { value: '00后', text: "00后" },
    ],
  },
  {
    id: 3,
    title: "星座筛选",
    arrSelect: [
      { value: '', text: "不限" },
      { value: '白羊座', text: "白羊座" },
      { value: '金牛座', text: "金牛座" },
      { value: '双子座', text: "双子座" },
      { value: '巨蟹座', text: "巨蟹座" },
      { value: '狮子座', text: "狮子座" },
      { value: '处女座', text: "处女座" },
      { value: '天秤座', text: "天秤座" },
      { value: '天蝎座', text: "天蝎座" },
      { value: '射手座', text: "射手座" },
      { value: '摩羯座', text: "摩羯座" },
      { value: '水瓶座', text: "水瓶座" },
      { value: '双鱼座', text: "双鱼座" },
    ],
  },
  {
    id: 4,
    title: "学历筛选",
    arrSelect: [
      { value: 0, text: "不限" },
      { value: 2, text: "本科" },
      { value: 3, text: "研究生" },
      { value: 4, text: "博士" },
    ],
  },
  {
    id: 5,
    title: "资质筛选",
    arrSelect: [
      { value: 0, text: "不限" },
      { value: 2, text: "资质" },
      { value: 3, text: "资质" },
      { value: 4, text: "资质" },
    ],
  },
]);

// ========================== 困扰 =========================
const distressId = ref([]);
const changeServiceType = (e) => {
  distressId.value = e.map(item => item.childId).join(',')
}

// ========================== 城市 =========================
const city = ref(null)
const changeCity = (e) => {
  city.value = e[0].name
};

// ========================== 金额 =========================
const currentRange = ref({ minPrice: 10, maxPrice: 60 });
const onRangeChange = (range) => {
  const { min, max } = range
  
  currentRange.value = { minPrice: min, maxPrice: max };
};

// ========================== 筛选 =========================
const idToKeyMap = {
  1: 'sex',        // itemId=1 → sex属性
  2: 'maxAge',     // itemId=2 → maxAge属性
  3: 'constellation' // itemId=3 → constellation属性
};
const resultObj = {};
const change = (itemId, e) => {
  const key = idToKeyMap[itemId];
  if (!key) {
    console.warn(`未找到itemId=${itemId}对应的属性名`);
    return;
  }
  const value = e.detail.value;
  resultObj[key] = value;
};

defineExpose({
  distressId,
  city,
  currentRange,
  sortType,
  resultObj,
 })
</script>

<style lang="scss" scoped>

::v-deep .is--tag {
  font-size: 20rpx !important;
  width: 220rpx;
  height: 60rpx;
  border: 0 !important;
  margin: 20rpx 0 0 !important;
  padding: 0 !important;
}

::v-deep .checklist-content {
  justify-content: center !important;
}

::v-deep .radio__inner {
  display: none !important;
}

.layout-container {
  &.layout-type-4 {
    :deep(.checklist-group) {
      flex-direction: column !important;
    }
    :deep(.checklist-box) {
      margin-top: 50rpx !important;
    }
    :deep(.checklist-text) {
      font-size: 28rpx !important;
    }
  }

  &.layout-type-5 {
    :deep(.checklist-group) {
      flex-wrap: wrap !important;
      justify-content: space-between !important;
    }
    :deep(.checklist-text) {
      font-size: 25rpx !important;
    }
    :deep(.uni-data-checklist){
      margin-bottom: 40rpx !important;
    }
  }
  .slider-value {
    margin-top: 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .text-value{
      color: #868282;
      padding: 10rpx 60rpx;
      border-radius: 30rpx;
      background-color: #F9F9F9;
    }
  }
}
</style>
