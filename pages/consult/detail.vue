<!-- 倾听师 -->
<template>
  <view class="consult-detail-box">
    <scroll-view
      scroll-y
      class="scroll-content"
      :scroll-top="top"
      :show-scrollbar="false"
      scroll-with-animation
      id="scrollView"
    >
      <uni-nav-bar
        :backgroundColor="scrollTop > 15 ? '#fff' : 'transparent'"
        :border="false"
        :title="scrollTop > 15 ? consultantInfo.consultantName : ''"
        class="header-bar"
        :statusBar="true"
        fixed
      >
        <template v-slot:left>
          <view class="right">
            <uni-icons
              type="left"
              size="24"
              v-if="scrollTop > 15"
              @click="backFn"
            ></uni-icons>
            <image
              src="/static/common/back_circle.png"
              style="width: 56rpx; height: 56rpx"
              @click="backFn"
              v-else
            ></image>
          </view>
        </template>
        <template v-slot:right>
          <view class="right">
            <image
              src="/static/confide/share.png"
              style="width: 40rpx; height: 40rpx"
              v-if="scrollTop > 15"
            >
            </image>
            <image
              src="/static/common/share_circle.png"
              style="width: 56rpx; height: 56rpx"
              v-else
            >
            </image>
          </view>
        </template>
      </uni-nav-bar>
      <view class="consult-detail-content">
        <view class="swiper-content">
          <view class="uni-margin-wrap">
            <swiper
              class="swiper"
              circular
              :indicator-dots="true"
              :autoplay="true"
              :interval="5000"
              :duration="500"
            >
              <swiper-item
                v-for="(item, index) in JSON.parse(
                  consultantInfo.masterGallery
                )"
                :key="index"
                class="swiper-item"
              >
                <image
                  :src="item"
                  style="height: 590rpx"
                  mode="heightFix"
                ></image>
              </swiper-item>
            </swiper>
          </view>
        </view>
        <view class="consult-detail-info">
          <view class="detail-item-line-1">
            <view class="name">
              <text class="name-a">{{ consultantInfo.name }}</text>
              <text class="name-b">{{ consultantInfo.occupationName }}</text>
              <text class="name-c">{{
                getGenerationByBirthdate(consultantInfo.birthdate)
              }}</text>
            </view>
            <view v-if="JSON.stringify(quoteList) !== '{}'" class="money"><text class="num">{{ quoteList.quoteAmount}}</text><text>元/{{quoteList.serviceDuration}}分钟</text></view>
          </view>
          <view class="detail-item-line-2">
            <text
              >{{ consultantInfo.certificateList[0].name }} |
              {{ consultantInfo.educationList[0].schoolName }} |
              {{ consultantInfo.constellation }}</text
            >
          </view>
          <view class="detail-item-line-3">
            <view class="address">
              <image src="/static/common/address.png"></image>
              <text>{{ consultantInfo.address }}</text>
            </view>
            <view class="txt">
              <view>
                <text class="voice">语音咨询</text> |
                <text class="quick">最快可约最近3天</text>
                <uni-icons type="right" size="14" color="#35CA95"></uni-icons>
              </view>
            </view>
          </view>

          <view class="detail-item-line-4">
            <view class="content">
              <view class="list">
                <view class="item">
                  <view>
                    <text class="num">{{ consultantInfo.workTime }}</text>
                    <text class="unit">年</text>
                  </view>
                  <view class="txt">从业年限</view>
                </view>
                <view class="item">
                  <view>
                    <text class="num">{{ expData.platformHours }}</text>
                    <text class="unit">小时</text>
                  </view>
                  <view class="txt">平台时长</view>
                </view>
                <view class="item">
                  <view>
                    <text class="num">{{ expData.consultUserCount }}</text>
                    <text class="unit">人</text>
                  </view>
                  <view class="txt">咨询人数</view>
                </view>
                <view class="item">
                  <view>
                    <text class="num">{{ expData.commentCount }}</text>
                  </view>
                  <view class="txt">咨询感受</view>
                </view>
              </view>
              <view class="tips">
                <image src="/static/common/follwer.png"></image>
                <text class="txt">服务经验</text>
              </view>
            </view>
          </view>

          <view
            class="detail-item-line-5"
            id="tabs"
            :class="fixedActive ? 'tabsFixed' : ''"
          >
            <view class="tabs">
              <view
                class="tab-item"
                v-for="(item, index) in tabsList"
                :key="index"
                :class="tabIndex == index ? 'active' : ''"
                @click="scrollToTargetInScroll(`tab-${index + 1}`)"
                >{{ item.label }}
              </view>
            </view>
          </view>

          <view class="detail-item-line-6 tab6" id="tab-1">
            <view class="content">
              <view class="title">个人简介</view>
              <view class="info">{{ consultantInfo.profile }}</view>
            </view>
          </view>

          <view class="detail-item-line-6 detail-item-line-7" id="tab-2">
            <view class="content">
              <view class="title">擅长方向</view>
              <view class="info">
                <view class="detail-item">
                  <!-- <view class="detail-title">人际交往</view> -->
                  <view class="detail-content">{{
                    consultantInfo.serviceTypes.join("、")
                  }}</view>
                </view>
              </view>
              <view class="title">擅长疗法</view>
              <view class="tags">
                <text class="tag-item">沙盘疗法</text>
                <text class="tag-item">心理动力取向</text>
                <text class="tag-item">心理动力取向</text>
              </view>
            </view>
          </view>

          <view class="detail-item-line-6 detail-item-line-8" id="tab-3">
            <view
              class="content"
              :style="{ 'max-height': maxHeight, overflow: 'hidden' }"
            >
              <view class="info">
                <view
                  class="certificate-detail"
                  v-for="(item, index) in consultantInfo.certificateList"
                  :key="index"
                >
                  <view class="tag">资质</view>
                  <view class="tag-info">
                    <view class="tag-title">{{ item.name }}</view>
                    <view class="certificate-info">
                      <view>发证时间：{{ item.date }} </view>
                      <view>证书编号：{{ item.number }}</view>
                    </view>
                  </view>
                </view>
                <view
                  class="eduication-detail"
                  v-for="(item, index) in consultantInfo.educationList"
                  :key="index"
                >
                  <view class="tag">学历</view>
                  <view class="tag-info">
                    <view class="tag-title">{{ item.schoolName }}</view>
                    <view class="eduication-info">
                      <view>发证时间：{{ item.endTime }} </view>
                      <view>证书编号：{{ item.code }}</view>
                    </view>
                  </view>
                </view>
                <view class="step-detail">
                  <view class="training">
                    <view class="training-title">伦理培训</view>
                    <view class="training-timer"
                      >{{ stepList.length }}项培训，累计40小时</view
                    >
                  </view>
                  <view class="step-box">
                    <uni-steps
                      :options="stepList"
                      active-color="#35CA95"
                      :active="stepActive"
                      direction="column"
                    />
                  </view>
                </view>
              </view>
            </view>
            <view
              class="more"
              @click="more"
              style="background-color: #fff !important"
              >查看更多</view
            >
          </view>

          <view class="detail-item-line-6 detail-item-line-9" id="tab-4">
            <view class="content" @click="openEvaluate">
              <view class="title">咨询感受</view>
              <view class="info">
                <!-- <view class="feel-type-box" @click="openEvaluate">
                  <view class="feel-type" v-for="i in 10" :key="i">
                    <view class="txt">恋爱压力</view>
                    <view class="num">250</view>
                  </view>
                </view> -->

                <view class="comment-list">
                  <view
                    class="comment-item"
                    v-for="(item, index) in evaluationList"
                    :key="index"
                  >
                    <view class="comment-item-header">
                      <view class="user">
                        <image :src="item.avatar" style="border-radius: 50%" />
                        <text>{{ item.nickname }}</text>
                      </view>
                      <view class="date">{{ item.createTime }}</view>
                    </view>
                    <view class="comment-item-content">
                      <mote-lines-divide
                        :line="3"
                        expandText="展开"
                        foldHint="收起"
                      >
                        {{ item.content }}
                      </mote-lines-divide>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view
            class="detail-item-line-6 detail-item-line-10"
            id="tab-5"
            @click="openPopupFn"
          >
            <view class="content">
              <view class="title"
                >可约时间<text class="remark">（北京时间）</text></view
              >
              <view class="info">
                <view class="txt"
                  >如果暂时无法确定具体的咨询时间，可以在预约成功后，再与咨询师协商具体时间。</view
                >

                <view class="order-timer-box">
                  <view
                    class="order-timer-item"
                    v-for="(item, index) in orderLists"
                    :class="item.status == 1 ? 'active' : ''"
                  >
                    <view class="month">{{ item.month }}月</view>
                    <view class="day">{{ item.day }}</view>
                    <view class="week">{{ item.week }}</view>
                    <view class="isOrder">{{ item.status == 1 ? '可约' : '已满' }}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view class="detail-item-line-6 detail-item-line-11">
            <view class="content">
              <view class="title"
                >预约须知<view>
                  <view class="info">
                    <view>1、咨询为预约服务，您可选择咨询师可约时段下单，每次咨询50分钟或60分钟。</view>
                    <view>2、订单支付成功后，您的预约需咨询师确认是否接受，确认后将短信通知您。</view>
                    <view>3、咨询方式有面对面、视频、电话、文字四种，具体以咨询师展示的可选方式为准。</view>
                    <view>4、因不可抗力因素变更时间或取消咨询预约，请提前24小时告知咨询师。</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="footer">
      <view class="follow">
        <image src="/static/common/follow.png"></image>
        <text>关注</text>
      </view>
      <view class="contact" @click="customerService">
        <image src="/static/common/contect.png"></image>
        <text>客服</text>
      </view>
      <view class="message" @click="toChat">
        <text class="txt">私信ta</text>
      </view>
      <view class="reservation" @click="openPopupFn">
        <text>预约咨询</text>
        <text class="remark">（语音/视频）</text>
      </view>
    </view>

    <uni-popup ref="popup" type="bottom" border-radius="20rpx 20rpx 0 0">
      <view class="popup-box">
        <view class="popup-header">
          <view class="title"
            >选择咨询时段<text class="remark">（北京时间）</text></view
          >
          <view class="msg">暂不选择咨询时间，可在下单后与咨询师协商时间</view>
        </view>
        <view class="time-selector">
          <!-- 日期选择区（横向滚动，适配多日期） -->
          <scroll-view
            class="date-scroll"
            scroll-x="true"
            show-scrollbar="true"
          >
            <view class="date-list">
              <view
                v-for="(dateItem, index) in dateOptions"
                :key="`date-${index}-${dateItem.date}`"
                class="date-card"
                :class="{ 
                  active: selectedDate?.date === dateItem.date, 
                  'no-available': !hasAvailableTime(dateItem),
                  'status-disable': dateItem.status === 2
                }"
                @click="dateItem.status !== 2 && handleDateSelect(dateItem)"
              >
                <text class="week" :class="{
                  'week-active': selectedDate?.date === dateItem.date,
                  'available': dateItem.status === 2
                }">{{ getWeekText(dateItem.dayOfWeek) }}</text>
                <text class="date">{{ dateItem.date.slice(5) }}</text>
                <text class="status" :class="dateItem.status == 2 ? 'available' : ''">
                  {{ hasAvailableTime(dateItem) ? "可约" : "已满" }}
                </text>
              </view>
            </view>
          </scroll-view>

          <!-- 时间段选择区（默认显示第一个日期的时段，纵向滚动） -->
          <view v-if="selectedDate" class="time-list">
            <!-- 上午时段（12点前） -->
            <view class="time-section">
              <text v-if="filterTime('morning').length" class="section-title">上午</text>
              <view class="time-items">
                <view
                  v-for="(timeItem, idx) in filterTime('morning')"
                  :key="`time-morning-${idx}-${timeItem.date}-${timeItem.text}`"
                  class="time-item"
                  :class="[
                    {
                      active:
                        selectedTime?.text === timeItem.text &&
                        selectedTime?.date === timeItem.date,
                    },
                    getTimeStatusClass(timeItem.status), // 根据status动态添加样式类
                  ]"
                  @click="handleTimeSelect(timeItem)"
                >
                  <!-- 时间段文本 -->
                  <text class="time-text">{{ timeItem.text }}</text>
                  <!-- 状态小标签（可选，增强提示） -->
                  <text class="status-tag" v-if="timeItem.status !== 1">
                    {{ getStatusText(timeItem.status) }}
                  </text>
                </view>
              </view>
            </view>

            <!-- 下午时段（12点及以后） -->
            <view class="time-section">
              <text class="section-title" v-if="filterTime('afternoon').length">下午</text>
              <view class="time-items">
                <view
                  v-for="(timeItem, idx) in filterTime('afternoon')"
                  :key="`time-afternoon-${idx}-${timeItem.date}-${timeItem.text}`"
                  class="time-item"
                  :class="[
                    {
                      active:
                        selectedTime?.text === timeItem.text &&
                        selectedTime?.date === timeItem.date,
                    },
                    getTimeStatusClass(timeItem.status), // 根据status动态添加样式类
                  ]"
                  @click="handleTimeSelect(timeItem)"
                >
                  <text class="time-text">{{ timeItem.text }}</text>
                  <text class="status-tag" v-if="timeItem.status !== 1">
                    {{ getStatusText(timeItem.status) }}
                  </text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="popup-footer">
          <view class="msg">
            <view class="date" v-if="selectedItem">{{ selectedItem.date }}({{ getWeekText(selectedItem.dayOfWeek) }}) | {{ selectedItem.text }}</view>
            <view class="name">咨询师：{{ consultantInfo.name }}</view>
          </view>
          <view class="confirm" @click="toPay">确认预约</view>
        </view>
      </view>
      <CustomerService ref="serviceRef"></CustomerService>
    </uni-popup>
  </view>
