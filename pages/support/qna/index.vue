<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="inquiryTitle">
          <template v-slot:default>
            <v-data-table
              class="full-size row-pointer"
              :headers="inquiryHeader"
              :items="inquiryDataWithIndex"
              :mobile-breakpoint="960"
              hide-default-footer
              :items-per-page="itemsPerPage"
              :loading="initLoading"
            >
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
                  :disabled="item.isAnswered"
                  @click="showDetail(item)"
                >
                  답변하기 >
                </v-btn>
              </template>
            </v-data-table>
          </template>
        </dashboard-card>
      </v-col>
      <v-col cols="12" class="my-2" id="scrollInquiryTarget">
        <dashboard-card :title="inquiryTitle" v-if="!!activeItem">
          <template v-slot:default>
            <v-row align="start" justify="space-around" class="full-width py-10 px-8">

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">문의유형</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeItem.type }}</p>
              </v-col>

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

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">답변</p>
              </v-col>
              <v-col cols="12" sm="9">
                <v-textarea
                  v-model="activeItem.answer"
                  ref="answer"
                  label="답변"
                  rows="8"
                  outlined
                  no-resize
                  auto-grow
                  counter
                  clearable
                  :disabled="activeItem.isAnswered"
                />
              </v-col>

              <v-col cols="12">
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

export default {
  name: "qna",
  components: {DashboardCard},
  data: () => ({
    inquiryTitle: '고객문의목록',
    inquiryItems: [],
    itemsPerPage: 6,
    inquiryHeader: [
      {
        text: 'No',
        sortable: false,
        width: '8%',
        align: 'center',
        value: 'index'
      },
      {
        text: '문의유형',
        sortable: false,
        width: '150px',
        align: 'center',
        value: 'type'
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
    ],
    initLoading: true,
    submitLoading: false,

    activeItem: null,
    scrollOptions: {
      duration: 800,
      offset: -80,
      easing: 'easeInOutCubic'
    },
  }),
  computed: {
    ...mapState({
      baseColor: 'baseColor'
    }),
    inquiryDataWithIndex() {
      let result = [];
      for (let i = 0; i < this.inquiryItems.length; i++){
        let temp = this.inquiryItems[i];
        result.push({
          ...temp,
          index: i+1,
          isAnswered: !!temp.answer
        })
      }
      return result;
    },
  },
  methods: {
    getColor(isAnswered) {
      return isAnswered ? 'green' : 'red'
    },
    async fetchData() {
      setTimeout(() => {
        // TODO: 서버 호출
        this.inquiryItems = [
          {
            "type": "사용방법 문의",
            "title": "포인트 신청은 어떻게 하나요?",
            "content": "포인트 신청하고 싶은데 상단 바에도 들어가는 경로가 없네요. url을 첨부해주셔도 좋으니까 경로 접근 방법 부탁드려요.",
            "created_at": "2022-03-04 13:14",
            "author": "choi",
            "answer": {
              "data": "안녕하세요. blah blah",
              "created_at": "2022-03-06 15:32"
            }
          },
          {
            "type": "사용방법 문의",
            "title": "포인트 신청은 어떻게 하나요?",
            "content": "포인트 신청하고 싶은데 상단 바에도 들어가는 경로가 없네요. url을 첨부해주셔도 좋으니까 경로 접근 방법 부탁드려요.",
            "created_at": "2022-03-04 13:14",
            "author": "choi",
            "answer": {
              "data": "안녕하세요. blah blah",
              "created_at": "2022-03-06 15:32"
            }
          },
          {
            "type": "사용방법 문의",
            "title": "포인트 신청은 어떻게 하나요?",
            "content": "포인트 신청하고 싶은데 상단 바에도 들어가는 경로가 없네요. url을 첨부해주셔도 좋으니까 경로 접근 방법 부탁드려요.",
            "created_at": "2022-03-04 13:14",
            "author": "choi",
            "answer": {
              "data": "안녕하세요. blah blah",
              "created_at": "2022-03-06 15:32"
            }
          },
          {
            "type": "사용방법 문의",
            "title": "포인트 신청은 어떻게 하나요?포인트 신청은 어떻게 하나요?포인트 신청은 어떻게 하나요?포인트 신청은 어떻게 하나요?포인트 신청은 어떻게 하나요?포인트 신청은 어떻게 하나요?포인트 신청은 어떻게 하나요?",
            "content": "포인트 신청하고 싶은데 상단 바에도 들어가는 경로가 없네요. url을 첨부해주셔도 좋으니까 경로 접근 방법 부탁드려요.",
            "created_at": "2022-03-04 13:14",
            "author": "choi",
            "answer": null
          },
          {
            "type": "사용방법 문의",
            "title": "포인트 신청은 어떻게 하나요?",
            "content": "포인트 신청하고 싶은데 상단 바에도 들어가는 경로가 없네요. url을 첨부해주셔도 좋으니까 경로 접근 방법 부탁드려요.",
            "created_at": "2022-03-04 13:14",
            "author": "choi",
            "answer": null
          },
          {
            "type": "사용방법 문의",
            "title": "포인트 신청은 어떻게 하나요?",
            "content": "포인트 신청하고 싶은데 상단 바에도 들어가는 경로가 없네요. url을 첨부해주셔도 좋으니까 경로 접근 방법 부탁드려요.",
            "created_at": "2022-03-04 13:14",
            "author": "choi",
            "answer": {
              "data": "안녕하세요. blah blah",
              "created_at": "2022-03-06 15:32"
            }
          },
          {
            "type": "사용방법 문의",
            "title": "포인트 신청은 어떻게 하나요?",
            "content": "포인트 신청하고 싶은데 상단 바에도 들어가는 경로가 없네요. url을 첨부해주셔도 좋으니까 경로 접근 방법 부탁드려요.",
            "created_at": "2022-03-04 13:14",
            "author": "choi",
            "answer": {
              "data": "안녕하세요. blah blah",
              "created_at": "2022-03-06 15:32"
            }
          },
          {
            "type": "사용방법 문의",
            "title": "포인트 신청은 어떻게 하나요?",
            "content": "포인트 신청하고 싶은데 상단 바에도 들어가는 경로가 없네요. url을 첨부해주셔도 좋으니까 경로 접근 방법 부탁드려요.",
            "created_at": "2022-03-04 13:14",
            "author": "choi",
            "answer": null
          },
        ];
        this.initLoading = false;
      }, 1000)
    },
    showDetail(item) {
      this.activeItem = item;
      this.$vuetify.goTo("#scrollInquiryTarget", this.scrollOptions)
    },
    submit() {
      // TODO: 답변 제출
      this.submitLoading = true;
      setTimeout(() => {
        alert(`답변 완료 To: ${this.activeItem.author}`)
        this.activeItem = null
        this.submitLoading = false;
        this.$router.go(0)
      }, 2000)
    }
  },
  mounted() {
    this.fetchData()
  },
}
</script>

<style scoped>

</style>
