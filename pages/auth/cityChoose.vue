<template>
	<view class="introScroll">
		<view class="topView">
			<!-- 城市搜索输入框 -->
			<!-- <view class="serchView">
				<view class="serch">
					<image class="serchIconImage"
						src="/static/app-plus/image/center/centertool/shopRecruit/img_search_logo.png"></image>
					<input @input="cityInputListener" adjust-position="false" class="serchInput"
						placeholder="输入城市名称进行搜索" type="text" />
				</view>
			</view> -->
			<!-- 定位城市-标题 -->
			<view class="nowCityTextTipsView">
				<view class="nowLocationCity">当前地区：<text>北京市</text></view>
				<view class="address">
					<image src="/static/auth/current-address.png" class="img"></image>自动定位
				</view>
			</view>
			<!-- 定位城市-内容 -->
			<!-- <view class="againLocationView">
				<text class="loactionText">{{nowCity}}</text>
				<text class="loactionStatusText">{{locationStatus}}</text>
				<image :animation="animation" @click="locationImageClick" class="refreshImage"
					src="/static/app-plus/image/index/refreshIcon.png"></image>
			</view> -->
		</view>
		<!-- 右侧字母 -->
		<view class='city_right'>
			<text class='letter_item' v-for='(item,index) in letter' :key='index'
				@tap.stop='letterTap(index)'>{{item}}</text>
		</view>
		<scroll-view scroll-with-animation="true" class="cityListView" scroll-y="true" :scroll-into-view="scrollId"
			:show-scrollbar="false">
			<!-- 城市列表 -->
			<view class="forCityView">
				<view class="forCityItem" v-for="(item,index) in allCityList" :key="index">
					<view v-if="item.show" :id="item.letter" class="letterItemFirst">{{item.letter}}</view>
					<text @click="cityItemClick(index)" class="itemCityContent">{{item.city}}</text>
					<view v-if="!item.last" class="line"></view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
	import cityJson from '@/static/city-json/city-list'
	export default {
		data() {
			return {
				nowCity: '',
				locationStatus: '定位成功',
				letter: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R",
					"S", "T",
					"W", "X", "Y", "Z"
				],
				//热门城市
				hotCityList: [],
				//全部城市
				allCityList: [],
				//滑动到指定位置
				scrollId: '',
				//动画
				animation: {},
				//接口请求的数据
				cityList: []
			}
		},

		onLoad(options) {
			//设置title标题
			this.nowCity = '北京'
			//获取全国城市
			this.getCityList()
		},

		methods: {
			//拼音点击事件
			letterTap(index) {
				console.log(index)
				if (this.letter[index] == '热') {
					this.scrollId = 're'
				} else {
					this.scrollId = this.letter[index]
				}
			},

			//搜索
			cityInputListener(e) {
				let value = e.detail.value
				let cityAll = this.allCityList
				let newArray = []
				for (let i = 0; i < cityAll.length; i++) {
					if (cityAll[i].city.indexOf(value) != -1 || cityAll[i].letter == value.toUpperCase()) {
						newArray.push(cityAll[i])
					}
				}
				if (value == '') {
					this.formatCityData(this.cityList)
				} else {
					this.formatCityData(newArray)
				}
			},

			//定位
			locationImageClick() {
				var that = this
				this.animation = uni.createAnimation()
				this.animation.rotate(360).step()
				this.animation = this.animation.export()
				this.locationStatus = '定位中...'
				uni.getLocation({
					geocode: true, // 是否解析地址信息（返回详细格式化地址信息）
					success: res => {
						// 获取当前位置坐标
						if (res.address != undefined) {
							that.nowCity = res.address.city;
							that.locationStatus = '定位成功'
						}
					},
					fail: res => {
						that.nowCity = '获取定位信息失败'
						console.log("获取定位信息失败");
					}
				});

			},

			//获取城市列表	
			getCityList() {
				this.cityList = cityJson
				this.formatCityData(cityJson)
			},

			formatCityData: function(array) {
				for (let i = 0; i < array.length; i++) {
					if (i == 0) {
						//第一条显示首字母
						array[i].show = true
					} else if (array[i].letter != array[i - 1].letter) {
						//首字母与上一条不一样需要显示
						array[i].show = true
						array[i - 1].last = true
					}
					if (array.length == 1) {
						array[0].last = true
					}
					array.show = false
				}
				this.allCityList = array
			},

			//城市条目点击
			cityItemClick(index) {
				var data = this.allCityList[index]
				console.log(data);
				// uni.$emit('data', data);
				uni.setStorageSync("verifyAddress",data.city)
				uni.navigateBack({
					delta: 1,
				})
			},

		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: #fff;
	}

	.introScroll {
		height: 100%;
		width: 100%;
		display: flex;
		position: relative;
	}

	.topView {
		display: flex;
		flex-direction: column;
		position: fixed;
		z-index: 99;
		width: 100%;
	}

	.serchView {
		width: 100%;
		height: 110rpx;
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
		align-items: center;
		justify-content: center;
	}

	.serch {
		width: 690rpx;
		height: 70rpx;
		background: #F7F7F7;
		border-radius: 35rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.serchIconImage {
		width: 30rpx;
		height: 26rpx;
		margin-left: 30rpx;
	}

	.serchInput {
		height: 70rpx;
		width: 600rpx;
		margin-left: 12rpx;
		font-size: 30rpx;
		color: #000000;
	}

	.nowCityTextTipsView {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		width: 100%;
		padding-bottom: 14rpx;


		.address {
			font-size: 24rpx;
			color: #35CA95;
			display: flex;
			align-items: center;
			padding: 32rpx;

			.img {
				width: 25rpx;
				height: 25rpx;
			}
		}
	}

	.nowLocationCity {
		line-height: 50rpx;
		font-size: 28rpx;
		color: #999999;
		padding-left: 32rpx;
	}

	.againLocationView {
		height: 88rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
		width: 100%;
		background-color: #FFFFFF;
	}

	.loactionText {
		font-size: 30rpx;
		color: #129DFF;
		margin-left: 30rpx;
	}

	.loactionStatusText {
		margin-left: 50rpx;
		font-size: 30rpx;
		color: #999999;
	}

	.refreshImage {
		position: absolute;
		right: 48rpx;
		padding: 10rpx;
		width: 38rpx;
		height: 38rpx;
	}

	.cityListView {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 100rpx - 88rpx);
		margin-top: 100rpx;
		position: relative;
		overflow: scroll;
	}

	.city_right {
		z-index: 99;
		width: 60rpx;
		display: flex;
		height: 100%;
		position: absolute;
		right: 0;
		flex-direction: column;
		justify-content: center;
	}

	.letter_item {
		display: block;
		font-size: 20rpx;
		color: #666;
		text-align: center;
		padding-left: 20rpx;
		padding-top: 3rpx;
		padding-bottom: 3rpx;
		font-weight: bold;
	}

	.hotCityTips {
		margin-left: 30rpx;
		margin-top: 30rpx;
		font-size: 30rpx;
		color: #999999;
	}

	.new_city_box {
		margin-top: 26rpx;
		display: flex;
		flex-wrap: wrap;
		padding: 0 60rpx 0 20rpx;
	}

	.new_city_text {
		width: 114rpx;
		text-align: center;
		font-size: 24rpx;
		line-height: 42rpx;
		color: #333;
		background: #fff;
		border-radius: 21rpx;
		margin: 0 10rpx 20rpx 10rpx;
	}

	.forCityView {
		width: 100%;
		padding-bottom: 30rpx;
	}

	.forCityItem {
		display: flex;
		flex-direction: column;
	}

	.letterItemFirst {
		height: 49rpx;
		padding-left: 40rpx;
		font-size: 30rpx;
		line-height: 49rpx;
		color: #000;
		background: #f7f7f7;
		width: 100%;
	}

	.itemCityContent {
		display: inline-block;
		width: 100%;
		height: 88rpx;
		font-size: 28rpx;
		color: rgba(0, 0, 0.65);
		padding-left: 40rpx;
		background-color: #FFFFFF;
		line-height: 88rpx;
	}

	.line {
		width: 642rpx;
		height: 1rpx;
		background-color: #ebebeb;
		margin-left: 40rpx;
	}
</style>