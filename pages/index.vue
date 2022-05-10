<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="inquiryTitle" :link="inquiryLink">
          <template v-slot:default>
            <v-data-table
              class="full-size row-pointer"
              :headers="inquiryHeader"
              :items="inquiryItems"
              :mobile-breakpoint="960"
              hide-default-footer
              :items-per-page="inquiryShowCount"
              @click:row="moveInquiryDetail"
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
            </v-data-table>
          </template>
        </dashboard-card>
      </v-col>
      <v-col cols="12" md="6" class="my-2 pr-md-5">
        <dashboard-card :title="salesTitle" :link="salesLink">
          <template v-slot:default>
            <line-chart ref="salesChartRef"/>
          </template>
        </dashboard-card>
      </v-col>
      <v-col cols="12" md="6" class="my-2 pl-md-5">
        <dashboard-card :title="userTitle" :link="userLink">
          <template v-slot:default>
            <line-chart ref="userCountChartRef"/>
          </template>
        </dashboard-card>
      </v-col>
      <v-col cols="12" class="my-2 pl-md-5">
        <dashboard-card :title="newsTitle" :link="newsLink">
          <template v-slot:default>
            <v-data-table
              v-if="$vuetify.breakpoint.mdAndUp"
              class="full-size row-pointer"
              :headers="newsHeader"
              :items="newsItems"
              :mobile-breakpoint="0"
              hide-default-footer
              :items-per-page="newsItemShowCount"
              @click:row="moveNewsDetail"
            >
              <template v-slot:item.title="{item}">
                <td class="text-start ellipsis" style="max-width: 130px; font-size: 13px;">
                  <div class="ellipsis font-weight-medium">
                    {{ item.title }}
                  </div>
                </td>
              </template>
            </v-data-table>
            <v-data-table
              v-else
              class="full-size row-pointer"
              :headers="newsHeader"
              :items="newsItems"
              :mobile-breakpoint="960"
              hide-default-footer
              :items-per-page="newsItemShowCount"
            >
              <template v-slot:item="{item}">
                <tr style="background-color: transparent" @click="moveNewsDetail(item)">
                  <div class="pa-4">
                    <p class="font-weight-bold subtitle-1 full-width">
                      {{ item['title'] }}
                    </p>
                    <div style="display: flex; height: fit-content; overflow-x: hidden; text-overflow: ellipsis" class="content-grey-font caption">
                      <p class="my-0 mr-2 ellipsis" style="white-space: nowrap; max-width: 130px;">{{ item['author'] }}</p>
                      <p class="my-0 mr-2"><v-divider vertical/></p>
                      <p class="my-0 mr-2" style="white-space: nowrap">{{ item['created_at'] }}</p>
                      <p class="my-0 mr-2"><v-divider vertical/></p>
                      <p class="my-0 mr-2" style="white-space: nowrap">{{ item['view_count'] }}</p>
                    </div>
                  </div>
                  <v-divider/>
                </tr>
              </template>
            </v-data-table>
          </template>
        </dashboard-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DashboardCard from "../components/Cards/DashboardCard";
