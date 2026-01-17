<template>
  <view class="auth-box">
    <view class="children-component">
      <uni-nav-bar
        :class="scrollTop > 15 ? 'scrollClass' : ''"
        backgroundColor="rgba(255,255,255,0)"
        :border="false"
        title="认证"
        class="header-bar"
      >
        <template v-slot:left>
          <uni-icons type="left" size="24" @click="backFn"></uni-icons>
        </template>
      </uni-nav-bar>
      <scroll-view
        scroll-y="true"
        v-if="certificate.verifyStatus == null || certificate.verifyStatus == 0"
        :show-scrollbar="false"
        class="scroll-content"
      >
        <view class="children-content">
          <view class="top-bg"></view>
          <view class="current-component">
            <view class="component-tip" v-if="consultant.status == 1 || consultant.status == 3">
              <uni-icons type="notification-filled" size="20" color="#fd3e3c" />
              <view>{{ consultant.status == 1 ? '您的入驻申请正在审核中，请耐心等待......' : '您上传的身份证照片不清晰，请修改后再提交' }}</view>
            </view>
            <view class="step-box">
              <view class="step-content">
                <view
                  class="step-item"
                  :class="step == 2 ? 'step-item-active' : ''"
                >
                  <view class="step-num">1</view>
                  <view class="step-txt">职业信息</view>
                </view>
                <view class="step-line"></view>
                <view
                  class="step-item"
                  :class="step == 3 ? 'step-item-active' : ''"
                >
                  <view class="step-num">2</view>
                  <view class="step-txt">证书资料</view>
                </view>
              </view>
            </view>
            <view class="handler-components-box">
              <career
                v-show="step == 2"
                ref="careerRef"
                :modelValue="consultant"
                :consultantType="consultantType"
                @committed="setp2Commit"
              />
              <certificate
                v-show="step == 3"
                ref="finalStep"
                @commited="finalCommit"
                :modelValue="consultant"
                :consultantType="consultantType"
              />
              <view class="footer">
                <view class="tip">
                  <image src="/static/auth/tip.svg" class="img"></image
                  >个人信息安全保障中
                </view>
                <!-- <view class="btn" v-if="step == 1">
                  <view
                    class="next"
                    :class="consultantType == 1 ? 'next-ba1' : 'next-ba2'"
                    @click="nextStepHandler"
                    >填好了，下一步</view
                  >
                </view> -->

                <view class="btn step-2" style="justify-content: center;" v-if="step == 2">
                  <view
                    class="next"
                    :class="consultantType == 1 ? 'next-ba1' : 'next-ba2'"
                    @click="nextStepHandler"
                    >填好了，下一步</view
                  >
                </view>

                <view class="btn step-2" v-if="step == 3">
                  <view class="next prev" @click="prevStepHandler">上一步</view>
                  <view
                    class="next"
                    :class="consultantType == 1 ? 'next-ba1' : 'next-ba2'"
                    @click="examineHandler"
                    >提交审核</view
                  >
                </view>
              </view>
              <!-- <component :is="currentComponent" :key="currentComponent"></component> -->
            </view>
          </view>
        </view>
      </scroll-view>
      <view v-else-if="consultant.verifyStatus == 1">
        <!--认证审核中-->
        <!--图标-->
        <view>
          <u-icon name="info-circle-fill"></u-icon>
        </view>
        <view><text>认证审核中，请稍后查看</text></view>
        <view><text @click="recheck" style="color: red">重新审核</text></view>
      </view>
      <view v-else-if="consultant.verifyStatus == 2">
        <!--审核通过-->
        <view><text>您已认证成为心理咨询师</text></view>
      </view>
      <view v-else>
        <view><text>您的资料未通过审核~</text></view>
      </view>
    </view>
    <uni-popup ref="popup" type="message">
      <view class="popup-content">
        <view class="content-title">您的申请已提交成功</view>
        <view class="content-text">稍后可进入申请页面查看审核进度</view>
        <view class="content-btn"
          :style="{ background: consultantType == 1 ? '#35CA95' : '#EB9516' }"
          @click="closePopup"
        >返回“我的”</view>
      </view>
    </uni-popup>
  </view>
