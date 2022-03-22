export const state = () => ({
  backgroundColor: 'rgb(248, 248, 250)',
  baseColor: '#40A677',
  company: 'VADA PARTNERS',
  madeBy: 'Run-i Studio',
  siteOrigin: 'http://localhost:8765',
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
    { title: '결제서비스', icon: 'mdi-currency-usd', link: '/payment', items: []},
    { title: '고객서비스', icon: 'mdi-account-tie-voice', link: '/support/news', items: [
        { title: '공지사항', icon: 'mdi-newspaper-variant-multiple', link: '/support/news' },
        { title: 'FAQ', icon: 'mdi-frequently-asked-questions', link: '/support/faq' },
        { title: '1:1문의', icon: 'mdi-message-question', link: '/support/qna' },
      ]
    },
    { title: '데이터관리', icon: 'mdi-database', link: '/data', items: []},
  ],
  alertToggle: false,
  alertInfo: {
    component: '',
    message: 'Alert',
    type: 'success'
  }
})

export const getters = {
  getDrawer: state => state.drawer,
}

export const mutations = {
  setDrawer: (state, data) => {
    state.drawer = data
  },
  openAlert: (state, payload) => {
    state.alertInfo = payload;
    state.alertToggle = true;
  },
  closeAlert: (state) => {
    state.alertInfo = {
      component: '',
      message: '',
      type: 'success'
    };
    if (state.alertToggle) {
      state.alertToggle = false;
    }
  }
}

export const actions = {

}
