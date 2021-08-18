<template>
  <template v-if="windowType === 'page'">
    <PageRoute
      :windowType="windowType"
      :currentUrl="url"
      @load-status="loadStatus"
    />
  </template>
  <n-modal v-else display-directive="show" :show="dialogShow">
    <n-card class="max-w-2xl my-4" content-style="padding: 0;">
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
  created() {
    this.url = this.currentUrl;
    this.urls.push(this.currentUrl);
  },
  mounted() {
    this.dialogShow = true;
  },
  methods: {
    closeWindow() {
      if (this.dialogShow) {
        this.dialogShow = false;
        setTimeout(() => {
          this.$emit("close");
        }, 200);
      } else {
        this.$emit("close");
      }
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
      this.dialogMsg?.destroy?.();
      this.dialogMsg = null;
    },
    loadStatus({ type }) {
      if (this.windowType === "page") {
        if (type === "start") {
          window.loadingBar.start();
        } else if (type === "end") {
          this.animation();
          window.loadingBar.finish();
        } else {
          this.animation();
          window.loadingBar.error();
        }
      } else {
        if (type === "start") {
          this.dialogMsg = window.message.loading("加载页面中，请稍等...");
        } else if (type === "end") {
          this.closeLoading();
        } else {
          if (this.urls.length === 1) {
            this.closeWindow();
          }
          this.closeLoading();
        }
      }
    },
    animation() {
      /**
       * 加载成功或者加载失败执行动画
       */
      const page = document.getElementById("page-animation");
      page.classList.add("an-start");

      setTimeout(() => {
        page.classList.remove("an-start");
      }, 5);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

