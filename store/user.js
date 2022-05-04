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
          reject(err.response.data)
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
          reject(err.response.data)
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
          reject(err.response.data)
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
          reject(err.response.data)
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
          reject(err.response.data)
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
          reject(err.response.data)
        })
    })
  },
  updateUser({commit}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.$put('/user', payload)
        .then(res => {
          resolve(res.user)
        })
        .catch(err => {
          reject(err.response.data)
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
          reject(err.response.data)
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
          reject(err.response.data)
        })
    })
  },
  async deleteEnterpriseUser({commit}, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$delete('/enterprise/' + params)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data)
        })
    })
  },
  async deleteEnterpriseMember({commit}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.$put('/enterprise-user', payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data)
        })
    })
  },
  async addEnterpriseMember({commit}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('/enterprise-user', payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data)
        })
    })
  },
  async reissuePassword({commit}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.$put('/enterprise-user/reset', payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data)
        })
    })
  },
  async downloadTemplateFile({commit}, params) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: "arraybuffer",
    }
    return new Promise(((resolve, reject) => {
      this.$axios.$get('/file/template?type=' + params, config).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err.response.data)
      })
    }))
  },
  async addUserByFile({commit}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('/enterprise-user/' + payload.id, payload.data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data)
        })
    })
  }
}
