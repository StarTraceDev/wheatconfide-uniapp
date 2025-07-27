<template>
  <!-- #ifdef MP-WEIXIN -->
  <view 
    class="custom-navbar"
    :style="{
      height: navbarHeight + 'px',
      paddingRight: menuRight + 'px'
    }"
  >
    <!-- 状态栏占位 -->
    <view :style="{ height: statusBarHeight + 'px' }"></view>
    
    <!-- 导航栏内容 -->
    <view class="navbar-content">
      <!-- 左侧内容 -->
      <slot name="left">
        <text 
          v-if="showBack"
          class="back-btn"
          @click="handleBack"
        >返回</text>
      </slot>

      <!-- 中间标题 -->
      <view class="title-container">
        <slot name="title">
          <text class="title">{{ title }}</text>
        </slot>
      </view>

      <!-- 右侧胶囊占位 -->
      <view 
        class="capsule-placeholder"
        :style="{
          width: menuWidth + 'px',
          height: menuHeight + 'px'
        }"
      ></view>
    </view>
  </view>
  <!-- #endif -->

  <!-- #ifdef APP-PLUS -->
  <view class="app-navbar">
    <!-- APP 原生导航栏 -->
    <uni-nav-bar 
      :title="title" 
      :left-icon="backIcon"
      @clickLeft="handleBack"
    />
  </view>
  <!-- #endif -->
</template>

<script>
export default {
  props: {
    title: String,
    showBack: {
      type: Boolean,
      default: true
    },
    backIcon: {
      type: String,
      default: 'left'
    }
  },
  data() {
    return {
      statusBarHeight: 20,    // 默认状态栏高度
      navbarHeight: 44,       // 默认导航栏高度
      menuWidth: 87,          // 胶囊宽度
      menuHeight: 32,         // 胶囊高度
      menuRight: 7            // 胶囊右边距
    }
  },
  mounted() {
    // #ifdef MP-WEIXIN
    this.initWeixinNavbar()
    // #endif
  },
  methods: {
    // 初始化微信导航栏参数
    initWeixinNavbar() {
      const systemInfo = uni.getSystemInfoSync()
      const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
      
      this.statusBarHeight = systemInfo.statusBarHeight || 20
      this.menuWidth = menuButtonInfo.width
      this.menuHeight = menuButtonInfo.height
      this.menuRight = systemInfo.windowWidth - menuButtonInfo.right
      
      // 计算导航栏总高度
      this.navbarHeight = menuButtonInfo.top + menuButtonInfo.height + 
        (menuButtonInfo.top - this.statusBarHeight)
    },
    
    handleBack() {
      this.$emit('back')
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
/* 微信小程序样式 */
.custom-navbar {
  width: 100%;
  background: transparent;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;

  .navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
    padding: 0 16px;

    .back-btn {
      font-size: 16px;
      color: #333;
      padding: 8px;
    }

    .title-container {
      flex: 1;
      overflow: hidden;
      .title {
        font-size: 18px;
        color: #333;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .capsule-placeholder {
      visibility: hidden; // 仅占位不显示
    }
  }
}

/* APP 样式 */
.app-navbar {
  /* 原生导航栏不需要额外样式 */
}
</style>