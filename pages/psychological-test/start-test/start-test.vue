<template>
	<view class="start-test-box">
		<uni-nav-bar :backgroundColor="'#F4F6F8'" :border="false" :title="title" class="header-bar" :statusBar="true"
			fixed>
			<template v-slot:left>
				<uni-icons type="left" size="24" @click="backFn"></uni-icons>
			</template>
			<template v-slot:right>
				<view class="right">
					<image src="/static/confide/share.png" class="img"></image>
				</view>
			</template>
		</uni-nav-bar>

		<view class="content-box">
			<view class="process-box">
				<view class="process-content">
					<view class="process-txt">评测进度</view>
					<!-- <view class="process-percent">
						<view class="use-process" :style="{'width':width+'rpx'}"></view>
					</view> -->
					<u-line-progress active-color="#38CC98" inactive-color="#ffffff" :percent="progressPercent"
						:show-percent="false"></u-line-progress>
					<view class="process-num"><text class="use-num">{{examIndex+1}}</text>/{{examOptionList.length}}
					</view>
				</view>
			</view>

			<view class="question-box">
				<view class="q-logo">
					<image src="/static/psychological-test/q-logo.svg" class="img"></image>
				</view>
				<view class="q-content">
					<view class="content">
						{{examOptionList[examIndex].question}}
					</view>
				</view>
			</view>
			<view class="answer-box">
				<view class="answer-content">
					<view class="answer-list">
						<view class="answer-item" v-for="(item,index) in JSON.parse(examOptionList[examIndex].options)"
							:key="index" @click="answerHandler(index)" :class="answerActive==index?'active':''">
							<view class="dot"></view>
							<view class="txt">{{item.text}}</view>
						</view>
					</view>
				</view>
			</view>

			<view class="pre-btn-box">
				<view class="pre" v-if="examIndex>0" @click="prevOption">上一题</view>
				<view class="pre" v-if="examIndex<examOptionList.length-1" @click="nextOption">下一题</view>
				<view class="pre" v-if="examIndex==examOptionList.length-1" @click="getResult">查看结果</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		computed,
		onMounted,
		ref,
		watch
	} from 'vue';

	import {
		onLoad
	} from '@dcloudio/uni-app'

	import {
		getExamOptions,
		saveExamRecord,
		updateUserAnswer,
		examResult,recordDetail
	} from '@/common/api/exam.js'

	const backFn = () => {
		uni.navigateBack()
	}

	const title = ref('')
	const id = ref(0)

	const examOptionList = ref([])
	const examIndex = ref(0)
	const examId = ref(0)
	const userAnswer = ref([])
	const recordId = ref(0)
	onLoad((e) => {
		title.value = e.title
		
		examId.value = e.examId
		if (!examId.value) {
			id.value = e.id
			//需要创建测试记录
			createExamRecord()
			getOptionList()
		} else {
			recordId.value = e.id
			id.value = e.examId
			answerActive.value = -1
			getExamOptionRecordDetail()
			examIndex.value = parseInt(e.currentIndex)+1
		}
	})

	const createExamRecord = async () => {
		let resp = await saveExamRecord({
			examId: id.value
		})
		console.log(resp);
		recordId.value = resp.data
	}

	const nextOption = () => {
		// if(userAnswer.value.length<=0){
		// 	uni.showToast({
		// 		title:"请选择选项",
		// 		icon:"error"
		// 	})
		// 	return
		// }
		if (answerActive.value === -1 || answerActive.value === undefined) {
			uni.showToast({
				title: "请选择选项",
				icon: 'error'
			})
			return
		}
		// if (userAnswer.value.length < examIndex.value) {
		// 	uni.showToast({
		// 		title: "请选择选项",
		// 		icon: 'error'
		// 	})
		// 	return
		// }
		//查找是否已存在该试题
		console.log(userAnswer.value);
		const existIndex = userAnswer.value.findIndex(
			(item) => parseInt(item.optionIndex) === parseInt(examIndex.value)
		)
		console.log(existIndex);
		if (existIndex !== -1) {
			// ✅ 已存在 → 替换答案
			userAnswer.value[existIndex].result = answerActive.value
		} else {
			userAnswer.value.push({
				optionIndex: examIndex.value,
				result: answerActive.value
			})
		}
		updateAnswer()
		examIndex.value = examIndex.value + 1
		console.log(examIndex.value);
		console.log(userAnswer.value);
		if (userAnswer.value[examIndex.value]) {
			let answer = userAnswer.value[examIndex.value]
			answerActive.value = answer.result
		} else {
			answerActive.value = -1
		}
	}

	const updateAnswer = async () => {
		let resp = await updateUserAnswer({
			id: recordId.value,
			options: JSON.stringify(userAnswer.value),
			currentIndex: examIndex.value
		})
	}

	const getResult = async () => {
		if (answerActive.value === -1 || answerActive.value === undefined) {
			uni.showToast({
				title: "请先选择选项",
				icon: "error"
			})
			return
		}
		// 2️⃣ 更新最后一题的答案（如果未保存）
		const existIndex = userAnswer.value.findIndex(
			(item) => item.optionIndex === examIndex.value
		)
		if (existIndex !== -1) {
			userAnswer.value[existIndex].result = answerActive.value
		} else {
			userAnswer.value.push({
				optionIndex: examIndex.value,
				result: answerActive.value
			})
		}
		uni.showLoading({
			title: "正在获取结果，请稍后..."
		})
		updateAnswer()
		getExamResult()
	}
	
	const getExamResult = async()=>{
		let resp = await examResult({id:recordId.value})
		console.log(resp);
		uni.hideLoading()
		uni.navigateTo({
			url:`/pages/psychological-test/test-result/test-result?title=${title.value}&examId=${id.value}&result=${resp.data.examResult}`
		})
		
	}

	const prevOption = () => {
		examIndex.value = examIndex.value - 1
		let answer = userAnswer.value[examIndex.value]
		answerActive.value = answer.result
	}
	const getExamOptionRecordDetail = async () => {
		let resp = await recordDetail({id:recordId.value})
		console.log(resp);
		examOptionList.value = resp.data.options
		if(resp.data.result){
			let result = JSON.parse(resp.data.result)
			userAnswer.value = result
		}
	}

	const getOptionList = async () => {
		let resp = await getExamOptions({
			id: id.value
		})
		console.log(resp);
		examOptionList.value = resp.data
	}

	const width = ref(0);

	const countProcessHandler = () => {
		width.value = (436 / 13 * 2);
	};


	onMounted(() => {
		countProcessHandler();
	})

	const progressPercent = computed(() => {
		return Math.round(((examIndex.value + 1) / examOptionList.value.length) * 100)
	})

	watch(progressPercent, (newVal, oldVal) => {
		console.log(`进度从 ${oldVal}% → ${newVal}%`)
	})
	const answerActive = ref(-1);
	const answerHandler = (i) => {
		answerActive.value != i ? answerActive.value = i : ''
		// uni.navigateTo({
		// 	url: '/pages/psychological-test/test-result/test-result'
		// })
	}
