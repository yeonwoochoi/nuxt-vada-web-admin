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
  getUsers({commit}, isPersonal) {
    return new Promise(((resolve, reject) => {
      this.$axios.$get('/user').then(
        res => {
          let users = res['users']
          if (!users) {
            resolve([])
          }
          else {
            let result = []
            for (let i = 0; i < users.length; i++) {
              if (!!isPersonal) {
                if (users[i].roles.includes("ROLE_PERSONAL_USER")) {
                  result.push(users[i])
                }
              }
              else {
                if (users[i].roles.includes("ROLE_ENTERPRISE_MANAGER_USER") || users[i].roles.includes("ROLE_ENTERPRISE_USER")) {
                  result.push(users[i])
                }
              }
            }
            resolve(result)
          }
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    }))
  },
  getUserByIdx({commit}, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$get('/user/' + params)
        .then(res => {
          resolve(res.user)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    })
  },
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
