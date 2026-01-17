<template>
  <view class="home-box" ref="homBox">
    <scroll-view
      scroll-y
      @scroll="onPageScroll"
      class="scroll-content"
      :show-scrollbar="false"
    >
      <!-- 页面内容 -->
      <view class="header">
        <view class="grass">
          <image src="/static/index/grass.png" class="img"></image>
        </view>
        <view class="contaior">
          <view
            class="search-content"
            :class="scrollTop > 15 ? 'scrollClass' : ''"
          >
            <view class="contact">
              <image src="/static/index/logo.png" class="logo-image" />
            </view>
            <view class="search">
              <uni-search-bar
                class="uni-mt-10"
                radius="100"
                placeholder="搜索内容"
                clearButton="auto"
                cancelButton="none"
                @confirm="searchFn"
              />
            </view>
            <view class="contact">
              <image
                :src="
                  scrollTop > 15
                    ? '/static/index/scroll-notice.png'
                    : '/static/index/notice.png'
                "
              >
              </image>
            </view>
          </view>
          
          <view class="swiper-content">
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

          <view class="pour-out-box">
            <view class="pour-out-header">
              <view class="title">
                <view>倾听专区</view>
                <image src="/static/index/subscript.png" />
              </view>
              <view class="features">
                <view class="feature-item">
                  <image src="/static/index/privacy.png" />
                  <view>隐私保密</view>
                </view>
                <view class="feature-item">
                  <image src="/static/index/fairness.png" />
                  <view>严格把控</view>
                </view>
                <view class="feature-item">
                  <image src="/static/index/money.png" />
                  <view>随用随退</view>
                </view>
              </view>
            </view>
            <view class="pour-out-list">
              <view
                v-for="(item, index) in pourOutList"
                :key="index + item.id"
                class="pour-out-item"
                @click="gotoListenPage(item)"
              >
                <image :src="item.icon" />
                <view>{{ item.title }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="psychological-box">
        <!-- 页面标题 -->
        <view class="psychological-header">
          <view class="title">
            <text>心理咨询师专区</text>
            <image src="/static/index/subscript.png" class="subscript"></image>
          </view>
        </view>
        <!-- 说明栏 -->
        <view class="info-bar">
          <text class="bar-txt">本专区咨询师都持有国家相关资格证书</text>
        </view>
        <!-- 图标网格 -->
        <view class="icon-grid">
          <view
            class="icon-item"
            v-for="(item, index) in consultantMenuList"
            @click="gotoListPage(item)"
            :key="index"
          >
            <view class="icon-circle">
              <image
                :src="item.icon == '' ? '@/static/index/icon1.png' : item.icon"
                class="img"
              ></image>
            </view>
            <text class="icon-text">{{ item.name }}</text>
          </view>
        </view>
      </view>
      <view class="swiper-content" style="padding-top: 0;">
        <view class="title">
          <viwe>名师堂专区</viwe>
          <image src="/static/index/subscript.png" class="subscript" />
        </view>
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

      <view class="hot-psychological-box" v-if="globalStore.mallSwitch">
        <view class="hot-psychological-header">
          <view class="title">
            <view>麦苗健康商城</view>
            <image src="/static/index/subscript.png" class="subscript"></image>
          </view>
          <view class="more" @click="shoppingMall"
            >更多<uni-icons
              type="right"
              size="12"
              color="rgba(0, 0, 0, 0.5)"
            ></uni-icons>
          </view>
        </view>
        <scroll-view 
          class="category-scroll" 
          scroll-x="true" 
          show-scrollbar="false"
        >
          <view 
            class="category-item" 
            :class="{active: currentCategoryId === item.id}"
            v-for="(item, idx) in categoryList" 
            :key="item.id"
            @click="handleCategoryClick(item)"
          >
            <view class="category-name">
              <view>{{ item.name }}</view>
              <image v-if="item.id == currentCategoryId" src="/static/settled/selectimg.png" />
              <view v-if="item.id == currentCategoryId" class="line"></view>
            </view>
          </view>
        </scroll-view>
        <view class="goods-box">
          <image src="/static/index/shopping-img.png" class="shopping-img"></image>
          <scroll-view 
            class="goods-scroll" 
            scroll-x="true" 
            show-scrollbar="false"
          >
            <view class="goods-item" v-for="(goods, idx) in goodsList" :key="goods.id" @click="goProductDetail(goods.id)">
              <image class="goods-thumb" :src="goods.thumbnail" mode="widthFix"/>
              <view class="goods-name">{{ goods.name }}</view>
              <view class="goods-price">¥{{ goods.minPrice }}</view>
            </view>
            <view class="no-goods" v-if="!goodsList.length">暂无商品</view>
          </scroll-view>
        </view>
      </view>

      <view class="hot-psychological-box hot-psychological-box2">
        <view class="hot-psychological-header">
          <view class="title title2">
            <view
              class="psychology"
              style="left: 0"
              :style="{ 
                top: handover == 1 ? '0' : '23rpx',
                color: handover == 1 ? '' : '#a3a3a3'
              }"
              @click="switchClick(1)"
            >热门心理咨询师</view>
            <image
              :class="handover == 1 ? '' : 'subscriptImg'"
              src="/static/index/subscript.png"
            />
            <view
              class="subscript"
              style="left: 285rpx;"
              :style="{
                top: handover == 1 ? '20rpx' : '0',
                color: handover == 2 ? '' : '#a3a3a3'
              }"
              @click="switchClick(2)"
            >热门倾听师</view>
          </view>
          <view class="more" @click="switchTabsFn()"
            >更多<uni-icons
              type="right"
              size="12"
              color="rgba(0, 0, 0, 0.5)"
            ></uni-icons>
          </view>
        </view>
        <scroll-view
          class="scroll-view_H"
          scroll-x="true"
          scroll-left="0"
          :show-scrollbar="false"
        >
          <view class="scroll-wrap">
            <view class="list" v-if="handover == 1">
              <ConsultTeacherListItem
                v-for="(item, index) in data.consultantList"
                class="list-item"
                :info="item"
                :key="item.id"
                @click="openTeacherFn(item.source, item)"
              />
            </view>
            <view class="list" v-if="handover == 2">
              <ConfideTeacherListItem
                v-for="(item, index) in data.listenerList"
                class="list-item confide-list-item"
                :info="item"
                :key="item.id"
                @click="openTeacherFn('listener', item)"
              />
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="psychology-test-box">
        <!-- 心理测试 -->
        <image class="img" src="/static/index/psychology-tree.png"></image>
        <view class="psychology-content">
          <view class="psychology-content-header">
            <view class="title">
              <view class="psychology">心理测试</view>
              <image src="/static/index/subscript.png" class="subscript" />
            </view>
            <view class="more" @click="openPsyTestHandler"
              ><text>更多</text
              ><uni-icons
                type="right"
                size="12"
                color="rgba(0, 0, 0, 0.5)"
              ></uni-icons>
            </view>
          </view>

          <view class="psychology-content-img">
            <image src="/static/index/psychology-content-img.png" class="content-img" />
          </view>
          <swiper
            class="content-swiper"
            :indicator-dots="true"
            :autoplay="false"
            indicator-active-color="#35CA95"
          >
            <swiper-item
              v-for="(page, pageIndex) in chunkedExams"
              :key="pageIndex"
            >
              <view class="content-list">
                <view
                  class="content-item"
                  v-for="(item, index) in page"
                  :key="index"
                  @click="gotoDetail(item)"
                >
                  <view class="lock">
                    <image src="/static/index/lock.png" class="lock-img" />
                  </view>
                  <view class="info">
                    <div class="title">{{ item.title }}</div>
                    <div class="num">
                      {{ formattedExamNum(item.examNum) }} 人已测
                    </div>
                    <div class="test-btn">开始测试</div>
                  </view>
                  <image :src="item.icon || '/static/index/psychology-content-icon.png'" class="content-item-img" />
                </view>
              </view>
            </swiper-item>
          </swiper>
        </view>
      </view>

      <view class="recommend-article-box">
        <view class="recommend-article-header">
          <view class="title">
            <view>文章推荐</view>
            <image src="/static/index/subscript.png" class="subscript"></image>
          </view>
          <view class="more" @click="openArticleFn(1)"
            >更多<uni-icons
              type="right"
              size="12"
              color="rgba(0, 0, 0, 0.5)"
            ></uni-icons>
          </view>
        </view>
        <view class="article-list">
          <RecommendArticleItem
            :info="i"
            v-for="i in data.list"
            class="article-item"
            @click="openArticleDetailFn(i)"
          >
          </RecommendArticleItem>
        </view>
      </view>
      <view class="mm-forum-box">
        <view class="mm-forum-header">
          <view class="title">
            <view>麦苗论坛</view>
            <image src="/static/index/subscript.png" class="subscript"></image>
          </view>
          <view class="more" @click="openForumHandler"
            >更多<uni-icons
              type="right"
              size="12"
              color="rgba(0, 0, 0, 0.5)"
            ></uni-icons>
          </view>
        </view>
        <view class="forum-list">
          <ForumItem
            :info="i"
            v-for="i in data.answerlist"
            class="forum-content"
          ></ForumItem>
        </view>
      </view>
      <view class="remark-box">
        <view class="title">专业的心理服务平台</view>
        <view class="hotline">
          7×24 小时专属顾问热线：
          <text class="phone">400-6688-999</text>
        </view>
        <view class="feature-container">
          <view
            class="feature-item"
            v-for="(item, index) in serverList"
            :key="index"
          >
            <image class="icon" :src="item.icon" mode="aspectFit" />
            <view class="content">
              <text class="feature-title">{{ item.title }}</text>
              <text class="feature-desc">{{ item.desc }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script setup>
import { getUserInfo, getMallSwitch } from "@/common/api/apis.js";
import { getArticleList } from "@/common/api/article.js";
import { getListenerList } from "@/common/api/listener.js";
import { getAnswerList } from "@/common/api/answer.js";
import { bannerList, getConsultantMenus, listHomeExams } from "@/common/api/index.js";
import { ref, onMounted, reactive, computed } from "vue";
import { onShow } from "@dcloudio/uni-app";
import ConfideTeacherListItem from "@/components/Confide-Teacher-List-Item.vue";
import ConsultTeacherListItem from "@/components/Consult-Teacher-List-Item.vue";
import RecommendArticleItem from "@/components/Recommend-Article-Item";
import ForumItem from "@/components/Forum-Item";
import { useGlobalDataStore } from "@/stores/global.js";
import { getConsultantList } from "@/common/api/consultant.js";
import { postCategoryList, getProductsByCategory } from "@/common/api/shoppingMall.js";

const banners = ref([]);
const homeExams = ref([]);
const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + 20 + "rpx");
const searchContentHeight = ref(globalStore.statusBarHeight + 56 + "rpx");
const searchSwiperHeight = ref(globalStore.statusBarHeight + 95 + "rpx");
// const { loginTIM } = useTIM('1600116083');

