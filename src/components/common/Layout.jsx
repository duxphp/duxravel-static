import { defineComponent } from 'vue'
import Route from '../Route.vue'
import { moduleName, router } from "../../utils/router";
import { getUrl, request } from "../../utils/request";
import { loginOut, getLocalUserInfo } from "../../utils/user";
import event, { menuNavigation } from '../../utils/event';
import { weather } from "../../utils/util";

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
    'save': {
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
      notify: [],
      notifyNum: 0,
      weather: {}
    }
  },
  methods: {
    getNotify() {
      if (window.dataNotify) {
        this.notify = window.dataNotify.list
        this.notifyNum = window.dataNotify.num
      }
    },
    readNotify() {
      event.emit('app-notify-read')
    },
    delNotify() {
      event.emit('app-notify-del')
    }
  },
  created() {
    weather((res) => {
      this.weather = res
    })
    event.add('app-notify', () => {
      this.getNotify()
    })
  },
  mounted() {
    menuNavigation.on(data => {
      this.navList = data
    })
    this.getNotify()
  },
  render() {
    const { navList } = this
    return <div class="flex flex-col lg:h-screen">
      <div class="flex-none px-4 py-2 border-b border-gray-300 dark:border-blackgray-5 bg-white dark:bg-blackgray-4 shadow-sm  z-10">
        {this.$slots.header?.() || <div class="flex flex-row gap-2 items-center">
          <div class="flex-grow">
            <div class="text-base">{this.appInfo.name}</div>
            {this.userInfo.title && <div class="text-gray-400 text-xs">{this.userInfo.title}</div>}
          </div>
          <div class="flex-none flex items-center gap-2">
            {this.$slots.tools?.()}
            {this.weather.city && <div>
              <a href="http://www.weather.com.cn/" target="_blank" class="dark:hover:bg-blackgray-2 hover:bg-gray-100 p-2 rounded">{this.weather.city} {this.weather.weather} {this.weather.temperature}°</a>
            </div>}
            <div>
              <a-popover title="消息通知" contentStyle={{ width: '300px' }}>
                {{
                  default: () => <a-badge dot count={this.notifyNum} offset={[-4, 5]}><a-button shape="round" type="text" style={{ fontSize: '20px' }}>
                    {{
                      icon: () => <icon-notification />
                    }}
                  </a-button></a-badge>,
                  content: () => this.notify.length ? <div>
                    <a-list maxHeight="300">
                      {this.notify.map((item) => <a-list-item><a-badge count={item.read ? 0 : 1} dot offset={[8, 0]}>{item.message}</a-badge></a-list-item>)}
                    </a-list>
                    <div class="mt-2 flex gap-2 justify-end">
                      <a-link onClick={this.readNotify}>一键已读</a-link>
                      <a-link onClick={this.delNotify}>清空消息</a-link>
                    </div>
                  </div> : <a-empty description="暂无通知消息" />
                }}
              </a-popover>
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
                    default: () => <div class="flex items-center gap-2 px-2 cursor-pointer">
                      <a-avatar size="28" src={this.userInfo.avatar}>{!this.userInfo.avatar && this.userInfo.avatar_text}</a-avatar>
                      <div>
                        <div>{this.userInfo.showname}</div>
                        {this.userInfo.subname && <div class="text-gray-400">{this.userInfo.subname}</div>}
                      </div>
                    </div>,
                    content: () => <div>
                      <a-doption onClick={() => {
                        window.open("/")
                      }}>返回首页
                      </a-doption>
                      <a-doption onClick={() => {
                        router.push('/' + moduleName() + '/userInfo/page')
                      }}>修改资料
                      </a-doption>
                      <a-doption onClick={() => {
                        loginOut();
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
            {this.save && <a-button type="primary" html-type={this.submit ? 'button' : 'submit'} onClick={this.submit} loading={this.formLoading}>保存</a-button>}
          </div>
          }
        </div>
        {this.$slots.default?.()}
      </div>
    </div>
  }
})
