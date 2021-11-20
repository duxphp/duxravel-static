<template>
  <a-config-provider :locale="zhCN">
    <div :class="{ dark: darkMode === 'dark' }">
      <Page :show="show"  />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
import Page from "./components/Page.vue";

import event from './utils/event';

export default {
  name: "App",
  components: {
    Page,
  },
  data() {
    window.derkMode = localStorage.getItem("darkMode") === "dark" ? "dark" : "light";
    return {
      show: true,
      //themeApp: window.derkMode === "dark" ? themeDark : themeLight,
      //darkTheme: window.derkMode === "dark" ? darkTheme : null,
      darkMode: window.derkMode,
      zhCN,
    };
  },
  created() {
    // 注册图表
    window.Apex = {
      chart: {
        locales: [
          {
            name: "zh-CN",
            options: {
              months: [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月",
              ],
              shortMonths: [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月",
              ],
              days: [
                "星期日",
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五",
                "星期六",
              ],
              shortDays: [
                "周日",
                "周一",
                "周二",
                "周三",
                "周四",
                "周五",
                "周六",
              ],
              toolbar: {
                exportToSVG: "下载 SVG",
                exportToPNG: "下载 PNG",
                exportToCSV: "下载 CSV",
                menu: "菜单",
                selection: "选择",
                selectionZoom: "选择大小",
                zoomIn: "放大",
                zoomOut: "缩小",
                pan: "移动",
                reset: "重置",
              },
            },
          },
        ],
        fontFamily: "inherit",
        defaultLocale: "zh-CN",
      },
      tooltip: {
        theme: window.derkMode === "dark" ? "dark" : "light",
      },
      colors: ["#005dff", "#b1cdec", "#00d586"],
    }

    event.add('switch-dark', (type) => {
      localStorage.setItem("darkMode", type);
      this.show = false
      window.Apex.tooltip.theme = type;
      window.derkMode = type;
      this.darkMode = type;
      this.$nextTick(() => {
        this.show = true
      })
    })
  },
  methods: {
  },
};
</script>

<style>
#app {
  height: 100%;
}
* {
  padding: 0;
  margin: 0;
}
div,
input,
textarea {
  box-sizing: border-box;
}
</style>
