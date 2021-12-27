<template>
  <template v-if="windowType === 'page'">
    <PageRoute
        :windowType="windowType"
        :currentUrl="url"
        @load-status="loadStatus"
    />
  </template>

  <a-modal
      v-else-if="mode === 'modal'"
      :visible="dialogShow"
      modalClass="page-dialog max-w-2xl w-full"
      :closable="false"
      :mask="true"
      :footer="false"
      :alignCenter="false"
      :top="40"
      :open="dialogOpen"
  >
    <div ref="dialogAnimation" class="dialog-animation">
      <PageRoute
          :windowType="windowType"
          :currentUrl="url"
          @load-status="loadStatus"
      />
    </div>
  </a-modal>

  <a-drawer
      v-else
      :visible="dialogShow"
      class="page-drawer"
      :mask="true"
      :footer="false"
      :width="350"
      :open="dialogOpen"
      @cancel="() => {this.changeRouter('', 'back')}"
  >
    <div ref="dialogAnimation" class="dialog-animation">
      <PageRoute
          :windowType="windowType"
          :currentUrl="url"
          @load-status="loadStatus"
      />
    </div>
  </a-drawer>

</template>

<script>
import PageRoute from "./PageRoute.vue";
import {router} from "../utils/router";

export default {
  name: "PageContent",
  props: {
    currentUrl: {
      type: String,
      default: "",
    },
    windowType: String,
    mode: {
      type: String,
      default: "modal"
    },
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
    // this.dialogShow = true;
  },
  methods: {
    closeWindow() {
      if (this.dialogShow) {
        this.dialogShow = false;
        setTimeout(() => {
          this.$emit("close-dialog");
        }, 200);
      } else {
        this.$emit("close-dialog");
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
      this.dialogMsg?.close?.();
      this.dialogMsg = null;
    },
    loadStatus({type}) {
      if (this.windowType === "page") {
        if (type === "start") {
          window.NProgress.start();
        } else if (type === "end") {
          this.pageAnimation();
          window.NProgress.done();
        } else {
          this.pageAnimation();
          window.NProgress.done();
        }
      } else {
        if (type === "start") {
          this.dialogMsg = window.message.info("加载页面中，请稍等...");
        } else if (type === "end") {
          setTimeout(() => {
            this.dialogShow = true;
          }, 300)
          //this.dialogAnimation();
          this.closeLoading();
        } else {
          setTimeout(() => {
            this.dialogShow = true;
          }, 300)
          //this.dialogAnimation();
          this.closeLoading();
          if (this.urls.length === 1) {
            this.closeWindow();
          }
        }
      }
    },
    pageAnimation() {
      /**
       * 加载成功或者加载失败执行动画
       */
      const page = document.getElementById("page-animation");
      page.classList.add("an-start");

      setTimeout(() => {
        page.classList.remove("an-start");
      }, 5);
    },
    dialogAnimation() {
      /**
       * 加载成功或者加载失败执行动画
       */
      const page = this.$refs.dialogAnimation.$el;
      page.classList.add("an-start");

      setTimeout(() => {
        page.classList.remove("an-start");
      }, 5);
    },
    dialogOpen() {
      this.$nextTick(() => {
        const myEvent = new Event('resize')
        window.dispatchEvent(myEvent)
      })
    }
  },
};
</script>

<style>
.dialog-animation {
  transition: all 0.2s;
}

.dialog-animation.an-start {
  transition: all 0s;
  opacity: 0;
  transform: scale3d(0.4, 0.4, 1);
}

.page-dialog .arco-modal-body {
  padding: 0;
}

.page-drawer {

}

.page-drawer .arco-drawer-header {
  display: none;
}

.page-drawer .arco-drawer-body {
  padding: 0;
}
</style>