</template>

<script setup>
import { nextTick, onMounted, ref, getCurrentInstance, computed } from "vue";
import { onLoad, onBackPress } from "@dcloudio/uni-app";
import { useGlobalDataStore } from "@/stores/global.js";
import { handleCareerList, getGenerationByBirthdate } from "@/lib/utils.js";
import {
  getConsultantById,
  getCommentInfo,
  getCommentList,
  getServiceExperienceCon,
} from "@/common/api/consultant.js";
import { getCommentByTargetUserId, getSchedule } from "@/common/api/worry.js";
import MoteLinesDivide from "@/components/mote-lines-divide/mote-lines-divide";
import CustomerService from "@/components/Customer-Service.vue";

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const scrollTop = ref(0);
const tabIndex = ref(0);
const instance = getCurrentInstance();
const top = ref(0);
const fixedActive = ref(false);
const popup = ref(null);
const maxHeight = ref("832rpx");
const timeList = ref([]);
const consultantInfo = ref({
  consultantName: "",
  gallery: "",
});
const userIds = ref("");
const quoteList = ref({});
onLoad((options) => {
  userIds.value = options.userId;
  quoteList.value = JSON.parse(options.quoteList);
  consultInfo(options.id);
  getConsultantInfo(options.id);
  getScheduleApi(options.id);
  getCommentByTargetUserIdApi(options.userId);
});

