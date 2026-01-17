<template>
  <view class="consult-box">
    <scroll-view
      class="scroll-content"
      scroll-y
      :scroll-top="scrollTop"
      :show-scrollbar="false"
      @scroll="onScroll"
    >
      <!-- 搜索 -->
      <view class="search-content" :class="currentScroll > 15 ? 'activeClass' : ''">
        <view class="search">
          <uni-search-bar
            v-model="formData.consultantName"
            radius="100"
            placeholder="请输入咨询师姓名"
            clearButton="auto"
            cancelButton="none"
            @blur="blursearchFn()"
          />
        </view>
        <view class="contact" @click="customerService">
          <image src="/static/my/contect.png" />
          <text>客服</text>
        </view>
      </view>

      <view class="operate-box">
        <view class="uni-margin-wrap">
          <swiper
            class="swiper"
            circular
            :indicator-dots="true"
            :autoplay="true"
            :interval="5000"
            :duration="500"
          >
            <swiper-item
              v-for="(i, index) in banners"
              :key="index"
              class="swiper-item"
            >
              <view class="swiper-item uni-bg-red">
                <image :src="i.image" mode="aspectFill" class="img"></image>
              </view>
            </swiper-item>
          </swiper>
        </view>
      </view>

      <!-- 吸顶区域 -->
      <u-sticky :offset-top="stickyOffsetTop" @fixed="fixedTop" @unfixed="unFixedTop">
        <view id="stickyBox">
          <view class="filter-box">
            <view class="filter-box-1">
              <view class="filter-box-1-1">
                <view
                  class="filter-box-1-item"
                  v-for="(item, index) in sticky"
                  :key="index"
                  :style="{ color: typeColor == item.id ? '#ffa867' : 'black' }"
                  @click="showBox(item.id)"
                >
                  {{ item.name }}
                  <uni-icons
                    v-if="item.id != 5"
                    :type="typeColor == item.id ? 'up' : 'down'"
                    :color="typeColor == item.id ? '#ffa867' : ''"
                    size="12"
                    class="icon"
                  />
                  <image v-if="item.id == 5" src="/static/consult/filter.png" style="width: 25rpx;height: 25rpx;"
										class="filter icon"></image>
                </view>
              </view>
            </view>
          </view>
        </view>
      </u-sticky>

     <view class="doctor-list">
        <view
          class="doctor-item"
          v-for="(item, index) in data.list"
          :key="index"
          @click="openDetail(item)"
        >
          <view class="doctor-auture">
            <image :src="avatarImg(item)"></image>
          </view>
          <view class="doctor-info">
            <view class="doctor-info-1">
              <view class="name">{{ item.name }}</view>
            </view>
            <view class="doctor-info-1">
              <view class="info">
                <text class="age item">{{ getGenerationByBirthdate(item.birthdate) }}</text>
                <text class="line"></text>
                <text class="edu item">{{ item.education }}硕士</text>
                <text class="line"></text>
                <text class="star item">{{ item.constellation || '水瓶座' }}</text>
              </view>
            </view>
            <view class="doctor-info-1">
              <view class="exprise">
                <text>{{ item.commentCount }}</text> 服务人次 <text>{{ item.platformHours }}+</text> 小时经验 <text>
                  {{ item.rating }} </text
                > 评分
              </view>
            </view>
            <view class="doctor-info-1">
              <view class="point-list">
                <view
                  class="point-item"
                  v-for="(item, index) in item.serviceTypes.slice(0, 3)"
                  :key="index"
                  >{{ item }}</view
                >
              </view>
            </view>
            <view class="doctor-info-1">
              <view class="price" v-if="item.price">
                <text class="unit" v-if="item.price">¥</text>{{ item.price }}</view>
              <view class="price" v-if="item.quoteList[0]">
                <text >{{ item.quoteList[0].quoteAmount || 0 }}</text>
                <text class="unit" style="color: rgba(0, 0, 0, 0.5);"> /分钟起</text>
              </view>
              <view class="address">
                <image src="/static/consult/address.png"></image
                ><text>{{ formatAddress(item.address) }}</text>
              </view>
            </view>
          </view>
          <view class="server-box">
            <view class="server-status">服务中</view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 下拉弹窗 + 遮罩 -->
    <view v-show="showCityBox" class="mask" @click="closeCityFilter">
      <view class="filter-popup" @click.stop>
        <!-- <view class="popup-header">筛选条件 {{ currentFilter }}</view> -->
        <view class="popup-body">
          <list-filtering
            ref="listFiltering"
            :colorType="2"
            :serviceTypes="serviceTypes"
            :confusionList="allCity"
            :layoutType="currentFilter"
          />
        </view>
        <view class="popup-footer">
          <button class="btn btn-reset" size="mini" @click="resetOption()">
            重置
          </button>
          <button class="btn btn-confirm" size="mini" @click="closeFilter()">
            完成
          </button>
        </view>
      </view>
    </view>
    <CustomerService ref="serviceRef"></CustomerService>
  </view>
