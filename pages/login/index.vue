<template>
  <div class="full-size flex-center">
    <div v-if="$vuetify.breakpoint.mdAndUp" class="half-width full-height flex-start">
      <v-img
        :src="sideImg"
        class="full-height"
        contain
      />
    </div>
    <div class="full-height auth-content-card-color" :class="`${$vuetify.breakpoint.smAndDown ? 'full-width' : 'half-width'}`">
      <v-alert
        :value="showAlert"
        type="error"
        transition="slide-y-transition"
      >
        {{ alertMessage }}
      </v-alert>
      <v-row align="center" justify="center" class="py-16 px-6 ma-0 full-size" :class="`${showAlert ? 'pt-0' : 'pt-16'}`">
        <v-col cols="10" class="text-center pb-0">
          <p class=" display-1 white--text">
            {{cardTitle}}
          </p>
          <p class="subtitle-2 white--text font-weight-regular mb-0">
            {{cardSubtitle}}
          </p>
        </v-col>
        <v-col cols="10">
          <v-text-field
            v-model="adminId"
            label="관리자 ID"
            dense
            filled
            dark
          />
          <v-text-field
            v-model="password"
            label="Password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            dense
            filled
            dark
            :type="showPassword ? 'text' : 'password'"
          />
          <div class="flex-space-between" style="height: 30px;">
            <v-spacer/>
            <a
              class="no-decoration-black-text white--text"
              :href="forgotPasswordLink"
            >
              비밀번호 찾기
            </a>
          </div>
        </v-col>
        <v-col cols="10">
          <v-btn
            @click="login"
            type="login"
            large
            rounded
            class="text-center black--text font-weight-bold subtitle-1 #DCDCDC full-width"
            :loading="isLoading"
          >
            로그인
          </v-btn>
        </v-col>
        <v-col cols="12" v-if="showAlert"/>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  layout: 'auth',
  asyncData({$auth, redirect}) {
    if ($auth.loggedIn) {
      redirect('/')
    }
  },
  data: () => ({
    cardTitle: '로그인',
    cardSubtitle: 'VADA PARTNERS 관리자 페이지입니다.',
    forgotPasswordLink: '/forgot-password',
    adminId: '',
    password: null,
    showPassword: false,
    showAlert: false,
    alertMessage: '올바른 비밀번호를 입력해 주십시오.',
    isLoading: false,
  }),
  computed: {
    valid() {
      if (!this.adminId) {
        this.alertMessage = '이메일을 입력해주세요.';
        return false;
      }
      const replaceV = this.adminId.replace(/(\s*)/g, '');
      const pattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
      if (!pattern.test(replaceV)) {
        this.alertMessage = '이메일 형식으로 입력해주세요';
        return false;
      }
      if (!this.password) {
        this.alertMessage = '올바른 비밀번호를 입력해 주십시오.'
        return false;
      }
      return true;
    },
    sideImg() {
      return require('../../assets/login_side_img.jpg')
    },
  },
  methods: {
    async login() {
      this.isLoading = true;
      if (this.valid) {
        await this.$auth.loginWith('local', {data: { email: this.adminId, password: this.password }})
          .then(res => {
            this.isLoading = false;
            this.$router.push('/')
          })
          .catch(err => {
            this.alertMessage = err.response.data['message']
            this.showAlert = true;
            this.isLoading = false;
          })
        this.$router.push('/')
      }
      else {
        this.showAlert = true;
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
</style>
