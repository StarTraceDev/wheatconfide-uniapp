<template>
  <uni-popup ref="popup" type="message">
    <view class="popup-content">
      <uni-icons type="closeempty" size="20" color="#A6A6A6" class="close-icon" @click="close"></uni-icons>
      <view class="title">
        <view class="title-text">您的专属客服</view>
        <image src="/static/my/robot.png" class="title-robot" />
      </view>
      <image :src="imageUrl" @longpress="handleLongPress" class="QRcode" />
      <view class="save-code">
        <image src="/static/my/save.png" class="title-save" />
          <view><text>长按保存</text>到相册</view>
      </view>
    </view>
  </uni-popup>
</template>

<script setup>
import { ref } from "vue";
import { getOperation } from '@/common/api/worry.js';

const imageUrl = ref();
const operationList = async() => {
  const { data } = await getOperation();
  const { customerServiceQrcode } = data.records[0];
  imageUrl.value = customerServiceQrcode
}
operationList();

const popup = ref(null);
const open = () => {
  popup.value.open('bottom');
};
const close = () => {
  popup.value.close();
}
defineExpose({
  open
})
const handleLongPress = async () => {
  try {
    const downloadRes = await uni.downloadFile({
      url: imageUrl.value
    });
    if (downloadRes.statusCode !== 200) {
      throw new Error('下载失败');
    }
    await uni.saveImageToPhotosAlbum({
      filePath: downloadRes.tempFilePath
    });
    uni.showToast({ title: '保存成功', icon: 'success' });
  } catch (err) {
    console.error('保存失败:', err);
    uni.showToast({ title: '保存失败', icon: 'none' });
  }
};
</script>

<style lang="scss" scoped>
.popup-content {
  background-color: #fff;
  // height: 650rpx;
  background-image: url(@/static/settled/settled-bg.png);
  background-size: 100vw 33.75rem;
  background-repeat: no-repeat;
  background-color: #f4f6f8;
  border-radius: 20rpx 20rpx 0 0;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  .close-icon {
    width: 100%;
    text-align: right;
  }
  .title{
    position: relative;
    font-size: 36rpx;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 900;
  }
  .QRcode {
    border: 3rpx solid #35ca95;
    border-radius: 20rpx;
    width: 350rpx;
    height: 350rpx;
    margin: 30rpx 0;
  }
  .save-code{
    display: flex;
    align-items: center;
    view{
      margin-left: 10rpx;
      font-size: 30rpx;
    }
    text{
      color: #35ca95;
    }
  }
}
.title-text{
  position: relative;
  z-index: 999;
}
.title-robot{
  position: absolute;
  top: -8rpx;
  right: -22rpx;
  z-index: 1;
  width: 50rpx;
  height: 50rpx;
}
.title-save{
  width: 35rpx;
  height: 35rpx;
}
</style>
