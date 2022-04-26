<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="enterpriseUserCardTitle">
          <template v-slot:default>
            <v-data-table
              class="full-width"
              :headers="enterpriseUserInfoTableHeader"
              :items="enterprises"
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
                      <p class="ellipsis subtitle-1">{{item.companyName}}</p>
                    </v-col>
                    <v-col md="6" cols="12" class="pb-0">
                      <span>
                        <em class="mr-1">매니저 이메일</em>
                        {{ item.managerInfo.email }}
                      </span>
                    </v-col>
                    <v-col md="6" cols="12" class="pb-0">
                      <span>
                        <em class="mr-1">매니저명</em>
                        {{ item.managerInfo.fullName }}
                      </span>
                    </v-col>
                    <v-col md="6" cols="12" class="pb-0">
                      <span>
                        <em class="mr-1">매니저연락처</em>
                        {{ item.managerInfo.phoneNumber }}
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
                        <em class="mr-1">가입(신청)일</em>
                        {{ item.created_at }}
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
                <p class="user-detail-content-font">{{ activeUser.managerInfo.email }}</p>
              </v-col>

              <v-col cols="12" class="py-2"><v-divider/></v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">매니저명</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.managerInfo.fullName }}</p>
              </v-col>

              <v-col cols="12" class="py-2"><v-divider/></v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">매니저 연락처</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeUser.managerInfo.phoneNumber }}</p>
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

              <v-col cols="12" class="mt-10 flex-end" v-if="activeUser.isApproved">
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
                      :disabled="updateYearPassLoading"
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
                      :loading="updateYearPassLoading"
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
              <v-col cols="12" class="mt-10 flex-end" v-else>
                <v-dialog
                  v-model="confirmSignUpDialogOpen"
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
                      :loading="approveSignUpLoading"
                    >
                      가입 승인
                    </v-btn>
                  </template>
                  <confirmation-dialog
                    :title="confirmSignUpDialogTitle"
                    :comment="confirmSignUpDialogContent"
                    @cancel="confirmSignUpDialogOpen = false"
                    @ok="approveSignup"
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
                      회원추가
                    </v-btn>
                  </template>
                  <v-card style="height: fit-content" class="py-6 px-4">
                    <v-card-title class="text-h5" style="display: block">
                      회원추가
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
                        <v-text-field
                          v-model="newEmail"
                          label="회원 이메일"
                          flat
                          filled
                          outlined
                          :rules="[rules.email]"
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
                  <template v-slot:item.approved="{item}">
                    <v-chip
                      :color="getColor(item.approved)"
                      dark
                      :ripple="false"
                      class="no-background-hover"
                    >
                      {{!item.approved ? '승인대기' : '승인완료'}}
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
                      :disabled="!activeUser.isApproved"
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
                          :disabled="!activeUser.isApproved"
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
                <p class="title">사업자 등록증 파일 (pdf)</p>
                <div class="flex-center">
                  <div class="filebox mr-4">
                    <label for="searchFile">
                      <v-icon color="green" size="25">mdi-file-upload</v-icon>
                      수정
                    </label>
                    <input
                      ref="selectPdfFile"
                      @change="searchByFile"
                      type="file"
                      id="searchFile"
                      accept="application/pdf"
                    >
                  </div>
                  <button
                    type="button"
                    class="no-background-hover elevation-0 mx-2 subtitle-2 font-weight-bold"
                    @click="downloadBusinessRegistrationFile"
                    style="background-color: transparent; color: #666666; height: fit-content"
                  >
                    <span>
                      <v-icon>mdi-file-download</v-icon>
                      양식 다운로드
                    </span>
                  </button>
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
  async asyncData({$axios}) {
    try {
      let enterpriseInfo = await Promise.all([$axios.$get('/enterprise')])
      let enterprises = enterpriseInfo[0]['enterprises']
      let result = [];
      for (let i = 0; i < enterprises.length; i++) {
        let temp = enterprises[i]
        let managerInfo = await Promise.all([$axios.$get('/user/' + temp['managerId'])])
        result.push({
          no: i + 1,
          idx: temp['id'],
          companyName: temp['organizationName'],
          businessNumber: temp['organizationNumber'],
          managerInfo: managerInfo[0]['user'],
          isApproved: temp['approved'],
          created_at: temp['createdAt'].split("T")[0],
          isDeleteDialogOpen: false
        })
      }
      return {
        enterprises: result,
        fetchError: null
      }
    }
    catch (e) {
      return {
        enterprises: [],
        fetchError: e
      }
    }
  },
  created() {
    this.$store.commit('setSheetTitle', '기업회원정보')
    if (!!this.fetchError) {
      this.$notifier.showMessage({
        content: this.fetchError,
        color: 'error'
      })
    }
  },
  data: () => ({
    enterpriseUserCardTitle: '기업회원정보',
    enterpriseUserInfoDetailCardTitle: '상세회원정보',
    enterpriseUserInfoTableHeader: [
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

    registeredIpTableHeader: [
      {
        text: 'No',
        value: 'no',
        sortable: false,
        align: 'center',
        width: '7%'
      },
      {
        text: 'IP (Internet Protocol address)',
        align: 'start',
        sortable: false,
        filterable: false,
        value: 'restrictedIp',
      },
      {
        text: '이메일',
        align: 'start',
        sortable: false,
        filterable: false,
        value: 'email',
      },
      {
        text: '승인여부',
        align: 'start',
        sortable: false,
        filterable: false,
        value: 'approved',
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

    updatePointLoading: false,
    updateYearPassLoading: false,
    addIpAddressLoading: false,
    approveSignUpLoading: false,

    activeUser: null,
    activeUserPoint: 0,

    search: '',
    searchInputText: '',

    deleteDialogTitle: '기업 회원 삭제',
    deleteDialogContent: '바다 파트너스의 모든 데이터는 삭제됩니다. \n정말로 탈퇴하시겠습니까?',

    deleteIpDialogTitle: 'IP 삭제',
    deleteIpDialogContent: 'IP와 이에 대응하는 모든 데이터는 삭제됩니다. \n정말로 삭제하시겠습니까?',

    confirmYearPassTitle: '1년 이용권 부여',

    confirmSignUpDialogTitle: '가입 승인',
    confirmSignUpDialogContent: '기업 회원 가입을 승인하시겠습니까?',

    scrollOptions: {
      duration: 800,
      offset: -80,
      easing: 'easeInOutCubic'
    },

    updatePointDialogOpen: false,
    updateYearPassDialogOpen: false,
    addIpAddressDialogOpen: false,
    confirmSignUpDialogOpen: false,

    newIpAddress: '',
    newEmail: '',
    newBusinessRegistrationFile: null,

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
      let currentDate = this.$util.getCurrentDate()
      let year = currentDate.getFullYear() + 1;
      let month = currentDate.getMonth() + 1;
      let date = currentDate.getDate();
      return `지금으로부터 1년 뒤인 ${year}-${month}-${date} 까지 1년권이 부여되며, 이미 1년권을 가진 회원의 경우 중복 발급되지 않습니다.`
    },
    getIpCount() {
      if (!this.activeUser) return 0;
      return this.activeUser.registeredIP.length
    },
    rules() {
      return {
        ip: value => /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value) || '유효하지 않은 IP 주소입니다.',
        email: value => {
          const replaceV = value.replace(/(\s*)/g, '')
          const pattern = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/
          return pattern.test(replaceV) || '이메일 형식으로 입력해주세요'
        }
      }
    }
  },
  methods: {
    onClickSearchBtn() {
      this.search = this.searchInputText
      this.noDataText = !!this.search ? '검색결과 없음' : ''
    },

    async showEnterpriseUserDetail(item) {
      await this.$store.dispatch('user/readEnterpriseUserByIndex', item.idx).then(
        res => {
          this.activeUser = {
            ...item,
            businessRegistrationFile: res['enterprise']['businessLicense'],
            point: res['enterprise']['leftReport'],
            pass_expiration_at: res['enterprisePass']['expired'] ? '-' : res['enterprisePass']['expiredAt'].split('T')[0],
            registeredIP: !res['enterpriseUsers'] ? [] : res['enterpriseUsers'].map((obj, idx) => ({...obj, no: idx+1, isDeleteDialogOpen: false, isLoading: false})),
          }
          this.activeUserPoint = this.activeUser.point
          this.$vuetify.goTo("#scrollTarget", this.scrollOptions)
        },
        err => {
          this.$notifier.showMessage({
            content: err,
            color: 'error'
          })
          this.activeUser = null;
        }
      )
    },

    deleteEnterpriseUser({idx}) {
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

    deleteIP (item) {
      this.$router.go(0);
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
      await this.$store.dispatch('patent/updateEnterpriseUserPoint', payload).then(
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

    async giveYearPass() {
      this.updateYearPassLoading = true;
      let payload = {
        id: this.activeUser.idx
      }
      console.log(this.activeUser.idx)
      await this.$store.dispatch('patent/updateEnterpriseUserYearPass', payload).then(
        res => {
          alert("1년권이 부여되었습니다.")
          this.activeUser.point = this.activeUserPoint
          this.updateYearPassLoading = false;
          this.updateYearPassDialogOpen = false;
          this.$router.go(0);
        },
        err => {
          this.$notifier.showMessage({
            content: err,
            color: 'error'
          })
          this.updateYearPassLoading = false;
        }
      )
    },

    addIpAddress() {
      let v = this.$refs.addNewIpRefs.validate();
      if (!v) return;
      let payload = {
        email: this.newEmail,
        ip: this.newIpAddress
      }
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
    },

    async approveSignup() {
      this.approveSignUpLoading = true;
      await this.$store.dispatch('user/approveEnterprise', this.activeUser.idx).then(
        res => {
          this.approveSignUpLoading = false;
          alert("승인 완료")
          this.$router.go(0);
        },
        err => {
          this.$notifier.showMessage({
            content: err,
            color: 'error'
          })
          this.approveSignUpLoading = false;
        }
      )
    },

    customFilter(value, search, filter) {
      if (!search || !value) return value;
      if (filter.companyName.includes(search) || filter.businessNumber.includes(search) || filter.managerInfo.email.includes(search) || filter.managerInfo.fullName.includes(search)) {
        return value;
      }
      return null
    },

    // TODO: 나중에 이기춘 api 요청하기
    downloadBusinessRegistrationFile() {
      let payload = {
        id: this.activeUser.idx
      }
      this.$store.dispatch('patent/downloadBusinessFile', payload).then(
        res => {
          let blob = new Blob([res], {type: "application/pdf"});
          let objectUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = objectUrl;
          link.setAttribute('download', 'business_registration_file.pdf');
          document.body.appendChild(link);
          link.click();
        },
        err => {
          this.$notifier.showMessage({
            content: err,
            color: 'error'
          })
        }
      )
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