let scrollTop = ref(0);
const listenerMenu = ref([]);
uni.$currentUser = uni.getStorageSync("currentUser");
let currentUser = ref();

const gotoListPage = (menu) => {
  uni.switchTab({
    url: "/pages/consult/index?type=" + menu.title,
  });
};

onShow(() => {
  uni.$currentUser = uni.getStorageSync("currentUser");
  if (!uni.$currentUser.id) {
    uni.navigateTo({
      url: "./login",
    });
    return;
  }
  currentUser.value = uni.$currentUser;
  getBanners();
  getMallSwitchApi();
});

const getBanners = async () => {
  let res = await bannerList();
  banners.value = res.data;
};

// 获取产品分类
const categoryList = ref([]);
const currentCategoryId = ref(0);
const getProductsByCategoryApi = async () => {
  let res = await postCategoryList();
  currentCategoryId.value = res.data[0].id
  loadGoodsByCategory(res.data[0].id)
  categoryList.value = res.data;
}
// 点击分类
const handleCategoryClick = (category) =>{
  currentCategoryId.value = category.id;
  loadGoodsByCategory(category.id);
}
// 根据分类加载商品
const goodsList = ref([]);
const loadGoodsByCategory = async (categoryId) => {
  const { data } = await getProductsByCategory({ categoryId });
  goodsList.value = data.records
}

