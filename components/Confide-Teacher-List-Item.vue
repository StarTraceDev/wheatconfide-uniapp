<template>
  <view class="teacher-listener">
    <view class="card-listener">
      <view class="avatar-wrap-listener">
				<image class="avatar-listener" :src="avatarImg(info)" mode="aspectFill"></image>
      </view>
      <view class="info-wrap">
        <view class="job-title">
          <view class="name-title">{{ info.name }}</view>
          <view
            >{{ getGenerationByBirthdate(info.birthdate) }} |
            {{ info.constellation }}</view
          >
        </view>
        <view class="tags">
          <text
            class="tag"
            v-for="(item, index) in info.serviceTypes.slice(0, 2)"
            >{{ item }}</text
          >
        </view>
        <view class="stats">
          <view>
						<view class="stats-item">
							<view class="num">{{ info.years }}年</view>
							<view>从业时间</view>
						</view>
						<view class="stats-item">
							<view class="num">{{ info.platformHours }}+</view>
							<view>平台时长</view>
						</view>
					</view>
          <view style="min-width: 40%">
						<view class="stats-item">
							<view class="num">{{ info.commentCount }}+</view>
							<view>评价</view>
						</view>
						<view class="stats-item">
							<view class="num">{{ info.commentCount }}+</view>
							<view>回头客</view>
						</view>
					</view>
        </view>
        <view class="price-button">
          <view class="contact">
            <image src="/static/consult/address.png"></image>
            <view>{{ formatAddress(info.address) }}</view>
          </view>
          <view v-if="info.quoteList[0]" class="price-info">
            <view class="price-unit">¥</view>
            <view>{{ info.quoteList[0].quoteAmount }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { getGenerationByBirthdate, formatAddress } from "@/lib/utils.js";
import { defineProps } from "vue";
const props = defineProps({
  info: {
    type: Object,
  },
});

// 获取头像
const avatarImg = (item) => {
  const { masterGallery } = item

  if(!masterGallery) {
    return '/static/consult/user.png'
  } else {
    return JSON.parse(masterGallery)[0].url
  }
}
</script>

<style scoped lang="scss">
.teacher-listener {
  height: 304rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 24rpx 24rpx 0rpx 24rpx;

  .card-listener {
    display: flex;
    flex-direction: column;
    .avatar-wrap-listener {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      .avatar-listener {
        width: 150rpx;
        height: 150rpx;
        border-radius: 50%;
      }
    }

    .info-wrap {
      .job-title {
        display: flex;
        margin-top: 10rpx;
        align-items: flex-end;
        justify-content: space-between;
        .name-title {
          color: rgba(0, 0, 0, 0.85);
          font-size: 35rpx;
        }
      }
      .stats {
        display: flex;
        padding-top: 0.375rem;
        font-size: 20rpx;
        color: rgba(0, 0, 0, 0.5);
        flex-wrap: wrap;
				justify-content: space-between;

        .stats-item {
          margin: 5rpx 0;
          display: flex;
          align-items: center;
          .num {
            color: #2e3030;
          }
        }
      }
      .tags {
        padding-top: 12rpx;
        .tag {
          color: #2e3030;
          font-size: 20rpx;
          border-radius: 8rpx;
          border: 1px solid #c7cbca;
          padding: 4rpx 6rpx;
          margin-right: 10rpx;
        }
      }
      .price-button {
        display: flex;
        padding-top: 30rpx;
        justify-content: space-between;
        align-items: center;
        .price {
          color: #fa5151;
          font-size: 40rpx;
          .unit,
          .txt {
            font-size: 20rpx;
          }
        }
        .contact {
          display: flex;
          font-size: 20rpx;
          color: #9da6a4;
          image {
            width: 25rpx;
            height: 25rpx;
          }
        }
        .price-info{
          display: flex;
          align-items: flex-end;
          font-size: 38rpx;
          color: red;
          .price-unit{
            color: red;
            font-size: 25rpx;
            margin-right: 3rpx;
            margin-bottom: 5rpx;
          }
        }
      }
    }
  }
}
.list-item{
  margin-bottom: 5rpx !important;
}
</style>
