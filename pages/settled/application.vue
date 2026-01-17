<template>
  <view class="settled-box" :class="`settled-bg-${typeDistinguish}`">
    <view class="header">
      <uni-nav-bar
        :class="scrollTop > 15 ? 'scrollClass' : ''"
        backgroundColor="rgba(255,255,255,0)"
        :border="false"
        :title="navTitle"
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
      <view class="content-item">
        <view class="title">
          <view class="label" :class="`label-${typeDistinguish}`" :style="{ left: typeDistinguish == 1 ? '29%' : '34%' }"></view>
          <text>什么是{{ typeDistinguish == 1 ? '心理咨询师' : '倾听师' }}</text>
        </view>
        <view class="use-public"
          >{{ typeDistinguish == 1 ? '心理咨询师' : '倾听师' }}是协助求助者解决心理问题的人，心理咨询最一般、最主要的对象，是健康人群或存在心理问题的人群。</view
        >
      </view>

      <view class="content-item">
        <view class="title">
          <view
            class="label"
            :class="`label-${typeDistinguish}`"
            :style="{ left: typeDistinguish == 1 ? '27%' : '32%' }"
          ></view>
          <text>成为{{ typeDistinguish == 1 ? '心理咨询师' : '倾听师' }}条件</text>
        </view>
        <view class="use-public" style="text-indent: 0" v-html="content"></view>
      </view>

      <view class="content-item">
        <view class="title">
          <view
            class="label"
            :class="`label-${typeDistinguish}`"
            :style="{ left: typeDistinguish == 1 ? '27%' : '32%' }"
          ></view>
          <text>成为{{ typeDistinguish == 1 ? '心理咨询师' : '倾听师' }}好处</text>
        </view>
        <view class="use-public">
          <view class="use-public process-box">
            <view
              class="process"
              v-for="(item, inde) in benefitList"
              :key="index"
            >
              <view>
                <image
                  :src="item.icon"
                  :style="{ width: item.width, height: item.height }"
                ></image>
                <view>{{ item.name }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="content-item">
        <view class="title">
          <view
            class="label"
            :class="`label-${typeDistinguish}`"
            style="left: 39%"
          ></view>
          <text>注册流程</text>
        </view>
        <view class="use-public process-box">
          <view
            class="process"
            v-for="(item, inde) in registrationList"
            :key="index"
          >
            <view>
              <image
                :src="item.icon"
                :style="{ width: item.width, height: item.height }"
              ></image>
              <view>{{ item.name }}</view>
            </view>
            <view
              class="triangle-right"
              :class="`triangle-color-${typeDistinguish}`"
              v-if="inde < registrationList.length - 1"
            ></view>
          </view>
        </view>
      </view>
    </view>
  </view>
  <view>
    <view class="agreement">
      <image :src="`/static/auth/${isAgree ? typeDistinguish == 1 ? 'select-green': 'select-yellow' : 'not-selected'}.png`" @click="isAgree = !isAgree"></image>
      <view>同意<text :class="`text-${typeDistinguish}`" @click="toAgreement">《{{ typeDistinguish == 1 ? '咨询师' : '倾听师' }}入驻协议》</text></view>
    </view>
    <button class="btn" :class="`btn-${typeDistinguish}`" @click="toApply">开始认证</button>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useGlobalDataStore } from "@/stores/global.js";
import { onLoad, onShow, onPageScroll } from "@dcloudio/uni-app";
import { articleByType } from "@/common/api/apis.js";

const scrollTop = ref(0);
const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const isAgree = ref(false);
const navTitle = ref("申请成为咨询师");
const typeDistinguish = ref("1");
const benefitList = ref([]);
const registrationList = ref([]);
const content = ref("");
const userInfo = ref('');

onLoad((options) => {
  typeDistinguish.value = options.type;
  userInfo.value = JSON.parse(options.userInfo);
  allMethods(options.type);
  getAgreementByType();
});

const benefits = reactive([
  {
    name: "时间自由",
    icon: "/static/settled/consultation-1.png",
    width: "90rpx",
    height: "87rpx",
  },
  {
    name: "收入可观",
    icon: "/static/settled/consultation-2.png",
    width: "90rpx",
    height: "85rpx",
  },
  {
    name: "操作便捷",
    icon: "/static/settled/consultation-3.png",
    width: "100rpx",
    height: "95rpx",
  },
]);
const registration = reactive([
  {
    name: "身份认证",
    icon: "/static/settled/consultation-4.png",
    width: "90rpx",
    height: "80rpx",
  },
  {
    name: "填写资料",
    icon: "/static/settled/consultation-5.png",
    width: "90rpx",
    height: "80rpx",
  },
  {
    name: "提交审核",
    icon: "/static/settled/consultation-6.png",
    width: "90rpx",
    height: "90rpx",
  },
]);