// 商品详情
const goProductDetail = (id) => {
  uni.navigateTo({
    url: `/pages/shopping-mall/product-details?id=${id}`
  })
}

const formattedExamNum = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "w";
  }
  return num;
};

const gotoDetail = (data) => {
  uni.navigateTo({
    url: `/pages/psychological-test/charge-test/charge-test?id=${data.id}`,
  });
};

const gotoListenPage = (data) => {
  uni.switchTab({
    url: "/pages/confide/index?type=" + data.title,
  });
}
const shoppingMall = () => {
  uni.navigateTo({
    url: "/pages/shopping-mall/mall-home",
  });
}
const data = reactive({
  listParams: {
    current: 1,
    size: 10,
    params: {},
  },
  list: [],
  answerlist: [],
  listenerList: [],
  consultantList: []
});

let consultantMenuList = ref([]);

const serverList = ref([
  {
    icon: "/static/index/remark-icon1.png",
    title: "严选师资",
    desc: "5.2万认证咨询师",
  },
  {
    icon: "/static/index/remark-icon2.png",
    title: "专业咨询",
    desc: "累计时长7亿+分钟",
  },
  {
    icon: "/static/index/remark-icon3.png",
    title: "免费退改",
    desc: "承诺限时内可退改",
  },
  {
    icon: "/static/index/remark-icon4.png",
    title: "隐私保障",
    desc: "咨询过程全保密",
  },
]);
const pourOutList = ref([
  {
    id: 1,
    icon: "/static/index/sleep.png",
    title: "睡眠改善",
  },
  {
    id: 2,
    icon: "/static/index/education.png",
    title: "亲子教育",
  },
  {
    id: 3,
    icon: "/static/index/emotion.png",
    title: "情绪压力",
  },
  {
    id: 4,
    icon: "/static/index/matching.png",
    title: "快速匹配",
  },
  {
    id: 5,
    icon: "/static/index/marriage.png",
    title: "婚姻情感",
  },
]);

