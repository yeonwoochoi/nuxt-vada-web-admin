export const state = () => ({

})

export const actions = {
  async create ({commit}, params) {
    return new Promise(((resolve, reject) => {
      this.$axios.$post('/faq', params)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    }))
  },
  async readAll ({commit}) {
    return new Promise(((resolve, reject) => {
      this.$axios.$get('/faq')
        .then(res => {
          resolve(res.faqs)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    }))
  },
  async readByIndex ({commit}, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$get('/faq/' + params).then(res=> {
        resolve(res.faq)
      }).catch(err => {
        reject(err.response.data.message)
      })
    })
  },
  async update ({commit}, params) {
    let param = {
      title: params.title,
      content: params.content
    }
    return new Promise((resolve, reject) => {
      this.$axios.$put('/faq/' + params.id, param)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    })
  },
  async delete ({commit}, param) {
    return new Promise((resolve, reject) => {
      this.$axios.$delete('/faq/' + param)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    })
  }
}
