export const state = () => ({
})

export const mutations = {

}

export const actions = {
  async updatePrivateUserPoint({commit}, payload) {
    return new Promise(((resolve, reject) => {
      this.$axios.$post('/user/report-modify', payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    }))
  },
  async updateEnterpriseUserPoint({commit}, payload) {
    return new Promise(((resolve, reject) => {
      this.$axios.$put('/enterprise-reports', payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    }))
  },
  async updateEnterpriseUserYearPass({commit}, payload) {
    return new Promise(((resolve, reject) => {
      this.$axios.$post('/enterprise-pass', payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    }))
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
        reject(err.response.data.message)
      })
    }))
  },
}
