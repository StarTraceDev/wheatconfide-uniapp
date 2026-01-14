<template>
  <view class="my-box">
    <view class="my-top-content">
      <image src="/static/my/my-top-bg.png"></image>
    </view>
    <view class="container">
      <view class="user-info">
        <view>
          <image
            :src="
              userlnfo.avatar == null
                ? '@/static/my/profile.png'
                : userlnfo.avatar
            "
            mode="aspectFill"
            class="profile"
          ></image>
        </view>
        <view class="user-info-content">
          <view>
            <view class="nick-name" @click="toUserInfo"
              >{{ userlnfo.realName
              }}<uni-icons type="right" size="16"></uni-icons
            ></view>
          </view>
          <view
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
            "
          >
            <view class="id-num" style="flex: 1">
              <text>ID: {{ userlnfo.id }}</text>
              <image src="/static/my/copy.png" class="copy" @click="pasteId"></image>
            </view>
            <picker
              v-if="userlnfo.userRole != '0'"
              :range="userRoleTitle"
              @change="changeRoleFunc"
            >
              <view class="change-user-box">
                <view class="change-user">{{ consultantTypeMap[userlnfo.consultantType] }}
                  <image
                    src="/static/my/bottom-arrow.png"
                    class="bottom-arrow"
                  ></image>
                </view>
              </view>
            </picker>
            <view v-else class="change-user-box">
							<view class="change-user">用户</view>
						</view>
          </view>
        </view>
      </view>
      <view class="my-record-number">
        <view class="item">
          <view class="num">{{ summary.consultCount }}</view>
          <view class="txt">我的咨询</view>
        </view>
        <view class="item" @click="toPublish">
          <view class="num">{{ summary.publishCount }}</view>
          <view class="txt">我的发布</view>
        </view>
        <view class="item">
          <view class="num">{{ summary.followCount }}</view>
          <view class="txt">我的关注</view>
        </view>
        <view class="item">
          <view class="num">{{ summary.collectCount }}</view>
          <view class="txt">我的收藏</view>
        </view>
      </view>
      <view v-if="globalStore.mallSwitch" class="consult-box" @click="toPublishs">
        <image class="" src="/static/settled/mall-entrance.png"></image>
      </view>
      <view class="my-server">
        <view class="title">我的服务</view>
        <view class="grid-box">
          <view
            v-for="(item, index) in gridList"
            :key="index"
            class="grid-item grid-item-1"
            @click="toNav(index)"
          >
            <image :src="item.url" class="image"></image>
            <view class="txt">{{ item.txt }}</view>
          </view>
        </view>
      </view>

			<view class="my-server" v-if="userlnfo.consultantType != '0'">
        <view class="title">{{ userlnfo.userRole == '1' ? '咨询' : '倾听' }}专区</view>
        <view class="grid-box">
          <view
            v-for="(item, index) in consultingList"
            :key="index"
            class="grid-item"
            @click="toConsultingNav(index)"
          >
            <image :src="item.url" class="image"></image>
            <view class="txt">{{ item.txt == '列表' ? userlnfo.userRole == '1' ? '咨询列表' : '倾听列表' : item.txt }}</view>
          </view>
        </view>
      </view>

      <view class="other-server">
        <view class="title">其他服务</view>
        <view class="other-list">
          <view
            class="other-item"
            @click="settledFn(userlnfo.userRole)"
          >
            <view class="item-left">
              <image src="/static/my/join.png"></image> <text>入驻平台</text>
            </view>
          </view>
          <view class="other-item" @click="toPage('/pages/settings/help-center')">
            <view class="item-left">
              <image src="/static/my/service-setting.png"></image> <text>帮助中心</text>
            </view>
          </view>
          <view class="other-item" @click="toPage('/pages/settings/feedback')">
            <view class="item-left">
              <image src="/static/my/advice.png"></image> <text>意见反馈</text>
            </view>
          </view>
          <view class="other-item" @click="customerService">
            <view class="item-left">
              <image src="/static/my/contect.png"></image> <text>联系客服</text>
            </view>
          </view>
          <view class="other-item" @click="toPage('/pages/shopping-mall/delivery-address')">
            <view class="item-left">
              <image src="/static/my/positioning.png" style="width: 23rpx;"></image><text style="padding-left: 18rpx;">收货地址</text>
            </view>
          </view>
          <view class="other-item" @click="toPage('/pages/settings/settings')">
            <view class="item-left">
              <image src="/static/my/setting.png"></image> <text>设置</text>
            </view>
          </view>
        </view>
      </view>
      <!-- <view style="margin-left: 30rpx;margin-right: 30rpx;margin-top: 30rpx;">
				<button type="primary" @click="toLogout">
					退出登录
				</button>
			</view> -->
      <CustomerService ref="serviceRef"></CustomerService>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getUserInfo, userSummary } from "@/common/api/apis.js";
