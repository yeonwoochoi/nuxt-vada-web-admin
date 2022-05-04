<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="planDashboardHeader">
          <template v-slot:default>
            <v-data-table
              class="full-width"
              :headers="planHeaders"
              :items="planItems"
              :mobile-breakpoint="600"
            >
              <template v-slot:top>
                <v-row align="center" justify="space-between" class="px-4 my-1">
                  <v-col cols="12" sm="3">
                    <v-dialog
                      v-model="isCreateDialogOpen"
                      max-width="400"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          dark
                          class="elevation-0 mt-md-2 mb-0"
                          :color="baseColor"
                          v-bind="attrs"
                          v-on="on"
                          @click="openCreateDialog"
                        >
                          추가
                        </v-btn>
                      </template>
                      <confirmation-dialog
                        @cancel="isCreateDialogOpen = false"
                        @ok="createPlan"
                        :title="createDialogTitle"
                        :is-active="isValid"
                      >
                        <template v-slot:default>
                          <v-text-field
                            v-model="tempPlanNameForCreate"
                            label="요금제명"
                            flat
                            filled
                            hide-details
                            outlined
                            required
                            dense
                            class="my-4"
                            :rules="[rules.required]"
                          />
                          <v-text-field
                            v-model="tempPlanNumReportsForCreate"
                            label="보고서 수"
                            flat
                            filled
                            hide-details
                            outlined
                            required
                            dense
                            class="my-4"
                            :rules="[rules.required]"
                            @keypress="isNumber($event)"
                          />
                          <v-text-field
                            v-model="tempPlanPriceForCreate"
                            label="가격"
                            flat
                            filled
                            hide-details
                            outlined
                            required
                            dense
                            class="my-4"
                            :rules="[rules.required]"
                            @keypress="isNumber($event)"
                          />
                        </template>
                      </confirmation-dialog>
                    </v-dialog>
                  </v-col>
                </v-row>
              </template>
              <template v-slot:item.detail="{item}">
                <v-btn
                  class="font-weight-bold elevation-0 pa-0 no-background-hover"
                  :ripple="false"
                  @click="showPlanDetail(item)"
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
                    @ok="deletePlan(item)"
                    :title="deleteDialogTitle"
                    :comment="deleteDialogContent"
                  />
                </v-dialog>
              </template>
            </v-data-table>
          </template>
        </dashboard-card>
      </v-col>
      <v-col cols="12" class="my-2" id="scrollTarget">
        <dashboard-card :title="'상세보기'" v-if="!!activeItem" :is-loading="createLoading || updateLoading || deleteLoading">
          <template v-slot:default>
            <v-row align="center" justify="center" class="my-6">
              <v-col cols="12" sm="4" class="text-sm-center">
                <p class="user-detail-header-font">요금제명</p>
              </v-col>
              <v-col cols="12" sm="8">
                <p class="user-detail-content-font">{{ activeItem['name'] }}</p>
              </v-col>
              <v-col cols="12" sm="4" class="text-sm-center">
                <p class="user-detail-header-font">보고서 수</p>
              </v-col>
              <v-col cols="12" sm="8">
                <p class="user-detail-content-font">{{ activeItem['numReports'] }}</p>
              </v-col>
              <v-col cols="12" sm="4" class="text-sm-center">
                <p class="user-detail-header-font">가격</p>
              </v-col>
              <v-col cols="12" sm="8">
                <p class="user-detail-content-font">{{ activeItem['price'] }}</p>
              </v-col>
              <v-col cols="11">
                <v-divider/>
              </v-col>
              <v-col cols="11" align="end">
                <v-dialog
                  v-model="isUpdateDialogOpen"
                  max-width="400"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      large
                      dark
                      class="elevation-0 mt-md-2 mb-0"
                      :color="baseColor"
                      v-bind="attrs"
                      v-on="on"
                      @click="openUpdateDialog"
                    >
                      변경
                    </v-btn>
                  </template>
                  <confirmation-dialog
                    @cancel="isUpdateDialogOpen = false"
                    @ok="updatePlan"
                    :title="updateDialogTitle"
                  >
                    <template v-slot:default>
                      <v-text-field
                        v-model="tempPlanNameForUpdate"
                        label="요금제명"
                        flat
                        filled
                        hide-details
                        outlined
                        required
                        dense
                        class="my-4"
                        :rules="[rules.required]"
                      />
                      <v-text-field
                        v-model="tempPlanNumReportsForUpdate"
                        label="보고서 수"
                        flat
                        filled
                        hide-details
                        outlined
                        required
                        dense
                        class="my-4"
                        :rules="[rules.required]"
                        @keypress="isNumber($event)"
                      />
                      <v-text-field
                        v-model="tempPlanPriceForUpdate"
                        label="가격"
                        flat
                        filled
                        hide-details
                        outlined
                        required
                        dense
                        class="my-4"
                        :rules="[rules.required]"
                        @keypress="isNumber($event)"
                      />
                    </template>
                  </confirmation-dialog>
                </v-dialog>
              </v-col>
            </v-row>
          </template>
        </dashboard-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DashboardCard from "../../components/Cards/DashboardCard";