</template>
<script setup>
import { ref, watch } from "vue";
import { useGlobalDataStore } from "@/stores/global.js";
import { onLoad } from "@dcloudio/uni-app";
import { getConsultantByUserId } from "@/common/api/consultant.js";
import { getListenerByUserId } from "@/common/api/listener.js";
import career from "./components/career.vue";
import certificate from "./components/certificate.vue";

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const currentComponent = ref(career);
const step = ref(2);
const consultant = ref({});
const idCardRef = ref(null);
const careerRef = ref(null);
const finalStep = ref(null);
const consultantType = ref("");
const userInfo = ref('');

const backFn = () => { 
  uni.navigateBack({
    delta: 1
  });
}
onLoad((options) => {
  consultantType.value = options.type;
  userInfo.value = JSON.parse(options.userInfo);
  uni.setNavigationBarTitle({ title: "认证" });
  getConsultantDetail();
});

const getConsultantDetail = async () => {
  if (consultantType.value == 1) {
    let resp = await getConsultantByUserId({ userId: userInfo.value });
    const data = {
      ...resp.data,
      idcardNum: resp.data.sysUser.idCardNo,
      idcardFront: resp.data.sysUser.idCardFrontImg,
      idcardBackend: resp.data.sysUser.idCardBackImg,
      occupationId: resp.data.sysUser.occupationId
    }
    processingImg(data);
  } else {
    let resp = await getListenerByUserId({ userId: userInfo.value });
    const data = {
      ...resp.data,
      occupationId: resp.data.sysUser.occupationId
    }
    processingImg(data);
  }
};

const processingImg = (val) => {
  const { masterGallery, commitmentImg, holdIdCardImg } = val;
  const master = masterGallery ? formatImages(JSON.parse(masterGallery)) : [];
  const commitment = commitmentImg ? formatImages([commitmentImg]) : [];
  const holdIdCard = holdIdCardImg ? formatImages([holdIdCardImg]) : [];
  
  const data = Object.assign(val, {
    masterGallery: [{url:'https://s.maimiaoqingsu.com/57cda2c5-d9f3-4118-9dc5-fb91649cf316.png'}],
    commitmentImg: commitment,
    holdIdCardImg: holdIdCard,
  });
  consultant.value = data;
};

// 转换函数
const formatImages = (urls) => {
  return urls.map((url, index) => ({
    url,
  }));
};

// 集中管理表单数据
const formData = ref({
  idCard: {
    consultantName: "",
    idNum: "",
    // 其他身份证信息字段
  },
  career: {
    profession: "",
    experience: "",
    // 其他职业信息字段
  },
  certificate: {
    files: [],
    // 其他证书字段
  },
});

const nextStepHandler = () => {
  if (step.value == 1) {
    idCardRef.value?.submit();
  }
  if (step.value == 2) {
    careerRef.value?.submit();
  }
};

const setp2Commit = () => {
  step.value = step.value + 1;
};

const finalCommit = () => {
  popup.value.open('center');
};

const prevStepHandler = () => {
  step.value = step.value - 1;
};

watch(step, (newVal, oldVal) => {
  if (newVal == 1) {
    currentComponent.value = idCard;
  } else if (newVal == 2) {
    currentComponent.value = career;
  } else if (newVal == 3) {
    finalStep.value?.refreshData();
    currentComponent.value = certificate;
  }
});

const popup = ref(null);

const examineHandler = async () => {
  finalStep.value?.submit();
  const { certificateList, educationList, careerList, consultantType } = finalStep.value.fromDataCertificate
  const submitData = {
    ...formData.value.idCard,
    ...formData.value.career,
    certificateList, 
    educationList, 
    careerList, 
    consultantType,
    certificates: formData.value.certificate.files,
  };
  // try{
  //   // const api = consultantType == 1 ? registerConsultantStep3 : registerListenerStep3
  //   // let res = await api(submitData);
  // } catch (err) {
  //   console.error("提交失败：", err);
  //   uni.showToast({ title: "提交失败", icon: "error" });
  // }
};

