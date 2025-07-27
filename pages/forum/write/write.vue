<template>
	<view class="write-box">
		<view class="write-header">
			<view class="title">每个灵魂都值得被看见</view>
			<view class="remark">出自 / 旅行社</view>
		</view>

		<view class="operate-list-box">
			<view class="operate-first">
				<view class="first-item green">
					<view class="title" @click="openPageHandler('/pages/forum/write/send-dynamics/send-dynamics')">发心事</view>
					<view class="content">此时此刻，随时记录收获爱与温暖</view>
					<image src="@/static/forum/send.svg" class="img"></image>
				</view>
				<view class="first-item yellow">
					<view class="title" @click="openPageHandler('/pages/forum/write/ask-question/ask-question')">提问题</view>
					<view class="content">7万+7万+专业咨询师为你答疑解惑</view>
					<image src="@/static/forum/qa.svg" class="img"></image>
				</view>
			</view>
			<view class="txt">写给自己的一封信</view>
			<view class="operate-second">
				<view class="second-item one">
					<view class="title" @click="openPageHandler('/pages/forum/write/write-mailbox/write-mailbox?type=old')">从前</view>
					<view class="content">写给从前的一封信</view>
				</view>
				<view class="second-item two">
					<view class="title" @click="openPageHandler('/pages/forum/write/write-mailbox/write-mailbox?type=new')">现在</view>
					<view class="content">写给现在的一封信</view>
				</view>
				<view class="second-item three">
					<view class="title" @click="openPageHandler('/pages/forum/write/write-mailbox/write-mailbox?type=future')">未来</view>
					<view class="content">写给未来的一封信</view>
				</view>
			</view>
			<view class="close">
				<uni-icons type="close" size="24" color="rgba(0,0,0,0.3)" @click="backFn"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script setup>
   
   const backFn=()=>{
	   uni.navigateBack({
		   delta:1
	   })
   }
   
   const openPageHandler=(url)=>{
	   uni.navigateTo({
	   	url
	   })
   }
</script>

<style lang="scss" scoped>
	.write-box {
		width: 750rpx;
		height: 100vh;
		background: #F4F6F8;
		.write-header {
			width: 100%;
			height: 458rpx;
			// background: linear-gradient(180deg, #00B578 0%, #F7F8FA 100%);
			background-image: url("@/static/forum/bg.png");
			background-size: 100% 100%;
			background-repeat: no-repeat;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding-left: 68rpx;

			.title {
				font-family: Xingkai SC;
				font-size: 40rpx;
				font-weight: bold;
				color: rgba(0, 0, 0, 0.85);
			}

			.remark {
				color: rgba(0, 0, 0, 0.4);
				font-size: 24rpx;
				margin-top: 22rpx;
			}
		}

		.operate-list-box {
			position: fixed;
			bottom: 66rpx;
			width: 690rpx;
			left: 30rpx;

			.operate-first {
				display: flex;
				justify-content: space-between;

				.first-item {
					width: 332rpx;
					height: 198rpx;
					border-radius: 20rpx;
					position: relative;
					overflow: hidden;

					/* 自动布局 */
					.title {
						color: #131313;
						font-size: 36rpx;
						padding: 28rpx 34rpx 0rpx 34rpx;
					}

					.content {
						color: rgba(19, 19, 19, 0.65);
						font-size: 24rpx;
						padding: 0rpx 34rpx;
					}
				}

				.green {
					background: linear-gradient(180deg, #00B578 3%, #E6FEEA 100%);
					box-shadow: 0px 8rpx 20rpx 0px rgba(53, 202, 149, 0.2);
					.img{
						width: 74rpx;
						height: 74rpx;
						bottom: -20rpx;
						position: absolute;
						right: 26rpx;
					}
				}

				.yellow {
					background: linear-gradient(180deg, #EEAF37 3%, #FFEDCF 100%);
					box-shadow: 0px 4px 10px 0px rgba(249, 194, 93, 0.2);
					.img{
						width: 100rpx;
						height: 100rpx;
						position: absolute;
						right: 26rpx;
						bottom: -40rpx;
					}
				}
			}

			.txt {
				color: rgba(0, 0, 0, 0.85);
				font-size: 26rpx;
				margin: 46rpx 0rpx;
				font-weight: 500;
			}
			.operate-second{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				.second-item{
					width: 216rpx;
					height: 120rpx;
					border-radius: 20rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					.title{
						color: #131313;
						font-size: 30rpx;
						padding: 0rpx 26rpx;
					}
					.content{
						color: rgba(19, 19, 19, 0.65);
						font-size: 20rpx;
						padding: 0rpx 26rpx;
					}
				}
				.one{
					background: linear-gradient(180deg, #7BD4EF 3%, #FFFFFF 100%);
				}
				.two{
					background: linear-gradient(180deg, #BEB8F8 3%, #FFFFFF 100%);
				}
				.three{
					background: linear-gradient(180deg, #F6E250 3%, #FFFFFF 100%);
				}
			}
			.close{
				text-align: center;
				margin-top: 60rpx;
			}
		}
	}
</style>