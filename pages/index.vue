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
              :loading="loadingInquiryItems"
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
        <dashboard-card :title="salesTitle" :link="salesLink" :is-loading="loadingSalesItems">
          <template v-slot:default>
            <line-chart ref="salesChartRef"/>
          </template>
        </dashboard-card>
      </v-col>
      <v-col cols="12" md="6" class="my-2 pl-md-5">
        <dashboard-card :title="userTitle" :link="userLink" :is-loading="loadingUserCountItems">
          <template v-slot:default>
            <line-chart ref="userCountChartRef"/>
          </template>
        </dashboard-card>
      </v-col>
      <v-col cols="12" md="5" class="my-2 pr-md-5">
        <dashboard-card :title="dataTitle" :link="dataLink" :is-loading="loadingDataUpdateItems">
          <template v-slot:default>
            <v-timeline
              dense
              align-top
              class="full-size"
            >
              <v-timeline-item
                v-for="(n, i) in dataUpdateItems"
                :key="i"
                class="mb-4"
                :color="baseColor"
                icon-color="grey lighten-2"
                small
              >
                <v-row align="center" justify="start">
                  <v-col cols="7">
                    <p class="subtitle-2 mb-0">{{n.updated_at}}</p>
                  </v-col>
                  <v-col
                    cols="5"
                  >
                    <p class="caption mb-0">{{n.data}}</p>
                  </v-col>
                </v-row>
              </v-timeline-item>
            </v-timeline>
          </template>
        </dashboard-card>
      </v-col>
      <v-col cols="12" md="7" class="my-2 pl-md-5">
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
              :loading="loadingNewsItems"
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
  async asyncData({$axios}) {
    //let getNewsItems = store.dispatch('news/readAll')
    //let getEnquireItems = store.dispatch('enquire/readAll')
    let getNewsItems = $axios.$get('/notice')
    let getEnquireItems = $axios.$get('/enquire')
    try {
      let results = await Promise.all([getNewsItems, getEnquireItems])
      let tempNewsItems = results[0]['notices']
      let tempInquiryItems = results[1]['enquires']

      let newsItems = []
      for (let i = 0; i < tempNewsItems.length; i++) {
        let item = tempNewsItems[i]
        let time = item.updatedAt.split('T')[0]
        newsItems.push({
          no: i+1,
          idx: item.id,
          title: item.title,
          content: item.content,
          created_at: time,
          view_count: item.view
        })
      }
      let inquiryItems = [];
      for (let i = 0; i < tempInquiryItems.length; i++) {
        let item = tempInquiryItems[i]
        if (!!item['answered']) continue;
        let userInfo = await Promise.all([$axios.$get('/user/' + item['userId'])])
        inquiryItems.push({
          no: i+1,
          title: item['title'],
          author: userInfo[0]['user']['email'],
          created_at: item.updatedAt.split('T')[0],
          isAnswered: item['answered']
        })
      }

      return {
        newsItems: newsItems,
        inquiryItems: inquiryItems,
        fetchError: null
      }
    }
    catch (e) {
      return {
        inquiryItems: [],
        newsItems: [],
        fetchError: e
      }
    }
  },
  data: () => ({
    inquiryTitle: '고객문의목록',
    salesTitle: '총 매출액 추이',
    userTitle: '총 회원수',
    dataTitle: '데이터 업데이트',
    newsTitle: '공지사항',


    inquiryLink: '/support/qna',
    salesLink: '/payment',
    userLink: '/membership/private',
    dataLink: '/data',
    newsLink: '/support/news',

    salesItems: [],
    userCountItems: [],
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

    loadingInquiryItems: true,
    loadingDataUpdateItems: true,
    loadingNewsItems: true,
    loadingSalesItems: true,
    loadingUserCountItems: true,
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
    async fetchData() {
      setTimeout(() => {
        // TODO: 서버 호출
        this.salesItems = [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120];
        this.userCountItems = [10, 80, 165, 230, 380, 405, 590, 630, 700, 815, 960, 1030];
        this.dataUpdateItems = [
          {
            'updated_at': '2022-03-22 18:07:02',
            'data': 'A type. lorem ipsum'
          },
          {
            'updated_at': '2022-03-22 18:07:02',
            'data': 'A type. lorem ipsum'
          },
          {
            'updated_at': '2022-03-22 18:07:02',
            'data': 'A type. lorem ipsum'
          },
          {
            'updated_at': '2022-03-22 18:07:02',
            'data': 'A type. lorem ipsum'
          },
          {
            'updated_at': '2022-03-22 18:07:02',
            'data': 'A type. lorem ipsum'
          },
          {
            'updated_at': '2022-03-22 18:07:02',
            'data': 'A type. lorem ipsum'
          },
          {
            'updated_at': '2022-03-22 18:07:02',
            'data': 'A type. lorem ipsum'
          },
        ];

        this.$refs.salesChartRef.initBigChart(this.salesItems);
        this.$refs.userCountChartRef.initBigChart(this.userCountItems);

        this.loadingInquiryItems = false;
        this.loadingSalesItems = false;
        this.loadingUserCountItems = false;
        this.loadingDataUpdateItems = false;
        this.loadingNewsItems = false;
      }, 1000)
    }
  },
  mounted() {
    this.fetchData()
  },
}
</script>

<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
