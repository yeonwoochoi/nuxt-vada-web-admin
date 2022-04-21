export const state = () => ({

})

export const actions = {
  async readAll ({commit}) {
    return new Promise(((resolve, reject) => {
      this.$axios.$get('/notice')
        .then(res => {
          resolve(res.notices)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    }))
  },
  async readByIndex ({commit}, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$get('/notice/' + params).then(res=> {
        resolve(res.notice)
      }).catch(err => {
        reject(err.response.data.message)
      })
    })
  },
  async update ({commit}, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$put('/notice/' + params.id, params)
        .then(res => {
          resolve(res.notice)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    })
  }
}
