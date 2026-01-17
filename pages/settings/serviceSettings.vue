<template>
	<view style="padding: 30rpx;">
		<text>个人设置</text>
		<view class="menu">
			<view class="menu-item" style="border-bottom: 1rpx solid #e6e6e6;" @click="gotoPersonSettingPage">
				<text>基本资料</text>
				<u-icon name="arrow-right"></u-icon>
			</view>
			<view class="menu-item" @click="gotoServiceSettingPage">
				<text>服务资料</text>
				<view>
					<text style="font-size: 26rpx;color: #868686;">服务类型，资质证书</text>
				<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

const serviceType = ref(null)
onLoad((options) => {
	serviceType.value = JSON.parse(options.type);
})

// 跳转
const gotoPersonSettingPage = ()=>{
	const { id, userRole } = serviceType.value
	uni.navigateTo({
		url: `/pages/forum/my/userInfo?type=${userRole}&userInfo=${JSON.stringify(id)}`
	})
}
	
const gotoServiceSettingPage = ()=>{
	const { id, userRole } = serviceType.value
	uni.navigateTo({
		url: `/pages/forum/service/auth?type=${userRole}&userInfo=${JSON.stringify(id)}`
	})
}
</script>

<style lang="scss">
	page{
		background-color: #f6f6f6;
	}
	.menu{
		background-color: white;
		border-radius: 18rpx;
		margin-top: 15rpx;
		&-item{
			padding: 30rpx 30rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
		}
	}
</style>