import { changeConsultant } from "@/common/api/user.js";
import { onShow } from "@dcloudio/uni-app";
import { useGlobalDataStore } from "@/stores/global.js";
import CustomerService from "@/components/Customer-Service.vue";

const globalStore = useGlobalDataStore();
const toPage = (url) => {
  uni.navigateTo({
    url: url,
  });
};
// 咨询订单、倾诉订单、评测记录、账单、足迹；
const gridList = ref([
  {
    url: "/static/my/grid-1.png",
    txt: "咨询订单",
  },
  {
    url: "/static/my/grid-2.png",
    txt: "倾诉订单",
  },
  // {
  // 	url: "/static/my/grid-3.png",
  // 	txt: "我的套餐"
  // },
  // {
  // 	url: "/static/my/grid-4.png",
  // 	txt: "优惠券"
  // },
  {
    url: "/static/my/grid-5.png",
    txt: "评测记录",
  },
  // {
  // 	url: "/static/my/grid-6.png",
  // 	txt: "兑换中心"
  // },
  {
    url: "/static/my/grid-7.png",
    txt: "足迹",
  },
  {
    url: "/static/my/grid-9.png",
    txt: "账单"
  }
  // {
  // 	url: "/static/my/grid-8.png",
  // 	txt: "邀请有礼"
  // }
]);

const consultingList = ref([
	{ url: "/static/my/grid-consulting-1.png", txt: "列表" },
	{ url: "/static/my/grid-consulting-2.png", txt: "认证资料" },
	{ url: "/static/my/grid-consulting-3.png", txt: "服务设置" },
	{ url: "/static/my/grid-consulting-4.png", txt: "钱包" },
]);

const gotoServiceCenter = () => {
  uni.navigateTo({
    url: `/pages/settings/serviceSettings?type=${JSON.stringify(userlnfo.value.id)}`,
  });
};

// 跳转到商城
const toPublishs = () => {
  uni.navigateTo({
    url: "/pages/shopping-mall/mall-home",
  });
};

const pasteId = () => {
  uni.setClipboardData({
    data: userlnfo.value.id,
  });
  uni.showToast({
    title: '复制成功',
    icon: 'success',
    duration: 1500
  });
};

// 切换角色
const consultantTypeMap = {
  0: '用户',
  1: '咨询师',
  2: '倾诉师'
};
const userRoleMap = {
  1: ['用户', '咨询师'],
  2: ['用户', '倾诉师']
};
const userRoleTitle = ref();
const changeRoleFunc = async (e) => {  
  const consultantType = userRoleMap[userlnfo.value.userRole] == '倾诉师' ? 2 : e.detail.value
  try{
    let res = await changeConsultant({ consultantType });
    userlnfo.value = res.data;
  } catch (error) {}
};

const toUserInfo = () => {
  uni.navigateTo({
    url: "/pages/forum/my/info",
  });
};

const toPublish = () => {
  uni.navigateTo({
    url: "/pages/forum/my/my",
  });
};

const toNav = (index) => {
  const INDEX_NAV = {
    0: "/pages/payment/order/consult-order?",
    1: "/pages/payment/order/listener-order",
    2: "/pages/payment/order/exam-order",
    // 3: "/pages/payment/order/exam-order",
    4: "/pages/payment/order/bill-order",
  }
  uni.navigateTo({
    url: `${INDEX_NAV[index]}?type=${JSON.stringify(userlnfo.value)}&service=false`,
  });
};

const toConsultingNav = (index) => {
  const url = userlnfo.value.userRole == '1' ? 'consult-order' : 'listener-order';
  const orderUrl = `/pages/payment/order/${url}`;
  const INDEX_NAV = {
    0: orderUrl,
    1: "/pages/settings/serviceSettings",
    2: `/pages/settings/service-setup`,
    3: "/pages/my/wallet/mine",
  };
  uni.navigateTo({
    url: `${INDEX_NAV[index]}?type=${JSON.stringify({id: userlnfo.value.id, userRole: userlnfo.value.userRole})}&service=true&identity=${url}`,
  });
};

const settledFn = (userRole) => {
  if(userRole == 0) {
    uni.navigateTo({
      url: `/pages/settled/settled?type=${JSON.stringify(userlnfo.value.id)}`,
    });
  } else { uni.showToast({ title: '已入驻', icon: 'success' }) }
};

const toLogout = () => {
  uni.clearStorageSync();
  uni.navigateTo({
    url: "/pages/login/login",
  });
};

const serviceRef = ref(null);
const customerService = () => {
  serviceRef.value.open();
};

