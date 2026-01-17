import { getCurrentInstance } from 'vue'

export function useIm() {
  const instance = getCurrentInstance();
  const $im = instance?.proxy?.$im;
  if (!$im) {
    uni.showToast({ title: 'IM实例获取失败', icon: 'none' });
    return {};
  }
  return $im;
}