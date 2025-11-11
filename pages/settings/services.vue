<template>
	<view class="page">
		<u-navbar title="服务资料" :border="false">
			<template #right>
				<view class="nav-right">
					<u-button size="mini" type="success" @click="saveInfo">保存</u-button>
				</view>
			</template>
		</u-navbar>
		<u-popup mode="bottom" v-model="serviceChooseDialog" :border-radius="10">
			<view class="popup-container">
				<view class="popup-header">
					<text @click="cancelServiceDialog">取消</text>
					<text class="popup-title">服务类型</text>
					<text @click="confirmSelect" style="color: #00C38D;">确认</text>
				</view>

				<!-- 分类循环 -->
				<scroll-view style="height: 800rpx;" scroll-y>
					<view v-for="(group, gIndex) in serviceList" :key="group.id" class="service-group">
						<!-- 父级菜单 -->
						<view class="group-header">
							<view @click="changeGroupChecked(group)"><text
									:style="{color:group.checked?'red':'black'}">{{ group.name }}</text><text
									style="font-size: 26rpx;color: grey;"
									v-if="group.checked">(已选{{group.selectedList?group.selectedList.length:0}}项)</text>
							</view><!-- <u-checkbox v-model="group.checked" @change="changeSelectAll(group)" :name="group.name" shape="square"
								active-color="#00C38D">
								
							</u-checkbox> -->

							<view class="expand-toggle" v-if="group.children.length>6" @click="toggleExpand(gIndex)">
								<text>{{ group.expanded ? '收起' : '展开' }}</text>
								<u-icon :name="group.expanded ? 'arrow-up' : 'arrow-down'" size="14" />
							</view>
						</view>

						<!-- 子项（标签） -->
						<view class="tag-container" v-if="group.children">
							<view v-for="(tag, tIndex) in displayTags(group)" :key="tag.id" class="tag-item"
								:class="{ active: tag.selected }" @click.stop="toggleTag(gIndex, tIndex)">
								{{ tag.name }}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</u-popup>

		<view class="form-box">
			<!-- 上传头像 -->
			<view class="form-item upload-section">
				<view class="label">
					个人形象照
					<text class="desc">（用于个人主页封面，格式jpg/png，大小2M内）</text>
				</view>

				<u-upload :fileList="fileList" :before-upload="beforeUpload" :header="headers"
					@on-success="uploadComplete" @on-remove="deletePic" name="file" :action="uploadUrl" multiple
					:maxCount="5"></u-upload>
			</view>

			<!-- 表单信息 -->
			<view class="info-list">
				<!-- <view class="info-item" @click="chooseProfession">
          <view class="label required">职业</view>
          <view class="value">{{ form.profession }}</view>
          <u-icon name="arrow-right" size="18" color="#999" />
        </view> -->

				<view class="info-item" @click="chooseConstellation">
					<view class="label required">星座</view>
					<!-- <view class="value">{{ form.constellation }}</view>
					<u-icon name="arrow-right" size="18" color="#999" /> -->
					<picker :range="stars" @change="starChange">
						<view class="content">
							{{form.constellation==null?'请选择':form.constellation}}<uni-icons type="right" size="14"
								color="rgba(0, 0, 0, 0.3)"></uni-icons>
						</view>
					</picker>
				</view>

				<view class="info-item" @click="chooseRegion">
					<view class="label required">所在地区</view>
					<view @click="chooseArea">
						{{form.address?form.address:'请选择'}}<uni-icons type="right" size="14"
							color="rgba(0, 0, 0, 0.3)"></uni-icons>
					</view>
					<u-picker v-model="regionPicker" @confirm="confirmRegion" mode="region"></u-picker>

					<!-- <view class="value">{{ form.address }}</view>
					<u-icon name="arrow-right" size="18" color="#999" /> -->
				</view>

				<view class="info-item" @click="chooseServiceType">
					<view class="label required">服务类型</view>
					<view class="value service-type">
						{{ form.serviceTypeDesc }}
					</view>
					<u-icon name="arrow-right" size="18" color="#999" />
				</view>

				<view class="info-item" @click="editSignature">
					<view class="label">个人签名</view>
					<view class="value text-gray">
						{{ form.signature || '一句话个人签名文字' }}
					</view>
					<u-icon name="arrow-right" size="18" color="#999" />
				</view>
			</view>

			<!-- 个人简介 -->
			<view class="textarea-box">
				<view class="label">个人简介</view>
				<u-input type="textarea" v-model="form.profile" placeholder="请输入个人简介" :height="300"
					:auto-height="true"></u-input>
			</view>
		</view>

		<u-popup v-model="showEditSignature" mode="center" :border-radius="15">
			<view style="width: 600rpx;border-radius: 30rpx;padding: 10rpx;">
				<view style="text-align: center;font-size: 36rpx;margin-top: 30rpx;">编辑签名</view>
				<view>
					<u-input placeholder="请输入签名" type="textarea" v-model="form.signature" :height="200"></u-input>
				</view>
				<view>
					<button type="primary" @click="saveSignature">保存</button>
				</view>
			</view>
		</u-popup>

		<!-- 底部按钮 -->
		<!-- <view class="btn-box">
      <u-button type="primary" @click="submit" >保存</u-button>
    </view> -->
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'

	const fileList = ref([])

	import {
		onLoad
	} from '@dcloudio/uni-app'

	import {
		getUserBaseSetting
	} from '@/common/api/settings.js'

	import {
		saveRoleInfo
	} from '@/common/api/user.js'

	import {
		baseURL
	} from '@/utils/request';
	const uploadUrl = ref("")
	uploadUrl.value = baseURL+'/api/common/upload'

	const token = uni.getStorageSync('token')
	const headers = ref({
		'token': token
	})

	const saveSignature = () => {
showEditSignature.value = false
	}
	import {
		serviceTypes
	} from '@/common/api/index.js'

	const cancelServiceDialog = () => {
		
	}

	const changeGroupChecked = (group) => {
		if (group.checked) {
			group.checked = false
			group.selectedList = []
			group.children.forEach(e => {
				e.selected = false
			})
		} else {
			group.checked = true
		}
	}

	const showEditSignature = ref(false)

	const serviceChooseDialog = ref(false)
	const getAllServiceTypes = async () => {
		let resp = await serviceTypes()
		serviceList.value = resp.data
		console.log(resp.data);
		serviceList.value.forEach(group => {
			// 解析 children JSON
			group.children = JSON.parse(group.children || '[]')

			// 父级选中判断
			if (services.value.includes(String(group.id))) {
				group.checked = true
			} else {
				group.checked = false
			}

			// 子级选中判断
			group.children.forEach(child => {
				if (services.value.includes(String(child.id))) {
					if (!group.selectedList) {
						group.selectedList = []
					}
					group.selectedList.push(child)
					child.selected = true
					group.checked = true
				} else {
					child.selected = false
				}
			})
		})

	}
	const stars = ref(['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'])
	onLoad(() => {
		userSettings()

	})

	const regionPicker = ref(false)

	const chooseArea = () => {
		regionPicker.value = true
	}

	const confirmSelect = () => {
		let services = serviceList.value
		let serviceTypeDesc = ''
		let selectedServicesName = []
		let serviceType = []
		services.forEach(e => {
			if (e.checked) {
				if (e.selectedList) {
					e.selectedList.forEach(item => {
						selectedServicesName.push(item.name)
						serviceType.push(item.id)
					})
				} else {
					selectedServicesName.push(e.name)
					serviceType.push(e.id)
				}
			}
		})
		form.value.serviceType = serviceType.join(",")
		form.value.serviceTypeDesc = selectedServicesName.join(",")
		serviceChooseDialog.value = false
	}


	const confirmRegion = (e) => {
		form.value.address = e.province.name + e.city.name + e.area.name
	}

	const uploadComplete = (data, index, lists, name) => {
		if (data?.data?.url) {
			lists[index].url = data.data.url
		}

		// 转成 JSON 字符串保存到 form.gallery
		form.value.gallery = JSON.stringify(
			lists
			.map(item => item.url || (item.response?.data?.url || ''))
			.filter(url => url) // 过滤空值
		)
		console.log(form.value.gallery);
	}

	// 模拟接口返回的菜单数据（父子结构）
	const serviceList = ref([])

	// 切换展开状态
	const toggleExpand = (gIndex) => {
		serviceList.value[gIndex].expanded = !serviceList.value[gIndex].expanded
	}

	// 控制每组展示的标签
	const displayTags = (group) => {
		// console.log(group);
		if (group.children) {
			// let children = JSON.parse(group.children)
			if (group.expanded) {
				return group.children
			}
			return group.children.slice(0, 6)
		}
		return []
	}

	// 切换选中状态
	const toggleTag = (gIndex, tIndex) => {
		const group = serviceList.value[gIndex]
		const tag = group.children[tIndex]

		// 初始化选中列表
		if (!group.selectedList) {
			group.selectedList = []
		}
		if (!group.checked) {


			const groupCount = serviceList.value.filter(i => i.checked).length

			// 最多选择 5 个
			if (groupCount >= 5) {
				uni.showToast({
					title: "您最多可以选择5个分类",
					icon: "none"
				})
				return
			}
		}
		// 如果当前是未选中状态，准备选中
		if (!tag.selected) {
			// 统计所有已选中的分类
			let selectedList = group.selectedList
			if (selectedList) {
				if (selectedList.length >= 5) {
					uni.showToast({
						title: "您最多可以选择5个标签",
						icon: "none"
					})
					return
				}
			}
			tag.selected = true
			group.selectedList.push(tag)
			group.checked = true
		} else {
			// 取消选中
			tag.selected = false
			const index = group.selectedList.findIndex(item => item.id === tag.id)
			if (index !== -1) {
				group.selectedList.splice(index, 1)
			}
			// 如果该组没有选中的标签了，则取消组选中状态
			// if (group.selectedList.length === 0) {
			//   group.checked = false
			// }
		}

		console.log(group.selectedList);
	}
	const starChange = (e) => {
		form.value.constellation = stars.value[e.detail.value]
		// console.log(e);
	}

	const services = ref([])

	const userSettings = async () => {
		let resp = await getUserBaseSetting()
		form.value = resp.data
		let serviceType = form.value.serviceType

		services.value = serviceType.split(',')
		getAllServiceTypes()
		console.log(services.value);
		if (form.value.gallery) {
			let galleryList = JSON.parse(form.value.gallery)
			fileList.value = galleryList.map(url => ({
				url
			}))
		}

	}

	const form = ref({})

	const afterRead = (event) => {
		fileList.value = event.fileList
	}
	// const deletePic = (event) => {
	// 	fileList.value.splice(event.index, 1)
	// }

	const chooseProfession = () => uni.showToast({
		title: '选择职业',
		icon: 'none'
	})
	const chooseConstellation = () => uni.showToast({
		title: '选择星座',
		icon: 'none'
	})



	// 删除回调
	const deletePic = (event, index, lists, name) => {
		console.log('图片已被移除 index:', index)
		// console.log(lists);
		// lists 是删除后的剩余文件列表
		// fileList.value = lists
		console.log(fileList);
		fileList.value.splice(index, 1)
		// 同步更新后端保存字段
		if (fileList.value) {
			console.log(fileList.value);
			form.value.gallery = JSON.stringify(
				fileList.value
				.map(item => item.url || (item.response?.data?.url || ''))
				.filter(url => url) // 过滤空值
			)
			console.log(form.value.gallery);
			// form.value.gallery = JSON.stringify(fileList.value.map(item => item.url || item.thumb || ''))
		} else {
			form.value.gallery = ""
		}
	}
	const chooseRegion = () => uni.showToast({
		title: '选择地区',
		icon: 'none'
	})
	const chooseServiceType = () => {
		serviceChooseDialog.value = true
	}

	const saveInfo = async () => {
		let resp = await saveRoleInfo(form.value)
		if (resp.code == 0) {
			uni.showToast({
				title: "修改成功"
			})
			uni.navigateBack()
		}
	}

	const editSignature = () => {
		showEditSignature.value = true
	}

	const beforeUpload = (index, list) => {
		// 只上传偶数索引的文件
		// uni.showLoading({
		// 	title:"上传中..."
		// })
	}
	const submit = () => {
		console.log('提交表单:', form.value)
		uni.showToast({
			title: '保存成功',
			icon: 'success'
		})
	}
