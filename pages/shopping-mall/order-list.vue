<template>
  <view class="order-page">
    <u-navbar title="商品订单" :autoBack="true"></u-navbar>
    <u-tabs
      :list="tabs"
      @change="changeTab"
      :current="currentTab"
      lineColor="#00C28A"
      activeStyle="color:#000;font-weight:600"
      inactiveStyle="color:#666"
    ></u-tabs>
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
              style="width: 25rpx; height: 25rpx; margin-left: 15rpx"
              @click="copyText(item.orderSn)"
            ></image>
          </text>
          <text class="status orange">{{ getStatusText(item.status) }}</text>
        </view>
        <!-- 商品信息 -->
        <view class="order-body">
          <view class="order-item" @click="toDetail(item)">
            <image :src="item.items[0].thumbnail" class="cover"/>
            <view class="info">
              <view class="title">{{ item.items[0].productName }}</view>
              <view class="price">
                <view class="text">{{ Object.values(JSON.parse(item.items[0].specValues)).join(";") }}</view>
                <view class="price-num">¥{{ item.items[0].price }}</view>
              </view>
              <view class="count">x{{ item.items[0].quantity }}</view>
            </view>
          </view>
        </view>

        <view class="desc">
          <view class="text">感谢小主的耐心等待，希望商品让您满意</view>
          <view class="price">实付款¥{{ item.items[0].totalAmount }}</view>
        </view>
        <!-- 按钮组 -->
        <view class="btn-group">
          <view style="display: flex; flex-direction: row; gap: 20rpx">
            <view
              v-if="item.orderStatus == 1"
              class="btn-2"
              size="small"
              shape="circle"
              plain
              type="info"
              @click="cancelOrder(item)"
              >取消订单</view
            >
            <view
              v-if="item.orderStatus == 1"
              class="btn-1"
              size="small"
              shape="circle"
              type="warning"
              >继续支付</view
            >
            <view
              v-if="item.orderStatus == 2"
              class="btn-1"
              size="small"
              shape="circle"
              plain
              type="info"
              @click="toRefund(item)"
              >退款</view
            >
            <view
              v-if="item.orderStatus == 4"
              class="btn-1"
              size="small"
              shape="circle"
              type="warning"
              @click="toComment(item)"
              >去评价</view
            >
            <view
              v-if="item.orderStatus == 3"
              class="btn-1"
              size="small"
              shape="circle"
              type="warning"
              @click="toComment(item)"
              >确认收货</view
            >
            <view
              v-if="item.orderStatus == 3 || item.orderStatus == 4"
              class="btn-2"
              size="small"
              shape="circle"
              type="warning"
              @click="toComment(item)"
              >查看物流</view
            >
            <view
              v-if="item.orderStatus == 3"
              class="btn-2"
              size="small"
              shape="circle"
              type="warning"
              @click="toComment(item)"
              >退换</view
            >
            <view
              v-if="item.orderStatus == 6"
              class="btn-1"
              size="small"
              shape="circle"
              type="warning"
              @click="toComment(item)"
              >加入购物车</view
            >
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
import { orderMy } from "@/common/api/order.js";

const tabs = ref([
  { name: "全部" },
  { name: "待付款" },
  { name: "待发货" },
  { name: "待收货" },
  { name: "待评价" },
  { name: "已完成" },
  { name: "已取消" },
  { name: "售后中" },
]);
const orderService = ref(false);
const currentTab = ref(0);
const orderList = ref([]);
const paramsData = ref({
  pageNum: 1,
  pageSize: 10,
})

const changeTab = (e) => {
  paramsData.value.pageNum = 1;
  paramsData.value.orderStatus = e;
  currentTab.value = e;
  orderList.value = [];
  if(e == 0) {
    delete paramsData.value.orderStatus;
  }
  postList();
};

const listEmpty = ref(false);

onReachBottom(() => {
 if(!listEmpty.value) {
   paramsData.value.current += 1;
   postList();
 }
})  
const postList = async() => {
	try {
		const res = await orderMy(paramsData.value);
    orderList.value = [...orderList.value, ...res.data.records]
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
      return "待发货";
    case 3:
      return "待收货";
    case 4:
      return "待评价";
    case 5:
      return "已完成";
    case 6:
      return "已取消";
    case 7:
      return "售后中";
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
  // orderService.value = options.service;
  // typeId.value = JSON.parse(options.type);
  // if(options.identity == 'consult-order') {
  //   paramsData.value.params.consultantId = typeId.value.id
  // } else if(options.identity == 'listener-order') {
  //   paramsData.value.params.listenerId = typeId.value.id
  // } else {
  //   paramsData.value.params.userId = typeId.value.id
  // }
});

// 详情
const toDetail = (item) => {
  console.log(item);
  
  uni.navigateTo({
    url: `/pages/shopping-mall/order-details?id=${item.id}`,
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
    postList();
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
  postList();
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

    .order-body{
      .order-item{
        display: flex;
        padding: 20rpx 0;
        .cover{
          width: 120rpx;
          height: 120rpx;
          border-radius: 20rpx;
          margin-right: 20rpx;
        }
        .info{
          width: calc(100% - 140rpx);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .title{
            font-size: 26rpx;
            color: #333;
          }
          .price{
            display: flex;
            justify-content: space-between;
            font-size: 24rpx;
            color: #999;
            .price-num{
              color: #333;
              font-weight: 500;
            }
          }
          .count{
            font-size: 24rpx;
            color: #999;
          }
        }
      }
    }
    .desc{
      position: relative;
      display: flex;
      justify-content: space-between;
      font-size: 22rpx;
      color: #999;
      .text{
        background-color: #f3f3f3;
        padding: 0 10rpx;
      }
      .price{
        position: absolute;
        right: 0;
        top: -5rpx;
        color: #333;
        font-size: 26rpx;
      }
    }
    .btn-group {
      margin-top: 20rpx;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      justify-content: flex-end;
      .btn-1,
      .btn-2 {
        font-size: 24rpx;
        padding: 10rpx 35rpx;
        min-width: 160rpx;
        border-radius: 10rpx;
      }
      .btn-1 {
        color: #fff;
        background-color: #34cc97;
      }
      .btn-2 {
        color: #b6b6b6;
        background-color: #f7f7f7;
      }
    }
  }
}
</style>
