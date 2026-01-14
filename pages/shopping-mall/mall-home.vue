<template>
	<view class="settled-box">
    <scroll-view
      scroll-y
      class="scroll-content"
      :scroll-top="top"
      :show-scrollbar="false"
      scroll-with-animation
      id="scrollView"
    >
      <view class="header">
        <uni-nav-bar :class="scrollTop > 15 ? 'scrollClass' : ''" backgroundColor="rgba(255,255,255,0)" :border="false" title="健康商城" class="header-bar">
          <template v-slot:left>
            <uni-icons type="left" size="24" @click="backFn"></uni-icons>
          </template>
        </uni-nav-bar>
      </view>
      <view class="content">
        <!-- 搜索 -->
        <view class="features">
          <uni-search-bar
            class="uni-mt-10"
            radius="100"
            placeholder="请输入商品名称搜索"
            clearButton="auto"
            cancelButton="none"
            @confirm="searchFn"
          />
          <view class="function-icon" @click="deleteCartFn">
            <uni-icons custom-prefix="iconfont" type="icon-wenjianjia" size="15" color="#434746" />
            <view style="margin-left: 10rpx;">商品订单</view>
          </view>
        </view>
        <!-- 商品分类 -->
        <view class="category-container">
          <!-- 左侧一级分类 -->
          <scroll-view class="left-category" scroll-y>
            <view 
              class="first-item" 
              :class="{ active: item.id === activeFirstId }"
              v-for="item in categoryList" 
              :key="item.id"
              @click="selectFirstCategory(item)"
            >
              <view class="first-title">
                <view>{{ item.name }}</view>
                <image v-if="item.id === activeFirstId" src="/static/settled/selectimg.png" />
              </view>
              <view v-show="item.id == activeFirstId" class="first-line"></view>
            </view>
          </scroll-view>

          <!-- 右侧内容（一级商品 + 二级分类） -->
          <scroll-view class="right-content" scroll-y>
            <!-- 一级分类商品列表（如果有） -->
            <view v-if="getFirstGoods(activeFirstId).length" class="first-goods-list">
              <view class="goods-item" v-for="goods in getFirstGoods(activeFirstId)" :key="goods.id" @click="goProductDetail(goods.id)">
                <image :src="goods.thumbnail" class="goods-img"></image>
                <view class="goods-info">
                  <text class="goods-name">{{ goods.name }}</text>
                  <view class="goods-tag">
                    <text v-for="tag in goods.tags" :key="tag" class="tag-text">{{ tag }}</text>
                  </view>
                  <view class="goods-action">
                    <text class="goods-price">¥{{ goods.minPrice }}</text>
                    <uni-icons type="plus-filled" size="30" color="#EB9516" class="add-btn" />
                  </view>
                </view>
              </view>
            </view>

            <!-- 二级分类列表 -->
            <view v-if="currentSecondList.length">
              <view 
                class="second-item" 
                v-for="secondItem in currentSecondList" 
                :key="secondItem.id"
                @click="toggleSecondExpand(secondItem)"
              >
                <!-- 二级分类标题 -->
                <view class="second-title">
                  <text class="title-text">{{ secondItem.name }}</text>
                  <uni-icons
                    custom-prefix="iconfont"
                    :type="isExpanded(secondItem.id) ? 'icon-chevronsdownshuangxiajiantou' : 'icon-chevronsup-top'"
                    size="18"
                    color="#A09797"
                  />
                </view>

                <!-- 二级分类商品列表 -->
                <view class="goods-list" v-if="isExpanded(secondItem.id)">
                  <view class="goods-item" v-for="goods in getGoods(secondItem.id)" :key="goods.id" @click="goProductDetail(goods.id)">
                    <image :src="goods.thumbnail" class="goods-img"></image>
                    <view class="goods-info">
                      <text class="goods-name">{{ goods.name }}</text>
                      <view class="goods-tag">
                        <text v-for="tag in goods.tags" :key="tag" class="tag-text">{{ tag }}</text>
                      </view>
                      <view class="goods-action">
                        <text class="goods-price">¥{{ goods.minPrice }}</text>
                        <uni-icons type="plus-filled" size="30" color="#EB9516" class="add-btn" />
                      </view>
                    </view>
                  </view>
                  <view v-if="getGoods(secondItem.id).length == 0" class="empty-tip">暂无商品</view>
                </view>
              </view>
            </view>

            <!-- 空提示：无一级商品 + 无二级分类 -->
            <view v-else-if="!getFirstGoods(activeFirstId).length" class="empty-tip">暂无商品</view>
          </scroll-view>
        </view>
      </view>
    </scroll-view>
    <view class="footer" @click="uni.navigateTo({url: '/pages/shopping-mall/shopping-cart'})">
      <uni-icons type="cart" size="35" color="#FF9800" />
    </view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGlobalDataStore } from '@/stores/global.js';
