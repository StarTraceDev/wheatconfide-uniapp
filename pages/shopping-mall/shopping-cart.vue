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
        <uni-nav-bar :class="scrollTop > 15 ? 'scrollClass' : ''" backgroundColor="rgba(255,255,255,0)" :border="false" title="购物车" class="header-bar">
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
            <uni-icons type="trash-filled" size="20" color="#ff0000" />
            <view>删除</view>
          </view>
          <view class="boundary"></view>
          <view class="function-icon clear" @click="clearCartFn">
            <uni-icons type="clear" color="#34C759" size="20" />
            <view>清空</view>
          </view>
        </view>
        <!-- 购物车列表 -->
        <view class="lists">
          <view class="empty-cart" v-if="cartList.length == 0">
            <image src="/static/settled/shopping-cart.png" />
            <view>小车空空啦，快去加购吧</view>
          </view>
          <view class="cart-item" v-for="(item, index) in cartList" :key="item.id">
            <!-- 滑动容器：movable-area + movable-view 实现左滑 -->
            <movable-area class="movable-area">
              <movable-view 
                class="movable-view" 
                direction="horizontal" 
                :x="item.slideX" 
                @touchstart="handleTouchStart(index, $event)"
                @touchmove="handleTouchMove(index, $event)"
                @touchend="handleTouchEnd(index)"
              >
                <!-- 商品内容区 -->
                <view class="cart-item-content">
                  <view :class="{ 'cart-item-show': Math.abs(item.slideX) > 0 }"></view>
                  <!-- 单选按钮 -->
                  <view class="cart-radio-wrap" @click="handleCheckToggle(index)">
                    <uni-icons :type="item.checked ? 'checkbox-filled' : 'circle'" size="25" :color="item.checked ? '#ff9900' : '#ccc'"></uni-icons>
                  </view>
                  
                  <!-- 商品信息 -->
                  <view class="cart-item-info">
                    <!-- 商品图片 -->
                    <image class="cart-item-img"
                      :src="item.thumbnail"
                      mode="widthFix"
                      @click="addCartFn(item, 'cart')"
                    />
                    <!-- 商品详情 -->
                    <view class="cart-item-detail">
                      <text class="cart-item-title" @click="addCartFn(item, 'cart')">{{ item.productName }}</text>
                      <view class="cart-item-spec" @click="addCartFn(item, 'cart')">
                        <text>{{ Object.values(item.specValues).join(";")}}</text>
                        <text class="cart-item-price">¥{{ item.price }}</text>
                      </view>
                      <!-- 数量控制 -->
                      <view class="count-group">
                        <view class="count-btn minus-btn" @click="handleMinus(index)" :disabled="item.quantity <= 1">
                          <view>-</view>
                          <view class="line"></view>
                        </view>
                        <view class="count">{{ item.quantity }}</view>
                        <view class="count-btn plus-btn" @click="handlePlus(index)">
                          <view class="line"></view>
                          <view>+</view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
                
                <!-- 删除按钮（滑动后显示） -->
                <view class="cart-item-delete" @click="handleSingleDelete(item)">
                  <uni-icons type="trash-filled" size="25" color="#fff" />
                  <text class="delete-text">删除</text>
                </view>
              </movable-view>
            </movable-area>
          </view>
        </view>
        <!-- 推荐 -->
        <RecommendedProduct />
      </view>
    </scroll-view>
    <view class="footer">
      <view class="all-check" @click="handleAllCheck()">
        <uni-icons :type="selectAll ? 'checkbox-filled' : 'circle'" size="25" :color="selectAll ? '#ff9900' : '#ccc'"></uni-icons>
        全选
      </view>
      <view class="message-but">
        <view class="btn-cart" @click="addToCart">
          <view>合计：</view>
          <view class="total-price">¥{{ totalPrice }}</view>
        </view>
        <view class="btn-buy"  @click="handleBuy">结算</view>
      </view>
    </view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGlobalDataStore } from '@/stores/global.js';
