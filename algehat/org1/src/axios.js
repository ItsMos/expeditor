import axios from "axios"
const api = import.meta.env.VITE_API

export default axios.create({
  baseURL: api,
  headers: {
    Authorization: localStorage.token? 'Bearer '+ localStorage.token : null
  }
})