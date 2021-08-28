<template>
  <a @click="jump" class="cursor-pointer" :class="className" :style="style">
    <slot :jump="jump"></slot>
  </a>
</template>

<script>
import { request } from "../utils/request";
import { router } from "../utils/router";
import { getPageContent } from "./table/DataTable";
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
    title: String,
  },
  created() {
    this.className = this.class;
  },
  methods: {
    ajaxAction() {
      request({
        url: this.href,
        method: this.method,
        successMsg: true,
        urlType: 'absolute',
      }).then(res => {
        router('routerPush:')
      })
    },
    jump(e) {
      // 处理跳转
      if (this.type === "ajax") {
        if (this.title) {
          window.appDialog.confirm({
            title: '确认操作',
            content: this.title,
            success: this.ajaxAction.bind(this)
          });
        } else {
          this.ajaxAction();
        }
      } else if (this.type === "dialog") {
        // 弹出路由
        router.dialog(this.href);
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

