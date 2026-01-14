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
        <uni-nav-bar :class="scrollTop > 15 ? 'scrollClass' : ''" backgroundColor="rgba(255,255,255,0)" :border="false" :title="`${ addressFrom.id ? '修改' : '新增'}收货地址`" class="header-bar">
          <template v-slot:left>
            <uni-icons type="left" size="24" @click="backFn"></uni-icons>
          </template>
        </uni-nav-bar>
      </view>
      <view class="content">
        <view class="address-item">
          <view class="address-info">
            <view>收货人</view>
            <input v-model="addressFrom.receiverName" type="text" placeholder="请填写收货人姓名" class="address-boder" />
          </view>
          <view class="address-info">
            <view>手机号</view>
            <input v-model="addressFrom.receiverPhone" type="text" placeholder="请填写收货人手机号" />
          </view>
        </view>

        <view class="address-item">
          <view>地址信息</view>
          <view class="address-info">
            <view style="margin-right: 20rpx;">省-市-区</view>
              <uni-data-picker placeholder="请选择所在地区" popup-title="请选择所在地区" :localdata="areaList" v-model="classes"
                @change="onchange">
              </uni-data-picker>
          </view>
          <view class="address-info">
            <view>详细地址</view>
            <input v-model="addressFrom.detailAddress" type="text" placeholder="请填写详细地址信息" style="width: 75%;" />
          </view>
        </view>

        <view class="address-item">
          <view class="address-default">
            <view>
              <view>设为默认地址</view>
              <view class="default-tips">
                <uni-icons type="sound-filled" size="16" color="#89898a"/>
                下单时会优先使用该地址
              </view>
            </view>
            <uni-icons 
              :type="addressFrom.isDefault ? 'checkbox-filled' : 'circle'"
              :color="addressFrom.isDefault ? '#ff9900' : '#ccc'"
              size="25"
              @click="handleCheckToggle"
            />
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="footer">
      <view class="btn-buy"  @click="handleBuy">保存</view>
    </view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { useGlobalDataStore } from '@/stores/global.js';
import { onLoad, onPageScroll } from '@dcloudio/uni-app'
import { addAddress, updateAddress } from '@/common/api/shoppingMall.js';
import { areaList, findAreaValue } from '@/utils/area-data.js';

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
const scrollTop = ref(0);

onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});

const backFn = () => {
  uni.navigateBack({
    delta:1
  })
}

// 选中
const handleCheckToggle = () => {
  addressFrom.value.isDefault = addressFrom.value.isDefault == 1 ? 0 : 1
};

const classes = ref("");
// 保存
const addressFrom = ref({
  city: "",
  detailAddress: "",
  district: "",
  isDefault: 0,
  province: "",
  receiverName: "",
  receiverPhone: "",
});

// 保存
const handleBuy = async () => {
  if(!validateAddressForm()) return
  try{
    const api = addressFrom.value.id ? updateAddress : addAddress
    const res = await api(addressFrom.value)
    uni.showToast({
      title: `${addressFrom.value.id ? '修改' : '新增'}成功`,
      icon: 'none'
    })
    backFn()
  } catch(err){
    console.log(err)
  }
}

// 地区
const onchange = (e) => {
const [province, city, district] = e.detail.value
  addressFrom.value.province = province.text;
  addressFrom.value.city = city.text;
  addressFrom.value.district = district.text;
  classes.value = district.value
}

onLoad((options)=>{
  if(options.info){
    const info = JSON.parse(options.info)
    addressFrom.value = info
    const { province, city, district } = info
    classes.value = findAreaValue(areaList, [province, city, district])
  }
})
/**
 * 表单校验函数
 * @returns {Boolean} 校验通过返回true，失败返回false
 */
const validateAddressForm = () => {
  const { receiverName, receiverPhone, province, city, district, detailAddress } = addressFrom.value;
  
  // 校验收件人姓名
  if (!receiverName.trim()) {
    uni.showToast({
      title: '请填写收件人姓名',
      icon: 'none'
    })
    return false;
  }

  // 校验手机号：必填 + 正则匹配11位有效手机号
  const phoneReg = /^1[3-9]\d{9}$/;
  if (!receiverPhone.trim()) {
    uni.showToast({
      title: '请填写收件人手机号',
      icon: 'none'
    })
    return false;
  } else if (!phoneReg.test(receiverPhone.trim())) {
    uni.showToast({
      title: '请填写正确的11位手机号',
      icon: 'none'
    })
    return false;
  }

  // 校验省市区
  if (!province) {
    uni.showToast({
      title: '请选择省份',
      icon: 'none'
    })
    return false;
  }
  if (!city) {
    uni.showToast({
      title: '请选择城市',
      icon: 'none'
    })
    return false;
  }
  if (!district) {
    uni.showToast({
      title: '请选择区县',
      icon: 'none'
    })
    return false;
  }

  // 校验详细地址
  if (!detailAddress.trim()) {
    uni.showToast({
      title: '请填写详细收货地址（街道/小区/门牌号）',
      icon: 'none'
    })
    return false;
  }

  // 所有校验通过
  return true;
};
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
      }
    }
    .scrollClass{
      background-color: #fff;
      box-shadow: 0rpx 4rpx 20rpx rgba(0, 0, 0, 0.1);
      ::v-deep(.uni-nav-bar-text) {
        color: #000;
      }
    }
    .content {
      padding-top: calc($statusBarHeight - 20rpx);
      .address-item{
        margin: 10rpx 30rpx 30rpx;
        padding: 20rpx 30rpx;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 20rpx;
        .address-info{
          display: flex;
          align-items: center;
          justify-content: space-between;
          ::v-deep .placeholder{
            font-size: 28rpx;
          }
          ::v-deep .input-value{
            background-color: #d3d3d38f;
          }
          input{
            width: 60%;
            padding: 20rpx 0;
          }
          .address-boder{
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          }
        }
        .address-default{
          padding: 0 30rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .default-tips{
            margin-top: 10rpx;
            font-size: 24rpx;
            color: #89898a;
          }
        }
      }
    }
  }
  .footer {
    width: 100vw;
    height: 108rpx;
    display: flex;
    background: #ffffff;
    position: fixed;
    bottom: 0rpx;
    margin: 0 100rpx;
    justify-content: space-between;
    align-items: center;

    .btn-buy {
      width: calc(100% - 200rpx);
      padding: 10rpx 50rpx;
      border-radius: 10rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      background-color: #FF8F1F;
    }
  }
}
</style>