<template>
	<view class="consult-box">
		<scroll-view class="scroll-content" scroll-y :scroll-top="scrollTop" @scroll="onScroll" scroll-with-animation
			style="height: 100vh;">
			<view class="search-content" :class="fixed ? 'activeClass' : ''">
				<view class="search">
					<uni-search-bar radius="100" placeholder="请输入咨询师或问题类型" clearButton="auto" cancelButton="none"
						@confirm="searchFn" />
				</view>
				<view class="contact">
					<image src="/static/my/contect.png"></image>
					<text>客服</text>
				</view>
			</view>

			<view class="operate-box">
				<view class="operate-content">
					<view class="operate-left">
						<view class="find-teacher">
							<view class="teach-1">寻找倾听师</view>
							<view class="teach-2">为你寻找适合的咨询师</view>
							<view class="teach-3">了解详情<uni-icons type="right" size="10" color="#35CA95" />
								<image class="find-teacher-image" src="/static/consult/find-teacher-image.png"></image>
							</view>
						</view>
					</view>
					<view class="operate-right">
						<view class="try-consult">
							<view class="txt-1">试咨询</view>
							<view class="txt-2" style="color: #F0AE45;">即时咨询<uni-icons type="right" size="10"
									color="#F0AE45" /></view>
							<image class="try-consult-image" src="/static/consult/try-consult-image.png"></image>
						</view>
						<view class="free-consult">
							<view class="txt-1">免费咨询</view>
							<view class="txt-2" style="color: #E8746E;">即时咨询<uni-icons type="right" size="10"
									color="#E8746E" /></view>
							<image class="free-consult-image" src="/static/consult/free-consult-image.png"></image>
						</view>
					</view>
				</view>
			</view>

			<!-- 吸顶区域 -->
			<u-sticky offset-top="50" @fixed="fixedTop" @unfixed="unFixedTop">
				<view id="stickyBox">
					<view class="filter-box">
						<view class="filter-box-1">
							<view style="display: flex;flex-direction: row;flex:1;">
								<view class="filter-box-1-item" style="margin-right: 15rpx;" @click="showBox(1)">
									困扰<uni-icons type="down" size="12" class="icon" />
								</view>
								<view class="filter-box-1-item" style="margin-right: 15rpx;"
									:style="{color:searchParams.city?'#35C996':'black'}" @click="showBox(2)">
									城市<uni-icons type="down" size="12" class="icon"
										:color="searchParams.city?'#35C996':'black'" /></view>
								<view class="filter-box-1-item" @click="showBox(3)">价格<uni-icons type="down" size="12"
										class="icon" /></view>
							</view>
							<view style="display: flex;flex-direction: row;">
								<view class="filter-box-1-item" style="margin-right: 15rpx;" @click="showBox(4)">筛选
									<image src="/static/consult/filter.png" style="width: 32rpx;height: 32rpx;"
										class="filter icon"></image>
								</view>
								<view class="filter-box-1-item">
									<image src="/static/consult/order.png" style="width: 32rpx;height: 32rpx;"
										class="order"></image>
								</view>
							</view>
						</view>
						<view class="filter-box-2" v-if="searchParams.serviceTypes.length>0 || searchParams.city">
							<scroll-view class="scroll-tags" scroll-x>
								<view style="display: flex;flex-direction: row;">
									<u-tag :text="item.name" v-for="(item,index) in searchParams.serviceTypes"
										shape="circle" style="margin-right: 15rpx;"
										v-if="searchParams.serviceTypes.length>0" closeable
										@close="closeTag(index)"></u-tag>
									<u-tag v-if="searchParams.city" shape="circle" closeable @close="closeCityTag" :text="searchParams.city"></u-tag>
								</view>
							</scroll-view>
						</view>
					</view>
				</view>
			</u-sticky>

			<view class="doctor-list">
				<view class="doctor-item" v-for="(item,index) in data.list" :key="index" @click="openDetail(item)">
					<view class="doctor-auture">
						<image src="/static/consult/user.png"></image>
					</view>
					<view class="doctor-info">
						<view class="doctor-info-1">
							<view class="name">{{item.name}}</view>
							<view class="date">今天20:00可约</view>
						</view>
						<view class="doctor-info-1">
							<view class="job">{{item.major}}</view>
							<view class="address">
								<image src="/static/consult/address.png"></image>
								<text>{{item.address}}</text>
							</view>
						</view>
						<view class="doctor-info-1">
							<view class="exprise">
								<text>1700+</text> 小时经验 <text>{{item.experience}}</text> 从业<text>
									{{item.evaluateNum}}+ </text>评价
							</view>
						</view>
						<view class="doctor-info-1">
							<view class="point-list" v-if="item.serviceType">
								<view class="point-item" v-for="(sub,index2) in item.serviceType.split(',')"
									:key="index2">
									{{sub}}
								</view>
							</view>
						</view>
						<view class="doctor-info-1">
							<view class="discount">5节起立减200元</view>
							<view class="price"><text class="unit">¥</text>{{item.consultantPrice}}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 下拉弹窗 + 遮罩 -->
		<view v-if="showFilterBox" class="mask" @click="closeFilter">
			<view class="filter-popup" @click.stop>
				<!-- <view class="popup-header">筛选条件 {{ currentFilter }}</view> -->
				<view class="popup-body">
					<linkage-selector @update:selected="changeServiceType" :categories="serviceTypes" />
				</view>
				<view class="popup-footer">
					<button class="btn btn-reset" size="mini" @click="resetOption(1)">重置选项</button>
					<button class="btn btn-confirm" size="mini" @click="closeFilter(1)">确定</button>
				</view>
			</view>
		</view>
		<view v-if="showCityBox" class="mask" @click="closeCityFilter">
			<view class="filter-popup" @click.stop>
				<!-- <view class="popup-header">筛选条件 {{ currentFilter }}</view> -->
				<view class="popup-body">
					<single-linage-selector ref="citySelector" @update:selected="changeCity"
						:categories="allCity"></single-linage-selector>
				</view>
				<view class="popup-footer">
					<button class="btn btn-reset" size="mini" @click="resetOption(2)">重置选项</button>
					<button class="btn btn-confirm" size="mini" @click="closeFilter(2)">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import LinkageSelector from '@/components/LinkageSelector.vue'
	import SingleLinageSelector from '@/components/SingleLinageSelector.vue'
	import {
		ref,
		reactive,
		getCurrentInstance,
		nextTick,
		onMounted
	} from 'vue'
	import {
		getConsultantList,
		consultMenus
	} from '@/common/api/consultant.js'
	import {
		cities
	} from '@/common/api/apis.js'
	import {
		useGlobalDataStore
	} from '@/stores/global.js'

	const globalStore = useGlobalDataStore()
	const scrollTop = ref(0)
	const showFilterBox = ref(false)
	const showCityBox = ref(false)
	const citySelector = ref(null)

	const closeTag = (index) => {
		searchParams.value.serviceTypes.splice(index, 1)
		getList()
	}
	
	const closeCityTag = ()=>{
		city.value = null
		searchParams.value.city = null
		getList()
		
	}
	const fixed = ref(false)
	const data = reactive({
		listParams: {
			current: 1,
			size: 10
		},
		list: []
	})

	const selectedServiceTypes = ref([])
	const changeServiceType = (e) => {
		selectedServiceTypes.value = e
	}

	const searchParams = ref({
		serviceTypes: [],
		city: ''
	})

	const allCity = ref([])

	// const state = reactive({
	// 	serviceTypes: [],
	// })


	const resetOption = (type) => {
		if (type === 2 && citySelector.value) {
			citySelector.value.reset() // 调用子组件重置方法
		}
	}
	const serviceTypes = ref([])

	const closeCityFilter = () => {
		showCityBox.value = false
	}
	// ---- 数据格式化函数 ----
	const normalizeChildren = (children, groupName, groupId) => {
		if (!children) return []
		if (typeof children === 'string') {
			try {
				children = JSON.parse(children)
			} catch {
				children = []
			}
		}
		// 保证返回数组，且子项包含必需字段
		return (children || []).map(child => ({
			name: child.name || '',
			id: child.id,
			selected: false
		}))
	}

	const changeCity = (e) => {
		if (e.length > 0) {
			city.value = e[0].name
		} else {
			city.value = null
		}
	}

	// 监听吸顶事件
	const fixedTop = () => {
		fixed.value = true
	}
	const unFixedTop = () => {
		fixed.value = false;
		scrollTop.value = 0
	}
	const instance = getCurrentInstance() // ✅ 在顶层声明
	const proxy = instance?.proxy // ✅ 安全引用
	const currentScroll = ref(0)
	const currentFilter = ref(null)

	const city = ref('')
	/**
	 * 点击筛选框
	 * 如果未吸顶，则先滚动到吸顶位置
	 */
	const showBox = async (type) => {
		currentFilter.value = type
		if (!fixed.value) {
			await nextTick()
			const query = uni.createSelectorQuery().in(proxy) // ✅ 用 proxy
			query.select('#stickyBox').boundingClientRect()
			query.selectViewport().scrollOffset()
			query.exec((res) => {
				if (!res || !res[0]) return
				const boxTop = res[0].top
				// const scrollOffset = res[1].scrollTop
				const scrollOffset = currentScroll.value
				scrollTop.value = scrollOffset + boxTop - 50 // 修正 offset-top
				console.log(scrollTop.value);
				setTimeout(() => {
					openFilter(type)
				}, 300)
			})
		} else {
			openFilter(type)
		}
	}

	// 打开筛选弹窗（这里你可以替换为自定义弹窗逻辑）
	const openFilter = (type) => {
		console.log('打开筛选弹窗，类型：', type)
		// TODO: 打开筛选框视图
		switch (type) {
			case 1:
				showFilterBox.value = true
				break;
			case 2:
				showCityBox.value = true
				break
		}

	}
	// 同步 scrollTop 和实际滚动位置
	const onScroll = (e) => {
		currentScroll.value = e.detail.scrollTop
	}
	const searchFn = () => {}
	const openDetail = (item) => {
		uni.navigateTo({
			url: "/pages/consult/detail?id=" + item.id
		})
	}

	const getList = async () => {
		let params = {
			...data.listParams,...searchParams.value
		}
		const res = await getConsultantList(params)
		data.list = res.data.records
	}
	const closeFilter = (type) => {
		showFilterBox.value = false
		showCityBox.value = false
		if (type == 1) {
			searchParams.value.serviceTypes = selectedServiceTypes.value
		} else if (type == 2) {
			searchParams.value.city = city
		}
		getList()
	}

	const visibleChildren = (group) => {
		console.log(group.data);
		return group.spread ? group.data : group.data.slice(0, 9)
	}

	const getConsultMenu = async () => {
		let resp = await consultMenus()
		console.log(resp);
		const data = resp.data || []
		const result = data.map(group => ({
			id: group.id,
			name: group.name,
			children: JSON.parse(group.children),
			spread: false
		}))

		serviceTypes.value = result
	}
	// ---- 展示逻辑 ----
	const visibleChildrenByGroup = (group) => {
		if (!group || !group.data) return []
		return group.spread ? group.data : group.data.slice(0, 9)
	}
	const toggleSpreadById = (groupId) => {
		const g = serviceTypes.value.find(x => x.id === groupId)
		if (g) g.spread = !g.spread
	}
	const toggleChildSelect = (groupId, childId) => {
		const g = serviceTypes.value.find(x => x.id === groupId)
		if (!g) return
		const c = g.data.find(x => x.id === childId)
		if (c) c.selected = !c.selected
	}

	// ---- 辅助：从 slotProps 中安全拿到 group 对象 ----
	/**
	 * 支持 slotProps.data / slotProps.item / slotProps.row / slotProps.group 等常见命名
	 * 返回 group 对象或 null
	 */
	const getGroupFromSlot = (slotProps) => {
		if (!slotProps) return null
		// slotProps 可能本身就是 group（某些组件直接传入）
		if (slotProps.name && slotProps.data) return slotProps
		// 常见字段名
		const keys = ['data', 'item', 'row', 'group']
		for (const k of keys) {
			if (slotProps[k]) return slotProps[k]
		}
		// 有些实现直接将 group 放在 slotProps[0]（不常见）：
		if (Array.isArray(slotProps) && slotProps.length > 0) return slotProps[0]
		return null
	}

	const getCityInfo = async () => {
		let resp = await cities()
		console.log(resp);
		const data = resp.data || []
		const result = data.map((group, index) => ({
			id: index + 1,
			name: group.name,
			children: JSON.parse(group.cities)
		}))
		allCity.value = result
	}

	onMounted(() => {
		getList()
		getConsultMenu()
		getCityInfo()
	})
