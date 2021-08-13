<template>
  <div :class="className" :style="style" v-html="nodes"></div>
</template>

<script>
export default {
  data() {
    return {
      className: "",
    };
  },
  props: {
    class: String,
    style: String,
    nodes: String,
  },
  created() {
    this.className = this.class;
  }
};
</script>
