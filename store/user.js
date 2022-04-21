export const state = () => ({
  emailForPwdReset: '',
})

export const getters = {
  getEmailForPwdReset: state => state.emailForPwdReset,
}

export const mutations = {
  setEmailForPwdReset: (state, payload) => {
    state.emailForPwdReset = payload
  },
  resetEmailForPwdReset: (state) => {
    state.emailForPwdReset = ''
  },
}

export const actions = {
  sendEmailAuthCode({commit}, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('/email', params)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    })
  },
  validateEmailAuthCode({commit}, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$put('/email', params)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    })
  },
  changePassword({commit}, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$put('/user/password/change', params)
        .then(res => {
          resolve(res.user)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    })
  },
}
