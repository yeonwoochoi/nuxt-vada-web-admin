<template>
  <a
    :href="link"
    download
    class="no-decoration-black-text font-weight-bold text--darken-1 grey--text"
    target="_blank"
  >
    <slot/>
  </a>
</template>

<script>
export default {
  name: "DownloadButton",
  props: {
    link: {
      type: String,
      default: () => ''
    },
  }
}
</script>

<style scoped>

</style>
