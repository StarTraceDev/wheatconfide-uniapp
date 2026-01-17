<template>
  <view class="career-box">
    <view class="career-content-box">
      <view class="career-content">
        <view class="career-collapse-box">
          <picker @change="bindPickerChange" :value="selectIndex" :range="occupationList" :range-key="rangeKey">
						<view class="career-collapse-item">
              <view style="display: flex;align-items: center;justify-content: space-between;margin: 40rpx 0;">
                <view>职业</view>
                <view style="color: #595959;font-size: 25rpx;" >{{ occupationId ? occupationId : '请选择' }}</view>
              </view>
            </view>
					</picker>
          <view class="career-collapse-item">
            <view style="display: flex;align-items: center;justify-content: space-between;margin: 40rpx 0;">
              <view >工作开始时间</view>
              <view style="color: #595959;font-size: 25rpx;" @click="certificatePickerShow = true">{{ workTime ? workTime : '请选择' }}</view>
            </view>
          </view>
          <u-picker
              mode="time"
              v-model="certificatePickerShow"
              @confirm="confirmCertificateDate(item, $event)"
              :params="certificateDateParam"
            ></u-picker>
        </view>
      </view>
      <view class="career-content">
        <view class="title">服务类型<text>*</text></view>
        <view class="remark">专业信息展示在个人资料（多选）</view>
        <view class="career-collapse-box">
          <view class="career-collapse-item">
            <view class="container">
              <!-- 折叠面板 -->
              <uni-collapse v-model="activeNames" accordion=false>
                <uni-collapse-item 
                  v-for="item in processedData" 
                  :key="item.id" 
                  :name="item.id"
                >
                  <!-- 父项标题栏 -->
                  <template #title>
                    <view class="parent-title">
                      <view 
                        class="custom-checkbox" 
                        :class="{ checked: selectedIds.includes(item.id) }"
                        @click.stop="toggleParent(item)"
                      >
                        <text class="check-icon" v-if="selectedIds.includes(item.id)">✓</text>
                      </view>
                      <text class="parent-name">{{ item.name }}</text>
                    </view>
                  </template>

                  <!-- 子项列表（两列布局核心） -->
                  <view class="children-list" v-if="item.children.length">
                    <checkbox-group @change="(e) => handleChildGroupChange(item, e)">
                      <!-- 外层 flex 容器实现两列换行 -->
                      <view class="children-grid">
                        <view 
                          class="child-item" 
                          v-for="child in item.children" 
                          :key="child.id"
                        >
                          <checkbox
                            :value="child.id.toString()" 
                            :checked="selectedIds.includes(child.id)"
                            color="#fff" style="transform:scale(0.7)"
                            activeBackgroundColor="#35CA95"
                          />
                          <text class="child-name">{{ child.name }}</text>
                        </view>
                      </view>
                    </checkbox-group>
                  </view>

                  <view class="no-children" v-else>
                    暂无子分类
                  </view>
                </uni-collapse-item>
              </uni-collapse>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { nextTick, ref, watch, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { getConsultantMenus } from "@/common/api/index.js";
import { registerConsultantStep2 } from "@/common/api/consultant.js";
import { registerListenerStep2, getOccupation } from "@/common/api/listener.js";
import { serviceList } from "@/common/api/index.js";

const serviceType = ref([]);
const occupationId = ref();
const workTime = ref();
const selectIndex = ref(0);
const rangeKey = ref("name");
const certificateDateParam = ref({
  year: true,
  month: true,
  day: false,
  hour: false,
  minute: false,
  second: false,
  // 选择时间的时间戳
  timestamp: true,
});
// 响应式数据
const processedData = ref([])
const activeNames = ref([])
const selectedIds = ref([])
const checkedList = ref([]);
const certificatePickerShow = ref(false);
const t = ref([]);
const emit = defineEmits(["update:modelValue", "committed"]);

const submit = async () => {
    const requiredFields = [
    // { field: occupationId.value, message: "请选择职业" },
    // { field: workTime.value, message: "请选择工作时间" },
    { field: selectedIds.value, message: "请选择服务类型" },
  ];

  for (const { field, message } of requiredFields) {
    if (!field) {
      uni.showToast({ title: message, icon: "none" });
      return;
    }
  }

  props.modelValue.serviceType = selectedIds.value.join(",");
  console.log(props.modelValue);
  
  if (props.consultantType == 1) {
    let resp = await registerConsultantStep2(props.modelValue);
    emit("committed", "");
  } else {
    let resp = await registerListenerStep2(props.modelValue);
    emit("committed", "");
  }
};

const occupationList = ref([])
const getOccupationList = async () => {
  let { data } = await getOccupation();
  occupationList.value = data
}
const bindPickerChange = (e) => {
  occupationId.value = occupationList.value[e.detail.value]?.name
  props.modelValue.occupationId = occupationList.value[e.detail.value].id
}

defineExpose({
  submit,
});

const props = defineProps({
  modelValue: Object,
  consultantType: String,
});

// 职业回显
const initPickerEcho = () => {
  workTime.value = props.modelValue.workTime;
  if (occupationList.value.length === 0) return;
  const targetId = props.modelValue.occupationId;
  
  if (!targetId) return;
  const matchedItem = occupationList.value.find(item => item.id == targetId);
  if (matchedItem) {
    occupationId.value = matchedItem.name;
    selectIndex.value = occupationList.value.indexOf(matchedItem);
  } else {
    occupationId.value = '';
    selectIndex.value = 0;
  }
};

const confirmCertificateDate = (item, e) => {
  props.modelValue.workTime = e.year + "-" + e.month
  workTime.value = e.year + "-" + e.month;
}
watch(() => props.modelValue,
  (newVal, oldVal) => {
    if (newVal.serviceType) {
      const arr = newVal.serviceType.split(",").map((e) => (e = parseInt(e)));
      nextTick(() => {
        selectedIds.value = arr;
      });
    }
  },
  { immediate: true, deep: true }
);
watch(
  () => occupationList.value,
  () => {
    initPickerEcho();
  }
);
watch(checkedList, (val) => {
  const str = val.join(",");
  emit("update:modelValue", {
    ...props.modelValue,
    serviceType: str,
  });
});

onShow(async () => {
  if (props.consultantType == "1") {
    // 咨询师认证
    let consultMenu = uni.getStorageSync("consultantMenu");
    if (!consultMenu) {
      let resp = await getConsultantMenus({
        type: 0,
      });
      uni.setStorageSync("consultantMenu", JSON.stringify(resp.data));
    }
    serviceType.value = JSON.parse(uni.getStorageSync("consultantMenu"));
  } else {
    // 倾听师认证
    let listenerMenu = uni.getStorageSync("listenerMenu");
    serviceList().then((res) => {
      t.value = res.data;
      // rawData.value = res.data;
    });
    if (!listenerMenu) {
      let resp = await getConsultantMenus({
        type: 1,
      });
      uni.setStorageSync("listenerMenu", JSON.stringify(resp.data));
    }
    serviceType.value = JSON.parse(uni.getStorageSync("listenerMenu"));
  }
  // 为每个项目添加 checked 属性
  serviceType.value = serviceType.value.map((item) => ({
    ...item,
    checked: false,
  }));
})

/**
 * 超级容错的 JSON 解析函数
 */
const safeJsonParse = (str) => {
  if (!str || str === '[]') return []
  
  try {
    let cleanStr = str
      .replace(/[“”‘’]/g, '"')
      .replace(/\s+/g, '')
      .replace(/\\+/g, '\\')
      .replace(/,}/g, '}')
      .replace(/,\]/g, ']')
      .replace(/([{,])\s*(\w+)\s*:/g, '$1"$2":')
      .replace(/:\s*([^"'\d][^,}]*)([,}])/g, ':"$1"$2')
    
    const result = JSON.parse(cleanStr)
    return Array.isArray(result) ? result : []
  } catch (e) {
    return []
  }
}

// 初始化数据
const initData = async() => {
  const res = await serviceList()
  processedData.value = res.data.map(item => {
    const children = safeJsonParse(item.children)
    const normalizedChildren = children.map(child => ({
      ...child,
      id: Number(child.id) || 0
    })).filter(child => child.id !== 0)
    
    return {
      ...item,
      id: Number(item.id) || 0,
      children: normalizedChildren
    }
  })
}

// 父项全选/取消逻辑（仅点击小方框触发）
const toggleParent = async (parentItem) => {
  const parentId = parentItem.id
  const isChecked = selectedIds.value.includes(parentId)
  
  await nextTick()
  
  if (!isChecked) {
    // 选中：添加父 ID + 所有子 ID
    const addIds = [parentId, ...parentItem.children.map(c => c.id)]
    addIds.forEach(id => {
      if (!selectedIds.value.includes(id)) {
        selectedIds.value.push(id)
      }
    })
  } else {
    // 取消：移除父 ID + 所有子 ID
    const removeIds = [parentId, ...parentItem.children.map(c => c.id)]
    selectedIds.value = selectedIds.value.filter(id => !removeIds.includes(id))
  }
  
  // 强制响应式更新
  selectedIds.value = [...selectedIds.value]
}

// 子项批量处理
const handleChildGroupChange = (parentItem, e) => {
  const checkedChildIds = e.detail.value.map(id => Number(id))
  const allChildIds = parentItem.children.map(c => c.id)
  
  // 移除未选中的子 ID
  selectedIds.value = selectedIds.value.filter(id => {
    if (allChildIds.includes(id) && !checkedChildIds.includes(id)) {
      return false
    }
    return true
  })
  
  // 添加选中的子 ID
  checkedChildIds.forEach(id => {
    if (!selectedIds.value.includes(id)) {
      selectedIds.value.push(id)
    }
  })
  
  // 处理父项选中状态
  const parentId = parentItem.id
  const allChildChecked = allChildIds.every(id => checkedChildIds.includes(id))
  
  if (allChildChecked && !selectedIds.value.includes(parentId)) {
    selectedIds.value.push(parentId)
  } else if (!allChildChecked && selectedIds.value.includes(parentId)) {
    selectedIds.value = selectedIds.value.filter(id => id !== parentId)
  }
  selectedIds.value = [...selectedIds.value]
}

// 页面挂载初始化
onMounted(() => {
  initData()
  getOccupationList()
  initPickerEcho()
})
</script>


<style scoped lang="scss">
.career-box {
  width: 750rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .career-content-box {
    width: 686rpx;
    background: #fff;
    border-radius: 20rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    .career-content {
      width: 630rpx;

      .title {
        color: #212528;
        font-size: 36rpx;
        margin-top: 36rpx;
        font-weight: bold;

        text{
          color: red;
        }
      }

      .remark {
        color: rgba(0, 0, 0, 0.5);
        font-size: 26rpx;
        margin-top: 12rpx;
      }

      .career-collapse-box {
        // margin-top: 30rpx;

        ::v-deep .career-collapse-item {
          .uni-collapse-item__title {
            width: 622rpx;
            height: 92rpx;
            background-color: #f1f7f5;
            border-radius: 10rpx;
            display: flex;
            align-items: center;
            padding-left: 32rpx;

            .checkbox__inner {
              border-color: #35ca95 !important;
            }

            .checklist-text {
              color: #212528 !important;
            }
          }

          .uni-collapse-item__wrap {
            padding-left: 32rpx;
            margin: 8rpx 0rpx 0rpx 0rpx;

            .content {
              .uni-data-checklist {
                .checklist-group {
                  .checklist-box {
                    width: 50%;
                    margin: 32rpx 0rpx;

                    .checkbox__inner {
                      border-color: #35ca95 !important;
                    }

                    .checklist-text {
                      color: #212528 !important;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
.container {
  padding: 20rpx;
  font-size: 28rpx;
}
.parent-title {
  display: flex;
  align-items: center;
  padding: 10rpx 0;
  width: 100%;
}
.custom-checkbox {
  width: 36rpx;
  height: 36rpx;
  border: 2rpx solid #35CA95;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  cursor: pointer;
  flex-shrink: 0;
}

.custom-checkbox.checked {
  background: #35CA95;
  border-color: #35CA95;
}

.check-icon {
  color: #fff;
  font-size: 26rpx;
  font-weight: bold;
  line-height: 1;
}

.parent-name {
  margin-left: 15rpx;
  font-size: 28rpx;
  flex: 1;
}

.children-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 15rpx 10rpx;
  width: 100%;
}

/* 子项样式（两列适配） */
.child-item {
  display: flex;
  align-items: center;
  width: calc(50% - 5rpx); /* 50%宽度 - 一半列间距，保证两列 */
  padding: 8rpx 0;
  box-sizing: border-box;
  ::v-deep .uni-checkbox-input {
    border: 1px solid #35CA95;
  }
}

/* 子项文字（超出省略） */
.child-name {
  margin-left: 10rpx;
  color: #666;
  font-size: 28rpx;
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 超出隐藏 */
  text-overflow: ellipsis; /* 省略号 */
  flex: 1;
}

.no-children {
  padding: 20rpx;
  text-align: center;
  color: #999;
}
</style>
