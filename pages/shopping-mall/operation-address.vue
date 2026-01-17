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
          :title="`${ addressFrom.id ? '修改' : '新增'}收货地址`" 
          class="header-bar"
        >
          <template v-slot:left>
            <uni-icons type="left" size="24" @click="backFn"></uni-icons>
          </template>
        </uni-nav-bar>
      </view>
      <view class="content">
        <!-- 收货人/手机号 -->
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

        <!-- 地址选择核心区域 -->
        <view class="address-item">
          <view>地址信息</view>
          <view class="address-info">
            <view style="margin-right: 20rpx;">省-市-区-街道</view>
            <!-- 包裹点击触发懒加载 + 加载状态禁用 + loading提示 -->
            <view @click="handlePickerClick" class="picker-wrap">
              <uni-data-picker 
                placeholder="请选择所在地区" 
                popup-title="请选择所在地区" 
                :localdata="areaList" 
                v-model="classes"
                @change="onchange"
                level="4"
                range-key="text"
                :disabled="!areaList.length || loadAreaLoading" 
              ></uni-data-picker>
              <!-- 加载中动画 -->
              <uni-load-more v-if="loadAreaLoading" status="loading" size="mini" class="loading-tips"></uni-load-more>
            </view>
          </view>
          <view class="address-info">
            <view>详细地址</view>
            <input v-model="addressFrom.detailAddress" type="text" placeholder="请填写详细地址信息" style="width: 75%;" />
          </view>
        </view>

        <!-- 默认地址 -->
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
import { onPageScroll } from '@dcloudio/uni-app'
import { addAddress, updateAddress } from '@/common/api/shoppingMall.js';
import { findAreaValue } from '@/utils/area-data.js';

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
const scrollTop = ref(0);
const top = ref(0)

// 页面滚动事件
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});

// 返回上一页
const backFn = () => {
  uni.navigateBack({ delta:1 })
}

// 默认地址切换
const handleCheckToggle = () => {
  addressFrom.value.isDefault = addressFrom.value.isDefault == 1 ? 0 : 1
};

// 地址选择器绑定值
const classes = ref("");
// 收货地址表单
const addressFrom = ref({
  id: '',
  city: "",
  detailAddress: "",
  district: "",
  isDefault: 0,
  province: "",
  receiverName: "",
  receiverPhone: "",
  street: "" // 四级地址-街道
});

// ========== 核心控制变量（初始化零加载） ==========
const areaList = ref([]); // 地址数据源，初始为空，绝不提前赋值
const loadAreaLoading = ref(false); // 加载状态，初始为false
const CACHE_KEY = 'global_address_area_list'; // 缓存key
const CACHE_EXPIRE = 30 * 24 * 60 * 60 * 1000; // 缓存30天

// 初始化地址回显（编辑地址时用，加载完数据后执行）
const initAddressData = () => {
  if (!addressFrom.value.province || !areaList.value.length) return;
  const addressArr = [
    addressFrom.value.province,
    addressFrom.value.city,
    addressFrom.value.district,
    addressFrom.value.street || ''
  ];
  classes.value = findAreaValue(areaList.value, addressArr);
};

