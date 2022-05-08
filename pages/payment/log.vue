<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="header">
          <template v-slot:default>
            <v-data-table
              class="full-width text-center"
              :headers="paymentHeaders"
              :items="paymentLog"
              :mobile-breakpoint="600"
            >
              <template v-slot:item.serviceName="{item}">
                <p v-if="item.isDeleted" class="mb-0 red--text">{{item.serviceName}}</p>
                <p v-else-if="item.isUpdated" class="mb-0 blue--text">{{item.serviceName}}</p>
                <p v-else class="mb-0">{{item.serviceName}}</p>
              </template>
              <template v-slot:item.price="{item}">
                <p v-if="item.isDeleted" class="mb-0 red--text">{{item.price}}</p>
                <p v-else-if="item.isUpdated" class="mb-0 blue--text">{{item.price}}</p>
                <p v-else class="mb-0">{{item.price}}</p>
              </template>
              <template v-slot:item.numReports="{item}">
                <p v-if="item.isDeleted" class="mb-0 red--text">{{item.numReports}}</p>
                <p v-else-if="item.isUpdated" class="mb-0 blue--text">{{item.numReports}}</p>
                <p v-else class="mb-0">{{item.numReports}}</p>
              </template>
            </v-data-table>
          </template>
        </dashboard-card>
      </v-col>
      <v-col cols="12" align="end">
        <p>요금제가 삭제된 경우 <span class="red--text font-weight-black">빨간색</span></p>
        <p>요금제가 수정된 경우 <span class="blue--text font-weight-black">파란색</span></p>
        <p>요금제가 수정되지 않은 경우 <span class="black--text font-weight-black">검정색</span></p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DashboardCard from "../../components/Cards/DashboardCard";
export default {
  name: "log",
  components: {DashboardCard},
  async asyncData ({$axios, store}) {
    try {
      let paymentLog = await store.dispatch('fee/readAllPayment')
      let plans = await store.dispatch('fee/readAllPlan')
      let result = []
      for (let i = paymentLog.length-1; i >= 0; i--) {
        let serviceInfo = null
        let hasValue = false
        try {
          serviceInfo = {
            name: '-',
            price: '-',
            numReports: '-',
          }
          for (let j = 0; j < plans.length; j++ ) {
            if (plans[j]['id'] === paymentLog[i]['serviceId']) {
              serviceInfo = plans[j]
              hasValue = true
            }
          }
        }
        catch (e) {
          hasValue = false
        }
        finally {
          if (!hasValue) {
            serviceInfo = {
              name: '-',
              price: '-',
              numReports: '-',
            }
          }
        }

        let time = paymentLog[i]['createdAt'].split('T')

        result.push({
          ...paymentLog[i],
          created_at: `${time[0]} ${time[1].split('.')[0]}`,
          email: paymentLog[i]['email'],
          serviceName: serviceInfo['name'],
          servicePrice: serviceInfo['price'],
          numReports: serviceInfo['numReports'],
          price: paymentLog[i]['price'],
          isUpdated: paymentLog[i]['price'] !== serviceInfo['price'],
          isDeleted: !hasValue
        })

      }
      return {
        paymentLog: result,
        fetchError: null
      }
    }
    catch (err) {
      return {
        paymentLog: [],
        fetchError: err
      }
    }
  },
  created() {
    if (!!this.fetchError) {
      this.$errorHandler.showMessage(this.fetchError)
    }
  },
  data: () => ({
    header: '결제내역',
    paymentHeaders: [
      {
        text: '구매 계정',
        value: 'email',
        align: 'center'
      },
      {
        text: '구매일',
        value: 'created_at',
        align: 'center',
      },
      {
        text: '서비스명',
        value: 'serviceName',
        align: 'center'
      },
      {
        text: '가격',
        value: 'price',
        align: 'center'
      },
      {
        text: '구입한 보고서 수',
        value: 'numReports',
        align: 'center'
      },
    ],
  }),
}
</script>

<style scoped>

</style>
