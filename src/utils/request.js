import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'
import router from '@/router'

const _axios = axios.create({
  baseURL: 'http://toutiao.itheima.net'
})

// 配置请求拦截器
_axios.interceptors.request.use(
  config => {
    // 判断是否有vuex中token,如果存在token,那么该请求就需要带上请求头
    if (store.state.token.token) {
      config.headers.Authorization = `Bearer ${store.state.token.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 配置响应拦截器
_axios.interceptors.response.use(
  res => {
    return res
  },
  async error => {
    // 接口请求错误统一错误处理：统一提示一下
    console.log(error)
    if (error.response && error.response.data) {
      // 解决token失效
      if (error.response.status === 401) {
        // 发请求获取新的token
        try {
          const res = await axios({
            url: 'http://toutiao.itheima.net/v1_0/authorizations',
            method: 'put',
            headers: {
              Authorization: `Bearer ${store.state.token.refresh_token}`
            }
          })
          // 更新vuex中的token
          store.commit('setToken', {
            token: res.data.data.token,
            refresh_token: store.state.token.refresh_token
          })
          return _axios(error.config)
        } catch {
          Toast.fail('登录状态已失效,请重新登录')
          router.push('/login')
        }
      }
      Toast.fail(error.response.data.message)
    }
    return Promise.reject(error)
  }
)

export default _axios
