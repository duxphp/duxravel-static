<template>
  <component
    v-if="!uninstall && pageType === 'vue' && currentUrl"
    :is="innerComp"
  ></component>
  <Create
    v-if="!uninstall && pageType === 'node' && currentUrl"
    v-bind="createData"
  ></Create>
</template>

<script>
import * as Vue from "vue";
import Create from "./Create";
import { getComp, getPage } from "../utils/router";

export default {
  name: "PageRoute",
  props: {
    currentUrl: {
      type: String,
      default: "",
    },
    windowType: {
      type: String,
      default: "page",
    },
  },
  components: {
    Create,
  },
  data() {
    return {
      // 返回的页面类型 node 和 vue
      pageType: "",
      // 当前选中的菜单
      // 节点创建页面
      createData: {
        node: [],
      },
      // 路由改变卸载页面
      uninstall: false,
    };
  },
  computed: {
    // 组件创建去刷新路由
    innerComp() {
      const currentUrl = this.currentUrl;
      return currentUrl
        ? Vue.defineAsyncComponent(() => getComp(this.vueTemplate))
        : "";
    },
  },
  created() {
    this.getPage(this.currentUrl);
  },
  watch: {
    currentUrl(url) {
      this.getPage(url);
    },
  },
  methods: {
    getPage(url) {
      if (this.pageStatus) {
        // 取消请求
        this.pageStatus.abort();
      }
      setTimeout(() => {
        this.pageStatus && this.$emit("load-status", { type: "start" });
      }, 100);
      this.pageStatus = getPage(url, this.windowType)
        .then(({ type, data }) => {
          this.pageType = type;
          this.uninstall = true;
          this.$nextTick(() => {
            if (type === "vue") {
              this.vueTemplate = data;
            } else {
              this.createData = data;
            }
            this.uninstall = false;
          });
          this.$emit("load-status", { type: "end" });
          this.pageStatus = null;
        })
        .catch(() => {
          this.pageStatus = null;
          this.$emit("load-status", { type: "error" });
        });
    },
  },
};
</script>
