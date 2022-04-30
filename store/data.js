export const actions = {
  async getPatentLog({commit}) {
    return new Promise(((resolve, reject) => {
      this.$axios.$get('/patent/file')
        .then(res => {
          resolve(res['patentFileLog'])
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    }))
  },
  async uploadFile({commit}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.$put('/patent/file?type=' + payload.key, payload.data, payload.config).then(
        res => {
          resolve(res['patentFileLog'])
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    })
  },
  async downloadFile({commit}, data) {
    return new Promise((resolve, reject) => {
      this.$axios.$get('/patent/file/download?type=' + data.type, data.config).then(
        res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    })
  },
  async getDataLastUpdatedAt({commit}) {
    return new Promise((resolve, reject) => {
      this.$axios.$get('/patent/file/last').then(
        res => {
          resolve(res['lastUpdatedAt'])
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    })
  }
}
