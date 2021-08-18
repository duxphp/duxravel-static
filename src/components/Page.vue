<template>
  <div class="flex h-screen overflow-hidden">
    <div class="text-white w-16 bg-gray-800 px-2 flex-none flex flex-col">
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

      <n-layout-content class="flex-grow bg-gray-800" :native-scrollbar="false">
        <div
          v-show="!item.hidden || currentIndexs[0] === index"
          v-for="(item, index) in menu"
          :key="item.app"
          @click="target(item)"
        >
          <n-tooltip
            v-if="item.app !== 'app'"
            trigger="hover"
            placement="right"
          >
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
                  text-gray-200
                  hover:text-white
                  hover:bg-gray-700
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
              </div>
            </template>
            <div>
              {{ item.name }}
            </div>
          </n-tooltip>
        </div>
      </n-layout-content>

      <div class="flex-none">
        <template v-for="item in menu" :key="item.app">
          <n-popover
            v-if="item.app === 'app'"
            :overlap="overlap"
            placement="right-end"
            trigger="click"
            :show-arrow="false"
          >
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
                  hover:text-white
                  hover:bg-gray-700
                  relative
                  mb-2
                "
              >
                <span
                  class="w-5 h-6 flex items-center justify-center"
                  v-if="item.icon"
                  v-html="item.icon"
                ></span>
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
                  p-2
                  transition
                "
                @click="target(item)"
              >
                <div
                  class="
                    w-10
                    h-10
                    border border-gray-300
                    p-2
                    rounded
                    flex
                    justify-center
                    items-center
                  "
                  v-if="item.icon"
                  v-html="item.icon"
                  @click="target(item)"
                ></div>
                <div class="truncate">{{ item.name }}</div>
              </div>
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
                  p-2
                  transition
                "
                v-for="(sub, index) in item.data"
                :key="index"
                @click="target(sub)"
              >
                <div
                  class="w-10 h-10 text-white p-2 rounded"
                  :style="{ 'background-color': sub.color || '#1e5eff' }"
                  v-if="sub.icon"
                  v-html="sub.icon"
                ></div>
                <div class="truncate">{{ sub.name }}</div>
              </div>
            </div>
          </n-popover>
        </template>
      </div>
    </div>
    <AppMenu :menu="menu[currentIndexs[0]]" :select="currentIndexs" />
    <div class="flex-grow bg-gray-100" id="page-animation">
      <PageContent :currentUrl="currentUrl" :windowType="'page'" />
    </div>
  </div>
  <PageContent
    v-for="(item, index) in dialogRouter"
    :key="item.key"
    :currentUrl="item.url"
    :windowType="'dialog'"
    @close="dialogRouter.splice(index, 1)"
  />
  <DataDialog />
  <FileManage />
  <Login />
</template>

<script>
import { useMessage, useDialog, useLoadingBar } from "naive-ui";
import Login from "./Login.vue";
import PageContent from "./PageContent.vue";
import AppMenu from "./AppMenu.vue";
import DataDialog from "./utils/Dialog";
import FileManage from "./utils/FileManage";
import { router } from "../utils/router";
import { getUrl, request } from "../utils/request";
import event from "../utils/event";
import { getLocalUserInfo, onUserLogin, clearUserInfo } from "../utils/user";
import logo from "../assets/images/logo.svg";

export default {
  name: "Page",
  setup() {
    // 注册全局组件
    window.message = useMessage();
    window.dialog = useDialog();
    window.loadingBar = useLoadingBar();
  },
  components: {
    Login,
    PageContent,
    AppMenu,
    DataDialog,
    FileManage,
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
          this.apps = res.list.filter((v) => v.hidden);
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

