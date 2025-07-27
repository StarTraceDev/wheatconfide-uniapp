<template>
	<view class="message-box">
		<uni-nav-bar :backgroundColor="'#f4f6f8'" :border="false" class="header-bar" :statusBar="true" fixed
			leftWidth="260rpx" rightWidth="200rpx" height="128rpx">
			<template v-slot:left>
				<view class="left">
					<view class="tab-item" :class="activeIndex==0?'active':''" @click="tabActiveHandler(0)">
						<uni-badge class="uni-badge-left-margin" :text="privateChantNum" absolute="rightTop"
							v-if="privateChantNum&&privateChantNum>0" :max-num="99">
							<text class="txt">私聊</text>
						</uni-badge>
						<text class="txt" v-else>私聊</text>
					</view>
					<view class="tab-item" :class="activeIndex==1?'active':''" @click="tabActiveHandler(1)">
						<uni-badge class="uni-badge-left-margin" :text="noticeNum" v-if="noticeNum&&noticeNum>0"
							absolute="rightTop" :max-num="99">
							<text class="txt">通知</text>
						</uni-badge>
						<text class="txt" v-else>通知</text>
					</view>
				</view>
			</template>
			<template v-slot:right>
				<view class="right">
					<view class="img-txt">
						<image src="/static/consult/contect.png" class="img"></image>
						<text class="txt">客服</text>
					</view>
					<view class="img-txt" @click="alreadReadHandler">
						<image src="/static/message/use-read.svg" class="img"></image>
						<text class="txt">已读</text>
					</view>
				</view>
			</template>
		</uni-nav-bar>

		<view class="message-content" v-if="activeIndex==0">
			<view class="content-tab-box">
				<view class="tab-item" v-for="(item,index) in contentTabLists" :key="index"
					:class="contentTabActiveIndex==item.id?'active':''" @click="contentTabHandler(item.id)">
					{{item.label}}
				</view>
			</view>
			<view class="scroll-content-box">
				<scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
					<view v-if="conversations.length>0">
						<view class="content-item" v-for="(conversation,index) in conversations" :key="index"
							@click="chatHandler(conversation)">
							<view class="content-item-left">
								<uni-badge class="uni-badge-left-margin" :text="conversation.unread" absolute="rightTop"
									v-if="conversation.unread&&conversation.unread>0" :max-num="99">
									<image src="/static/consult/user.png" class="img"></image>
								</uni-badge>
								<image src="/static/consult/user.png" class="img" v-else></image>
							</view>
							<view class="content-item-right">
								<view class="content-user-date">
									<view class="name">{{conversation.data?.name}}</view>
									<view class="date">{{ formatDate(conversation.lastMessage.timestamp) }}</view>
								</view>
								<view class="item-info-bottom-item">
									<view class="item-info-top_content" v-if="!conversation.lastMessage.recalled">
										<text class="unread-text">
											{{ conversation.lastMessage.read === false && conversation.lastMessage.senderId === currentUser.id ? '[未读]' : '' }}
										</text>
										<text
											v-if="conversation.lastMessage.type === 'text'">{{ conversation.lastMessage.payload.text }}</text>
										<text v-else-if="conversation.lastMessage.type === 'video'">[视频消息]</text>
										<text v-else-if="conversation.lastMessage.type === 'audio'">[语音消息]</text>
										<text v-else-if="conversation.lastMessage.type === 'image'">[图片消息]</text>
										<text v-else-if="conversation.lastMessage.type === 'file'">[文件消息]</text>
										<text v-else-if="conversation.lastMessage.type === 'order'">[自定义消息:订单]</text>
										<text v-else>[[未识别内容]]</text>
									</view>
									<view class="item-info-bottom_action" @click.stop="showAction(conversation)">
										<uni-icons type="more-filled" size="24" color="rgba(0,0,0,.35)"></uni-icons>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="no-conversation" v-else>当前没有会话</view>
				</scroll-view>
			</view>
		</view>

		<view class="message-content notice-content" v-else>
			<view class="scroll-content-box">
				<scroll-view scroll-y class="scroll-content" :show-scrollbar="false">
					<view class="content-item" v-for="i in 1" :key="i">
						<view class="content-item-left">
							<image src="/static/consult/user.png" class="img"></image>
						</view>
						<view class="content-item-right">
							<view class="content-user-date">
								<view class="name">消息推送</view>
								<view class="date">昨天</view>
							</view>
							<view class="item-info-bottom-item">
								<view class="item-info-top_content">咨询、测评、课程马上领</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<uni-popup ref="conversationPopup" type="center" border-radius="8rpx" class="conversation-popup">
			<view class="item-box">
				<view class="item" @click="topConversation">{{ currentConversation.top ? '取消置顶' : '置顶聊天' }}</view>
				<view class="item" @click="deleteConversation">删除聊天</view>
			</view>
		</uni-popup>

		<uni-popup ref="alreadReadPopup" type="center" border-radius="24rpx" class="alread-read-popup">
			<view class="item-box">
				<view class="title">全部已读</view>
				<view class="content">确认将所有信息标记为已读？</view>
				<view class="btn">
					<view class="cancel" @click="cancelHandler">取消</view>
					<view class="confirm" @click="confirmHandler">已读</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		formatDate
	} from '@/lib/utils';
	import restApi from '@/lib/restapi';
	import {
		onShow,
		onHide,
	} from "@dcloudio/uni-app";

	import {
		useGlobalDataStore
	} from '@/stores/global.js';
	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');

	const privateChantNum = ref(0);
	const noticeNum = ref(101);

	const activeIndex = ref(0);

	const tabActiveHandler = (i) => {
		i != activeIndex.value ? activeIndex.value = i : '';
	}

	const contentTabLists = ref([{
		id: 1,
		label: "全部",
	}, {
		id: 2,
		label: "服务中",
	}, {
		id: 3,
		label: "服务过",
	}]);

	const contentTabActiveIndex = ref(1);

	const contentTabHandler = (i) => {
		i != contentTabActiveIndex.value ? contentTabActiveIndex.value = i : ''
	}

	const GoEasy = uni.$GoEasy;
	// const GRTC = uni.$GRTC;
	const conversations = ref([]);
	const currentUser = ref({
		id: '33c3693b-dbb0-4bc9-99c6-fa77b9eb763f',
		name: 'Juanita',
		password: '123',
		avatar: '/static/message/Avatar-2.png',
		email: 'Wallace@goeasy.io',
		phone: '138xxxxxxxx',
	});
	onShow(() => {
		if (GoEasy.getConnectionStatus() === 'disconnected') {
			connectGoEasy(); //连接goeasy
		}
		loadConversations(); //加载会话列表
		initGoEasyListeners();
	});
	onHide(() => {
		if (GoEasy.getConnectionStatus() === 'disconnected') {
			return
		}
		GoEasy.im.off(GoEasy.IM_EVENT.CONVERSATIONS_UPDATED, renderConversations);
	});

	const connectGoEasy = () => {
		uni.showLoading();
		GoEasy.connect({
			id: currentUser.value.id,
			data: {
				name: currentUser.value.name,
				avatar: currentUser.value.avatar
			},
			onSuccess: () => {
				console.log('GoEasy connect successfully.');
				loadConversations();
			},
			onFailed: (error) => {
				uni.showToast({
					title: `Failed to connect GoEasy, code:${error.code} ,error:${error.content}`
				})
				// console.log('Failed to connect GoEasy, code:' + error.code + ',error:' + error.content);
			},
			onProgress: (attempts) => {
				console.log('GoEasy is connecting', attempts);
			}
		});
	};

	// 加载最新的会话列表
	const loadConversations = () => {
		GoEasy.im.latestConversations({
			onSuccess: (result) => {
				uni.hideLoading();
				let content = result.content;
				renderConversations(content);
				// setUnreadAmount(content);
			},
			onFailed: (error) => {
				uni.hideLoading();
				console.log('获取最新会话列表失败, error:', error);
			}
		});
	};

	const initGoEasyListeners = () => {
		GoEasy.im.on(GoEasy.IM_EVENT.CONVERSATIONS_UPDATED, renderConversations); //监听会话列表变化
		GoEasy.im.off(GoEasy.IM_EVENT.CONVERSATIONS_UPDATED, setUnreadAmount); // 移除之前的设置角标回调，防止重复回调
		GoEasy.im.on(GoEasy.IM_EVENT.CONVERSATIONS_UPDATED, setUnreadAmount); // 设置角标
	}

	//监听和接收单聊消息
	const renderConversations = (content) => {
		console.log(content);
		conversations.value = content.conversations;

	};

	const setUnreadAmount = (content) => {
		console.log(content);
		privateChantNum.value = content.unreadTotal;
	};


	const conversationPopup = ref(null);
	const currentConversation = ref(null);
	const showAction = (conversation) => {
		currentConversation.value = conversation;
		conversationPopup.value?.open();
	}

	const topConversation = () => { //会话置顶
		conversationPopup.value?.close();
		let description = currentConversation.value.top ? '取消置顶' : '置顶';
		GoEasy.im.topConversation({
			conversation: currentConversation.value,
			top: !currentConversation.value.top,
			onSuccess: function() {
				uni.showToast({
					title: description + '成功',
					icon: 'none'
				});
			},
			onFailed: function(error) {
				console.log(description, '失败：', error);
			}
		});
	};

	const deleteConversation = () => {
		conversationPopup.value?.close();
		uni.showModal({
			content: '确认删除这条会话吗？',
			success: (res) => {
				if (res.confirm) {
					GoEasy.im.removeConversation({
						conversation: currentConversation.value,
						onSuccess: () => {
							uni.showToast({
								title: "删除成功"
							})
						},
						onFailed: (error) => {
							uni.showToast({
								title: "删除失败"
							})
						},
					});
				}
			},
		})
	};


	const alreadReadPopup = ref(null);
	const alreadReadHandler = () => {
		alreadReadPopup.value?.open();
	}

	const cancelHandler = () => {
		alreadReadPopup.value?.close();
	}

	const confirmHandler = (conversation) => {
		cancelHandler();
		for (let i = 0; i < conversations.value.length; i++) {
			let userId = conversations.value[i].userId;
			GoEasy.im.markMessageAsRead({
				id: userId,
				type: GoEasy.IM_SCENE.PRIVATE, //群聊：GoEasy.IM_SCENE.GROUP, 客服消息：GoEasy.IM_SCENE.CS,
				onSuccess: function() {
					if (i + 1 == conversations.value.length) {
						uni.showToast({
							title: "操作成功"
						});
					}
				},
				onFailed: function(error) {

				},
			});
		}
	}

	const chatHandler = (conversation) => {
		uni.navigateTo({
			url: `/pages/message/private-chat?to=${conversation.userId}`
		});
	}