import { useOrderStore } from '@/stores/orderStore.js';
import { onShow, onPageScroll } from '@dcloudio/uni-app'
import {
  getCartList,
  getRecommendedProducts,
  deleteCartItem,
  batchDeleteCartItems,
  updateCartItem 
} from '@/common/api/shoppingMall.js';
import RecommendedProduct from '@/components/Recommended-Product.vue';

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

const cartList = ref([])

// 搜索
const searchFn=(e)=>{
  console.log('搜索关键词:', e.value);
}

// 获取购物车列表
const fetchCartList = async () => {
  try {
    const { data } = await getCartList();
    data.forEach((item) => {
      item.checked = false
    })
    cartList.value = data
  } catch (error) {
    console.error('获取购物车列表失败:', error);
  }
};

// 获取推荐商品
const recommendedProducts = ref([]);
const fetchRecommendedProducts = async () => {
  try {
    const { data } = await getRecommendedProducts();
    recommendedProducts.value = data;
  } catch (error) {
    console.error('获取推荐商品失败:', error);
  }
};

// 计算属性：是否全选
const isAllChecked = computed(() => {
  return cartList.value.every(item => item.checked)
})

// 计算属性：选中商品的总价
const totalPrice = computed(() => {
  return cartList.value
    .filter(item => item.checked)
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2)
})

// 核心修改：单选切换（点击选中，再次点击取消）
const handleCheckToggle = (index) => {
  resetAllSlide()
  cartList.value[index].checked = !cartList.value[index].checked
  saveCart()
}

// 全选/取消全选
const selectAll = ref(false)
const handleAllCheck = (e) => {
  resetAllSlide()
  const checkedStatus = !isAllChecked.value
  selectAll.value = checkedStatus
  cartList.value.forEach(item => {
    item.checked = checkedStatus
  })
  saveCart()
}

// 数量减少
const handleMinus = (index) => {
  resetAllSlide()
  if (cartList.value[index].quantity > 1) {
    cartList.value[index].quantity--
    updateCartItemApi(cartList.value[index].id, cartList.value[index].quantity)
    saveCart()
  } else {
    showToast({ title: '数量不能少于1', icon: 'none' })
  }
}

// 数量增加
const handlePlus = (index) => {
  resetAllSlide()
  cartList.value[index].quantity++
  updateCartItemApi(cartList.value[index].id, cartList.value[index].quantity)
  saveCart()
}

// 更新商品数量
const updateCartItemApi = async (id, quantity) => {
  try {
    await updateCartItem({ id, quantity })
  } catch (error) {
    console.error('更新购物车失败:', error);
  }
}

// 单个商品左滑删除
const handleSingleDelete = async (item) => {
  try {
    await deleteCartItem({ id: item.id });
    fetchCartList();
    saveCart()
    showToast({ title: '删除成功', icon: 'success' })
  } catch (error) {
    console.error('删除购物车商品失败:', error);
  }
}

// 滑动相关逻辑
let startX = 0 // 触摸起始X坐标
const deleteWidth = 120 // 删除按钮宽度（rpx）

// 触摸开始
const handleTouchStart = (index, e) => {
  resetAllSlide() // 触摸新商品时，关闭其他商品的滑动
  startX = e.touches[0].clientX
  cartList.value[index].isSliding = true
}

// 触摸移动
const handleTouchMove = (index, e) => {
  const item = cartList.value[index]
  if (!item.isSliding) return

  const moveX = e.touches[0].clientX
  const diffX = startX - moveX // 滑动距离（正数=左滑）
  
  // 限制滑动范围：0（未滑动）~ -deleteWidth（完全露出删除按钮）
  if (diffX <= 0) {
    item.slideX = 0
  } else if (diffX >= deleteWidth) {
    item.slideX = -deleteWidth
  } else {
    item.slideX = -diffX
  }
}

// 触摸结束
const handleTouchEnd = (index) => {
  const item = cartList.value[index]
  item.isSliding = false
  
  // 滑动距离超过删除按钮宽度的一半，自动滑开；否则回弹
  if (Math.abs(item.slideX) > deleteWidth / 2) {
    item.slideX = -deleteWidth
  } else {
    item.slideX = 0
  }
}