const getScheduleApi = async (id) => {
  let res = await getSchedule({ consultantId: id });
  timeList.value = res.data;
  const dateMap = {};
  res.data.forEach(item => {
    if (!dateMap[item.date]) {
      dateMap[item.date] = {
        date: item.date,
        day: item.date.split('-')[2], // 日期号（如10）
        week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][item.dayOfWeek - 1], // 星期
        status: item.status // 取该日期的状态（可根据实际需求调整）
      };
    }
  });
  orderLists.value = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));
};

const backFn = () => {
  uni.navigateBack({
    delta: 1,
  });
};

const scrollToTargetInScroll = async (targetId) => {
  await nextTick();
  const query = uni.createSelectorQuery().in(instance);
  query
    .select(`#${targetId}`)
    .boundingClientRect()
    .select(`#scrollView`)
    .boundingClientRect()
    .exec((res) => {
      const targetRect = res[0];
      const scrollViewRect = res[1];

      if (targetRect && scrollViewRect) {
        top.value = targetRect.top - scrollViewRect.top;
      }
    });
};

const serviceRef = ref(null);
const customerService = () => {
  serviceRef.value.open();
};

const tabsList = ref([
  {
    label: "个人简介",
    id: "tab-1",
    class: "tab6",
  },
  {
    label: "擅长领域",
    id: "tab-2",
    class: "tab7",
  },
  {
    label: "受训经历",
    id: "tab-3",
    class: "tab8",
  },
  {
    label: "咨询感受",
    id: "tab-4",
    class: "tab9",
  },
  {
    label: "预约时间",
    id: "tab-5",
    class: "tab10",
  },
]);