</template>

<script setup>
import ListFiltering from "@/components/List-Filtering.vue";
import { ref, reactive, watch, getCurrentInstance, nextTick, onMounted } from "vue";
import { getListenerList } from "@/common/api/listener.js";
import { getGenerationByBirthdate, formatAddress } from "@/lib/utils.js";
import { cities } from "@/common/api/apis.js";
import { consultMenus } from "@/common/api/consultant.js";
import { useGlobalDataStore } from "@/stores/global.js";
import { onReachBottom } from "@dcloudio/uni-app";
import { bannerList } from "@/common/api/index.js";
import CustomerService from "@/components/Customer-Service.vue";

const globalStore = useGlobalDataStore();
const scrollTop = ref(0);
const stickyOffsetTop = ref(0);
const showCityBox = ref(false);
const statusBarHeight = ref(globalStore.statusBarHeight + "rpx");
const banners = ref([]);
const sticky = ref([
  { id: 1, name: "倾听方向", open: false },
  { id: 2, name: "城市", open: false },
  { id: 3, name: "价格", open: false },
  { id: 4, name: "排序", open: false },
  { id: 5, name: "筛选", open: false },
]);

const serviceRef = ref(null);
const customerService = () => {
  serviceRef.value.open();
};
const getBanners = async () => {
  let res = await bannerList();
  banners.value = res.data;
};

const fixed = ref(false);
const avatarImg = (item) => {
  const { masterGallery } = item
  if(!masterGallery) {
    return '/static/consult/user.png'
  } else {
    return JSON.parse(masterGallery)[0].url
  }
}

const data = reactive({
  listParams: {
    current: 1,
    size: 10,
  },
  list: [],
});

const searchParams = ref({
  serviceTypes: [],
  city: "",
});

const closeCityFilter = () => {
  showCityBox.value = false;
};

const blursearchFn = () => {
  getList();
};
// 监听吸顶事件
const fixedTop = () => {
  fixed.value = true;
};
const unFixedTop = () => {
  fixed.value = false;
  scrollTop.value = 0;
};
const instance = getCurrentInstance(); // ✅ 在顶层声明
const proxy = instance?.proxy; // ✅ 安全引用
const currentScroll = ref(0);
const currentFilter = ref(null);
const city = ref("");

/**
 * 点击筛选框
 * 如果未吸顶，则先滚动到吸顶位置
 */
const showBox = async (type) => {
  currentFilter.value = type;
  if (!fixed.value) {
    await nextTick();
    const query = uni.createSelectorQuery().in(proxy); // ✅ 用 proxy
    query.select("#stickyBox").boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      if (!res || !res[0]) return;
      const boxTop = res[0].top;
      const scrollOffset = currentScroll.value;
      scrollTop.value = scrollOffset + boxTop - 90; // 修正 offset-top
      setTimeout(() => {
        openFilter(type);
      }, 300);
    });
  } else {
    openFilter(type);
  }
};