const userlnfo = ref({});
/**
 * 获取当前用户信息
 */
const getlnfo = async () => {
  let res = await getUserInfo();
  userlnfo.value = res.data;
  userRoleTitle.value = userRoleMap[userlnfo.value.userRole]
};
const summary = ref({});
const userSummaryApi = async () => {
  let res = await userSummary({
    userId: userlnfo.value.id
  });
  summary.value = res.data
}

onShow(() => {
  getlnfo();
  userSummaryApi();
});
</script>

<style lang="scss" scoped>
.my-box {
  width: 100vw;
  box-sizing: border-box;
  overflow-y: scroll;
  position: relative;
  background-color: #f4f6f8;
  height: 100vh;

  .my-top-content {
    image {
      width: 100%;
      height: 906rpx;
    }
  }

  .container {
    position: absolute;
    top: 0rpx;
    width: 750rpx;
    min-height: 100%;

    .change-user-box {
      position: relative;
      margin-left: 20rpx;
      display: flex;
      justify-content: right;
      padding-right: 20rpx;

      .change-user {
        width: 120rpx;
        height: 52rpx;
        border-radius: 40rpx;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1rpx solid #34a755;
        font-size: 26rpx;
        color: #000;
        font-weight: 400;

        .bottom-arrow {
          width: 16rpx;
          height: 16rpx;
          padding-left: 8rpx;
        }
      }
    }

    .user-info {
      flex-direction: row;
      display: flex;
      color: #000000;
      width: 750rpx;
      margin-top: 152rpx;

      .user-info-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .profile {
        width: 128rpx;
        height: 128rpx;
        margin-right: 20rpx;
        border-radius: 64rpx;
        margin-left: 64rpx;
      }

      .nick-name {
        font-weight: 500;
        font-size: 40rpx;
      }

      .id-num {
        font-size: 26rpx;
        margin-top: 12rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-weight: 400;
        
        .copy {
          width: 25rpx;
          height: 25rpx;
          padding-left: 16rpx;
          vertical-align: bottom;
        }
      }
    }

    .my-server,
    .consult-box,
    .my-record-number,
    .other-server {
      width: 678rpx;
      margin-left: 32rpx;
      margin-top: 56rpx;
    }

    .my-record-number {
      display: flex;
      margin-top: 20rpx;

      .item {
        width: 25%;
        text-align: center;
        position: relative;

        .num {
          color: #282c38;
          font-size: 40rpx;
          font-weight: 500;
        }

        .txt {
          color: #000;
          font-size: 22rpx;
        }
      }

      .item:not(:last-of-type)::after {
        position: absolute;
        content: "";
        width: 2rpx;
        height: 28rpx;
        background: rgba(0, 0, 0, 0.08);
        top: 30rpx;
        right: 0rpx;
      }
    }

    .consult-box {
      position: relative;
      margin-top: 20rpx;
      height: 230rpx;
      overflow: hidden;
      border-radius: 20rpx;
      image {
        height: 100%;
        width: 100%;
        object-fit: contain;
        object-position: center;
        transform: scaleY(1.2) scaleX(1.2); 
        transform-origin: center; /* 以中心为基准缩放，避免偏移 */
      }
    }

    .my-server {
      height: 230rpx;
      background: #fff;
      border-radius: 22rpx;
      margin-top: 20rpx;

      .title {
        padding: 28rpx 0rpx 14rpx 28rpx;
        font-size: 30rpx;
        color: #121836;
        font-weight: 500;
      }

      .grid-box {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        
        .grid-item {
          width: 25%;
          text-align: center;
          margin-top: 36rpx;

          .image {
            width: 40rpx;
            height: 40rpx;
          }

          .txt {
            font-size: 22rpx;
            color: rgba(0, 0, 0, 0.85);
          }
        }
        .grid-item-1{
          width: 20%;
        }
      }
    }

    .other-server {
      background: #fff;
      min-height: 570rpx;
      border-radius: 22rpx;
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      .title {
        padding: 28rpx 0rpx 14rpx 28rpx;
        font-size: 30rpx;
        color: #121836;
        font-weight: 500;
      }

      .other-list {
        width: 100%;

        .other-item {
          display: flex;
          margin: 0rpx 24rpx;
          height: 96rpx;
          justify-content: space-between;
          align-items: center;

          .item-left {
            display: flex;
            align-items: center;

            image {
              width: 28rpx;
              height: 28rpx;
            }

            text {
              font-size: 26rpx;
              color: #373737;
              padding-left: 14rpx;
            }
          }
        }

        .other-item:not(:last-of-type) {
          border-bottom: 1rpx solid rgba(0, 0, 0, 0.08);
        }
      }
    }
  }
}
</style>
