/**
 * 评论相关API
 */
import request from '@/utils/request'

/**
 * 获取评论或评论回复
 */
export const comments = params => {
  return request({
    url: '/v1_0/comments',
    params
  })
}

// 对文章评论或者评论回复
export const setComment = data => {
  return request({
    url: '/v1_0/comments',
    method: 'post',
    data
  })
}

// 对评论点赞会取消点赞
export const likings = (data, isLikings) => {
  if (isLikings) {
    // 取消点赞
    return request({
      url: '/v1_0/comment/likings/' + data.target,
      method: 'delete'
    })
  } else {
    // 点赞
    return request({
      url: '/v1_0/comment/likings',
      method: 'post',
      data
    })
  }
}
