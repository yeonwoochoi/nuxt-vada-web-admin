export const actions = {
  async createPlan ({commit}, params) {
    return new Promise(((resolve, reject) => {
      this.$axios.$post('/service', params)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data)
        })
    }))
  },
  async readAllPlan ({commit}) {
    return new Promise(((resolve, reject) => {
      this.$axios.$get('/service')
        .then(res => {
          resolve(res['vadaServices'])
        })
        .catch(err => {
          reject(err.response.data)
        })
    }))
  },
  async updatePlan ({commit}, payload) {
    return new Promise(((resolve, reject) => {
      this.$axios.$put('/service/' + payload.id, payload.data)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data)
        })
    }))
  },
  async deletePlan ({commit}, params) {
    return new Promise(((resolve, reject) => {
      this.$axios.$delete('/service/' + params)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err.response.data)
        })
    }))
  },
  async readAllPayment({commit}, params) {
    return new Promise(((resolve, reject) => {
      this.$axios.$get('/user/report/purchases')
        .then(res => {
          resolve(res['paymentLogs'])
        })
        .catch(err => {
          reject(err.response.data)
        })
    }))
  },
  async readPlanByIdx({commit}, param) {
    return new Promise(((resolve, reject) => {
      this.$axios.$get('/service/' + param)
        .then(res => {
          resolve(res['vadaService'])
        })
        .catch(err => {
          reject(err.response.data)
        })
    }))
  }
}
