<template>
  <v-card style="height: fit-content">
    <v-card-title class="text-h5" style="display: block">
      {{ title }}
      <v-divider class="mt-2 mb-1 px-2"/>
    </v-card-title>
    <v-card-text v-if="$slots.default">
      <slot/>
    </v-card-text>
    <v-card-text v-else>{{ comment }}</v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="green darken-1"
        text
        @click="onClickOkBtn"
        :disabled="!isActive"
      >
        확인
      </v-btn>
      <v-btn
        color="green darken-1"
        text
        @click="closeDialog"
      >
        취소
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ConfirmationDialog",
  props: {
    title: {
      type: String,
      default: () => ''
    },
    comment: {
      type: String,
      default: () => ''
    },
    isActive: {
      type: Boolean,
      default: () => true
    }
  },
  data: () => ({
    isClicked: false
  }),
  methods: {
    onClickOkBtn() {
      if (this.isClicked) return;
      this.isClicked = true;
      this.$emit("ok")
      this.closeDialog()
      this.isClicked = false;
    },
    closeDialog() {
      this.$emit("cancel")
    }
  }
}
</script>

<style scoped>

</style>