// 重置所有商品的滑动状态
const resetAllSlide = () => {
  cartList.value.forEach(item => {
    item.slideX = 0
    item.isSliding = false
  })
}

// 保存购物车数据
const saveCart = () => {}

// 删除购物车
const deleteCartFn = async () => {
  const selectedIds = cartList.value
    .filter(item => item.checked)
    .map(item => item.id)
  
  if (selectedIds.length === 0) {
    uni.showToast({ title: '请选择要删除的商品', icon: 'none' })
    return
  }
  uni.showModal({
    title: '确认删除',
    content: '是否删除选中的商品？',
    async success(res) {
      if (res.confirm) {
        try {
          await batchDeleteCartItems({ ids: selectedIds })
          await fetchCartList()
          uni.showToast({ title: '删除成功', icon: 'success' })
        } catch (error) {
          console.error('批量删除失败:', error)
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    }
  })
}

// 清空购物车
const clearCartFn = async () => {
  const allIds = cartList.value.map(item => item.id)
  
  if (allIds.length === 0) {
    uni.showToast({ title: '购物车已为空', icon: 'none' })
    return
  }

  uni.showModal({
    title: '确认清空',
    content: '是否清空整个购物车？',
    async success(res) {
      if (res.confirm) {
        try {
          await batchDeleteCartItems({ ids: allIds })
          cartList.value = [] // 或调用 fetchCartList()
          uni.showToast({ title: '清空成功', icon: 'success' })
        } catch (error) {
          console.error('清空购物车失败:', error)
          uni.showToast({ title: '清空失败', icon: 'none' })
        }
      }
    }
  })
}

// 商品详情
const addCartFn = (item) => {
  uni.navigateTo({
    url: `/pages/shopping-mall/product-details?id=${item.productId}`
  })
  console.log('添加到购物车:', item);
}

// 立即购买
const orderStore = useOrderStore()
const handleBuy = () => {
  const selectedIds = cartList.value .filter(item => item.checked)
  if(selectedIds.length === 0) {
    uni.showToast({ title: '请选择要购买的商品', icon: 'none' })
    return
  }

  orderStore.setOrderList(selectedIds)
  // 跳转到结算页（携带SKU、选中的颜色、数量参数）
  uni.navigateTo({
    url: `/pages/shopping-mall/order-confirmation?type=shoppingCart`,
  })
}

onShow(() => {
  fetchCartList();
  fetchRecommendedProducts();
})
</script>

<style lang="scss" scoped>
$base-padding: 20rpx;
$border-color: #f5f5f5;
$text-color-main: #333;
$text-color-sub: #999;
$text-color-price: #f00;
$btn-plus-color: #2ed573;
$delete-btn-bg: #f00;
$delete-btn-color: #fff;
$font-size-sm: 28rpx;
$font-size-md: 32rpx;
$border-radius-sm: 8rpx;
$border-radius-md: 12rpx;
$delete-width: 120rpx;
$radio-size: 36rpx; // 单选按钮大小
$radio-checked-color: #ff9900; // 单选选中颜色（匹配示例）
  
.settled-box {
  $statusBarHeight: v-bind(statusBarHeight);
  width: 100vw;
  min-height: 100vh !important;
  background-image: url("@/static/settled/settled-bg.png");
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
      padding-top: calc($statusBarHeight - 50rpx);
      .features{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20rpx 0;

        .function-icon{
          width: 100rpx;
          display: flex;
          align-items: center;
          font-size: 24rpx;
          color: #333333;
          justify-content: center;
        }
        .boundary{
          background: #DEDEDF;
          height: 20rpx;
          width: 3rpx;
        }
        .clear{
          margin-right: 20rpx;
        }
      }
      .lists{
        margin: 0 20rpx 40rpx;
        padding: 20rpx;
        border-radius: 20rpx;
        background: #f8faf9;
        .empty-cart{
          display: flex;
          align-items: center;
          justify-content: center;
          image{
            width: 120rpx;
            height: 100rpx;
          }
          view{
            font-size: 24rpx;
            color: #999999;
          }
        }
        .movable-area {
          width: 100%;
          height: 220rpx;
          overflow: hidden;
          margin-bottom: $base-padding;
          border-radius: $border-radius-md;
          border: 1px solid $border-color;
        }
        .movable-view {
          width: calc(100% + #{$delete-width});
          height: 100%;
          display: flex;
        }
        .cart-item-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          box-sizing: border-box;

          .cart-radio-wrap {
            margin-right: $base-padding;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .cart-radio {
            width: $radio-size;
            height: $radio-size;
            border: 2rpx solid #ccc;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;

            // 选中状态样式
            &.checked {
              border-color: $radio-checked-color;
              background-color: rgba($radio-checked-color, 0.1);
            }

            // 单选圆点
            .radio-dot {
              width: 20rpx;
              height: 20rpx;
              border-radius: 50%;
              background-color: $radio-checked-color;
            }
          }
          .cart-item-info {
            flex: 1;
            display: flex;
            gap: $base-padding;
            .cart-item-img {
              width: 160rpx;
              height: 160rpx;
              border-radius: $border-radius-md;
            }
            .cart-item-detail {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              margin-right: 30rpx;

              .cart-item-title {
                font-size: $font-size-md;
                color: $text-color-main;
                line-height: 44rpx;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
              .cart-item-spec {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: $font-size-sm;
                color: $text-color-sub;
                margin: 10rpx 0;
              }
              .cart-item-price {
                font-size: $font-size-md;
                color: $text-color-price;
                font-weight: bold;
              }
              .count-group {
                display: flex;
                align-items: center;
                width: 180rpx;
                margin-top: 10rpx;
                background: #F6F5F6;
                color: #A2A2A2;
                padding: 0 10rpx;
                border-radius: $border-radius-sm;
                .count-btn {
                  height: 50rpx;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 34rpx;
                  .line {
                    margin: 0 15rpx;
                    width: 2rpx;
                    height: 20rpx;
                    background: #A2A2A2;
                  }
                }
                .count {
                  width: 60rpx;
                  text-align: center;
                }
              }
            }
          }
          .cart-item-show {
            position: absolute;
            top: 0;
            left: 0;
            right: 100rpx;
            bottom: 0;
            z-index: 1;
            background-color: rgba(0, 0, 0, 0.25);
          }
        }
        .cart-item-delete {
          width: $delete-width;
          height: 100%;
          background: $delete-btn-bg;
          color: $delete-btn-color;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10rpx;
          .delete-text {
            font-size: $font-size-sm;
          }
        }
      }
    }
  }
  .footer {
    width: 100vw;
    height: 108rpx;
    display: flex;
    background: #ffffff;
    position: fixed;
    bottom: 0rpx;
    justify-content: space-between;
    align-items: center;
    .all-check{
      display: flex;
      align-items: center;
      color: #7c7c7c;
      margin-left: 20rpx;
    }
    .follow{
      margin-left: 50rpx;
    }
    .follow {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 18rpx;
      color: rgba(0, 0, 0, 0.6);
      image {
        width: 36rpx;
        height: 36rpx;
      }
    }
    .message-but{
      display: flex;
      height: 100%;
      font-size: 30rpx;
      align-items: center;
      margin: 0 30rpx;
      .btn-cart {
        display: flex;
        align-items: center;
        margin-right: 30rpx;
        color: #7c7c7c;
        .total-price {
          color: $text-color-price;
          font-weight: bold;
        }
      }

      .btn-buy {
        padding: 10rpx 50rpx;
        border-radius: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        background-color: #FF8F1F;
      }
    }
  }
}
::v-deep .uni-searchbar{
  width: 65% !important;
}
::v-deep .uni-searchbar__box {
  flex-direction: row-reverse !important;
  padding: 5px 8px 5px 10px !important;
  justify-content: space-between !important;
}
::v-deep .uni-searchbar__box .uni-icons{
  color: #333333 !important;
}
</style>