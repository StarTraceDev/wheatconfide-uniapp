<template>
	<view class="career-box">
		<view class="career-content-box">
			<view class="career-content">
				<view class="title">擅长方向</view>
				<view class="remark">专业信息展示在个人资料（多选）</view>
				<view class="career-collapse-box">
					<view class="career-collapse-item">
						<uni-collapse v-model="collapseValue">
							<uni-collapse-item :border="false" title-border="none" v-for="(item,index) in classifyLists"
								:key="index">
								<template v-slot:title>
									<view class="collapse-item-title">
										<uni-data-checkbox multiple :localdata="[classifyLists[index]]"
											selectedColor="#35CA95" selectedTextColor="#212528"></uni-data-checkbox>
									</view>
								</template>
								<view class="content">
									<uni-data-checkbox multiple v-model="item.modelValue" :localdata="item.children"
										selectedColor="#35CA95" selectedTextColor="#212528"></uni-data-checkbox>
								</view>
							</uni-collapse-item>
						</uni-collapse>
					</view>
				</view>
			</view>

			<view class="career-content">
				<view class="title">擅长疗法</view>
				<view class="remark">专业信息展示在个人资料（多选）</view>
				<view class="career-collapse-box">
					<view class="career-collapse-item">
						<view class="uni-collapse-item__wrap">
							<view class="content">
								<uni-data-checkbox multiple v-model="multipleValues" :localdata="multipleCheckBox"
									selectedColor="#35CA95" selectedTextColor="#212528"></uni-data-checkbox>
							</view>
						</view>

					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';

	const collapseValue = ref(['0']);
	const classifyLists = ref([{
		text: "婚姻关系",
		value: 1,
		modelValue: [],
		children: [{
			text: "婚姻关系1",
			value: "1",
		}, {
			text: "婚姻关系2",
			value: "2",
		}, {
			text: "婚姻关系3",
			value: "3",
		}, {
			text: "婚姻关系4",
			value: "4",
		}, {
			text: "婚姻关系5",
			value: "5",
		}]
	}, {
		text: "人际关系",
		value: "rjgx",
		modelValue: [],
		children: [{
			text: "人际关系1",
			value: "1",
		}, {
			text: "人际关系2",
			value: "2",
		}, {
			text: "人际关系3",
			value: "3",
		}, {
			text: "人际关系4",
			value: "4",
		}, {
			text: "人际关系5",
			value: "5",
		}]
	}, {
		text: "人际关系",
		value: "rjgx",
		modelValue: [],
		children: [{
			text: "人际关系1",
			value: "1",
		}, {
			text: "人际关系2",
			value: "2",
		}, {
			text: "人际关系3",
			value: "3",
		}, {
			text: "人际关系4",
			value: "4",
		}, {
			text: "人际关系5",
			value: "5",
		}]
	}]);


	const multipleValues = ref([]);
	const multipleCheckBox = ref([{
		text: "人际关系1",
		value: "1",
	}, {
		text: "人际关系2",
		value: "2",
	}, {
		text: "人际关系3",
		value: "3",
	}, {
		text: "人际关系4",
		value: "4",
	}, {
		text: "人际关系5",
		value: "5",
	}])
</script>

<style scoped lang="scss">
	.career-box {
		width: 750rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		.career-content-box {
			width: 686rpx;
			background: #fff;
			border-radius: 20rpx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;

			.career-content {
				width: 630rpx;

				.title {
					color: #212528;
					font-size: 36rpx;
					margin-top: 36rpx;
				}

				.remark {
					color: rgba(0, 0, 0, .5);
					font-size: 26rpx;
					margin-top: 12rpx;
				}

				.career-collapse-box {
					margin-top: 30rpx;

					::v-deep .career-collapse-item {
						.uni-collapse-item__title {
							width: 622rpx;
							height: 92rpx;
							background-color: #F1F7F5;
							border-radius: 10rpx;
							display: flex;
							align-items: center;
							padding-left: 32rpx;

							.checkbox__inner {
								border-color: #35CA95 !important;
							}

							.checklist-text {
								color: #212528 !important;
							}
						}
						.uni-collapse-item__wrap {
							padding-left: 32rpx;
							margin: 8rpx 0rpx 0rpx 0rpx;
							.content {
								.uni-data-checklist {
									.checklist-group {
										.checklist-box {
											width: 50%;
											margin: 32rpx 0rpx;

											.checkbox__inner {
												border-color: #35CA95 !important;
											}

											.checklist-text {
												color: #212528 !important;
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>