import LineChart from "../components/Charts/LineChart.vue";
import {mapState} from "vuex";
export default {
  name: "index",
  components: {LineChart, DashboardCard},
  async asyncData({$axios, store}) {
    let getNewsItems = $axios.$get('/notice')
    let getEnquireItems = $axios.$get('/enquire')
    let getPaymentLog = $axios.$get('/user/report/purchases')
    let getUsers = $axios.$get('/user')
    try {
      let results = await Promise.all([getNewsItems, getEnquireItems, getUsers, getPaymentLog])
      let tempNewsItems = results[0]['notices']
      let tempInquiryItems = results[1]['enquires']

      let newsItems = []
      for (let i = tempNewsItems.length-1; i >= 0; i--) {
        let item = tempNewsItems[i]
        let time = item.updatedAt.split('T')[0]
        newsItems.push({
          no: tempNewsItems.length - i,
          idx: item.id,
          title: item.title,
          content: item.content,
          created_at: time,
          view_count: item.view
        })
      }
      let inquiryItems = [];
      for (let i = tempInquiryItems.length-1; i >= 0; i--) {
        let item = tempInquiryItems[i]
        if (!!item['answered']) continue;
        let userInfo = await Promise.all([$axios.$get('/user/' + item['userId'])])
        inquiryItems.push({
          no: tempInquiryItems.length - i,
          title: item['title'],
          author: userInfo[0]['user']['email'],
          created_at: item.updatedAt.split('T')[0],
          isAnswered: item['answered']
        })
      }

      let currentYear = parseInt(new Date().getFullYear());

      let userCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let personalUser = results[2]['users']
      for (let i = 0; i < personalUser.length; i++) {
        if (personalUser[i]['roles'].includes('ROLE_ADMIN')) continue
        let temp = personalUser[i]['createdAt'].split("T")[0].split("-")
        if (currentYear === parseInt(temp[0])) {
          userCount[parseInt(temp[1])-1]++
        }
      }

      let salesData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      let paymentLog = results[3]['paymentLogs']
      for (let i = 0; i < paymentLog.length; i++) {
        let purchasedAt = paymentLog[i]['purchasedAt'].split('T')[0].split("-")
        if (currentYear === parseInt(purchasedAt[0])) {
          salesData[parseInt(purchasedAt[1])-1] += parseInt(paymentLog[i]['price'])
        }
      }

      return {
        newsItems: newsItems,
        inquiryItems: inquiryItems,
        userCountItems: userCount,
        salesItems: salesData,
        fetchError: null
      }
    }
    catch (e) {
      return {
        inquiryItems: [],
        newsItems: [],
        userCountItems: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        salesItems: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        fetchError: e
      }
    }
  },
  created() {
    if (!!this.fetchError) {
      this.$errorHandler.showMessage(this.fetchError)
    }
  },
  mounted() {
    this.$refs.salesChartRef.initBigChart(this.salesItems);
    this.$refs.userCountChartRef.initBigChart(this.userCountItems);
  },
  data: () => ({
    inquiryTitle: '고객문의목록',
    salesTitle: '총 매출액 추이',
    userTitle: '총 회원수',
    dataTitle: '데이터 업데이트',
    newsTitle: '공지사항',


    inquiryLink: '/support/qna',
    salesLink: '/payment/log',
    userLink: '/membership/private',
    dataLink: '/data',
    newsLink: '/support/news',

    dataUpdateItems: [],

    inquiryShowCount: 6,
    dataUpdateShowCount: 6,
    newsItemShowCount: 6,

    inquiryHeader: [
      {
        text: 'No',
        sortable: false,
        width: '120px',
        align: 'center',
        value: 'no'
      },
      {
        text: '제목',
        sortable: false,
        value: 'title'
      },
      {
        text: '문의자',
        sortable: false,
        align: 'center',
        width: '300px',
        value: 'author'
      },
      {
        text: '날짜',
        sortable: false,
        align: 'center',
        width: '200px',
        value: 'created_at'
      },
      {
        text: '답변여부',
        sortable: false,
        align: 'center',
        width: '200px',
        value: 'isAnswered'
      },
    ],
    newsHeader: [
      {
        text: 'No',
        align: 'center',
        sortable: false,
        filterable: false,
        value: 'no',
        width: '12%'
      },
      {
        text: 'Title',
        align: 'start',
        sortable: false,
        filterable: false,
        value: 'title',
      },
      {
        text: 'Content',
        align: ' d-none',
        sortable: false,
        filterable: true,
        value: 'content',
      },
      {
        text: 'Date',
        align: 'center',
        sortable: false,
        filterable: false,
        value: 'created_at',
        width: '20%'
      },
      {
        text: 'Views',
        align: 'center',
        sortable: false,
        filterable: false,
        value: 'view_count',
        width: '12%'
      },
    ],
  }),
  computed: {
    ...mapState({
      baseColor: 'baseColor'
    }),
  },
  methods: {
    getColor(isAnswered) {
      return isAnswered ? 'green' : 'red'
    },
    moveInquiryDetail() {
      this.$router.push(this.inquiryLink)
    },
    moveNewsDetail({idx}) {
      this.$router.push(this.newsLink)
    },
    async setUserCount() {
      let currentYear = parseInt(new Date().getFullYear());
      let users = await Promise.all([this.$axios.$get('/user')])
      let result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      let personalUser = users[0]['users']
      for (let i = 0; i < personalUser.length; i++) {
        if (personalUser[i]['roles'].includes('ROLE_ADMIN')) continue
        let temp = personalUser[i]['createdAt'].split("T")[0].split("-")
        if (currentYear === parseInt(temp[0])) {
          result[parseInt(temp[1])-1]++
        }
      }
      this.userCountItems = result
    },
    async setSalesData() {
      let currentYear = parseInt(new Date().getFullYear());
      let paymentLog = await this.$store.dispatch('fee/readAllPayment')
      let result = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      for (let i = 0; i < paymentLog.length; i++) {
        let serviceInfo = await this.$store.dispatch('fee/readPlanByIdx', paymentLog[i]['serviceId'])
        let purchasedAt = paymentLog[i]['purchasedAt'].split('T')[0].split("-")
        if (currentYear === parseInt(purchasedAt[0])) {
          result[parseInt(purchasedAt[1])-1] += parseInt(serviceInfo['price'])
        }
      }
      this.salesItems = result
    },
  },
}
</script>

<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
