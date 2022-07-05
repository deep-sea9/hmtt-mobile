import store from '@/store'
import Vue from 'vue'
import VueRouter from 'vue-router'
import { Toast } from 'vant'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'layout'
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/layout',
    component: () => import('@/views/layout'),
    children: [
      {
        path: '',
        redirect: '/home'
      },
      {
        path: '/home',
        component: () => import('@/views/home'),
        meta: {
          keep: true
        }
      },
      {
        path: '/qa',
        component: () => import('@/views/question')
      },
      {
        path: '/video',
        component: () => import('@/views/video')
      },
      {
        path: '/mine',
        component: () => import('@/views/mine'),
        meta: {
          needLogin: true
        }
      }
    ]
  },
  {
    path: '/mine/edit',
    component: () => import('@/views/mine/components/Edit.vue')
  },
  {
    path: '/chat',
    component: () => import('@/views/chat')
  },
  {
    path: '/article',
    component: () => import('@/views/article')
  },
  {
    path: '/search',
    component: () => import('@/views/search')
  },
  {
    path: '/search/result',
    component: () => import('@/views/search/components/result.vue')
  },
  {
    path: '/history',
    component: () => import('@/views/mine/components/history.vue')
  },
  {
    path: '/collect',
    component: () => import('@/views/mine/components/collect.vue')
  },
  {
    path: '/follow',
    component: () => import('@/views/mine/components/follow.vue')
  },
  {
    path: '/fans',
    component: () => import('@/views/mine/components/fan.vue')
  }
]

const router = new VueRouter({
  routes
})

// 配置导航守卫
router.beforeEach(async (to, from, next) => {
  // 判断是否需要登录
  if (to.meta.needLogin) {
    // 需要登录,就要进一步判断是否有token
    // 如果有token,直接放行
    if (store.state.token.token) {
      // 在需要登录的页面,在进入页面前就回去用户信息,这样就无需在每个组件中都调用一次获取信息的接口
      await store.dispatch('getUserInfo')
      next()
    } else {
      // 没有token,直接打回登录页
      Toast.fail('您还没登录,请先登录!')
      next('/login')
    }
  } else {
    // 不需要登录直接放行
    next()
  }
})

// vue-router3.1后新增了一些跳转的警告
// 如果不想出现这些警告，使用如下代码即可把报错吞掉
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

export default router
