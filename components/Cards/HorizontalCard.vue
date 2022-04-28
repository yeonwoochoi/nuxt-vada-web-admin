<template>
  <v-card
    :color="color"
    :dark="dark"
    :width="width"
    :height="height"
    class="px-1 py-4 elevation-0"
    style="border-radius: 15px;"
    dark
  >
    <div>
      <v-row align="center" justify="center">
        <v-col cols="8" class="pb-0">
          <v-card-title
            class="text-h5 mb-2"
            v-text="title"
          />
          <v-card-subtitle>
            <p >마지막 업데이트: <span class="font-weight-bold subtitle-1 pl-1">{{updatedAt}}</span></p>
            <p class="mb-0">데이터 수: <span class="font-weight-bold subtitle-1 pl-1">{{count}}</span></p>
          </v-card-subtitle>
        </v-col>
        <v-col cols="4">
          <v-progress-circular
            :rotate="-90"
            :size="100"
            :width="15"
            :value="uploadPercentage"
            :color="color"
            class="white--text"
          >
            {{ uploadPercentage }}
          </v-progress-circular>
        </v-col>
        <v-col cols="12" class="py-0">
          <v-divider class="mx-4" dark/>
        </v-col>
        <v-col cols="12">
          <v-card-text class="subtitle-1 pb-0 pt-4">
            <client-only>
              <v-file-input
                v-model="uploadFile"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                :color="color"
                counter
                :label="label"
                placeholder="파일 찾기"
                prepend-icon="mdi-file-upload"
                outlined
                :show-size="1000"
              >
                <template v-slot:selection="{ text }">
                  <v-chip
                    dark
                    label
                    small
                    color="white"
                    :style="`color: ${color}`"
                  >
                    {{ text }}
                  </v-chip>
                </template>
              </v-file-input>
            </client-only>
          </v-card-text>
        </v-col>
        <v-col cols="12">
          <v-card-actions class="flex-space-between">
            <v-btn
              class="ml-2 pa-1 font-weight-bold"
              :loading="isDownload"
              :disabled="isUpload"
              @click="download"
              large
              outlined
            >
              다운로드
            </v-btn>
            <v-btn
              class="mr-2 pa-1 font-weight-bold"
              :loading="isUpload"
              :disabled="isDownload"
              @click="upload"
              large
              outlined
            >
              저장
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>

export default {
  name: "HorizontalCard",
  props: {
    dark: {
      type: Boolean,
      default: () => false
    },
    width: {
      type: [String, Number],
      default: () => 'fit-content'
    },
    height: {
      type: [String, Number],
      default: () => 'fit-content'
    },
    count: {
      type: [String, Number],
      default: () => '-'
    },
    color: {
      type: String,
      default: () => 'rgb(2, 136, 209)'
    },
    title: {
      type: String,
      default: () => ''
    },
    updatedAt: {
      type: String,
      default: () => ''
    },
    dataKey: {
      type: String,
      default: () => ''
    },
    uploadPercentage: {
      type: [String, Number],
      default: () => 0
    }
  },
  data: () => ({
    isDownload: false,
    isUpload: false,
    uploadFile: null,
    label: 'csv 파일을 입력하세요',
  }),
  methods: {
    async download() {
      this.isDownload = true
      await this.$emit('download',this.dataKey, () => {
        this.isDownload = false
      })
    },
    async upload() {
      if (!this.uploadFile) {
        this.$notifier.showMessage({
          content: '파일을 입력해주세요',
          color: 'error'
        })
        return;
      }
      this.isUpload = true
      let payload = {
        key: this.dataKey,
        file: this.uploadFile
      }
      await this.$emit('upload', payload)
      this.isUpload = false
    }
  }
}
</script>

<style scoped>
</style>
