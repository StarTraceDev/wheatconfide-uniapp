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
        <view class="category-header">
          <view class="header-title">{{ cat.name }}</view>
          <view
            v-if="cat.children.length > 9"
            class="toggle-btn"
            @click.stop="toggleExpand(idx)"
          >
            {{ cat.spread ? '收起' : '更多' }}
            <u-icon :name="cat.spread ? 'arrow-up' : 'arrow-down'" size="14" color="#35C996" />
          </view>
        </view>

        <view class="child-wrap">
          <view
            v-for="(child, cidx) in visibleChildren(cat)"
            :key="child.id"
            class="child-item"
            :class="{ selected: (child.id === 'all' ? cat.allSelected : child.selected) }"
            @click.stop="selectChild(idx, cidx-1)"
          >
            {{ child.name }}
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { spread } from 'lodash-es'
import { ref, nextTick, onMounted,computed,defineEmits } from 'vue'
import { getCurrentInstance } from 'vue'
const emit = defineEmits(['update:selected'])
const instance = getCurrentInstance()
const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
    maxSelect: {
      type: Number,
      default: 5
    }
})

const activeIndex = ref(0)
const leftScrollId = ref('')
const rightScrollId = ref('')
const rightHeights = ref([])
const currentCategoryIndex = ref(0)
const scrollIntoView = ref('')
const rightScrollTop = ref(0)

// 本地副本，可修改
const localCategories = ref([])

// 右侧滚动时，同步左侧高亮
// const onRightScroll = (e) => {
//   rightScrollTop.value = e.detail.scrollTop
//   updateActiveIndex()
// }

const updateActiveIndex = () => {
  for (let i = 0; i < rightHeights.value.length; i++) {
    const { top, bottom } = rightHeights.value[i]
    if (rightScrollTop.value >= top && rightScrollTop.value < bottom) {
      activeIndex.value = i
      return
    }
  }
}

// 点击左侧分类
const scrollToRight = (index) => {
  activeIndex.value = index
  rightScrollId.value = 'right-' + props.categories[index].id
  leftScrollId.value = 'left-' + props.categories[index].id
}

// 点击标签选中 + 自动滚动可见
const toggleSelect = (catId, childId) => {
  const cat = props.categories.find(c => c.id === catId)
  if (!cat) return
  const item = cat.children.find(ch => ch.id === childId)
  if (item) item.selected = !item.selected

  // 自动滚动标签到可见区域
  nextTick(() => {
    // ensureTagVisible(catId, childId)
  })
}

// 自动滚动标签到可见范围
const ensureTagVisible = (catId, childId) => {
  const query = uni.createSelectorQuery().in(instance?.proxy)
  query
    .select('.right-content')
    .boundingClientRect((rightRect) => {
      query
        .select(`#tag-${catId}-${childId}`)
        .boundingClientRect((tagRect) => {
          if (!tagRect || !rightRect) return

          // 如果标签在可视区域之外，则滚动
          if (tagRect.top < rightRect.top || tagRect.bottom > rightRect.bottom) {
            const scrollOffset = tagRect.top - rightRect.top - rightRect.height / 3
            query
              .select('.right-content')
              .scrollOffset((scroll) => {
                uni.pageScrollTo({
                  scrollTop: scroll.scrollTop + scrollOffset,
                  duration: 300
                })
              })
              .exec()
          }
        })
        .exec()
    })
    .exec()
}

// 计算右侧每组高度
const calcHeights = () => {
  const query = uni.createSelectorQuery().in(this)
  let total = 0
  query.selectAll('.right-group').boundingClientRect(rects => {
    rightHeights.value = rects.map(rect => {
      const top = total
      total += rect.height
      return { top, bottom: total }
    })
  }).exec()
}

// 切换左侧分类
const scrollToCategory = (index) => {
  currentCategoryIndex.value = index
  scrollIntoView.value = 'cat-' + index
}

// 右侧滚动时同步左侧选中
const onRightScroll = (e) => {
  uni.createSelectorQuery()
    .selectAll('.category-block')
    .boundingClientRect((res) => {
      const visible = res.findIndex((r) => r.top >= 0 && r.top < 400)
      if (visible !== -1) currentCategoryIndex.value = visible
    })
    .exec()
}

// 切换展开/收起
const toggleExpand = (index) => {
  localCategories.value[index].spread = !localCategories.value[index].spread
}

// 可视子项
const visibleChildren = (cat) => {
  // return cat.spread ? cat.children : cat.children.slice(0, 9)
   const allTag = { id: 'all', name: '全部', selected: cat.children.every(c => c.selected) }
    const children = cat.spread ? [...cat.children] : cat.children.slice(0, 9)
    return [allTag, ...children]
}

