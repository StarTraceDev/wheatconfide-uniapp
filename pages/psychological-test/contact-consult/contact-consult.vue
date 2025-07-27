<template>
	<view class="contact-consult-box">
		<uni-nav-bar :backgroundColor="'#F4F6F8'" :border="false" title="联系咨询师" class="header-bar" :statusBar="true"
			fixed>
			<template v-slot:left>
				<uni-icons type="left" size="24" @click="backFn"></uni-icons>
			</template>
		</uni-nav-bar>

		<view class="contact-consult-content">
			<view class="contact-consult-list">
				<view class="contact-consult-item" v-for="i in 20" :key="i">
					<view class="item-content">
							<image src="/static/consult/user.png" class="img"></image>
						<view class="content">
							<view class="name">张三</view>
							<view class="desc">北京 | 二级心理咨询师</view>
						</view>
					</view>

				</view>
			</view>

		</view>
	</view>
</template>

<script setup>
	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}
</script>

<style lang="scss" scoped>
	.contact-consult-box {
		height: 100%;
		background: #f4f6f8;
		width: 750rpx;

		.contact-consult-content {
			margin-top: 40rpx;
			.contact-consult-list {
				width: 750rpx;
				display: flex;
				justify-content: center;
				flex-direction: column;
				align-items: center;
				.contact-consult-item {
					width: 686rpx;
					height: 128rpx;
					border-radius: 12rpx;
					background: #FFFFFF;
					
					.item-content {
						display: flex;
						align-items: center;
						padding: 0rpx 32rpx;
                        height: 100%;
						.img {
							width: 88rpx;
							height: 88rpx;
						}

						.content {
							margin-left: 20rpx;

							.name {
								font-size: 28rpx;
								font-weight: 500;
								color: rgba(0, 0, 0, 0.85);
							}

							.desc {
								font-size: 22rpx;
								color: rgba(0, 0, 0, 0.35);
								margin-top: 8rpx;
							}
						}
					}
					&:not(:first-child){
						margin-top: 20rpx;
					}

				}
			}
		}
	}
</style>