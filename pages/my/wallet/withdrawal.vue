<template>
  <view class="settled-box">
    <view class="header">
      <uni-nav-bar
        :class="scrollTop > 15 ? 'scrollClass' : ''"
        backgroundColor="rgba(255,255,255,0)"
        :border="false"
        title="我的钱包"
        class="header-bar"
      >
        <template v-slot:left>
          <uni-icons type="left" size="24" @click="backFn"></uni-icons>
        </template>
      </uni-nav-bar>
    </view>
    <view class="content">
      <view class="content-details">
        <view class="detail-item">
          <view>提现金额</view>
          <text>满50元即可申请提现</text>
        </view>
        <view class="detail-item">
          <view style="display: flex">
            <view style="font-size: 50rpx">¥</view>
            <uni-easyinput v-model="amount" placeholder="输入自定义金额" />
          </view>
          <text>可用余额￥{{ balance }}</text>
        </view>
      </view>

      <view class="clause">
        <view style="padding-left: 15rpx">提现至银行卡</view>
         <view class="bank-card">
            <view style="display: flex; align-items: center"@click="handleHandover()">
               <image src="/static/my/withdrawal.png" class="bank-img" />
               <view>{{ title }}</view>
            </view>
            <view class="card" @click="handleWithdrawal('/pages/my/wallet/bank-card')">
            <view v-if="bankData.length == 0">
                  <view style="color: #9e9e9e; font-size: 20rpx; padding-right: 10rpx">去绑定</view>
            </view>
            <view style="color: #9e9e9e"> > </view>
          </view>
        </view>
        <view class="bank-list" v-if="bankData.length != 0 && bankBool">
         <view v-for="(item, index) in bankData" :key="index" :class="index % 2 != 0 ? 'card-item1' : ''" @click="handleBank(item)">
            <view class="card-item">
               <image src="/static/my/withdrawal.png" class="bank-img" />
               <view>{{ item.bankName }}（{{format(item.cardNo)}}）</view>
            </view>
         </view>
        </view>
        <view style="margin: 50rpx 0 10rpx; color: #9e9e9e">提现说明：</view>
        <view style="font-size: 25rpx; color: #9e9e9e"
          >1.本次提现仅若遇未到账，请联系客服。</view>
          <view style="font-size: 25rpx; color: #9e9e9e"
          >2.多张银行卡时，点击银行卡可切换。</view>
      </view>

      <button @click="butBankCard" class="but">确定</button>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";
import { useGlobalDataStore } from "@/stores/global.js";
import { onShow, onPageScroll, onLoad } from "@dcloudio/uni-app";
import { bank, apply } from "@/common/api/order.js";

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const amount = ref();
const bankData = ref([]);
const balance = ref(0);
const bankCardId = ref();
const bankBool = ref(false);
const title = ref('绑定银行卡')

const bankCardList = async () => {
  try {
    const { data } = await bank();
    bankData.value = data;
    Default();
  } catch (e) {
    console.log(e);
  }
};

onShow(() => {
   bankCardList();
   Default();
});

const backFn = () => {
  uni.navigateBack({
    delta: 1,
  });
};
const scrollTop = ref(0);

onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});

onLoad((options) => {
   balance.value = options.amount
})

const handleWithdrawal = (url) => {
  uni.navigateTo({ url });
};

const format = (val) => {
  return val.slice(-4);
}
const Default = () => {
   if(bankData.value.length == 0){
      return title.value = '绑定银行卡'
   }
   if(bankData.value.length >= 1){
      bankCardId.value = bankData.value[0].id
      return title.value = bankData.value[0].bankName + '（' + format(bankData.value[0].cardNo) + '）'
   }
}
watch(bankCardId, (newVal, oldVal) => {
   if(bankCardId.value){
      bankData.value.map((item) => {
         if(item.id == bankCardId.value){
            return title.value = item.bankName + '（' + format(item.cardNo) + '）'
         }
      })
   }
})
const butBankCard = async () => {
   if(bankData.value.length == 0){
      uni.showToast({
         title: '请先绑定银行卡',
         icon: 'none',
         duration: 2000 
      });
      return
   }
  try {
    const { data } = await apply({
      amount: amount.value,
      bankCardId: bankCardId.value,
   });
    console.log(data);
  } catch (e) {
    console.log(e);
  }
}
const handleHandover = () => {
   if(bankData.value.length > 2){
      bankBool.value = true
   }
}
const handleBank = (item) => {
   bankCardId.value = item.id
   bankBool.value = false
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
      padding: 0 50rpx;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      border-radius: 20rpx;

      .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 35rpx 0;
        text {
          text-align: right;
          min-width: 250rpx;
          color: #9e9e9e;
          font-size: 25rpx;
        }
      }
    }

    .clause {
      margin: 30rpx;
      border-radius: 20rpx;
      .bank-card {
        margin: 20rpx 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
        padding: 30rpx;
        border-radius: 20rpx;

        .card {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
.bank-list{
   margin: 20rpx 0;
   background: #fff;
   border-radius: 20rpx;
   padding: 30rpx;
   .card-item{
     display: flex;
     align-items: center;
     margin: 20rpx 0;
   }
}
.card-item1{
   border-top: 2px solid #f5f5f5;
   border-bottom: 2px solid #f5f5f5;
}
.but {
  text-align: center;
  background: #35ca95;
  color: #fff;
  margin: 700rpx 30rpx 0;
  border-radius: 50rpx;
}
.bank-img{
   width: 40rpx;
   height: 30rpx;
   margin-right: 10rpx
}
::v-deep .is-input-border {
  border: none;
}
::v-deep .uni-easyinput__placeholder-class {
  font-size: 40rpx;
}
::v-deep .uni-input-input {
  font-size: 50rpx !important;
}
::v-deep .content-clear-icon {
  display: none;
}
</style>
