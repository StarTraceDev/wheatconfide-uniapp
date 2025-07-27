<!-- 倾听师 -->
<template>
	<view class="consult-detail-box">
		<scroll-view scroll-y class="scroll-content" @scroll="onPageScroll" :scroll-top="top" :show-scrollbar="false">
			<uni-nav-bar :backgroundColor="scrollTop>15?'#fff':'transparent'" :border="false"
				:title="scrollTop>15?consultantInfo.consultantName:''" class="header-bar" :statusBar="true" fixed>
				<template v-slot:left>
					<view class="right">
						<uni-icons type="left" size="24" v-if="scrollTop>15" @click="backFn"></uni-icons>
						<image @click="backFn" src="@/static/common/back_circle.png" style="width: 56rpx;height: 56rpx;"
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
							<swiper-item v-for="i in 6" :key="i" class="swiper-item">
							</swiper-item>
						</swiper>
					</view>
				</view>
				<view class="consult-detail-info">
					<view class="detail-item-line-1">
						<view class="name">
							<text class="name-a">{{consultantInfo.consultantName}}</text>
							<text class="name-b">{{consultantInfo.major}}</text>
							<!-- <text class="name-c">90后</text> -->
						</view>
						<view class="money">
							<image src="/static/common/yellow-follow.png" class="img"></image>
							<text class="txt">关注</text>
						</view>
					</view>
					<view class="detail-item-line-2">
						<text>{{consultantInfo.address}} | {{consultantInfo.education}} | 80后 | {{consultantInfo.constellation}}</text>
					</view>
					<view class="detail-item-line-3">
						倾听师寄语倾听师寄语倾听师寄语倾听师寄语。
					</view>

					<view class="detail-item-line-4">
						<view class="content">
							<view class="list">
								<view class="item" v-for="i in 10" :key="i">
									<view>
										<text class="num">3</text>
										<text class="unit">年</text>
									</view>
									<view class="txt">从业年限</view>
								</view>
							</view>
							<view class="tips">
								<image src="/static/common/follwer-yellow.png"></image>
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


					<view class="detail-item-line-6 tab5" id="tab-1">
						<view class="tab5-content">
							<view class="info">
								<view class="voice-box">
									<view class="voice-info">
										<view class="title">语音咨询<text class="money">250</text><text
												class="unit">元/50分钟</text></view>
										<view class="txt">仅提供语音消息，咨询效果有一定影响</view>
									</view>
									<view class="voice-img">
										<image src="/static/common/voice.png" class="img"></image>
									</view>
								</view>
								<view class="voice-box text-box">
									<view class="voice-info">
										<view class="title">文字咨询<text class="money">250</text><text
												class="unit">元/50分钟</text></view>
										<view class="txt">擅长个人成长、情绪管理</view>
									</view>
									<view class="voice-img">
										<image src="/static/common/message.png" class="img"></image>
									</view>
								</view>
								<view class="menu-box">倾诉套餐<text class="txt">隐私保护·效果可见·99%好评率</text></view>
								<view class="voice-box voice-text-box">
									<view class="voice-info">
										<view class="title">语音+文字咨询<text class="money">250</text><text
												class="unit">元/50分钟</text></view>
										<view class="txt">有效期：20天</view>
									</view>
									<view class="voice-img">
										<image src="/static/common/voice-txt.png" class="img"></image>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view class="detail-item-line-6 tab6" id="tab-2">
						<view class="content">
							<view class="title">个人介绍</view>
							<view class="info">
								二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤，树立自信二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤，树立自信二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤，树立自信二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤，树立自信二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤，树立自信二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤，树立自信二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤，树立自信二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤，树立自信二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长二级心理咨询师，教师，巨蟹座。擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤擅长帮助来访者抚平创伤，树立自信，促进个人成长进个人成长进个人成长进个人成长进个.成长进个
								擅长帮助来访者抚平创伤，树立自信</view>
						</view>
					</view>



					<view class="detail-item-line-6 detail-item-line-8 tab7" id="tab-3">
						<view class="content">
							<view class="info">
								<view class="certificate-detail">
									<view class="tag">资质</view>
									<view class="tag-info">
										<view class="tag-title">国家二级咨询师</view>
										<view class="certificate-info">
											<view>发证机构：国家心理培训</view>
											<view>发证时间：2025-02-05 </view>
											<view>证书编号：45478121548151548415125</view>
										</view>
									</view>
								</view>
								<view class="eduication-detail">
									<view class="tag">学历</view>
									<view class="tag-info">
										<view class="tag-title">本科</view>
										<view class="eduication-info">
											<view></view>
											<view>发证时间：2025-02-05 </view>
											<view>证书编号：45478121548151548415125</view>
										</view>
									</view>
								</view>
								<view class="step-detail">
									<view class="training">
										<view class="training-title">伦理培训</view>
										<view class="training-timer">2项培训，累计40小时</view>
									</view>
									<view class="step-box">
										<uni-steps :options="stepList" active-color="#EB9516" :active="stepActive"
											direction="column" />
									</view>
								</view>
							</view>
						</view>
						<!-- <view class="more">查看更多</view> -->
					</view>

					<view class="detail-item-line-6 detail-item-line-7 tab8" id="tab-4">
						<view class="content">
							<view class="title">擅长领域</view>
							<view class="info">
								<view class="detail">
									<view class="detail-title">人际交往</view>
									<view class="detail-content">沟通不畅、社交恐惧、社交技巧、人际冲突、不合群、
										人际边界、社会适应难、信任危机、设有关系</view>
								</view>
							</view>

							<view class="title">擅长疗法</view>
							<view class="tags">
								<text class="tag-item">沙盘疗法</text>
								<text class="tag-item">心理动力取向</text>
								<text class="tag-item">心理动力取向</text>
							</view>

						</view>
					</view>

					<view class="detail-item-line-6 detail-item-line-9 tab9" id="tab-5">
						<view class="content">
							<view class="title">
								<view class="txt">评价<text>(24)</text></view>
								<view class="more" @click="openEvaluate">查看更多真实评价<uni-icons type="right" size="12"
										color="rgba(0, 0, 0, 0.5)"></uni-icons></view>
							</view>
							<view class="info">
								<view class="feel-type-box">
									<view class="first">
										<view class="percent">99<text class="txt">%好评率</text></view>
									</view>
									<view class="second">
										<view class="second-item">
											<text class="txt-1">真实评价</text>
											<text class="txt-2">788条</text>
										</view>
										<view class="second-item">
											<text class="txt-1">用户推荐</text>
											<text class="txt-2">100%</text>
										</view>
									</view>
								</view>

								<view class="comment-list">
									<view class="comment-item" v-for="i in 10" :key="10">
										<view class="user-box">
											<view class="user-info">
												<image src="/static/my/profile.png" class="img"></image>
												<text class="txt">匿名</text>
											</view>
											<view class="star"><uni-rate :disabled="true" disabledColor="#FFC300"
													:value="5" size="12" /></view>
										</view>
										<view class="comment-content">
											评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容评论内容
										</view>
										<view class="tags">
											<text class="tag-item">亲切温暖</text>
											<text class="tag-item">亲切温暖</text>
											<text class="tag-item">亲切温暖</text>
										</view>
										<view class="theme-date">
											<view class="theme">
												咨询主题:<text class="txt">心理压抑</text>
											</view>
											<view class="date">2025-06-04</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="footer">
			<view class="message">
				私信ta
			</view>
			<view class="reservation">
				立即咨询
			</view>
		</view>


	</view>
