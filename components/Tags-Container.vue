<template>
  <view class="tags-container">
    <!-- 标签列表 -->
    <view class="tags-list">
      <view 
        v-for="(tag, index) in tagsList" 
        :key="index"
        class="tag-item"
        :class="{ 'active': isTagSelected(tag) }"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// 接收父组件参数
const props = defineProps({
  // 初始选中的标签（逗号分隔字符串）
  modelValue: {
    type: String,
    default: ''
  },
  // 输入框名称（用于表单提交）
  inputName: {
    type: String,
    default: 'evaluation_tags'
  },
  // 是否显示调试信息
  debug: {
    type: Boolean,
    default: false
  },
  colorType: {
    type: String,
    default: '#34A76F'
  }
});

// 定义评价标签列表
const tagsList = ref([
  '咨询师专业性',
  '共情与倾听能力',
  '沟通与引导技巧',
  '咨询效果满意度',
  '响应及时性',
  '隐私保护措施',
  '平台操作体验',
  '性价比感知'
]);

// 存储选中的标签（数组形式）
const selectedTags = ref([]);

// 初始化：将父组件传入的逗号分隔字符串转换为数组
const initSelectedTags = () => {
  if (props.modelValue) {
    selectedTags.value = props.modelValue.split(',').filter(tag => tag);
  }
};

// 初始化标签选中状态
initSelectedTags();

// 监听父组件传入值的变化，同步更新选中状态（用于回显）
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    selectedTags.value = newVal.split(',').filter(tag => tag);
  } else {
    selectedTags.value = [];
  }
});

// 切换标签选中状态
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    // 如果已选中，则移除
    selectedTags.value.splice(index, 1);
  } else {
    // 如果未选中，则添加
    selectedTags.value.push(tag);
  }
};

// 检查标签是否被选中
const isTagSelected = (tag) => {
  return selectedTags.value.includes(tag);
};

// 计算属性：将选中的标签数组转换为逗号分隔的字符串
const selectedTagsStr = computed({
  get() {
    return selectedTags.value.join(',');
  },
  set(val) {
    // 支持通过v-model直接设置值
    selectedTags.value = val.split(',').filter(tag => tag);
  }
});

// 向父组件同步选中的标签字符串
const emit = defineEmits(['update:modelValue']);
watch(selectedTagsStr, (newVal) => {
  emit('update:modelValue', newVal);
});

// 暴露给父组件的方法（可选）
defineExpose({
  selectedTags,
  selectedTagsStr,
  toggleTag
});
</script>

<style scoped>
.tags-container {
  width: 100%;
  padding: 20rpx;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.tag-item {
  padding: 0rpx 5rpx;
  border-radius: 30rpx;
  font-size: 26rpx;
  color: #9E9E9E;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 选中状态的高亮样式 */
.tag-item.active {
  color: v-bind(colorType);
}

.debug-info {
  margin-top: 20rpx;
  padding: 15rpx;
  font-size: 24rpx;
  color: #888;
  background-color: #f9f9f9;
  border-radius: 8rpx;
}
</style>