<template>
	<view class="settled-box">
		<view class="header">
			<uni-nav-bar :class="scrollTop > 15 ? 'scrollClass' : ''" backgroundColor="rgba(255,255,255,0)" :border="false"
				title="评价" class="header-bar">
				<template v-slot:left>
					<uni-icons type="left" size="24" @click="backFn"></uni-icons>
				</template>
			</uni-nav-bar>
		</view>
		<scroll-view scroll-y @scroll="onPageScroll" style="height: 100vh" :show-scrollbar="false">
			<view class="consultation-content">
				<view class="user-info-section">
					<view class="user-info">
            <image :src="orderInfo.teacherAvatar" class="user-avatar"></image>
              <view class="user-details">
                <view class="user-name">{{ orderInfo.teacherName }}</view>
                <!-- <view class="user-expertise">精神分析流派</view> -->
              </view>
          </view>
          <view :style="{ color: colorType }" @click="handleChat">
            私聊ta
          </view>
        </view>

				<view class="evaluation-content">
					<view class="evaluation-item">
						<view>满意程度</view>
						<uni-rate v-model="fromData.star" size="18" :value="5" />
					</view>
					<view class="evaluation-item">
						<view>值得推荐</view>
						<uni-rate v-model="fromData.recommendStar" size="18" :value="5" />
					</view>
					<view>
						<view>对Ta的印象</view>
						 <TagsSelect 
							v-model="fromData.tags" 
							:debug="true" 
							:colorType="colorType"
							:style="{ backgroundColor: startColor == '#ffbb4166' ? '#FFFAF1' : '#F3F9F7' }"
							class="tags-select"
						/>
					</view>
					<view>
						<view>评价描述</view>
						<textarea
							v-model="fromData.content "
							placeholder-style="
							background-color: #F6F6F6;
							width: 100%; color:#9E9E9E;
							padding: 20rpx;"
							placeholder="请输入详情描述"
						/>
						<view class="anonymous">
							<checkbox-group @change="changeAnonymous" >
									<checkbox :value="1" :checked="false" />
							</checkbox-group>
							<view>匿名评价</view>
						</view>
					</view>
					<view class="evaluation-btn">
						<view class="evaluation-btn-text" @tap="submitForm">提交</view>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<uni-popup ref="popup" type="center" :animation="false">
			<view class="popup-container">
				<view class="popup-title">
					<uni-icons type="notification-filled" size="40" color="#35CA95"></uni-icons>
				</view>
				<view class="popup-content">
						抱歉，您存在的情况不适于咨询， 建议您选择更专业治疗，以便于给您提 供更好的服务。
				</view>
				<view class="popup-btn">
					<view class="popup-btn-text" @tap="closePopup">知道了</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref, watch } from "vue";
import { useGlobalDataStore } from "@/stores/global.js";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { saveComment } from "@/common/api/order.js";
import TagsSelect from '@/components/Tags-Container.vue'; // 路径根据实际情况调整

const scrollTop = ref(0);
const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const startColor = ref('#35ca955c');
const fromData = ref({
		type: 1, // 评论类型
		tags: "", // 印象标签，逗号分隔
		star: 0, // 满意程度
		recommendStar: 0, // 值得推荐
		isAnonymous: 0, //是否匿名：0否 1是
		targetUserId: '1998631440393773058',
		content: "", //留言内容
});

const onPageScroll = (e) => {
	scrollTop.value = e.detail.scrollTop;
};

const backFn = () => {
	uni.navigateBack({
		delta: 1,
	});
};

const orderInfo = ref({});
const colorType = ref('#34A76F');
onLoad((options) => {
	orderInfo.value = JSON.parse(options.order);
	console.log(orderInfo.value, colorType.value, startColor.value);
	colorType.value = options.colorType == 1 ? "#eb9516" : "#35CA95"
	options.colorType == 1 ? startColor.value = '#ffbb4166' : startColor.value = '#35ca955c'
});

const popup = ref(null)
const closePopup = () => {
	popup.value.close();
}
const changeAnonymous = (e) => {
	fromData.value.isAnonymous = e.detail.value[0] ? 1 : 0
}

const submitForm = async () => {
  if (!fromData.value.tags) {
    uni.showToast({
      title: '请至少选择一个评价维度',
      icon: 'none'
    });
    return;
  }
  try{
		const res = await saveComment(fromData.value)
		uni.showToast({
			title: '评价提交成功',
			icon: 'success'
		});
	} catch(e){}
};

const handleChat = () => {
	const { userId, teacherName, teacherAvatar } = orderInfo.value
	uni.navigateTo({
		url: `/pages/message/private-chat?to=${userId}&name=${teacherName}&avatar=${teacherAvatar}`
	})
}
</script>

<style lang="scss" scoped>
$primary-color: #333;
$secondary-color: #666;
$border-color: #d8d8d8;
$notice-color: #898686;
$spacing-small: 20rpx;
$spacing-medium: 30rpx;
$spacing-large: 40rpx;
$border-radius: 10rpx;

// 混合器
@mixin flex-center {
	display: flex;
	align-items: center;
	justify-content: center;
}

@mixin flex-between {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.settled-box {
	$statusBarHeight: v-bind(statusBarHeight);
	width: 100vw;
	min-height: 100vh !important;
	background-size: 100vw 500rpx;
	background-repeat: no-repeat;
	background-image: linear-gradient(to bottom, v-bind(startColor), rgba(255, 0, 0, 0));
	background-color: #f4f6f8;

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

	.consultation-content {
		min-height: calc(100% + $statusBarHeight + 30rpx);
		padding-top: calc($statusBarHeight - 20rpx);

		.user-info-section {
      display: flex;
      align-items: center;
			justify-content: space-between;
			background: #fff;
			margin: 10rpx 30rpx 30rpx;
			padding: 20rpx 50rpx;
			border-radius: 20rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

      .user-info{
        display: flex;
				align-items: center;
      }
			.user-avatar {
				width: 100rpx;
				height: 100rpx;
				border-radius:50%;
				flex-shrink: 0;
			}

			.user-details {
				margin-left: $spacing-medium;

				.user-name {
					font-size: 32rpx;
					font-weight: bold;
					color: $primary-color;
				}

				.user-expertise {
					font-size: 28rpx;
					color: $secondary-color;
				}
			}
		}

		.evaluation-content{
			background: #fff;
			margin: 10rpx 30rpx 30rpx;
			padding: 20rpx 50rpx;
			border-radius: 20rpx;
			box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
			.evaluation-item{
				margin: 20rpx 0;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.tags-select{
				border-radius: 20rpx;
				margin: 20rpx 0;
			}
			.evaluation-btn{
				display: flex;
				justify-content: flex-end;
				margin: 20rpx 0;
				.evaluation-btn-text{
					color: #fff;
					background: v-bind(colorType);
					padding: 20rpx 50rpx;
					border-radius: 50rpx;
				}
			}
		}
	}
}
.anonymous{
	padding: 10rpx 0;
	display: flex;
	color: #9E9E9E;
	view{
		margin-left: 10rpx;
	}
}
::v-deep uni-textarea{
	width: 100%;
}
::v-deep .uni-textarea-wrapper{
	background-color: #F6F6F6 !important;
	border-radius: 20rpx;
}
::v-deep .uni-textarea-textarea{
	padding: 20rpx !important;
}
::v-deep .uni-checkbox-input{
	border-radius: 50%;
	width: 30rpx;
	height: 30rpx;
}
</style>