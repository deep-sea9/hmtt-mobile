/**
 * 频道管理API
 */
import request from '@/utils/request'

// 获取用户的频道
export const userChannels = () => {
  return request({
    url: '/v1_0/user/channels'
  })
}

// 获取所有频道
export const allChannels = () => {
  return request({
    url: '/v1_0/channels'
  })
}

// 删除指定用户频道
export const deleteChannel = data => {
  return request({
    url: '/v1_0/user/channels/' + data,
    method: 'delete'
  })
}

// 增加用户频道
export const setChannel = data => {
  return request({
    url: '/v1_0/user/channels',
    method: 'put',
    data
  })
}
