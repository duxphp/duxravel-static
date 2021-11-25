<template>
  <template v-if="!uninstall && !errorMessage && currentUrl">
    <component :is="vueComp" v-if="pageType === 'vue'"></component>
    <Create v-if="pageType === 'node'" v-bind="createData" />
  </template>
  <ErrorPage v-if="errorMessage" :title="errorMessage" :code="errorCode" />
</template>

<script>
import { defineAsyncComponent } from "vue";
import Create from "./Create";
import ErrorPage from "./ErrorPage.vue";
import { getComp, getPage, resource } from "../utils/router";
import event from "../utils/event";

import { Processor } from "windicss/lib";
import { HTMLParser } from "windicss/utils/parser";
import md5 from "md5";

const generateStyles = (html) => {
  // 获取 windi processor
  const processor = new Processor();

  // 解析所有的 classes 并将它们放到一行来简化操作
  const htmlClasses = new HTMLParser(html)
    .parseClasses()
    .map((i) => i.result)
    .join(" ");

  // 基于我们传入的 html 生成预检样式
  const preflightSheet = processor.preflight(html);

  // 将 html classes 处理为一个可解释的样式表
  const interpretedSheet = processor.interpret(htmlClasses).styleSheet;

  // 构建样式
  const APPEND = true;
  const MINIFY = true;
  const styles = interpretedSheet.extend(preflightSheet, APPEND).build(MINIFY);

  return styles;
};

const pageStyles = {};
const loadStyle = (style) => {
  const stylee = document.createElement("style");
  stylee.innerHTML = style;
  document.getElementsByTagName("head")[0].appendChild(stylee);
  const key = md5(style);
  pageStyles[key] = stylee;
  return key;
};
const unloadStyle = (key) => {
  console.log(key, pageStyles[key]);
  pageStyles[key]?.parentNode?.removeChild?.(pageStyles[key]);
};

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
      // html编写的页面
      htmlComp: "",
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
      if (url === "/") {
        return;
      }
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
          this.shadowRoot;
          if (type === "vue") {
            // 创建vue组件
            return getComp(data, this.currentUrl).then((res) => {
              this.vueComp = defineAsyncComponent({
                loader: () => Promise.resolve(res),
                suspensible: false,
              });
              setTimeout(() => {
                // 执行渲染成功回调
                res._didCallback();
              }, 100);
            });
          } else if (type === "html") {
            this.htmlComp = data;
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
            setTimeout(() => {
              const style = generateStyles(
                document.querySelector("#page-animation").innerHTML
              );
              this.oldStyleKey && unloadStyle(this.oldStyleKey);
              this.oldStyleKey = loadStyle(style);
            }, 20);

            this.$emit("load-status", { type: "end" });
          });
        })
        .catch((err) => {
          resource.uninstall(this.oldUrl);
          this.oldUrl = url;
          if (err.code !== 1) {
            this.errorCode = err.code;
            this.errorMessage = err.data?.error?.message || err.message;
            this.$emit("load-status", { type: "error" });
            this.pageStatus = null;
          }
        });
    },
  },
};
</script>
