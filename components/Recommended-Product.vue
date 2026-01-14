<template>
  <!-- 推荐商品 -->
  <view class="recommend">
    <view class="title">更多推荐</view>
    <view class="products">
      <view v-for="item in recommendedProducts" :key="item.id" @click="addCartFn(item, 'recommend')" class="product-item">
        <image :src="item.thumbnail" :alt="item.productName" class="products-img" />
        <view class="products-name">{{ item.name }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getRecommendedProducts } from '@/common/api/shoppingMall.js';

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
// 商品详情
const addCartFn = (item, type) => {
  uni.navigateTo({
    url: `/pages/shopping-mall/product-details?id=${item.id}`
  })
}

onMounted(() => {
  fetchRecommendedProducts();
})
</script>

<style lang="scss" scoped>
.recommend{
  margin: 40rpx 20rpx 130rpx;
  padding: 20rpx;
  border-radius: 20rpx;
  background: #fff;
  .title{
    font-size: 28rpx;
    margin-bottom: 20rpx;
  }
  .products{
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    justify-content: space-between;
    .product-item{
      display: flex;
      flex-direction: column;
      align-items: center;
      .products-img{
        width: 300rpx;
        height: 300rpx;
        border-radius: 16rpx;
        object-fit: cover;
      }
      .products-name{
        font-size: 24rpx;
        color: #666666;
        margin-top: 10rpx;
      }
    }
  }
}
</style>