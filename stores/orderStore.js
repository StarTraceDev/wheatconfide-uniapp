import { defineStore } from 'pinia'
import { ref } from 'vue'

// 订单order
export const useOrderStore = defineStore('order', () => {
  // 订单
  const orderList = ref([])

  // 设置订单
  const setOrderList = (list) => {
    orderList.value = list
  }

  // 清空订单
  const clearOrderList = () => {
    orderList.value = []
  }

  return {
    orderList,
    setOrderList,
    clearOrderList
  }
})