import { post, get } from '@/utils/instance'
// 获取评论或评论回复
export function getCommentsAPI(data) {
  return get('/v1_0/comments', data)
}

// 对文章或者评论进行回复
export function addCommentsAPI(data) {
  return post('/v1_0/comments', data)
}
