<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="header">
          <template v-slot:default>
            <v-row align="center" justify="start" class="pa-12">
              <v-item-group multiple style="width: 100%; height: fit-content" v-model="selected">
                <v-row>
                  <v-col cols="12">
                    <v-btn
                      @click="updateData"
                      class="mr-2 pa-1 font-weight-bold"
                      x-large
                      solo
                      :color="baseColor"
                      :disabled="selected.length <=0"
                      :class="`${selected.length > 0 ? 'white--text': ''}`"
                    >
                      업데이트
                    </v-btn>
                    <v-btn
                      @click="selectedAll"
                      class="mr-2 pa-1 font-weight-bold"
                      x-large
                      solo
                      :color="baseColor"
                      dark
                    >
                      모두선택
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6" md="4" v-for="(data, index) in dataTypes" :key="`data-${index}`">
                    <v-item v-slot="{ active, toggle }">
                      <v-card
                        :color="data.color"
                        class="align-center px-6 pb-2 pt-3"
                        @click="toggle"
                        style="align-items: center; min-height: 230px"
                        dark
                      >
                        <v-card-title
                          class="text-h5 mb-2"
                          v-text="data.title"
                        />
                        <v-divider/>
                        <v-card-subtitle>
                          <p >마지막 업데이트: <span class="font-weight-bold subtitle-1 pl-1">{{data.updated_at}}</span></p>
                          <p class="mb-0">데이터 수: <span class="font-weight-bold subtitle-1 pl-1">{{data.count.toLocaleString()}}</span></p>
                        </v-card-subtitle>
                        <v-overlay :value="active" absolute>
                          <div
                            v-if="active"
                            class="text-h2 flex-grow-1 text-center"
                          >
                            ✓
                          </div>
                        </v-overlay>
                      </v-card>
                    </v-item>
                  </v-col>
                </v-row>
              </v-item-group>
            </v-row>
          </template>
        </dashboard-card>
        <dashboard-card :title="apiHeader" class="mt-12">
          <template v-slot:default>
            <v-row align="center" justify="start" class="pa-12">
              <v-col cols="12" class="mb-6">
                <p class="mb-0 font-weight-bold headline">키프리스 API</p>
              </v-col>
              <v-col cols="2" v-if="$vuetify.breakpoint.smAndUp">
                <v-subheader>KEY</v-subheader>
              </v-col>
              <v-col cols="12" sm="10">
                <p class="mb-0">{{apiKey['kipris']}}</p>
              </v-col>
              <v-col cols="2" v-if="$vuetify.breakpoint.smAndUp">
                <v-subheader>업데이트</v-subheader>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="newKiprisApiKey"
                  label="KIPRIS"
                  outlined
                  :rules="[v=>!!v || '값을 입력해주세요.']"
                  class="pt-8"
                  ref="apiKeyRef"
                />
              </v-col>
              <v-col cols="3" sm="2">
                <v-btn
                  class="mr-2 pa-1 font-weight-bold"
                  @click="updateApiKey"
                  x-large
                  solo
                  :color="baseColor"
                  dark
                >
                  변경
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </dashboard-card>
      </v-col>
    </v-row>
    <v-overlay :value="isUpdating">
      <p class="white--text font-weight-black headline text-center">업데이트 중입니다</p>
      <p class="white--text font-weight-black headline text-center pl-1">잠시만 기다려주세요</p>
      <div class="mt-6" style="display: flex; justify-content: center;">
        <v-progress-circular
          indeterminate
          color="white"
        />
      </div>
    </v-overlay>
  </v-container>
</template>

<script>
import DashboardCard from "../../components/Cards/DashboardCard";
import HorizontalCard from "../../components/Cards/HorizontalCard";
import {mapState} from "vuex";

