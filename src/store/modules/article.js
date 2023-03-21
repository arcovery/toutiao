import { Toast } from 'vant'
import router from '@/router'
import { getArticlesAPI } from '@/api/article'

const state = {
  token: {},
  userProfile: {},
}

const getters = {
  token(state) {
    return state.token
  },
}

const mutations = {
  updateToken(state, data) {
    state.token = data
  },
  updateUserProfile(state, data) {
    state.userProfile = data
  },
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