// 打开筛选弹窗（这里你可以替换为自定义弹窗逻辑）
const typeColor = ref("");
// 打开筛选
const openFilter = (type) => {
  typeColor.value = type;
  showCityBox.value = true;
};

// 同步 scrollTop 和实际滚动位置
const onScroll = (e) => {
  currentScroll.value = e.detail.scrollTop;
};

const openDetail = (item) => {
  const { id, userId } = item
  uni.navigateTo({
    url: `/pages/confide/detail?id=${id}&userId=${userId}`,
  });
};
watch(showCityBox, () => {
    if (!showCityBox.value) {
        typeColor.value = "";
    }
  }
)

const formData = ref({
  current: 1,
  size: 10,
  consultantName: "",
})

onReachBottom(() => {
  data.listParams.current += 1;
  getList();
})
// 获取列表
const getList = async () => {
  let params = {
    ...data.listParams,
    ...searchParams.value,
    params: formData.value,
  };
  const res = await getListenerList(params);
  data.list = [...data.list, ...res.data.records];
};

const listFiltering = ref(null);
const closeFilter = () => {
  data.list = []
  const { distressId, city, currentRange, sortType, resultObj } = listFiltering.value  
  if(currentFilter.value === 1) {
    formData.value.distressId = distressId
  }
  if(currentFilter.value === 2) {
    formData.value.city = city
  }
  if(currentFilter.value === 3) {
    formData.value = { ...currentRange }
  }
  if(currentFilter.value === 4) {
    formData.value.sortType = sortType
  }
  if(currentFilter.value === 5) {
    formData.value = { ...resultObj }
  }
  showCityBox.value = false
  getList();
};

// 重置筛选
const resetOption = () => {
  formData.value = {
    current: 1,
    size: 10,
    consultantName: "",
  }
  data.list = []
  showCityBox.value = false
  getList();
};

// 获取服务
const serviceTypes = ref([]);
const getConsultMenu = async () => {
  let resp = await consultMenus();
  const data = resp.data || [];
  const result = data.map((group) => ({
    id: group.id,
    name: group.name,
    children: JSON.parse(group.children),
    spread: false,
  }));

  serviceTypes.value = result;
};

// 获取城市
const allCity = ref([]);
const getCityInfo = async () => {
  let resp = await cities();
  const data = resp.data || [];
  const result = data.map((group, index) => ({
    id: index + 1,
    name: group.name,
    children: JSON.parse(group.cities),
  }));
  allCity.value = result;
};

