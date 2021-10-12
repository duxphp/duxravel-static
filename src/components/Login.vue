<template>
  <div v-if="data.show" class="absolute inset-0" style="z-index: 9999">
    <div
      class="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-50
        dark:bg-gray-900
        py-12
        px-4
        sm:px-6
        lg:px-8
      "
    >
      <div class="max-w-md w-full space-y-8">
        <div>
          <div class="mx-auto h-16 w-16 text-blue-900">
            <img class="w-16 h-16" :src="appInfo.logo || data.logo" />
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300">
            {{ appInfo.name }}
          </h2>
          <p class="mt-2 text-center text-sm ">
            <span class="text-blue-900  dark:text-gray-500"> 欢迎使用后台管理系统 </span>
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit="login">
          <input type="hidden" name="remember" value="true" />
          <div class="rounded-md flex flex-col gap-2">
            <div>
              <n-input
                type="input"
                size="large"
                placeholder="用户名"
                @update:value="input('username', $event)"
              />
            </div>
            <div>
              <n-input
                type="password"
                size="large"
                placeholder="密码"
                @update:value="input('password', $event)"
              />
            </div>
          </div>

          <div>
            <n-button
              attr-type="submit"
              type="primary"
              size="large"
              :loading="data.status"
              class="w-full"
              >登录</n-button
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { request } from "../utils/request";
import event from "../utils/event";
import { isLogin, setLocalUserInfo } from "../utils/user";
import logo from "../assets/images/logo.svg";


export default {
  setup() {

    const data = ref({
      logo: logo,
      post: {},
      show: !isLogin(),
      status: false,
    });
    event.add("open-login", () => {
      if (!data.value.show) {
        data.value.show = true;
        window.message.error("你已退出登录，请登录");
      }
    });
    return {
      data,
      appInfo: window.appConfig,
      input(key, value) {
        data.value.post[key] = value;
      },
      handleCheckedChange(checked) {
        data.value.post.remember = checked ? 1 : 0;
      },
      login(e) {
        e.preventDefault();
        if (data.value.status) {
          return;
        }
        data.value.status = true;
        request({
          url: "login",
          data: data.value.post,
          method: "POST",
        })
          .then((res) => {
            setLocalUserInfo({ ...res.userInfo, token: res.token });
            event.emit("login-success");
            data.value.show = false;
          })
          .finally(() => {
            data.value.status = false;
          });
        return false;
      },
    };
  },
};
</script>
