import { defineStore } from 'pinia'
import jwtDecode from 'jwt-decode'
import router from '@/router'
import axios from '@/axios'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: null
    }
  },

  actions: {
    login(token) {
      this.user = jwtDecode(token)
      localStorage.setItem('token', token)
      // router.push('/')
    },

    logout() {
      this.user = null
      localStorage.removeItem('token')
      // router.push('/')
    },

    async refreshToken () {
      if (localStorage.token) {
        try {
          const { data } = await axios.post('refreshToken', {
            token: localStorage.token
          })
          if (data.token) {
            localStorage.token = data.token
            this.user = jwtDecode(data.token)
          }
        } catch (error) {
          localStorage.removeItem('token')
        }
      }
    }
  }
})
