export const actions = {
  async getPatentLog({commit}) {
    return new Promise(((resolve, reject) => {
      this.$axios.$get('/patent/file')
        .then(res => {
          resolve(res['patentFileLog'])
        })
        .catch(err => {
          reject(err.response.data)
        })
    }))
  },
  async uploadFile({commit}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.$put('/patent/file', payload).then(
        res => {
          resolve(res['patentFileLog'])
        })
        .catch(err => {
          reject(err.response.data)
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
          reject(err.response.data)
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
          reject(err.response.data)
        })
    })
  },
  async getKiprisApiKey({commit}) {
    return new Promise((resolve, reject) => {
      this.$axios.$get('/kipris/key').then(
        res => {
          resolve(res['apiKey'])
        })
        .catch(err => {
          reject(err.response.data)
        })
    })
  },
  async updateKiprisApiKey({commit}, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.$put('/kipris/key', payload).then(
        res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data)
        })
    })
  },
}
