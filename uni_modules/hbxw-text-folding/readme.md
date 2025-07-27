# hbxw-text-folding组件

## 介绍
一个多行文本溢出显示省略号并带有折叠显示隐藏功能还支持文字大小行高颜色自定义设置的文本容器组件

## 使用示例

使用前要以新建一个页面拷贝下面代码做一下测试，熟悉后再使用到项目中
```html

<template>
	<view>
    <text class="text-title">内容不够不需要展开收起</text>
		<hbxw-text-folding>低五号向它众调白马快写包得较存我快入市需厂越都布值类阶人断确。</hbxw-text-folding>
    
    <text class="text-title">内容不够不需要展开收起</text>
    <hbxw-text-folding @toggle="toggle">且深民统近放适备精县三白达单委节开积张较步究时方类单品角经那酸自听期半油参织前感想法物至教领联把计八素也只思农二图取式太装转东热最别全容在采小带价级指备性造六证色状群影整八公导听他酸些号高在气毛实约用。</hbxw-text-folding>
    
    <text class="text-title">自定义配置示例0</text>
    <hbxw-text-folding :rows="2" :fontSize="24" :btnStyle="{backgroundColor: 'transparent',color: 'red', padding: '0 8rpx'}">且深民统近放适备精县三白达单委节开积张较步究时方类单品角经那酸自听期半油参织前感想法物至教领联把计八素也只思农二图取式太装转东热最别全容在采小带价级指备性造六证色状群影整八公导听他酸些号高在气毛实约用。    </hbxw-text-folding>
    <text class="text-title">自定义配置示例1</text>
    <hbxw-text-folding 
      :rows="2" 
      :fontSize="24" 
      :btnStyle="{backgroundColor: 'transparent',color: 'red', padding: 0}"
      ellipsisPos="after"
    >且深民统近放适备精县三白达单委节开积张较步究时方类单品角经那酸自听期半油参织前感想法物至教领联把计八素也只思农二图取式太装转东热最别全容在采小带价级指备性造六证色状群影整八公导听他酸些号高在气毛实约用。</hbxw-text-folding>
    <text class="text-title">通过插槽自定义按钮</text>
    <hbxw-text-folding 
      :rows="2" 
      :fontSize="24" 
      :btnStyle="{backgroundColor: 'transparent',color: 'red', padding: 0}"
      ellipsisPos="after"
    >
    且深民统近放适备精县三白达单委节开积张较步究时方类单品角经那酸自听期半油参织前感想法物至教领联把计八素也只思农二图取式太装转东热最别全容在采小带价级指备性造六证色状群影整八公导听他酸些号高在气毛实约用。
    <template #foldbtn="{status}">
      <text class="fold-btn-item">{{status ? 'EXPAND' : 'RETRACT'}}</text>
    </template>
  </hbxw-text-folding>
    
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
    methods: {
		  toggle(res) {
        console.log('---- toggle ----:', res);
      }
    }
	}
</script>

<style lang="scss" scoped>
.text-title{
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
}
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
</style>


```

## API

### Props

| 属性名          | 类型           | 默认值    | 必填 | 说明                               |
| ------------   | -------------  | -------- | ---- | -----------------------------------|
| fontSize       | String/Number  | 32       | 否   | 文本容器中字体大小              |
| color          | String         | #333     | 否   | 文本容器中字体颜色   |
| lineHeight     | String/Number  | 1.5      | 否   | 文本容器中字体行高                     |
| rows           | Number         | 3        | 否   | 文本容器中超出多行后显示省略号        |
| ellipsisColor  | String         | #333     | 否   | 省略号的颜色   |
| ellipsisPos    | String         | before  | 否   | 省略号位置before(在前) before(在后)|
| btnStyle       | Object         | {}       | 否   | 展开/收起按钮的样式配置 |
| bthText       | Array           | ['展开','收起']  | 否   | 展开/收起按钮的文本配置 |

### Events

| 事件名       | 说明   | 返回值 |
| ------------ | ------------  |  ------------ |
| toggle       | 点击展开/收起触发事件 |  {initHeight:展开前高度，单位px,maxHeight:展开前高度，单位px} |

### Slots

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| foldbtn | 自定义收起展开按钮 | { status: boolean } |
