import { post, get, patch } from '@/utils/instance'

// 登录API
export function loginAPI(data) {
  return post('/v1_0/authorizations', data)
}

// 获取用户信息API
export function profileAPI() {
  return get('/v1_0/user/profile')
}
// 编辑用户照片资料（头像、身份证照片）API
export function photoAPI(data) {
  return patch('/v1_0/user/photo', data)
}
// 编辑用户基本资料（昵称,生日等）API
export function editorProfileAPI(data) {
  return patch('/v1_0/user/profile', data)
}
