import enterprise from "@/pages/membership/enterprise";

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
  async getPrivateUsers({commit}) {
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
              if (users[i].roles.includes("ROLE_PERSONAL_USER")) {
                result.push(users[i])
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
  async readEnterpriseUserByIndex({commit}, param) {
    return new Promise(((resolve, reject) => {
      this.$axios.$get('/enterprise/' + param).then(
        res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    }))
  },
  async approveEnterprise({commit}, param) {
    return new Promise(((resolve, reject) => {
      this.$axios.$put('/enterprise/' + param)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.dir(err.response.data)
          reject(err.response.data.message)
        })
    }))
  },
  async getUserByIdx({commit}, params) {
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
  async sendEmailAuthCode({commit}, params) {
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
  async validateEmailAuthCode({commit}, params) {
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
  async changePassword({commit}, params) {
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
  async deletePrivateUser({commit}, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$delete('/user/' + params)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    })
  },
}
