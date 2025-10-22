/**
 * 彩虹弹幕插件
 * 提供有彩虹颜色渐变效果的弹幕类型
 */
export const rainbowDanmuPlugin = {
  name: 'rainbow-danmu',
  
  // 插件初始化
  install(danmu) {
    // 彩虹颜色数组
    const rainbowColors = [
      '#FF0000', // 红
      '#FF7F00', // 橙
      '#FFFF00', // 黄
      '#00FF00', // 绿
      '#0000FF', // 蓝
      '#4B0082', // 靛
      '#9400D3'  // 紫
    ];
    
    // 注册彩虹弹幕类型
    danmu.registerDanmuType('rainbow', {
      createAnimation(danmuItem, trackInfo) {
        // 获取配置
        const direction = danmu?.pluginContext?.mergedConfig?.direction || 'rtl';
        const duration = this.calculateDuration(danmuItem);
        
        // 计算起始和结束位置
        const startX = direction === 'rtl' ? '100%' : '-100%';
        const endX = direction === 'rtl' ? '-100%' : '100%';
        
        // 创建彩虹渐变关键帧
        const colorKeyframes = [];
        const colorSteps = rainbowColors.length;
        
        for (let i = 0; i < colorSteps; i++) {
          colorKeyframes.push({
            color: rainbowColors[i],
            offset: i / (colorSteps - 1)
          });
        }
        
        // 合并动画关键帧
        const keyframes = [];
        
        // 添加初始帧
        keyframes.push({
          transform: `translateX(${startX})`,
          color: rainbowColors[0],
          offset: 0
        });
        
        // 添加中间彩虹颜色帧
        for (let i = 1; i < colorSteps - 1; i++) {
          keyframes.push({
            transform: `translateX(${startX === '100%' ? (100 - (i * 100 / (colorSteps - 1))) + '%' : (i * 100 / (colorSteps - 1) - 100) + '%'})`,
            color: rainbowColors[i],
            offset: i / (colorSteps - 1)
          });
        }
        
        // 添加最终帧
        keyframes.push({
          transform: `translateX(${endX})`,
          color: rainbowColors[colorSteps - 1],
          offset: 1
        });
        
        return {
          duration,
          timingFunction: 'linear',
          keyframes
        };
      },
      
      // 计算持续时间
      calculateDuration(danmu) {
        if (danmu.duration) return danmu.duration;
        
        // 默认使用更慢的速度，以便更好地展示彩虹效果
        const speed = danmu.speed || 50; // 比普通弹幕慢
        const containerWidth = danmu?.pluginContext?.containerWidth || 300;
        const textWidth = (danmu.text || '').length * (danmu.fontSize || 16) * 0.7 + 20;
        
        return (containerWidth + textWidth) / speed * 1000;
      }
    });
  }
};

/**
 * 闪烁弹幕插件
 * 提供有闪烁效果的弹幕类型
 */
export const blinkDanmuPlugin = {
  name: 'blink-danmu',
  
  // 插件初始化
  install(danmu) {
    // 注册闪烁弹幕类型
    danmu.registerDanmuType('blink', {
      createAnimation(danmuItem, trackInfo) {
        // 获取配置
        const direction = danmu?.pluginContext?.mergedConfig?.direction || 'rtl';
        const duration = danmuItem.duration || danmu.mergedConfig?.duration || 3000;
        
        // 计算起始和结束位置
        const startX = direction === 'rtl' ? '100%' : '-100%';
        const endX = direction === 'rtl' ? '-100%' : '100%';
        
        return {
          duration,
          timingFunction: 'ease',
          keyframes: [
            { transform: `translateX(${startX})`, opacity: 1, offset: 0 },
            { transform: 'translateX(75%)', opacity: 0.2, offset: 0.25 },
            { transform: 'translateX(50%)', opacity: 1, offset: 0.5 },
            { transform: 'translateX(25%)', opacity: 0.2, offset: 0.75 },
            { transform: `translateX(${endX})`, opacity: 1, offset: 1 }
          ]
        };
      },
      
      // 计算持续时间
      calculateDuration(danmu) {
        if (danmu.duration) return danmu.duration;
        
        const speed = danmu.speed || 100;
        const containerWidth = danmu?.pluginContext?.containerWidth || 300;
        const textWidth = (danmu.text || '').length * (danmu.fontSize || 16) * 0.7 + 20;
        
        return (containerWidth + textWidth) / speed * 1000;
      }
    });
  }
};

/**
 * 缩放弹幕插件
 * 提供有缩放效果的弹幕类型
 */
export const scaleDanmuPlugin = {
  name: 'scale-danmu',
  
  // 插件初始化
  install(danmu) {
    // 注册缩放弹幕类型
    danmu.registerDanmuType('scale', {
      createAnimation(danmuItem, trackInfo) {
        //
        const direction = danmu?.pluginContext?.mergedConfig?.direction || 'rtl';
        const duration = danmuItem.duration || this.calculateDuration(danmuItem);
        
        // 计算起始和结束位置
        const startX = direction === 'rtl' ? '100%' : '-100%';
        const endX = direction === 'rtl' ? '-100%' : '100%';
        
        return {
          duration,
          timingFunction: 'ease',
          keyframes: [
            { transform: `scale(0.8) translateX(${startX})`, offset: 0 },
            { transform: 'scale(1.2) translateX(50%)', offset: 0.3 },
            { transform: 'scale(1) translateX(0%)', offset: 0.5 },
            { transform: 'scale(1.2) translateX(-50%)', offset: 0.7 },
            { transform: `scale(0.8) translateX(${endX})`, offset: 1 }
          ]
        };
      },
      
      // 计算持续时间
      calculateDuration(danmu) {
        if (danmu.duration) return danmu.duration;
        
        const speed = danmu.speed || 80;
        const containerWidth = danmu?.pluginContext?.containerWidth || 300;
        const textWidth = (danmu.text || '').length * (danmu.fontSize || 16) * 0.7 + 20;
        
        // 确保动画有足够时间完成
        return (containerWidth + textWidth * 2) / speed * 1000;
      }
    });
  }
}; 