import { onLoad, onPageScroll } from '@dcloudio/uni-app'
import { postCategoryList, getProductsByCategory,  getCartList, getRecommendedProducts, deleteCartItem, batchDeleteCartItems } from '@/common/api/shoppingMall.js';

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

// 搜索
const searchFn=(e)=>{
  console.log('搜索关键词:', e.value);
}

// 获取商品分类列表
const categoryList = ref([]);
const fetchCategoryList = async () => {
  try {
    const { data } = await postCategoryList();
    categoryList.value = data;
  } catch (error) {
    console.error('获取商品分类列表失败:', error);
  }
};

// 当前选中的一级分类ID
const activeFirstId = ref("");
// 已展开的二级分类ID列表
const expandSecondIds = ref([]);
// 二级分类商品映射
const goodsMap = ref({});
// 一级分类商品映射
const goodsFirstMap = ref({});
// 记录各分类的加载状态（区分一级/二级）
const loadingMap = ref({});

// 计算当前选中一级分类的二级列表
const currentSecondList = computed(() => {
  const currentFirst = categoryList.value.find(item => item.id === activeFirstId.value);
  return currentFirst ? currentFirst.children : [];
});

// 选择一级分类
const selectFirstCategory = async (item) => {  
  activeFirstId.value = item.id;
  expandSecondIds.value = []; // 切换一级分类时，清空二级展开状态
  // 加载当前一级分类的商品
  await fetchCategoryProducts(item.id, 'first');
};

// 切换二级分类的展开/收起
const toggleSecondExpand = async (secondItem) => {
  const secondId = secondItem.id;
  const idx = expandSecondIds.value.indexOf(secondId);
  
  if (idx > -1) {
    // 收起二级分类
    expandSecondIds.value.splice(idx, 1);
  } else {
    // 展开二级分类：先请求商品数据（若无则请求）
    expandSecondIds.value.push(secondId);
    if (!goodsMap.value[secondId] && !loadingMap.value[`second-${secondId}`]) {
      await fetchCategoryProducts(secondId, 'second');
    }
  }
};

// 判断二级分类是否展开
const isExpanded = (secondId) => {
  return expandSecondIds.value.includes(secondId);
};

// 根据二级分类ID获取商品列表
const getGoods = (secondId) => {
  return goodsMap.value[secondId] || [];
};

// 根据一级分类ID获取商品列表
const getFirstGoods = (firstId) => {
  return goodsFirstMap.value[firstId] || [];
};

// 获取分类商品（支持一级/二级）
const fetchCategoryProducts = async (categoryId, level = 'second') => {
  try {
    // 标记加载中（区分一级/二级）
    const loadingKey = `${level}-${categoryId}`;
    loadingMap.value[loadingKey] = true;
    
    // 调用接口（如需区分层级，可给接口传level参数）
    const { data } = await getProductsByCategory({ 
      categoryId: categoryId,
      level: level // 接口如果需要区分一级/二级分类，传该参数
    });
    
    // 存储商品数据（区分一级/二级）
    if (level === 'first') {
      goodsFirstMap.value[categoryId] = data.records || [];
    } else {
      goodsMap.value[categoryId] = data.records || [];
    }
  } catch (error) {
    console.error(`获取${level}分类${categoryId}商品失败:`, error);
    // 失败时置空，避免重复请求
    if (level === 'first') {
      goodsFirstMap.value[categoryId] = [];
    } else {
      goodsMap.value[categoryId] = [];
    }
  } finally {
    // 取消加载标记
    const loadingKey = `${level}-${categoryId}`;
    loadingMap.value[loadingKey] = false;
  }
};

