<template>
  <n-config-provider
    :theme-overrides="theme"
    :locale="zhCN"
    :date-locale="dateZhCN"
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
import theme from "./config/theme";

export default {
  name: "App",
  components: {
    Index,
  },
  data() {
    return {
      zhCN,
      dateZhCN,
      theme,
    };
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
