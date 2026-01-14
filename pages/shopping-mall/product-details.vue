<!-- 商品详情 -->
<template>
  <view class="consult-detail-box">
    <scroll-view
      scroll-y
      class="scroll-content"
      :scroll-top="top"
      :show-scrollbar="false"
      scroll-with-animation
      id="scrollView"
    >
      <uni-nav-bar
        :backgroundColor="scrollTop > 15 ? '#fff' : 'transparent'"
        :border="false"
        :title="scrollTop > 15 ? consultantInfo.consultantName : ''"
        class="header-bar"
        :statusBar="true"
        fixed
      >
        <template v-slot:left>
          <view class="right">
            <uni-icons
              type="left"
              size="24"
              v-if="scrollTop > 15"
              @click="backFn"
            ></uni-icons>
            <image
              src="/static/common/back_circle.png"
              style="width: 56rpx; height: 56rpx"
              @click="backFn"
              v-else
            ></image>
          </view>
        </template>
      </uni-nav-bar>
      <view class="consult-detail-content">
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
                v-for="(item, index) in productDetails.mainImages"
                :key="index"
                class="swiper-item"
              >
                <image
                  :src="JSON.parse(item).url"
                  style="height: 100%; width: 100%"
                />
              </swiper-item>
            </swiper>
          </view>
        </view>
        <view class="consult-detail-info">
          <view class="detail-item-line-1">{{ productDetails.name }}</view>
          <view class="detail-item-line-2">
            <text v-for="value in productDetails.tags">
              <text>{{ value }}</text>
              <text v-if="value !== productDetails.tags[productDetails.tags.length - 1]"> | </text>
            </text>
          </view>
          <view class="detail-item-line-3">
            <view class="content">
              <uni-icons custom-prefix="iconfont" type="icon-xiaohuoche" size="20" color="#B5B5B5" class="icon" />
              <view class="express">
                <text>48小时发货</text>
                <view class="txt">快递费：包邮</view>
              </view>
            </view>
            <view class="content">
              <uni-icons custom-prefix="iconfont" type="icon-dunpai" size="20" color="#B5B5B5" class="icon" />
              <view class="guarantee">
                <view>严选好物</view>
                <view>售后无忧</view>
                <view>诚信为本</view>
                <view>货真价实</view>
              </view>
            </view>
            <view class="content" @click="openStandard">
              <uni-icons custom-prefix="iconfont" type="icon-yingyongAPP_o" size="20" color="#B5B5B5" class="icon" />
              <view class="standard">
                <view class="txt">选择规格</view>
                <uni-icons type="down" size="10" class="icon" />
              </view>
            </view>
          </view>

          <!-- 商品评价 -->
          <view class="product-details">
            <view class="content">
              <view class="title">
                <text>商品评价</text>
                <text class="line"></text>
              </view>
              <view class="comment" @click="openEvaluate">全部评论 > </view>
            </view>
            <view v-if="evaluationList.length === 0" class="no-evaluation">
              暂无评价
            </view>
            <view
              class="comment-item"
              v-for="(item, index) in evaluationList"
              :key="index"
            >
              <view class="item-header">
                <view class="user">
                  <image :src="item.avatar" style="border-radius: 50%" />
                  <text>{{ item.nickname }}</text>
                </view>
                <view class="date">{{ item.createTime }}</view>
              </view>
              <view class="comment-item-content">
                <mote-lines-divide
                  :line="3"
                  expandText="展开"
                  foldHint="收起"
                >
                  {{ item.content }}
                </mote-lines-divide>
              </view>
            </view>
          </view>
          <!-- 商品详情 -->
          <view class="product-details">
            <view class="content">
              <view class="title">
                <text>商品详情</text>
                <text class="line"></text>
              </view>
            </view>
            <view v-if="productDetails.detailImages == 0" class="no-evaluation">
              暂无商品详情
            </view>
            <image
              v-for="item in productDetails.detailImages"
              :key="item"
              :src="JSON.parse(item).url"
              mode="widthFix"
              style="width: 100%"
            />
          </view>

          <!-- 这里到底 -->
          <view class="anyway">
            <view class="content">
              <view class="wire">这里到底啦</view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="footer">
      <view class="follow">
        <image src="/static/common/follow.png"></image>
        <text>关注</text>
      </view>
      <view class="contact" @click="customerService">
        <image src="/static/common/contect.png"></image>
        <text>客服</text>
      </view>
      <view class="message-but">
        <view class="btn-cart" @click="addToCart">加入购物车</view>
        <view class="btn-buy"  @click="handleBuy">立即购买</view>
      </view>
    </view>
    <!-- 规格弹窗 -->
    <uni-popup ref="popup" type="bottom" border-radius="20rpx 20rpx 0 0">
      <view class="goods-container">
        <!-- 商品头图+信息 -->
        <view class="goods-header">
          <!-- 商品图片（替换为实际商品图） -->
          <image class="goods-img" :src="productDetails.thumbnail" mode="widthFix"></image>
          <view class="goods-info">
            <text class="goods-title">温馨坐凳居家必备首选</text>
            <text class="goods-price">¥{{ currentSku?.price || 0 }}</text>
            <!-- 数量加减 -->
            <view class="count-group">
              <view class="count-btn" @click="handleMinus" :disabled="count <= 1">-</view>
              <view class="count">{{ count }}</view>
              <view class="count-btn" @click="handlePlus">+</view>
            </view>
          </view>
        </view>
        <!-- 规格选择区域 -->
        <view class="spec-group">
          <!-- 颜色选择（拆分后独立选项） -->
          <view class="spec-item">
            <text class="spec-label">颜色</text>
            <view class="spec-options">
              <view 
                class="spec-option" 
                v-for="(color, idx) in colorOptions" 
                :key="idx"
                :class="{ active: selectedSpec.颜色 === color }"
                @click="handleSelectColor(color)"
              >
                {{ color }}
              </view>
            </view>
          </view>
          <!-- 尺寸选择 -->
          <view class="spec-item">
            <text class="spec-label">尺寸</text>
            <view class="spec-options">
              <view 
                class="spec-option" 
                v-for="(size, idx) in availableSizeOptions" 
                :key="idx"
                :class="{ active: selectedSpec.尺寸 === size }"
                @click="handleSelectSize(size)"
              >
                {{ size }}
              </view>
            </view>
          </view>
        </view>
        <!-- 底部操作按钮 -->
        <view class="btn-group">
          <view 
            v-show="isInCart == 'cart' || isInCart == 'standard'"
            class="cart-btn"
            :class="isInCart == 'cart' ? 'actives' : ''"
            @click="handleAddCart"
          >加入购物车</view>
          <view
            v-show="isInCart == 'buy' || isInCart == 'standard'"
            class="buy-btn"
            :class="isInCart == 'buy' ? 'actives' : ''"
            @click="handleBuyNow"
          >立即购买</view>
        </view>
      </view>
    </uni-popup>
    <!-- 客服 -->
    <CustomerService ref="serviceRef" />
  </view>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useGlobalDataStore } from "@/stores/global.js";
