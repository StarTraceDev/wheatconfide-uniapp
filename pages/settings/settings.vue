<template>
  <view class="page">
    <view class="setting-list">
      <view
        v-for="(item, index) in items"
        :key="index"
        class="setting-item"
        @click="onItemClick(item)"
      >
        <view class="left">
          <text class="title">{{ item.title }}</text>
          <text v-if="item.sub" class="sub">{{ item.sub }}</text>
        </view>

        <view class="right">
          <text v-if="item.value" class="value">{{ item.value }}</text>
          <u-icon name="arrow-right" size="28" color="#CFCFCF" />
        </view>
      </view>
    </view>

    <view class="bottom-space"></view>
    <view style="margin: 30rpx"
      ><u-button type="error" @click="toLogout">退出登录</u-button></view
    >
  </view>
</template>

<script setup>
// Vue3 Composition API 写法
import { ref } from "vue";

// 手机号脱敏函数
const maskPhone = (phone) => {
  if (!phone) return "";
  const s = String(phone);
  return s.length >= 7 ? s.slice(0, 3) + "****" + s.slice(-4) : s;
};

// 列表数据
const items = ref([
  { title: "账号与安全", value: "", route: "/pages/account/security" },
  {
    title: "隐私政策",
    value: "",
    route: "/pages/webview/webview?type=隐私政策",
  },
  {
    title: "用户协议",
    value: "",
    route: "/pages/webview/webview?type=用户协议",
  },
  { title: "关于麦苗倾诉", value: "", route: "/pages/webview/webview?type=关于麦苗倾诉" },
  { title: "帮助中心", value: "", route: "/pages/settings/help-center" },
]);

const toLogout = () => {
  uni.showModal({
    title: "退出登录",
    content: "确定退出登录？",
    confirmText: "确定",
    cancelText: "取消",
    success(e) {
      if (e.confirm) {
        uni.clearStorageSync();
        uni.navigateTo({
          url: "/pages/login/login",
        });
      }
    },
  });
};

// 点击事件
const onItemClick = (item) => {
  if (item.route) {
    uni.navigateTo({ url: item.route });
  } else {
    uni.showToast({ title: "未配置跳转", icon: "none" });
  }
};
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fff;
}

.setting-list {
  margin-top: 0;
}

.setting-item {
  height: 92rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #f2f2f2;
  background: #ffffff;
}

.left {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-size: 32rpx;
  color: #222;
}

.sub {
  font-size: 24rpx;
  color: #999;
  margin-top: 6rpx;
}

.right {
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.value {
  color: #999999;
  font-size: 28rpx;
  margin-right: 6rpx;
}

.bottom-space {
  height: env(safe-area-inset-bottom);
  height: constant(safe-area-inset-bottom);
}
</style>
