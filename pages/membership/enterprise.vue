<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="enterpriseUserCardTitle">
          <template v-slot:default>
            <v-data-table
              class="full-width"
              :headers="enterpriseUserInfoTableHeader"
              :items="enterpriseUserInfoTableItems"
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
                      @click="createEnterpriseUser"
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
                      <p class="ellipsis subtitle-1">{{item.companyName}}</p>
                    </v-col>
                    <v-col md="6" cols="12" class="pb-0">
                      <span>
                        <em class="mr-1">매니저 이메일</em>
                        {{ item.managerEmail }}
                      </span>
                    </v-col>
                    <v-col md="6" cols="12" class="pb-0">
                      <span>
                        <em class="mr-1">매니저명</em>
                        {{ item.managerName }}
                      </span>
                    </v-col>
                    <v-col md="6" cols="12" class="pb-0">
                      <span>
                        <em class="mr-1">사업자등록번호</em>
                        {{ item.businessNumber }}
                      </span>
                    </v-col>
                    <v-col md="6" cols="12" class="pb-md-3">
                      <span>
                        <em class="mr-1">포인트</em>
                        {{ item.point }}
                      </span>
                    </v-col>
                    <v-col md="6" cols="12" class="pb-3">
                      <span>
                        <em class="mr-1">1년권만료일</em>
                        {{ item.pass_expiration_at }}
                      </span>
                    </v-col>
                  </v-row>
                </td>
              </template>
              <template v-slot:item.isApproved="{item}">
                <v-chip
                  :color="getColor(item.isApproved)"
                  dark
                  :ripple="false"
                  class="no-background-hover"
                >
                  {{!item.isApproved ? '승인대기' : '승인완료'}}
                </v-chip>
              </template>
              <template v-slot:item.detail="{item}">
                <v-btn
                  class="font-weight-bold elevation-0 pa-0 no-background-hover"
                  :ripple="false"
                  @click="showEnterpriseUserDetail(item)"
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
                    @ok="deleteEnterpriseUser(item)"
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
        <dashboard-card v-if="activeUser" :title="enterpriseUserInfoDetailCardTitle">
          <template v-slot:default>
            <v-row align="start" justify="space-around" class="full-width py-10 px-8">

              <v-col cols="12">
                <p class="title">기본 정보</p>
              </v-col>

              <v-col cols="12" class="py-2"><v-divider/></v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">기업명</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.companyName }}</p>
              </v-col>

              <v-col cols="12" class="py-2"><v-divider/></v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">사업자 등록번호</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.businessNumber }}</p>
              </v-col>

              <v-col cols="12" class="py-2"><v-divider/></v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">매니저 이메일</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.managerEmail }}</p>
              </v-col>

              <v-col cols="12" class="py-2"><v-divider/></v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">매니저명</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.managerName }}</p>
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

              <v-col cols="12" class="mt-10 flex-end">
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
                        :disabled="updatePointLoading"
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

              <v-col cols="12" class="flex-space-between mt-12">
                <p class="title">등록 IP 목록</p>
                <v-dialog
                  v-model="addIpAddressDialogOpen"
                  max-width="400"
                >
                  <template v-slot:activator="{on, attrs}">
                    <v-btn
                      dark
                      class="elevation-0 mt-md-4 mb-md-6"
                      :color="baseColor"
                      v-bind="attrs"
                      v-on="on"
                    >
                      IP 추가
                    </v-btn>
                  </template>
                  <v-card style="height: fit-content" class="py-6 px-4">
                    <v-card-title class="text-h5" style="display: block">
                      IP 추가
                      <v-divider class="mt-4 mb-1 pa-2"/>
                    </v-card-title>
                    <v-card-text>
                      <v-form ref="addNewIpRefs" lazy-validation>
                        <v-text-field
                          v-model="newIpAddress"
                          label="IP 주소 (ex. 192.168.1.50)"
                          flat
                          filled
                          outlined
                          :rules="[rules.ip]"
                        />
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        dark
                        class="elevation-0"
                        :color="baseColor"
                        @click="addIpAddress"
                        :loading="addIpAddressLoading"
                      >
                        변경
                      </v-btn>
                      <v-btn
                        dark
                        class="elevation-0"
                        :color="baseColor"
                        @click="addIpAddressDialogOpen = false"
                        :disabled="addIpAddressLoading"
                      >
                        취소
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>

              <v-col cols="12" v-if="!!activeUser.registeredIP">
                <v-data-table
                  class="full-width"
                  :headers="registeredIpTableHeader"
                  :items="activeUser.registeredIP"
                  :items-per-page="getIpCount"
                  hide-default-footer
                  :mobile-breakpoint="600"
                >
                  <template v-slot:item.isApproved="{item}">
                    <v-chip
                      :color="getColor(item.isApproved)"
                      dark
                      :ripple="false"
                      class="no-background-hover"
                    >
                      {{!item.isApproved ? '승인대기' : '승인완료'}}
                    </v-chip>
                  </template>
                  <template v-slot:item.update="{item}">
                    <v-btn
                      small
                      dark
                      class="elevation-0"
                      :color="baseColor"
                      @click="reissuedPassword(item)"
                      :loading="item.isLoading"
                      :disabled="!item.isApproved"
                    >
                      비밀번호 재발급 >
                    </v-btn>
                  </template>
                  <template v-slot:item.delete="{item}">
                    <v-dialog
                      v-model="item.isDeleteDialogOpen"
                      max-width="350"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          small
                          dark
                          class="elevation-0"
                          :color="baseColor"
                          v-bind="attrs"
                          v-on="on"
                          :disabled="!item.isApproved"
                        >
                          삭제 >
                        </v-btn>
                      </template>
                      <confirmation-dialog
                        @cancel="item.isDeleteDialogOpen = false"
                        @ok="deleteIP(item)"
                        :title="deleteIpDialogTitle"
                        :comment="deleteIpDialogContent"
                      />
                    </v-dialog>
                  </template>
                </v-data-table>
              </v-col>

              <v-col cols="12" class="flex-space-between mt-12">
                <p class="title">사업자 등록증 이미지</p>
                <div>
                  <div class="filebox mr-2">
                    <label for="searchFile">
                      <v-icon color="green" size="25" style="padding-top: 0.1em">mdi-file-upload</v-icon>
                      수정
                    </label>
                    <input
                      ref="searchCsvFile"
                      @change="searchByFile"
                      type="file"
                      id="searchFile"
                      accept="image/*"
                    >
                  </div>
                  <download-button
                    :link="activeUser.businessRegistrationFile"
                  >
                    <template>
                        <span>
                          <v-icon>mdi-file-download</v-icon>
                          다운로드
                        </span>
                    </template>
                  </download-button>
                </div>
              </v-col>
              <v-col cols="12">
                <img :src="activeUser.businessRegistrationFile" style="min-height: 128px; max-height: 200px;" alt="businessRegistrationFile"/>
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
import {mapState} from "vuex";
import ConfirmationDialog from "../../components/Dialog/ConfirmationDialog";
import DownloadButton from "../../components/Buttons/DownloadButton";
export default {
  name: "enterprise",
  components: {DownloadButton, ConfirmationDialog, DashboardCard},
  data: () => ({
    enterpriseUserCardTitle: '기업회원정보',
    enterpriseUserInfoDetailCardTitle: '상세회원정보',
    enterpriseUserInfoTableHeader: [
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
        text: '승인여부',
        sortable: false,
        align: 'center',
        width: '12%',
        value: 'isApproved'
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
    enterpriseUserInfoTableItems: [],

    registeredIpTableHeader: [
      {
        text: 'No',
        value: 'index',
        sortable: false,
        align: 'center',
        width: '7%'
      },
      {
        text: 'IP (Internet Protocol address)',
        align: 'start',
        sortable: false,
        filterable: false,
        value: 'ip',
      },
      {
        text: '아이디',
        align: 'start',
        sortable: false,
        filterable: false,
        value: 'id',
      },
      {
        text: '비밀번호',
        align: 'start',
        sortable: false,
        filterable: false,
        value: 'password',
      },
      {
        text: '승인여부',
        align: 'start',
        sortable: false,
        filterable: false,
        value: 'isApproved',
      },
      {
        text: '재발급',
        align: 'start',
        sortable: false,
        filterable: false,
        value: 'update',
      },
      {
        text: '삭제',
        align: 'start',
        sortable: false,
        filterable: false,
        value: 'delete',
      },
    ],

    initLoading: true,
    updatePointLoading: false,
    addIpAddressLoading: false,

    activeUser: null,

    page: 1,
    totalPage: 1,
    search: '',
    searchInputText: '',

    itemsPerPage: 10,

    deleteDialogTitle: '기업 회원 삭제',
    deleteDialogContent: '바다 파트너스의 모든 데이터는 삭제됩니다. \n정말로 탈퇴하시겠습니까?',

    deleteIpDialogTitle: 'IP 삭제',
    deleteIpDialogContent: 'IP와 이에 대응하는 모든 데이터는 삭제됩니다. \n정말로 삭제하시겠습니까?',

    confirmYearPassTitle: '1년 이용권 부여',

    scrollOptions: {
      duration: 800,
      offset: -80,
      easing: 'easeInOutCubic'
    },

    updatePointDialogOpen: false,
    updateYearPassDialogOpen: false,
    addIpAddressDialogOpen: false,

    newIpAddress: '',
    newBusinessRegistrationFile: null,
  }),
  computed: {
    ...mapState({
      baseColor: "baseColor"
    }),
    currentPath() {
      return this.$router.currentRoute.path;
    },
    getTotalPage() {
      return Math.ceil(this.enterpriseUserInfoTableItems.length / this.itemsPerPage);
    },
    confirmYearPassContent() {
      let currentDate = new Date()
      let now = new Date().getUTCFullYear();
      currentDate.setUTCFullYear(now + 1)
      return `지금으로부터 1년 뒤인 ${currentDate.toISOString().slice(0, 10)} (UTC+0) 까지 1년권이 부여되며, 이미 1년권을 가진 회원의 경우 회원권이 1년 더 연장됩니다.`
    },
    getIpCount() {
      if (!this.activeUser) return 0;
      return this.activeUser.registeredIP.length
    },
    rules() {
      return {
        ip: value => /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value) || '유효하지 않은 IP 주소입니다.'
      }
    }
  },
  methods: {
    async fetchData() {
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
            companyName: 'Samsung',
            businessNumber: '1231231231',
            managerEmail: 'rud527@naver.com',
            managerName: 'choi yeon woo',
            businessRegistrationFile: 'https://cdn.vuetifyjs.com/images/parallax/material.jpg',
            point: 14,
            pass_expiration_at: '2023-03-23',
            registeredIP: [
              {
                index: 1,
                ip: '172.003.214.01',
                id: 'rud532@naver.com',
                password: '123123123a',
                isApproved: true,
              },
            ],
            isApproved: true
          },
          {
            index: 2,
            companyName: 'Samsung',
            businessNumber: '1231231231',
            managerEmail: 'rud527@naver.com',
            managerName: 'choi yeon woo',
            businessRegistrationFile: 'https://cdn.vuetifyjs.com/images/parallax/material.jpg',
            point: 14,
            pass_expiration_at: '2023-03-23',
            registeredIP: [
              {
                index: 1,
                ip: '172.003.214.01',
                id: 'rud532@naver.com',
                password: '123123123a',
                isApproved: true,
              },
              {
                index: 2,
                ip: '172.003.214.01',
                isApproved: false,
              },
            ],
            isApproved: true
          },
          {
            index: 3,
            companyName: 'Samsung',
            businessNumber: '1231231231',
            managerEmail: 'rud527@naver.com',
            managerName: 'choi yeon woo',
            businessRegistrationFile: 'https://cdn.vuetifyjs.com/images/parallax/material.jpg',
            point: 14,
            pass_expiration_at: '2023-03-23',
            registeredIP: [
              {
                index: 1,
                ip: '172.003.214.01',
                id: 'rud532@naver.com',
                password: '123123123a',
                isApproved: true,
              },
              {
                index: 2,
                ip: '172.003.214.01',
                isApproved: false,
              },
            ],
            isApproved: false
          },
          {
            index: 4,
            companyName: 'Samsung',
            businessNumber: '1231231231',
            managerEmail: 'rud527@naver.com',
            managerName: 'choi yeon woo',
            businessRegistrationFile: 'https://cdn.vuetifyjs.com/images/parallax/material.jpg',
            point: 14,
            pass_expiration_at: '2023-03-23',
            registeredIP: [
              {
                index: 1,
                ip: '172.193.214.01',
                id: 'rud532@naver.com',
                password: '123123123a',
                isApproved: true,
              },
              {
                index: 2,
                ip: '172.003.214.01',
                id: 'basjfewi123@naver.com',
                password: '123123123a',
                isApproved: true,
              },
              {
                index: 3,
                ip: '172.023.214.03',
                isApproved: false,
              },
              {
                index: 4,
                ip: '172.003.132.01',
                id: 'chlxodyd33@gmail.com',
                password: '123123123a',
                isApproved: true,
              },
              {
                index: 5,
                ip: '174.003.214.01',
                isApproved: false,
              },
            ],
            isApproved: true
          },
        ];
        let result = []
        for (let i = 0; i < sampleData.length; i++) {
          let temp = sampleData[i];
          for (let j = 0; j < temp.registeredIP.length; j++) {
            temp.registeredIP[j]['isDeleteDialogOpen'] = false
            temp.registeredIP[j]['isLoading'] = false
          }
          result.push({
            ...sampleData[i],
            isDeleteDialogOpen: false
          })
        }
        this.enterpriseUserInfoTableItems = result;

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

    createEnterpriseUser() {
      alert("Create enterprise")
    },

    showEnterpriseUserDetail(item) {
      this.activeUser = item
      this.$vuetify.goTo("#scrollTarget", this.scrollOptions)
    },

    deleteEnterpriseUser(item) {
      this.$router.go(0);
    },

    deleteIP (item) {
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
    },

    addIpAddress() {
      let v = this.$refs.addNewIpRefs.validate();
      if (!v) return;
      this.addIpAddressLoading = true;
      setTimeout(() => {
        this.activeUser = null
        this.addIpAddressLoading = false;
        this.$router.go(0);
      }, 2000)
    },

    reissuedPassword(item) {
      item.isLoading = true;
      setTimeout(() => {
        item.isLoading = false;
        alert("reissuing success")
        this.$router.go(0);
      }, 1000)
    },

    getColor(isApproved) {
      return isApproved ? 'green' : 'red'
    },

    searchByFile(event) {
      this.newBusinessRegistrationFile = event.target.files[0]
      console.dir(event.target.files[0])
      console.log(typeof event.target.files[0])
    },
  },
  mounted() {
    this.fetchData();
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

.filebox label {
  display: inline-block;
  color: #666666;
  font-size: 15px;
  font-weight: bold;
  line-height: normal;
  vertical-align: middle;
  background-color: transparent;
  cursor: pointer;
}

.filebox input[type="file"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip:rect(0,0,0,0);
  border: 0;
}
</style>
