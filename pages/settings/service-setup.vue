<template>
  <view class="settled-box">
    <view class="header">
      <uni-nav-bar
        :class="scrollTop > 15 ? 'scrollClass' : ''"
        backgroundColor="#fff"
        :border="false"
        title="服务设置"
        class="header-bar"
      >
        <template v-slot:left>
          <uni-icons type="left" size="24" @click="backFn"></uni-icons>
        </template>
        <template v-slot:right>
          <view
            v-if="colorType == 1"
            class="right"
            :class="`right-${typeId.userRole}`"
            @click="serviceAdd"
            >添加</view
          >
        </template>
      </uni-nav-bar>
    </view>
    <view class="content">
      <view
        class="content-list"
        style="margin: 30rpx 0 20rpx"
        v-if="colorType == 2"
      >
        <view class="content-list-item" @click="serviceList(1)">
          <view :style="{ color: colorType == 1 ? colorText : '#959596' }"
            >服务列表</view
          >
          <image
            v-if="colorType == 1 && typeId.userRole == 1"
            src="/static/index/subscript.png"
            style="left: 45rpx"
          />
        </view>
        <view
          v-if="typeId.userRole == 1"
          class="content-list-item"
          @click="serviceList(2)"
        >
          <view :style="{ color: colorType == 2 ? colorText : '#959596' }"
            >时间列表</view
          >
          <image
            v-if="colorType == 2"
            src="/static/index/subscript.png"
            style="right: 45rpx"
          />
        </view>
      </view>
      <view
        v-if="colorType == 1"
        class="content-details"
        :class="`content-details-${typeId.userRole}`"
      >
        <view class="content-list">
          <view class="content-list-item" @click="serviceList(1)">
            <view :style="{ color: colorType == 1 ? colorText : '#959596' }"
              >服务列表</view
            >
            <image
              v-if="colorType == 1 && typeId.userRole == 1"
              src="/static/index/subscript.png"
              style="left: 45rpx"
            />
          </view>
          <view
            v-if="typeId.userRole == 1"
            class="content-list-item"
            @click="serviceList(2)"
          >
            <view :style="{ color: colorType == 2 ? colorText : '#959596' }"
              >时间列表</view
            >
            <image
              v-if="colorType == 2"
              src="/static/index/subscript.png"
              style="right: 45rpx"
            />
          </view>
        </view>
        <view class="content-header">
          <view class="content-header-item">
            <view style="width: 35%; text-align: center">名称</view>
            <view>咨询方式</view>
            <view>时长</view>
            <view>价格</view>
          </view>
          <view
            class="content-header-item"
            v-for="(item, index) in quoteList"
            :key="index"
            style="margin: 20rpx 0"
            @click.stop="toggleSelect(item)"
          >
            <view style="display: flex; align-items: center; width: 35%">
              <image
                :src="`/static/auth/${
                  item.selected ? img : 'not-selected'
                }.png`"
                style="width: 30rpx; height: 30rpx; margin-right: 10rpx"
              ></image>
              <view>{{ item.title }}</view>
            </view>
            <view style="width: 110rpx; text-align: center">{{
              item.serviceQuoteType == 1 ? "视频" : item.serviceQuoteType == 2 ? "语音" : "图文"
            }}</view>
            <view>{{ item.serviceDuration }}分钟</view>
            <view>¥ {{ item.quoteAmount }}</view>
          </view>
        </view>
        <view class="header-operation">
          <view @click="serviceEdit">编辑</view>
          <view class="line">|</view>
          <view @click="serviceDelete">删除</view>
        </view>
      </view>
    </view>
    <view class="container" v-if="colorType == 2 && typeId.userRole == 1">
      <!-- 一周日期导航栏 -->
      <scroll-view scroll-x class="date-nav">
        <view
          v-for="(item, idx) in currentWeekDates"
          :key="idx"
          class="date-item"
          :class="{
            active: item.dateStr === selectedDate,
            available: item.isAvailable,
          }"
          @click="selectedDate = item.dateStr"
        >
          <view class="week">{{ item.week }}</view>
          <view class="date">{{
            item.dateStr.split("-").slice(1).join("-")
          }}</view>
          <view class="status" v-if="item.isAvailable">可约</view>
        </view>
      </scroll-view>

      <!-- 时段选择区域 -->
      <view class="time-section">
        <!-- 上午时段 -->
        <view class="section-title">上午</view>
        <view class="slots-wrap">
          <view
            v-for="(slot, idx) in morningSlots"
            :key="idx"
            class="slot-item"
            :class="{ selected: isSlotSelected(slot) }"
            @click="toggleTimeSlot(slot)"
          >
            {{ slot.startTime }}-{{ slot.endTime }}
          </view>
        </view>

        <!-- 下午时段 -->
        <view class="section-title">下午</view>
        <view class="slots-wrap">
          <view
            v-for="(slot, idx) in afternoonSlots"
            :key="idx"
            class="slot-item"
            :class="{ selected: isSlotSelected(slot) }"
            @click="toggleTimeSlot(slot)"
          >
            {{ slot.startTime }}-{{ slot.endTime }}
          </view>
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="btn-group">
        <view class="save-btn" @click="handleSubmit">保存设置</view>
      </view>
    </view>
    <uni-popup ref="popup">
      <view class="popup-content">
        <view class="popup-header">
          <view>选择{{typeId.userRole == 1 ? '咨询' : '倾听'}}方式</view>
          <uni-icons
            type="closeempty"
            size="20"
            class="close-icon"
            color="#A6A6A6"
            @click="unipopupClose"
          ></uni-icons>
        </view>
        <view class="popup-list">
          <view
            v-for="(item, index) in popupList"
            :key="index"
            @click="wayAdd(item)"
            class="popup-list-item"
          >
            <image
              v-if="item.type == 'img'"
              :src="item.icon"
              :style="{ width: item.width, height: item.height }"
            />
            <uni-icons
              v-else
              type="wallet"
              size="35"
              color="#38CC98"
              class="popup-list-icon"
            />
            <view>{{ item.title }}</view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useGlobalDataStore } from "@/stores/global.js";
import { onShow, onPageScroll } from "@dcloudio/uni-app";
import {
  setBatch,
  consultantList,
  listenerList,
  listenerDelete,
  consultantDelete,
} from "@/common/api/worry.js";

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const typeId = ref({});
const img = ref("select-green");
const colorText = ref("#34A76F");

onLoad((options) => {
  typeId.value = JSON.parse(options.type);  
  colorText.value = typeId.value.userRole == "1" ? "#34A76F" : "#eb9516";
  img.value = typeId.value.userRole == "1" ? "select-green" : "select-yellow";
});
const quoteList = ref([]);
const getQuoteList = async () => {
  try {
    const api = typeId.value.userRole == "1" ? consultantList : listenerList;
    const res = await api(typeId.value.id);
    quoteList.value = res.data.map((item) => ({
      ...item,
      selected: false,
    }));
  } catch (error) {
    console.error("Failed to fetch quote list:", error);
  }
};
onShow(() => {
  getQuoteList();
});
const colorType = ref(1);
const serviceList = (val) => {
  colorType.value = val;
};

const backFn = () => {
  uni.navigateBack({
    delta: 1,
  });
};
// 倾听 listen-txt.png listen-speech.png
// consulting-video.png consulting-speech.png

const scrollTop = ref(0);
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});

const popupOriginList = ref([
  {
    id: 1,
    type: "img",
    icon: "/static/my/consulting-video.png",
    title: "视频",
    width: "70rpx",
    height: "50rpx",
  },
  {
    id: 2,
    type: "img",
    icon: "/static/my/consulting-speech.png",
    title: "语音",
    width: "60rpx",
    height: "70rpx",
  },
  { id: 3, type: "icon", title: "文字", width: "0", height: "0" },
]);

const popupList = computed(() => {
  const { userRole } = typeId.value;
  if (userRole == 1) {
    return popupOriginList.value.filter(item => item.id !== 3);
  }
  else if (userRole == 2) {
    return popupOriginList.value.filter(item => item.id !== 1);
  }
  return popupOriginList;
});

const popup = ref(null);
const serviceAdd = () => {
  popup.value.open("bottom");
};
const unipopupClose = () => {
  popup.value.close();
};
const wayAdd = (item) => {
  popup.value.close();
  uni.navigateTo({
    url: `/pages/settings/service-price?type=${item.id}&point=${JSON.stringify(
      typeId.value
    )}`,
  });
};
const processingObj = ref({});
const toggleSelect = (item) => {
  item.selected = !item.selected;
  processingObj.value = item;
  quoteList.value.forEach((i) => {
    if (i !== item) i.selected = false;
  });
};
const serviceEdit = () => {
  if (processingObj.value.id == undefined) {
    return uni.showToast({
      title: "请选择要编辑的服务",
      icon: "none",
    });
  }
  uni.navigateTo({
    url: `/pages/settings/service-price?type=${
      processingObj.value.serviceQuoteType
    }&point=${JSON.stringify(typeId.value)}&update=${JSON.stringify(
      processingObj.value
    )}`,
  });
};

const serviceDelete = async () => {
  if (processingObj.value.id == undefined) {
    return uni.showToast({
      title: "请选择要删除的服务",
      icon: "none",
    });
  }
  try {
    const api = typeId.value.userRole == "1" ? consultantDelete : listenerDelete;
    const res = await api(processingObj.value.id);
    uni.showToast({
      title: "删除成功",
      icon: "none",
    });
    getQuoteList();
  } catch (error) {
    console.log(error);
  }
};

dayjs.locale("zh-cn");
// 生成一周日期（今天+后续6天）
const getWeekDates = () => {
  const dates = [];
  const todayStr = dayjs().format("YYYY-MM-DD");
  for (let i = 0; i < 7; i++) {
    const date = dayjs().add(i, "day");
    const currentDateStr = date.format("YYYY-MM-DD");
    dates.push({
      dateStr: currentDateStr,
      week: currentDateStr === todayStr ? "今天" : date.format("ddd"), // 星期（如“周四”）
      isAvailable: true, // 默认全部可约，可根据需求调整
    });
  }
  return dates;
};
const currentWeekDates = ref(getWeekDates());
const selectedDate = ref(currentWeekDates.value[0].dateStr); // 默认选中今天

// 生成时段（9:00-18:00，每30分钟一段）
const generateTimeSlots = (startHour, endHour, interval) => {
  const slots = [];
  let current = dayjs().hour(startHour).minute(0);
  const end = dayjs().hour(endHour).minute(0);

  while (current.isBefore(end)) {
    const startTime = current.format("HH:mm");
    current = current.add(interval, "minute");
    const endTime = current.format("HH:mm");
    slots.push({ startTime, endTime });
  }
  return slots;
};
const morningSlots = ref(generateTimeSlots(9, 12, 30)); // 上午9:00-12:00
const afternoonSlots = ref(generateTimeSlots(13, 18, 30)); // 下午13:00-18:00

// 选中时段管理
const selectedTimeSlots = ref({}); // 结构：{ 日期: [时段列表] }

// 切换时段选中状态
const toggleTimeSlot = (slot) => {
  if (!selectedTimeSlots.value[selectedDate.value]) {
    selectedTimeSlots.value[selectedDate.value] = [];
  }
  const targetIdx = selectedTimeSlots.value[selectedDate.value].findIndex(
    (item) => item.startTime === slot.startTime && item.endTime === slot.endTime
  );
  if (targetIdx > -1) {
    // 移除选中
    selectedTimeSlots.value[selectedDate.value].splice(targetIdx, 1);
  } else {
    // 添加选中
    selectedTimeSlots.value[selectedDate.value].push({ ...slot });
  }
  // 触发响应式更新
  selectedTimeSlots.value = { ...selectedTimeSlots.value };
};

// 检查时段是否选中
const isSlotSelected = (slot) => {
  return (
    selectedTimeSlots.value[selectedDate.value]?.some(
      (item) =>
        item.startTime === slot.startTime && item.endTime === slot.endTime
    ) || false
  );
};

// 提交数据
const handleSubmit = () => {
  // 组装提交数据
  const submitList = [];
  Object.entries(selectedTimeSlots.value).forEach(([date, slots]) => {
    slots.forEach((slot) => {
      submitList.push({
        consultantId: 24, // typeId.value.id, // 顾问ID
        date: `${date} ${slot.startTime}:00`, // 日期+开始时间
        isEnable: 1,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    });
  });
  
  postSetBatch(submitList);
};
const postSetBatch = async (list) => {
  try {
    // const res = await setSchedule(list);
    const res = await setBatch(list);
    uni.showToast({ title: "保存成功", icon: "success" });
  } catch (error) {
    console.log(error);
  }
}
// setBatch
</script>

<style lang="scss" scoped>
.settled-box {
  $statusBarHeight: v-bind(statusBarHeight);
  width: 100vw;
  min-height: 100vh !important;
  background-color: #f4f6f8;
  padding-bottom: 30rpx;

  .header {
    position: fixed;
    width: 100vw;
    height: 88rpx;
    z-index: 999;
    background-color: #fff;

    .header-bar {
      padding-top: calc($statusBarHeight - 122rpx);

      ::v-deep(.uni-nav-bar-text) {
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
      }
      .right {
        text-align: center;
        width: 250rpx;
        font-size: 28rpx;
        color: #fff;
        padding: 6rpx 20rpx;
        border-radius: 50rpx;
      }
      .right-1 {
        background-color: #35ca95;
      }
      .right-2 {
        background-color: #eb9516;
      }
    }
  }

  .scrollClass {
    background-color: #fff;
    box-shadow: 0rpx 4rpx 20rpx rgba(0, 0, 0, 0.1);

    ::v-deep(.uni-nav-bar-text) {
      color: #000;
    }
  }

  .content {
    position: relative;
    .content-list {
      z-index: 999;
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .content-list-item {
        position: relative;
        font-size: 30rpx;
        font-weight: bold;
        image {
          position: absolute;
          top: 30rpx;
          width: 30rpx;
          height: 24rpx;
        }
      }
    }
    padding-top: calc($statusBarHeight - 20rpx);
    .content-details-1 {
      background: linear-gradient(to top, #35ca9661, transparent 40%);
    }
    .content-details-2 {
      background: linear-gradient(to top, #ffe4b2d6, transparent 40%);
    }
    .content-details {
      margin: 50rpx 30rpx 30rpx;
      padding: 50rpx;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: space-between;
      border-radius: 20rpx;
      background-size: 100% 100%;
      background-color: #fff;
      .content-header {
        width: 100%;
        border-bottom: 1rpx solid #f4f6f8;
        padding: 30rpx 0;
        .content-header-item {
          display: flex;
          justify-content: space-between;
          font-size: 28rpx;
        }
      }
      .header-operation {
        display: flex;
        align-items: center;
        justify-content: center;
        .line {
          margin: 0 20rpx;
        }
      }
    }
  }

  .popup-content {
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    padding: 30rpx;
    .popup-header {
      position: relative;
      view {
        font-size: 32rpx;
        font-weight: 600;
        text-align: center;
      }
      .close-icon {
        position: absolute;
        right: 10rpx;
        top: 0rpx;
      }
    }
    .popup-list {
      margin: 80rpx 0 150rpx;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .popup-list-item {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 20rpx 0;
        border-bottom: 1rpx solid #f4f6f8;
        image {
          margin-bottom: 30rpx;
        }
        view {
          font-size: 28rpx;
          color: #333;
        }
        .popup-list-icon {
          margin-bottom: 30rpx;
        }
      }
    }
  }
}
.container {
  margin: 0 20rpx;
  padding: 16rpx;
  background: linear-gradient(to top, #35ca963c, transparent 15%);
  border-radius: 0 0 30rpx 30rpx;
}

/* 日期导航 */
.date-nav {
  white-space: nowrap;
  padding-bottom: 24rpx;
  border-bottom: 2rpx solid #e6e7e8;
}
.date-item {
  display: inline-block;
  width: 120rpx;
  text-align: center;
  padding: 12rpx;
  margin-right: 12rpx;
  background: #fff;
  border-radius: 8rpx;
}
.date-item.active {
  border: 2rpx solid #64d6ae;
}
.date-item.available .status {
  color: #64d6ae;
}
.week {
  font-size: 28rpx;
}
.date {
  font-size: 24rpx;
}
.status {
  font-size: 22rpx;
  color: #999;
}

/* 时段区域 */
.time-section {
  margin-bottom: 32rpx;
}
.section-title {
  font-size: 28rpx;
  margin: 16rpx 0;
}
.slots-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 0 20rpx;
}
.slot-item {
  min-width: 200rpx;
  text-align: center;
  padding: 12rpx 24rpx;
  background: #fff;
  border-radius: 50rpx;
  font-size: 24rpx;
}
.slot-item.selected {
  border: 2rpx solid #64d6ae;
}

/* 按钮 */
.btn-group {
  display: flex;
  justify-content: center;
  margin-top: 32rpx;
}

.save-btn {
  width: 150rpx;
  padding: 5rpx;
  font-size: 30rpx;
  text-align: center;
  color: #3ed8a1;
  border: 2rpx solid #3ed8a1;
  border-radius: 50rpx;
  margin-top: 20rpx;
}
</style>