export default {
  name: "index",
  components: {DashboardCard, HorizontalCard},
  async asyncData({$axios, store}) {
    try {
      let dataInfo = await Promise.all([$axios.$get('/patent/file'), $axios.$get('/kipris/key')])
      let fileLog = dataInfo[0]['patentFileLog']
      let apiKey = dataInfo[1]['apiKey']

      let data = [
        {
          key: 'CASH_FLOW',
          title: '현금 흐름',
          updated_at: fileLog['cashFlow']['updatedAt'].replace('T', ' ').split('.')[0],
          count: fileLog['cashFlow']['count']
        },
        {
          key: 'IPC_TCT',
          title: 'TCT 지수',
          updated_at: fileLog['tct']['updatedAt'].replace('T', ' ').split('.')[0],
          count: fileLog['tct']['count']
        },
        {
          key: 'ROYALTY_RATE',
          title: '로열티율',
          updated_at: fileLog['royaltyRate']['updatedAt'].replace('T', ' ').split('.')[0],
          count: fileLog['royaltyRate']['count']
        },
        {
          key: 'INDUSTRY_ROYALTY_RATE',
          title: '산업별 로열티율',
          updated_at: fileLog['industryRoyaltyRate']['updatedAt'].replace('T', ' ').split('.')[0],
          count: fileLog['industryRoyaltyRate']['count']
        },
        {
          key: 'INDUSTRY_TECH_ELEMENT',
          title: '사업 기술 요소',
          updated_at: fileLog['industryTechElement']['updatedAt'].replace('T', ' ').split('.')[0],
          count: fileLog['industryTechElement']['count']
        },
        {
          key: 'INDUSTRY_PIONEER_AND_PERIOD',
          title: '개척율 및 사업화 기간',
          updated_at: fileLog['industryPioneerAndPeriod']['updatedAt'].replace('T', ' ').split('.')[0],
          count: fileLog['industryPioneerAndPeriod']['count']
        },
        {
          key: 'DISCOUNT_RATE',
          title: '할인율',
          updated_at: fileLog['discountRate']['updatedAt'].replace('T', ' ').split('.')[0],
          count: fileLog['discountRate']['count']
        },
        {
          key: 'INDUSTRY_DISCOUNT_RATE',
          title: '산업별 할인율',
          updated_at: fileLog['industryDiscountRate']['updatedAt'].replace('T', ' ').split('.')[0],
          count: fileLog['industryDiscountRate']['count']
        },
        {
          key: 'RISK_PREMIUM',
          title: '위험 프리미엄',
          updated_at: fileLog['riskPremium']['updatedAt'].replace('T', ' ').split('.')[0],
          count: fileLog['riskPremium']['count']
        },
        {
          key: 'PATENT_PQI_GRADE',
          title: '특허 PQI 지수',
          updated_at: fileLog['patentPQIGrade']['updatedAt'].replace('T', ' ').split('.')[0],
          count: fileLog['patentPQIGrade']['count']
        },
        {
          key: 'ALL_INDUSTRY_SALES',
          title: '전 손익계산서 매출액',
          updated_at: fileLog['allIndustrySales']['updatedAt'].replace('T', ' ').split('.')[0],
          count: fileLog['allIndustrySales']['count']
        },
      ]
      let result = []
      let colorList = store.getters.getColorList
      for (let i = 0; i < data.length; i++) {
        result.push({
          ...data[i],
          progress: 0,
          color: colorList[i]
        })
      }

      return {
        apiKey: {
          kipris: apiKey['key']
        },
        dataTypes: result,
        fetchError: null
      }
    }
    catch (e) {
      return {
        dataTypes: [],
        apiKey: {
          kipris: null
        },
        fetchError: e,
      }
    }
  },
  created() {
    if (!!this.fetchError) {
      this.$errorHandler.showMessage(this.fetchError)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isUpdating) next()
  },
  data: () => ({
    header: '데이터 관리',
    apiHeader: 'API KEY 관리',
    newDataFile: null,
    resetTime: 1000,
    newKiprisApiKey: '',
    selected: [],
    isUpdating: false
  }),
  computed: {
    ...mapState({
      baseColor: "baseColor"
    })
  },
  methods: {
    updateData() {
      if (this.selected.length <= 0) {
        this.$notifier.showMessage({
          content: '선택된 데이터 항목이 없습니다.',
          color: 'error'
        })
        return;
      }
      this.isUpdating = true;
      let result = []
      for (let i = 0; i < this.selected.length; i++) {
        result.push(this.dataTypes[parseInt(this.selected[i])]['key'])
      }
      this.$store.dispatch('data/uploadFile', {types: result}).then(
        res => {
          this.$notifier.showMessage({
            content: '데이터 업데이트 완료',
            color: 'success'
          })
          this.fetchData(res)
          this.selected = []
          this.isUpdating = false
        },
        err => {
          this.$errorHandler.showMessage(err)
          this.isUpdating = false
        }
      )
    },
    selectedAll() {
      let result = []
      if (this.selected.length > 0) {
        this.selected = []
        return
      }
      for (let i = 0; i < this.dataTypes.length; i++) {
        result.push(i)
      }
      this.selected = result
    },
    getPatentFileLog(key) {
      switch (key) {
        case 'CASH_FLOW':
          return 'cashFlow'
        case 'IPC_TCT':
          return 'tct'
        case 'ROYALTY_RATE':
          return 'royaltyRate'
        case 'INDUSTRY_ROYALTY_RATE':
          return 'industryRoyaltyRate'
        case 'INDUSTRY_TECH_ELEMENT':
          return 'industryTechElement'
        case 'INDUSTRY_PIONEER_AND_PERIOD':
          return 'industryPioneerAndPeriod'
        case 'DISCOUNT_RATE':
          return 'discountRate'
        case 'INDUSTRY_DISCOUNT_RATE':
          return 'industryDiscountRate'
        case 'RISK_PREMIUM':
          return 'riskPremium'
        case 'PATENT_PQI_GRADE':
          return 'patentPQIGrade'
        case 'ALL_INDUSTRY_SALES':
          return 'allIndustrySales'
      }
    },
    async updateApiKey() {
      if (!this.newKiprisApiKey) {
        this.$notifier.showMessage({
          content: '값을 입력해주세요.',
          color: 'error'
        })
        return
      }
      let newKey = this.newKiprisApiKey
      await this.$store.dispatch('data/updateKiprisApiKey', {key: this.newKiprisApiKey}).then(
        res => {
          this.$notifier.showMessage({
            content: '업데이트 완료',
            color: 'success'
          })
          this.apiKey.kipris = newKey;
          this.newKiprisApiKey = ''
          this.$refs.apiKeyRef.reset()
        },
        err => {
          this.$errorHandler.showMessage(err)
        }
      )
    },
    fetchData(newData) {
      for (let i = 0; i < this.dataTypes.length; i++) {
        let key = this.getPatentFileLog(this.dataTypes[i]['key'])
        this.dataTypes[i]['count'] = newData[key]['count']
        this.dataTypes[i]['updated_at'] = newData[key]['updatedAt'].replace('T', ' ').split('.')[0]
      }
    }
  },
}
</script>

<style scoped>

</style>
