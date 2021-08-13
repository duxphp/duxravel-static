<template>
  <template v-if="windowType === 'page'">
    <PageRoute
      :windowType="windowType"
      :currentUrl="url"
      @load-status="loadStatus"
    />
  </template>
  <n-modal
    v-else
    :show="dialogShow"
  >
    <n-card class="max-w-xl" content-style="padding: 0;">
      <PageRoute
        :windowType="windowType"
        :currentUrl="url"
        @load-status="loadStatus"
      />
    </n-card>
  </n-modal>

</template>

<script>
import PageRoute from "./PageRoute.vue";
import { router } from "../utils/router";
import { useMessage } from "naive-ui";

export default {
  name: "PageContent",
  props: {
    currentUrl: {
      type: String,
      default: "",
    },
    windowType: String,
  },
  components: {
    PageRoute,
  },
  data() {
    return {
      url: "",
      // 记录窗口里面的路由历史
      urls: [],
      // 弹出加载消息
      dialogMsg: null,
      dialogShow: false,
      message: useMessage(),
    };
  },
  watch: {
    currentUrl(url) {
      // 只有page页面才需要监听路由改变
      if (this.windowType === "page") {
        this.url = url;
      }
    },
  },
  mounted() {
    this.dialogShow = true
  },
  created() {
    this.url = this.currentUrl;
    this.urls.push(this.currentUrl);
  },
  methods: {
    closeWindow() {
      this.dialogShow = false;
      setTimeout(() => {
        this.$emit("close");
      }, 200);
    },
    changeRouter(url, type) {
      if (this.windowType === "page") {
        // 改变路由地址
        router[type](url);
      } else {
        if (type === "push") {
          this.urls.push(url);
          // 只改变当前路由地址
          this.url = url;
        } else if (type === "replace") {
          // 只改变当前路由地址
          this.url = url;
        } else if (type === "back") {
          const num = url | 0 || 1;
          if (num >= this.urls.length) {
            // 关闭窗口
            this.closeWindow();
          } else {
            // 回退页面
            this.urls.splice(this.urls.length - num);
            this.url = this.urls[this.urls.length - 1];
          }
        }
      }
    },
    closeLoading() {
      setTimeout(() => {
        this.dialogMsg.destroy();
        this.dialogMsg = null;
        setTimeout(() => {
          this.dialogShow = true;
        }, 200);
      }, 1000);
    },
    loadStatus({ type }) {
      console.log('dsad')
      if (type === "start") {
        this.windowType === "page" && window.loadingBar.start();
        if (this.windowType !== "page") {
          this.dialogMsg = this.message.loading("加载页面中，请稍等...");
        }
      } else if (type === "end") {
        this.windowType === "page"
          ? window.loadingBar.finish()
          : this.closeLoading();
      } else {
        if (this.urls.length === 1) {
          this.closeWindow();
        }
        this.windowType === "page"
          ? window.loadingBar.error()
          : this.closeLoading();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

