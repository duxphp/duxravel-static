<template>
  <div
    v-if="data.show && !data.loading"
    class="
      absolute
      inset-0
      bg-cover bg-center
      overflow-y-auto
      bg-blackgray-3 bg-gradient-to-r
      from-pinkpurple-300
      to-arcoblue-300
    "
    style="z-index: 100"
    :style="
      config.background
        ? { backgroundImage: 'url(' + config.background + ')' }
        : ''
    "
  >
    <div class="max-w-7xl mx-auto px-4 md:h-screen md:flex md:flex-col">
      <div
        class="
          flex-none
          md:flex
          py-4
          text-gray-100
          dark:text-gray-200
          items-center
        "
      >
        <div
          class="
            flex-grow flex
            gap-4
            items-center
            justify-center
            md:justify-start
            my-4
            md:my-0
          "
        >
          <div class="">
            <img :src="config.logo" class="h-12" />
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-2xl">{{ config.title }}</div>
            <div v-if="config.desc" class="opacity-50">
              {{ config.desc }}
            </div>
          </div>
        </div>
        <div
          class="flex-none hidden md:flex items-center gap-4 text-right"
          v-if="nowDate"
        >
          <div class="flex flex-col gap-1 flex-grow">
            <div>{{ nowDate }}</div>
            <div v-if="weatherData.city">
              {{ weatherData.city }} {{ weatherData.weather }}
              {{ weatherData.temperature }}°
            </div>
          </div>
          <div class="flex-none text-4xl">
            {{ nowTime }}
          </div>
        </div>
      </div>

      <div class="flex-grow md:flex items-center justify-center">
        <div
          class="
            max-w-4xl
            w-full
            flex flex-col
            md:flex-row
            bg-white
            dark:bg-blackgray-5
            shadow
            rounded
          "
        >
          <div class="md:w-1/2 bg-white hidden md:block rounded-l">
            <a-carousel
              class="w-full h-full"
              :auto-play="true"
              indicator-type="dot"
              show-arrow="hover"
            >
              <a-carousel-item v-for="image in config.side">
                <img
                  :src="image"
                  :style="{
                    width: '100%',
                    height: '100%',
                  }"
                />
              </a-carousel-item>
            </a-carousel>
          </div>
          <div
            class="md:w-1/2 flex flex-col justify-center items-center p-4 pt-0"
            style="
              height: 600px;
              background-repeat: repeat-x;
              background-position: center bottom;
            "
            :style="{ backgroundImage: 'url(' + config.foot + ')' }"
          >
            <div class="flex-grow flex flex-col max-w-xs w-full">
              <div class="text-center mt-20 mb-10">
                <div class="text-blue-600 text-2xl">{{ config.name }}</div>
              </div>

              <form class="flex flex-col gap-6" @submit="login">
                <component v-if="!!data.vueComp" :is="data.vueComp"></component>
                <template v-else>
                  <input type="hidden" name="remember" value="true" />
                  <div>
                    <a-input
                      placeholder="请输入登录账号"
                      size="large"
                      :readonly="readonly"
                      @update:modelValue="input('username', $event)"
                    >
                      <template #prefix>
                        <icon-user />
                      </template>
                    </a-input>
                  </div>
                  <div>
                    <a-input-password
                      placeholder="请输入登录密码"
                      size="large"
                      :readonly="readonly"
                      @update:modelValue="input('password', $event)"
                    >
                      <template #prefix>
                        <icon-lock />
                      </template>
                    </a-input-password>
                  </div>
                  <div>
                    <a-button
                      html-type="submit"
                      type="primary"
                      size="large"
                      :loading="data.status"
                      long
                    >
                      {{ data.register ? "注册登录" : "登录" }}
                    </a-button>
                    <div
                      v-if="data.register"
                      class="text-center text-gray-600 mt-2"
                    >
                      首次登录将使用账号密码进行注册
                    </div>
                  </div>
                </template>
              </form>
            </div>

            <div
              class="
                flex-none
                text-center
                dark:text-white dark:opacity-30
                text-gray-400
              "
            >
              {{ config.contact }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineAsyncComponent } from "vue";
import { request } from "../utils/request";
import event from "../utils/event";
import { isLogin, setLocalUserInfo } from "../utils/user";
import logo from "../assets/images/logo.svg";
import loginFoot from "../assets/images/login-foot.png";
import loginSode from "../assets/images/login-side.png";
import { weather } from "../utils/util";
import { getComp } from "../utils/router";

export default {
  mounted() {
    this.currentTime();
    this.$nextTick(() => {
      setTimeout(() => {
        this.readonly = false;
      }, 500);
    });
  },
  setup() {
    const data = ref({
      logo: logo,
      post: {},
      show: !isLogin(),
      register: false,
      status: false,
      loading: true,
      vueComp: "",
    });
    !isLogin() && message.loading('请稍后')
    request({
      url: "login/check",
      method: "GET",
    }).then((res) => {
      data.value.register = !!res.register;
      if (res.page) {
        getComp(res.page, "loginPage").then((res) => {
          data.value.vueComp = defineAsyncComponent({
            loader: () => Promise.resolve(res),
            suspensible: false,
          });
          data.value.loading = false;
          setTimeout(() => {
            // 执行渲染成功回调
            res._didCallback();
          }, 100);
          message.clear()
        });
      }
    });

    event.add("open-login", () => {
      if (!data.value.show) {
        data.value.show = true;
        window.message.error("登录已失效，请进行登录");
      }
    });

    const nowDate = ref("");
    const nowTime = ref("");
    const weatherData = ref({});

    weather((res) => {
      weatherData.value = res;
    });

    return {
      data,
      nowDate,
      nowTime,
      config: {
        logo: window.appConfig.login.logo || logo,
        background: window.appConfig.login.background,
        title: window.appConfig.login.title || "DuxRavel",
        name: window.appConfig.login.name || "系统登录",
        desc: window.appConfig.login.desc || "",
        contact: window.appConfig.login.contact || "",
        side:
          window.appConfig.login.side && window.appConfig.login.side.length > 0
            ? window.appConfig.login.side
            : [loginSode],
        foot: loginFoot,
      },
      readonly: ref(true),
      weatherData,
      formatDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        let day = date.getDate();
        day = day < 10 ? "0" + day : day;
        let week = date.getDay();
        let weekArr = [
          "星期日",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六",
        ];
        let hour = date.getHours();
        hour = hour < 10 ? "0" + hour : hour;
        let minute = date.getMinutes();
        minute = minute < 10 ? "0" + minute : minute;
        let second = date.getSeconds();
        second = second < 10 ? "0" + second : second;
        nowDate.value = `${year} 年 ${month} 月 ${day} 日 ${weekArr[week]}`;
        nowTime.value = `${hour}:${minute}`;
      },
      currentTime() {
        setInterval(this.formatDate, 500);
      },
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
          url: data.value.register ? "register" : "login",
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
