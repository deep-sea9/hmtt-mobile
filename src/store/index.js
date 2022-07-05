import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import persistedstate from 'vuex-persistedstate'
import { userMsg } from '@/api/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: ''
  },
  getters: {},
  mutations: {
    // 存储token
    setToken (state, value) {
      state.token = value
    },
    // 保存用户信息
    setUserInfo (state, value) {
      value.sex = value.gender === 0 ? '男' : '女'
      state.userInfo = value
    },
    // 退出登录,清除token
    logout (state) {
      state.token = ''
      state.userInfo = ''
      router.push('/login')
    }
  },
  actions: {
    // actions主要用于处理异步代码,常用语接口调用
    // 获取用户信息的方法进行封装,如果有其他页面需要使用用户信息,只需要调用vuex中的action即可,这样就减少冗余的代码

    async getUserInfo (context) {
      if (!context.state.userInfo) {
        const res = await userMsg()
        context.commit('setUserInfo', res.data.data)
      }
    }
  },
  modules: {},
  // 通过persistedstate插件将vuex的数据持久化存储
  plugins: [
    persistedstate({
      path: ['token']
    })
  ]
})
