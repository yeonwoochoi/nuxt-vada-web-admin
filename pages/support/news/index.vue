<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" class="my-2">
        <dashboard-card :title="newsTitle">
          <template v-slot:default>
            <v-data-table
              class="full-size row-pointer"
              :headers="newsHeader"
              :items="newsItems"
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
                        @ok="createNews"
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
              <template v-slot:item.title="{item}">
                <td class="text-start ellipsis" style="max-width: 280px; font-size: 13px;">
                  <div class="ellipsis font-weight-medium">
                    {{ item.title }}
                  </div>
                </td>
              </template>
              <template v-slot:item.detail="{item}">
                <v-btn
                  text
                  class="font-weight-bold elevation-0 pa-0 no-background-hover"
                  :ripple="false"
                  @click="showDetail(item)"
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
                    @ok="deleteNews(item)"
                    :title="deleteDialogTitle"
                    :comment="deleteDialogContent"
                  />
                </v-dialog>
              </template>
            </v-data-table>
          </template>
        </dashboard-card>
      </v-col>
      <v-col cols="12" class="my-2" id="scrollNewsTarget">
        <dashboard-card :title="newsTitle" v-if="!!activeItem" :is-loading="updateLoading || createLoading || deleteLoading">
          <template v-slot:default>
            <v-row align="start" justify="space-around" class="full-width py-10 px-8">

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">제목</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeItem.title }}</p>
              </v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">날짜</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeItem.created_at }}</p>
              </v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">조회수</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeItem.view_count }}</p>
              </v-col>

              <v-col cols="12" sm="2" class="text-sm-center pb-0">
                <p class="user-detail-header-font">내용</p>
              </v-col>
              <v-col cols="12" sm="9">
                <p class="user-detail-content-font">{{ activeItem.content }}</p>
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
                      @ok="updateNews"
                      :title="updateDialogTitle"
                      :is-active="isModified"
                    >
                      <template v-slot:default>
                        <v-textarea
                          v-model="tempTitleForUpdate"
                          label="제목"
                          rows="2"
                          outlined
                          no-resize
                          clearable
                        />
                        <v-textarea
                          v-model="tempContentForUpdate"
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
  name: "news",
  components: {ConfirmationDialog, DashboardCard},
  asyncData({store}) {
    return store.dispatch('news/readAll').then(
      res => {
        let result = []
        for (let i = res.length-1; i >= 0; i--) {
          let item = res[i]
          let time = item.updatedAt.split('T')[0]
          let created_at = time.split('T')[0]
          result.push({
            no: res.length-i,
            idx: item.id,
            title: item.title,
            content: item.content,
            created_at: created_at,
            view_count: item.view,
            isDeleteDialogOpen: false,
          })
        }
        return {
          newsItems: result,
          fetchError: null
        }
      },
      err => {
        return {
          newsItems: [],
          fetchError: err
        }
      }
    )
  },
  created() {
    this.$store.commit('setSheetTitle', '공지사항')
    if (!!this.fetchError) {
      this.$errorHandler.showMessage(this.fetchError)
    }
  },
  data: () => ({
    newsTitle: '공지사항',
    newsHeader: [
      {
        text: 'No',
        sortable: false,
        width: '8%',
        align: 'center',
        value: 'no'
      },
      {
        text: '제목',
        sortable: false,
        value: 'title'
      },
      {
        text: '날짜',
        align: 'center',
        width: '12%',
        value: 'created_at'
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

    createLoading: false,
    updateLoading: false,
    deleteLoading: false,

    activeItem: null,
    scrollOptions: {
      duration: 800,
      offset: -80,
      easing: 'easeInOutCubic'
    },

    tempTitleForCreate: '',
    tempContentForCreate: '',

    tempTitleForUpdate: '',
    tempContentForUpdate: '',

    isCreateDialogOpen: false,
    isUpdateDialogOpen: false,

    deleteDialogTitle: '공지사항 삭제',
    deleteDialogContent: '정말 삭제하시겠습니까?',
    createDialogTitle: '공지사항 생성',
    updateDialogTitle: '공지사항 수정',
  }),
  computed: {
    ...mapState({
      baseColor: 'baseColor'
    }),
    isEntered() {
      return !!this.tempTitleForCreate && !!this.tempContentForCreate
    },
    isModified() {
      if (!this.activeItem) return false;
      return this.tempTitleForUpdate !== this.activeItem.title || this.tempContentForUpdate !== this.activeItem.content
    },
  },
  methods: {
    showDetail(item) {
      this.activeItem = item;
      this.$vuetify.goTo("#scrollNewsTarget", this.scrollOptions)
    },

    openCreateDialog() {
      this.tempTitleForCreate = ''
      this.tempContentForCreate = ''
    },

    openUpdateDialog() {
      if (!!this.activeItem) {
        this.tempTitleForUpdate = this.activeItem.title;
        this.tempContentForUpdate = this.activeItem.content;
      }
      else {
        this.$notifier.showMessage({
          content: '새로고침 후 다시 시도해주세요.',
          color: 'error'
        })
      }
    },

    async createNews() {
      this.createLoading = true;
      let params = {
        title: this.tempTitleForCreate,
        content: this.tempContentForCreate
      }
      await this.$store.dispatch('news/create', params)
        .then(
          res => {
            alert(`공지사항 생성 완료`)
            this.createLoading = false;
            this.$router.go(0)
          },
          err => {
            this.$errorHandler.showMessage(err)
            this.createLoading = false;
            this.isCreateDialogOpen = false;
          }
        )
    },

    async updateNews() {
      this.updateLoading = true;
      let params = {
        id: this.activeItem.idx,
        title: this.tempTitleForUpdate,
        content: this.tempContentForUpdate
      }
      await this.$store.dispatch('news/update', params)
        .then(
          res => {
            alert(`공지사항 업데이트 완료`)
            this.updateLoading = false;
            this.activeItem = null;
            this.$router.go(0)
          },
          err => {
            this.$errorHandler.showMessage(err)
            this.updateLoading = false;
            this.isUpdateDialogOpen = false;
          }
        )
    },

    async deleteNews(item) {
      this.deleteLoading = true;
      await this.$store.dispatch('news/delete', item.idx)
        .then(
          res => {
            alert(`공지사항 삭제 완료`)
            this.deleteLoading = false;
            this.$router.go(0)
          },
          err => {
            this.$errorHandler.showMessage(err)
            this.deleteLoading = false;
            this.isDeleteDialogOpen = false;
          }
        )
    },
  },
}
</script>

<style scoped>

</style>