import { getProductDetail, addCart } from "@/common/api/shoppingMall.js";
import { getCommentByTargetUserId } from "@/common/api/worry.js";
import MoteLinesDivide from "@/components/mote-lines-divide/mote-lines-divide";
import CustomerService from "@/components/Customer-Service.vue";

const globalStore = useGlobalDataStore();
const statusBarHeight = ref(globalStore.statusBarHeight + "px");
const scrollTop = ref(0);
const top = ref(0);
const userIds = ref("");
const productDetails = ref({});

onLoad((options) => {
  fetchProductDetails(options.id);
  getCommentByTargetUserIdApi(options.id);
});

const backFn = () => {
  uni.navigateBack({ delta: 1 });
};

const fetchProductDetails = async (id) => {
  try {
    const response = await getProductDetail(id);
    productDetails.value = response.data;
    extractSpecOptions();
    matchCurrentSku();
  } catch (error) {
    console.log("获取商品详情失败:", error);
  }
};

// 客服
const serviceRef = ref(null);
const customerService = () => {
  serviceRef.value.open();
};

// 评价
const evaluationList = ref([]);
const getCommentByTargetUserIdApi = async (id) => {
  let { data } = await getCommentByTargetUserId({
    targetUserId: id,
    page: 1,
    pageSize: 2,
  });
  evaluationList.value = data.records;
};

