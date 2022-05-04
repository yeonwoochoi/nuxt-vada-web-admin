export const state = () => ({

})

export const actions = {
  async create ({commit}, params) {
    return new Promise(((resolve, reject) => {
      this.$axios.$post('/notice', params)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data)
        })
    }))
  },
  async readAll ({commit}) {
    return new Promise(((resolve, reject) => {
      this.$axios.$get('/notice')
        .then(res => {
          resolve(res.notices)
        })
        .catch(err => {
          reject(err.response.data)
        })
    }))
  },
  async readByIndex ({commit}, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$get('/notice/' + params).then(res=> {
        resolve(res.notice)
      }).catch(err => {
        reject(err.response.data)
      })
    })
  },
  async update ({commit}, params) {
    let param = {
      title: params.title,
      content: params.content
    }
    return new Promise((resolve, reject) => {
      this.$axios.$put('/notice/' + params.id, param)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data)
        })
    })
  },
  async delete ({commit}, param) {
    return new Promise((resolve, reject) => {
      this.$axios.$delete('/notice/' + param)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data)
        })
    })
  }
}
