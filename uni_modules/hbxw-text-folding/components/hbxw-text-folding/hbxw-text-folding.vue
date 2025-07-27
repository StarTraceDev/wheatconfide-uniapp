<template>
  <view 
    class="text-fold text-fold-item" 
    :style="{'--font-size':  fontSizeStr, 
    '--line-height': lineHeightStr, 
    '--rows': rows,
    '--ellipsis-color': ellipsisColor,
    '--color': color,
    height: status || isNeedFold === 2 ? maxHeight : parseFloat(fontSize) * parseFloat(rows) * parseFloat(lineHeight) +'rpx' }"
  >
    <view 
      class="text-fold-content text-fold-item" 
      :style="{height: status || isNeedFold !== 1 ? maxHeight : parseFloat(fontSize) * parseFloat(rows) * parseFloat(lineHeight) +'rpx'}">
      <view 
        class="fold-btn"
        :class="{'ellipsis': !status, 'ellipsisBefore': ellipsisPos === 'before', 'ellipsisAfter': ellipsisPos === 'after'}" 
        v-if="isNeedFold === 1"
        @click="openText" 
      >
        <slot name="foldbtn" :status="status">
          <text 
            class="fold-btn-item"
            :style="{...btnStyle}"
          >{{!status ? bthText[0] : bthText[1]}}</text>
        </slot>
      </view>
      <slot></slot>
  </view>
  </view>
</template>

<script>
  import { selectorAll } from '@/uni_modules/hbxw-utils/js_sdk/hbxw-utils.js';
  
  export default {
    props: {
      // 字体大小
      fontSize: {
        type: [String, Number],
        default: 32
      },
      
      // 字体颜色
      color: {
        type: String,
        default: '#333'
      },
      
      // 字体行高
      lineHeight: {
        type: [String, Number],
        default: 1.5
      },
      
      // 最多显示行数
      rows: {
        type: Number,
        default: 3
      },
      
      // 省略号颜色
      ellipsisColor: {
        type: String,
        default: '#333'
      },
      
      // 省略号位置 前或者后
      ellipsisPos: {
        type: String,
        validator: (value) => {
        	return ['before', 'after'].indexOf(value) !== -1;
        },
        default: 'before'
      },
      
      // 展开按钮样式定义
      btnStyle: {
        type: Object,
        default() {
          return {}
        }
      },
      
      // 展开按钮文本配置
      bthText: {
        type: Array,
        default() {
          return ['展开','收起']
        }
      }
    },
    data() {
      return {
        isNeedFold: -1, // 是否需要展开收起，用于处理那些文本长度不需要展开收起的情况 -1是初始状态 1是需要 2是确认不需要
        status: false, // false：收起 true：展开
        maxHeight: 'auto'
      }
    },
    computed: {
      fontSizeStr() {
        if (typeof this.fontSize === 'string') {
          return this.fontSize;
        }
        return this.fontSize + 'rpx';
      },
      lineHeightStr() {
        if (typeof this.lineHeight === 'string') {
          return this.lineHeight;
        }
        return this.lineHeight + 'em';
      },
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.initH = 0;
        this.maxH = 0;
        selectorAll('.text-fold-item', this).then((res) => {
          this.initH = res[0].height;
          this.maxH = res[1].height;
          if (res[1].height > res[0].height) {
            this.isNeedFold = 1;
          } else {
            this.isNeedFold = 2;
          }
          this.maxHeight = this.isNeedFold === 1 ? Math.max(res[1].height, res[0].height) + 1 + 'px' : 'auto';
        })
      },
      openText() {
        this.status = !this.status;
        this.$emit('toggle', {
          initHeight: this.initH,
          maxHeight: this.maxH
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .text-fold{
    width: 100%;
    overflow: hidden;
  }
  .text-fold-content{
    font-size: var(--font-size);
    line-height: var(--line-height);
    height: calc(var(--rows) * var(--line-height));
    color: var(--color);
    overflow: hidden;
  }
  .text-fold-content::before {
    content: '';
    width: 0;
    font-size: var(--font-size);
    height: calc(100% - var(--line-height));
    float: right;
  }
  .fold-btn{
    position: relative;
    float: right;
    clear: both;
    .fold-btn-item{
      display: inline-block;
      font-size: var(--font-size);
      padding: 0 12rpx;
      line-height: var(--line-height);
      border-radius: 8rpx;
      cursor: pointer;
      background-color: #3F51B5;
      color: #fff;
    }
    &.ellipsis::before{
      content: '...';
      font-size: var(--font-size);
      position: absolute;
      color: var(--ellipsis-color);
    }
    &.ellipsisBefore{
      &::before{
        left: -8rpx;
        transform: translateX(-100%)
      }
    }
    &.ellipsisAfter{
      &::before{
        right: 0;
        transform: translateX(95%)
      }
    }
    &.ellipsis.ellipsisBefore{
      margin-left: 1em;
    }
    &.ellipsis.ellipsisAfter{
      margin-right: 1em;
    }
  }
</style>
