import firebase from 'firebase/app'
import 'firebase/auth'
import { currentUser } from '../../constants/config'
import axi from "axios";

export default {
  state: {
    currentUser: localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null,
    loginError: null,
    processing: false,
    forgotMailSuccess:null,
    resetPasswordSuccess:null,
    token: localStorage.getItem('token') || '',
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess:state => state.resetPasswordSuccess,
  },
  mutations: {
    setUser(state, payload, token) {
      state.currentUser = payload
      state.token = token
      state.processing = false
      state.loginError = null
    },
    setLogout(state) {
      state.currentUser = null
      state.token = ''
      state.processing = false
      state.loginError = null
    },
    setProcessing(state, payload) {
      state.processing = payload
      state.loginError = null
    },
    setError(state, payload) {
      state.loginError = payload
      state.currentUser = null
      state.processing = false
    },
    setForgotMailSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.forgotMailSuccess=true
    },
    setResetPasswordSuccess(state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.resetPasswordSuccess=true
    },
    clearError(state) {
      state.loginError = null
    }
  },
  actions: {
    login({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      // firebase
      //   .auth()
      //   .signInWithEmailAndPassword(payload.email, payload.password)
      //   .then(
      //     user => {
      //       const item = { uid: user.user.uid, ...currentUser }
      //       localStorage.setItem('user', JSON.stringify(item))
      //       commit('setUser', { uid: user.user.uid, ...currentUser })
      //     },
      //     err => {
      //       localStorage.removeItem('user')
      //       commit('setError', err.message)
      //       setTimeout(() => {
      //         commit('clearError')
      //       }, 3000)
      //     }
      //   )
      payload.then(value => {
        if (value === null || value === '' || value === undefined) {
          localStorage.removeItem('token')
          commit('setError', 'C?? l???i trong qu?? tr??nh ????ng nh???p.')
          setTimeout(() => {
            commit('clearError')
          }, 3000)
        } else {
          if (value.StatusCode === 200 && value.Success === 1) {
            const token = value.Result[0].Token
            const user = value.Result[0]
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            axi.defaults.headers.common['Authorization'] = "Bearer " + token
            commit('setUser', user, token)
          } else {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
            commit('setError', value.Message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        }
      })
    },
    forgotPassword({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      // firebase
      //   .auth()
      //   .sendPasswordResetEmail(payload.email)
      //   .then(
      //     user => {
      //       commit('clearError')
      //       commit('setForgotMailSuccess')
      //     },
      //     err => {
      //       commit('setError', err.message)
      //       setTimeout(() => {
      //         commit('clearError')
      //       }, 3000)
      //     }
      //   )
    },
    resetPassword({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      // firebase
      //   .auth()
      //   .confirmPasswordReset(payload.resetPasswordCode,payload.newPassword)
      //   .then(
      //     user => {
      //       commit('clearError')
      //       commit('setResetPasswordSuccess')
      //     },
      //     err => {
      //       commit('setError', err.message)
      //       setTimeout(() => {
      //         commit('clearError')
      //       }, 3000)
      //     }
      //   )
    },



    /*
       return await auth.(resetPasswordCode, newPassword)
        .then(user => user)
        .catch(error => error);
    */
    signOut({ commit }) {
      localStorage.removeItem('user')
      localStorage.removeItem('token');
      delete axi.defaults.headers.common['Authorization']
      commit('setLogout')
      // firebase
      //   .auth()
      //   .signOut()
      //   .then(() => {
      //     localStorage.removeItem('user')
      //     commit('setLogout')
      //   }, _error => { })
    }
  }
}