import ConfirmationDialog from "../../components/Dialog/ConfirmationDialog";
import {mapState} from "vuex";

export default {
  name: "index",
  components: {DashboardCard, ConfirmationDialog},
  asyncData: ({store}) => {
    return store.dispatch('fee/readAllPlan').then(
      res => {
        return {
          planItems: res.sort((a,b) => a.price - b.price),
          fetchError: null
        }
      },
      err => {
        return {
          planItems: [],
          fetchError: err
        }
      }
    )
  },
  created() {
    if (!!this.fetchError) {
      this.$errorHandler.showMessage(this.fetchError)
    }
  },
  data: () => ({
    planDashboardHeader: '요금제 관리',
    planHeaders: [
      {
        text: '요금제명',
        value: 'name',
        align: 'center'
      },
      {
        text: '보고서 수',
        value: 'numReports',
        align: 'center'
      },
      {
        text: '가격',
        value: 'price',
        align: 'center'
      },
      {
        text: '상세보기',
        align: 'start',
        sortable: false,
        filterable: false,
        value: 'detail',
        width: '12%'
      },
      {
        text: '삭제',
        align: 'start',
        sortable: false,
        filterable: false,
        value: 'delete',
        width: '12%'
      },
    ],

    scrollOptions: {
      duration: 800,
      offset: -80,
      easing: 'easeInOutCubic'
    },

    updateDialogTitle: '요금제 변경',

    deleteDialogTitle: '요금제 삭제',
    deleteDialogContent: '해당 요금제를 정말 삭제하시겠습니까?',

    createDialogTitle: '요금제 생성/추가',

    isCreateDialogOpen: false,
    isUpdateDialogOpen: false,

    createLoading: false,
    updateLoading: false,
    deleteLoading: false,

    activeItem: null,

    tempPlanNameForCreate: '',
    tempPlanNumReportsForCreate: '',
    tempPlanPriceForCreate: '',

    tempPlanNameForUpdate: '',
    tempPlanNumReportsForUpdate: '',
    tempPlanPriceForUpdate: '',
  }),
  computed: {
    ...mapState({
      baseColor: 'baseColor'
    }),
    isValid() {
      return !!this.tempPlanPriceForCreate && !!this.tempPlanNameForCreate && !!this.tempPlanNumReportsForCreate
    },
    rules() {
      return {
        required: value => !!value || '값을 입력해주세요',
      }
    },
  },
  methods: {
    showPlanDetail(item) {
      this.activeItem = item
      this.$vuetify.goTo("#scrollTarget", this.scrollOptions)
    },
    openCreateDialog() {
      if (this.isCreateDialogOpen) return;
      this.isCreateDialogOpen = true;
    },
    openUpdateDialog() {
      if (this.isUpdateDialogOpen || !this.activeItem) return;
      this.tempPlanNameForUpdate = this.activeItem['name']
      this.tempPlanNumReportsForUpdate = this.activeItem['numReports']
      this.tempPlanPriceForUpdate = this.activeItem['price']
      this.isUpdateDialogOpen = true;
    },
    async createPlan() {
      this.createLoading = true;

      if (!this.isOverlap()) {
        this.createLoading = false
        return
      }

      let payload = {
        name: this.tempPlanNameForCreate,
        numReports: this.tempPlanNumReportsForCreate,
        price: this.tempPlanPriceForCreate
      }
      await this.$store.dispatch('fee/createPlan', payload).then(
        res => {
          alert("요금제가 추가되었습니다")
          this.$router.go(0)
          this.createLoading = false
        },
        err => {
          this.$errorHandler.showMessage(err)
          this.createLoading = false
        }
      )
    },
    async updatePlan() {
      this.updateLoading = true

      if (this.activeItem['name'] === this.tempPlanNameForUpdate
        && this.activeItem['price'] === this.tempPlanPriceForUpdate
        && this.activeItem['numReports'] === this.tempPlanNumReportsForUpdate)
      {
        this.$notifier.showMessage({
          content: '변경된 값이 없습니다.',
          color: 'error'
        })
        this.updateLoading = false
        return
      }

      if (!this.isOverlap(false)) {
        this.updateLoading = false
        return
      }

      let types = []

      if (this.activeItem['name'] !== this.tempPlanNameForUpdate) {
        types.push('NAME')
      }
      if (this.activeItem['price'] !== this.tempPlanPriceForUpdate) {
        types.push('PRICE')
      }
      if (this.activeItem['numReports'] !== this.tempPlanNumReportsForUpdate) {
        types.push('NUM_REPORTS')
      }

      let payload = {
        id: this.activeItem.id,
        data: {
          name: this.tempPlanNameForUpdate,
          numReports: this.tempPlanNumReportsForUpdate,
          price: this.tempPlanPriceForUpdate,
          types: types
        }
      }

      await this.$store.dispatch('fee/updatePlan', payload).then(
        res => {
          alert("요금제가 변경되었습니다")
          this.$router.go(0)
          this.updateLoading = false
        },
        err => {
          this.$errorHandler.showMessage(err)
          this.updateLoading = false
        }
      )
    },
    async deletePlan(item) {
      this.deleteLoading = true;
      await this.$store.dispatch('fee/deletePlan', item.id).then(
        res => {
          alert("요금제가 삭제되었습니다")
          this.deleteLoading = false
          this.$router.go(0)
        },
        err => {
          this.$errorHandler.showMessage(err)
          this.deleteLoading = false
        }
      )
    },
    isNumber: function(evt) {
      evt = (evt) ? evt : window.event;
      let charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    isOverlap(isCreate = true) {
      for (let i = 0; i < this.planItems.length; i++) {
        let temp = this.planItems[i]
        if (!isCreate) {
          if (temp.id === this.activeItem.id) continue
        }

        let name = isCreate ? this.tempPlanNameForCreate : this.tempPlanNameForUpdate;
        let numReports = isCreate ? this.tempPlanNumReportsForCreate : this.tempPlanNumReportsForUpdate;
        let price = isCreate ? this.tempPlanPriceForCreate : this.tempPlanPriceForUpdate;

        if (name === temp['name']) {
          this.$errorHandler.showMessage(err)
          return false;
        }

        if (parseInt(numReports) === temp['numReports']) {
          this.$notifier.showMessage({
            content: '보고서 수가 중복됩니다.',
            color: 'error'
          })
          return false;
        }

        if (parseInt(price) === temp['price']) {
          this.$notifier.showMessage({
            content: '가격이 중복됩니다.',
            color: 'error'
          })
          return false;
        }
      }
      return true;
    },
  }
}
</script>

<style scoped>
p {
  margin-bottom: 0;
}
</style>
