<template>
	<view style="padding: 30rpx;">
		<text>个人设置</text>
		<view style="background-color: white;border-radius: 18rpx;margin-top: 15rpx;">
			<view class="menu-item" @click="gotoPersonSettingPage">
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
	
	const gotoPersonSettingPage = ()=>{
		uni.navigateTo({
			url: "/pages/forum/my/userInfo"
		})
	}
	
	const gotoServiceSettingPage = ()=>{
		uni.navigateTo({
			url:"/pages/settings/services"
		})
	}
</script>

<style lang="scss">
	page{
		background-color: #f6f6f6;
	}
	.menu-item{
		padding: 15rpx 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>