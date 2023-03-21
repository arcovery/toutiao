import { Toast } from 'vant';
import router from '@/router';
import { loginAPI, profileAPI } from '@/api/user';

const state = {
  token: {},
  userProfile: {},
};

const getters = {
  token(state) {
    return state.token;
  },
};

const mutations = {
  updateToken(state, data) {
    state.token = data;
  },
  updateUserProfile(state, data) {
    state.userProfile = data;
  },
};

const actions = {
  // 登录
  async login(store, info) {
    try {
      const res = await loginAPI(info);
      Toast.success('登录成功');
      store.commit('updateToken', res.data.data);
      info.back ? router.push(info.back) : router.push('/home');
    } catch (error) {
      Toast.fail('登录失败');
    }
  },
  // 更新用户信息
  async getProfile(store) {
    const res = await profileAPI();
    store.commit('updateUserProfile', res.data.data);
  },
  // 清空token
  resetState(store) {
    store.commit('updateToken', {});
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
