<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="adminProfileTitle">
          <template v-slot:default>
            <v-row align="start" justify="center" class="full-width py-10 px-md-8">
              <v-col cols="11" class="mt-4">
                <p class="font-weight-bold subtitle-1 mb-0">· 로그인 정보</p>
              </v-col>
              <v-col cols="12" sm="11" class="ml-sm-3">
                <vertical-header-table
                  :table-header="loginHeaders"
                  :table-items="loginItems"
                />
              </v-col>
              <v-col cols="11" class="mt-8">
                <p class="font-weight-bold subtitle-1 mb-0">· 관리자 정보</p>
              </v-col>
              <v-col cols="12" sm="11" class="ml-sm-3">
                <vertical-header-table
                  :table-header="managerHeaders"
                  :table-items="managerItems"
                />
              </v-col>
              <v-col cols="11" class="pr-0 mt-8">
                <div class="full-width flex-end">
                  <custom-button
                    :width="`200`"
                    @submit="editProfile"
                    :color="baseColor"
                    :text="`수정하기`"
                    class="darken-1 white--text"
                  />
                </div>
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
import VerticalHeaderTable from "../../components/Tables/VerticalHeaderTable";
import CustomButton from "../../components/Buttons/CustomButton";
import {mapState} from "vuex";
export default {
  name: "Profile",
  components: {CustomButton, VerticalHeaderTable, DashboardCard},
  data: () => ({
    adminProfileTitle: '관리자 정보',
    loginHeaders: [
      {
        text: '아이디',
        value: 'id',
      },
      {
        text: '비밀번호',
        value: 'password'
      },
    ],
    loginItems: [
      {
        id: 'ajslfdjlwe123',
        password: 'jfweinie1!'
      }
    ],
    managerHeaders: [
      {
        text: '관리자명',
        value: 'name'
      },
      {
        text: '이메일',
        value: 'email'
      },
      {
        text: '연락처',
        value: 'phone'
      },
    ],
    managerItems: [
      {
        name: '비글',
        email: 'jsff12@naver.com',
        phone: '010-3483-2342'
      }
    ]
  }),
  computed: {
    ...mapState({
      baseColor: 'baseColor'
    })
  },
  methods: {
    editProfile() {
      this.$router.push('/profile/edit')
    },
  }
}
</script>

<style scoped>

</style>
