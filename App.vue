<script>
import lgen_intercept from "@/uni_modules/lgen-intercept/js_sdk/lgen-intercept.js";

export default {
  onLaunch: function (e) {
    lgen_intercept(e);
  },
  onShow: function () {},
  onHide: function () {},
  globalData: {
    httpImageUrl: "https://odd.dzjob.net/profile/upload",
  },
};
</script>

<style lang="scss">
@import "@/static/icon/iconfont.css";
@import "./uni_modules/vk-uview-ui/index.scss";
/*每个页面公共css */
</style>

<style>
/* 修复 uni.showToast 带icon时 文字超出/截断/换行无效 核心样式 */
.uni-toast .uni-toast__content {
  width: auto !important;
  max-width: 240px !important;
  padding: 16rpx 20rpx !important;
  box-sizing: border-box !important;
}
/* 让超长文字自动换行，不截断 */
.uni-toast .uni-toast__text {
  white-space: normal !important;
  word-break: break-all !important;
  text-align: center !important;
  margin-left: 10rpx !important;
}
.uni-tabbar-border {
  display: none !important;
}
</style>
