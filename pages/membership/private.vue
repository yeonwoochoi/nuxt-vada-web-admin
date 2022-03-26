<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="privateUserInfoCardTitle">
          <template v-slot:default>
            <v-data-table
              class="full-width"
              :headers="privateUserInfoTableHeader"
              :items="privateUserInfoTableItems"
              :items-per-page="itemsPerPage"
              :loading="initLoading"
              hide-default-footer
              :mobile-breakpoint="600"
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
              <template v-slot:footer>
                <v-pagination
                  v-model="page"
                  :length="totalPage"
                  :color="baseColor"
                  total-visible="10"
                  prev-icon="mdi-menu-left"
                  next-icon="mdi-menu-right"
                  class="my-6"
                  @input="changePage"
                />
              </template>
            </v-data-table>
          </template>
        </dashboard-card>
      </v-col>
      <v-col cols="12" class="my-2" id="scrollTarget">
        <dashboard-card v-if="activeUser" :title="privateUserInfoDetailCardTitle">
          <template v-slot:default>
            <v-row align="start" justify="space-around" class="full-width py-10 px-8">

              <v-col cols="12" class="py-2"><v-divider/></v-col>

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
                        v-model="activeUser.point"
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
  data: () => ({
    privateUserInfoCardTitle: '개인회원정보',
    privateUserInfoTableHeader: [
      {
        text: 'No',
        value: 'index',
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
    privateUserInfoTableItems: [],
    privateUserInfoDetailCardTitle: '상세회원정보',

    page: 1,
    totalPage: 1,
    search: '',
    searchInputText: '',

    itemsPerPage: 10,

    activeUser: null,

    initLoading: true,
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
  }),
  computed: {
    ...mapState({
      baseColor: "baseColor"
    }),
    currentPath() {
      return this.$router.currentRoute.path;
    },
    getTotalPage() {
      return Math.ceil(this.privateUserInfoTableItems.length / this.itemsPerPage);
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
    fetchData() {
      let currentPage = parseInt(this.$route.query.page)
      this.page = !currentPage ? 1 : currentPage;
      this.search = !this.$route.query.keyword ? '' : this.$route.query.keyword;
      this.searchInputText = this.search

      // TODO: Fetch Data
      setTimeout(() => {
        // dialog open 에 관여할 변수를 row 마다 만들어줘야해서
        let sampleData = [
          {
            index: 1,
            email: 'rud527@naver.com',
            username: 'choi yeon woo',
            password: '123123a',
            phone: '010-8560-3442',
            last_login_at: '2022-03-23 10:35:42',
            point: 14,
            pass_expiration_at: '2024-03-23 10:35:42',
            purchaseReportCount: 10,
            saveReportCount: 5
          },
          {
            index: 2,
            email: 'rud527@naver.com',
            username: 'kim min jae',
            password: '123123a',
            phone: '010-8560-3442',
            last_login_at: '2022-03-23 10:35:42',
            point: 14,
            pass_expiration_at: '-',
            purchaseReportCount: 10,
            saveReportCount: 5
          },
          {
            index: 3,
            email: 'rud527@naver.com',
            username: 'Lee nam kyu',
            password: '123123a',
            phone: '010-8560-3442',
            last_login_at: '2022-03-23 10:35:42',
            point: 652,
            pass_expiration_at: '2024-03-23 10:35:42',
            purchaseReportCount: 10,
            saveReportCount: 5
          },
          {
            index: 4,
            email: 'rud527@naver.com',
            username: 'Cho sung jin',
            password: '123123a',
            phone: '010-8560-3442',
            last_login_at: '2022-03-23 10:35:42',
            point: 430,
            pass_expiration_at: '-',
            purchaseReportCount: 10,
            saveReportCount: 5
          },
        ];
        let result = []
        for (let i = 0; i < sampleData.length; i++) {
          result.push({
            ...sampleData[i],
            isDeleteDialogOpen: false
          })
        }
        this.privateUserInfoTableItems = result;

        this.totalPage = this.getTotalPage;
        this.initLoading = false
      }, 1000)
    },

    changePage() {
      let query = !this.search
        ? {page: this.page}
        : {page: this.page, keyword: this.search};
      this.$router.push({
        path: this.currentPath,
        query: query
      })
    },

    onClickSearchBtn() {
      this.search = this.searchInputText
      this.page = 1;
      this.$router.push({
        path: this.currentPath,
        query: {
          page: this.page,
          keyword: this.search,
        }
      })
    },

    createPrivateUser() {
      alert('blah')
    },

    showPrivateUserDetail(item) {
      this.activeUser = item
      this.$vuetify.goTo("#scrollTarget", this.scrollOptions)
    },

    deletePrivateUser(item) {
      this.$router.go(0);
    },

    updatePoint() {
      this.updatePointLoading = true;
      setTimeout(() => {
        this.activeUser = null
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
    }
  },
  mounted() {
    this.fetchData()
  }
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
