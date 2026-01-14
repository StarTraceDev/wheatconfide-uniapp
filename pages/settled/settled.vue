<template>
  <view class="settled-box">
    <view class="header">
      <uni-nav-bar
        :class="scrollTop > 15 ? 'scrollClass' : ''"
        backgroundColor="rgba(255,255,255,0)"
        :border="false"
        title="专家入驻 | 麦苗倾诉"
        class="header-bar"
      >
        <template v-slot:left>
          <uni-icons type="left" size="24" @click="backFn"></uni-icons>
        </template>
        <template v-slot:right>
          <view class="right">
            <image
              src="/static/confide/share.png"
              style="width: 40rpx; height: 40rpx"
            ></image>
          </view>
        </template>
      </uni-nav-bar>
    </view>
    <view class="content">
      <view class="settled_1" @click="joinTeamHandler">
        <view class="title">我是咨询师</view>
        <view class="use-public">2.5万同行 已服务了439万用户和家庭</view>
        <view class="add">立即加入</view>
      </view>
      <view class="settled_2" @click="listenerVerify">
        <view class="title">我是倾听师</view>
        <view class="use-public">2.5万同行 已服务了439万用户和家庭</view>
        <view class="add">立即加入</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { useGlobalDataStore } from "@/stores/global.js";
import { onLoad, onShow, onPageScroll } from "@dcloudio/uni-app";
import { getVerifyStatus } from "@/common/api/user.js";

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const type = ref('');
const scrollTop = ref(0);

onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});

onLoad((options) => {
  type.value = JSON.parse(options.type);
});

const role = ref(0);
const verifyStatus = ref(0);
const userStatus = async () => {
  try {
    let resp = await getVerifyStatus();
    const { role, verifyStatus } = resp.data
    role.value = role;
    verifyStatus.value = verifyStatus;
  } catch (error) {}
};

const backFn = () => {
  uni.navigateBack({
    delta: 1,
  });
};

//此处需要请求接口，看是否已提交认证某种类型，如果已提交，需要先撤销申请，才能再申请别的，或者点不进去，提示正在认证某项
const joinTeamHandler = () => {
  if (role.value == 1 && verifyStatus.value == 1) {
    uni.showToast({
      title: "咨询师正在认证",
      icon: "error",
    });
    return;
  }
  if (role.value == 2 && verifyStatus.value == 1) {
    uni.showToast({
      title: "倾听师正在认证审核",
      icon: "error",
    });
    return;
  }
  
  uni.navigateTo({
    url: "/pages/settled/application?type=1&userInfo=" + JSON.stringify(type.value),
  });
};

const listenerVerify = () => {
  if (role.value == 1 && verifyStatus.value == 1) {
    uni.showToast({
      title: "咨询师正在认证审核，请稍后尝试",
      icon: "none",
    });
    return;
  }
  if (role.value == 2 && verifyStatus.value == 1) {
    uni.showToast({
      title: "倾听师正在认证审核,请稍后尝试",
      icon: "none",
    });
    return;
  }

  uni.navigateTo({
    url: "/pages/settled/application?type=2&userInfo=" + JSON.stringify(type.value),
  });
};

onShow(() => {
  userStatus();
});
</script>

<style lang="scss" scoped>
.settled-box {
  $statusBarHeight: v-bind(statusBarHeight);
  width: 100vw;
  background-image: url("@/static/settled/settled-bg.png");
  background-size: 100vw 632rpx;
  background-repeat: no-repeat;
  padding-bottom: 30rpx;
  .header {
    position: fixed;
    width: 100vw;
    height: 88rpx;
    z-index: 999;

    .header-bar {
      padding-top: calc($statusBarHeight - 122rpx);

      ::v-deep(.uni-nav-bar-text) {
        font-size: 32rpx;
        font-weight: 600;
        color: #fff;
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
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: calc($statusBarHeight - 20rpx);
    .settled_1 {
      background: url("@/static/settled/settled-1.png");
    }

    .settled_2 {
      background: url("@/static/settled/settled-2.png");
    }

    .settled_1,
    .settled_2 {
      width: 686rpx;
      height: 300rpx;
      border-radius: 20rpx;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      margin-top: 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .title {
        font-size: 44rpx;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
      }

      .use-public {
        font-size: 24rpx;
        color: rgba(0, 0, 0, 0.6);
        margin-top: 8rpx;
      }

      .add {
        width: 280rpx;
        height: 84rpx;
        border-radius: 42rpx;
        background: linear-gradient(180deg, #35ca95 0%, #059363 100%);
        line-height: 84rpx;
        font-size: 32rpx;
        color: #ffffff;
        text-align: center;
        margin-top: 30rpx;
      }
    }
    .settled_2 .add {
      background: linear-gradient(180deg, #ed7751 0%, #e55a33 100%);
    }
  }
}
</style>
