import { get } from '@/utils/instance'

// 获取搜索结果

export function searchAPI(data) {
  return get('/v1_0/search', data)
}

// 获取联想建议（自动补全）
export function suggestionAPI(data) {
  return get('/v1_0/suggestion', data)
}