// 选择规格
const isInCart = ref('purchase');
const openStandard = () => {
  isInCart.value = 'standard';
  popup.value.open();
}

// 立即购买
const popup = ref(null);
const handleBuy = () => {
  popup.value.open();
  isInCart.value = 'buy';
};

// 加入购物车
const addToCart = () => {
  popup.value.open();
  isInCart.value = 'cart';
};

const openEvaluate = () => {
  uni.navigateTo({
    url: `/pages/consult-feel/consult-feel?userId=${
      userIds.value
    }&userInfo=${JSON.stringify(consultantInfo.value)}`,
  });
};

// 响应式数据
const selectedSpec = ref({ 颜色: '', 尺寸: '' }) // 选中的规格
const colorOptions = ref([]) // 所有可选颜色
const sizeOptions = ref([])   // 所有可选尺寸（备用）
const availableSizeOptions = ref([]) // 当前颜色下可用的尺寸（核心联动）
const specMap = ref({}) // 颜色→尺寸的映射表 { 颜色: [尺寸1, 尺寸2...] }
const currentSku = ref(null) // 当前匹配的SKU
const count = ref(1)  // 购买数量

// 提取SKU中的规格选项（核心修改：颜色按逗号拆分+去重）
const extractSpecOptions = () => {
  // 构建颜色→尺寸的映射表
  const colorToSizes = {}
  productDetails.value.skuList.forEach(sku => {
    const { 颜色, 尺寸 } = sku.specValues
    // 初始化颜色对应的尺寸数组
    if (!colorToSizes[颜色]) {
      colorToSizes[颜色] = new Set() // 用Set去重
    }
    colorToSizes[颜色].add(尺寸)
  })
  specMap.value = colorToSizes

  // 提取所有唯一的颜色选项
  colorOptions.value = Object.keys(colorToSizes)
  
  // 提取所有唯一的尺寸选项（备用，非必须）
  const allSizes = new Set()
  productDetails.value.skuList.forEach(sku => allSizes.add(sku.specValues.尺寸))
  sizeOptions.value = Array.from(allSizes)

  // 自动选中第一个颜色，并加载对应尺寸
  if (colorOptions.value.length) {
    selectedSpec.value.颜色 = colorOptions.value[0]
    // 加载该颜色下的可用尺寸
    availableSizeOptions.value = Array.from(colorToSizes[selectedSpec.value.颜色])
    // 自动选中第一个可用尺寸
    if (availableSizeOptions.value.length) {
      selectedSpec.value.尺寸 = availableSizeOptions.value[0]
    }
  }
}

// 根据选中的规格匹配SKU（核心修改：判断颜色是否包含在SKU的颜色列表中）
const matchCurrentSku = () => {
  const { 颜色, 尺寸 } = selectedSpec.value
  // 未选全规格时不匹配
  if (!颜色 || !尺寸) {
    currentSku.value = null
    return
  }
  // 精准匹配：颜色和尺寸完全一致的SKU
  currentSku.value = productDetails.value.skuList.find(sku => {
    return sku.specValues.颜色 === 颜色 && sku.specValues.尺寸 === 尺寸
  })
}

// 选择颜色（重构后，增加联动逻辑）
const handleSelectColor = (color) => {
  selectedSpec.value.颜色 = color
  // 更新当前颜色下的可用尺寸
  availableSizeOptions.value = Array.from(specMap.value[color] || [])
  // 自动选中第一个可用尺寸（重置尺寸选中状态）
  if (availableSizeOptions.value.length) {
    selectedSpec.value.尺寸 = availableSizeOptions.value[0]
  } else {
    selectedSpec.value.尺寸 = ''
  }
  // 重新匹配SKU
  matchCurrentSku()
}

// 选择尺寸（仅需更新SKU匹配）
const handleSelectSize = (size) => {
  selectedSpec.value.尺寸 = size
  matchCurrentSku()
}

// 数量减
const handleMinus = () => {
  if (count.value > 1) count.value--
}