onMounted(() => {
  stickyOffsetTop.value = globalStore.statusBarHeight + 88
  getList();
  getConsultMenu();
  getCityInfo();
  getBanners();
});
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
  background-color: #f4f6f8;

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
      z-index: 1;
      top: 0;
      width: 100vw;
      align-items: center;
      padding: v-bind(statusBarHeight) 20rpx 20rpx;

      .search {
        width: 660rpx;
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
      padding-top: calc($statusBarHeight + 90rpx);
      background: url("@/static/confide/bg.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;

      .uni-margin-wrap {
        width: 690rpx;
        height: 280rpx;
        margin: 0rpx 32rpx 0rpx 32rpx;
        .swiper {
          height: 100%;
          width: 100%;

          .swiper-item {
            border-radius: 20rpx;

            .img {
              width: 720rpx;
              height: 280rpx;
            }
          }

          ::v-deep .uni-swiper-dots {
            .uni-swiper-dot {
              width: 6px;
              height: 3px;
              border-radius: 3px;
              background: rgba(255, 255, 255, 0.16);
            }

            .uni-swiper-dot-active {
              background: #ffffff;
            }
          }
        }
      }
    }

    .filter-box {
      width: 100vw;
      background-color: #f4f6f8;
      display: flex;
      padding: 20rpx 30rpx;
      flex-direction: column;

      .filter-box-1 {
        display: flex;
        .filter-box-1-1 {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          flex: 1;
        }
        .filter-box-1-item {
          font-size: 28rpx;
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
          background: linear-gradient(360deg, #fef1f1 -1%, #fed2d3 99%);
          color: #f76d64 !important;
        }

        .yellow {
          background: linear-gradient(360deg, #fff8e6 -1%, #f9e8bd 99%);
          color: #eb9516 !important;
        }

        .blue {
          background: linear-gradient(360deg, #f3f8ff -1%, #c8e3ff 99%);
          color: #2990fc !important;
        }

        .green {
          background: linear-gradient(360deg, #eefbe9 -1%, #defcd0 99%);
          color: #87a54a !important;
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
          color: #5f5f5f;
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
      min-height: 90vh;

      .doctor-item {
        width: 100vw;
        background: #fff;
        display: flex;
        height: 260rpx;
        position: relative;

        .doctor-auture {
          padding-top: 32rpx;
          width: 184rpx;

          image {
            border-radius: 50%;
            width: 132rpx;
            height: 132rpx;
            margin-left: 16rpx;
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

            .name {
              font-size: 32rpx;
              color: rgba(0, 0, 0, 0.85);
              font-weight: 500;
            }

            .info {
              display: flex;
              font-size: 24rpx;
              color: rgba(0, 0, 0, 0.85);
              align-items: center;

              .line {
                display: inline-block;
                width: 3rpx;
                height: 20rpx;
                background: rgba(0, 0, 0, 0.16);
                margin: 0 16rpx;
              }
            }

            .date {
              width: 168rpx;
              height: 32rpx;
              border-radius: 4rpx;
              background-color: #d8faee;
              color: #35ca95;
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
                border: 1rpx solid #b2b2b2;
                color: rgba(0, 0, 0, 0.6);
                font-size: 20rpx;
                margin-right: 20rpx;
              }
            }

            .discount {
              border-radius: 6rpx;
              padding: 6rpx 10rpx;
              border: 1rpx solid #fb6a6a;
              color: #fa5151;
              font-size: 20rpx;
            }

            .price {
              font-size: 35rpx;
              color: #fa5151;
              font-weight: 500;

              .unit {
                font-size: 20rpx;
                color: #fa5151;
                font-weight: 400;
              }
            }
          }

          .doctor-info-1:not(:first-of-type) {
            margin-top: 16rpx;
          }
        }

        .server-box {
          position: absolute;
          top: 36rpx;
          right: 32rpx;
          width: 88rpx;
          height: 88rpx;
          /* 自动布局 */
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            149deg,
            rgba(255, 167, 103, 0.4) 12%,
            rgba(255, 159, 86, 0.4) 81%
          );
          border-radius: 88rpx;

          .server-status {
            width: 76rpx;
            height: 76rpx;
            /* 自动布局 */
            display: flex;
            background: linear-gradient(149deg, #ffa767 12%, #ff9f56 81%);
            align-items: center;
            justify-content: center;
            border-radius: 76rpx;
            color: #ffffff;
            font-size: 20rpx;
          }
        }
      }

      .doctor-item:not(:last-of-type)::before {
        width: 686rpx;
        height: 1rpx;
        background: rgba(0, 0, 0, 0.08);
        position: absolute;
        content: "";
        left: 32rpx;
        bottom: 0;
      }
    }
  }
}

.mask {
  position: fixed;
  top: 260rpx;
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

.popup-footer {
  padding: 70rpx 20rpx 34rpx;
  text-align: center;
  display: flex;
  flex-direction: row;
}

.btn {
  width: 40%;
  color: #fff;
  border-radius: 50rpx;
  padding: 10rpx 0;
  font-size: 28rpx !important;
  gap: 20rpx;
}

.btn-confirm {
  background: #ffa867;
}

.btn-reset {
  color: #000000;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
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
