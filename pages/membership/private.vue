<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="privateUserInfoCardTitle">
          <template v-slot:default>
            <v-data-table
              class="full-width"
              :headers="privateUserInfoTableHeader"
              :items="userList"
              :mobile-breakpoint="600"
              item-key="no"
              :no-data-text="noDataText"
              :custom-filter="customFilter"
              :search="search"
            >
              <template v-slot:top>
                <v-row align="center" justify="end" class="px-4 my-1">
                  <v-col cols="12" sm="6" class="my-4">
                    <div class="flex-center">
                      <v-text-field
                        v-model="searchInputText"
                        label="Search"
                        single-line
                        hide-details
                        clearable
                        class="pt-0 mt-0"
                      >
                      </v-text-field>
                      <v-btn
                        class="elevation-0 ml-3 button-border-grey"
                        outlined
                        @click="onClickSearchBtn"
                      >
                        검색
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </template>
              <template v-slot:item.content="{item}">
                <td class="text-start ellipsis" style="font-size: 13px;">
                  <v-row align="center" justify="start" class="py-4">
                    <v-col cols="12" class="pb-0">
                      <p class="ellipsis subtitle-1">{{item.email}}</p>
                    </v-col>
                    <v-col md="4" cols="12" class="pb-0">
                      <span>
                        <em class="mr-1">회원명</em>
                        {{ item.username }}
                      </span>
                    </v-col>
                    <v-col md="4" cols="12" class="pb-0">
                      <span>
                        <em class="mr-1">연락처</em>
                        {{ item.phone }}
                      </span>
                    </v-col>
                    <v-col md="4" cols="12" class="pb-0">
                      <span>
                        <em class="mr-1">포인트</em>
                        {{ item.point + ' point' }}
                      </span>
                    </v-col>
                    <v-col md="4" cols="12" class="pb-3">
                      <span>
                        <em class="mr-1">가입일</em>
                        {{ item.created_at }}
                      </span>
                    </v-col>
                  </v-row>
                </td>
              </template>
              <template v-slot:item.detail="{item}">
                <v-btn
                  class="font-weight-bold elevation-0 pa-0 no-background-hover"
                  :ripple="false"
                  @click="showPrivateUserDetail(item)"
                  color="transparent"
                >
                  상세보기 >
                </v-btn>
              </template>
              <template v-slot:item.delete="{item}">
                <v-dialog
                  v-model="item.isDeleteDialogOpen"
                  max-width="350"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="font-weight-bold elevation-0 pa-0 no-background-hover"
                      :ripple="false"
                      color="transparent"
                      v-bind="attrs"
                      v-on="on"
                    >
                      삭제하기 >
                    </v-btn>
                  </template>
                  <confirmation-dialog
                    @cancel="item.isDeleteDialogOpen = false"
                    @ok="deletePrivateUser(item)"
                    :title="deleteDialogTitle"
                    :comment="deleteDialogContent"
                  />
                </v-dialog>
              </template>
            </v-data-table>
          </template>
        </dashboard-card>
      </v-col>
      <v-col cols="12" class="my-2" id="scrollTarget">
        <dashboard-card v-if="activeUser" :title="privateUserInfoDetailCardTitle">
          <template v-slot:default>
            <v-row align="start" justify="space-around" class="full-width py-16 px-14">

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">이메일</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.email }}</p>
              </v-col>

              <v-col cols="12" class="py-2"><v-divider/></v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">회원명</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.username }}</p>
              </v-col>

              <v-col cols="12" class="py-2"><v-divider/></v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">연락처</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.phone }}</p>
              </v-col>

              <v-col cols="12" class="py-2"><v-divider/></v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">가입일</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.created_at }}</p>
              </v-col>

              <v-col cols="12" class="py-2"><v-divider/></v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">포인트</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.point }}</p>
              </v-col>

              <v-col cols="12" class="py-2"><v-divider/></v-col>

              <v-col cols="12" class="mt-10" align="end">
                <v-dialog
                  v-model="updatePointDialogOpen"
                  max-width="400"
                >
                  <template v-slot:activator="{on, attrs}">
                    <v-btn
                      x-large
                      dark
                      class="font-weight-bold ma-1"
                      :color="baseColor"
                      width="200px"
                      height="52px"
                      v-bind="attrs"
                      v-on="on"
                      style="letter-spacing: 1px; text-transform: none;"
                    >
                      포인트 변경
                    </v-btn>
                  </template>
                  <v-card style="height: fit-content" class="py-6 px-4">
                    <v-card-title class="text-h5" style="display: block">
                      포인트 변경
                      <v-divider class="mt-4 mb-1 pa-2"/>
                    </v-card-title>
                    <v-card-text>
                      <v-text-field
                        v-model="activeUserPoint"
                        flat
                        filled
                        hide-details
                        outlined
                        @keypress="isNumber($event)"
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        dark
                        class="elevation-0"
                        :color="baseColor"
                        @click="updatePoint"
                        :loading="updatePointLoading"
                      >
                        변경
                      </v-btn>
                      <v-btn
                        dark
                        class="elevation-0"
                        :color="baseColor"
                        @click="updatePointDialogOpen = false"
                      >
                        취소
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
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
import ConfirmationDialog from "../../components/Dialog/ConfirmationDialog";
import {mapState} from "vuex";

