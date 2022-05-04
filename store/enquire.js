export const state = () => ({

})

export const actions = {
  async readAll ({commit}) {
    return new Promise(((resolve, reject) => {
      this.$axios.$get('/enquire')
        .then(res => {
          resolve(res['enquires'])
        })
        .catch(err => {
          reject(err.response.data)
        })
    }))
  },
  async readNotAnswered({commit}) {
    return new Promise(((resolve, reject) => {
      this.$axios.$get('/enquire-check')
        .then(res => {
          resolve(res['enquires'])
        })
        .catch(err => {
          reject(err.response.data)
        })
    }))
  },
  async readByIndex ({commit}, params) {
    return new Promise((resolve, reject) => {
      this.$axios.$get('/enquire/' + params).then(res=> {
        resolve(res['enquire'])
      }).catch(err => {
        reject(err.response.data)
      })
    })
  },
  async answer ({commit}, params) {
    let param = {
      answer: params.answer
    }
    return new Promise((resolve, reject) => {
      this.$axios.$put('/enquire-answer/' + params.id, param)
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
      this.$axios.$delete('/enquire/' + param)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data)
        })
    })
  }
}
