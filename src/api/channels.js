import { get, _delete, put } from '@/utils/instance'

// 获取所有频道列表
export function allChannelsAPI() {
  return get('/v1_0/channels')
}

// 获取用户频道
export function userChannelsAPI() {
  return get('/v1_0/user/channels')
}

// 删除指定用户频道
export function removeChannelsAPI(data) {
  return _delete(`/v1_0/user/channels/${data}`)
}

// 设置用户的频道（重置式）
export function addChannelsAPI(data) {
  return put(`/v1_0/user/channels`, data)
}
