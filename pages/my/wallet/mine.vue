<template>
   <view class="settled-box">
      <view class="header">
         <uni-nav-bar :class="scrollTop > 15 ? 'scrollClass' : ''" backgroundColor="rgba(255,255,255,0)" :border="false"
            title="我的钱包" class="header-bar">
            <template v-slot:left>
               <uni-icons type="left" size="24" @click="backFn"></uni-icons>
            </template>
         </uni-nav-bar>
      </view>
      <view class="content">
         <view class="content-details">
            <view class="detail-item">
               <view>本月收益</view>
               <text>{{ moneyData.monthlyIncome }}</text>
            </view>
            <view class="detail-item">
               <view>未结算金额</view>
               <text>{{ moneyData.unsettledAmount }}</text>
            </view>
            <view class="detail-item">
               <view>可提现金额</view>
               <text>{{ moneyData.withdrawableAmount }}</text>
            </view>
         </view>

         <view class="clause">
            <view class="clause-item">
               <view class="money">
                  <view class="money-tilte">
                     <view>我的资产(元)</view>
                     <view class="icons" @click="iconsClick"><uni-icons
                           :type="icons ? 'eye-filled' : 'eye-slash-filled'" color="#fff" size="20"></uni-icons></view>
                  </view>
                  <view class="money-num" v-if="icons">{{ moneyData.totalAssets }}</view>
                  <view class="money-num" v-else>*****</view>
               </view>
               <view class="but" @click="handleWithdrawal(`/pages/my/wallet/withdrawal?amount=${moneyData.withdrawableAmount}`)">提现</view>
            </view>
            <view class="clause-bill" @click="handleWithdrawal('/pages/my/wallet/bill')">
               <image src="/static/my/mine-bill.png" ></image>
               <view>账单</view>
            </view>
         </view>
      </view>
   </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGlobalDataStore } from '@/stores/global.js';
import { onLoad, onPageScroll } from '@dcloudio/uni-app'
import { summary } from '@/common/api/order.js'

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
const moneyData = ref({
   monthlyIncome: 0, //本月收益
   unsettledAmount: 0, //未结算金额
   withdrawableAmount: 0, //可提现余额
   totalAssets: 0 //我的资产
})
const type = ref({})
onLoad((options) => {
   type.value = JSON.parse(options.type)
})
const icons = ref(true)
const iconsClick = () => {
   icons.value = !icons.value
}

const list = async () => {
   try {
      const { data } = await summary()
      moneyData.value = data
   } catch (error) {
      console.log(error);
   }
}

onMounted(() => {
   list()
})

const backFn = () => {
   uni.navigateBack({
      delta: 1
   })
}
const scrollTop = ref(0);

onPageScroll((e) => {
   scrollTop.value = e.scrollTop;
});

const handleWithdrawal = (url) => {
   uni.navigateTo({ url: `${url}?type=${JSON.stringify(type.value)}` });
}

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
      padding-top: calc($statusBarHeight - 20rpx);

      .content-details {
         margin: 30rpx;
         padding: 50rpx;
         color: #fff;
         background-color: #35CA95;
         display: flex;
         align-items: center;
         justify-content: space-between;
         border-radius: 20rpx;

         .detail-item {
            display: flex;
            flex-direction: column;

            text {
               margin-top: 10rpx;
               font-size: 36rpx;
            }
         }
      }

      .clause {
         color: #fff;
         margin: 30rpx;
         border-radius: 20rpx;
         background-color: #fff;

         &-item {
            padding: 50rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #35CA95;
            border-radius: 20rpx;

            .money {
               &-tilte {
                  display: flex;

                  .icons {
                     margin-left: 15rpx;
                  }
               }

               &-num {
                  font-size: 70rpx;
                  font-weight: 600;
               }
            }

            .but {
               font-size: 35rpx;
               padding: 10rpx 40rpx;
               border-radius: 50rpx;
               color: #35CA95;
               background-color: #fff;
            }
         }
         
         &-bill{
            padding: 20rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #35CA95 ;
            
            image{
               width: 30rpx;
               height: 30rpx;
               margin-right: 10rpx;
            }
         }
      }
   }
}
</style>