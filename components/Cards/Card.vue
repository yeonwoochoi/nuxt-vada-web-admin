<template>
  <v-card
    :width="width"
    :height="height"
    color="white"
    class="card-chart"
  >
    <div
      class="card-header"
      v-if="$slots.header || title"
      :class="headerClasses"
    >
      <slot name="header">
        <h4 class="card-title">{{ title }}</h4>
        <p class="card-category" v-if="subtitle">{{ subtitle }}</p>
      </slot>
      <v-divider />
    </div>
    <div class="card-body" v-if="$slots.default" :class="bodyClasses">
      <slot></slot>
    </div>
    <div class="card-image" v-if="$slots['image-bottom']">
      <slot name="image-bottom"></slot>
    </div>
    <slot name="raw-content"></slot>
    <div class="card-footer" :class="footerClasses" v-if="$slots.footer">
      <hr v-if="showFooterLine" />
      <slot name="footer"></slot>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "Card",
  props: {
    width: {
      type: [String, Number],
      default: () => 'fit-content'
    },
    height: {
      type: [String, Number],
      default: () => 'fit-content'
    },
    title: {
      type: String,
      default: () => ''
    },
    subtitle: {
      type: String,
      default: () => ''
    },
    showFooterLine: {
      type: Boolean,
      default: false
    },
    headerClasses: {
      type: [String, Object, Array],
      description: 'Card header css classes'
    },
    bodyClasses: {
      type: [String, Object, Array],
      description: 'Card body css classes'
    },
    footerClasses: {
      type: [String, Object, Array],
      description: 'Card footer css classes'
    }
  }
}
</script>

<style scoped>

</style>