const allMethods = (type) => {
  navTitle.value = `申请成为${type == 1 ? "咨询师" : "倾听师"}`;
  benefitList.value = fangfa(benefits, type, 1);
  registrationList.value = fangfa(registration, type, 4);
};

const fangfa = (list, type, inde) => {
  return list.map((item, index) => {
    const prefix = type == 1 ? "consultation" : "listen";
    const newIcon = `/static/settled/${prefix}-${index + inde}.png`;
    return {
      ...item,
      icon: newIcon,
    };
  });
};

const toAgreement = () => {
  const title = typeDistinguish.value == 1 ? "咨询师入驻协议" : "倾听师入驻协议";
   uni.navigateTo({
    url: `/pages/webview/webview?type=${title}`,
  });
};

const getAgreementByType = async () => {
  const title = typeDistinguish.value == 1 ? "成为心理咨询师条件" : "成为倾听师条件";
  try {
		const queryParams = {
        current: 1,
        size: 10,
        title,
      }
		let { data } = await articleByType(queryParams);
    content.value = data.records[0].content;
	} catch (error) {
		console.log(error);
	}
};

const toApply = () => {
  if (!isAgree.value) {
    uni.showToast({
      title: "请同意入驻协议",
      icon: "none",
    });
    return;
  }
  uni.navigateTo({ url: `/pages/auth/auth?type=${typeDistinguish.value}&userInfo=${JSON.stringify(userInfo.value)}`});
}

onShow(() => {});


onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});

const backFn = () => {
  uni.navigateBack({
    delta: 1,
  });
};

</script>

<style lang="scss" scoped>
.settled-bg-1 {
  background-image: url("@/static/settled/settled-bg.png"),
    url("@/static/settled/settled-bg-bt.png");
  background-position: top left, bottom left;
  background-size: 100vw 632rpx, 100vw 100vh;
}
.settled-bg-2 {
  background: linear-gradient(to bottom, #ffe3b0, transparent 15%),
    linear-gradient(to top, #ffe3b0, transparent 15%);
  background-size: 100% 100%;
}
.settled-box {
  $statusBarHeight: v-bind(statusBarHeight);
  width: 100vw;
  background-repeat: no-repeat;
  background-color: #f4f6f8;
  padding-bottom: 30rpx;
  border-radius: 0 0 30rpx 30rpx;
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
    box-shadow: 0rpx 4rpx 20rpx rgba(0, 0, 0, 0.1);
    background-color: #fff;
    z-index: 999;
    ::v-deep(.uni-nav-bar-text) {
      color: #000;
    }
  }

  .content {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: calc($statusBarHeight - 20rpx);
    &-item {
      background-color: #fff;
      border-radius: 20rpx;
      padding: 20rpx;
      margin: 20rpx;
      width: calc(100% - 50rpx);
      .title {
        display: flex;
        justify-content: center;
        font-size: 32rpx;
        font-weight: bold;
        position: relative;
        text {
          margin-bottom: 20rpx;
          z-index: 100;
        }
        .label {
          position: absolute;
          left: 190rpx;
          top: 3rpx;
          width: 30rpx;
          height: 30rpx;
          border-radius: 50%;
        }
        .label-2 {
          border: 4rpx solid #eb9516;
        }
        .label-1 {
          border: 4rpx solid #34a76f;
        }
      }
      .use-public {
        color: #9e9e9e;
        text-indent: 2em;
        line-height: 50rpx;
        .process {
          display: flex;
          align-items: center;
          flex-direction: row;
          image {
            width: 100rpx;
            height: 80rpx;
          }
          view {
            font-size: 24rpx;
            // margin: 20rpx 0;
          }
        }
      }
      .process-box {
        color: #3e3d3d;
        margin: 20rpx 0 20rpx;
        text-indent: 0;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
      }
      .triangle-right {
        position: relative;
        top: -30rpx;
        width: 0;
        height: 0;
        margin-left: 40rpx;
        border-width: 15rpx 0 15rpx 15rpx;
        border-style: solid;
        line-height: 0;
        font-size: 0;
      }
      .triangle-color-1 {
        border-color: transparent transparent transparent #35ca95;
      }
      .triangle-color-2 {
        border-color: transparent transparent transparent #eb9516;
      }
    }
  }
}
.agreement{
  display: flex;
  align-items: center;    
  justify-content: center;
  margin: 20rpx 0 ;
  color: #9E9E9E;
  image {
    margin-right: 10rpx;
    width: 30rpx;
    height: 30rpx
  }
  .text-1{
    color: #34a76f;
  }
  .text-2{
    color: #eb9516;
  }
}
.btn{
  margin: 0 30rpx 30rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  
  color: #fff;
  text-align: center;
}
.btn-1{
  background-color: #34A76F;
}
.btn-2{
  background-color: #EB9516;
}
</style>
