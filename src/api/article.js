import { get } from '@/utils/instance'

// 获取新闻文章推荐
export function getArticlesAPI(data) {
  return get('/v1_0/articles', data)
}

// 获取新闻详情
export function profileAPI(id) {
  return get(`/v1_0/articles/${id}`)
}
