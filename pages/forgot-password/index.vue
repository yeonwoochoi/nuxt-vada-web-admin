<template>
  <div class="full-size flex-center">
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
            비밀번호 재설정
          </p>
          <p class="subtitle-2 white--text font-weight-regular mb-0">
            인증코드는 등록된 휴대전화 번호로 전달됩니다.
          </p>
        </v-col>
        <v-col cols="10">
          <v-text-field
            v-model="email"
            dense
            filled
            dark
            label="관리자 ID(이메일)"
            prepend-inner-icon="mdi-account"
            class="mt-6"
          />
        </v-col>
        <v-col cols="10">
          <v-btn
            @click="submit"
            large
            rounded
            :width="`100%`"
            height="50"
            class="text-center black--text font-weight-bold subtitle-1 #DCDCDC full-width"
            :loading="isLoading"
          >
            인증번호 전송
          </v-btn>
        </v-col>
        <v-col cols="12" v-if="showAlert"/>
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
import Card from "../../components/Cards/Card";
export default {
  name: "ForgotPassword",
  layout: 'auth',
  components: {Card},
  data: () => ({
    email: '',
    isLoading: false,
    showAlert: false,
    alertMessage: '이메일 형식으로 입력해주세요',
  }),
  computed: {
    sideImg() {
      return require('../../assets/forget_pwd_side_img.png')
    },
    valid () {
      const replaceV = this.email.replace(/(\s*)/g, '')
      const pattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/
      return pattern.test(replaceV)
    }
  },
  methods: {
    async submit() {
      if (this.isLoading) return;
      this.isLoading = true;
      if (this.valid) {
        this.showAlert = false;
        setTimeout(() => {
          alert("인증코드가 전송되었습니다.")
          this.isLoading = false;
          this.$router.push('/forgot-password/auth')
        }, 3000)
      }
      else {
        this.showAlert = true;
        this.isLoading = false;
      }
    },
  }
}
</script>

<style scoped>
</style>
