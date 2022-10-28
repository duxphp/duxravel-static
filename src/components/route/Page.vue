<template>
  <div class="flex flex-row h-screen overflow-hidden">
    <div
      class="
        text-white
        w-16
        bg-gray-800
        dark:bg-blackgray-4
        px-1.5
        flex-none flex-col flex
        border-r border-gray-800
        dark:border-blackgray-5
      "
    >
      <div
        class="
          flex-none
          cursor-pointer
          flex flex-col
          items-center
          justify-center
          mb-4
        "
        @click="menuShow = !menuShow"
      >
        <div
          class="
            rounded-full
            h-8
            w-8
            flex
            items-center
            justify-center
            bg-white
            mt-5
          "
        >
          <img class="w-6 h-6" :src="appInfo.logo || logo" />
        </div>
      </div>

      <c-scrollbar class="flex-grow" trigger="hover">
        <div
          v-show="!item.hidden || currentIndexs[0] === index"
          v-for="(item, index) in menu"
          :key="item.app"
          @click="target(item)"
        >
          <div
            class="
              cursor-pointer
              rounded-sm
              py-1
              text-center
              flex flex-col
              items-center
              justify-center
              gap-1
              text-gray-200
              hover:bg-gray-700 hover:text-white
              dark:hover:text-gray-50 dark:hover:bg-blackgray-1
              relative
              mb-2
            "
            :class="{
              '!bg-blue-600 !hover:bg-blue-600 !text-white':
                currentIndexs[0] === index,
            }"
          >
            <span
              class="w-5 h-6 flex items-center justify-center"
              v-if="item.icon"
              v-html="item.icon"
            ></span>
            <div class="text-xs">{{ item.name }}</div>
          </div>
        </div>
      </c-scrollbar>

      <div class="flex-none">
        <a-trigger position="rb" trigger="click" :show-arrow="false">
          <div
            class="
              cursor-pointer
              rounded-sm
              py-1.5
              text-center
              flex
              items-center
              justify-center
              gap-1
              text-gray-200
              hover:bg-gray-700
              dark:hover:text-gray-50
              hover:text-white
              dark:hover:bg-blackgray-1
              relative
              mb-2
            "
          >
            <span class="w-5 h-6 flex items-center justify-center">
              <svg
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
              >
                <path
                  d="M174.5 463.397h295.714V184.125c0-54.766-43.763-104.093-104.093-104.093H174.5c-60.206 0-104.093 49.327-104.093 104.093v180.742c0.123 54.643 43.887 98.53 104.093 98.53z"
                  fill="#F36A5A"
                  p-id="10025"
                ></path>
                <path
                  d="M952.852 364.744V184.125c0-54.766-43.764-104.093-104.094-104.093h-191.62c-54.767 0-104.094 43.764-104.094 104.093v284.712h295.714c60.33-5.44 104.094-49.327 104.094-104.093z"
                  fill="#F1C40F"
                  p-id="10026"
                ></path>
                <path
                  d="M656.52 934.29h197.183c54.767 0 98.53-43.763 98.53-104.093V649.579c0-54.767-43.763-104.094-104.093-104.094H552.426v284.712c0 54.89 43.764 104.093 104.093 104.093z"
                  fill="#45BE89"
                  p-id="10027"
                ></path>
                <path
                  d="M174.5 934.29h191.62c54.767 0 104.094-43.763 104.094-104.093V550.925H174.5c-54.766 0-104.093 43.764-104.093 104.093V835.76c0.123 49.327 43.887 98.53 104.093 98.53z"
                  fill="#5491DE"
                  p-id="10028"
                ></path>
              </svg>
            </span>
          </div>
          <template #content>
            <div
              class="
                flex flex-row flex-wrap
                max-w-md
                gap-4
                p-2
                bg-white
                border-gray-100
                dark:bg-blackgray-3
                rounded
                shadow
                border
                dark:border-blackgray-4
              "
            >
              <div
                class="
                  flex flex-col
                  gap-2
                  overflow-hidden
                  items-center
                  justify-center
                  cursor-pointer
                  relative
                  rounded
                  text-gray-700
                  hover:bg-gray-100
                  dark:text-gray-200
                  dark:hover:text-gray-50
                  dark:hover:text-white
                  dark:hover:bg-blackgray-1
                  p-2
                  transition
                "
                v-for="(app, index) in apps"
                :key="index"
                @click="target(app)"
              >
                <div
                  class="w-10 h-10 text-white p-2 rounded"
                  :style="{ 'background-color': app.color || '#1e5eff' }"
                  v-if="app.icon"
                  v-html="app.icon"
                ></div>
                <div class="truncate">{{ app.name }}</div>
              </div>
            </div>
          </template>
        </a-trigger>
      </div>
    </div>

    <AppMenu
      :menu="menuShow ? menu[currentIndexs[0]] : { name: '隐藏' }"
      :select="currentIndexs"
    />
    <div v-if="show" class="flex-grow dark:text-gray-200" id="page-animation">
      <PageContent :currentUrl="currentUrl" :windowType="'page'" />
    </div>
  </div>
  <PageContent
    v-for="(item, index) in dialogRouter"
    :key="item.key"
    :currentUrl="item.url"
    :windowType="'dialog'"
    :mode="item.mode"
    :className="item.className"
    @close-dialog="closeDialog(index)"
  />
  <Download />
  <ImagePreview />
  <Login />
</template>

