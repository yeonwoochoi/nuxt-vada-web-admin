<template>
  <v-data-table
    :items="tableItems"
    hide-default-footer
    style="outline: #F5F5F5"
  >
    <template v-slot:body="{ items }">
      <tbody>
        <tr v-for="header in tableHeader">
          <td class="text-center font-weight-bold subtitle-1 pa-3" style="background-color: #F5F5F5; width: 25%;">
            <pre v-html="header.text" :class="headerClass"/>
          </td>
          <td v-for="item in items" class="py-4 pl-8" style="line-height: 1.8em; width: 75%;">
            <pre v-html="item[header.value]" :class="contentClass"/>
          </td>
        </tr>
      </tbody>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "VerticalHeaderTable",
  props: {
    tableHeader: {
      type: Array,
      default: () => [
        {
          text: '평가의 목적',
          value: 'purpose',
        },
        {
          text: '평가대상특허',
          value: 'targetPatent',
        },
        {
          text: '기술의 경제적\n수명 산정',
          value: 'techLife',
        },
        {
          text: '로열티율',
          value: 'loyaltyRate',
        },
        {
          text: '할인율',
          value: 'discountRate',
        },
        {
          text: '기술가치',
          value: 'techPrice',
        },
      ],
    },
    tableItems: {
      type: Array,
      default: () => []
    },
    headerClass: {
      type: String,
      default: () => ''
    },
    contentClass: {
      type: String,
      default: () => ''
    },
  }
}
</script>

<style scoped>
pre {
  font-family: "Roboto", sans-serif;
  white-space: pre-wrap;
  overflow: hidden;
}

.v-data-table td {
  border: 1px solid #e5e5e5 !important;
  min-width: 135px;
  width: fit-content;
}
.v-data-table tbody tr {
  background-color: transparent !important;
}

</style>
