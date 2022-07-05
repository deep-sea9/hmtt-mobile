/**
 * 搜索相关API
 */
import request from '@/utils/request'

// 获取联想建议
export const suggestion = params => {
  return request({
    url: '/v1_0/suggestion',
    params
  })
}

// 获取搜索结果
export const results = params => {
  return request({
    url: '/v1_0/search',
    params
  })
}
