import {defineComponent} from 'vue'
import Route from '../Route.vue'
import {router} from "../../utils/router";
import {getUrl, request} from "../../utils/request";
import {clearUserInfo, getLocalUserInfo} from "../../utils/user";
import event, {menuNavigation} from '../../utils/event';
import {weather} from "../../utils/util";

export default defineComponent({
  props: {
    'title': {
      type: String,
    },
    'form': {
      type: Boolean,
      default: false
    },
    'back': {
      type: Boolean,
      default: true
    },
    'submit': {
      type: Function,
    },
    'formLoading': {
      type: Boolean,
      default: false
    }
  },
  components: {
    Route
  },
  data() {
    return {
      appInfo: window.appConfig,
      darkMode: localStorage.getItem("darkMode") === "dark" ? "dark" : "light",
      navList: [],
      userInfo: getLocalUserInfo(),
      weather: {}
    }
  },
  created() {
    weather((res) => {
      this.weather = res
    })
  },
  mounted() {
    menuNavigation.on(data => {
      this.navList = data
    })
  },
  render() {
    const {navList} = this
    return <div class="flex flex-col lg:h-screen">
      <div class="flex-none px-4 py-2 border-b border-gray-300 dark:border-blackgray-5 bg-white dark:bg-blackgray-4 shadow-sm  z-10">
        {this.$slots.header?.() || <div class="flex flex-row gap-2 items-center">
          <div class="flex-grow">
            {this.appInfo.name}
          </div>
          <div class="flex-none flex items-center gap-2">
            {this.$slots.tools?.()}
            {this.weather.city && <div>
              <a href="http://www.weather.com.cn/" target="_blank" class="dark:hover:bg-blackgray-2 hover:bg-gray-100 p-2 rounded">{this.weather.city} {this.weather.weather} {this.weather.temperature}°</a>
            </div>}
            <div>
              <a-button type="text" shape="round" style={{fontSize: '20px'}} onClick={() => {
                this.darkMode = this.darkMode === 'dark' ? 'light' : 'dark'
                event.emit('switch-dark', this.darkMode)
              }}>
                {{
                  icon: () => this.darkMode === 'light' ? <icon-sun-fill/> : <icon-moon-fill/>
                }}

              </a-button>
            </div>
            <div>
              <a-dropdown>
                {
                  {
                    default: () => <div class="flex items-center gap-2 px-2 cursor-pointer">
                      <a-avatar size="28" src={this.userInfo.avatar}>{!this.userInfo.avatar && this.userInfo.avatar_text}</a-avatar>
                      <div>{this.userInfo.rolename}</div>
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
      <div class="flex-grow bg-gray-100 dark:bg-blackgray-2 overflow-y-auto app-scrollbar">

        <div class="p-4 pb-0 flex  items-center">
          <div class="flex-grow">
            <a-breadcrumb>
              {
                navList.map((item, index) => <a-breadcrumb-item>{item.name}</a-breadcrumb-item>)
              }
            </a-breadcrumb>
          </div>
          {this.form && <div class="flex-none flex gap-2">
            {this.back && <route type="back">
              <a-button type="outline">
                返回
              </a-button>
            </route>}
            <a-button type="primary" html-type={this.submit ? 'button' : 'submit'} onClick={this.submit} loading={this.formLoading}>保存</a-button>
          </div>
          }
        </div>
        {this.$slots.default?.()}
      </div>
    </div>
  }
})
