import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  loading: false,
  num:null as any,
};

const mutations = {
  setLoading(state: any, data: any) {
    state.loading = data;
  },
};

const actions = {
  setLoading: ({
    commit
  }: any, data: any) => {
    commit('setLoading', data);
  },
};

const getters = {
  getLoading: (state: any) => {
    return state.loading;
  },
};

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
})
