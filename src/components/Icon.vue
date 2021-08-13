<template>
  <i :class="className" :style="style"></i>
</template>

<script>
export default {
  data() {
    return {
      className: "",
    };
  },
  props: {
    name: String,
    class: String,
    style: String,
  },
  created() {
    this.className = `icon-${this.name} ${this.class || ""}`;
  },
};
</script>