</script>

<style scoped lang="scss">
	$statusBarHeight: v-bind(statusBarHeight);

	.message-box {
		::v-deep(.header-bar) {
			.uni-navbar__header {
				padding: 0rpx 32rpx;
			}

			.left {
				display: flex;
				width: 200rpx;
				justify-content: space-between;
				color: rgba(0, 0, 0, 0.65);
				font-size: 32rpx;
				padding-right: 20rpx;

				.tab-item {}

				.active {
					position: relative;
					display: flex;
					justify-content: center;
					color: rgba(0, 0, 0, 0.85);

					&::after {
						position: absolute;
						content: '';
						width: 40rpx;
						height: 8rpx;
						border-radius: 4rpx;
						background: linear-gradient(270deg, #EAFFF7 0%, #35CA95 100%), #35CA95;
						bottom: -20rpx;
					}
				}
			}

			.right {
				display: flex;
				justify-content: space-between;
				width: 126rpx;

				.img-txt {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.img {
						width: 40rpx;
						height: 40rpx;
					}

					.txt {
						font-size: 18rpx;
						letter-spacing: normal;
						color: rgba(0, 0, 0, 0.85);
					}
				}

			}

		}


		.message-content {
			width: 750rpx;
			min-height: calc(100vh - 128rpx - $statusBarHeight);
			background: #fff;
			height: auto;
			display: flex;
			align-items: center;
			flex-direction: column;

			.content-tab-box {
				width: 686rpx;
				display: flex;
				align-content: center;
				height: 98rpx;
				align-items: center;

				.tab-item {
					border-radius: 24rpx;
					background: #F5F7FA;
					width: 112rpx;
					height: 44rpx;
					line-height: 44rpx;
					text-align: center;
					color: rgba(0, 0, 0, 0.65);
					font-size: 24rpx;
					margin-right: 20rpx;
				}

				.active {
					background: rgba(53, 202, 149, 0.1);
					box-sizing: border-box;
					border: 0.5px solid #35CA95;
					color: #35CA95;
				}
			}

			.scroll-content-box {
				width: 686rpx;

				.scroll-content {
					height: calc(100vh - 226rpx - $statusBarHeight);

					.content-item {
						display: flex;
						justify-content: space-between;
						height: 132rpx;
						align-items: center;
						position: relative;

						.content-item-left {
							width: 124rpx;

							.img {
								width: 84rpx;
								height: 84rpx;
							}
						}

						.content-item-right {

							.content-user-date {
								display: flex;
								justify-content: space-between;

								.name {
									font-size: 28rpx;
									font-weight: normal;
									color: rgba(0, 0, 0, 0.85);
								}

								.date {
									font-size: 22rpx;
									font-weight: normal;
									color: #C7CBCE;
								}
							}

							.item-info-bottom-item {
								display: flex;
								justify-content: space-between;
								align-items: center;

								.item-info-top_content {
									font-size: 24rpx;
									color: #A1A6AA;
									width: 528rpx;
									overflow: hidden;
									/* 隐藏溢出的文本 */
									text-overflow: ellipsis;
									/* 显示省略号 */
									white-space: nowrap;
									/* 禁止文本换行 */
									margin-top: 12rpx;
									height: 40rpx;
									line-height: 40rpx;
								}

								.item-info-bottom_action {

									font-size: 34rpx;
								}
							}

						}

						&::after {
							width: 564rpx;
							height: 2rpx;
							background-color: rgba(0, 0, 0, 0.04);
							content: '';
							position: absolute;
							bottom: 0rpx;
							left: 124rpx;
						}
					}

					.no-conversation {
						width: 100%;
						text-align: center;
						height: 80rpx;
						line-height: 80rpx;
						font-size: 34rpx;
						color: #9D9D9D;
					}

				}
			}
		}
		.notice-content {
			.scroll-content-box {
				.scroll-content {
					height: calc(100vh - 128rpx - $statusBarHeight);
				}
			}
		}
		.conversation-popup {
			.item-box {
				width: 520rpx;
				height: 208rpx;
				border-radius: 8rpx;
				background: #FFFFFF;

				.item {
					height: 104rpx;
					font-size: 28rpx;
					letter-spacing: normal;
					color: rgba(0, 0, 0, 0.85);
					padding-left: 34rpx;
					line-height: 104rpx;

					&:nth-child(1) {
						border-bottom: 2rpx solid rgba(0, 0, 0, 0.04);
					}
				}
			}
		}

		.alread-read-popup {
			.item-box {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 520rpx;
				height: 300rpx;
				background-color: #fff;
				border-radius: 24rpx;
				justify-content: center;

				.title {
					font-size: 36rpx;
					font-weight: 500;
					letter-spacing: normal;
					color: rgba(0, 0, 0, 0.85);
					margin-top: 34rpx;
				}

				.content {
					font-size: 24rpx;
					letter-spacing: normal;
					color: rgba(0, 0, 0, 0.6);
					margin-top: 24rpx;
				}

				.btn {
					width: 400rpx;
					display: flex;
					justify-content: space-between;
					margin-top: 36rpx;

					.cancel,
					.confirm {
						border-radius: 32rpx;
						background: #B9B9B9;
						width: 180rpx;
						height: 64rpx;
						color: #FFFFFF;
						font-size: 28rpx;
						text-align: center;
						line-height: 64rpx;
					}

					.confirm {
						background: #35CA95;
					}

				}
			}
		}
	}
</style>