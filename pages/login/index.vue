<template>
  <div class="full-size flex-center">
    <div v-if="!isMobile" class="half-width full-height flex-start">
      <v-img
        :src="sideImg"
        class="full-height"
        contain
      />
    </div>
    <div class="full-height auth-content-card-color" :class="`${isMobile ? 'full-width' : 'half-width'}`">
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
  data: () => ({
    cardTitle: '로그인',
    cardSubtitle: 'VADA PARTNERS 관리자 페이지입니다.',
    forgotPasswordLink: '/forgot-password',
    adminId: '',
    password: null,
    showPassword: false,
    showAlert: false,
    alertMessage: '올바른 비밀번호를 입력해 주십시오.',
  }),
  computed: {
    valid() {
      return !!this.adminId && !!this.password
    },
    sideImg() {
      return require('../../assets/login_side_img.jpg')
    },
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case "sm": return true;
        case "xs": return true;
        default: return false;
      }
    },
  },
  methods: {
    async login() {
      // TODO (LOGIN): 로그인 기능
      if (this.valid) {
        this.$router.push('/')
      }
      else {
        this.showAlert = true;
      }
    }
  }
}
</script>

<style scoped>
</style>