export default {
  name: "private",
  components: {ConfirmationDialog, DashboardCard},
  asyncData({store}) {
    return store.dispatch('user/getPrivateUsers').then(
      res => {
        let result = []
        for (let i = 0; i < res.length; i++) {
          let temp = res[i];
          result.push({
            no: i+1,
            idx: temp['id'],
            email: temp['email'],
            username: temp['fullName'],
            phone: temp['phoneNumber'],
            point: temp['leftReport'],
            created_at: temp['createdAt'].split('T')[0],
            isDeleteDialogOpen: false,
          })
        }
        return {
          userList: result,
          fetchError: null
        }
      },
      err => {
        return {
          userList: null,
          fetchError: err
        }
      }
    )
  },
  created() {
    this.$store.commit('setSheetTitle', '개인회원정보')
    if (!!this.fetchError) {
      this.$notifier.showMessage({
        content: this.fetchError,
        color: 'error'
      })
    }
  },
  data: () => ({
    privateUserInfoCardTitle: '개인회원정보',
    privateUserInfoTableHeader: [
      {
        text: 'No',
        value: 'no',
        sortable: false,
        align: 'center',
        width: '7%'
      },
      {
        text: '내용',
        align: 'start',
        sortable: false,
        filterable: false,
        value: 'content',
      },
      {
        text: '상세보기',
        align: 'start',
        sortable: false,
        filterable: false,
        value: 'detail',
        width: '12%'
      },
      {
        text: '삭제',
        align: 'start',
        sortable: false,
        filterable: false,
        value: 'delete',
        width: '12%'
      },
    ],
    privateUserInfoDetailCardTitle: '상세회원정보',

    search: '',
    searchInputText: '',

    activeUser: null,
    activeUserPoint: 0,

    updatePointLoading: false,

    deleteDialogTitle: '회원 삭제',
    deleteDialogContent: '바다 파트너스의 모든 데이터는 삭제됩니다. \n정말로 탈퇴하시겠습니까?',

    scrollOptions: {
      duration: 800,
      offset: -80,
      easing: 'easeInOutCubic'
    },

    updatePointDialogOpen: false,
    noDataText: ''
  }),
  computed: {
    ...mapState({
      baseColor: "baseColor"
    }),
    currentPath() {
      return this.$router.currentRoute.path;
    },
  },
  methods: {
    onClickSearchBtn() {
      this.search = this.searchInputText
      this.noDataText = !!this.search ? '검색결과 없음' : ''
    },

    showPrivateUserDetail(item) {
      this.activeUser = item
      this.activeUserPoint = this.activeUser.point;
      this.$vuetify.goTo("#scrollTarget", this.scrollOptions)
    },

    deletePrivateUser({idx}) {
      //TODO: 임시 개인 회원을 만들고 삭제해야하는데 현재 연구실 컴으로 메일 인증이 안되니 이따가 확인하기
      this.$store.dispatch('user/deletePrivateUser', idx).then(
        res => {
          alert("회원 삭제 성공")
          this.$router.go(0)
        },
        err => {
          this.$notifier.showMessage({
            content: err,
            color: 'error'
          })
        }
      )
    },

    async updatePoint() {
      this.updatePointLoading = true;
      if (this.activeUser.point === this.activeUserPoint) {
        this.$notifier.showMessage({
          content: '값이 변경되지 않았습니다.',
          color: 'error'
        })
        this.updatePointLoading = false;
        return;
      }

      let payload = {
        id: this.activeUser.idx,
        report: this.activeUserPoint
      }
      await this.$store.dispatch('patent/updatePrivateUserPoint', payload).then(
        res => {
          alert("포인트가 변경되었습니다.")
          this.activeUser.point = this.activeUserPoint
          this.updatePointLoading = false;
          this.updatePointDialogOpen = false;
          this.$router.go(0);
        },
        err => {
          this.$notifier.showMessage({
            content: err,
            color: 'error'
          })
          this.updatePointLoading = false;
        }
      )
    },

    customFilter(value, search, filter) {
      if (!search || !value) return value;
      if (filter.email.includes(search) || filter.username.includes(search) || filter.phone.includes(search)) {
        return value;
      }
      return null
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
p {
  margin-bottom: 0;
}

em {
  font-size: 0.95em;
  display: inline-block;
  background-color: #e5e5e5;
  margin-right: 0.25em;
  padding: 0 0.4em;
  border-radius: 20px;
  text-align: center;
  width: fit-content;
  font-style: normal;
}
</style>
