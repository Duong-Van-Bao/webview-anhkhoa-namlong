import Vue from 'vue'
import Vuex from 'vuex'

import app from '../main'
import menu from './modules/menu'
import user from './modules/user'
import Axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
  mutations: {
    changeLang(state, payload) {
      app.$i18n.locale = payload
      localStorage.setItem('currentLanguage', payload)
      Axios.defaults.headers.common['Language'] = payload
    },
  },
  actions: {
    setLang({ commit }, payload) {
      commit('changeLang', payload)
    },
  },
  modules: {
    menu,
    user,
  }
})