const stepList = ref([]);
const orderLists = ref([]);

// 评价
const evaluationList = ref([]);
const getCommentByTargetUserIdApi = async (id) => {
  let { data } = await getCommentByTargetUserId({
    targetUserId: id,
    page: 1,
    pageSize: 10,
  });
  evaluationList.value = data.records;
};

const stepActive = ref(stepList.value.length);
const openPopupFn = () => {
  popup.value.open();
};

const openEvaluate = () => {
  uni.navigateTo({
    url: `/pages/consult-feel/consult-feel?userId=${
      userIds.value
    }&userInfo=${JSON.stringify(consultantInfo.value)}`,
  });
};

const more = () => {
  maxHeight.value = "none";
};
/**
 * 获取详情
 */
const getConsultantInfo = async (id) => {
  let res = await getConsultantById({ id });
  consultantInfo.value = res.data;
  console.log(res.data);

  stepList.value = handleCareerList(res.data.careerList);
};

const toChat = () => {
  const { userId, name, avatar } = consultantInfo.value;
  uni.navigateTo({
    url: `/pages/message/private-chat?to=${userId}&name=${name}&avatar=${avatar}`,
  });
};

const toPay = () => {
  if(selectedItem.value === null) {
    uni.showToast({
      title: "请选择预约时间",
      icon: "none",
    });
    return
  }
  const { id, userId, name, avatar } = consultantInfo.value;
  uni.navigateTo({
    url: `/pages/payment/payment?id=${id}&to=${userId}&name=${name}&avatar=${avatar}&time=${JSON.stringify(selectedItem.value)}`,
  });
};
const service = ref({});
const expData = ref({});
const consultInfo = async (id) => {
  try {
    const info = await getCommentInfo({ id });
    const list = await getCommentList({ id, page: 1, count: 10 });
    const exp = await getServiceExperienceCon({ id });
    service.value = info.data;
    expData.value = exp.data;
  } catch (e) {}
};

// 处理响应式数据：按日期分组（使用timeList.value，且支持响应式更新）
const dateGroups = computed(() => {
  return timeList.value.reduce((acc, item) => {
    const { date, dayOfWeek } = item;
    // 初始化当前日期的分组对象
    if (!acc[date]) {
      acc[date] = { date, dayOfWeek, times: [], status: 1 }; // 默认值
    }
    // 收集当前日期下的所有时段
    acc[date].times.push(item);

    // ✅ 核心判断逻辑 - 重中之重
    const currentDateItem = acc[date];
    // 1. 判断：当前日期下的【所有时段】是否全部都是 status=2
    const allStatusIs2 = currentDateItem.times.every(timeItem => timeItem.status === 2);
    if (allStatusIs2) {
      // 规则1：全是2 → 日期状态设为2，时段数组置空
      currentDateItem.status = 2;
      currentDateItem.times = [];
    } else {
      // 规则2：只要有一个不是2(有1) → 日期状态设为1，保留所有时段
      currentDateItem.status = 1;
    }
    return acc;
  }, {});
});
// 转换为数组（响应式）
const dateOptions = computed(() => Object.values(dateGroups.value));

// 响应式状态：选中的日期、时间段、最终对象
const selectedDate = ref(null);
const selectedTime = ref(null);
const selectedItem = ref(null);

// 日期选择事件（清空已有时间段选中）
const handleDateSelect = (dateItem) => {
  selectedDate.value = dateItem;
  selectedTime.value = null; // 切换日期时清空时间段选中
  selectedItem.value = null;
};

// 时间段选择事件（关联日期，仅status=1时可选中）
const handleTimeSelect = (timeItem) => {
  // 仅当状态为1（可约）时，才执行选中逻辑
  if (!selectedDate.value || timeItem.status !== 1) {
    return;
  }
  selectedTime.value = timeItem;
  selectedItem.value = timeItem; // 选中的对象就是当前时间段项
  console.log("最终选中对象：", selectedItem.value); // 可替换为业务逻辑（如uni.$emit）
};

// 星期转换（dayOfWeek：1=周一，6=周六，7=周日）
const getWeekText = (dayOfWeek) => {
  const today = new Date().getDay();
  const todayWeekNum = today === 0 ? 7 : today;
  const weeks = ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  return dayOfWeek == todayWeekNum ? "今天" : (weeks[dayOfWeek] || "未知");
};

// 过滤上午/下午时段
const filterTime = (type) => {
  if (!selectedDate.value) return [];
  return selectedDate.value.times.filter((item) => {
    const hour = Number(item.startTime.split(":")[0]);
    return type === "morning" ? hour < 12 : hour >= 12;
  });
};

// ===== 新增：status状态相关方法 =====
// 根据status获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    0: "不可约",
    1: "可约",
    2: "已满",
  };
  return statusMap[status] || "未知";
};

