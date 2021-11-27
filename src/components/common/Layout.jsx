import { defineComponent } from 'vue'
import Route from '../Route.vue'
import { router } from "../../utils/router";
import { getUrl } from "../../utils/request";
import { clearUserInfo } from "../../utils/user";
import event from '../../utils/event';

export default defineComponent({
  props: {
    'title': {
      type: String,
    },
  },
  components: {
    Route
  },
  data() {
    return {
      darkMode: localStorage.getItem("darkMode") === "dark" ? "dark" : "light",
    }
  },
  created() {
  },
  mounted() {
    window.WIDGET = {
      "CONFIG": {
        "modules": "012",
        "background": "5",
        "tmpColor": "FFFFFF",
        "tmpSize": "14",
        "cityColor": "FFFFFF",
        "citySize": "14",
        "aqiColor": "FFFFFF",
        "aqiSize": "14",
        "weatherIconSize": "22",
        "alertIconSize": "14",
        "padding": "10px 10px 10px 10px",
        "shadow": "0",
        "language": "auto",
        "fixed": "false",
        "vertical": "top",
        "horizontal": "left",
        "key": "a87472fd654f4df298cebd219e20c24a"
      }
    }
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0';
    document.getElementsByTagName('head')[0].appendChild(script)


    document.querySelector('#he-plugin-simple').removeEventListener('hover')
  },
  render() {
    const { MenuNavigation = [] } = window
    return <div class="flex flex-col lg:h-screen">
      <div class="flex-none px-4 py-2 border-b border-gray-300 dark:border-blackgray-5 bg-white dark:bg-blackgray-4 shadow-sm  z-10">
        {this.$slots.header?.() || <div class="flex flex-row gap-2 items-center">
          <div class="flex-grow">
            <a-breadcrumb>
              {
                MenuNavigation.map((item, index) => <a-breadcrumb-item><Route href={item.url}>{item.name}</Route></a-breadcrumb-item>)
              }
            </a-breadcrumb>


          </div>
          <div class="flex-none flex items-center gap-2">
            <div class="absolute">
              <div id="he-plugin-simple"></div>
            </div>
            <div>
              <a-button type="text" shape="round" style={{ fontSize: '20px' }} onClick={() => {
                this.darkMode = this.darkMode === 'dark' ? 'light' : 'dark'
                event.emit('switch-dark', this.darkMode)
              }}>
                {{
                  icon: () => this.darkMode === 'light' ? <icon-sun-fill /> : <icon-moon-fill />
                }}

              </a-button>
            </div>
            <div>
              <a-dropdown>
                {
                  {
                    default: () => <div class="flex items-center gap-2 p-1 px-2 cursor-pointer">
                      <a-avatar size="28">A</a-avatar>
                      <div>姓名</div>
                    </div>,
                    content: () => <div>
                      <a-doption onClick={() => {
                        window.open("/")
                      }}>返回首页
                      </a-doption>
                      <a-doption onClick={() => {
                        router.push(getUrl("/userInfo/page"))
                      }}>修改资料
                      </a-doption>
                      <a-doption onClick={() => {
                        clearUserInfo();
                        window.location.replace(
                          window.location.pathname.split("/")[0] || "/"
                        )
                      }}>退出登录
                      </a-doption>
                    </div>
                  }
                }
              </a-dropdown>
            </div>
          </div>
        </div>}
      </div>
      <div class="flex-grow bg-gray-100 dark:bg-blackgray-2 overflow-auto app-scrollbar">
        {this.$slots.default?.()}
      </div>
    </div>
  }
})