</script>

<style lang="scss" scoped>
	.start-test-box {
		background: #f4f6f8;
		height: 100vh;

		.right {
			.img {
				width: 40rpx;
				height: 40rpx;
			}
		}

		.content-box {
			background: linear-gradient(180deg, #D5F9ED 0%, #F4F6F8 42%);
			width: 750rpx;

			.process-box {
				padding: 0rpx 32rpx;

				.process-content {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding-top: 40rpx;

					.process-txt {
						font-size: 26rpx;
						width: 160rpx;
						color: rgba(0, 0, 0, 0.85);
					}

					.process-percent {
						width: 436rpx;
						height: 16rpx;
						border-radius: 58rpx;
						background: #fff;

						.use-process {
							height: 100%;
							border-radius: 58px;
							background: #38CC98;
						}
					}

					.use-num {
						font-size: 40rpx;
						font-weight: 500;
						color: #38CC98;
						padding-right: 10rpx;
					}
				}
			}

			.question-box {
				display: flex;
				padding: 0rpx 32rpx;
				align-items: center;
				margin-top: 60rpx;

				.q-logo {
					.img {
						width: 100rpx;
						height: 100rpx;
					}
				}

				.q-content {
					width: 480rpx;
					display: flex;
					align-items: center;
					border-radius: 28px;
					background: #FFFFFF;
					margin-left: 12rpx;

					.content {
						padding: 26rpx 30rpx;
					}
				}
			}

			.answer-box {
				padding: 0rpx 32rpx;
				margin-top: 40rpx;

				.answer-content {
					width: 686rpx;
					background-color: #fff;
					border-radius: 28rpx;

					.answer-list {
						padding: 32rpx 40rpx;

						.answer-item {
							border-radius: 20rpx;
							background: #F2F4F5;
							padding: 30rpx 34rpx;
							display: flex;
							align-items: center;

							.dot {
								background: #38CC98;
								width: 14rpx;
								height: 14rpx;
								border-radius: 14rpx;
								margin-right: 20rpx;
								flex-shrink: 0;
							}

							&:not(:first-child) {
								margin-top: 32rpx;
							}
						}

						.active {
							background: #DCFFF3;
						}
					}
				}
			}

			.pre-btn-box {
				margin-left: 30rpx;
				margin-right: 30rpx;
				display: flex;
				justify-content: space-between;
				margin-top: 80rpx;

				.pre {
					width: 300rpx;
					height: 92rpx;
					line-height: 92rpx;
					text-align: center;
					color: #fff;
					margin-left: 20rpx;
					flex: 1;
					font-size: 30rpx;
					background: #35CA95;
					border-radius: 80rpx;
				}
			}
		}
	}
</style>