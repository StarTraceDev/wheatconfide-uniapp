<!-- 倾听师 -->
<template>
	<view class="consult-detail-box">
		<scroll-view scroll-y class="scroll-content" @scroll="onPageScroll" :scroll-top="top" :show-scrollbar="false">
			<uni-nav-bar :backgroundColor="scrollTop>15?'#fff':'transparent'" :border="false"
				:title="scrollTop>15?consultantInfo.consultantName:''" class="header-bar" :statusBar="true" fixed>
				<template v-slot:left>
					<view class="right">
						<uni-icons type="left" size="24" v-if="scrollTop>15" @click="backFn"></uni-icons>
						<image src="@/static/common/back_circle.png" style="width: 56rpx;height: 56rpx;" @click="backFn"
							v-else></image>
					</view>
				</template>
				<template v-slot:right>
					<view class="right">
						<image src="@/static/confide/share.png" style="width: 40rpx;height: 40rpx;" v-if="scrollTop>15">
						</image>
						<image src="@/static/common/share_circle.png" style="width: 56rpx;height: 56rpx;" v-else>
						</image>
					</view>
				</template>
			</uni-nav-bar>
			<view class="consult-detail-content">
				<view class="swiper-content">
					<view class="uni-margin-wrap">
						<swiper class="swiper" circular :indicator-dots="true" :autoplay="true" :interval="5000"
							:duration="500">
							<swiper-item v-for="(item,index) in JSON.parse(consultantInfo.gallery)" :key="index" class="swiper-item">
								<image :src="item" style="height: 590rpx;" mode="heightFix"></image>
							</swiper-item>
						</swiper>
					</view>
				</view>
				<view class="consult-detail-info">
					<view class="detail-item-line-1">
						<view class="name">
							<text class="name-a">{{consultantInfo.name}}</text>
							<!-- <text class="name-b">{{consultantInfo.major}}</text> -->
							<!-- <text class="name-c">{{consultantInfo.age}}</text> -->
						</view>
						<!-- <view class="money"><text
								class="num">{{consultantInfo.consultantPrice}}</text><text>元/50分钟</text></view> -->
					</view>
					<view class="detail-item-line-2">
						<text>{{consultantInfo.certificateList[0].name}} |  {{consultantInfo.major}} | {{consultantInfo.constellation}}</text>
					</view>
					<view class="detail-item-line-3">
						<view class="address">
							<image src="/static/common/address.png"></image>
							<text>{{consultantInfo.address}}</text>
						</view>
						<view class="txt">
							<view>
								<text class="voice">语音咨询</text> | <text class="quick">最快可约最近3天</text> <uni-icons
									type="right" size="14" color="#35CA95"></uni-icons>
							</view>
						</view>
					</view>

					<view class="detail-item-line-4">
						<view class="content">
							<view class="list">
								<!-- <view class="item" v-for="i in 10" :key="i"> -->
								<view class="item">
									<view>
										<text class="num">{{consultantInfo.workTime}}</text>
										<text class="unit">年</text>
									</view>
									<view class="txt">从业年限</view>
								</view>
							</view>
							<view class="tips">
								<image src="/static/common/follwer.png"></image>
								<text class="txt">服务经验</text>
							</view>
						</view>
					</view>

					<view class="detail-item-line-5" id="tabs" :class="fixedActive?'tabsFixed':''">
						<view class="tabs">
							<view class="tab-item" v-for="(item,index) in tabsList" :key="index"
								:class="tabIndex==index?'active':''" @click="tabChangeFn(item,index)">{{item.label}}
							</view>
						</view>
					</view>

					<view class="detail-item-line-6 tab6" id="tab-1">
						<view class="content">
							<view class="title">个人简介</view>
							<view class="info">{{consultantInfo.profile}}</view>
						</view>
					</view>

					<view class="detail-item-line-6 detail-item-line-7 tab7" id="tab-2">
						<view class="content">
							<view class="title">擅长领域</view>
							<view class="info">
								<view style="display: flex;flex-direction: row;flex-wrap: wrap;">
									<!-- <view class="detail-title">人际交往</view>
									<view class="detail-content">沟通不畅、社交恐惧、社交技巧、人际冲突、不合群、
										人际边界、社会适应难、信任危机、设有关系</view> -->
									<text style="padding: 5rpx 15rpx;background-color: bisque;border-radius: 8rpx;margin-right: 10rpx;margin-bottom: 10rpx;" v-for="item,index in consultantInfo.serviceTypes">
										{{item}}
									</text>
								</view>
							</view>

						<!-- 	<view class="title">擅长疗法</view>
							<view class="tags">
								<text class="tag-item">沙盘疗法</text>
								<text class="tag-item">心理动力取向</text>
								<text class="tag-item">心理动力取向</text>
							</view> -->

						</view>
					</view>

					<view class="detail-item-line-6 detail-item-line-8 tab8" id="tab-3">
						<view class="content">
							<view class="info">
								<view class="certificate-detail" v-for="(item,index) in consultantInfo.certificateList" :key="index">
									<view class="tag">{{item.type}}</view>
									<view class="tag-info">
										<view class="tag-title">{{item.name}}</view>
										<view class="certificate-info">
											<view>发证机构：{{item.authority}} </view>
											<view>发证时间：{{item.date}} </view>
											<view>证书编号：{{item.number}}</view>
										</view>
									</view>
								</view>
								<!-- <view class="eduication-detail">
									<view class="tag">学历</view>
									<view class="tag-info">
										<view class="tag-title">山东大学</view>
										<view class="eduication-info">
											<view>发证机构：国家心理培训 </view>
											<view>发证时间：2025-02-05 </view>
											<view>证书编号：45478121548151548415125</view>
										</view>
									</view>
								</view> -->
								<view class="step-detail" style="display: none;">
									<view class="training">
										<view class="training-title">伦理培训</view>
										<view class="training-timer">2项培训，累计40小时</view>
									</view>
									<view class="step-box">
										<uni-steps :options="stepList" active-color="#35CA95" :active="stepActive"
											direction="column" />
									</view>
								</view>
							</view>
						</view>
						<!-- <view class="more">查看更多</view> -->
					</view>

					<view class="detail-item-line-6 detail-item-line-9 tab9" id="tab-4" style="display: none;">
						<view class="content">
							<view class="title">咨询感受</view>
							<view class="info">
								<view class="feel-type-box" @click="openEvaluate">
									<view class="feel-type" v-for="i in 10" :key="i">
										<view class="txt">恋爱压力</view>
										<view class="num">250</view>
									</view>
								</view>

								<view class="comment-list">
									<view class="comment-item" v-for="i in 10" :key="i">
										<view class="comment-item-header">
											<view class="user">
												<image src="/static/my/profile.png"></image>
												<text>匿名 | 压抑心理</text>
											</view>
											<view class="date">2023-01-01</view>
										</view>
										<view class="comment-item-content">
											<mote-lines-divide :line="3" expandText="展开" foldHint="收起">
												测试测试测试测试测试测试测试213121312试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试
											</mote-lines-divide>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view class="detail-item-line-6 detail-item-line-10 tab10" id="tab-5" @click="openPopupFn" style="display: none;">
						<view class="content">
							<view class="title">可约时间<text class="remark">（北京时间）</text></view>
							<view class="info">
								<view class="txt">如果暂时无法确定具体的咨询时间，可以在预约成功后，再与咨询师协商具体时间。</view>

								<view class="order-timer-box">
									<view class="order-timer-item" v-for="(item,index) in orderLists"
										:class="item.active?'active':''">
										<view class="month">{{item.month}}月</view>
										<view class="day">{{item.day}}</view>
										<view class="week">{{item.week}}</view>
										<view class="isOrder">已满</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view class="detail-item-line-6 detail-item-line-11 tab11">
						<view class="content">
							<view class="title">预约须知<view>
									<view class="info">
										<view>1、咨询为预约服务，您可选择咨询师可约时段下单，每次咨询50分钟或60分钟。</view>

										<view>2、订单支付成功后，您的预约需咨询师确认是否接受，确认后将短信通知您。</view>

										<view>3、咨询方式有面对面、视频、电话、文字四种，具体以咨询师展示的可选方式为准。</view>

										<view>4、因不可抗力因素变更时间或取消咨询预约，请提前24小时告知咨询师。</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="footer">
			<view class="follow">
				<image src="@/static/common/follow.png"></image>
				<text>关注</text>
			</view>
			<view class="contact">
				<image src="@/static/common/contect.png"></image>
				<text>客服</text>
			</view>
			<view class="message" @click="toChat">
				<text class="txt">私信ta</text>
			</view>
			<view class="reservation" @click="openPopupFn">
				<text>预约咨询</text>
				<text class="remark">（语音/视频）</text>
			</view>
		</view>

		<uni-popup ref="popup" type="bottom" border-radius="20rpx 20rpx 0 0">
			<view class="popup-box">
				<view class="popup-header">
					<view class="title">选择咨询时段<text class="remark">（北京时间）</text></view>
					<view class="msg">暂不选择咨询时间，可在下单后与咨询师协商时间</view>
				</view>
				<view class="popup-content">
					<view class="order-timer-box">
						<scroll-view scroll-x="true" class="order-timer-content" :show-scrollbar="false">
							<view class="order-timer-item" v-for="(item,index) in 10">
								<view class="week">周一</view>
								<view class="date">05-13</view>
								<view class="isOrder">可约</view>
							</view>
						</scroll-view>
					</view>

					<view class="datetime-box">
						<view class="title">上午</view>
						<view class="datetime-item">
							<text class="txt" v-for="(item,index) in 5" :key="index">08:45-09:15</text>
						</view>
					</view>
					<view class="datetime-box afternoon-datetime-box">
						<view class="title">下午</view>
						<view class="datetime-item">
							<text class="txt" v-for="(item,index) in 9" :key="index">13:45-14:15</text>
						</view>
					</view>
				</view>
				<view class="popup-footer">
					<view class="msg">
						<view class="date">5月13日(周三) | 08:45-10:15</view>
						<view class="name">咨询师：张三</view>
					</view>
					<view class="confirm" @click="toPay">确认预约</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		nextTick,
		onMounted,
		ref,
	} from 'vue';
	import { onLoad,onBackPress } from '@dcloudio/uni-app'
	import {
		useGlobalDataStore
	} from '@/stores/global.js';
	import {
		getConsultantById
	} from "@/common/api/consultant.js";
	import {
		useRoute
	} from 'vue-router'; // 引入路由钩子
	import MoteLinesDivide from "@/components/mote-lines-divide/mote-lines-divide"
	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');

	const scrollTop = ref(0);
	const tabIndex = ref(0);
	const tabsOffsetTop = ref(0);
	const top = ref(0);
	const detailOffset5 = ref(0);
	const detailOffset6 = ref(0);
	const detailOffset7 = ref(0);
	const detailOffset8 = ref(0);
	const detailOffset9 = ref(0);
	const detailOffset10 = ref(0);
	const fixedActive = ref(false);
	const popup = ref(null);
	const tabId = ref("#tab-1");

	const consultantInfo = ref({
		consultantName: '',
		gallery:''
	});
	// 获取路由实例，用于获取参数
	const route = useRoute();
	
	onLoad((options) => {
		getConsultantInfo(options.id)
		
	})
	onMounted((e) => {
		nextTick(() => {
			uni.createSelectorQuery().in(this).select(".detail-item-line-5").boundingClientRect((data) => {
				detailOffset5.value = data;
			}).exec();
			uni.createSelectorQuery().in(this).select(".tab6").boundingClientRect((data) => {
				detailOffset6.value = data;
			}).exec();
			uni.createSelectorQuery().in(this).select(".tab7").boundingClientRect((data) => {
				detailOffset7.value = data;
			}).exec();
			uni.createSelectorQuery().in(this).select(".tab8").boundingClientRect((data) => {
				detailOffset8.value = data;
			}).exec();
			uni.createSelectorQuery().in(this).select(".tab9").boundingClientRect((data) => {
				detailOffset9.value = data;
			}).exec();
			uni.createSelectorQuery().in(this).select(".tab10").boundingClientRect((
				data) => {
				detailOffset10.value = data;
			}).exec();

		})
	});
	const backFn = () => {
		uni.navigateBack({
			delta: 1
		})
	}
	const onPageScroll = (e) => {
		scrollTop.value = e.detail.scrollTop;
		fixedActive.value = e.detail.scrollTop >= detailOffset5.value.top - 120;

		if (scrollTop.value < detailOffset7.value.top - globalStore.statusBarHeight - 184) {
			tabIndex.value = 0;
		} else if (scrollTop.value > detailOffset7.value.top - globalStore.statusBarHeight - 184 && scrollTop.value <
			detailOffset8.value.top - globalStore.statusBarHeight - 184) {
			tabIndex.value = 1;
		} else if (scrollTop.value > detailOffset8.value.top - globalStore.statusBarHeight - 184 && scrollTop.value <
			detailOffset9.value.top - globalStore.statusBarHeight - 184) {
			tabIndex.value = 2;
		} else if (scrollTop.value > detailOffset9.value.top - globalStore.statusBarHeight - 184 && scrollTop.value <
			detailOffset10.value.top - globalStore.statusBarHeight - 154) {
			tabIndex.value = 3;
		} else if (scrollTop.value > detailOffset10.value.top - globalStore.statusBarHeight - 154) {
			tabIndex.value = 4;
		}
	}
	const tabChangeFn = (option, index) => {
		if (tabIndex.value != index) {
			tabIndex.value = index;
			if (option.id == "tab-1") {
				top.value = detailOffset6.value.top - globalStore.statusBarHeight - 174;
			} else if (option.id == "tab-2") {
				top.value = detailOffset7.value.top - globalStore.statusBarHeight - 174;
			} else if (option.id == "tab-3") {
				top.value = detailOffset8.value.top - globalStore.statusBarHeight - 174;
			} else if (option.id == "tab-4") {
				top.value = detailOffset9.value.top - globalStore.statusBarHeight - 174;
			} else if (option.id == "tab-5") {
				top.value = detailOffset10.value.top - globalStore.statusBarHeight - 144;
			}
		}
	}
	const tabsList = ref([{
		label: "个人简介",
		id: "tab-1",
		class: "tab6"
	}, {
		label: "擅长领域",
		id: "tab-2",
		class: "tab7"
	}, {
		label: "受训经历",
		id: "tab-3",
		class: "tab8"
	}, {
		label: "咨询感受",
		id: "tab-4",
		class: "tab9"
	}, {
		label: "预约时间",
		id: "tab-5",
		class: "tab10"
	}])

	const stepList = ref([{
		title: '2024.10-2024.12',
		desc: '国家二级咨询师，注册系统咨询师'
	}, {
		title: '2024.10-2024.12',
		desc: '国家二级咨询师，注册系统咨询师'
	}, {
		title: '2024.10-2024.12',
		desc: '国家二级咨询师，注册系统咨询师'
	}, {
		title: '2024.10-2024.12',
		desc: '国家二级咨询师，注册系统咨询师'
	}])


	const orderLists = ref([{
		month: 5,
		day: 11,
		week: "周一",
		active: true
	}, {
		month: 5,
		day: 12,
		week: "周二",
		active: false
	}, {
		month: 5,
		day: 13,
		week: "周三",
		active: true
	}, {
		month: 5,
		day: 14,
		week: "周四",
		active: false
	}, {
		month: 5,
		day: 15,
		week: "周五",
		active: true
	}, {
		month: 5,
		day: 16,
		week: "周六",
		active: false
	}, {
		month: 5,
		day: 17,
		week: "周日",
		active: true
	}]);

	const stepActive = ref(stepList.value.length);

	const openPopupFn = () => {
		popup.value.open();
	}

	const openEvaluate = () => {
		uni.navigateTo({
			url: "/pages/consult-feel/consult-feel"
		})
	}

	/**
	 * 获取详情
	 */
	const getConsultantInfo = async (id) => {
		let res = await getConsultantById({
			id: id
		});
		
		consultantInfo.value = res.data;
		console.log(consultantInfo.value);
	}
	
	const toChat = () => {
		console.log(consultantInfo.value);
		uni.navigateTo({
			url: "/pages/message/private-chat?to="+consultantInfo.value.userId+"&name="+consultantInfo.value.consultantName
		})
	}
	
	const toPay = () => {
		uni.navigateTo({
			url: "/pages/payment/payment"
		})
	}
