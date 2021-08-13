<template>
  <n-layout-content
    v-if="menu.route"
    class="border-r border-gray-200 flex-none"
    :native-scrollbar="false"
  >
    <PageRoute :currentUrl="routeUrl()" />
  </n-layout-content>
  <n-layout-content
    v-else-if="menu.menu"
    class="
      flex-none
      w-40
      bg-white
      border-gray-200
      border-solid
      border-r
      shadow-sm
      z-10
    "
    :native-scrollbar="false"
  >
    <div class="p-4 py-3 ">
      {{ menu.name }}
    </div>
    <div class="px-2" v-for="(child, index1) in menu.menu" :key="child.name">
      <span class="text-xs text-gray-400 py-3 px-2 block">{{
        child.name
      }}</span>
      <template v-if="child.menu">
        <div
          class="
            text-gray-800
            hover:text-blue-600
            block
            p-2
            rounded
            truncate
            cursor-pointer
          "
          v-for="(child2, index2) in child.menu"
          :key="child2.name"
          :class="{
            'bg-blue-50 text-blue-600':
              select[1] === index1 && select[2] === index2,
          }"
          @click="target(child2)"
        >
          {{ child2.name }}
        </div>
      </template>
    </div>
  </n-layout-content>
  <template v-else></template>
</template>

<script>
import PageRoute from "./PageRoute.vue";
import { router } from "../utils/router";

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
  components: {
    PageRoute,
  },
  created() {},
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

