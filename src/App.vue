<template>
  <n-config-provider
    :theme="darkTheme"
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides="themeApp"
  >
    <n-global-style />
    <n-message-provider>
      <n-dialog-provider>
        <n-loading-bar-provider>
          <n-notification-provider>
            <Index />
          </n-notification-provider>
        </n-loading-bar-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script>
import { zhCN, dateZhCN } from "naive-ui";
import Index from "./page/Index.vue";
import { darkTheme } from "naive-ui";
import themeLight from "./config/themeLight";
import themeDark from "./config/themeDark";

export default {
  name: "App",
  components: {
    Index,
  },
  data() {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return {
      zhCN,
      dateZhCN,
      themeApp: dark ? themeDark : themeLight,
      darkTheme: dark ? darkTheme : null,
    };
  },
  created() {
    console.log(this.themeApp);
    let listeners = {
      dark: (mediaQueryList) => {
        if (mediaQueryList.matches) {
          this.themeApp = themeDark;
          this.darkTheme = darkTheme;
        }
      },
      light: (mediaQueryList) => {
        if (mediaQueryList.matches) {
          this.themeApp = themeLight;
          this.darkTheme = null;
        }
      },
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addListener(listeners.dark);
    window
      .matchMedia("(prefers-color-scheme: light)")
      .addListener(listeners.light);
  },
  method: {
    modelDialog() {},
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
