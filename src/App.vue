<template>
  <a-config-provider :locale="zhCN">
    <div id="app" class="bg-gray-100 dark:bg-blackgray-1">
    <Page :show="show"/>
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
    return {
      show: true,
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
        background: 'transparent',
        foreColor: '#373d3f'
      },
      tooltip: {
        theme: 'light',
      },
      theme: {
          mode: 'light', 
          palette: 'palette1',
          
      }
    }

    event.add('switch-dark', (type) => {
      this.switchDark(type)
    })

    this.switchDark(localStorage.getItem("darkMode") === "dark" ? "dark" : "light")

    const config = window.appConfig
    // websocket 服务
    if (config.pusher && config.pusher.status) {
      
    }

  },
  methods: {
    switchDark(type) {
      localStorage.setItem("darkMode", type)
      this.show = false
      window.darkMode = type
      window.Apex.tooltip.theme = type
      window.Apex.theme.mode = type
      window.Apex.chart.foreColor = type === 'dark' ? '#f6f7f8' : '#373d3f'

      //console.log(window.Apex.theme.mode, type)
      if (type === 'dark') {
        document.body.classList.add('dark');
        document.body.setAttribute('arco-theme', 'dark')
      } else {
        document.body.classList.remove('dark');
        document.body.removeAttribute('arco-theme')
      }


      this.$nextTick(() => {
          this.show = true
      })

    }
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
