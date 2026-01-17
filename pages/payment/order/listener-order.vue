<template>
  <view class="order-page">
    <!-- 顶部标题栏 -->
    <u-navbar title="倾诉订单" :autoBack="true" :background="{ backgroundColor: '#f7f8fa' }"></u-navbar>

    <!-- 顶部 tabs -->
    <u-tabs
      :list="tabs"
      @change="changeTab"
      :current="currentTab"
      lineColor="#00C28A"
      activeStyle="color:#000;font-weight:600"
      inactiveStyle="color:#666"
      style="background-color: #f7f8fa;"
    ></u-tabs>

    <!-- 订单列表 -->
    <scroll-view scroll-y class="order-list">
      <view
        v-for="(item, index) in orderList"
        :key="index"
        class="order-card"
        :class="getStatusClass(item.status)"
      >
        <!-- 订单头部 -->
        <view class="order-header">
          <text class="order-no"
            >订单号：{{ item.orderSn }}
            <image
              src="/static/order/ic-copy.png"
              style="width: 28rpx; height: 28rpx; margin-left: 15rpx"
              @click="copyText(item.orderSn)"
            ></image>
          </text>
          <text class="status orange">{{ getStatusText(item.status) }}</text>
        </view>


        <!-- 用户信息 -->
        <view class="user-info">
          <image :src="item.teacherAvatar" class="avatar"></image>
          <text class="username">{{ item.teacherName }}</text>
        </view>

        <!-- 订单内容 -->
        <view class="order-body" @click="toDetail(item)">
          <!-- <view class="title">首单体验</view> -->
          <view class="desc"><text>购买时长：</text>{{ item.buyDuration }}</view>
          <view class="desc"><text>服务方式：</text>{{ item.consultTypeDesc }}</view>
          <view class="desc"><text>剩余时间：</text>{{ item.remainingDuration }}</view>
          <view class="desc"><text>下单时间：</text>{{ item.createTime }}</view>
        </view>

        <!-- 时间和价格 -->
        <view class="order-footer">
          <view class="price">￥{{ item.orderMoney }}</view>
        </view>

        <!-- 按钮组 -->
        <view class="btn-group">
          <!-- {{item.status}} -->
          <view style="display: flex; flex-direction: row; gap: 20rpx">
            <u-button
              v-if="item.status == 1"
              class="btn"
              size="small"
              shape="circle"
              plain
              type="info"
              @click="cancelOrder(item)"
              >取消订单</u-button
            >
            <u-button
              v-if="item.status == 1 && orderService"
              class="btn"
              size="small"
              shape="circle"
              type="warning"
              >立即支付</u-button
            >
            <u-button
              v-if="item.status == 2"
              class="btn"
              size="small"
              shape="circle"
              plain
              type="info"
              @click="toRefund(item)"
              >退款</u-button
            >
            <u-button
              v-if="item.status == 2"
              class="btn"
              size="small"
              shape="circle"
              type="warning"
              @click="handleChat(item)"
              >立即联系</u-button
            >
            <u-button
              v-if="item.status == 3"
              class="btn"
              size="small"
              shape="circle"
              type="warning"
              @click="toComment(item)"
              >去评价</u-button
            >
            <!-- <u-button
              v-if="item.status == 4"
              class="btn"
              size="small"
              shape="circle"
              type="warning"
              @click="toComment(item)"
              >完成</u-button
            > -->
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { postOrder, cancel } from "@/common/api/settings.js";
import { serviceTyep } from "./order.js";

const tabs = ref([
  { name: "全部" },
  { name: "待支付" },
  { name: "待服务" },
  { name: "待评价" },
  { name: "交易完成" },
]);
const orderService = ref(false);
const currentTab = ref(0);
const orderList = ref([]);

const changeTab = (e) => {
  paramsData.value.current = 1;
  paramsData.value.params.status = e;
  currentTab.value = e;
  orderList.value = [];
  if(e == 0) {
    delete paramsData.value.params.status;
  }
  postList(false);
};

const paramsData = ref({
  current: 1,
  params: {
    current: 1,
    size: 10,
    orderType: 10,
  },
  size: 10,
})
const listEmpty = ref(false);

