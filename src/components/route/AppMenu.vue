<template>
  <div
    class="
      menu-child-root
      hide
      lg:block
      border-r border-white
      dark:bg-blackgray-4 dark:border-blackgray-5
    "
    :class="menuData.menu ? 'w-40 bg-white shadow z-20 ' : ''"
  >
    <c-scrollbar trigger="hover" direction="y">
      <template v-if="menuData.menu">
        <div class="p-4 py-3 dark:text-gray-400">
          {{ menuData.name }}
        </div>
        <div
          class="px-2"
          v-for="(child, index1) in menuData.menu"
          :key="child.name"
        >
          <span
            class="text-xs text-gray-400 dark:text-gray-500 py-3 px-2 block"
            >{{ child.name }}</span
          >
          <template v-if="child.menu">
            <div
              class="
                text-gray-800
                dark:text-gray-400
                hover:text-blue-600
                dark:hover:text-gray-300
                block
                p-2.5
                rounded
                truncate
                cursor-pointer
              "
              v-for="(child2, index2) in child.menu"
              :key="child2.name"
              :class="{
                'bg-blue-50 text-blue-600 dark:bg-blackgray-1 dark:text-gray-400':
                  select[1] === index1 && select[2] === index2,
              }"
              @click="target(child2)"
            >
              {{ child2.name }}
            </div>
          </template>
        </div>
      </template>
    </c-scrollbar>
  </div>
</template>

<script>
import { router } from "../../utils/router";

export default {
  name: "AppMenu",
  props: {
    menu: {
      type: Object,
      default: () => ({}),
    },
    select: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      menuData: {},
    };
  },
  watch: {
    menu(data, old) {
      if (data.name === old?.name) {
        return;
      }
      const page = document.querySelector(".menu-child-root");
      if (page) {
        const lastMenu = old.menu ? "menu" : "empty";
        const currentMenu = data.menu ? "menu" : "empty";
        if (lastMenu === "empty" && currentMenu === "menu") {
          // 显示菜单
          this.menuData = data;
          setTimeout(() => {
            page.classList.remove("hide");
          }, 50);
        } else if (lastMenu !== "empty" && currentMenu !== "menu") {
          // 隐藏菜单
          page.classList.add("hide");
          setTimeout(() => {
            this.menuData = data;
          }, 200);
        } else {
          this.menuData = data;
          // 维持不变
          page.classList.add("an-start");
          setTimeout(() => {
            page.classList.remove("an-start");
          }, 5);
        }
      }
    },
  },
  methods: {
    // 菜单点击
    target(e) {
      e.app !== "app" && router.push(e.url);
    },
    routeUrl() {
      return this.menu.route + window.location.search;
    },
  },
};
</script>

<style>
.menu-child-root {
  transform: translate3D(0, 0, 0);
  opacity: 1;
  transition: all 0.2s;
  flex: none;
}

.menu-child-root.an-start {
  transform: translate3D(10px, 0, 0);
  opacity: 0;
  transition: all 0s;
}

.menu-child-root.hide {
  opacity: 0;
  width: 0;
}
</style>