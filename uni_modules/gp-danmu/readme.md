# gp-danmu 弹幕组件

## 介绍

gp-danmu 是一个功能强大、高度可定制的弹幕组件，适用于 uni-app 多端开发。支持 H5、App 和小程序平台，提供丰富的自定义配置选项和多种弹幕展示模式。

## 特性

- 🚀 **多端适配**：完美支持 H5、App 和微信小程序等多个平台
- 🎨 **高度可定制**：提供丰富的样式和行为配置选项
- 🔌 **插件化设计**：支持自定义弹幕类型和动画效果
- 🛠 **完整 API**：包含完善的控制方法和事件回调
- 📱 **性能优化**：采用虚拟列表和帧动画优化，保证高性能


## 安装方式

### uni_modules安装

1. 在uni-app插件市场页面点击右上角【使用HBuilderX导入插件】，或者【下载插件ZIP】
2. 在HBuilderX中的项目管理器选择项目，右键选择`导入插件`，选择下载的zip包


## 基本用法

### 在 template 中使用

```html
<template>
  <view class="container">
    <gp-danmu
      ref="danmuRef"
      :danmu-list="danmuList"
      :config="danmuConfig"
      @click="handleDanmuClick"
    />
  </view>
</template>
```

### 在 script 中配置

```ts
<script lang="ts" setup>
import { ref, reactive } from 'vue';

// 弹幕数据
const danmuList = ref([
  { id: 1, text: '这是一条普通弹幕', color: '#FFFFFF' },
  { id: 2, text: '这是一条彩色弹幕', color: '#FF6600' },
  { id: 3, text: '这是一条顶部弹幕', type: 'top', color: '#00FFFF' },
  { id: 4, text: '这是一条底部弹幕', type: 'bottom', color: '#FFFF00' },
]);

// 弹幕配置
const danmuConfig = reactive({
  trackHeight: 40,         // 轨道高度
  trackNumber: 5,          // 轨道数量
  speed: 100,              // 弹幕速度
  fontSize: 16,            // 默认字体大小
  fontColor: '#FFFFFF',    // 默认字体颜色
  backgroundColor: 'transparent', // 弹幕背景色
  trackMode: 'overlap',    // 轨道模式：overlap(重叠)、separate(分离)
  looping: false,          // 是否循环播放
  direction: 'rtl',        // 弹幕方向：rtl(从右到左)、ltr(从左到右)
  duration: 8000,          // 弹幕动画持续时间（毫秒）
  density: 0.5,            // 弹幕密度(0-1)
  randomTrack: true,       // 是否随机选择轨道
  opacity: 1               // 弹幕透明度
});

// 弹幕组件引用
const danmuRef = ref(null);

// 点击弹幕事件回调
const handleDanmuClick = (danmu) => {
  console.log('点击了弹幕:', danmu);
};
</script>
```

## 高级用法

### 自定义弹幕渲染

您可以通过 `slot` 自定义弹幕的渲染内容和样式：

```html
<gp-danmu :danmu-list="danmuList" :config="danmuConfig">
  <template #danmu="{ danmu }">
    <view class="custom-danmu">
      <image v-if="danmu.avatar" :src="danmu.avatar" class="avatar" />
      <text class="username">{{danmu.username}}</text>
      <text class="content">{{danmu.text}}</text>
    </view>
  </template>
</gp-danmu>
```

### 使用内置控制 API

```ts
// 组件引用
const danmuRef = ref(null);

// 添加单条弹幕
const addDanmu = () => {
  danmuRef.value.add({
    id: Date.now(),
    text: '这是新增的弹幕',
    color: '#ffff00'
  });
};

// 批量添加弹幕
const addBatchDanmu = () => {
  danmuRef.value.addBatch([
    { id: 101, text: '批量弹幕1' },
    { id: 102, text: '批量弹幕2' }
  ]);
};

// 暂停弹幕
const pauseDanmu = () => {
  danmuRef.value.pause();
};

// 恢复弹幕
const playDanmu = () => {
  danmuRef.value.play();
};

// 清空弹幕
const clearDanmu = () => {
  danmuRef.value.clear();
};

// 动态设置配置
const updateConfig = () => {
  danmuRef.value.setConfig({
    speed: 150,
    fontSize: 20
  });
};
```

