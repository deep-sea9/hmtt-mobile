/**
 * 新闻相关API
 */
import request from '@/utils/request'

// 获取文章新闻推荐
export const articles = params => {
  return request({
    url: '/v1_0/articles',
    params
  })
}

// 获取文章详情
export const getArticle = id => {
  return request({
    url: '/v1_0/articles/' + id
  })
}

// 收藏文章和取消收藏
export const collections = (data, collected) => {
  if (collected) {
    return request({
      url: '/v1_0/article/collections/' + data.target,
      method: 'delete'
    })
  } else {
    return request({
      url: '/v1_0/article/collections',
      method: 'post',
      data
    })
  }
}

// 对文章点赞和取消点赞
export const likings = (data, attitude) => {
  if (attitude === 1) {
    return request({
      url: '/v1_0/article/likings/' + data.target,
      method: 'delete'
    })
  } else {
    return request({
      url: '/v1_0/article/likings',
      method: 'post',
      data
    })
  }
}

// 对文章不喜欢和取消不喜欢
export const dislikes = (data, attitude) => {
  // 不喜欢
  if (attitude === 0) {
    return request({
      url: '/v1_0/article/dislikes/' + data.target,
      method: 'delete'
    })
  } else {
    // 喜欢
    return request({
      url: '/v1_0/article/dislikes',
      method: 'post',
      data
    })
  }
}

// 获取用户收藏列表
export const getCollections = params => {
  return request({
    url: '/v1_0/article/collections',
    params
  })
}

// 获取用户阅读历史
export const histories = params => {
  return request({
    url: '/v1_0/user/histories',
    params
  })
}
