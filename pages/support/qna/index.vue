<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="inquiryTitle">
          <template v-slot:default>
            <v-data-table
              class="full-size row-pointer"
              :headers="inquiryHeader"
              :items="inquiryList"
              :mobile-breakpoint="960"
              :loading="showDetailLoading"
            >
              <template v-slot:top>
                <v-checkbox
                  v-model="showNotAnswered"
                  label="답변하지 않은 목록보기"
                ></v-checkbox>
              </template>
              <template v-slot:item.title="{item}">
                <td class="text-start ellipsis" style="max-width: 280px; font-size: 13px;">
                  <div class="ellipsis font-weight-medium">
                    {{ item.title }}
                  </div>
                </td>
              </template>
              <template v-slot:item.isAnswered="{item}">
                <v-chip
                  :color="getColor(item.isAnswered)"
                  dark
                >
                  {{!item.isAnswered ? '답변대기' : '답변완료'}}
                </v-chip>
              </template>
              <template v-slot:item.action="{item}">
                <v-btn
                  text
                  class="font-weight-bold elevation-0 pa-0 no-background-hover"
                  :ripple="false"
                  @click="showDetail(item)"
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
                    @ok="deleteQna(item)"
                    :title="deleteDialogTitle"
                    :comment="deleteDialogContent"
                  />
                </v-dialog>
              </template>
            </v-data-table>
          </template>
        </dashboard-card>
      </v-col>
      <v-col cols="12" class="my-2" id="scrollInquiryTarget">
        <dashboard-card :title="inquiryTitle" v-if="!!activeItem" :is-loading="submitLoading || deleteLoading">
          <template v-slot:default>
            <v-row align="start" justify="space-around" class="full-width py-10 px-8">

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">작성자</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeItem.author }}</p>
              </v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">날짜</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeItem.created_at }}</p>
              </v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">제목</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeItem.title }}</p>
              </v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">내용</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeItem.content }}</p>
              </v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0" v-if="activeItem.isAnswered">
                <p class="user-detail-header-font">답변 날짜</p>
              </v-col>
              <v-col cols="12" sm="9" v-if="activeItem.isAnswered">
                <p class="user-detail-content-font">{{ activeItem.answer.created_at }}</p>
              </v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">답변</p>
              </v-col>
              <v-col cols="12" sm="9">
                <v-textarea
                  v-if="!activeItem.isAnswered"
                  v-model="tempAnswer"
                  ref="answer"
                  label="답변"
                  rows="8"
                  outlined
                  no-resize
                  auto-grow
                  counter
                  clearable
                />
                <p class="user-detail-content-font" v-else>{{activeItem.answer.data}}</p>
              </v-col>
              <v-col cols="12" v-if="!activeItem.isAnswered">
                <div class="full-width flex-end">
                  <v-btn
                    dark
                    large
                    @click="submit"
                    class="mr-4 font-weight-bold elevation-0"
                    :color="baseColor"
                    :loading="submitLoading"
                  >
                    답변하기
                  </v-btn>
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
import {mapState} from "vuex";
import DashboardCard from "../../../components/Cards/DashboardCard";
import ConfirmationDialog from "~/components/Dialog/ConfirmationDialog";

export default {
  name: "qna",
  components: {DashboardCard, ConfirmationDialog},
  asyncData({store}) {
    return store.dispatch('enquire/readAll').then(
      res => {
        let result = []
        for (let i = 0; i < res.length; i++) {
          let item = res[i]

          let created_at = item.updatedAt.split('T')[0]

          let answer = {
            data: '',
            created_at: ''
          }
          if (!!item.answered) {
            answer = {
              data: item.answer,
              created_at: item.answeredAt.split('T')[0],
            }
          }

          result.push({
            index: i+1,
            idx: item.id,
            userId: item.userId,
            title: item.title,
            content: item.content,
            created_at: created_at,
            answer: answer,
            isAnswered: item.answered,
            isDeleteDialogOpen: false,
          })
        }
        return {
          inquiryItems: result,
          fetchError: null
        }
      },
      err => {
        return {
          inquiryItems: [],
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
    inquiryTitle: '고객문의목록',
    inquiryHeader: [
      {
        text: 'No',
        sortable: false,
        width: '8%',
        align: 'center',
        value: 'index'
      },
      {
        text: '제목',
        sortable: false,
        value: 'title'
      },
      {
        text: '날짜',
        sortable: false,
        align: 'center',
        width: '15%',
        value: 'created_at'
      },
      {
        text: '상태',
        sortable: false,
        align: 'center',
        width: '12%',
        value: 'isAnswered'
      },
      {
        text: '답변하기',
        align: 'center',
        sortable: false,
        filterable: false,
        value: 'action',
        width: '12%'
      },
      {
        text: '삭제하기',
        align: 'center',
        sortable: false,
        filterable: false,
        value: 'delete',
        width: '12%'
      },
    ],
    activeItem: null,

    scrollOptions: {
      duration: 800,
      offset: -80,
      easing: 'easeInOutCubic'
    },

    showDetailLoading: false,
    submitLoading: false,
    deleteLoading: false,

    tempAnswer: '',

    deleteDialogTitle: '고객문의 삭제',
    deleteDialogContent: '정말 삭제하시겠습니까?',

    showNotAnswered: false
  }),
  computed: {
    ...mapState({
      baseColor: 'baseColor'
    }),
    inquiryList() {
      if (!this.inquiryItems) return []
      return !this.showNotAnswered ? this.inquiryItems : this.inquiryItems.filter(item => !item.isAnswered)
    }
  },
  methods: {
    getColor(isAnswered) {
      return isAnswered ? 'green' : 'red'
    },
    async showDetail(item) {
      this.showDetailLoading = true
      this.tempAnswer = ''
      await this.$store.dispatch("user/getUserByIdx", item.userId).then(
        res => {
          this.activeItem = {
            ...item,
            author: res.email
          }
          this.showDetailLoading = false
          this.$vuetify.goTo("#scrollInquiryTarget", this.scrollOptions)
        },
        err => {
          this.$errorHandler.showMessage(err)
          this.showDetailLoading = false
        }
      )
    },
    async submit() {
      if (!this.tempAnswer) {
        this.$notifier.showMessage({
          content: "값을 입력해주세요",
          color: 'error'
        })
        return
      }
      this.submitLoading = true;
      let params = {
        id: this.activeItem.idx,
        answer: this.tempAnswer,
      }
      await this.$store.dispatch('enquire/answer', params)
        .then(
          res => {
            alert(`고객문의 답변 완료`)
            this.submitLoading = false;
            this.activeItem = null;
            this.$router.go(0)
          },
          err => {
            this.$errorHandler.showMessage(err)
            this.submitLoading = false;
          }
        )
    },
    async deleteQna(item) {
      this.deleteLoading = true;
      await this.$store.dispatch('enquire/delete', item.idx)
        .then(
          res => {
            alert(`고객문의 삭제 완료`)
            this.deleteLoading = false;
            this.$router.go(0)
          },
          err => {
            this.$errorHandler.showMessage(err)
            this.deleteLoading = false;
            this.isDeleteDialogOpen = false;
          }
        )
    }
  },
}
</script>

<style scoped>

</style>