// 数量加
const handlePlus = () => {
  // 可选：添加库存限制 count.value < currentSku.value?.stock
  count.value++
}

// 加入购物车
const handleAddCart = async () => {
  if (!currentSku.value) {
    return showToast({ title: '请选择商品规格', icon: 'none' })
  }
  try {
    const response = await addCart({
      productId: productDetails.value.id, // 商品主ID
      quantity: count.value,              // 购买数量
      skuId: currentSku.value.id          // 选中的SKU ID
    })
    
    // 接口调用成功提示
    uni.showToast({ title: '加入购物车成功', icon: 'success' })
    // 关闭弹窗
    popup.value.close()
  } catch (error) {
    console.log(error);
  }
}

// 立即购买
const handleBuyNow = () => {
  if (!currentSku.value) {
    return showToast({ title: '请选择商品规格', icon: 'none' })
  }
  const data = {
    ...productDetails.value,
    currentSku: {
      ...currentSku.value,
      quantity: count.value
    },
    detailImages: null
  } 
  console.log(data);
  
  // 跳转到结算页（携带SKU、选中的颜色、数量参数）
  // uni.navigateTo({
  //   url: `/pages/shopping-mall/order-confirmation`,
  // })
}
</script>

<style lang="scss" scoped>
.consult-detail-box {
  $statusBarHeight: v-bind(statusBarHeight);
  width: 100vw;
  min-height: 100vh;
  height: auto;
  background-color: #f4f6f8;

  .scroll-content {
    height: calc(100vh - 108rpx);

    .consult-detail-content {
      width: 100vw;
      position: absolute;
      top: 0px;

      .header {
        .header-bar {
          ::v-deep(.uni-nav-bar-text) {
            font-size: 32rpx;
            font-weight: 600;
            color: #fff;
          }
        }
      }

      .headerActive {
        background-color: #fff;
      }
    }

    .consult-detail-content {
      .swiper-content {
        .uni-margin-wrap {
          width: 100vw;
          height: 590rpx;

          .swiper {
            width: 100vw;
            height: 590rpx;

            .swiper-item {
              width: 100vw;
              height: 590rpx;
              backdrop-filter: blur(133px);
            }

            ::v-deep .uni-swiper-dots {
              bottom: 100rpx !important;

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

      .consult-detail-info {
        width: 100vw;
        background: linear-gradient(180deg, #d4fff0 0%, #fff 1%, #fff 3%, #f5f5f5 0%);
        height: auto;
        border-top-right-radius: 40rpx;
        border-top-left-radius: 40rpx;
        margin-top: -40rpx;
        position: relative;
        z-index: 1;

        .detail-item-line-1 {
          padding: 32rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 38rpx;
          line-height: 38rpx;
          color: #000000;
        }

        .detail-item-line-2 {
          font-size: 26rpx;
          line-height: 26rpx;
          padding: 2rpx 32rpx;
          color: #757575;
        }

        .detail-item-line-3 {
          padding: 0rpx 60rpx 0 30rpx;
          margin-top: 24rpx;
          .content{
            padding: 10rpx 0;
            display: flex;
            align-items: center;
            .icon{
              margin-right: 20rpx;
            }
            .express{
              display: flex;
              text {
                margin-right: 50rpx;
                color: #EB9516;
              }
              .txt{
                color: #9E9E9E;
              }
            }
            .guarantee{
              width: 100%;
              display: flex;
              justify-content: space-between;
              color: #35CA95;
            }
            .standard{
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 100%;
              background: #F2F2F2;
              padding: 5rpx 10rpx;
              border-radius: 5rpx;
              .txt{
                font-size: 22rpx;
                color: #9E9E9E;
              }
            }
          }
        }

        .product-details{
          margin-top: 30rpx;
          background-color: #fff;
          border-radius: 30rpx;
          .content{
            padding: 28rpx 28rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .title{
              display: flex;
              flex-direction: column;
              font-size: 35rpx;
              .line{
                width: 48rpx;
                height: 10rpx;
                background: linear-gradient(to right, #35ca95, #ffffff);
                border-radius: 5rpx;
                margin-left: 90rpx;
              }
            }
            .comment{
              color: #959595;
            }
          }
          .no-evaluation{
            padding: 28rpx 0;
            margin: 0 50rpx;
            color: #959595;
            text-align: center;
          }
          .comment-item{
            padding: 28rpx 0;
            margin: 0 50rpx;
            border-bottom: 1px solid rgba(0, 0, 0, 0.04);
            .item-header{
              margin-bottom: 20rpx;
              display: flex;
              justify-content: space-between;
              .user{
                display: flex;
                align-items: center;
                image{
                  width: 48rpx;
                  height: 48rpx;
                }
                text{
                  margin-left: 14rpx;
                  font-size: 24rpx;
                  letter-spacing: 0px;
                  color: rgba(0, 0, 0, 0.65);
                }
              }
            }
          }
        }

        .anyway {
          margin: 20rpx 0;
          .content {
            background-color: transparent;
            .wire {
              text-align: center;
              position: relative;
              color: rgba(0, 0, 0, 0.6);
              font-size: 28rpx;
            }
            .wire:before {
              content: '';
              position: absolute;
              width: 258rpx;
              height: 2rpx;
              background-color: rgba(0, 0, 0, 0.06);
              top: 15rpx;
              left: 0;
            }
            .wire:after {
              content: '';
              position: absolute;
              width: 258rpx;
              height: 2rpx;
              background-color: rgba(0, 0, 0, 0.06);
              top: 15rpx;
              right: 0;
            }
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
    .follow{
      margin-left: 50rpx;
    }
    .follow,
    .contact {
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
      position: relative;
      display: flex;
      color: #fff;
      height: 100%;
      width: 60%;
      font-size: 30rpx;
      
      .btn-cart {
        padding: 0 30rpx;
        width: 100%;
        background-color: #FCD146;
        display: flex;
        align-items: center;
      }

      .btn-buy {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        right: 0;
        width: 50%;
        height: 100%;
        background-color: #72D2A8;
      }
      .btn-cart:active,
      .btn-buy:active { opacity: 0.8; }
    }
  }
}
.goods-container {
  padding: 20rpx 50rpx;
  background: #fff;
  width: 750rpx;
  height: 1142rpx;
  opacity: 1;
  line-height: 1;
  border-radius: 20rpx 20rpx 0 0;
}
.goods-header {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;
}
.goods-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 16rpx;
}
.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.goods-title {
  font-size: 32rpx;
  color: #333;
  line-height: 44rpx;
}
.goods-price {
  text-align: right;
  font-size: 36rpx;
  color: #f00;
  font-weight: bold;
}
.count-group {
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  width: 200rpx;
  padding: 15rpx;
  background: #F8F8F8;
  justify-content: space-between;
}
.count-btn {
  width: 50rpx;
  color: #B8B7B7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 38rpx;
  line-height: 20rpx;
}
.count-btn:first-child {
  border-right: 3rpx solid #B8B7B7;
}
.count-btn:last-child {
  border-left: 3rpx solid #B8B7B7;
}
.count {
  color: #B8B7B7;
  width: 70rpx;
  text-align: center;
  font-size: 28rpx;
}
.spec-group {
  margin-bottom: 60rpx;
}
.spec-item {
  margin-bottom: 30rpx;
}
.spec-label {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}
.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.spec-option {
  padding: 16rpx 30rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #A6A6A6;
  background: #f9f9f9;
}
.spec-option.active {
  background: #D7F1E8;
  color: #53CEA2;
}
.btn-group {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  width: calc(100% - 100rpx);
  height: 80rpx;
  text-align: center;
  font-weight: bold;
  font-size: 34rpx;
  color: #fff;
  margin: 30rpx 50rpx;
  line-height: 80rpx;
}
.cart-btn {
  flex: 1;
  background: #f9d152;
  border: none;
  width: 40%;
  border-radius: 20rpx 0 0 20rpx;
}
.buy-btn {
  flex: 1;
  background: #5bdb98;
  border: none;
  width: 40%;
  border-radius: 0 20rpx 20rpx 0;
}
.actives {
  border-radius: 20rpx;
}
</style>
