<template>
  <div class="full-size flex-center">
    <div class="full-height auth-content-card-color" :class="`${$vuetify.breakpoint.smAndDown ? 'full-width' : 'half-width'}`">
      <v-alert
        :value="showAlert"
        type="error"
        transition="slide-y-transition"
        class="subtitle-2"
      >
        {{ alertMessage }}
      </v-alert>
      <v-row align="center" justify="center" class="py-16 px-12 ma-0 full-size" :class="`${showAlert ? 'pt-0' : 'pt-16'}`">
        <v-col cols="11" class="text-center pb-3">
          <p class=" display-1 white--text">
            비밀번호 재설정
          </p>
          <p class="subtitle-2 white--text font-weight-regular mb-0">
            인증코드 입력 후 비밀번호를 새로 설정해 주세요.
          </p>
        </v-col>
        <v-col cols="8" class="pr-0 pb-0">
          <v-text-field
            v-model="emailAuth"
            dense
            filled
            dark
            label="인증코드"
            prepend-inner-icon="mdi-focus-field-horizontal"
            hide-details
          />
        </v-col>
        <v-col cols="3">
          <v-btn
            large
            @click="resendAuthCode"
            class="font-weight-bold black--text subtitle-2"
            color="white"
            width="fit-content"
            :loading="isSendLoading"
            height="52"
            style="letter-spacing: 1px; text-transform: none; margin-top: 1em;"
          >
            재전송
          </v-btn>
        </v-col>
        <v-col cols="11">
          <v-text-field
            v-model="password"
            dense
            filled
            dark
            hide-details
            label="새 비밀번호"
            prepend-inner-icon="mdi-lock-outline"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :type="showPassword ? 'text' : 'password'"
          />
        </v-col>
        <v-col cols="11">
          <v-text-field
            v-model="passwordConfirm"
            dense
            filled
            dark
            hide-details
            label="새 비밀번호 확인"
            prepend-inner-icon="mdi-lock-check-outline"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            :type="showPassword ? 'text' : 'password'"
          />
        </v-col>
        <v-col cols="11" class="mt-3">
          <v-btn
            @click="submit"
            large
            rounded
            :width="`100%`"
            height="50"
            class="text-center black--text font-weight-bold subtitle-1 #DCDCDC full-width"
            :loading="isLoading"
          >
            확인
          </v-btn>
          <v-btn
            to="/login"
            large
            rounded
            color="transparent"
            :width="`100%`"
            height="50"
            :ripple="false"
            class="no-background-hover text-center white--text font-weight-bold subtitle-1 full-width elevation-0 mt-2"
          >
            취소
          </v-btn>
        </v-col>
        <v-col cols="11" v-if="showAlert"/>
      </v-row>
    </div>
    <div v-if="$vuetify.breakpoint.mdAndUp" class="half-width full-height flex-start px-6">
      <v-img
        :src="sideImg"
        class="full-height"
        contain
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ForgotPasswordAuth",
  layout: 'auth',
  auth: false,
  asyncData({$auth, redirect, store}) {
    if ($auth.loggedIn) {
      redirect('/')
    }
    else if (!store.getters["user/getEmailForPwdReset"]) {
      redirect('/membership/reset-password')
    }
    return {
      email: store.getters["user/getEmailForPwdReset"]
    }
  },
  destroyed() {
    this.$store.commit('user/resetEmailForPwdReset')
  },
  data: () => ({
    emailAuth: '',
    password: '',
    passwordConfirm: '',
    showPassword: false,
    isLoading: false,
    showAlert: false,
    alertMessage: '',
    isSendLoading: false,
  }),
  computed: {
    sideImg() {
      return require('../../assets/forget_pwd_side_img.png')
    },
    rules() {
      return {
        required: value => !!value || '값을 입력해주세요',
        password: value => /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).*$/.test(value) || '영문 대소문자와 최소 1개의 숫자 혹은 특수 문자를 포함해야 합니다.',
        passwordConfirm: value => value === this.password || '비밀번호가 일치하지 않습니다.',
      }
    },
  },
  methods: {
    async submit() {
      this.isLoading = true;

      if (!this.emailAuth || !this.password || !this.passwordConfirm) {
        this.alertMessage = '모든 값을 입력해주세요.'
      }
      else if (!/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).*$/.test(this.password)) {
        this.alertMessage = '영문 대소문자와 최소 1개의 숫자 혹은 특수 문자를 포함해야 합니다.'
      }
      else if (this.password !== this.passwordConfirm) {
        this.alertMessage = '비밀번호가 일치하지 않습니다.'
      }
      else {
        let param = {
          email: this.email,
          code: this.emailAuth
        }
        // 인증코드 확인
        let params = {
          email: this.email,
          code: this.emailAuth,
          password: this.password
        }
        await this.$store.dispatch('user/changePassword', params).then(
          res => {
            this.isLoading = false;
            this.showAlert = false;
            this.$store.commit('user/resetEmailForPwdReset')
            alert("비밀번호 변경 성공")
            this.$router.push('/login')
          },
          err => {
            this.alertMessage = err
            this.showAlert = true;
            this.isLoading = false;
          }
        )
        return
      }
      this.showAlert = true;
      this.isLoading = false;
    },
    //TODO (Email auth): 재전송 코드 수정
    async resendAuthCode() {
      this.isSendLoading = true;
      if (!!this.email) {
        let params = {
          type: 'Find',
          email: this.email
        }
        await this.$store.dispatch('user/sendEmailAuthCode', params).then(
          res => {
            this.showAlert = false;
            alert("인증코드가 재전송되었습니다.")
            this.isSendLoading = false;
          },
          err => {
            this.alertMessage = err
            this.showAlert = true;
            this.isSendLoading = false;
          }
        )
      }
      else {
        this.alertMessage = '오류가 발생했습니다. 다시 시도해주세요.'
        this.showAlert = true;
        this.isSendLoading = false;
      }
    },
  }
}
</script>

<style scoped>
</style>