// ========== 异步加载地址JSON（双重缓存+异常兜底） ==========
const loadAddressJson = () => {
  return new Promise((resolve) => {
    // 内存缓存：已有数据直接返回，避免重复加载
    if (areaList.value.length) {
      resolve();
      return;
    }
    // 本地缓存：优先读取缓存，无需重新加载大文件
    const cacheData = uni.getStorageSync(CACHE_KEY);
    if (cacheData && Date.now() - cacheData.expire < CACHE_EXPIRE) {
      areaList.value = cacheData.data;
      resolve();
      return;
    }

    // 真正的文件加载逻辑（仅点击后无缓存时执行）
    loadAreaLoading.value = true;
    uni.showToast({ title: '加载地址数据中...', icon: 'loading', mask: true, duration: 0 });
    const filePath = '/utils/address.json';

    // H5端加载逻辑
    // #ifdef H5
    fetch(filePath)
      .then(res => res.json())
      .then(data => {
        areaList.value = data;
        uni.setStorageSync(CACHE_KEY, { data, expire: Date.now() }); // 缓存数据
      })
      .catch(() => uni.showToast({ title: '地址加载失败', icon: 'none' }))
      .finally(() => {
        loadAreaLoading.value = false;
        uni.hideToast();
        resolve();
      });
    // #endif

    // 小程序/APP端加载逻辑
    // #ifdef MP-WEIXIN || MP-ALIPAY || APP-PLUS
    uni.getFileSystemManager().readFile({
      filePath: filePath,
      encoding: 'utf8',
      success: (res) => {
        const data = JSON.parse(res.data);
        areaList.value = data;
        uni.setStorageSync(CACHE_KEY, { data, expire: Date.now() }); // 缓存数据
      },
      fail: () => uni.showToast({ title: '地址加载失败', icon: 'none' }),
      complete: () => {
        loadAreaLoading.value = false;
        uni.hideToast();
        resolve();
      }
    });
    // #endif
  });
};

// ========== 唯一触发入口：点击选择器才加载 ==========
const handlePickerClick = async () => {
  // 加锁：加载中/已有数据时不重复执行，防止多点触发
  if (loadAreaLoading.value || areaList.value.length) return;
  // 加载地址数据 → 加载完回显地址 → 选择器自动渲染
  await loadAddressJson();
  initAddressData();
};

// 四级地址选择变更事件
const onchange = (e) => {
  const selectData = e.detail.value;
  const [province, city, district, street] = selectData;
  
  addressFrom.value.province = province?.text || '';
  addressFrom.value.city = city?.text || '';
  addressFrom.value.district = district?.text || '';
  addressFrom.value.street = street?.text || '';
  classes.value = street?.value || district?.value || '';
};

// 页面加载：仅接收编辑地址参数，无任何加载逻辑
uni.$on('onLoad', (options)=>{
  if(options.info){
    const info = JSON.parse(options.info);
    addressFrom.value = { ...info, street: info.street || '' };
  }
});

// 表单校验
const validateAddressForm = () => {
  const { receiverName, receiverPhone, province, city, district, street, detailAddress } = addressFrom.value;
  if (!receiverName.trim()) { uni.showToast({ title: '请填写收件人姓名', icon: 'none' }); return false; }
  const phoneReg = /^1[3-9]\d{9}$/;
  if (!phoneReg.test(receiverPhone.trim())) { uni.showToast({ title: '请填写正确手机号', icon: 'none' }); return false; }
  if (!province || !city || !district || !street) { uni.showToast({ title: '请选择完整省市区街道', icon: 'none' }); return false; }
  if (!detailAddress.trim()) { uni.showToast({ title: '请填写详细地址', icon: 'none' }); return false; }
  return true;
};

// 保存地址
const handleBuy = async () => {
  if(!validateAddressForm()) return;
  try{
    const api = addressFrom.value.id ? updateAddress : addAddress;
    await api(addressFrom.value);
    uni.showToast({ title: `${addressFrom.value.id ? '修改' : '新增'}成功`, icon: 'none' });
    backFn();
  } catch(err){
    uni.showToast({ title: '保存失败，请重试', icon: 'none' });
  }
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
          
          ::v-deep .placeholder{ font-size: 28rpx; }
          ::v-deep .input-value{ background-color: #d3d3d38f; }
          input{ width: 60%; padding: 20rpx 0; }
          .address-boder{ border-bottom: 1px solid rgba(0, 0, 0, 0.1); }
        }
        
        .address-default{
          padding: 0 30rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          
          .default-tips{
            margin-top: 10rpx; font-size: 24rpx; color: #89898a;
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

// 加载动画样式
.picker-wrap {
  position: relative;
  width: 70%;
  
  .loading-tips {
    position: absolute;
    top: 50%;
    right: 10rpx;
    transform: translateY(-50%);
    z-index: 9;
    margin: 0;
  }
}
</style>