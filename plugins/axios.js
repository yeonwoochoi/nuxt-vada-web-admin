export default ({ $axios, app, store, redirect }, inject) => {
  $axios.onRequest(config => {
    if (config.url === '/user/refresh-token') {
      config.headers['Authorization'] = 'Bearer ' + app.$auth.strategy.refreshToken.get()
    }
    console.log('Making request to ' + config.url)
  })

  $axios.onError(err => {
    console.error(err)
    let {code, subCode} = err.response.data
    if (code === 1 && subCode === 1008) {
      app.$auth.strategy.token.reset();
      app.$auth.strategy.refreshToken.reset();
      store.commit('logout')
      redirect('/login')
    }
  })
}
