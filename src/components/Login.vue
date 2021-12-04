<template>
  <div v-if="data.show" class="absolute inset-0 bg-cover bg-center overflow-y-auto bg-gray-100 dark:bg-blackgray-3" style="z-index: 100 " :style="{ 'backgroundImage':'url('+ config.background +')' }">

    <div class="max-w-7xl  mx-auto  px-4 md:h-screen md:flex md:flex-col">
      <div class="flex-none md:flex py-4 text-gray-100  dark:text-gray-200 items-center ">
        <div class="flex-grow  flex gap-4 items-center justify-center md:justify-start my-4 md:my-0">
          <div class="">
            <img :src="config.logo" class="h-12">
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-2xl">{{ config.title }}</div>
            <div v-if="config.desc" class="opacity-50">
              {{ config.desc }}
            </div>
          </div>
        </div>
        <div class="flex-none hidden md:flex items-center gap-4 text-right" v-if="nowDate">
          <div class="flex flex-col gap-1 flex-grow">
            <div>{{ nowDate }}</div>
            <div v-if="weatherData">{{ weatherData.city }} {{ weatherData.weather }} {{ weatherData.temperature }}°</div>
            <div v-else>获取天气中...</div>
          </div>
          <div class="flex-none text-4xl">
            {{ nowTime }}
          </div>

        </div>
      </div>

      <div class="flex-grow md:flex items-center justify-center">

        <div class="max-w-4xl w-full flex flex-col md:flex-row bg-white dark:bg-blackgray-5 shadow rounded">
          <div class="md:w-1/2 bg-black hidden md:block">
            <a-carousel class="w-full h-full"
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
          <div class="md:w-1/2 flex flex-col justify-center items-center  p-4 pt-0" style="height: 600px; background-repeat: repeat-x; background-position: center bottom" :style="{ 'backgroundImage':'url('+ config.foot +')' }">

            <div class=" flex-grow flex flex-col max-w-xs w-full">
              <div class="text-center mt-20 mb-10">
                <div class="text-blue-600 text-2xl ">平台登录</div>
              </div>

              <form class="flex flex-col gap-6" @submit="login">
                <input type="hidden" name="remember" value="true"/>
                <div>
                  <a-input placeholder="请输入登录账号" size="large" :readonly="readonly" @update:modelValue="input('username', $event)">
                    <template #prefix>
                      <icon-user/>
                    </template>
                  </a-input>
                </div>
                <div>
                  <a-input-password placeholder="请输入登录密码" size="large" :readonly="readonly" @update:modelValue="input('password', $event)">
                    <template #prefix>
                      <icon-lock/>
                    </template>
                  </a-input-password>
                </div>
                <div>
                  <a-button html-type="submit"
                            type="primary"
                            size="large"
                            :loading="data.status"
                            long>登录
                  </a-button>
                </div>
              </form>
            </div>

            <div class="flex-none text-center dark:text-white dark:opacity-30 text-gray-400">
              {{ config.contact }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {ref} from "vue";
import {request} from "../utils/request";
import event from "../utils/event";
import {isLogin, setLocalUserInfo} from "../utils/user";
import logo from "../assets/images/logo.svg";
import loginFoot from "../assets/images/login-foot.png";
import {weather} from "../utils/util";


export default {
  mounted() {
    this.currentTime()
    this.$nextTick(() => {
      setTimeout(() => {
        this.readonly = false
      }, 500)
    })
  },
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
    })

    const nowDate = ref('')
    const nowTime = ref('')
    const weatherData = ref({})

    weather((res) => {
      weatherData.value = res
    })

    return {
      data,
      nowDate,
      nowTime,
      config: {
        logo: window.appConfig.login.logo || logo,
        background: window.appConfig.login.background || `${window.location.origin}/images/login-bg.png`,
        title: window.appConfig.login.title || 'DuxRavel',
        desc: window.appConfig.login.desc || '',
        contact: window.appConfig.login.contact || '',
        side: window.appConfig.login.side || [
          `${window.location.origin}/images/login-side.png`
        ],
        foot: loginFoot
      },
      readonly: ref(true),
      weatherData,
      formatDate() {
        let date = new Date();
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        month = month < 10 ? "0" + month : month
        let day = date.getDate()
        day = day < 10 ? "0" + day : day
        let week = date.getDay()
        let weekArr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
        let hour = date.getHours()
        hour = hour < 10 ? "0" + hour : hour
        let minute = date.getMinutes()
        minute = minute < 10 ? "0" + minute : minute
        let second = date.getSeconds()
        second = second < 10 ? "0" + second : second
        nowDate.value = `${year} 年 ${month} 月 ${day} 日    ${weekArr[week]}`
        nowTime.value = `${hour}:${minute}`
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
          url: "login",
          data: data.value.post,
          method: "POST",
        })
            .then((res) => {
              setLocalUserInfo({...res.userInfo, token: res.token});
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