<script>
import { Message, Modal, Notification } from "@arco-design/web-vue";
import Login from "./Login.vue";
import PageContent from "./PageContent.vue";
import AppMenu from "./AppMenu.vue";
import Download from "../common/Download.vue";
import { ImagePreview } from "../common/ImagePreview.jsx";
import FileManage from "../utils/FileManageExtend";
import AppDialog from "../utils/DialogExtend";
import AppDialogTable from "../utils/DialogTableExtend";
import { router, resource, isModuleIndex } from "../../utils/router";
import { request } from "../../utils/request";
import { event, menuNavigation } from "../../utils/event";
import { getLocalUserInfo, onUserLogin } from "../../utils/user";
import logo from "../../assets/images/logo.svg";

export default {
  name: "Page",
  props: ["show"],
  setup() {
    // 注册全局组件
    window.message = Message;
    window.dialog = Modal;
    window.notification = Notification;
    window.fileManage = FileManage;
    window.appDialog = AppDialog;
    window.appDialogTable = AppDialogTable;
  },
  components: {
    Login,
    PageContent,
    AppMenu,
    Download,
    ImagePreview,
  },
  mounted() {},
  data() {
    return {
      logo: logo,
      // 左侧菜单
      menu: [],
      // app
      apps: [],
      // 当前路由
      currentUrl: location.pathname + location.search,
      // 弹出路由合集
      dialogRouter: [],
      // 当前选中的菜单
      currentIndexs: [],
      // 站点信息
      appInfo: window.appConfig,
      // 用户信息
      userInfo: {},
      // 颜色模式
      darkMode: localStorage.getItem("darkMode") === "dark" ? "dark" : "light",
      // 菜单显示开关
      menuShow: true,
    };
  },

  watch: {
    currentIndexs(newval) {
      const getSelect = (select = newval, menu = this.menu, res = []) => {
        const item = menu[select[0]];
        if (!item) {
          return res;
        }
        res.push({ name: item.title || item.name, url: item.url });
        if (item.menu?.length) {
          getSelect(select.slice(1), item.menu, res);
        }
        return res;
      };
      menuNavigation.emit(getSelect());
    },
  },
  created() {
    // 监听路由改变
    event.add("router-change", ({ url, pathChange, agree }) => {
      if (pathChange || ["push", "replace", "popstate"].includes(agree)) {
        this.currentUrl = url;
        this.menuHover();
      }
    });
    // 弹窗key
    let dialogKey = 0;
    // 弹出路由
    event.add("router-dialog", ({ url, mode, className }) => {
      this.dialogRouter.push({
        key: dialogKey++,
        url,
        mode,
        className,
      });
    });

    // 通过request返回值控制选中菜单
    event.add("request-menu-select", (url) => {
      this.menuHover(void 0, void 0, url);
    });

    // 重新加载组件
    onUserLogin((status) => {
      if (status) {
        // 菜单
        request({
          url: "menu",
        }).then((res) => {
          this.menu = res.list;
          this.apps = res.apps;
          this.menuHover();
          // 跳转到第一个菜单
          if (this.menu[0].url) {
            router.indexPage = this.menu[0].url;
          } else {
            router.indexPage = this.menu[0].menu[0].menu[0].url;
          }
          if (!this.currentIndexs.length && isModuleIndex(this.currentUrl)) {
            router.replace(router.indexPage);
          }
          // 通知加载
          this.$nextTick(() => {
            this.startNotify();
          });
          if (res.static) {
            resource.pageLoad(res.static, "app-global-static");
          }
        });
        this.userInfo = getLocalUserInfo();
      } else {
        this.userInfo = {};
      }
    });

    // 已读操作
    event.add("app-notify-read", () => {
      this.readNotify();
    });

    // 删除操作
    event.add("app-notify-del", () => {
      this.delNotify();
    });
  },
  methods: {
    // 消息通知
    startNotify() {
      this.getNotify();
      setTimeout(() => {
        this.startNotify();
      }, 60 * 1000);
    },
    getNotify() {
      request({
        url: "notification",
      }).then((res) => {
        window.dataNotify = {
          list: res.list,
          num: res.num,
        };
        event.emit("app-notify");
      });
    },
    readNotify() {
      if (window.dataNotify) {
        window.dataNotify.list = window.dataNotify.list.map((item) => {
          item.read = 1;
          return item;
        });
        window.dataNotify.num = 0;
      }
      event.emit("app-notify");
      request({
        url: "notification/read",
      });
    },
    delNotify() {
      window.dataNotify = {
        list: [],
        num: 0,
      };
      event.emit("app-notify");
      request({
        url: "notification/del",
      });
    },

    // 关闭路由弹窗
    closeDialog(index) {
      const [item] = this.dialogRouter.splice(index, 1);
      event.emit("router-dialog-close", {
        item,
        index,
      });
    },
    // 菜单点击
    target(e) {
      router.push(e.url || e.menu[0].menu[0].url);
    },
    // 菜单选中项
    menuHover(menu = this.menu, indexs = [], url = this.currentUrl) {
      return menu.findIndex((item, index) => {
        if (item.menu && item.menu.length > 0) {
          if (~this.menuHover(item.menu, [...indexs, index], url)) {
            return true;
          }
        } else if (
          item.url &&
          url.split("?")[0].split("/").slice(0, 4).join("/") ===
            item.url.split("?")[0].split("/").slice(0, 4).join("/")
        ) {
          indexs.push(index);
          this.currentIndexs = indexs;
          return true;
        }
      });
    },
  },
};
</script>

<style>
#page-animation {
  transform: translate3D(0, 0, 0);
  opacity: 1;
  transition: all 0.3s;
}

#page-animation.an-start {
  transform: translate3D(0, 100px, 0);
  opacity: 0;
  transition: all 0s;
}
</style>

