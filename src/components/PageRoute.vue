<template>
  <template v-if="!uninstall && !errorMessage && currentUrl">
    <component v-if="pageType === 'vue'" :is="innerComp"></component>
    <Create v-else v-bind="createData" />
  </template>
  <!-- <component :is="innerComp"></component> -->
  <ErrorPage v-if="errorMessage" :title="errorMessage" :code="errorCode" />
</template>

<script>
import { defineAsyncComponent } from "vue";
import Create from "./Create";
import ErrorPage from "./ErrorPage.vue";
import { getComp, getPage } from "../utils/router";
import event from "../utils/event";
import { getArr } from "./testdata";

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
    ErrorPage,
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
      // 页面错误消息
      errorMessage: "",
    };
  },
  computed: {
    // 组件创建去刷新路由
    innerComp() {
      return defineAsyncComponent(
        this.currentUrl ? () => getComp(this.vueTemplate) : ""
      );
    },
  },
  created() {
    this.getPage(this.currentUrl);
    event.add("router-change", this.routeChange);
  },
  beforeUnmount() {
    event.remove("router-change", this.routeChange);
  },
  watch: {
    currentUrl(url) {
      this.getPage(url);
    },
  },
  methods: {
    routeChange(data) {
      // 监听用于刷新页面
      if (
        data.url === this.currentUrl &&
        ["push", "replace"].includes(data.agree)
      ) {
        this.getPage(data.url);
      }
    },
    getPage(url) {
      if (this.pageStatus) {
        // 取消请求
        this.pageStatus.abort();
      }
      setTimeout(() => {
        this.pageStatus && this.$emit("load-status", { type: "start" });
      }, 100);
      this.vueTemplate = "";
      this.pageStatus = getPage(url, this.windowType);
      this.pageStatus
        .then(({ type, data }) => {
          this.errorMessage = "";
          this.uninstall = true;
          this.$nextTick(() => {
            this.pageType = type;
            this.uninstall = false;
            if (type === "vue") {
              this.vueTemplate = data;
            } else {
              this.createData = data;
            }
          });
          this.$emit("load-status", { type: "end" });
          this.pageStatus = null;
        })
        .catch((err) => {
          if (err.code !== 1) {
            this.errorCode = err.code;
            this.errorMessage = err.data?.message || err.message;
            this.$emit("load-status", { type: "error" });
            this.pageStatus = null;
          }
        });
    },
  },
};
</script>
