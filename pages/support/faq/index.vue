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
              :mobile-breakpoint="960"
            >
              <template v-slot:top>
                <v-row align="center" justify="space-between" class="px-4 my-1">
                  <v-col cols="12" sm="3">
                    <v-dialog
                      v-model="isCreateDialogOpen"
                      max-width="1000"
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
                        @ok="createFaq"
                        :title="createDialogTitle"
                        :is-active="isEntered"
                      >
                        <template v-slot:default>
                          <v-textarea
                            v-model="tempTitleForCreate"
                            label="제목"
                            rows="2"
                            outlined
                            no-resize
                            clearable
                          />
                          <v-textarea
                            v-model="tempContentForCreate"
                            label="내용"
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
        <dashboard-card :title="'상세보기'" v-if="!!activeItem" :is-loading="createLoading || updateLoading || deleteLoading">
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
                <pre class="user-detail-content-font pre-no-overflow" v-html="activeItem.data.content"/>
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
                        @click="openUpdateDialog"
                      >
                        수정하기
                      </v-btn>
                    </template>
                    <confirmation-dialog
                      @cancel="isUpdateDialogOpen = false"
                      @ok="updateFaq"
                      :title="updateDialogTitle"
                      :is-active="isModified"
                    >
                      <template v-slot:default>
                        <v-textarea
                          v-model="tempTitleForUpdate"
                          label="질문"
                          rows="2"
                          outlined
                          no-resize
                          clearable
                        />
                        <v-textarea
                          v-model="tempContentForUpdate"
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
import {mapState} from "vuex";
import DashboardCard from "../../../components/Cards/DashboardCard";
import ConfirmationDialog from "../../../components/Dialog/ConfirmationDialog";

export default {
  name: "faq",
  components: {ConfirmationDialog, DashboardCard},
  asyncData({store}) {
    return store.dispatch('faq/readAll').then(
      res => {
        let result = []
        for (let i = 0; i < res.length; i++) {
          let item = res[i]
          let created_at = item.updatedAt.split('T')[0]
          result.push({
            no: i+1,
            idx: item.id,
            data: {
              title: item.title,
              content: item.content,
            },
            created_at: created_at,
            isDeleteDialogOpen: false,
          })
        }
        return {
          faqItems: result,
          fetchError: null
        }
      },
      err => {
        return {
          faqItems: [],
          fetchError: err
        }
      }
    )
  },
  data: () => ({
    faqCardTitle: 'FAQ',

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
    activeItem: null,

    scrollOptions: {
      duration: 800,
      offset: -80,
      easing: 'easeInOutCubic'
    },

    createLoading: false,
    updateLoading: false,
    deleteLoading: false,

    tempTitleForCreate: '',
    tempContentForCreate: '',

    tempTitleForUpdate: '',
    tempContentForUpdate: '',

    isCreateDialogOpen: false,
    isUpdateDialogOpen: false,
    isDeleteDialogOpen: false,

    deleteDialogTitle: 'FAQ 삭제',
    deleteDialogContent: '정말 삭제하시겠습니까?',
    createDialogTitle: 'FAQ 생성',
    updateDialogTitle: 'FAQ 수정',
  }),

  computed: {
    ...mapState({
      baseColor: "baseColor"
    }),
    isEntered() {
      return !!this.tempTitleForCreate && !!this.tempContentForCreate
    },
    isModified() {
      if (!this.activeItem) return false;
      return this.tempTitleForUpdate !== this.activeItem.data.title || this.tempContentForUpdate !== this.activeItem.data.content
    },
  },
  methods: {
    showDetail(item) {
      this.activeItem = item;
      this.$vuetify.goTo("#scrollFaqTarget", this.scrollOptions)
    },

    openCreateDialog() {
      this.tempTitleForCreate = ''
      this.tempContentForCreate = ''
    },

    openUpdateDialog() {
      if (!!this.activeItem) {
        this.tempTitleForUpdate = this.activeItem.data.title;
        this.tempContentForUpdate = this.activeItem.data.content;
      }
      else {
        this.$notifier.showMessage({
          content: '새로고침 후 다시 시도해주세요.',
          color: 'error'
        })
      }
    },
    async createFaq() {
      this.createLoading = true;
      let params = {
        title: this.tempTitleForCreate,
        content: this.tempContentForCreate
      }
      await this.$store.dispatch('faq/create', params)
        .then(
          res => {
            alert(`FAQ 생성 완료`)
            this.createLoading = false;
            this.$router.go(0)
          },
          err => {
            this.$notifier.showMessage({
              content: err,
              color: 'error'
            })
            this.createLoading = false;
            this.isCreateDialogOpen = false;
          }
        )
    },
    async updateFaq() {
      this.updateLoading = true;
      let params = {
        id: this.activeItem.idx,
        title: this.tempTitleForUpdate,
        content: this.tempContentForUpdate
      }
      await this.$store.dispatch('faq/update', params)
        .then(
          res => {
            alert(`FAQ 업데이트 완료`)
            this.updateLoading = false;
            this.activeItem = null;
            this.$router.go(0)
          },
          err => {
            this.$notifier.showMessage({
              content: err,
              color: 'error'
            })
            this.updateLoading = false;
            this.isUpdateDialogOpen = false;
          }
        )
    },

    async deleteFAQ(item) {
      this.deleteLoading = true;
      await this.$store.dispatch('faq/delete', item.idx)
        .then(
          res => {
            alert(`FAQ 삭제 완료`)
            this.deleteLoading = false;
            this.$router.go(0)
          },
          err => {
            this.$notifier.showMessage({
              content: err,
              color: 'error'
            })
            this.deleteLoading = false;
            this.isDeleteDialogOpen = false;
          }
        )
    }
  },
}
</script>

<style scoped>

</style>