const searchFn = () => {};

const onPageScroll = (e) => {
  scrollTop.value = e.detail.scrollTop;
};

const openArticleFn = (type) => {
  let url =
    type == 1
      ? "/pages/readArticle/readArticle"
      : "/pages/readArticle/articleDetail";
  uni.navigateTo({
    url,
  });
};

const openTeacherFn = (type, val) => {
  let url = type == 'listener' ? "/pages/confide/detail" : "/pages/consult/detail"  
  uni.navigateTo({
    url: url + "?id=" + val.id + "&userId=" + val.userId,
  });
};

const openForumHandler = () => {
  uni.navigateTo({
    url: "/pages/forum/index/index",
  });
};

const openPsyTestHandler = () => {
  uni.navigateTo({
    url: "/pages/psychological-test/index/index",
  });
};

/**
 * 获取当前用户信息
 */
const getlnfo = async () => {
  let res = await getUserInfo();
  globalStore.setUserInfo(res.data);
};

const openArticleDetailFn = (item) => {
  uni.navigateTo({
    url: "/pages/readArticle/articleDetail?id=" + item.id,
  });
};

const handover = ref(1)
const switchClick = (index) => {
  handover.value = index
}

const switchTabsFn = () => {
  let url = handover.value == 1 ? "/pages/consult/index" : "/pages/confide/index";
  uni.switchTab({
    url,
  });
};

// 获取倾听
const getListener = async () => {
  let res = await getListenerList({
    ...data.listParams,
    params: {
      isPreferred: 1
    }
  });
  data.listenerList = res.data.records;
};

// 获取咨询师
const getConsultantListApi = async () => {
  let res = await getConsultantList({
    ...data.listParams,
    params: {
      current: 1,
      size: 10,
      isPreferred: 1
    },
  });
  data.consultantList = res.data.records;
}

const getList = async () => {
  let res = await getArticleList(data.listParams);
  data.list = res.data.records;
};

const getAnswer = async () => {
  let res = await getAnswerList(data.listParams);
  data.answerlist = res.data.records;
};

