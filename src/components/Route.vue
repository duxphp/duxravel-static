<template>
  <a
    @click="jump"
    class="cursor-pointer"
    :class="className"
    :style="style"
    href="#"
  >
    <slot :jump="jump"></slot>
  </a>
</template>

<script>
import { request } from "../utils/request";
import { router, getPageContent } from "../utils/router";

export default {
  name: "Route",
  data() {
    return {
      className: "",
    };
  },
  props: {
    class: String,
    href: String,
    style: String,
    type: {
      type: String,
      default: "push",
    },
    method: {
      type: String,
      default: "GET",
    },
    mode: {
      type: String,
      default: "modal",
    },
    title: String,
    before: Function,
    after: Function,
  },
  created() {
    this.className = this.class;
  },
  methods: {
    ajaxAction() {
      this.before && this.before();
      request({
        url: this.href,
        method: this.method,
        successMsg: true,
        urlType: "absolute",
      })
        .then((res) => {
          this.after && this.after(res);
        })
        .catch((err) => {
          this.after && this.after(err);
        });
    },
    jump(e) {
      // 处理跳转
      if (this.type === "ajax") {
        if (this.title) {
          window.dialog.info({
            title: "确认操作",
            content: this.title,
            hideCancel: false,
            onOk: () => {
              this.ajaxAction();
            },
          });
        } else {
          this.ajaxAction();
        }
      } else if (this.type === "dialog") {
        // 弹出路由
        this.before && this.before();
        router.dialog(this.href, this.mode);
        setTimeout(() => {
          this.after && this.after();
        }, 1000);
      } else if (["replace", "back", "push"].includes(this.type)) {
        const page = getPageContent(this.$parent);
        if (page) {
          page.changeRouter(this.href, this.type);
        } else {
          router[this.type](this.href);
        }
      }
      e?.preventDefault();
      this.$emit("click", e);
    },
  },
};
</script>