onReachBottom(() => {
 if(!listEmpty.value) {
   paramsData.value.current += 1;
   postList(true);
 }
})  
const postList = async(val) => {
	try {
		const res = await postOrder(paramsData.value);
    if(val) {
      orderList.value = [...orderList.value, ...res.data.records]
    } else {
      orderList.value = res.data.records
    }
    listEmpty.value = res.data.records.length === 0 ? true : false
	} catch (e) {
		console.log(e);
	}
};

const getStatusText = (status) => {
  switch (status) {
    case 1:
      return "待付款";
    case 2:
      return "待咨询";
    case 3:
      return "待评价";
    case 4:
      return "已完成";
    case 5:
      return "交易关闭";
    case 6:
      return "退款";
    default:
      return "";
  }
};

const copyText = (text) => {
  uni.setClipboardData({
    data: text,
    success(e) {
      uni.showToast({
        title: "已复制",
      });
    },
  });
};

const getStatusClass = (status) => {
  return {
    待支付: "",
    待咨询: "",
    待评价: "",
    已完成: "",
    未完成: "",
  }[status];
};

const typeId = ref({});
onLoad((options) => {
  orderService.value = options.service;
  typeId.value = JSON.parse(options.type);
  if(options.identity == 'consult-order') {
    paramsData.value.params.consultantId = typeId.value.id
  } else if(options.identity == 'listener-order') {
    paramsData.value.params.listenerId = typeId.value.id
  } else {
    paramsData.value.params.userId = typeId.value.id
  }
});

const toDetail = (item) => {
  uni.navigateTo({
    url: `/pages/payment/order-details?status=${JSON.stringify(item)}&type=${JSON.stringify(typeId.value)}&colorType=2`,
  });
};

const toComment = (item) => {
  uni.navigateTo({
    url: `/pages/payment/order/evaluation-order?type=${JSON.stringify(
      typeId.value
    )}&colorType=1`,
  });
};

// 咨询
const handleChat = (val) => {
  const { teacherUserId, teacherName, teacherAvatar } = val;
  uni.navigateTo({
    url: `/pages/message/private-chat?to=${teacherUserId}&name=${teacherName}&avatar=${teacherAvatar}`,
  });
};

// 取消
const cancelOrder = async (item) => {
  try{
    const res = await cancel({ orderSn: item.orderSn });
    uni.showToast({
      title: "取消成功",
      icon: "none",
    })
    postList(false);
  } catch(e) {
    console.log(e);
  }
}

// 退款
const toRefund = (item) => {
  uni.navigateTo({
    url: `/pages/payment/order/refund-order?order=${JSON.stringify(item)}`,
  });
}

onMounted(() => {
  postList(false);
})
</script>

<style lang="scss" scoped>
.order-page {
  background-color: #f7f8fa;
  min-height: 100vh;

  .order-list {
    display: flex;
    flex-direction: column;
    height: 90vh;
  }

  .order-card {
    margin: 20rpx 30rpx;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.03);
    border: 2rpx solid transparent;

    // &.border-blue {
    // 	border-color: #4A90E2;
    // }

    .order-header {
      display: flex;
      justify-content: space-between;
      font-size: 26rpx;
      padding-bottom: 20rpx;
      border-bottom: 2rpx solid #e3e3e3;

      .order-no {
        display: flex;
        flex-direction: row;
        align-items: center;
        color: #333;
      }

      .status {
        font-weight: 500;
      }

      .orange {
        color: #eb9516;
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      margin: 20rpx 0;

      .avatar {
        width: 54rpx;
        height: 54rpx;
        border-radius: 50%;
        margin-right: 16rpx;
      }

      .username {
        font-size: 28rpx;
        font-weight: 500;
        color: #000;
      }
    }

    .order-body {

      .title {
        font-size: 27rpx;
        margin-bottom: 10rpx;
      }

      .desc {
        font-size: 24rpx;
        margin-bottom: 15rpx;
        text{
        color: #888;
        }
      }
    }

    .order-footer {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 26rpx;
      color: #666;
      margin-bottom: 20rpx;

      .price {
        font-size: 30rpx;
        color: #000;
      }
    }

    .btn-group {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: flex-end;
      .btn {
        font-size: 25rpx;
        padding: 15rpx 25rpx;
        min-width: 160rpx;
      }
    }
  }
}
::v-deep .u-tab-item{
  color: #595a5b !important;
}
::v-deep .u-tab-bar{
  background-color: #ec9616 !important;
}
</style>