</script>

<style lang="scss" scoped>
	.consult-detail-box {
		$statusBarHeight: v-bind(statusBarHeight);
		width: 100vw;
		min-height: 100vh;
		height: auto;
		background-color: #F4F6F8;

		.scroll-content {
			height: calc(100vh - 108rpx);

			.consult-detail-content {
				width: 100vw;
				position: absolute;
				top: 0px;

				.header {
					.header-bar {
						::v-deep(.uni-nav-bar-text) {
							font-size: 32rpx;
							font-weight: 600;
							color: #fff;
						}
					}
				}

				.headerActive {
					background-color: #fff;
				}
			}

			.consult-detail-content {

				.swiper-content {
					.uni-margin-wrap {
						width: 100vw;
						height: 590rpx;

						.swiper {
							width: 100vw;
							height: 590rpx;

							.swiper-item {
								width: 100vw;
								height: 590rpx;
								backdrop-filter: blur(133px);
							}

							::v-deep .uni-swiper-dots {
								bottom: 100rpx !important;

								.uni-swiper-dot {
									width: 6px;
									height: 3px;
									border-radius: 3px;
									background: rgba(255, 255, 255, 0.16);
								}

								.uni-swiper-dot-active {
									background: #FFFFFF;
								}

							}
						}
					}
				}

				.consult-detail-info {
					width: 100vw;
					background: linear-gradient(180deg, #D4FFF0 0%, #F4F6F8 3%);
					height: auto;
					border-top-right-radius: 40rpx;
					border-top-left-radius: 40rpx;
					margin-top: -60rpx;
					position: relative;
					z-index: 1;

					.detail-item-line-1 {
						padding: 32rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;

						.name {
							font-size: 48rpx;
							font-weight: 500;
							line-height: 48rpx;
							color: #000000;
							display: flex;
							align-items: center;

							.name-a,
							.name-b,
							.name-c {
								margin-right: 12rpx;
							}

							.name-b {
								font-size: 22rpx;
								font-weight: 500;
								line-height: 11px;
								letter-spacing: normal;
								color: #1F2641;
								border-radius: 18rpx;
								background: #F9EAC2;
								padding: 8rpx 16rpx;
							}

							.name-c {
								border-radius: 18rpx;
								background: #DFE1F7;
								font-size: 22rpx;
								font-weight: 500;
								line-height: 22rpx;
								color: #000000;
								padding: 8rpx 16rpx;
							}
						}

						.money {
							font-size: 20rpx;
							line-height: 20rpx;
							color: #FA5151;

							.num {
								font-size: 48rpx;
								font-weight: normal;
								line-height: 48rpx;
								color: #FA5151;
							}
						}
					}

					.detail-item-line-2 {
						font-size: 26rpx;
						line-height: 26rpx;
						padding: 0rpx 32rpx;
						color: rgba(0, 0, 0, 0.85);

						text:not(:last-of-type)::after {
							position: relative;
							width: 2rpx;
							content: '1';
							height: 24rpx;
							background-color: rgba(0, 0, 0, 0.85);
						}
					}

					.detail-item-line-3 {
						display: flex;
						justify-content: space-between;
						padding: 0rpx 32rpx;
						margin-top: 24rpx;

						.address {
							display: flex;
							align-items: center;

							image {
								width: 28rpx;
								height: 28rpx;
							}

							text {
								font-size: 24rpx;
								line-height: 24rpx;
								color: rgba(0, 0, 0, 0.6);
								font-weight: 600;
								padding-left: 10rpx;
							}
						}

						.txt {
							font-size: 26rpx;
							font-weight: normal;
							line-height: 40rpx;
							letter-spacing: normal;
							color: rgba(0, 0, 0, 0.65);

							.quick {
								color: #35CA95;
							}
						}
					}

					.detail-item-line-4 {
						display: flex;
						justify-content: center;
						margin-top: 40rpx;

						.content {
							width: 686rpx;
							height: 182rpx;
							border-radius: 16rpx;
							background: #FFFFFF;
							box-sizing: border-box;
							border: 0.5px solid rgba(53, 202, 149, 0.4);
							box-shadow: 0px 4px 10px 0px rgba(149, 132, 95, 0.1);
							padding: 0rpx 32rpx;
							position: relative;
							-ms-overflow-style: none;
							overflow: -moz-scrollbars-none;

							.tips {
								position: absolute;
								left: 0px;
								top: 0px;
								width: 154rpx;
								height: 42rpx;
								/* 自动布局 */
								display: flex;
								justify-content: center;
								align-items: center;
								background: linear-gradient(270deg, #9CFAD9 0%, #D7FFF1 95%);
								border-top-left-radius: 16rpx;

								image {
									width: 32rpx;
									height: 32rpx;
								}

								text {
									font-size: 22rpx;
									line-height: 32rpx;
									letter-spacing: 0px;
									color: rgba(0, 0, 0, 0.85);
								}
							}

							.list {
								padding: 0rpx 36rpx;
								display: flex;
								height: 100%;
								flex-wrap: nowrap;
								overflow-x: scroll;
								scrollbar-width: none;
								/* Firefox */
								-ms-overflow-style: none;
								/* IE 和 Edge */

								.item {
									text-align: center;
									padding-top: 74rpx;

									flex-shrink: 0;

									.num {
										font-size: 36rpx;
										color: #000000;
										font-weight: 600;
									}

									.unit {
										font-size: 20rpx;
										color: rgba(0, 0, 0, 0.85);
									}

									.txt {
										font-size: 22rpx;
										color: rgba(0, 0, 0, 0.5);
									}
								}

								.item:not(:last-of-type) {
									margin-right: 60rpx;
								}
							}
						}

					}

					.detail-item-line-5 {
						margin-top: 60rpx;
						display: flex;
						justify-content: center;

						.tabs {
							width: 686rpx;
							display: flex;
							flex-wrap: nowrap;
							overflow-x: scroll;
							scrollbar-width: none;
							/* Firefox */
							-ms-overflow-style: none;

							/* IE 和 Edge */
							.tab-item {
								flex-shrink: 0;
								font-size: 32rpx;
								font-weight: normal;
								line-height: 32rpx;
								letter-spacing: normal;
								color: #687581;
								position: relative;
								height: 68rpx;
								display: flex;
								justify-content: center;

							}

							.tab-item:not(:last-of-type) {
								margin-right: 30rpx;
							}

							.active {
								color: #212528;
								font-size: 32rpx;
								font-weight: 600;

								&::after {
									position: absolute;
									border-radius: 4px;
									background: linear-gradient(270deg, #EAFFF7 0%, #35CA95 100%);
									height: 8rpx;
									width: 40rpx;
									content: '';
									bottom: 0rpx;
								}
							}
						}
					}

					.tabsFixed {
						width: 100vw;
						position: fixed;
						top: calc($statusBarHeight + 20rpx);
						background: #fff;
						z-index: 1;
						left: 0;
						height: 128rpx;
						display: flex;
						align-items: center;
					}

					.detail-item-line-6 {
						margin-top: 60rpx;
						width: 100vw;

						display: flex;
						justify-content: center;

						.content {
							width: 686rpx;
							height: auto;
							background-color: #fff;
							border-radius: 20rpx;
							padding-top: 32rpx;

							.title {
								font-size: 30rpx;
								font-weight: 500;
								line-height: 30rpx;
								color: #212528;
								padding-left: 28rpx;
							}

							.info {
								font-size: 26rpx;
								font-weight: normal;
								line-height: 42rpx;
								letter-spacing: normal;
								color: rgba(0, 0, 0, 0.5);
								padding: 28rpx;
							}
						}
					}

					.detail-item-line-7 {
						.content {
							padding: 40rpx 0rpx;

							.info {
								.detail {
									width: 576rpx;
									height: auto;
									border-radius: 12px;
									background: rgba(53, 202, 149, 0.1);
									padding: 24rpx 26rpx;

									.detail-title {
										font-size: 26rpx;
										font-weight: 500;
										line-height: 26rpx;
										letter-spacing: 0px;
										color: #35CA95;
									}

									.detail-content {
										font-size: 24rpx;
										line-height: 36rpx;
										letter-spacing: 0px;
										color: rgba(0, 0, 0, 0.5);
										margin-top: 28rpx;
									}
								}

							}

							.tags {
								display: flex;
								padding-left: 28rpx;
								margin-top: 40rpx;

								.tag-item {
									border-radius: 8px;
									/* 自动布局 */
									background: rgba(53, 202, 149, 0.102);
									font-size: 26rpx;
									letter-spacing: 0px;
									color: #35CA95;
									padding: 14rpx 20rpx;
									margin-right: 20rpx;
								}
							}
						}
					}

					.detail-item-line-8 {
						.content {
							max-height: 932rpx;
							overflow: hidden;

							.info {

								.certificate-detail,
								.eduication-detail {
									display: flex;
									align-items: start;

									.tag {
										width: 52rpx;
										height: 30rpx;
										border-radius: 4rpx;
										background: #ECECFD;
										text-align: center;
										line-height: 30rpx;
										font-size: 22rpx;
										color: #4838F5;
									}

									.tag-info {
										line-height: 1;
										margin-left: 12rpx;

										.tag-title {
											font-size: 30rpx;
											font-weight: 500;
											color: #212528;
										}

										.certificate-info,
										.eduication-info {
											margin-top: 28rpx;
											font-size: 26rpx;
											font-weight: normal;
											line-height: 44rpx;
											letter-spacing: 0px;
											color: rgba(0, 0, 0, 0.5);

										}
									}
								}

								.eduication-detail {
									margin-top: 66rpx;

									.tag {
										background: #FFF0DA;
										color: #EB9516;
									}
								}

								.step-detail {
									margin-top: 60rpx;

									.training {
										display: flex;

										.training-title {
											width: 116rpx;
											height: 40rpx;
											border-radius: 4rpx;
											display: flex;
											background: #E5FDF5;
											font-size: 26rpx;
											color: #35CA95;
											text-align: center;
										}

										.training-timer {
											background: #F2FAF7;
											display: inline;
											padding: 2rpx 8rpx;
											font-size: 26rpx;
											color: #212528;
											margin-left: 10rpx;
											border-radius: 4px;
										}
									}

									.step-box {
										::v-deep .uni-steps__column-text {
											border: none !important;

											// padding-top: 0rpx !important;
											.uni-steps__column-title {
												font-size: 22rpx;
												font-weight: normal;
												color: rgba(0, 0, 0, 0.5);

											}

											.uni-steps__column-desc {
												font-size: 26rpx;
												font-weight: normal;
												color: rgba(0, 0, 0, 0.65) !important;
											}
										}
									}
								}
							}
						}

						.more {
							font-size: 24rpx;
							color: #35CA95;
							text-align: center;
						}
					}

					.detail-item-line-9 {
						.content {
							.info {
								.feel-type-box {
									display: flex;
									flex-wrap: wrap;
									line-height: 1;

									.feel-type {
										flex-shrink: 0;
										width: 200rpx;
										height: 88rpx;
										border-radius: 10rpx;
										display: flex;
										flex-direction: column;
										justify-content: center;
										align-items: center;
										background: #F5FFFB;
										margin-left: 8rpx;
										margin-top: 16rpx;

										.txt {
											font-size: 24rpx;
											font-weight: normal;
											letter-spacing: 0px;
											color: rgba(0, 0, 0, 0.65);
										}

										.num {
											font-size: 22rpx;
											font-weight: normal;
											text-align: center;
											color: rgba(0, 0, 0, 0.35);
											margin-top: 16rpx;
										}
									}

								}

								.comment-list {
									.comment-item:not(:last-child) {
										border-bottom: 1px solid rgba(0, 0, 0, 0.04);
									}

									.comment-item {
										padding-bottom: 32rpx;
										margin-top: 44rpx;

										.comment-item-header {
											display: flex;
											justify-content: space-between;

											.user {
												display: flex;
												align-items: center;

												image {
													width: 48rpx;
													height: 48rpx;
												}

												text {
													margin-left: 14rpx;
													font-size: 24rpx;
													letter-spacing: 0px;
													color: rgba(0, 0, 0, 0.65);
												}
											}

											.date {
												font-size: 24rpx;
												font-weight: normal;
												color: rgba(0, 0, 0, 0.35);

											}
										}

										.comment-item-content {
											margin-top: 22rpx;
										}
									}
								}
							}
						}
					}

					.detail-item-line-10 {
						.remark {
							font-size: 22rpx;
							font-weight: normal;
							letter-spacing: 0px;
							color: rgba(0, 0, 0, 0.5);
						}

						.info {
							.txt {
								font-size: 22rpx;
								color: rgba(0, 0, 0, 0.5);
							}

							.order-timer-box {
								display: flex;
								flex-wrap: nowrap;

								.order-timer-item {
									flex-shrink: 0;
									text-align: center;
									width: 90rpx;

									.month {
										font-size: 20rpx;
										color: rgba(0, 0, 0, 0.5);
									}

									.day {
										font-size: 36rpx;
										color: rgba(0, 0, 0, 0.85);
									}

									.week {
										font-size: 24rpx;
										color: rgba(0, 0, 0, 0.85);
									}

									.isOrder {
										width: 80rpx;
										height: 80rpx;
										border-radius: 4rpx;
										background: #F4F6F8;
										font-weight: 500;
										color: rgba(0, 0, 0, 0.3);
										line-height: 80rpx;
										text-align: center;
										margin-top: 14rpx;
									}
								}

								.active {

									.month,
									.day,
									.week,
									.isOrder {
										color: #35CA95 !important;
									}

									.isOrder {
										background: rgba(53, 202, 149, 0.102);
									}
								}
							}
						}
					}

					.detail-item-line-11 {
						margin-top: 20rpx;

						.content {
							background-color: transparent;

							.title {
								text-align: center;
								position: relative;
								color: rgba(0, 0, 0, 0.6);
								font-size: 28rpx;
							}

							.title:before {
								content: '';
								position: absolute;
								width: 258rpx;
								height: 2rpx;
								background-color: rgba(0, 0, 0, 0.06);
								top: 15rpx;
								left: 0;
							}

							.title:after {
								content: '';
								position: absolute;
								width: 258rpx;
								height: 2rpx;
								background-color: rgba(0, 0, 0, 0.06);
								top: 15rpx;
								right: 0;
							}

							.info {
								font-size: 22rpx;
								color: rgba(0, 0, 0, 0.5);
								text-align: left;

								view {
									margin-top: 20rpx;
								}
							}
						}

					}
				}
			}
		}

		.footer {
			width: 100vw;
			height: 108rpx;
			/* 自动布局 */
			display: flex;
			background: #FFFFFF;
			position: fixed;
			bottom: 0rpx;
			justify-content: space-around;
			align-items: center;

			.follow,
			.contact {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-size: 18rpx;
				color: rgba(0, 0, 0, 0.6);

				image {
					width: 36rpx;
					height: 36rpx;
				}
			}

			.message {
				.txt {
					color: #35CA95;
					font-size: 32rpx;
					border-radius: 48rpx;
					border: 1px solid #35CA95;
					padding: 22rpx 74rpx;
					line-height: 1;
				}
			}

			.reservation {
				color: #FFFFFF;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 240rpx;
				height: 88rpx;
				border-radius: 44rpx;
				background: #35CA95;

				.remark {
					font-size: 20rpx;
				}
			}
		}

		.popup-box {
			width: 750rpx;
			height: 1142rpx;
			opacity: 1;
			background: linear-gradient(180deg, #E7FCF4 0%, #F4F6F8 16%);
			line-height: 1;
			border-radius: 20rpx 20rpx 0 0;

			.popup-header {
				height: 192rpx;
				border-bottom: 1px solid rgba(0, 0, 0, 0.04);
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding-left: 40rpx;

				.title {
					color: #000000;
					font-size: 36rpx;

					.remark {
						font-size: 26rpx;
						color: rgba(0, 0, 0, 0.65);
					}
				}

				.msg {
					color: #35CA95;
					font-size: 26rpx;
					margin-top: 20rpx;
				}
			}

			.popup-content {
				margin-top: 32rpx;

				.order-timer-box {
					width: 750rpx;
					display: flex;
					height: 204rpx;
					justify-content: center;
					border-bottom: 1px solid rgba(0, 0, 0, 0.04);

					.order-timer-content {
						display: flex;
						width: 670rpx;

						::v-deep .uni-scroll-view-content {
							display: flex;
							flex-direction: row;
						}

						.order-timer-item {
							flex-shrink: 0;
							width: 120rpx;
							height: 140rpx;
							border-radius: 10rpx;
							background: #EFFBF7;
							box-sizing: border-box;
							border: 1px solid #35CA95;
							text-align: center;
							line-height: normal;
							display: flex;
							flex-direction: column;
							justify-content: center;
							margin-right: 28rpx;

							.week {
								color: rgba(0, 0, 0, 0.6);
								font-size: 30rpx;
							}

							.date {
								color: rgba(0, 0, 0, 0.65);
								font-size: 24rpx;
							}

							.isOrder {
								font-size: 22rpx;
								color: #35CA95;
							}
						}
					}
				}

				.datetime-box {
					padding: 0rpx 40rpx;

					.title {
						font-size: 28rpx;
						color: rgba(0, 0, 0, 0.65);
						margin-top: 28rpx;
					}

					.datetime-item {
						display: flex;
						flex-wrap: wrap;
						justify-content: space-between;

						.txt {
							background-color: #fff;
							padding: 14rpx 24rpx;
							border-radius: 40px;
							flex-shrink: 0;
							margin-top: 20rpx;
							color: rgba(0, 0, 0, 0.85);
							font-size: 28rpx;
						}
					}

					.datetime-item:after {
						content: "";
						width: 100px;
					}
				}

				.afternoon-datetime-box {
					margin-top: 56rpx;
				}
			}

			.popup-footer {
				display: flex;
				justify-content: space-around;
				background-color: #fff;
				position: fixed;
				width: 750rpx;
				height: 108rpx;
				bottom: 0;
				align-items: center;

				.msg {
					.date {
						font-size: 26rpx;
						color: rgba(0, 0, 0, 0.85);
					}

					.name {
						font-size: 24rpx;
						color: rgba(0, 0, 0, 0.5);
						margin-top: 8rpx;
					}
				}

				.confirm {
					width: 240rpx;
					height: 88rpx;
					border-radius: 44rpx;
					display: flex;
					background: #35CA95;
					align-items: center;
					justify-content: center;
					color: #fff;
					font-size: 32rpx;
				}
			}
		}
	}
</style>