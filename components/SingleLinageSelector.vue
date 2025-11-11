<script setup>
import { ref, onMounted, nextTick, getCurrentInstance } from 'vue'

const props = defineProps({
  categories: { type: Array, default: () => [] }
})
const instance = getCurrentInstance()
const emit = defineEmits(['update:selected'])

const currentCategoryIndex = ref(0)
const scrollIntoView = ref('')
const rightHeights = ref([])

const localCategories = ref([])

onMounted(() => {
  // 初始化本地副本
  localCategories.value = props.categories.map(cat => ({
    ...cat,
    allSelected: false,
    children: (cat.children || []).map(c => ({ ...c, selected: false }))
  }))

  // 计算右侧每组高度
  nextTick(() => {
    setTimeout(calcHeights, 300)
  })
})

// 计算右侧每组高度
const calcHeights = () => {
  const query = uni.createSelectorQuery().in(instance.proxy)
  let total = 0
  query.selectAll('.category-block').boundingClientRect((rects) => {
    if (!rects) return
    rightHeights.value = rects.map(rect => {
      const top = total
      total += rect.height
      return { top, bottom: total }
    })
  }).exec()
}

// 左侧点击滚动右侧
const scrollToCategory = (index) => {
  currentCategoryIndex.value = index
  scrollIntoView.value = 'cat-' + index
}

// 右侧滚动时同步左侧高亮
const onRightScroll = (e) => {
  const scrollTop = e.detail.scrollTop
  console.log("scrollTop",scrollTop);
  for (let i = 0; i < rightHeights.value.length; i++) {
    const { top, bottom } = rightHeights.value[i]
	console.log("top",top,"bottom",bottom);
    if (scrollTop >= top && scrollTop < bottom) {
      currentCategoryIndex.value = i
      break
    }
  }
}

// 单选逻辑
const selectChild = (catIdx, childIdx) => {
  localCategories.value.forEach(cat => {
    cat.allSelected = false
    if (cat.children) cat.children.forEach(c => c.selected = false)
  })

  const cat = localCategories.value[catIdx]
  if (childIdx === -1) cat.allSelected = true
  else cat.children[childIdx].selected = true

  const selected = []
  localCategories.value.forEach(cat => {
    if (cat.allSelected) selected.push({ catId: cat.id, childId: 'all', name: cat.name })
    else if (cat.children) {
      cat.children.forEach(c => {
        if (c.selected) selected.push({ catId: cat.id, childId: c.id, name: c.name })
      })
    }
  })
  emit('update:selected', selected)
}

const reset = ()=>{
	console.log('重置选项');
	localCategories.value.forEach(e=>{
		e.children.forEach(d=>{
			d.selected = false
		})
	})
}

defineExpose({
	reset
})

// 可视子项
const visibleChildren = (cat) => {
  if (!cat.children || cat.children.length === 0) return []
  return [{ id: 'all', name: '全部', selected: cat.allSelected }, ...cat.children]
}
</script>

<template>
  <view class="container">
    <!-- 左侧分类 -->
    <scroll-view class="left-menu" scroll-y>
      <view
        v-for="(cat, idx) in localCategories"
        :key="cat.id"
        class="left-item"
        :class="{ active: currentCategoryIndex === idx }"
        @click="scrollToCategory(idx)"
      >
        {{ cat.name }}
      </view>
    </scroll-view>

    <!-- 右侧内容 -->
    <scroll-view
      class="right-content"
      scroll-y
      :scroll-into-view="scrollIntoView"
      @scroll="onRightScroll"
    >
      <view
        v-for="(cat, idx) in localCategories"
        :key="cat.id"
        class="category-block"
        :id="'cat-' + idx"
      >
        <view class="category-header">{{ cat.name }}</view>

        <view class="child-wrap" v-if="cat.children && cat.children.length > 0">
          <view
            v-for="(child, cidx) in visibleChildren(cat)"
            :key="child.id"
            class="child-item"
            :class="{ selected: (child.id === 'all' ? cat.allSelected : child.selected) }"
            @click.stop="selectChild(idx, cidx - 1)"
          >
            {{ child.name }}
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
.container { display: flex; height: 100vh; background-color: #fff; }
.left-menu { width: 200rpx; background-color: #f8f8f8; }
.left-item { padding: 28rpx 0; text-align: center; font-size: 28rpx; color: #333; border-left: 6rpx solid transparent; }
.left-item.active { color: #35C996; background-color: #fff; border-left-color: #35C996; }
.right-content { flex: 1; background-color: #fff; padding: 20rpx; }
.category-block { padding-bottom: 20rpx; }
.category-header { font-size: 30rpx; font-weight: 600; color: #333; margin-bottom: 20rpx; }
.child-wrap { display: flex; flex-wrap: wrap; gap: 20rpx; }
.child-item { width: calc((100% - 2*20rpx)/3); padding: 10rpx; background-color: #f3f3f3; border-radius: 20rpx; font-size: 26rpx; color: #333; display: flex; justify-content: center; align-items: center; min-height: 40rpx; text-align: center; }
.child-item.selected { background-color: #35C996; color: #fff; }
</style>
