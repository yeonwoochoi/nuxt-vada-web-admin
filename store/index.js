export const state = () => ({
  backgroundColor: 'rgb(248, 248, 250)',
  baseColor: '#40A677',
  company: 'VADA PARTNERS',
  madeBy: 'Vadapartners.Inc',
  siteOrigin: 'https://www.vadapartners.com/',
  companyDefaultLogo: require('assets/logo/logo_vada_black.png'),
  companyWhiteLogo: require('assets/logo/logo_vada_white.png'),
  drawer: true,
  drawerItems: [
    { title: '메인', icon: 'mdi-home', link: '/', items:[] },
    { title: '회원관리', icon: 'mdi-account-group', link: '/membership/private', items: [
        { title: '개인회원관리', icon: 'mdi-account', link: '/membership/private' },
        { title: '기업회원관리', icon: 'mdi-office-building', link: '/membership/enterprise' },
      ]
    },
    { title: '결제서비스', icon: 'mdi-currency-usd', link: '/payment/plan', items: [
        { title: '플랜관리', icon: 'mdi-newspaper-variant-multiple', link: '/payment/plan' },
        { title: '결제내역', icon: 'mdi-clipboard-text-outline', link: '/payment/log' },
      ]
    },
    { title: '고객서비스', icon: 'mdi-account-tie-voice', link: '/support/news', items: [
        { title: '공지사항', icon: 'mdi-newspaper-variant-multiple', link: '/support/news' },
        { title: 'FAQ', icon: 'mdi-frequently-asked-questions', link: '/support/faq' },
        { title: '1:1문의', icon: 'mdi-message-question', link: '/support/qna' },
      ]
    },
    { title: '데이터관리', icon: 'mdi-database', link: '/data', items: []},
  ],
  sheetTitle: '',
  colorList: [
    'rgb(0, 172, 193)',
    'rgb(2, 136, 209)',
    'rgb(84, 110, 122)',
    'rgb(255, 196, 0)',
    'rgb(76, 175, 80)',
    'rgb(126, 87, 194)',
    'rgb(255, 111, 0)',
    'rgb(161, 136, 127)',
    'rgb(38, 50, 56)',
    'rgb(139, 195, 74)',
    'rgb(128, 203, 196)',
  ]
})

export const getters = {
  getDrawer: state => state.drawer,
  getSheetTitle: state => state.sheetTitle,
  getColorList: (state) => state.colorList
}

export const mutations = {
  setDrawer: (state, data) => {
    state.drawer = data
  },
  setSheetTitle: (state, data) => {
    state.sheetTitle = data
  },
  logout(state) {
    state.auth.user = {}
    state.auth.loggedIn = false;
  },
}

export const actions = {

}
