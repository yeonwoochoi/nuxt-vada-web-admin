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
      this.$axios.$put('/file/update?type=' + payload.key, payload.data, payload.config).then(
        res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    })
  },
  //TODO: 받기 url
  async downloadFile({commit}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.$get('/file/download?type=' + payload.type, payload.config).then(
        res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    })
  }
}