### 使用不同的弹幕类型

```ts
// 标准滚动弹幕
const scrollDanmu = {
  id: 1,
  text: '这是标准滚动弹幕',
  color: '#FFFFFF',
  type: 'scroll'
};

// 顶部固定弹幕
const topDanmu = {
  id: 2,
  text: '这是顶部固定弹幕',
  color: '#00FFFF',
  type: 'top'
};

// 底部固定弹幕
const bottomDanmu = {
  id: 3,
  text: '这是底部固定弹幕',
  color: '#FFFF00',
  type: 'bottom'
};

// 彩虹弹幕
const rainbowDanmu = {
  id: 4,
  text: '这是彩虹弹幕',
  color: '#FF00FF',
  type: 'rainbow'
};

// 闪烁弹幕
const blinkDanmu = {
  id: 5,
  text: '这是闪烁弹幕',
  color: '#FFFFFF',
  type: 'blink'
};

// 缩放弹幕
const scaleDanmu = {
  id: 6,
  text: '这是缩放弹幕',
  color: '#00FF00',
  type: 'scale'
};
```

### 更改弹幕方向

```ts
// 从右到左滚动
const rtlConfig = reactive({
  trackMode: 'overlap',
  direction: 'rtl',
  speed: 100
});

// 从左到右滚动
const ltrConfig = reactive({
  trackMode: 'overlap',
  direction: 'ltr',
  speed: 100
});
```

## API 参考

### Props

| 属性名      | 类型      | 默认值    | 说明                             |
|------------|-----------|-----------|----------------------------------|
| danmuList  | Array     | []        | 弹幕数据列表                     |
| config     | Object    | {}        | 弹幕配置对象                     |
| autoplay   | Boolean   | true      | 是否自动开始播放                 |
| maxNumber  | Number    | 100       | 同时显示的最大弹幕数量           |
| zIndex     | Number    | 10        | 弹幕容器的 z-index 样式值        |

### 弹幕数据结构

每条弹幕对象（danmuItem）支持以下属性：

| 属性名      | 类型     | 必填  | 说明                             |
|------------|----------|-------|----------------------------------|
| id         | String/Number | 是   | 弹幕唯一标识                     |
| text       | String   | 是    | 弹幕文本内容                     |
| color      | String   | 否    | 弹幕文本颜色                     |
| fontSize   | Number   | 否    | 弹幕文本大小                     |
| avatar     | String   | 否    | 用户头像 URL                     |
| username   | String   | 否    | 用户名                           |
| time       | Number   | 否    | 弹幕出现的时间点（视频场景）     |
| trackId    | Number   | 否    | 指定弹幕所在轨道                 |
| type       | String   | 否    | 弹幕类型，支持 'scroll', 'top', 'bottom', 'rainbow', 'blink', 'scale' |
| extraData  | Object   | 否    | 附加数据，可用于自定义渲染       |

### 配置选项

| 属性名            | 类型      | 默认值      | 说明                             |
|------------------|-----------|------------|----------------------------------|
| trackHeight      | Number    | 40         | 轨道高度                         |
| trackNumber      | Number    | 5          | 轨道数量                         |
| speed            | Number    | 100        | 弹幕速度（像素/秒）              |
| fontSize         | Number    | 16         | 默认字体大小                     |
| fontColor        | String    | '#ffffff'  | 默认字体颜色                     |
| backgroundColor  | String    | 'transparent' | 弹幕背景颜色                  |
| trackMode        | String    | 'overlap'  | 轨道模式: 'overlap', 'separate', 'fixed' |
| looping          | Boolean   | false      | 是否循环播放                     |
| direction        | String    | 'rtl'      | 弹幕方向: 'rtl', 'ltr'          |
| duration         | Number    | 8000       | 动画持续时间(ms)                 |
| density          | Number    | 0.5        | 弹幕密度(0-1)                    |
| randomTrack      | Boolean   | true       | 是否随机选择轨道                 |
| blockEnabled     | Boolean   | false      | 是否启用弹幕屏蔽功能             |
| blockWords       | Array     | []         | 屏蔽词列表                       |
| blockUsers       | Array     | []         | 屏蔽用户ID列表                   |
| clickable        | Boolean   | true       | 弹幕是否可点击                   |
| opacity          | Number    | 1          | 弹幕透明度                       |
| hoverPause       | Boolean   | false      | 鼠标悬停时是否暂停               |
| maxTextLength    | Number    | 50         | 最大文本长度限制                 |
| allowLineBreak   | Boolean   | false      | 是否允许换行                     |