const getConsultantMenu = async () => {
  let resp = await getConsultantMenus({
    type: 0,
  });
  uni.setStorageSync("consultantMenu", JSON.stringify(resp.data));
  //截取9个菜单
  let menus = resp.data;
  let showMenus = menus.slice(0, 9);
  showMenus.push({
    name: "全部",
    icon: "/static/index/menu_all.png",
  });
  console.log(showMenus);

  consultantMenuList.value = showMenus;
};

const getListenerMenu = async () => {
  let resp = await getConsultantMenus({
    type: 1,
  });
  console.log("menu2", resp);
  uni.setStorageSync("listenerMenu", JSON.stringify(resp.data));
  //截取9个菜单
  let menus = resp.data;
  let showMenus = menus.slice(0, 8);
  showMenus.push({
    name: "全部",
    icon: "/static/index/l_menu_all.png",
  });
  listenerMenu.value = showMenus;
};

const getHomeExams = async () => {
  let resp = await listHomeExams();
  console.log(resp);
  homeExams.value = resp.data;
};
const chunkedExams = computed(() => {
  const chunkSize = 4; // 每屏显示数量
  const result = [];
  for (let i = 0; i < homeExams.value.length; i += chunkSize) {
    result.push(homeExams.value.slice(i, i + chunkSize));
  }
  console.log(result);
  
  return result;
});

onMounted(() => {
  getlnfo();
  getListener();
  getList();
  getHomeExams();
  getAnswer();
  getConsultantListApi();
  getProductsByCategoryApi();
  let cMenuList = uni.getStorageSync("consultantMenu");
  if (!cMenuList) {
    getConsultantMenu();
  } else {
    let menus = JSON.parse(cMenuList);
    let showMenus = menus.slice(0, 9);
    showMenus.push({
      name: "全部",
      icon: "/static/index/menu_all.png",
    });
    consultantMenuList.value = showMenus;
  }
  let lMenuList = uni.getStorageSync("listenerMenu");
  if (!lMenuList) {
    getListenerMenu();
  } else {
    let menus = JSON.parse(lMenuList);
    let showMenus = menus.slice(0, 8);
    showMenus.push({
      name: "全部",
      icon: "/static/index/l_menu_all.png",
    });
    listenerMenu.value = showMenus;
  }
});

