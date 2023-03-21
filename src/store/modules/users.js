import { Toast } from 'vant'
import router from '@/router'
import { loginAPI, profileAPI } from '@/api/user'

const state = {
  token: {},
  userProfile: {},
  refresh: false,
}

const getters = {
  token(state) {
    return state.token
  },
}

const mutations = {
  // 更新token
  updateToken(state, data) {
    state.token = data
    state.refresh = false
  },
  // 更新用户信息
  updateUserProfile(state, data) {
    state.userProfile = data
  },
  // 更新refresh_token状态
  updateRefresh(state) {
    state.refresh = true
  },
}

const actions = {
  // 登录
  async login(store, info) {
    try {
      const res = await loginAPI(info)
      Toast.success('登录成功')
      store.commit('updateToken', res)
      info.back ? router.push(info.back) : router.push('/home')
    } catch (error) {
      Toast.fail('登录失败')
    }
  },
  // 提交用户信息
  async getProfile(store) {
    if (!store.state.userProfile.id) {
      const res = await profileAPI()
      store.commit('updateUserProfile', res)
    }
  },

  // 提交清空token
  resetState(store) {
    store.commit('updateToken', {})
    store.commit('updateUserProfile', {})
    // router.push('./home');
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
