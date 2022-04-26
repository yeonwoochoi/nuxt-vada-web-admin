export const state = () => ({
})

export const mutations = {

}

export const actions = {
  async updatePrivateUserPoint({commit}, payload) {
    return new Promise(((resolve, reject) => {
      this.$axios.$post('/user/report-modify', payload)
        .then(res => {
          resolve(res['enquires'])
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
          resolve(res['enquires'])
        })
        .catch(err => {
          reject(err.response.data.message)
        })
    }))
  },
}