</script>

<style scoped lang="scss">
	.page {
		background-color: #f8f8f8;
		min-height: 100vh;
	}

	.nav-right {
		margin-right: 30rpx;
	}

	.form-box {
		background-color: #fff;
		margin: 20rpx;
		border-radius: 16rpx;
		padding: 20rpx;
	}

	.upload-section {
		margin-bottom: 30rpx;

		.label {
			font-size: 28rpx;
			font-weight: 500;
			margin-bottom: 10rpx;

			.desc {
				font-size: 24rpx;
				color: #999;
				margin-left: 8rpx;
			}
		}

		.upload-placeholder {
			width: 160rpx;
			height: 160rpx;
			border: 2rpx dashed #ddd;
			border-radius: 16rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.upload-text {
				font-size: 24rpx;
				color: #aaa;
				margin-top: 10rpx;
			}
		}
	}

	/* 信息列表样式 */
	.info-list {
		border-top: 1rpx solid #eee;
		border-bottom: 1rpx solid #eee;

		.info-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 26rpx 0;
			border-bottom: 1rpx solid #f0f0f0;

			&:last-child {
				border-bottom: none;
			}

			.label {
				font-size: 28rpx;

				&.required::after {
					content: '*';
					color: #f56c6c;
					margin-left: 4rpx;
				}
			}

			.value {
				flex: 1;
				text-align: right;
				font-size: 28rpx;
				color: #333;
				margin-right: 10rpx;

				&.text-gray {
					color: #999;
				}

				&.service-type {
					overflow: hidden;
					text-overflow: ellipsis;
					margin-left: 30rpx;
					font-size: 26rpx;
					color: #999;
					white-space: nowrap;
				}
			}
		}
	}

	.textarea-box {
		margin-top: 30rpx;

		.label {
			font-size: 28rpx;
			margin-bottom: 10rpx;
		}
	}

	.btn-box {
		padding: 40rpx;
	}

	.popup-container {
		padding: 20rpx;
	}

	.popup-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 20rpx;
		border-bottom: 1px solid #eee;
	}

	.popup-title {
		font-size: 32rpx;
		font-weight: 600;
	}

	.service-group {
		margin-top: 30rpx;
	}

	.group-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.expand-toggle {
		display: flex;
		align-items: center;
		color: #999;
		font-size: 26rpx;
	}

	.tag-container {
		display: flex;
		flex-wrap: wrap;
		overflow: hidden;
		transition: all 0.3s ease;
	}

	.tag-container.collapsed {
		max-height: 120rpx;
		/* 收起时只显示两行左右 */
	}

	.tag-item {
		padding: 12rpx 30rpx;
		background-color: #f5f5f5;
		border-radius: 12rpx;
		margin: 10rpx 20rpx 0 0;
		font-size: 26rpx;
		color: #333;
	}

	.tag-item.active {
		background-color: #E6F8F2;
		color: #00C38D;
	}
</style>