// 根据status获取时间段样式类
const getTimeStatusClass = (status) => {
  const classMap = {
    0: "status-disabled", // 不可约
    1: "status-available", // 可约
    2: "status-full", // 已满
  };
  return classMap[status] || "";
};

// 判断日期下是否有可约时段（status=1）
const hasAvailableTime = (dateItem) => {  
  return dateItem.times.some((item) => item.status === 1);
};

// 初始化：默认选中第一个日期，时间段不选
onMounted(() => {
  if (dateOptions.value.length > 0) {
    selectedDate.value = dateOptions.value[0]; // 默认选中第一个日期
  }
});
</script>

<style lang="scss" scoped>
.consult-detail-box {
  $statusBarHeight: v-bind(statusBarHeight);
  width: 100vw;
  min-height: 100vh;
  height: auto;
  background-color: #f4f6f8;

  .scroll-content {
    height: calc(100vh - 108rpx);

    .consult-detail-content {
      width: 100vw;
      position: absolute;
      top: 0px;

      .header {
        .header-bar {
          ::v-deep(.uni-nav-bar-text) {
            font-size: 32rpx;
            font-weight: 600;
            color: #fff;
          }
        }
      }

      .headerActive {
        background-color: #fff;
      }
    }

    .consult-detail-content {
      .swiper-content {
        .uni-margin-wrap {
          width: 100vw;
          height: 590rpx;

          .swiper {
            width: 100vw;
            height: 590rpx;

            .swiper-item {
              width: 100vw;
              height: 590rpx;
              backdrop-filter: blur(133px);
            }

            ::v-deep .uni-swiper-dots {
              bottom: 100rpx !important;

              .uni-swiper-dot {
                width: 6px;
                height: 3px;
                border-radius: 3px;
                background: rgba(255, 255, 255, 0.16);
              }

              .uni-swiper-dot-active {
                background: #ffffff;
              }
            }
          }
        }
      }

      .consult-detail-info {
        width: 100vw;
        background: linear-gradient(180deg, #d4fff0 0%, #f4f6f8 3%);
        height: auto;
        border-top-right-radius: 40rpx;
        border-top-left-radius: 40rpx;
        margin-top: -60rpx;
        position: relative;
        z-index: 1;

        .detail-item-line-1 {
          padding: 52rpx 32rpx 32rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .name {
            font-size: 48rpx;
            font-weight: 500;
            line-height: 48rpx;
            color: #000000;
            display: flex;
            align-items: center;

            .name-a,
            .name-b,
            .name-c {
              margin-right: 12rpx;
            }

            .name-b {
              font-size: 22rpx;
              font-weight: 500;
              line-height: 11px;
              letter-spacing: normal;
              color: #1f2641;
              border-radius: 18rpx;
              background: #f9eac2;
              padding: 8rpx 16rpx;
            }

            .name-c {
              border-radius: 18rpx;
              background: #dfe1f7;
              font-size: 22rpx;
              font-weight: 500;
              line-height: 22rpx;
              color: #000000;
              padding: 8rpx 16rpx;
            }
          }

          .money {
            font-size: 20rpx;
            line-height: 20rpx;
            color: #fa5151;

            .num {
              font-size: 48rpx;
              font-weight: bold;
              line-height: 48rpx;
              color: #fa5151;
            }
          }
        }

        .detail-item-line-2 {
          font-size: 26rpx;
          line-height: 26rpx;
          padding: 0rpx 32rpx;
          color: rgba(0, 0, 0, 0.85);

          text:not(:last-of-type)::after {
            position: relative;
            width: 2rpx;
            content: "1";
            height: 24rpx;
            background-color: rgba(0, 0, 0, 0.85);
          }
        }

        .detail-item-line-3 {
          display: flex;
          justify-content: space-between;
          padding: 0rpx 32rpx;
          margin-top: 24rpx;

          .address {
            display: flex;
            align-items: center;

            image {
              width: 28rpx;
              height: 28rpx;
            }

            text {
              font-size: 24rpx;
              line-height: 24rpx;
              color: rgba(0, 0, 0, 0.6);
              font-weight: 600;
              padding-left: 10rpx;
            }
          }

          .txt {
            font-size: 26rpx;
            font-weight: normal;
            line-height: 40rpx;
            letter-spacing: normal;
            color: rgba(0, 0, 0, 0.65);

            .quick {
              color: #35ca95;
            }
          }
        }

        .detail-item-line-4 {
          display: flex;
          justify-content: center;
          margin-top: 40rpx;

          .content {
            width: 686rpx;
            height: 182rpx;
            border-radius: 16rpx;
            background: #ffffff;
            box-sizing: border-box;
            border: 0.5px solid rgba(53, 202, 149, 0.4);
            box-shadow: 0px 4px 10px 0px rgba(149, 132, 95, 0.1);
            padding: 0rpx 32rpx;
            position: relative;
            -ms-overflow-style: none;
            overflow: -moz-scrollbars-none;

            .tips {
              position: absolute;
              left: 0px;
              top: 0px;
              width: 154rpx;
              height: 42rpx;
              /* 自动布局 */
              display: flex;
              justify-content: center;
              align-items: center;
              background: linear-gradient(270deg, #9cfad9 0%, #d7fff1 95%);
              border-top-left-radius: 16rpx;

              image {
                width: 32rpx;
                height: 32rpx;
              }

              text {
                font-size: 22rpx;
                line-height: 32rpx;
                letter-spacing: 0px;
                color: rgba(0, 0, 0, 0.85);
              }
            }

            .list {
              padding: 0rpx 36rpx;
              display: flex;
              height: 100%;
              flex-wrap: nowrap;
              overflow-x: scroll;
              scrollbar-width: none;
              /* Firefox */
              -ms-overflow-style: none;
              /* IE 和 Edge */

              .item {
                text-align: center;
                padding-top: 74rpx;

                flex-shrink: 0;

                .num {
                  font-size: 36rpx;
                  color: #000000;
                  font-weight: 600;
                }

                .unit {
                  margin-left: 10rpx;
                  font-size: 20rpx;
                  color: rgba(0, 0, 0, 0.85);
                }

                .txt {
                  font-size: 22rpx;
                  color: rgba(0, 0, 0, 0.5);
                }
              }

              .item:not(:last-of-type) {
                margin-right: 60rpx;
              }
            }
          }
        }

        .detail-item-line-5 {
          margin-top: 60rpx;
          display: flex;
          justify-content: center;

          .tabs {
            width: 686rpx;
            display: flex;
            flex-wrap: nowrap;
            overflow-x: scroll;
            scrollbar-width: none;
            /* Firefox */
            -ms-overflow-style: none;

            /* IE 和 Edge */
            .tab-item {
              flex-shrink: 0;
              font-size: 32rpx;
              font-weight: normal;
              line-height: 32rpx;
              letter-spacing: normal;
              color: #687581;
              position: relative;
              height: 68rpx;
              display: flex;
              justify-content: center;
            }

            .tab-item:not(:last-of-type) {
              margin-right: 30rpx;
            }

            .active {
              color: #212528;
              font-size: 32rpx;
              font-weight: 600;

              &::after {
                position: absolute;
                border-radius: 4px;
                background: linear-gradient(270deg, #eafff7 0%, #35ca95 100%);
                height: 8rpx;
                width: 40rpx;
                content: "";
                bottom: 0rpx;
              }
            }
          }
        }

        .tabsFixed {
          width: 100vw;
          position: fixed;
          top: calc($statusBarHeight + 20rpx);
          background: #fff;
          z-index: 1;
          left: 0;
          height: 128rpx;
          display: flex;
          align-items: center;
        }

        .detail-item-line-6 {
          margin-top: 60rpx;
          width: 100vw;

          display: flex;
          justify-content: center;

          .content {
            width: 686rpx;
            height: auto;
            background-color: #fff;
            border-radius: 20rpx;
            padding-top: 32rpx;

            .title {
              font-size: 30rpx;
              font-weight: 500;
              line-height: 30rpx;
              color: #212528;
              padding-left: 28rpx;
            }

            .info {
              font-size: 26rpx;
              font-weight: normal;
              line-height: 42rpx;
              letter-spacing: normal;
              color: rgba(0, 0, 0, 0.5);
              padding: 28rpx;
            }
          }
        }

        .detail-item-line-7 {
          .content {
            padding: 40rpx 0rpx;

            .info {
              .detail-item {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                background-color: #eaf9f4;
                padding: 20rpx;
                border-radius: 12rpx;
              }
              .detail {
                width: 576rpx;
                height: auto;
                border-radius: 12px;
                background: rgba(53, 202, 149, 0.1);
                padding: 24rpx 26rpx;

                .detail-title {
                  font-size: 26rpx;
                  font-weight: 500;
                  line-height: 26rpx;
                  letter-spacing: 0px;
                  color: #35ca95;
                }

                .detail-content {
                  font-size: 24rpx;
                  line-height: 36rpx;
                  letter-spacing: 0px;
                  color: rgba(0, 0, 0, 0.5);
                  margin-top: 28rpx;
                }
              }
            }

            .tags {
              display: flex;
              padding-left: 28rpx;
              margin-top: 20rpx;

              .tag-item {
                border-radius: 8px;
                background: rgba(53, 202, 149, 0.102);
                font-size: 26rpx;
                letter-spacing: 0px;
                color: #35ca95;
                padding: 14rpx 20rpx;
                margin-right: 20rpx;
              }
            }
          }
        }

        .detail-item-line-8 {
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .content {
            overflow: hidden;
            border-radius: 20rpx 20rpx 0 0;
            .info {
              .certificate-detail,
              .eduication-detail {
                display: flex;
                align-items: start;

                .tag {
                  width: 52rpx;
                  height: 30rpx;
                  border-radius: 4rpx;
                  background: #ececfd;
                  text-align: center;
                  line-height: 30rpx;
                  font-size: 22rpx;
                  color: #4838f5;
                }

                .tag-info {
                  line-height: 1;
                  margin-left: 12rpx;

                  .tag-title {
                    font-size: 30rpx;
                    font-weight: 500;
                    color: #212528;
                  }

                  .certificate-info,
                  .eduication-info {
                    margin: 20rpx 0 30rpx;
                    font-size: 26rpx;
                    font-weight: normal;
                    line-height: 44rpx;
                    letter-spacing: 0px;
                    color: rgba(0, 0, 0, 0.5);
                  }
                }
              }

              .eduication-detail {
                margin-top: 40rpx;

                .tag {
                  background: #fff0da;
                  color: #eb9516;
                }
              }

              .step-detail {
                margin-top: 40rpx;

                .training {
                  display: flex;

                  .training-title {
                    width: 116rpx;
                    height: 40rpx;
                    border-radius: 4rpx;
                    display: flex;
                    background: #e5fdf5;
                    font-size: 26rpx;
                    color: #35ca95;
                    text-align: center;
                  }

                  .training-timer {
                    background: #f2faf7;
                    display: inline;
                    padding: 2rpx 8rpx;
                    font-size: 26rpx;
                    color: #212528;
                    margin-left: 10rpx;
                    border-radius: 4px;
                  }
                }

                .step-box {
                  ::v-deep .uni-steps__column-text {
                    border: none !important;

                    // padding-top: 0rpx !important;
                    .uni-steps__column-title {
                      font-size: 22rpx;
                      font-weight: normal;
                      color: rgba(0, 0, 0, 0.5);
                    }

                    .uni-steps__column-desc {
                      font-size: 26rpx;
                      font-weight: normal;
                      color: rgba(0, 0, 0, 0.65) !important;
                    }
                  }
                }
              }
            }
          }

          .more {
            background-color: #fff;
            padding: 20rpx 0rpx 30rpx;
            width: 686rpx;
            font-size: 24rpx;
            color: #35ca95;
            text-align: center;
            border-radius: 0 0 20rpx 20rpx;
          }
        }

        .detail-item-line-9 {
          .content {
            .info {
              .feel-type-box {
                display: flex;
                flex-wrap: wrap;
                line-height: 1;

                .feel-type {
                  flex-shrink: 0;
                  width: 200rpx;
                  height: 88rpx;
                  border-radius: 10rpx;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  background: #f5fffb;
                  margin-left: 8rpx;
                  margin-top: 16rpx;

                  .txt {
                    font-size: 24rpx;
                    font-weight: normal;
                    letter-spacing: 0px;
                    color: rgba(0, 0, 0, 0.65);
                  }

                  .num {
                    font-size: 22rpx;
                    font-weight: normal;
                    text-align: center;
                    color: rgba(0, 0, 0, 0.35);
                    margin-top: 16rpx;
                  }
                }
              }

              .comment-list {
                .comment-item:not(:last-child) {
                  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
                }

                .comment-item {
                  padding-bottom: 32rpx;
                  margin-top: 44rpx;

                  .comment-item-header {
                    display: flex;
                    justify-content: space-between;

                    .user {
                      display: flex;
                      align-items: center;

                      image {
                        width: 48rpx;
                        height: 48rpx;
                      }

                      text {
                        margin-left: 14rpx;
                        font-size: 24rpx;
                        letter-spacing: 0px;
                        color: rgba(0, 0, 0, 0.65);
                      }
                    }

                    .date {
                      font-size: 24rpx;
                      font-weight: normal;
                      color: rgba(0, 0, 0, 0.35);
                    }
                  }

                  .comment-item-content {
                    margin-top: 22rpx;
                  }
                }
              }
            }
          }
        }

        .detail-item-line-10 {
          .remark {
            font-size: 22rpx;
            font-weight: normal;
            letter-spacing: 0px;
            color: rgba(0, 0, 0, 0.5);
          }

          .info {
            .txt {
              font-size: 22rpx;
              color: rgba(0, 0, 0, 0.5);
            }

            .order-timer-box {
              display: flex;
              flex-wrap: nowrap;

              .order-timer-item {
                flex-shrink: 0;
                text-align: center;
                width: 90rpx;

                .month {
                  font-size: 20rpx;
                  color: rgba(0, 0, 0, 0.5);
                }

                .day {
                  font-size: 36rpx;
                  color: rgba(0, 0, 0, 0.85);
                }

                .week {
                  font-size: 24rpx;
                  color: rgba(0, 0, 0, 0.85);
                }

                .isOrder {
                  width: 80rpx;
                  height: 80rpx;
                  border-radius: 4rpx;
                  background: #f4f6f8;
                  font-weight: 500;
                  color: rgba(0, 0, 0, 0.3);
                  line-height: 80rpx;
                  text-align: center;
                  margin-top: 14rpx;
                }
              }

              .active {
                .month,
                .day,
                .week,
                .isOrder {
                  color: #35ca95 !important;
                }

                .isOrder {
                  background: rgba(53, 202, 149, 0.102);
                }
              }
            }
          }
        }

        .detail-item-line-11 {
          margin-top: 20rpx;

          .content {
            background-color: transparent;

            .title {
              text-align: center;
              position: relative;
              color: rgba(0, 0, 0, 0.6);
              font-size: 28rpx;
            }

            .title:before {
              content: "";
              position: absolute;
              width: 258rpx;
              height: 2rpx;
              background-color: rgba(0, 0, 0, 0.06);
              top: 15rpx;
              left: 0;
            }

            .title:after {
              content: "";
              position: absolute;
              width: 258rpx;
              height: 2rpx;
              background-color: rgba(0, 0, 0, 0.06);
              top: 15rpx;
              right: 0;
            }

            .info {
              font-size: 22rpx;
              color: rgba(0, 0, 0, 0.5);
              text-align: left;

              view {
                margin-top: 20rpx;
              }
            }
          }
        }
      }
    }
  }

  .footer {
    width: 100vw;
    height: 108rpx;
    /* 自动布局 */
    display: flex;
    background: #ffffff;
    position: fixed;
    bottom: 0rpx;
    justify-content: space-around;
    align-items: center;

    .follow,
    .contact {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 18rpx;
      color: rgba(0, 0, 0, 0.6);

      image {
        width: 36rpx;
        height: 36rpx;
      }
    }

    .message {
      .txt {
        color: #35ca95;
        font-size: 32rpx;
        border-radius: 48rpx;
        border: 1px solid #35ca95;
        padding: 22rpx 74rpx;
        line-height: 1;
      }
    }

    .reservation {
      color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 240rpx;
      height: 88rpx;
      border-radius: 44rpx;
      background: #35ca95;

      .remark {
        font-size: 20rpx;
      }
    }
  }

  .popup-box {
    width: 750rpx;
    height: 1142rpx;
    opacity: 1;
    background: linear-gradient(180deg, #e7fcf4 0%, #f4f6f8 16%);
    line-height: 1;
    border-radius: 20rpx 20rpx 0 0;

    .popup-header {
      height: 192rpx;
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 40rpx;

      .title {
        color: #000000;
        font-size: 36rpx;

        .remark {
          font-size: 26rpx;
          color: rgba(0, 0, 0, 0.65);
        }
      }

      .msg {
        color: #35ca95;
        font-size: 26rpx;
        margin-top: 20rpx;
      }
    }

    .popup-content {
      margin-top: 32rpx;

      .order-timer-box {
        width: 750rpx;
        display: flex;
        height: 204rpx;
        justify-content: center;
        border-bottom: 1px solid rgba(0, 0, 0, 0.04);

        .order-timer-content {
          display: flex;
          width: 670rpx;

          ::v-deep .uni-scroll-view-content {
            display: flex;
            flex-direction: row;
          }

          .order-timer-item {
            flex-shrink: 0;
            width: 120rpx;
            height: 140rpx;
            border-radius: 10rpx;
            background: #effbf7;
            box-sizing: border-box;
            border: 1px solid #35ca95;
            text-align: center;
            line-height: normal;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-right: 28rpx;

            .week {
              color: rgba(0, 0, 0, 0.6);
              font-size: 30rpx;
            }

            .date {
              color: rgba(0, 0, 0, 0.65);
              font-size: 24rpx;
            }

            .isOrder {
              font-size: 22rpx;
              color: #35ca95;
            }
          }
        }
      }

      .datetime-box {
        padding: 0rpx 40rpx;

        .title {
          font-size: 28rpx;
          color: rgba(0, 0, 0, 0.65);
          margin-top: 28rpx;
        }

        .datetime-item {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;

          .txt {
            background-color: #fff;
            padding: 14rpx 24rpx;
            border-radius: 40px;
            flex-shrink: 0;
            margin-top: 20rpx;
            color: rgba(0, 0, 0, 0.85);
            font-size: 28rpx;
          }
        }

        .datetime-item:after {
          content: "";
          width: 100px;
        }
      }

      .afternoon-datetime-box {
        margin-top: 56rpx;
      }
    }

    .popup-footer {
      display: flex;
      justify-content: space-around;
      background-color: #fff;
      position: fixed;
      width: 750rpx;
      height: 108rpx;
      bottom: 0;
      align-items: center;

      .msg {
        .date {
          font-size: 26rpx;
          color: rgba(0, 0, 0, 0.85);
        }

        .name {
          font-size: 24rpx;
          color: rgba(0, 0, 0, 0.5);
          margin-top: 8rpx;
        }
      }

      .confirm {
        width: 240rpx;
        height: 88rpx;
        border-radius: 44rpx;
        display: flex;
        background: #35ca95;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 32rpx;
      }
    }
  }
}

.time-selector {
  padding: 16px;
  max-width: 100%;
  box-sizing: border-box;
}

/* 日期选择区：横向滚动 */
.date-scroll {
  white-space: nowrap;
  margin-bottom: 20px;
}
.date-list {
  display: inline-flex;
  gap: 12px;
  padding-bottom: 8px;
}
.date-card {
  padding: 10px 5px;
  border: 1px solid #ebebeb;
  border-radius: 6px;
  width: 130rpx;
  text-align: center;
  cursor: pointer;
  background-color: #fff;
  transition: background 0.2s;
  white-space: normal; /* 恢复内部换行 */
}
.date-card.active {
  background: #effaf7;
  border-color: #22c55e;
  color: #166534;
}
.week {
  display: block;
}
.week-active {
  color: #50c39c;
}
.date {
  font-size: 14px;
  opacity: 0.8;
  display: block;
  margin: 10rpx 0;
}
.status {
  font-size: 12px;
  color: #3bc899;
  display: block;
}
.available {
  color: #b1b1b1;
}
/* 时间段选择区：适配大量数据，支持换行+溢出滚动 */
.time-list {
  max-height: 400px; /* 限制高度，超出滚动 */
  overflow-y: auto;
  padding-right: 8px;
}
.time-section {
  margin-bottom: 18px;
}
.section-title {
  font-size: 16px;
  color: #4b5563;
  font-weight: 500;
  display: block;
  margin-bottom: 8px;
}
.time-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.time-item {
  padding: 8px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 40rpx;
  cursor: pointer;
  transition: all 0.2s;
}
.time-item.active {
  background: #effbf7;
  border-color: #35ca95;
  color: #35ca95;
}
.date-card.status-disable {
  /* 1. 视觉禁用：灰色调+透明度，和 已满 样式区分开，更明显 */
  // background: #f9f9f9 !important;
  // color: #cccccc !important;
  // border-color: #eeeeee !important;
  /* 2. 彻底禁止点击：uniapp 全端生效，优先级最高 */
  pointer-events: none;
  /* 3. 禁止hover/点击高亮效果 */
  user-select: none;
  opacity: 0.7;
}
/* 自定义滚动条样式（uniapp适配） */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: #e5e7eb;
}
</style>
