<template>
  <div class="flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden">
    <div
      class="
        text-white
        w-16
        bg-gray-800
        px-2
        flex-none flex-col
        lg:flex
        hidden
        border-r border-gray-800
        dark:border-gray-700
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
      >
        <n-dropdown
          trigger="click"
          :options="avatarMenu"
          @select="avatarSelect"
          width="150"
          placement="bottom-start"
          :show-arrow="true"
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
        </n-dropdown>
      </div>

      <n-scrollbar
        class="flex-grow bg-gray-800"
      >
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
              dark:text-gray-300 dark:hover:text-gray-50
              hover:text-white hover:bg-gray-700
              relative
              mb-2
            "
            :class="{
              'bg-blue-600 hover:bg-blue-600 text-white':
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
      </n-scrollbar>

      <div class="flex-none">
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
            hover:text-white hover:bg-gray-700
            relative
            mb-2
          "
          @click="
            (darkMode = darkMode === 'dark' ? 'light' : 'dark'),
              $emit('switch-dark', darkMode)
          "
        >
          <span class="flex items-center justify-center">
            <svg
              v-if="darkMode === 'light'"
              class="fill-current text-gray-200"
              width="16"
              height="16"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" fill="white" fill-opacity="0.01" />
              <path
                d="M28.0527 4.41085C22.5828 5.83695 18.5455 10.8106 18.5455 16.7273C18.5455 23.7564 24.2436 29.4545 31.2727 29.4545C37.1894 29.4545 42.1631 25.4172 43.5891 19.9473C43.8585 21.256 44 22.6115 44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C25.3885 4 26.744 4.14149 28.0527 4.41085Z"
                fill="none"
                stroke="#eee"
                stroke-width="4"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-if="darkMode === 'dark'"
              class="fill-current text-gray-200"
              width="16"
              height="16"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" fill="white" fill-opacity="0.01" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M24 3V6.15V3Z"
                fill="#eee"
              />
              <path
                d="M24 3V6.15"
                stroke="#eee"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M38.8492 9.15076L36.6219 11.3781L38.8492 9.15076Z"
                fill="#eee"
              />
              <path
                d="M38.8492 9.15076L36.6219 11.3781"
                stroke="#eee"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M45 24H41.85H45Z"
                fill="#eee"
              />
              <path
                d="M45 24H41.85"
                stroke="#eee"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M38.8492 38.8492L36.6219 36.6219L38.8492 38.8492Z"
                fill="#eee"
              />
              <path
                d="M38.8492 38.8492L36.6219 36.6219"
                stroke="#eee"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M24 45V41.85V45Z"
                fill="#eee"
              />
              <path
                d="M24 45V41.85"
                stroke="#eee"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.15076 38.8492L11.3781 36.6219L9.15076 38.8492Z"
                fill="#eee"
              />
              <path
                d="M9.15076 38.8492L11.3781 36.6219"
                stroke="#eee"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3 24H6.15H3Z"
                fill="#eee"
              />
              <path
                d="M3 24H6.15"
                stroke="#eee"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.15076 9.15076L11.3781 11.3781L9.15076 9.15076Z"
                fill="#eee"
              />
              <path
                d="M9.15076 9.15076L11.3781 11.3781"
                stroke="#eee"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M24 36C30.6274 36 36 30.6274 36 24C36 17.3726 30.6274 12 24 12C17.3726 12 12 17.3726 12 24C12 30.6274 17.3726 36 24 36Z"
                fill="none"
                stroke="#eee"
                stroke-width="4"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      <div class="flex-none">
        <n-popover placement="right-end" trigger="click" :show-arrow="false">
          <template #trigger>
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
                hover:text-white hover:bg-gray-700
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
          </template>
          <div class="flex flex-row flex-wrap max-w-md gap-4 p-2">
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
                hover:bg-gray-100
                dark:hover:bg-gray-800
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
        </n-popover>
      </div>
    </div>

    <div class="lg:hidden h-14 z-10">
      <div
        class="
          fixed
          bg-white
          dark:bg-gray-900
          shadow
          w-full
          h-14
          flex
          items-center
          gap-2
        "
      >
        <div class="flex-none pl-4">
          <img class="w-6 h-6" :src="appInfo.logo || logo" />
        </div>
        <div class="flex-grow text-base">{{ appInfo.name }}</div>
        <div class="flex-none pr-2">
          <button
            type="button"
            @click="mobileMenuShow = true"
            class="
              bg-white
              rounded-md
              p-2
              inline-flex
              items-center
              justify-center
              text-gray-400
              hover:text-gray-500 hover:bg-gray-100
              focus:outline-none
              focus:ring-2
              focus:ring-inset
              focus:ring-indigo-500
            "
          >
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <n-drawer v-model:show="mobileMenuShow" :width="502" placement="top">
        <n-drawer-content title="斯通纳"> ... </n-drawer-content>
      </n-drawer>
    </div>
    <AppMenu :menu="menu[currentIndexs[0]]" :select="currentIndexs" />
    <div
      v-if="show"
      class="flex-grow bg-gray-100 dark:bg-gray-900 dark:text-gray-200"
      id="page-animation"
    >
      <PageContent :currentUrl="currentUrl" :windowType="'page'" />
    </div>
  </div>
  <a-button @click="test">test</a-button>
  <PageContent
    v-for="(item, index) in dialogRouter"
    :key="item.key"
    :currentUrl="item.url"
    :windowType="'dialog'"
    @close="closeDialog(index)"
  />
  <Login />
