import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => {
    return {
      service: null,
      orderId: null
    }
  }
})
