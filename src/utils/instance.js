import axios from 'axios'
import { Toast } from 'vant'
import router from '@/router'
import store from '@/store'

// 创建请求实例
const instance = axios.create({
  baseURL: 'http://geek.itheima.net',
  // 指定请求超时的毫秒数
  timeout: 1000,
  // 表示跨域请求时是否需要使用凭证
  withCredentials: false,
})

// 前置拦截器（发起请求之前的拦截）
instance.interceptors.request.use(
  (config) => {
    /**
     * 在这里一般会携带前台的参数发送给后台，比如下面这段代码：
     * const token = getToken()
     * if (token) {
     *  config.headers.token = token
     * }
     */

    // 判断token是否存在,且是否再有效期
    const { token, refresh_token } = store.state.users.token
    if (token) {
      config.headers.Authorization = store.state.users.refresh ? `Bearer ${refresh_token}` : `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
// 后置拦截器（获取到响应时的拦截）
instance.interceptors.response.use(
  (response) => {
    /**
     * 根据你的项目实际情况来对 response 和 error 做处理
     * 这里对 response 和 error 不做任何处理，直接返回
     */
    return response.data.data
  },
  (error) => {
    switch (error.response.status) {
      // token 过期用refresh_token刷新
      case 401:
        // 切换状态
        store.commit('users/updateRefresh')
        // 重新获取token
        put('/v1_0/authorizations').then((result) => {
          store.commit('users/updateToken', {
            token: result.token,
            refresh_token: store.state.users.token.refresh_token,
          })
          instance(error.config)
        })
        break
      // refresh_token 过期 重新登录
      case 500:
        Toast.fail('用户登录超时')
        store.dispatch('users/resetState')
        router.push('/login')
        break
      default:
        return Promise.reject(error)
    }
  },
)

// 导出常用函数

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export const post = (url, data = {}, params = {}) => {
  return instance({
    method: 'post',
    url,
    data,
    params,
  })
}

/**
 * @param {string} url
 * @param {object} params
 */
export const get = (url, params = {}) => {
  return instance({
    method: 'get',
    url,
    params,
  })
}

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export const put = (url, data = {}, params = {}) => {
  return instance({
    method: 'put',
    url,
    params,
    data,
  })
}
/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export const patch = (url, data = {}, params = {}) => {
  return instance({
    method: 'patch',
    url,
    params,
    data,
  })
}

/**
 * @param {string} url
 * @param {object} params
 */
export const _delete = (url, params = {}) => {
  return instance({
    method: 'delete',
    url,
    params,
  })
}

export default instance