### 事件

| 事件名      | 回调参数              | 说明                                 |
|------------|----------------------|--------------------------------------|
| click      | (danmu, event)       | 点击弹幕时触发                       |
| enter      | (danmu)              | 弹幕进入可视区域时触发               |
| leave      | (danmu)              | 弹幕离开可视区域时触发               |
| play       | -                    | 弹幕播放时触发                       |
| pause      | -                    | 弹幕暂停时触发                       |
| clear      | -                    | 弹幕清空时触发                       |

### 方法

以下方法可通过组件实例调用（需要使用 ref）：

| 方法名      | 参数                 | 返回值  | 说明                       |
|------------|----------------------|--------|----------------------------|
| add        | (danmu)              | -      | 添加单条弹幕               |
| addBatch   | (danmuList)          | -      | 批量添加弹幕               |
| play       | -                    | -      | 播放弹幕                   |
| pause      | -                    | -      | 暂停弹幕                   |
| clear      | -                    | -      | 清空弹幕                   |
| setConfig  | (config)             | -      | 动态设置配置               |
| getDanmu   | (id)                 | Object | 根据 ID 获取弹幕对象       |
| blockUser  | (userId)             | -      | 屏蔽用户                   |
| blockWord  | (word)               | -      | 添加屏蔽词                 |
| use        | (plugin)             | -      | 安装弹幕插件               |

## 自定义弹幕插件系统

gp-danmu 提供了一个插件系统，允许您创建自定义的弹幕类型和动画效果。

### 创建自定义弹幕类型插件

```ts
// 导入必要的插件
import { ref, onMounted } from 'vue';
import { rainbowDanmuPlugin, blinkDanmuPlugin, scaleDanmuPlugin } from '../uni_modules/gp-danmu/components/gp-danmu/plugins/rainbow-danmu.js';

// 弹幕组件引用
const danmuRef = ref(null);

// 定义一个自定义弹幕插件
const customDanmuPlugin = {
  // 插件名称
  name: 'custom-danmu',
  
  // 插件初始化
  install(danmu) {
    // 注册新的弹幕类型
    danmu.registerDanmuType('custom', {
      // 创建动画
      createAnimation(danmuItem, trackInfo) {
        return {
          duration: 3000,
          timingFunction: 'linear',
          // 定义动画关键帧
          keyframes: [
            { opacity: 1, transform: 'scale(1) translateX(100%)', offset: 0 },
            { opacity: 0.5, transform: 'scale(1.5) translateX(50%)', offset: 0.5 },
            { opacity: 1, transform: 'scale(1) translateX(-100%)', offset: 1 }
          ]
        };
      }
    });
  }
};

// 在组件挂载后安装插件
onMounted(() => {
  if (danmuRef.value) {
    // 安装内置插件
    danmuRef.value.use(rainbowDanmuPlugin);
    danmuRef.value.use(blinkDanmuPlugin);
    danmuRef.value.use(scaleDanmuPlugin);
    
    // 安装自定义插件
    danmuRef.value.use(customDanmuPlugin);
  }
});
```

## 兼容性

- 支持 uni-app 多端开发
- 已在 Android/iOS App、H5、微信小程序等环境中测试通过
- 支持 Vue2 和 Vue3 项目