// 关闭
const closePopup = () => {
  uni.switchTab({
    url: '/pages/my/index'
  });
}
</script>

<style lang="scss" scoped>
$statusBarHeight: v-bind(statusBarHeight);

.auth-box {
  background: #f4f6f8;
  min-height: 100%;
  height: auto;
  position: relative;

  .children-component {
    height: calc(100vh - 88rpx);
    //	#ifdef APP-PLUS
    height: calc(100vh);
    //	#endif

    .scroll-content {
      width: 750rpx;
      height: 100%;

      .children-content {
        position: relative;
        height: auto;

        .top-bg {
          width: 750rpx;
          height: 546rpx;
          background: linear-gradient(180deg, #e3fff5 2%, #f4f6f8 100%);
          position: absolute;
          top: 0rpx;
          z-index: 1;
        }

        .current-component {
          padding-top: 24rpx;
          position: relative;
          z-index: 2;
          height: 100%;
          padding-bottom: 220rpx;
          .component-tip{
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10rpx;
            view{
              width: 80%;
              font-size: 23rpx;
              color: #778580;
              padding: 5rpx 15rpx;
              border-radius: 20rpx;
              background-color: #DCF5EC;
            }
          }
          .step-box {
            width: 750rpx;
            height: 96rpx;
            display: flex;
            justify-content: center;

            .step-content {
              width: 622rpx;
              display: flex;
              justify-content: space-evenly;
              align-items: center;

              .step-item {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                position: relative;

                .step-num {
                  width: 40rpx;
                  height: 40rpx;
                  background: #78a494;
                  line-height: 40rpx;
                  text-align: center;
                  font-size: 24rpx;
                  color: #fff;
                  border-radius: 40rpx;
                }

                .step-txt {
                  font-size: 24rpx;
                  color: #78a494;
                  margin-top: 12rpx;
                }
              }

              .step-item-active {
                .step-num {
                  background: #35ca95;
                }

                .step-txt {
                  color: #073d2a;
                }
              }

              .step-line {
                width: 130rpx;
                height: 8rpx;
                border-radius: 4rpx;
                background: #b5f4de;
                margin-top: 20rpx;
              }
            }
          }

          .handler-components-box {
            margin-top: 38rpx;
          }
        }
      }
    }
  }

  .footer {
    width: 750rpx;
    height: 220rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #f4f6f8;
    position: fixed;
    bottom: 0rpx;
    z-index: 99;

    .tip {
      font-size: 24rpx;
      font-weight: normal;
      letter-spacing: normal;
      display: flex;
      align-items: center;
      color: #98a7a2;

      .img {
        width: 28rpx;
        height: 28rpx;
      }
    }

    .btn {
      width: 686rpx;
      height: 88rpx;
      margin-top: 28rpx;
      display: flex;
      justify-content: space-between;

      .next {
        width: 100%;
        height: 100%;
        border-radius: 60rpx;
        color: #fff;
        font-size: 30rpx;
        font-weight: 500;
        text-align: center;
        line-height: 88rpx;
      }
      .next-ba1 {
        background: #35ca95;
      }
      .next-ba2 {
        background: #eb9516;
      }
    }

    .step-2 {
      .next {
        width: 330rpx;
      }

      .prev {
        background: #101922;
      }
    }
  }
}
.popup-content{
  background-color: #fff;
  padding: 90rpx 90rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20rpx;
  .content-title{
    font-size: 35rpx;
  }
  .content-text{
    margin: 20rpx 0 50rpx;
    font-size: 20rpx;
    color: #9E9E9E;
  }
  .content-btn{
    color: #fff;
    font-size: 23rpx;
    padding: 10rpx 30rpx;
    border-radius: 10rpx;
  }
}
::v-deep .uni-page-head{
  z-index: 0 !important;
}
</style>