</template>

<script setup>
	import {
		nextTick,
		onMounted,
		ref
	} from 'vue';
	import {
		useGlobalDataStore
	} from '@/stores/global.js';
	import {
		getConsultantById
	} from "@/api/consultant.js";
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
	const detailOffset5 = ref(null);
	const detailOffset6 = ref(null);
	const detailOffset7 = ref(null);
	const detailOffset8 = ref(null);
	const detailOffset9 = ref(null);
	const fixedActive = ref(false);
	const popup = ref(null);
	const tabId = ref("#tab-1");
	const consultantInfo = ref();
	const tab5 = ref(null);
	// 获取路由实例，用于获取参数
	const route = useRoute();
	onMounted(() => {
		nextTick(() => {
			uni.createSelectorQuery().in(this).select(".detail-item-line-5").boundingClientRect((data) => {
				detailOffset5.value = data;
			}).exec();
			uni.createSelectorQuery().in(this).select(".tab5").boundingClientRect((data) => {
				tab5.value = data;
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
			getConsultantInfo(route.query.id)
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
		if (scrollTop.value < detailOffset6.value.top - globalStore.statusBarHeight - 184) {
			tabIndex.value = 0;
		} else if (scrollTop.value > detailOffset6.value.top - globalStore.statusBarHeight - 184 && scrollTop.value <
			detailOffset7.value.top - globalStore.statusBarHeight - 184) {
			tabIndex.value = 1;
		} else if (scrollTop.value > detailOffset7.value.top - globalStore.statusBarHeight - 184 && scrollTop.value <
			detailOffset8.value.top - globalStore.statusBarHeight - 184) {
			tabIndex.value = 2;
		} else if (scrollTop.value > detailOffset8.value.top - globalStore.statusBarHeight - 184 && scrollTop.value <
			detailOffset9.value.top - globalStore.statusBarHeight - 154) {
			tabIndex.value = 3;
		} else {
			tabIndex.value = 4;
		}
	}
	const tabChangeFn = (option, index) => {
		console.log(option)
		if (tabIndex.value != index) {
			tabIndex.value = index;
			if (option.id == "tab-1") {
				top.value = tab5.value.top - globalStore.statusBarHeight - 174;
			} else if (option.id == "tab-2") {
				top.value = detailOffset6.value.top - globalStore.statusBarHeight - 174;
			} else if (option.id == "tab-3") {
				top.value = detailOffset7.value.top - globalStore.statusBarHeight - 174;
			} else if (option.id == "tab-4") {
				top.value = detailOffset8.value.top - globalStore.statusBarHeight - 174;
			} else if (option.id == "tab-5") {
				top.value = detailOffset9.value.top - globalStore.statusBarHeight - 144;
			}
		}
	}
	const tabsList = ref([{
		label: "服务",
		id: "tab-1",
		class: "tab6"
	}, {
		label: "介绍",
		id: "tab-2",
		class: "tab7"
	}, {
		label: "经历",
		id: "tab-3",
		class: "tab8"
	}, {
		label: "擅长",
		id: "tab-4",
		class: "tab9"
	}, {
		label: "评价(24)",
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

	const openEvaluate = () => {
		uni.navigateTo({
			url: "/pages/evaluate/evaluate"
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
		console.log(res)
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
					background: linear-gradient(180deg, #FFE3B0 0%, #F4F6F8 1%);
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
							font-size: 24rpx;
							line-height: 20rpx;
							color: #EB9516;
							display: flex;
							flex-direction: row;
							align-items: center;

							.img {
								width: 38rpx;
								height: 32rpx;
							}

							.txt {
								padding-left: 10rpx;
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
						padding: 0rpx 32rpx;
						margin-top: 24rpx;
						font-size: 26rpx;
						color: rgba(0, 0, 0, 0.85);
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
							border: 1rpx solid #EB9516;
							box-shadow: 0rpx 8rpx 20rpx 0rpx rgba(149, 132, 95, 0.1);
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
								background: linear-gradient(270deg, #FDD496 0%, #FCF6EC 95%);
								border-top-left-radius: 16rpx;

								image {
									width: 20rpx;
									height: 20rpx;
									padding-right: 10rpx;
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
							justify-content: space-between;

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
									background: linear-gradient(270deg, #FCF1E1 0%, #EB9516 100%);
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

					.tab5 {
						margin-top: 20rpx;

						.tab5-content {
							.info {
								padding: 0;

								.voice-box {
									display: flex;
									background: #F8F9FE;
									box-sizing: border-box;
									border: 0.5px solid rgba(0, 0, 0, 0.3);
									width: 686rpx;
									height: 160rpx;
									align-items: center;
									border-radius: 16rpx;
									justify-content: space-between;
									padding: 0rpx 32rpx;
									margin-top: 20rpx;

									.voice-info {
										.title {
											font-size: 32rpx;
											font-weight: 500;
											color: #000000;

											.money {
												color: #FA5151;
												font-size: 40rpx;
												padding: 0rpx 8rpx 0rpx 16rpx;
											}

											.unit {
												color: #FA5151;
												font-size: 20rpx;
											}
										}

										.txt {
											color: rgba(0, 0, 0, 0.5);
											font-size: 24rpx;
										}
									}

									.voice-img {
										.img {
											height: 76rpx;
											width: 76rpx;
										}

									}
								}


								.menu-box {
									font-size: 32rpx;
									font-weight: 500;
									color: #000000;
									margin-top: 68rpx;

									.txt {
										color: rgba(0, 0, 0, 0.5);
										font-size: 22rpx;
									}

								}

								.voice-text-box {
									box-shadow: 0px 8rpx 20rpx 0px rgba(53, 202, 149, 0.1);
									box-sizing: border-box;
									border: 1rpx solid #EB9516;
									background: #FAF5EC;
								}
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
									background: rgba(235, 149, 22, 0.1);
									padding: 24rpx 26rpx;

									.detail-title {
										font-size: 26rpx;
										font-weight: 500;
										line-height: 26rpx;
										letter-spacing: 0px;
										color: #EB9516;
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
									background: rgba(235, 149, 22, 0.1);
									font-size: 26rpx;
									letter-spacing: 0px;
									color: #EB9516;
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
						padding-bottom: 60rpx;

						.content {
							.title {
								display: flex;
								justify-content: space-between;
								align-items: center;

								.txt {
									text {
										font-size: 24rpx;
										color: rgba(0, 0, 0, 0.5);
									}
								}

								.more {
									color: rgba(0, 0, 0, 0.5);
									font-size: 22rpx;
									display: flex;
									align-items: center;
									padding-right: 32rpx;
								}
							}

							.info {
								.feel-type-box {
									width: 630rpx;
									height: 100rpx;
									border-radius: 10rpx;
									/* 自动布局 */
									display: flex;
									background: #FDF9F0;
									align-items: center;

									.first {
										width: 272rpx;
										position: relative;
										padding-left: 32rpx;

										.percent {
											font-size: 48rpx;
											font-weight: bold;
											color: #B17940;
										}

										.txt {
											font-size: 24rpx;
											color: #B17940;
											font-weight: 400;
										}
									}

									.first::after {
										content: '';
										position: absolute;
										width: 2rpx;
										height: 54rpx;
										background: rgba(0, 0, 0, 0.04);
										right: 0;
										top: 0;
									}

									.second {
										display: flex;

										.second-item {
											display: flex;
											flex-direction: column;

											.txt-1 {
												font-size: 22rpx;
												color: rgba(0, 0, 0, 0.3);
											}

											.txt-2 {
												font-size: 26rpx;
												color: rgba(0, 0, 0, 0.85);
											}
										}

										.second-item:first-child {
											margin-left: 68rpx;
											margin-right: 48rpx;
										}
									}
								}

								.comment-list {
									margin-top: 32rpx;

									.comment-item:not(:last-child) {
										border-bottom: 1px solid rgba(0, 0, 0, 0.04);
									}

									.comment-item {
										padding-bottom: 32rpx;
										margin-top: 32rpx;

										.user-box {
											display: flex;
											justify-content: space-between;

											.user-info {
												display: flex;
												align-items: center;

												.img {
													width: 48rpx;
													height: 48rpx;
												}

												.txt {
													font-size: 24rpx;
													color: rgba(0, 0, 0, 0.65);
													padding-left: 14rpx;
												}
											}
										}

										.comment-content {
											font-size: 26rpx;
											line-height: 40rpx;
											color: rgba(0, 0, 0, 0.65);
											margin-top: 22rpx;
										}

										.tags {
											margin-top: 12rpx;

											.tag-item {
												padding: 6rpx 8rpx;
												border: 0.8rpx solid rgba(0, 0, 0, 0.2);
												margin-right: 8rpx;
												background: #FFFFFF;
												box-sizing: border-box;
												border-radius: 4rpx;
												font-size: 20rpx;
												color: rgba(0, 0, 0, 0.5);
											}
										}

										.theme-date {
											margin-top: 36rpx;
											display: flex;
											justify-content: space-between;

											.theme {
												color: rgba(0, 0, 0, 0.5);
												font-size: 24rpx;

												.txt {
													color: rgba(0, 0, 0, 0.65);
												}
											}

											.date {
												color: rgba(0, 0, 0, 0.35);
												font-size: 24rpx;
											}
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


			.message,
			.reservation {
				width: 300rpx;
				height: 88rpx;
				border-radius: 44rpx;
				/* 自动布局 */
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 32rpx;
				color: #EB9516;
				border: 1px solid #EB9516;
			}

			.reservation {
				background: #EB9516;
				border: none;
				color: #fff;
			}
		}
	}
</style>