// 获取购物车列表
const fetchCartList = async () => {
  try {
    const response = await getCartList();
    console.log('购物车列表数据:', response);
  } catch (error) {
    console.error('获取购物车列表失败:', error);
  }
};

// 订单列表
const deleteCartFn = () => {
  
  uni.navigateTo({
    url: `/pages/shopping-mall/order-list`
  })
}

// 商品详情
const goProductDetail = (id) => {
  uni.navigateTo({
    url: `/pages/shopping-mall/product-details?id=${id}`
  })
}

// 页面初始化
onLoad(async () => {
  await fetchCategoryList(); // 先加载分类列表
  // 初始化：默认选中第一个一级分类并加载其商品
  if (categoryList.value.length) {
    activeFirstId.value = categoryList.value[0].id;
    await fetchCategoryProducts(categoryList.value[0].id, 'first');
  }
});
</script>

<style lang="scss" scoped>
.settled-box {
  $statusBarHeight: v-bind(statusBarHeight);
  width: 100vw;
  min-height: 100vh !important;
  background-image: url("@/static/settled/mall-bg.png");
  background-size: 100vw 632rpx;
  background-repeat: no-repeat;
  background-color: #f4f6f8;
  .scroll-content {
    width: 100vw;
    min-height: 100vh !important;
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
      padding-top: calc($statusBarHeight - 60rpx);
      .features{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20rpx 0;

        .function-icon{
          margin-right: 30rpx;
          display: flex;
          align-items: center;
          font-size: 24rpx;
          color: #333333;
          justify-content: center;
        }
      }
      .category-container {
        display: flex;
        height: 100vh;
        background-color: #fff;
        padding: 20rpx;
        border-radius: 30rpx;
        .left-category {
          width: 170rpx;
          border-right: 2rpx solid #D8D8D8;
          color: #9E9E9E;
          .first-item {
            display: flex;
            padding: 20rpx 0;
            text-align: center;
            font-size: 28rpx;
            align-items: center;
            justify-content: space-between;
          }
          .first-item.active {
            color: #0A0A0A;
          }
          .first-title {
            margin-left: 20rpx;
            position: relative;
            image{
              position: absolute;
              top: 10rpx;
              right: 30rpx;
              width: 45rpx;
              height: 30rpx;
            }
          }
          .first-line {
            height: 15rpx;
            width: 3rpx;
            background-color:#86E3C2;
            margin-right: 1rpx;
          }
        }
        .right-content {
          flex: 1;
          padding: 20rpx;
          .second-item {
            margin-bottom: 40rpx;
            .second-title {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15rpx;
            }
          }
        }
      }
    }
  }
  .footer{
    position: fixed;
    bottom: 30%;
    right: 70rpx;
    width: 90rpx;
    height: 90rpx;
    background-color: #FCEBB6;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
::v-deep .uni-searchbar{
  width: 75% !important;
}
::v-deep .uni-searchbar__box {
  flex-direction: row-reverse !important;
  padding: 5px 8px 5px 10px !important;
  justify-content: space-between !important;
}
::v-deep .uni-searchbar__box .uni-icons{
  color: #333333 !important;
}
.first-goods-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 40rpx;
}
.goods-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.goods-item {
  display: flex;
  align-items: center;
  padding: 15rpx;
}
.goods-img {
  width: 190rpx;
  height: 190rpx;
  border-radius: 20rpx;
  margin-right: 20rpx;
}
.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.goods-name {
  width: 260rpx;
  font-size: 28rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.goods-tag {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  font-size: 24rpx;
  color: #AFAFAF;
}
.goods-action{
  display: flex;
  justify-content: space-between;
}
.goods-price {
  font-size: 30rpx;
  color: #FF5722;
  font-weight: bold;
}
.add-btn {
  color: #FF9800;
}
.empty-tip {
  text-align: center;
  font-size: 28rpx;
  color: #999;
  padding: 50rpx 0;
}
</style>