</template>

<script>
import {
  useMessage,
  useDialog,
  useLoadingBar,
  useNotification,
} from "naive-ui";
import {
  Message,
  Modal,
  Notification,
} from "@arco-design/web-vue";
import Login from "./Login.vue";
import PageContent from "./PageContent.vue";
import AppMenu from "./AppMenu.vue";
import FileManage from "./utils/FileManageExtend";
import { router } from "../utils/router";
import { getUrl, request } from "../utils/request";
import event from "../utils/event";
import { getLocalUserInfo, onUserLogin, clearUserInfo } from "../utils/user";
import logo from "../assets/images/logo.svg";

export default {
  name: "Page",
  props: ["show"],
  setup() {
    // 注册全局组件
    /*window.message = useMessage();
    window.dialog = useDialog();
    window.loadingBar = useLoadingBar();
    window.notification = useNotification();*/

    window.message = Message
    window.dialog = Modal
    window.notification = Notification
    window.fileManage = FileManage

    window.dialogAsync = {
      //destroyAll: window.dialog.destroyAll.bind(window.dialog),
      common(option, type) {
        if (window.dialog[type]) {
          return new Promise((resolve) => {
            window.dialog?.[type]({
              ...option,
              onClose() {
                resolve("close");
              },
              onNegativeClick() {
                resolve("cancel");
              },
              onPositiveClick() {
                resolve("ok");
              },
            });
          });
        } else {
          return Promise.reject(type + "API不存在");
        }
      },
      info(option) {
        return dialogAsync.common.call(dialogAsync, option, "info");
      },
      success(option) {
        return dialogAsync.common.call(dialogAsync, option, "success");
      },
      warning(option) {
        return dialogAsync.common.call(dialogAsync, option, "warning");
      },
    };
  },
  components: {
    Login,
    PageContent,
    AppMenu,
  },
  data() {
    return {
      logo: logo,
      avatarMenu: [
        {
          label: "返回首页",
          key: 0,
        },
        {
          label: "修改资料",
          key: 1,
        },
        {
          label: "退出登录",
          key: 2,
        },
      ],
      // 移动菜单
      mobileMenuShow: false,
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
    };
  },
  created() {
    // 监听路由改变
    event.add("router-change", ({ url, pathChange, agree }) => {
      if (pathChange || ["push", "replace"].includes(agree)) {
        this.currentUrl = url;
        this.menuHover();
      }
    });
    // 弹窗key
    let dialogKey = 0;
    // 弹出路由
    event.add("router-dialog", ({ url }) => {
      this.dialogRouter.push({
        key: dialogKey++,
        url,
      });
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
          router.indexPage = this.menu[0].url;
          if (!this.currentIndexs.length) {
            router.replace(router.indexPage);
          }
        });
        this.userInfo = getLocalUserInfo();
      } else {
        this.userInfo = {};
      }
    });
  },
  methods: {
    test() {
      window.FileManage({

        multiple: true
      })
    },
    avatarSelect(key) {
      switch (key) {
        case 2:
          clearUserInfo();
          window.location.replace(
            window.location.pathname.split("/")[0] || "/"
          );
          break;
        case 1:
          router.push(getUrl("/userInfo/page"));
          break;
        case 0:
        default:
          window.open("/");
          break;
      }
    },
    closeDialog(index) {
      const [item] = this.dialogRouter.splice(index, 1);
      event.emit("router-dialog-close", {
        item,
        index,
      });
    },
    // 菜单点击
    target(e) {
      router.push(e.url);
    },
    // 菜单选中项
    menuHover(menu = this.menu, indexs = []) {
      return menu.findIndex((item, index) => {
        if (item.menu && item.menu.length > 0) {
          if (~this.menuHover(item.menu, [...indexs, index])) {
            return true;
          }
        } else if (
          item.url &&
          this.currentUrl.split("?")[0].split("/").slice(0, 4).join("/") ===
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

