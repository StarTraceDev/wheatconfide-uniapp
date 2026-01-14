<template>
	<view class="settled-box">
		<view class="header">
			<uni-nav-bar :class="scrollTop > 15 ? 'scrollClass' : ''" backgroundColor="rgba(255,255,255,0)" :border="false" title="帮助中心" class="header-bar">
				<template v-slot:left>
					<uni-icons type="left" size="24" @click="backFn"></uni-icons>
				</template>
				<template v-slot:right>
					<view class="right">
						<image src="/static/confide/share.png" style="width: 40rpx;height: 40rpx;"></image>
					</view>
				</template>
			</uni-nav-bar>
		</view>
		<view class="content">
      <view class="clause">
        <view v-for="(item, index) in clauses" class="clause-item">
          <view @click="toggleClause(index)" class="item-title">
            <view>{{ item.title }}</view>
            <uni-icons :type="item.expanded ? 'up' : 'down'" size="15" :color="item.expanded ? '#eea84c' : '#57b584'" />
          </view>
          <view class="item-desc" :class="{ expanded: item.expanded }">
            <view v-html="item.content"></view>
          </view>
        </view>
      </view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { useGlobalDataStore } from '@/stores/global.js';
	import { onShow,onPageScroll } from '@dcloudio/uni-app'
  import { getAgreement } from '@/common/api/worry.js';

	const globalStore = useGlobalDataStore();
	const statusBarHeight = ref(globalStore.statusBarHeight + 'px');
	const scrollTop = ref(0);

  onPageScroll((e) => {
    scrollTop.value = e.scrollTop;
  });

	const backFn=()=>{
		uni.navigateBack({
			delta:1
		})
	}

  const clauses = ref([]);

  const getAgreementData = async () => {
    const { data } = await getAgreement({ current:1, size:100, type: '5' });
    clauses.value = data.records.filter(item  => item.type  === '5');
  }
  onShow(()=>{
    getAgreementData()
  })

  const toggleClause = (index) => {
    clauses.value[index].expanded = !clauses.value[index].expanded;
  };
</script>

<style lang="scss" scoped>
	.settled-box {
		$statusBarHeight: v-bind(statusBarHeight);
		width: 100vw;
    min-height: 100vh !important;
		background-image: url("@/static/settled/settled-bg.png");
		background-size: 100vw 632rpx;
		background-repeat: no-repeat;
    background-color: #f4f6f8;

		.header {
			position: fixed;
			width: 100vw;
			height: 88rpx;
      z-index: 999;

			.header-bar {
				padding-top: calc($statusBarHeight - 122rpx);

				::v-deep(.uni-nav-bar-text) {
					font-size: 32rpx;
					font-weight: 600;
					color: #fff;
				}
			}
		}
    .scrollClass{
    background-color: #fff;
    box-shadow: 0rpx 4rpx 20rpx rgba(0, 0, 0, 0.1);
    ::v-deep(.uni-nav-bar-text) {
      color: #000;
    }
  }
		.content {
			padding-top: calc($statusBarHeight - 20rpx);
      .clause{
        margin: 0 30rpx;
        padding: 30rpx;
        border-radius: 20rpx;
        background-color: #fff;

        &-item{
          .item-title{
            display: flex;
            justify-content: space-between;
            font-size: 28rpx;
            padding: 10rpx 0;
          }

          .item-desc{
            max-height: 0;
            overflow: hidden;
            padding: 0 32rpx;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background-color: #fff;
            margin: 10rpx 20rpx;
            border-radius: 20rpx;
            color: #9E9E9E;
            background-color: #F4F3F3;

            view{
              margin: 20rpx 0;
            }
          }

          .item-desc.expanded  {
            max-height: 1000px; /* 足够大的值容纳内容 */
            padding: 0rpx 32rpx;
            border-top: 1px solid #f0f0f0;
          }
        }
      }
		}
	}
</style>