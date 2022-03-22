<template>
  <p>{{idx}}</p>
</template>

<script>
export default {
  name: "InquiryDetail",
  asyncData({params, query}) {
    return {
      idx: params.id,
      pwd: query.pwd
    };
  },
  // 정수 값만 param으로 받음.
  validate({params}) {
    return /^\d+$/.test(params.id);
  },
}
</script>

<style scoped>

</style>
