import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Vadapartners Admin',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'animate.css/animate.min.css',
    'assets/variables.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vee-validate', ssr: false },
    { src: '~/plugins/axios' },
    { src: '~/plugins/notifier' },
    { src: '~/plugins/utils.js' },
    { src: '~/plugins/errorHandler' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/dotenv',
  ],

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
    },
  },

  router: {
    middleware: 'auth'
  },

  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: '/'
    },
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'token.access_token',
          type: 'Bearer',
          name: 'Authorization',
          global: true,   // request header 에 authentication 으로 자동 포함됨
          maxAge: 60  // 30분
          //maxAge: 1800  // 30분
        },
        refreshToken: {
          property: 'token.refresh_token',
          data: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30 // 30일
        },
        user: {
          property: 'user',
          data: 'user'
        },
        endpoints: {
          login: { url: '/user/login-admin', method: 'post', },
          refresh: { url: '/user/refresh-token', method: 'post' },
          user: { url: '/user/login-email?type=admin', method: 'post' },
        },
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vee-validate/dist/rules'],
  },

  server: {
    port: 8766,
    host: '0.0.0.0'
  },

  proxy: {
    '/api/': {
      target: process.env.API_URL,
      pathRewrite: {
        '^/api/': ''
      }
    },
  },

  axios: {
    prefix: '/api',
    proxy: true,
    retry: { retries: 3 }
  },

  env: {
    NODE_ENV: process.env.NODE_ENV
  }
}
