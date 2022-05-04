<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="editProfileTitle">
          <template v-slot:default>
            <v-row align="start" justify="center" class="full-width py-12 px-md-8">
              <v-col cols="11">
                <v-form ref="editForm" v-model="valid" lazy-validation>
                  <v-row align="center" justify="space-around">
                    <v-col cols="3">
                      <p class="subtitle-2 text-start">이메일</p>
                    </v-col>
                    <v-col cols="9">
                      <p class="subtitle-1 text-start">{{managerInfo.email}}</p>
                    </v-col>
                    <v-col cols="3">
                      <p class="subtitle-2 text-start">비밀번호</p>
                    </v-col>
                    <v-col cols="9">
                      <v-text-field
                        v-model="password"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPassword = !showPassword"
                        :rules="[rules.password]"
                        outlined
                        dense
                        filled
                        :type="showPassword ? 'text' : 'password'"
                        background-color="transparent"
                      />
                    </v-col>
                    <v-col cols="3">
                      <p class="subtitle-2 text-start">비밀번호 확인</p>
                    </v-col>
                    <v-col cols="9">
                      <v-text-field
                        v-model="passwordConfirm"
                        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="showPassword = !showPassword"
                        :rules="[rules.passwordConfirm]"
                        outlined
                        dense
                        filled
                        :type="showPassword ? 'text' : 'password'"
                        background-color="transparent"
                      />
                    </v-col>
                    <v-col cols="3">
                      <p class="subtitle-2 text-start">이름</p>
                    </v-col>
                    <v-col cols="9">
                      <v-text-field
                        v-model="managerInfo.name"
                        :rules="[rules.required]"
                        required
                        outlined
                        dense
                        filled
                        background-color="transparent"
                      />
                    </v-col>
                    <v-col cols="3">
                      <p class="subtitle-2 text-start">연락처(-없이 번호만 입력)</p>
                    </v-col>
                    <v-col cols="9">
                      <v-text-field
                        v-model="managerInfo.phone"
                        @keypress="isNumber($event)"
                        maxlength="12"
                        :rules="[rules.required]"
                        outlined
                        dense
                        filled
                        background-color="transparent"
                      />
                    </v-col>
                    <v-col cols="12" class="pt-0">
                      <div class="full-width flex-end">
                        <custom-button
                          :width="'200'"
                          :text="`수정`"
                          :loading="loading"
                          :color="baseColor"
                          @submit="edit"
                          class="mt-4 white--text"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
          </template>
        </dashboard-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DashboardCard from "../../components/Cards/DashboardCard";
import CustomButton from "../../components/Buttons/CustomButton";
import {mapState} from "vuex";
export default {
  name: "ProfileEdit",
  components: {CustomButton, DashboardCard},
  asyncData({store}) {
    return store.dispatch('user/getUserByIdx', store.$auth.user.id).then(
      res => {
        return {
          managerInfo: {
            email: res['email'],
            name: res['fullName'],
            phone: res['phoneNumber']
          },
          fetchError: null
        }
      },
      err => {
        return {
          managerInfo: {
            email: '',
            name: '',
            phone: ''
          },
          fetchError: err
        }
      }
    )
  },
  created() {
    if (!!this.fetchError) {
      this.$errorHandler.showMessage(this.fetchError)
    }
  },
  data: () => ({
    editProfileTitle: '관리자 정보 수정',
    password: '',
    passwordConfirm: '',
    showPassword: false,
    valid: false,
    loading: false,
  }),
  computed: {
    ...mapState({
      baseColor: 'baseColor'
    }),
    rules() {
      return {
        required: value => !!value || '값을 입력해주세요',
        password: value => /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).*$/.test(value) || '영문 대소문자와 최소 1개의 숫자를 포함해야 합니다.',
        passwordConfirm: value => value === this.password || '비밀번호가 일치하지 않습니다.',
      }
    },
  },
  methods: {
    async edit() {
      this.valid = this.$refs.editForm.validate();
      if (this.valid) {
        if (this.loading) return
        this.loading = true;

        let payload = {
          name: this.managerInfo.name,
          phoneNumber: this.managerInfo.phone,
          password: this.password
        }

        await this.$store.dispatch('user/updateUser', payload).then(
          res => {
            this.$notifier.showMessage({
              content: '업데이트 성공',
              color: 'success'
            })
            this.loading = false;
          },
          err => {
            this.$errorHandler.showMessage(err)
            this.loading = false;
          }
        )
      }
      else {
        this.$notifier.showMessage({
          content: '입력한 정보를 확인해 주세요',
          color: 'error'
        })
        this.loading = false;
      }
    },
    isNumber: function(evt) {
      evt = (evt) ? evt : window.event;
      let charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
  },
}
</script>

<style scoped>

</style>
