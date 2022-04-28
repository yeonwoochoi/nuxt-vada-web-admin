<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="header">
          <template v-slot:default>
            <v-row align="center" justify="start" class="pa-12">
              <v-col cols="12" sm="12" md="6" lg="4" v-for="(data, index) in patentData" :key="`data-${index}`">
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DashboardCard from "@/components/Cards/DashboardCard";
import HorizontalCard from "@/components/Cards/HorizontalCard";

export default {
  name: "index",
  components: {DashboardCard, HorizontalCard},
  asyncData({store}) {
    return store.dispatch('data/getPatentLog').then(
      res => {
        let data = [
          {
            key: 'CASH_FLOW',
            title: '현금 흐름',
            updated_at: res['cashFlow']['updatedAt'].replace('T', ' ').split('.')[0],
            count: res['cashFlow']['count']
          },
          {
            key: 'IPC_TCT',
            title: 'TCT 지수',
            updated_at: res['tct']['updatedAt'].replace('T', ' ').split('.')[0],
            count: res['tct']['count']
          },
          {
            key: 'ROYALTY_RATE',
            title: '로열티율',
            updated_at: res['royaltyRate']['updatedAt'].replace('T', ' ').split('.')[0],
            count: res['royaltyRate']['count']
          },
          {
            key: 'INDUSTRY_ROYALTY_RATE',
            title: '산업별 로열티율',
            updated_at: res['industryRoyaltyRate']['updatedAt'].replace('T', ' ').split('.')[0],
            count: res['industryRoyaltyRate']['count']
          },
          {
            key: 'INDUSTRY_TECH_ELEMENT',
            title: '사업 기술 요소',
            updated_at: res['industryTechElement']['updatedAt'].replace('T', ' ').split('.')[0],
            count: res['industryTechElement']['count']
          },
          {
            key: 'INDUSTRY_PIONEER_AND_PERIOD',
            title: '개척율 및 사업화 기간',
            updated_at: res['industryPioneerAndPeriod']['updatedAt'].replace('T', ' ').split('.')[0],
            count: res['industryPioneerAndPeriod']['count']
          },
          {
            key: 'DISCOUNT_RATE',
            title: '할인율',
            updated_at: res['discountRate']['updatedAt'].replace('T', ' ').split('.')[0],
            count: res['discountRate']['count']
          },
          {
            key: 'INDUSTRY_DISCOUNT_RATE',
            title: '산업별 할인율',
            updated_at: res['industryDiscountRate']['updatedAt'].replace('T', ' ').split('.')[0],
            count: res['industryDiscountRate']['count']
          },
          {
            key: 'RISK_PREMIUM',
            title: '위험 프리미엄',
            updated_at: res['riskPremium']['updatedAt'].replace('T', ' ').split('.')[0],
            count: res['riskPremium']['count']
          },
          {
            key: 'PATENT_PQI_GRADE',
            title: '특허 PQI 지수',
            updated_at: res['patentPQIGrade']['updatedAt'].replace('T', ' ').split('.')[0],
            count: res['patentPQIGrade']['count']
          },
          {
            key: 'ALL_INDUSTRY_SALES',
            title: '전 손익계산서 매출액',
            updated_at: res['allIndustrySales']['updatedAt'].replace('T', ' ').split('.')[0],
            count: res['allIndustrySales']['count']
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
          dataTypes: result,
          fetchError: null
        }
      },
      err => {
        return {
          dataTypes: [],
          fetchError: err
        }
      }
    )
  },
  created() {
    if (!!this.fetchError) {
      this.$notifier.showMessage({
        content: this.fetchError,
        color: 'error'
      })
    }
  },
  data: () => ({
    header: '데이터 관리',
    newDataFile: null,
    resetTime: 1000,
  }),
  methods: {
    async uploadFile({key, file}, callback) {
      let index = this.dataTypes.findIndex(obj => obj.key === key)

      let formData = new FormData();
      formData.append('file', file);

      let config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: function( progressEvent ) {
          this.dataTypes[index].progress = parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ) );
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
          setTimeout(() => {
            this.dataTypes[index].progress = 0;
            callback()
          },this.resetTime)
        },
        err => {
          this.$notifier.showMessage({
            content: err,
            color: 'error'
          })
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
        onUploadProgress: function( progressEvent ) {
          this.dataTypes[index].progress = parseInt( Math.round( ( progressEvent.loaded / progressEvent.total ) * 100 ) );
        }.bind(this)
      }

      let payload = {
        type: key,
        config: config
      }

      await this.$store.dispatch('data/downloadFile', payload).then(
        res => {
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
          this.$notifier.showMessage({
            content: err,
            color: 'error'
          })
          callback()
          this.dataTypes[index].progress = 0
        }
      )
    },
  },
}
</script>

<style scoped>

</style>