// 当前选中的标签总数
const selectedCount = computed(() => {
  let count = 0
    localCategories.value.forEach(cat => {
      if (cat.allSelected) count++
      else if (cat.children) {
        cat.children.forEach(c => { if (c.selected) count++ })
      }
    })
    return count
})

// 点击子标签
// 点击子标签
const selectChild = (catIdx, childIdx) => {
  const cat = localCategories.value[catIdx]

  if (childIdx === -1) { // 点击全部
    if (selectedCount.value >= props.maxSelect && !cat.allSelected) {
      uni.showToast({ title: `最多选择 ${props.maxSelect} 个标签`, icon: 'none' })
      return
    }
    cat.allSelected = !cat.allSelected
    // 取消子标签选中
    cat.children.forEach(c => c.selected = false)
  } else { // 点击普通子标签
    if (selectedCount.value >= props.maxSelect && !cat.children[childIdx].selected) {
      uni.showToast({ title: `最多选择 ${props.maxSelect} 个标签`, icon: 'none' })
      return
    }
    cat.children[childIdx].selected = !cat.children[childIdx].selected
    // 如果有子标签选中，则取消全部选中
    if (cat.children[childIdx].selected) cat.allSelected = false
  }

  // 计算选中项
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
onMounted(() => {
	localCategories.value = props.categories.map((item)=>({
		...item,
		spread:false,
		children: item.children.map(c => ({ ...c, selected: false }))
	}))
  nextTick(() => {
    setTimeout(calcHeights, 300)
  })
})
</script>

<style scoped lang="scss">
	
	.container {
	  display: flex;
	  height: 100vh;
	  background-color: #fff;
	}
	
	.left-menu {
	  width: 200rpx;
	  background-color: #f8f8f8;
	}
	
	.left-item {
	  padding: 28rpx 0;
	  text-align: center;
	  font-size: 28rpx;
	  color: #333;
	  border-left: 6rpx solid transparent;
	}
	
	.left-item.active {
	  color: #35C996;
	  background-color: #fff;
	  border-left-color: #35C996;
	}
	
	.right-content {
	  flex: 1;
	  background-color: #fff;
	}
	
	.category-block {
	  padding: 20rpx 28rpx;
	}
	
	.category-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  padding-bottom: 20rpx;
	}
	
	.header-title {
	  font-size: 30rpx;
	  font-weight: 600;
	  color: #333;
	}
	
	.toggle-btn {
	  color: #35C996;
	  font-size: 26rpx;
	  display: flex;
	  align-items: center;
	  gap: 6rpx;
	}
	
	.child-wrap {
	  display: flex;
	  flex-wrap: wrap;
	  gap: 20rpx;
	}
	
	.child-item {
	 width: calc((100% - 2 * 20rpx) / 3); // 一行三个
	   padding: 10rpx;
	   background-color: #f3f3f3;
	   border-radius: 20rpx;
	   font-size: 26rpx;
	   color: #333;
	 
	   display: flex;
	   justify-content: center; /* 水平居中 */
	   align-items: center;     /* 垂直居中 */
	 
	   word-break: break-word;  /* 多行文本可换行 */
	   white-space: normal;     /* 允许换行 */
	   text-align: center;
	   min-height: 40rpx;       /* 保证单行高度，垂直居中 */
	}
	
	.child-item.selected {
	  background-color: #35C996;
	  color: #fff;
	}

.linkage-container {
  display: flex;
  height: 100vh;
  background: #f8f8f8;

  .left-menu {
    width: 200rpx;
    background-color: #fff;
    border-right: 1px solid #eee;
    height: 100vh;

    .left-item {
      padding: 30rpx 0;
      text-align: center;
      font-size: 26rpx;
      color: #333;
      border-left: 6rpx solid transparent;
      transition: 0.2s;
      &.active {
        color: #35ca95;
        background: #f3fffa;
        border-left: 6rpx solid #35ca95;
        font-weight: 600;
      }
    }
  }

  .right-content {
    flex: 1;
    height: 100vh;
    background-color: #f4f6f8;

    .right-group {
      padding: 30rpx;

      .group-title {
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 20rpx;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 20rpx;
      }

      .tag {
        background: #fff;
        padding: 16rpx 30rpx;
        border-radius: 40rpx;
        font-size: 24rpx;
        color: #666;
        border: 1px solid #ddd;
        transition: all 0.2s;
        &.selected {
          background: #35ca95;
          color: #fff;
          border-color: #35ca95;
        }
      }
    }
  }
}
</style>