// 获取商城开关
const getMallSwitchApi = async () => {
  try {
    const { data } = await getMallSwitch();
    uni.setStorageSync('mallSwitch', data);
    globalStore.setMallSwitch(data);
  } catch (error) {
    console.log(error);
  }
}
</script>
<style lang="scss" scoped>
.home-box {
  width: 100vw;
  position: relative;
  background: #f5f9fa;

  .scroll-content {
    height: 100vh;

    .header {
      width: 100vw;
      // height: 712rpx;
      background: linear-gradient(180deg, #5fc484 4%, #f5f9fa 100%);
      position: relative;

      .grass {
        position: absolute;
        // z-index: 1;
        left: 32rpx;
        top: 30rpx;
        .img {
          width: 686rpx;
          height: 250rpx;
        }
      }

      .contaior {
        z-index: 2;

        .search-content {
          display: flex;
          align-items: center;
          position: fixed;
          z-index: 999;
          height: v-bind(searchContentHeight);
          width: 100vw;
          padding: v-bind(statusBarHeight) 32rpx 50rpx 32rpx;

          .search {
            width: 680rpx;
          }

          .contact {
            display: flex;
            flex-direction: column;
            justify-content: center;

            image {
              width: 48rpx;
              height: 48rpx;
            }

            .logo-image {
              width: 120rpx;
              height: 35rpx;
            }

            text {
              color: rgba(0, 0, 0, 0.85);
              font-size: 18rpx;
            }
          }
        }

        .scrollClass {
          background: #fff;
        }


        .pour-out-box {
          background: linear-gradient(180deg, #c6e8d5, #fff);
          margin: 30rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 20rpx;
          padding: 10rpx 30rpx;
          flex-direction: column;
          .pour-out-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-bottom: 50rpx;

            .title {
              position: relative;
              font-size: 32rpx;
              font-weight: bold;
              color: #333;

              image {
                position: absolute;
                top: 32rpx;
                left: 35rpx;
                width: 36rpx;
                height: 36rpx;
              }
            }

            .features {
              display: flex;
              justify-content: space-between;
              // width: 400rpx;
              background-color: #d1ecde;
              border-radius: 30rpx;

              .feature-item {
                display: flex;
                align-items: center;

                image {
                  width: 25rpx;
                  height: 25rpx;
                }

                view {
                  margin: 0 8rpx;
                  font-size: 24rpx;
                  color: rgba(0, 0, 0, 0.6);
                }
              }
            }
          }

          .pour-out-list {
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            .pour-out-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-bottom: 20rpx;

              image {
                width: 70rpx;
                height: 70rpx;
              }

              view {
                margin-top: 10rpx;
                font-size: 24rpx;
                color: rgba(0, 0, 0, 0.6);
              }
            }
          }
        }
      }
    }

    .psychological-box {
      margin-top: 30rpx;

      .psychological-header {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: relative;

        .title {
          font-size: 40rpx;
          font-weight: bold;
          color: #333;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          font-family: "YouSheBiaoTiHei-Bold";

          .subscript {
            width: 36rpx;
            height: 36rpx;
            position: absolute;
            top: 40rpx;
          }
        }
      }

      .info-bar {
        background: rgba(0, 152, 83, 0.1);
        border-radius: 10rpx;
        margin-bottom: 20rpx;
        color: #009853;
        font-size: 24rpx;
        width: 686rpx;
        height: 56rpx;
        border-radius: 8rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 32rpx;
        position: relative;
        margin-top: 30rpx;

        .bar-txt {
          position: relative;
        }

        .bar-txt::before {
          width: 22px;
          height: 4rpx;
          transform: rotate(180deg);
          /* 自动布局 */
          background: linear-gradient(
            270deg,
            #009853 0%,
            rgba(0, 152, 83, 0) 100%
          );
          content: "";
          position: absolute;
          left: -64rpx;
          top: 14rpx;
        }

        .bar-txt::after {
          width: 22px;
          height: 4rpx;
          background: linear-gradient(
            270deg,
            #009853 0%,
            rgba(0, 152, 83, 0) 100%
          );
          content: "";
          position: absolute;
          right: -64rpx;
          top: 14rpx;
        }
      }

      .icon-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        margin-left: 30rpx;
        margin-right: 30rpx;

        .icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20rpx;

          .icon-circle {
            width: 120rpx;
            height: 120rpx;
            overflow: hidden;

            .img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center;
            }
          }

          .icon-text {
            color: rgba(0, 0, 0, 0.6);
            font-size: 24rpx;
          }
        }
      }
    }

    .hot-psychological-box {
      padding: 0rpx 32rpx;
      margin-top: 30rpx;
      border-radius: 30rpx;

      .hot-psychological-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          position: relative;
          color: rgba(0, 0, 0, 0.85);
          font-size: 36rpx;
          font-weight: 500;
          .subscript {
            width: 50rpx;
            height: 50rpx;
            position: absolute;
            top: 27rpx;
            right: 50rpx;
          }
        }

        .title2{
          margin-bottom: 10rpx;
          .psychology{
            position: absolute;
            width: 300rpx;
          }
          image{
            width: 50rpx;
            height: 50rpx;
            position: absolute;
            left: 235rpx;
            top: 30rpx;
            transform: rotate(20deg);
          }
          .subscriptImg{
            transform: rotate(-20deg);
            left: 250rpx;
          }
          .subscript{
            position: absolute;
            width: 300rpx;
          }
        }

        .more {
          color: rgba(0, 0, 0, 0.5);
          font-size: 24rpx;
          font-size: 400;
        }
      }

      .scroll-view_H {
        margin-top: 80rpx;

        .list {
          display: flex;
          flex-direction: row;
          height: 100%;

          .list-item {
            width: 50%;
            margin-right: 24rpx;
            flex-shrink: 0;
            height: 100%;
            padding-bottom: 20rpx;
            background: linear-gradient(360deg, #eafcf6, #fff);
          }
          .confide-list-item{
            background: linear-gradient(360deg, #fff2dbdf, #fff);
          }
        }
      }
    }
    .hot-psychological-box2{
      background: linear-gradient(#eafcf6 0%, #f4f6f8 20%, #f4f6f8 100%);
      padding-top: 30rpx;
    }

    .psychology-test-box {
      margin-top: 30rpx;
      width: 100vw;
      background: linear-gradient(148deg, #c9ead8 4%, #eef8fe 57%);
      position: relative;

      .img {
        width: 390rpx;
        height: 142rpx;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 0;
      }

      .psychology-content {
        // position: absolute;
        padding: 0rpx 32rpx;
        z-index: 1;

        .psychology-content-header {
          display: flex;
          width: 686rpx;
          justify-content: space-between;
          padding-top: 40rpx;
          align-items: center;

          .title {
            color: rgba(0, 0, 0, 0.85);
            font-size: 36rpx;
            font-weight: 500;
            position: relative;
            .subscript {
              width: 55rpx;
              height: 55rpx;
              position: absolute;
              top: 27rpx;
              right: 30rpx;
            }
          }

          .more {
            color: rgba(0, 0, 0, 0.5);
            font-size: 24rpx;
            font-size: 400;
          }
        }

        .psychology-content-img {
          padding-top: 40rpx;
          z-index: 999;
          .content-img {
            width: 686rpx;
            height: 168rpx;
          }
        }
      }

      .content-list {
        display: flex;
        width: 100vw;
        flex-wrap: wrap;

        // padding-top: 32rpx;
        .content-item {
          width: 334rpx;
          height: 200rpx;
          border-radius: 20rpx;
          background: #fff;
          margin-right: 20rpx;
          flex-shrink: 0;
          position: relative;
          display: flex;
          line-height: 1;
          margin-top: 32rpx;

          .lock {
            margin-left: 20rpx;
            margin-top: 36rpx;

            .lock-img {
              width: 25rpx;
              height: 28rpx;
            }
          }

          .info {
            margin-left: 8rpx;
            margin-top: 36rpx;

            .title {
              font-size: 28rpx;
              color: rgba(0, 0, 0, 0.85);
              font-weight: 500;
            }

            .num {
              color: rgba(0, 0, 0, 0.5);
              font-size: 24rpx;
              font-weight: normal;
              margin-top: 12rpx;
            }

            .test-btn {
              font-size: 24rpx;
              color: #35ca95;
              margin-top: 45rpx;
            }
          }

          .content-item-img {
            position: absolute;
            width: 100rpx;
            height: 100rpx;
            right: 3rpx;
            bottom: 0rpx;
            border-radius: 20rpx;
          }
        }
      }
    }

    .recommend-article-box {
      margin-top: 60rpx;

      .recommend-article-header {
        padding: 0rpx 32rpx;
        display: flex;
        justify-content: space-between;

        .title {
          color: rgba(0, 0, 0, 0.85);
          font-size: 36rpx;
          font-weight: 500;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          position: relative;

          .subscript {
            width: 36rpx;
            height: 36rpx;
            position: absolute;
            top: 36rpx;
          }
        }

        .more {
          color: rgba(0, 0, 0, 0.5);
          font-size: 24rpx;
          font-size: 400;
        }
      }

      .article-list {
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .article-item {
          margin-top: 20rpx;
        }
      }
    }

    .mm-forum-box {
      margin-top: 60rpx;

      .mm-forum-header {
        padding: 0rpx 32rpx;
        display: flex;
        justify-content: space-between;

        .title {
          color: rgba(0, 0, 0, 0.85);
          font-size: 36rpx;
          font-weight: 500;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          position: relative;

          .subscript {
            width: 36rpx;
            height: 36rpx;
            position: absolute;
            top: 36rpx;
          }
        }

        .more {
          color: rgba(0, 0, 0, 0.5);
          font-size: 24rpx;
          font-size: 400;
        }
      }

      .forum-list {
        padding: 0rpx 32rpx;

        .forum-content {
          margin-top: 20rpx;
        }
      }
    }

    .remark-box {
      padding: 40rpx;

      .title {
        font-size: 28rpx;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.85);
        text-align: center;
        margin-bottom: 40rpx;
        position: relative;
      }

      .title::after {
        position: absolute;
        width: 186rpx;
        height: 4rpx;
        transform: rotate(180deg);
        opacity: 0.6;
        content: "";
        right: -24rpx;
        top: 24rpx;
        /* 自动布局 */
        background: linear-gradient(
          270deg,
          rgba(0, 0, 0, 0.27) 0%,
          rgba(0, 0, 0, 0) 100%
        );
      }

      .title::before {
        left: -24rpx;
        top: 24rpx;
        position: absolute;
        width: 186rpx;
        height: 4rpx;
        transform: rotate(180deg);
        opacity: 0.6;
        content: "";
        background: linear-gradient(
          270deg,
          rgba(0, 0, 0, 0) 0%,
          rgba(0, 0, 0, 0.27) 100%
        );
      }

      .hotline {
        text-align: center;
        font-size: 24rpx;
        color: rgba(0, 0, 0, 0.5);
        margin-bottom: 60rpx;
      }

      .feature-container {
        display: flex;
        flex-wrap: wrap;

        /* 两列布局：每个item占50% */
        .feature-item {
          width: 50%;
          padding: 20rpx;
          box-sizing: border-box;
          display: flex;
          align-items: center;

          .icon {
            width: 40rpx;
            height: 40rpx;
            margin-right: 20rpx;
          }

          .content {
            display: flex;
            flex-direction: column;
          }

          .feature-title {
            font-size: 24rpx;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
            margin-bottom: 8rpx;
          }

          .feature-desc {
            font-size: 20rpx;
            color: rgba(0, 0, 0, 0.5);
          }
        }
      }
    }
  }
}
.swiper-content {
  margin: 0rpx 32rpx 0rpx 32rpx;
  padding-top: v-bind(searchSwiperHeight);
  .title {
    color: rgba(0, 0, 0, 0.85);
    font-size: 36rpx;
    font-weight: 500;
    margin: 20rpx 20rpx 30rpx;
    position: relative;
    .subscript {
      width: 50rpx;
      height: 50rpx;
      position: absolute;
      top: 27rpx;
      left: 100rpx;
    }
  }
  .uni-margin-wrap {
    width: 690rpx;
    height: 280rpx;

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
.content-swiper {
  height: 500rpx;
  ::v-deep .uni-swiper-dots {
    bottom: 0rpx;
  }
  ::v-deep .uni-swiper-dot{
    border-radius: 0;
    height: 3px;
    background: rgb(255, 255, 255);
  }
}
/* 分类滚动栏样式 */
.category-scroll {
  width: 100%;
  white-space: nowrap;
  padding: 15rpx 0;
  box-sizing: border-box;
}
.category-item {
  display: inline-block;
  padding: 10rpx 25rpx;
  font-size: 28rpx;
  margin-right: 20rpx;
  color: #8a8c8c;
}
.category-item.active {
  color: rgb(23, 23, 23)
}
.category-name{
  position: relative;
  image{
    position: absolute;
    top: 5rpx;
    right: 20rpx;
    width: 45rpx;
    height: 30rpx;
  }
  .line{
    position: absolute;
    right: 3rpx;
    bottom: -3rpx;
    width: 20rpx;
    height: 1rpx;
    border: 2rpx solid #c6f0e1;
    margin-left: 40rpx;
  }
}
.goods-box {
  min-height: 400rpx;
  background: linear-gradient(280deg, #eafcf6, #fff);
  padding: 0 32rpx 20rpx 32rpx;
  border-radius: 20rpx;
}
.goods-scroll {
  width: 100%;
  white-space: nowrap;
}
 .shopping-img{
    width: 40rpx;
    height: 45rpx;
  }
.goods-item {
  display: inline-block;
}
.no-goods{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300rpx;
  color: #8a8c8c;
}
.goods-thumb {
  width: 180rpx;
  height: 180rpx;
  object-fit: cover;
  border-radius: 10rpx;
}
.goods-name {
  width: 200rpx;
  font-size: 26rpx;
  margin-top: 10rpx;
  margin-right: 20rpx;
  white-space: normal;
}
.goods-price {
  font-size: 28rpx;
  color: #ff5722;
  font-weight: bold;
  margin-top: 5rpx;
}
</style>
