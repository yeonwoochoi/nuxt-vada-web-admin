<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="faqCardTitle">
          <template v-slot:default>
            <v-data-table
              class="full-width"
              :headers="faqHeaders"
              :items="faqItems"
              :items-per-page="itemsPerPage"
              hide-default-footer
              :mobile-breakpoint="600"
              :loading="initLoading"
            >
              <template v-slot:top>
                <v-row align="center" justify="space-between" class="px-4 my-1">
                  <v-col cols="12" sm="3">
                    <v-btn
                      dark
                      class="elevation-0 mt-md-2 mb-0"
                      :color="baseColor"
                      @click="createFAQ"
                    >
                      추가
                    </v-btn>
                  </v-col>
                </v-row>
              </template>
              <template v-slot:item.data="{item}">
                <td class="text-start ellipsis" style="max-width: 280px; font-size: 13px;">
                  <div class="ellipsis font-weight-medium">
                    {{ item.data.title }}
                  </div>
                </td>
              </template>
              <template v-slot:item.detail="{item}">
                <v-btn
                  class="font-weight-bold elevation-0 pa-0 no-background-hover"
                  :ripple="false"
                  @click="showDetail(item)"
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
                    @ok="deleteFAQ(item)"
                    :title="deleteDialogTitle"
                    :comment="deleteDialogContent"
                  />
                </v-dialog>
              </template>
            </v-data-table>
          </template>
        </dashboard-card>
      </v-col>
      <v-col cols="12" class="my-2" id="scrollFaqTarget">
        <dashboard-card :title="'상세보기'" v-if="!!activeItem" :is-loading="updateLoading">
          <template v-slot:default>
            <v-row align="start" justify="space-around" class="full-width py-10 px-8">

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">질문</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeItem.data.title }}</p>
              </v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">답변</p>
              </v-col>
              <v-col cols="12" sm="9">
                <pre class="user-detail-content-font pre-no-overflow" v-html="activeItem.data.answer"/>
              </v-col>

              <v-col cols="12">
                <div class="full-width flex-end">
                  <v-dialog
                    v-model="isUpdateDialogOpen"
                    max-width="1000"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        dark
                        large
                        v-bind="attrs"
                        v-on="on"
                        class="mr-4 font-weight-bold elevation-0"
                        :color="baseColor"
                      >
                        수정하기
                      </v-btn>
                    </template>
                    <confirmation-dialog
                      @cancel="isUpdateDialogOpen = false"
                      @ok="updateFaq"
                      :title="updateDialogTitle"
                    >
                      <template v-slot:default>
                        <v-textarea
                          v-model="updateFetchData.title"
                          label="질문"
                          rows="2"
                          outlined
                          no-resize
                          clearable
                        />
                        <v-textarea
                          v-model="updateFetchData.answer"
                          label="답변"
                          rows="8"
                          outlined
                          no-resize
                          auto-grow
                          counter
                          clearable
                        />
                      </template>
                    </confirmation-dialog>
                  </v-dialog>
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
import DashboardCard from "../../../components/Cards/DashboardCard";
import ConfirmationDialog from "../../../components/Dialog/ConfirmationDialog";
import {mapState} from "vuex";
export default {
  name: "faq",
  components: {ConfirmationDialog, DashboardCard},
  data: () => ({
    faqCardTitle: 'FAQ',

    initLoading: true,
    updateLoading: false,

    faqHeaders: [
      {
        text: 'No',
        sortable: false,
        width: '8%',
        align: 'center',
        value: 'no'
      },
      {
        text: '질문',
        sortable: false,
        value: 'data'
      },
      {
        text: '상세보기',
        align: 'center',
        sortable: false,
        filterable: false,
        value: 'detail',
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
    faqItems: [],
    activeItem: null,

    deleteDialogTitle: 'FAQ 삭제',
    deleteDialogContent: '정말 삭제하시겠습니까?',

    isDeleteDialogOpen: false,
    isUpdateDialogOpen: false,

    scrollOptions: {
      duration: 800,
      offset: -80,
      easing: 'easeInOutCubic'
    },
    updateDialogTitle: 'FAQ 수정',

  }),

  computed: {
    ...mapState({
      baseColor: "baseColor"
    }),
    itemsPerPage() {
      return this.faqItems.length;
    },
    updateFetchData() {
      return {
        title: this.activeItem.data.title,
        answer: this.activeItem.data.answer
      }
    }
  },
  methods: {
    async fetchData() {
      setTimeout(() => {
        // TODO: 서버 호출
        let sampleData = [
          {
            no: 1,
            data: {
              title: '포인트 신청은 어떻게 하나요?',
              answer: '대출신청은 매일(주말,공휴일포함)오전 6시부터 밤11시까지 가능하며\n' +
                '최근 이사시즌으로 신청량 급증되어 하루 접수량 제어되고 있습니다.\n' +
                '오전 6시부터 많은 고객님들께서 동시진행시 빠른시간대로 마감되는 경우가 있습니다.\n' +
                '\n' +
                '당행은 대면창구가 없는 비대면은행이기 때문에 대출신청접수는 앱에서만 가능하며\n' +
                '유선상으로도 직원이 별도 접수해드리거나 마감시간과 마감예측시간 확인이 불가합니다.\n' +
                '대출 이용에 불편을 드려 죄송합니다.\n' +
                '\n' +
                '서류 잔금일 기준 1개월전부터 최소 15일전까지가 대출 신청가능기간이며\n' +
                '잔금일 여유가 있으시다면  재시도 해주셔서 신청가능여부를  앱을 통해 \n' +
                '다시 확인해보시길 바랍니다.\n' +
                '\n' +
                '\n' +
                '\n' +
                '마지막으로 당부 말씀 드립니다.\n' +
                '\n' +
                '\n' +
                '전월세보증금 대출 신청전, 꼭 알아두셔야 할 내용을 안내드립니다.\n' +
                '\n' +
                '\n' +
                '■ 모바일앱 로그인 >  상품/서비스(田) > 전월세보증금 대출 상품안내 페이지의 [신청조건] 및 전세자금실행 후 [주기적 실거주/ 고가주택, 다주택 및 3억초과 투기지역   아파트 소유여부확인 절차] 등 상세 내용 반드시 확인 부탁드립니다. \n' +
                '    https://kakaobank.onelink.me/0qMi/eccf7218\n' +
                '\n' +
                '\n' +
                '■ 전월세보증금대출의 예상 한도는 서류 제출 전의 결과이며 서류 제출 및  서류확인 후 최종 대출 가능여부, 한도 및 금리가 결정됩니다. \n' +
                '   서류확인 결과에 따라 부결 되실 수도 있으며, 추가서류 및 보완사항이 발생할 수 있는 점도 참고 부탁드립니다.\n' +
                '\n' +
                '\n' +
                '■ 대출 신청기한은 서류상 잔금일로부터 최소 15일전까지만 가능합니다. \n' +
                '  ( 1일 접수량 제어시 서류접수가 어려울 수 있으며, 이로 인해 잔금일수 부족 할 경우 진행 불가합니다.)\n' +
                '\n' +
                '\n' +
                '■ 임차보증금은 최소 1천만원 이상 부터 입니다.       \n' +
                '\n' +
                '\n' +
                '■ 서류확인 및 보증 결과에 따라 임대인을 만나 계약사실 확인을 할 수도 있습니다. (오피스텔은 필수)\n' +
                '\n' +
                '\n' +
                '■ 당행 전월세보증금 대출은 추가대출및 대환이 불가합니다.\n' +
                '\n' +
                '\n' +
                '\n' +
                '\n' +
                '추가 문의사항이 있으신 경우, 카카오뱅크 고객센터 1599-3333 > 0 > 2 > 2  으로 문의 주시거나 카카오뱅크 어플 내 1:1문의 주시면 성실하게 답변 드리겠습니다. \n',
            }
          },
          {
            no: 2,
            data: {
              title: '기업 회원 가입은 어떻게 하나요?',
              answer: '일반 회원 가입 절차를 통해 할 수 있습니다. 다만 바로 아이디가 부여되는 것이 아니라 승인 절차를 통해 IP 주소 당 아이디와 비밀번호를 할당해주는 방식을 진행하고 있습니다.',
            }
          },
          {
            no: 3,
            data: {
              title: '출원 중인 특허도 평가가 가능한가요?',
              answer: '등록일로부터 2~3개월 후 평가가 가능합니다.',
            }
          },
          {
            no: 4,
            data: {
              title: '등록된 특허인데 평가결과가 조회되지 않는 경우가 있나요?',
              answer: '등록일이 2~3개월 밖에 되지 않는 경우엔 평가결과가 조회되지 않습니다. 그 외의 경우엔 누락된 특허의 출원/등록번호와 함께 문의해주시길 부탁드리겠습니다.',
            }
          },
        ];
        let result = [];
        for (let i = 0; i < sampleData.length; i++) {
          result.push({
            ...sampleData[i],
            isDeleteDialogOpen: false
          })
        };
        this.faqItems = result;
        this.initLoading = false;
      }, 1000)
    },
    deleteFAQ(item) {
      // TODO: FAQ 삭제
      this.$router.go(0);
    },
    createFAQ() {
      // TODO: FAQ create
      alert("Create FAQ!")
    },
    showDetail(item) {
      this.activeItem = item;
      this.$vuetify.goTo("#scrollFaqTarget", this.scrollOptions)
    },

    updateFaq() {
      // TODO: 답변 제출
      this.updateLoading = true;
      setTimeout(() => {
        alert(`업데이트 완료`)
        this.activeItem = null
        this.updateLoading = false;
        this.$router.go(0)
      }, 2000)
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>

</style>
