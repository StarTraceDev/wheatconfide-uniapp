import { defineStore } from 'pinia'
import { ref } from 'vue'

// 订单order
export const useOrderStore = defineStore('order', () => {
  // 当前订单
  const order = ref({})
  // 购物车订单
  const orderList = ref([])

  // 设置订单
  const setOrderList = (list) => {
    orderList.value = list
  }

  // 设置当前订单
  const setOrder = (val) => {
    order.value = val
  }

  // 清空订单
  const clearOrderList = () => {
    orderList.value = []
  }

  // 清空当前订单
  const clearOrder = () => {
    order.value = {}
  }

  return {
    order,
    orderList,
    setOrder,
    clearOrder,
    setOrderList,
    clearOrderList
  }
})