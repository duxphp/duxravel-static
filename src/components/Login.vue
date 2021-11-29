<template>
  <div v-if="data.show" class="absolute inset-0 bg-cover bg-center" style="z-index: 100 " :style="{ 'backgroundImage':'url('+ config.image +')' }">

    <div class="max-w-8xl mx-auto min-h-screen px-4 flex flex-col">
      <div class="flex-none flex py-4 text-white items-center">
          <div class="flex-grow  flex gap-4 items-center">
            <div class="">
              <img :src="config.logo" class="h-12">
            </div>
            <div class="flex flex-col gap-1">
              <div class="text-2xl">{{config.title}}</div>
              <div class="opacity-50">
                {{config.desc}}
              </div>
            </div>
          </div>
        <div class="flex-none flex items-center gap-4 text-right">
          <div class="flex flex-col gap-1 flex-grow">
            <div>{{ nowDate }}</div>
            <div>长沙 晴天 38°</div>
          </div>
          <div class="flex-none text-4xl">
            {{nowTime}}
          </div>

        </div>
      </div>

      <div class="flex-grow h-10 flex items-center justify-center">

        <div class="max-w-5xl w-full flex bg-white dark:bg-blackgray-5 shadow rounded">
          <div class="w-1/2 bg-black">
2
          </div>
          <div class="w-1/2 flex justify-center  p-4" style="height: 600px; background-repeat: repeat-x; background-position: center bottom" :style="{ 'backgroundImage':'url('+ config.foot +')' }">

            <div class=" flex flex-col max-w-sm w-full">
              <div class="text-blue-600 text-2xl text-center mt-20 mb-10">平台登录</div>
              <a-form class="flex flex-col gap-6">
                <div>
                  <a-input placeholder="请输入登录账号" size="large" :readonly="readonly">
                    <template #prefix>
                      <icon-user />
                    </template>
                  </a-input>
                </div>
                <div>
                  <a-input-password placeholder="请输入登录密码" size="large" :readonly="readonly">
                    <template #prefix>
                      <icon-lock />
                    </template>
                  </a-input-password>
                </div>
                <div>
                  <a-button type="primary" size="large" long>登录</a-button>
                </div>
              </a-form>
            </div>
          </div>
        </div>

      </div>
    </div>



    <div
        class="
        hidden
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
            <img class="w-16 h-16" :src="appInfo.logo || data.logo"/>
          </div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300">
            {{ appInfo.name }}
          </h2>
          <p class="mt-2 text-center text-sm ">
            <span class="text-blue-900  dark:text-gray-500"> 欢迎使用后台管理系统 </span>
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit="login">
          <input type="hidden" name="remember" value="true"/>
          <div class="rounded-md flex flex-col gap-2">
            <div>
              <a-input
                  type="input"
                  size="large"
                  placeholder="用户名"
                  @update:modelValue="input('username', $event)"
              />
            </div>
            <div>
              <a-input
                  type="password"
                  size="large"
                  placeholder="密码"
                  @update:modelValue="input('password', $event)"
              />
            </div>
          </div>

          <div>
            <a-button
                html-type="submit"
                type="primary"
                size="large"
                :loading="data.status"
                long
            >
              登录
            </a-button>
          </div>
        </form>
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

    const nowDate = ref('');
    const nowTime = ref('');

    return {
      data,
      nowDate,
      nowTime,
      config:  {
        logo: window.appConfig.login.logo || logo,
        image: window.appConfig.login.image || `${window.location.origin}/images/login-bg.png`,
        title: window.appConfig.login.title || 'DuxRavel',
        desc: window.appConfig.login.desc || '',
        foot: loginFoot
      },
      readonly: ref(true),
      appInfo: window.appConfig,
      formatDate() {
        let date = new Date();
        let year = date.getFullYear(); // 年
        let month = date.getMonth() + 1; // 月
        month = month < 10 ? "0" + month : month; // 如果只有一位，则前面补零
        let day = date.getDate(); // 日
        day = day < 10 ? "0" + day : day; // 如果只有一位，则前面补零
        let week = date.getDay(); // 星期
        let weekArr = [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ];
        let hour = date.getHours(); // 时
        hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
        let minute = date.getMinutes(); // 分
        minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
        let second = date.getSeconds(); // 秒
        second = second < 10 ? "0" + second : second; // 如果只有一位，则前面补零
        nowDate.value = `${year} 年 ${month} 月 ${day} 日    ${weekArr[week]}`;
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
