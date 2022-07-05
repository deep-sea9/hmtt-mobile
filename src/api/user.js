/**
 * 用户相关api
 */
import request from '@/utils/request'

// 获取短信验证码
export const codes = params => {
  return request({
    url: '/v1_0/sms/codes/' + params.mobile
  })
}

// 用户登录
export const authorizations = data => {
  return request({
    url: '/v1_0/authorizations',
    method: 'post',
    data
  })
}

// 获取用户信息
export const userMsg = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}

// 编辑用户个人资料
export const profile = data => {
  return request({
    url: '/v1_0/user/profile',
    method: 'patch',
    data
  })
}

// 更换头像
export const photo = data => {
  return request({
    url: '/v1_0/user/photo',
    method: 'patch',
    data
  })
}

// 关注用户和取消关注用户
export const following = (data, followed) => {
  if (followed) {
    // 取消关注用户
    return request({
      url: '/v1_0/user/followings/' + data.target,
      method: 'delete'
    })
  } else {
    // 关注用户
    return request({
      url: '/v1_0/user/followings',
      method: 'post',
      data
    })
  }
}

// 获取用户自己信息
export const user = () => {
  return request({
    url: '/v1_0/user'
  })
}

// 获取粉丝列表
export const followList = params => {
  return request({
    url: '/v1_0/user/followings',
    params
  })
}

// 获取关注列表
export const fansList = params => {
  return request({
    url: '/v1_0/user/followers',
    params
  })
}
