<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="header">
          <template v-slot:default>
            <v-row align="center" justify="start" class="pa-12">
              <v-col cols="12" md="6" xl="4" v-for="(data, index) in dataTypes" :key="`data-${index}`">
                <horizontal-card
                  :title="data.title"
                  :updated-at="data.updated_at"
                  :color="data.color"
                  :count="data.count"
                  :data-key="data.key"
                  :upload-percentage="data.progress"
                  @download="downloadFile"
                  @upload="uploadFile"
                  :width="'100%'"
                />
              </v-col>
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
                <p class="mb-0">{{apiKey.kipris}}</p>
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
  </v-container>
</template>

<script>
import DashboardCard from "@/components/Cards/DashboardCard";
import HorizontalCard from "@/components/Cards/HorizontalCard";
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
  data: () => ({
    header: '데이터 관리',
    apiHeader: 'API KEY 관리',
    newDataFile: null,
    resetTime: 1000,
    newKiprisApiKey: ''
  }),
  computed: {
    ...mapState({
      baseColor: "baseColor"
    })
  },
  methods: {
    async uploadFile({key, file}, callback) {
      if (!file) {
        this.$notifier.showMessage({
          content: '파일을 입력해주세요',
          color: 'error'
        })
        return
      }
      let index = this.dataTypes.findIndex(obj => obj.key === key)

      let formData = new FormData();
      formData.append('file', file);

      let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: function( progressEvent ) {
          this.dataTypes[index].progress = parseInt(progressEvent.total) <= 0 ? '' : parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
        }.bind(this)
      }

      let payload = {
        key: key,
        data: formData,
        config: config
      }

      await this.$store.dispatch('data/uploadFile', payload).then(
        res => {
          this.$notifier.showMessage({
            content: '파일 업로드 성공',
            color: 'success'
          })

          let updatedIndex = this.dataTypes.findIndex(obj => obj.key === key)
          this.dataTypes[updatedIndex]['count'] = res[`${this.getPatentFileLog(key)}`]['count']
          this.dataTypes[updatedIndex]['updated_at'] = res[`${this.getPatentFileLog(key)}`]['updatedAt'].replace('T', ' ').split('.')[0]

          setTimeout(() => {
            this.dataTypes[index].progress = 0;
            callback()
          },this.resetTime)

        },
        err => {
          this.$errorHandler.showMessage(err)
          this.dataTypes[index].progress = 0;
          callback()
        }
      )
    },
    async downloadFile(key, callback) {
      let index = this.dataTypes.findIndex(obj => obj.key === key)
      this.dataTypes[index].progress = 0;

      let config = {
        headers: {
          'Content-Type': 'application/json',
        },
        responseType: "arraybuffer",
        onDownloadProgress: function (progressEvent) {
          this.dataTypes[index].progress = parseInt(progressEvent.total) <= 0 ? '' : parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
        }.bind(this)
      }

      let data = {
        type: key,
        config: config
      }

      await this.$store.dispatch('data/downloadFile', data).then(
        res => {
          let blob = new Blob([res], {type: "text/csv"});
          let objectUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = objectUrl;
          let currentDate = this.$util.getCurrentStringDate().replaceAll('-', '_');
          link.setAttribute('download', `${key.toLowerCase()}_${currentDate}.csv`);
          document.body.appendChild(link);
          link.click();

          this.$notifier.showMessage({
            content: '파일 다운로드 성공',
            color: 'success'
          })

          setTimeout(() => {
            this.dataTypes[index].progress = 0;
            callback()
          }, this.resetTime)
        },
        err => {
          this.$errorHandler.showMessage(err)
          callback()
          this.dataTypes[index].progress = 0
        }
      )
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
    }
  },
}
</script>

<style scoped>

</style>