</script>


<style lang="scss" scoped>
	.class-item {
		.child-item {
			padding: 12rpx 20rpx;
			margin-right: 15rpx;
			font-size: 26rpx;
			margin-bottom: 10rpx;
		}
	}

	.consult-box {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #F4F6F8;

		.activeClass {
			background: #fff;
		}

		$statusBarHeight: v-bind(statusBarHeight);

		.scroll-content {
			height: 100vh;
			flex: 1;
			overflow-y: auto;

			.search-content {
				display: flex;
				position: fixed;
				height: 134rpx;
				z-index: 1;
				width: 100vw;
				align-items: center;
				padding-top: calc($statusBarHeight);

				.search {
					width: 680rpx;
					height: 100%;
					display: flex;
					align-items: center;

					.uni-searchbar {
						padding: 0rpx 20rpx;
						width: 680rpx;
					}
				}

				.contact {
					display: flex;
					flex-direction: column;
					justify-content: center;

					image {
						width: 40rpx;
						height: 40rpx;
					}

					text {
						color: rgba(0, 0, 0, 0.85);
						font-size: 18rpx;
					}
				}
			}

			.operate-box {
				width: 100vw;
				height: calc($statusBarHeight + 210px);
				background: url("@/static/consult/bg.png");
				background-size: 100% 100%;
				background-repeat: no-repeat;

				.operate-content {
					display: flex;
					position: relative;
					justify-content: center;
					padding-top: calc($statusBarHeight + 67px);

					.operate-left {
						.find-teacher {
							position: relative;
							width: 334rpx;
							height: 280rpx;
							border-radius: 20rpx;
							background: linear-gradient(314deg, #D7EFEF 4%, #FDFFFD 90%);
							box-sizing: border-box;
							border: 2rpx solid #FFFFFF;
							padding: 36rpx 0rpx 0rpx 24rpx;
							line-height: 1;

							.teach-1 {
								color: rgba(0, 0, 0, 0.85);
								font-size: 28rpx;
								font-weight: 500;
							}

							.teach-2 {
								color: rgba(0, 0, 0, 0.6);
								font-size: 22rpx;
								margin-top: 12rpx;
							}

							.teach-3 {
								color: #35CA95;
								font-size: 22rpx;
								margin-top: 114rpx;
							}

							.find-teacher-image {
								position: absolute;
								width: 118rpx;
								height: 112rpx;
								right: 0rpx;
								bottom: 0rpx;
							}
						}
					}

					.operate-right {
						margin-left: 20rpx;

						.try-consult,
						.free-consult {
							position: relative;
							width: 334rpx;
							height: 130rpx;
							border-radius: 20rpx;
							/* 自动布局 */
							display: flex;
							flex-direction: column;
							justify-content: center;
							box-sizing: border-box;
							border: 2rpx solid #FFFFFF;
							padding-left: 24rpx;

							.txt-1 {
								font-size: 28rpx;
								color: #000000;
								font-weight: 500;
							}

							.txt-2 {
								font-size: 22rpx;
							}
						}

						.try-consult {
							background: linear-gradient(294deg, #FFEFD5 6%, #FFFDF5 89%);

							.try-consult-image {
								width: 82rpx;
								height: 90rpx;
								position: absolute;
								bottom: 0;
								right: 0;
							}
						}

						.free-consult {
							margin-top: 20rpx;
							background: linear-gradient(294deg, #FFF4F3 6%, #FFFBFA 89%);

							.free-consult-image {
								width: 84rpx;
								height: 88rpx;
								position: absolute;
								bottom: 0;
								right: 0;
							}
						}
					}
				}
			}

			.fixedFilter {
				position: fixed;
				top: calc(v-bind(statusBarHeight) + 134rpx);
				z-index: 1;
			}

			.filter-box {
				width: 100vw;
				background-color: #F4F6F8;
				display: flex;
				padding: 20rpx 30rpx;
				flex-direction: column;

				.filter-box-1 {
					display: flex;
					margin-right: 32rpx;

					.filter-box-1-item {
						font-size: 28rpx;
						color: rgba(0, 0, 0, 0.85);
						display: flex;
						align-items: center;
						font-weight: 500;

						.filter {
							width: 20rpx;
							height: 20rpx;
						}

						.order {
							width: 20rpx;
							height: 24rpx;
						}

						.icon {
							padding-left: 14rpx;
						}
					}
				}

				.filter-box-2 {
					overflow-x: scroll;
					display: flex;
					flex-direction: row;
					box-sizing: border-box;
					flex-wrap: nowrap;
					-ms-overflow-style: none;
					overflow: -moz-scrollbars-none;
					margin-top: 34rpx;

					/* scroll-view 要有明确的宽度 */
					.scroll-tags {
						width: 100%;
						white-space: nowrap;
						/* 关键：不换行 */
					}

					/* 内层包裹层防止挤压 */
					.tag-wrapper {
						display: inline-block;
						/* 关键 */
						padding: 0 20rpx;
					}

					.tag-wrapper u-tag {
						display: inline-block;
						margin-right: 15rpx;
					}

					.filter-box-2-item-p {
						width: 200rpx;
						border-radius: 20rpx;
						margin-right: 16rpx;
						flex-grow: 0;
						flex-shrink: 0;
						position: relative;
						padding: 20rpx 0rpx 0rpx 16rpx;

						.p-title {
							font-size: 30rpx;
							font-weight: 600;
						}

						.p-txt {
							font-size: 20rpx;
							font-weight: normal;
						}

						.logo {
							width: 80rpx;
							height: 80rpx;
							position: absolute;
							right: 0rpx;
							bottom: 0;
						}
					}

					.red {
						background: linear-gradient(360deg, #FEF1F1 -1%, #FED2D3 99%);
						color: #F76D64 !important;
					}

					.yellow {
						background: linear-gradient(360deg, #FFF8E6 -1%, #F9E8BD 99%);
						color: #EB9516 !important;
					}

					.blue {
						background: linear-gradient(360deg, #F3F8FF -1%, #C8E3FF 99%);
						color: #2990FC !important;
					}

					.green {
						background: linear-gradient(360deg, #EEFBE9 -1%, #DEFCD0 99%);
						color: #87A54A !important;
					}

					.filter-box-2-item {
						padding: 6rpx 10rpx;
						border-radius: 24rpx;
						font-size: 24rpx;
						background-color: #fff;
						flex-grow: 0;
						flex-shrink: 0;
						display: flex;
						flex-direction: column;
						margin-right: 20rpx;
						align-items: center;


					}

					.filter-box-2-item-txt {
						padding: 6rpx 10rpx;
						border-radius: 24rpx;
						color: rgba(0, 0, 0, 0.65);
						font-size: 24rpx;
						background-color: #fff;
						flex-grow: 0;
						flex-shrink: 0;
						margin-right: 20rpx;
					}

					.img {
						height: 48rpx;
						width: 48rpx;
					}

					.txt {
						font-size: 24rpx;
						color: #5F5F5F;
					}
				}

				.filter-box-2::-webkit-scrollbar {
					width: 0 !important;
					display: none;
					height: 0 !important;
					color: transparent;
					background-color: transparent;
				}
			}

			.doctor-list {
				.doctor-item {
					width: 100vw;
					background: #fff;
					display: flex;
					height: 280rpx;
					position: relative;

					.doctor-auture {
						padding-top: 32rpx;
						width: 184rpx;

						image {
							width: 132rpx;
							height: 132rpx;
							padding-left: 16rpx;
						}
					}

					.doctor-info {
						padding-top: 32rpx;
						width: 534rpx;
						line-height: 1;

						.doctor-info-1 {
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin-top: 12rpx;

							.name {
								font-size: 32rpx;
								color: rgba(0, 0, 0, 0.85);
								font-weight: 500;
							}

							.date {
								width: 168rpx;
								height: 32rpx;
								border-radius: 4rpx;
								background-color: #D8FAEE;
								color: #35CA95;
								font-size: 20rpx;
								text-align: center;
								line-height: 32rpx;
							}

							.job {
								color: rgba(0, 0, 0, 0.85);
								font-size: 24rpx;
							}

							.address {
								color: rgba(0, 0, 0, 0.4);
								font-size: 20rpx;
								display: flex;
								align-items: center;

								image {
									width: 24rpx;
									height: 24rpx;
								}
							}

							.exprise {
								color: rgba(0, 0, 0, 0.5);
								font-size: 24rpx;

								text {
									color: rgba(0, 0, 0, 0.85);
								}
							}

							.point-list {
								display: flex;

								.point-item {
									border-radius: 6rpx;
									padding: 6rpx 10rpx;
									border: 1rpx solid #B2B2B2;
									color: rgba(0, 0, 0, 0.6);
									font-size: 20rpx;
									margin-right: 20rpx;
								}
							}

							.discount {
								border-radius: 6rpx;
								padding: 6rpx 10rpx;
								border: 1rpx solid #FB6A6A;
								color: #FA5151;
								font-size: 20rpx;
							}

							.price {
								font-size: 36rpx;
								color: #FA5151;
								font-weight: 500;

								.unit {
									font-size: 20rpx;
									color: #FA5151;
									font-weight: 400;
								}
							}
						}
					}

				}

				.doctor-item:not(:last-of-type)::before {
					width: 686rpx;
					height: 1rpx;
					background: rgba(0, 0, 0, 0.08);
					position: absolute;
					content: '';
					left: 32rpx;
					bottom: 0;
				}
			}
		}
	}

	.mask {
		position: fixed;
		top: 210rpx;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 999;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		animation: fadeIn 0.3s;
	}

	/* 下拉弹窗 */
	.filter-popup {
		width: 100%;
		background: #fff;
		border-radius: 0 0 20rpx 20rpx;
		animation: slideDown 0.3s;
	}

	.popup-header {
		text-align: center;
		padding: 30rpx 0;
		font-weight: bold;
		border-bottom: 1px solid #eee;
	}

	.popup-body {
		max-height: 600rpx;
		overflow-y: auto;
		padding: 20rpx;
	}

	.popup-item {
		padding: 20rpx 0;
		border-bottom: 1px solid #f1f1f1;
	}

	.popup-footer {
		padding: 20rpx;
		text-align: center;
		display: flex;
		flex-direction: row;
	}

	.btn {
		width: 40%;
		color: #fff;
		border-radius: 10rpx;
		padding: 20rpx;
		gap: 20rpx;
	}

	.btn-confirm {
		background: #35ca95;
	}

	.btn-reset {
		background: #999999;
	}

	// @keyframes slideDown {
	//   from {
	//     transform: translateY(-100%);
	//   }
	//   to {
	//     transform: translateY(0);
	//   }
	// }
	@keyframes fadeIn {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}
</style>