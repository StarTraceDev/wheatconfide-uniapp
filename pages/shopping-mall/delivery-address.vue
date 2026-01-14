<template>
  <view class="settled-box">
    <scroll-view
      scroll-y
      class="scroll-content"
      :scroll-top="top"
      :show-scrollbar="false"
      scroll-with-animation
      id="scrollView"
    >
      <view class="header">
        <uni-nav-bar
          :class="scrollTop > 15 ? 'scrollClass' : ''"
          backgroundColor="rgba(255,255,255,0)"
          :border="false"
          title="收货地址"
          class="header-bar"
        >
          <template v-slot:left>
            <uni-icons type="left" size="24" @click="backFn"></uni-icons>
          </template>
          <template v-slot:right>
            <view class="function-icon" @click="handleDelete">
              <uni-icons type="trash-filled" size="20" color="#ff0000" />
              <view>删除</view>
            </view>
          </template>
        </uni-nav-bar>
      </view>
      <view class="content">
        <view class="content-list">
          <!-- 地址列表 -->
          <view v-for="item in addressList" class="content-item">
            <image v-if="item.isDefault == 1" src="/static/register/default.png" class="content-tag" />
            <uni-icons 
              :type="item.checked ? 'checkbox-filled' : 'circle'"
              :color="item.checked ? '#ff9900' : '#ccc'"
              size="25"
              @click="handleCheckToggle(item)"
            />
            <view class="item-info">
              <view class="item-address">
                <view>{{ item.province }}</view>
                <view>{{ item.city }}</view>
                <view>{{ item.district }}</view>
              </view>
              <view class="item-detail">{{ item.detailAddress }}</view>
              <view class="item-receiver">
                <view>{{ item.receiverName }}</view>
                <view>{{ item.receiverPhone }}</view>
              </view>
            </view>
            <uni-icons type="compose" size="30" color="#a7a7a7" @click="handleEdit(item)" />
          </view>
        </view>
      </view>
      <view class="boundary">删除地址，需在列表框选中对应地址再点击删除</view>
    </scroll-view>
    <view class="footer">
      <view class="btn-buy" @click="handleAdd">新增收货地址</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { useGlobalDataStore } from "@/stores/global.js";
import { onShow, onLoad, onPageScroll } from "@dcloudio/uni-app";
import { getAddressList, deleteAddress } from "@/common/api/shoppingMall.js";

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const scrollTop = ref(0);

onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});

const backFn = () => {
  uni.navigateBack({
    delta: 1,
  });
};

// 地址列表
const addressList = ref([]);
// 获取地址列表
const getAddressListFn = async () => {
  try {
    const res = await getAddressList();
    addressList.value = res.data.map((item) => ({
      ...item,
      checked: false,
    }));
  } catch (error) {
    console.error("获取地址列表失败:", error);
  }
};

// 编辑地址
const handleEdit = (item) => {
  uni.navigateTo({
    url: `/pages/shopping-mall/operation-address?info=${JSON.stringify(item)}`,
  });
};

// 新增地址
const handleAdd = () => {
  uni.navigateTo({
    url: `/pages/shopping-mall/operation-address`,
  });
};

// 选择地址
const checkedAddress = ref(null);
const handleCheckToggle = (item) => {
  addressList.value = addressList.value.map((addr) => ({
    ...addr,
    checked: addr.id === item.id,
  }));
  checkedAddress.value = item;
};

// 删除地址
const handleDelete = async () => {
  if (!checkedAddress.value) {
    uni.showToast({ title: "请选择要删除的地址", icon: "none" });
    return;
  }
  try {
    await deleteAddress(checkedAddress.value);
    uni.showToast({ title: "删除成功", icon: "none" });
    getAddressListFn();
  } catch (error) {
    console.error("删除地址失败:", error);
  }
};

onShow(() => {
  getAddressListFn();
});
</script>

<style lang="scss" scoped>
.settled-box {
  $statusBarHeight: v-bind(statusBarHeight);
  width: 100vw;
  min-height: 100vh !important;
  background-image: url("@/static/settled/settled-bg.png");
  background-size: 100vw 632rpx;
  background-repeat: no-repeat;
  background-color: #f4f6f8;
  .scroll-content {
    width: 100vw;
    min-height: 100vh !important;
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
        .function-icon {
          display: flex;
          align-items: center;
          color: #A09E9D;
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
      padding-top: calc($statusBarHeight);
      margin: 0rpx 50rpx;
      .content-list {
        background-color: rgba(211, 211, 211, 0.2);
        padding: 0 50rpx;
        border-radius: 20rpx;
        min-height: calc(100vh - 300rpx);
        .content-item {
          padding: 30rpx 0;
          display: flex;
          align-items: center;
          position: relative;
          justify-content: space-between;
          border-bottom: 2rpx solid #D8D8D8;
          .content-tag{
            position: absolute;
            top: 0;
            width: 45rpx;
            height: 55rpx;
          }
          .item-info {
            width: 70%;
            display: flex;
            flex-direction: column;
            .item-address,
            .item-receiver {
              display: flex;
              gap: 20rpx;
              color: #555756;
              font-size: 25rpx;
            }
            .item-detail {
              margin: 5rpx 0;
              color: #000;
              font-size: 30rpx;
            }
          }
        }
      }
    }
  }
  .boundary{
    color: #F40F0F;
    width: 100%;
    text-align: center;
    margin: 20rpx 0;
  }
  .footer {
    width: 100vw;
    height: 108rpx;
    display: flex;
    background: #ffffff;
    position: fixed;
    bottom: 0rpx;
    padding: 0 100rpx;
    justify-content: center;
    align-items: center;

    .btn-buy {
      width: 100%;
      padding: 10rpx 50rpx;
      border-radius: 10rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      background-color: #ff8f1f;
    }
  }
}
</style>
