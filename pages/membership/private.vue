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
              item-key="content.idx"
              :no-data-text="noDataText"
              :custom-filter="customFilter"
              :search="search"
            >
              <template v-slot:top>
                <v-row align="center" justify="space-between" class="px-4 my-1">
                  <v-col cols="12" sm="3">
                    <v-btn
                      dark
                      class="elevation-0 mt-md-4 mb-md-6"
                      :color="baseColor"
                      @click="createPrivateUser"
                    >
                      회원추가
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6">
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
                        <em class="mr-1">마지막 로그인</em>
                        {{ item.last_login_at }}
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
                <p class="user-detail-header-font">비밀번호</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.password }}</p>
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
                <p class="user-detail-header-font">마지막 로그인</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.last_login_at }}</p>
              </v-col>

              <v-col cols="12" class="py-2"><v-divider/></v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">구입한 보고서 수</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.purchaseReportCount }}</p>
              </v-col>

              <v-col cols="12" class="py-2"><v-divider/></v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">저장한 보고서 수</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.saveReportCount }}</p>
              </v-col>

              <v-col cols="12" class="py-2"><v-divider/></v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">포인트</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.point }}</p>
              </v-col>

              <v-col cols="12" class="py-2"><v-divider/></v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">1년권 만료일</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.pass_expiration_at }}</p>
              </v-col>

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
                <v-dialog
                  v-model="updateYearPassDialogOpen"
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
                      1년권 부여
                    </v-btn>
                  </template>
                  <confirmation-dialog
                    :title="confirmYearPassTitle"
                    :comment="confirmYearPassContent"
                    @cancel="updateYearPassDialogOpen = false"
                    @ok="giveYearPass"
                  />
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
    return store.dispatch('user/getUsers', true).then(
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
            isDeleteDialogOpen: false,
            //TODO: 이 밑에 있는 데이터 요구하든지 없애든지 하셈
            last_login_at: '2024-03-23 10:35:42',
            pass_expiration_at: '2024-03-23 10:35:42',
            purchaseReportCount: i,
            saveReportCount: i,
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
    this.$store.commit('setSheetTitle', '공지사항')
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

    confirmYearPassTitle: '1년 이용권 부여',

    scrollOptions: {
      duration: 800,
      offset: -80,
      easing: 'easeInOutCubic'
    },

    updatePointDialogOpen: false,
    updateYearPassDialogOpen: false,
    noDataText: ''
  }),
  computed: {
    ...mapState({
      baseColor: "baseColor"
    }),
    currentPath() {
      return this.$router.currentRoute.path;
    },
    confirmYearPassContent() {
      let currentDate = new Date()
      let now = new Date().getUTCFullYear();
      currentDate.setUTCFullYear(now + 1)
      return `지금으로부터 1년 뒤인 ${currentDate.toISOString().slice(0, 10)} (UTC+0) 까지 1년권이 부여되며, 이미 1년권을 가진 회원의 경우 회원권이 1년 더 연장됩니다.`
    },
    activeUserInfo() {
      return [
        { title: '이메일', data: this.activeUser.email },
        { title: '비밀번호', data: this.activeUser.password },
        { title: '회원명', data: this.activeUser.username },
        { title: '연락처', data: this.activeUser.phone },
        { title: '마지막 로그인', data: this.activeUser.last_login_at },
        { title: '구입한 보고서 수', data: this.activeUser.purchaseReportCount },
        { title: '저장한 보고서 수', data: this.activeUser.saveReportCount },
        { title: '포인트', data: this.activeUser.point },
        { title: '1년권 만료일', data: this.activeUser.pass_expiration_at },
      ]
    }
  },
  methods: {
    onClickSearchBtn() {
      this.search = this.searchInputText
      this.noDataText = !!this.search ? '검색결과 없음' : ''
    },

    createPrivateUser() {
      alert('blah')
    },

    showPrivateUserDetail(item) {
      this.activeUser = item
      this.activeUserPoint = this.activeUser.point;
      this.$vuetify.goTo("#scrollTarget", this.scrollOptions)
    },

    deletePrivateUser(item) {
      this.$router.go(0);
    },

    updatePoint() {
      this.updatePointLoading = true;
      this.activeUser.point = this.activeUserPoint;

      setTimeout(() => {
        this.activeUser = null
        this.activeUserPoint = 0;
        this.updatePointLoading = false;
        this.updatePointDialogOpen = false;
        this.$router.go(0);
      }, 2000)
    },

    giveYearPass() {
      setTimeout(() => {
        this.activeUser = null
        this.$router.go(0);
      }, 2000)
    },

    customFilter(items, search, filter) {
      if (!search || !items) return items;
      if (items.email.includes(search) || items.username.includes(search) || items.phone.includes(search)) {
        return items;
      }
      return null
    }
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
