<template>
  <template v-if="!uninstall && !errorMessage && currentUrl">
    <component v-if="pageType === 'vue'" :is="vueComp"></component>
    <Create v-else v-bind="createData" />
  </template>
  <ErrorPage v-if="errorMessage" :title="errorMessage" :code="errorCode" />
</template>

<script>
import { defineAsyncComponent } from "vue";
import Create from "./Create";
import ErrorPage from "./ErrorPage.vue";
import { getComp, getPage, resource } from "../utils/router";
import event from "../utils/event";

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
      // 节点创建页面
      createData: {
        node: [],
      },
      // 自定义组件名称
      vueComp: "",
      // 路由改变卸载页面
      uninstall: false,
      // 页面错误消息
      errorMessage: "",
    };
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
      this.pageStatus = getPage(url, this.windowType);
      this.pageStatus
        .then(({ type, data }) => {
          this.errorMessage = "";
          this.pageType = type;
          this.pageStatus = null;
          this.vueComp = "";
          if (type === "vue") {
            // 创建vue组件
            return getComp(data, this.currentUrl).then((res) => {
              this.vueComp = defineAsyncComponent({
                loader: () => Promise.resolve(res),
                suspensible: false,
              });
            });
          } else {
            this.uninstall = true;
            // 创建json组件
            this.createData = data;
          }
        })
        .then(() => {
          this.$nextTick(() => {
            this.uninstall = false;
          });
          // 卸载数据
          resource.uninstall(this.oldUrl);
          this.oldUrl = url;
          this.$nextTick(() => {
            this.$emit("load-status", { type: "end" });
          });
        })
        .catch((err) => {
          resource.uninstall(this.oldUrl);
          this.oldUrl = url;
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
