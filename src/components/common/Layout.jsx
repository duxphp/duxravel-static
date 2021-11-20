import {defineComponent} from 'vue'
import {router} from "../../utils/router";
import {getUrl} from "../../utils/request";
import {clearUserInfo} from "../../utils/user";
import event from '../../utils/event';

export default defineComponent({
  props: {
    'title': {
      type: String,
      default: '暂无数据'
    },
  },
  data() {
    return {
      darkMode: localStorage.getItem("darkMode") === "dark" ? "dark" : "light",
    }
  },
  created() {
  },
  render() {
    return <div class="flex flex-col lg:h-screen">
      <div class="flex-none px-4 py-2 border-b border-gray-300 dark:border-blackgray-5 bg-white dark:bg-blackgray-4 shadow-sm">
        {this.$slots.header?.() || <div class="flex flex-row gap-2 items-center">
          <div class="flex-grow">
            dsadsadsad
          </div>
          <div class="flex-none flex items-center gap-2">
            <div>
              <a-button type="text"  shape="round" style={{fontSize: '20px'}} onClick={() => {
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
                    default: () => <div className="flex items-center gap-2 p-1 px-2 cursor-pointer">
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
