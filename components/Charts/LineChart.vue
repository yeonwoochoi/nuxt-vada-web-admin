<template>
  <line-chart-content
    class="full-width"
    ref="bigChart"
    :chart-data="bigLineChart.chartData"
    :gradient-colors="bigLineChart.gradientColors"
    :gradient-stops="bigLineChart.gradientStops"
    :extra-options="bigLineChart.extraOptions"
  >
  </line-chart-content>
</template>

<script>
import LineChartContent from "./LineChartContent";
import config from "../../config";
import * as chartConfigs from './config'
let bigChartLabels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
let bigChartDatasetOptions = {
  fill: true,
  borderColor: config.colors.primary,
  borderWidth: 2,
  borderDash: [],
  borderDashOffset: 0.0,
  pointBackgroundColor: config.colors.primary,
  pointBorderColor: 'rgba(255,255,255,0)',
  pointHoverBackgroundColor: config.colors.primary,
  pointBorderWidth: 20,
  pointHoverRadius: 4,
  pointHoverBorderWidth: 15,
  pointRadius: 4,
}
export default {
  name: 'LineChart',
  components: {LineChartContent},
  data: () => ({
    title: '총 매출액 추이',
    bigLineChart: {
      activeIndex: 0,
      chartData: {
        datasets: [{
          ...bigChartDatasetOptions,
          data: []
        }],
        labels: bigChartLabels
      },
      extraOptions: chartConfigs.purpleChartOptions,
      gradientColors: config.colors.primaryGradient,
      gradientStops: [1, 0.4, 0],
      categories: []
    }
  }),
  methods: {
    initBigChart (arrayData) {
      let chartData = {
        datasets: [{
          ...bigChartDatasetOptions,
          data: arrayData
        }],
        labels: bigChartLabels
      };
      this.$refs.bigChart.updateGradients(chartData);
      this.bigLineChart.chartData = chartData;
      this.bigLineChart.activeIndex = 0;
    }
  },
}
</script>

<style scoped>
</style>
