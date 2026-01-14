<template>
   <view class="settled-box">
      <view class="header">
         <uni-nav-bar :class="scrollTop > 15 ? 'scrollClass' : ''" backgroundColor="rgba(255,255,255,0)" :border="false"
            title="绑定银行卡" class="header-bar">
            <template v-slot:left>
               <uni-icons type="left" size="24" @click="backFn"></uni-icons>
            </template>
         </uni-nav-bar>
      </view>
      <view class="content">
         <uni-forms ref="formRef" :rules="rules" :modelValue="formData">
            <view class="content-details">
               <view class="detail-item">
                  <view>姓名</view>
                  <uni-forms-item name="realName">
                     <uni-easyinput v-model="formData.realName" placeholder="请输入真实姓名" />
                  </uni-forms-item>
               </view>
               <view class="detail-item">
                  <view>银行卡卡号</view>
                  <uni-forms-item name="cardNo">
                     <uni-easyinput v-model="formData.cardNo" placeholder="请输入银行卡卡号" />
                  </uni-forms-item>
               </view>
               <view class="detail-item">
                  <view>开户银行</view>
                  <uni-forms-item name="bankName">
                     <uni-easyinput v-model="formData.bankName" placeholder="请输入开户行" />
                  </uni-forms-item>
               </view>
            </view>

            <view class="clause">
               <view style="margin: 50rpx 0 10rpx;color: #9E9E9E;">提现说明：</view>
               <view style="font-size: 25rpx;color: #9E9E9E;">1、在交易过程中，会向麦苗倾诉显示添加的付款方式的详细信息以进行付款，将看到您的真实姓名。请确保信息正确、真实。</view>
            </view>

            <button @click="butBankCard" class="but">确定</button>
         </uni-forms>
      </view>
   </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useGlobalDataStore } from '@/stores/global.js';
import { onShow, onPageScroll } from '@dcloudio/uni-app'
import { addBank } from '@/common/api/order.js'

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + 'px');

const formData = ref({
   realName: '',
   cardNo: '',
   bankName: '',
})

const rules = reactive({
   realName: {
      rules: [{
         required: true,
         errorMessage: '请输入真实姓名'
      }]
   },
   cardNo:{
      rules: [{
         required: true,
         errorMessage: '请输入银行卡卡号'
      }]
   },
   bankName: {
      rules: [{
         required: true,
         errorMessage: '请输入开户行'
      }]
   },
})

onShow(() => { })

const backFn = () => {
   uni.navigateBack({
      delta: 1
   })
}
const scrollTop = ref(0);

onPageScroll((e) => {
   scrollTop.value = e.scrollTop;
});

const butBankCard = async () => {
   try {
      const res = await addBank(formData.value)
      if(res.success){
         uni.showToast({
            title: '添加成功',
            icon: 'none', // 可选值 'success', 'loading', 'none'
            duration: 2000 // 持续时长，单位ms
         });
         backFn()
      }
   } catch (err) {
      console.log(err);
   }
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
            padding: 20rpx 0;
            text {
               text-align: right;
               min-width: 250rpx;
               color: #9E9E9E;
               font-size: 25rpx;
            }
         }
      }
      .clause {
         margin: 30rpx;
         border-radius: 20rpx;

      }
   }
}
.but{
   // padding: 0rpx;
   text-align: center;
   background: #35CA95;
   color: #fff;
   margin: 700rpx 30rpx 0;
   border-radius: 50rpx;
}
::v-deep .is-input-border{
   border: none;
}
::v-deep .uni-easyinput__placeholder-class{
   font-size: 30rpx;
   text-align: right;
}
::v-deep .uni-input-input{
   font-size: 30rpx !important;
   text-align: right;
}
::v-deep .content-clear-icon{
   display: none;
}
::v-deep .uni-forms-item{
   margin: 0 !important;
}
</style>