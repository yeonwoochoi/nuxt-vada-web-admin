<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="adminProfileTitle">
          <template v-slot:default>
            <v-row align="start" justify="center" class="full-width py-10 px-md-8">
              <v-col cols="12" sm="11" class="ml-sm-3 mt-8">
                <vertical-header-table
                  :table-header="managerHeaders"
                  :table-items="managerInfo"
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
  asyncData({store}) {
    return store.dispatch('user/getUserByIdx', store.$auth.user.id).then(
      res => {
        return {
          managerInfo: [{
            email: res['email'],
            name: res['fullName'],
            phone: res['phoneNumber']
          }],
          fetchError: null
        }
      },
      err => {
        return {
          managerInfo: [],
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
    adminProfileTitle: '관리자 정보',
    managerHeaders: [
      {
        text: '이메일',
        value: 'email'
      },
      {
        text: '관리자명',
        value: 'name'
      },
      {
        text: '연락처',
        value: 'phone'
      },
    ],
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
