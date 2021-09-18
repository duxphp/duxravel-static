import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    'class': {
      type: String,
    },
    'title': {
      type: String,
      default: '暂无数据'
    },
    'content': {
      type: String,
      defalut: '暂未找到数据请进行查找'
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  render() {
    return <div class="flex justify-center p-4">
      <div className="flex items-center gap-4">
        <div className="flex-none text-gray-400">
          <n-icon size="40">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1341" width="64"
                 height="64">
              <path
                d="M831.7 369.4H193.6L64 602v290.3h897.2V602L831.7 369.4zM626.6 604.6c0 62.9-51 113.9-114 113.9s-114-51-114-113.9H117.5l103.8-198h582.5l103.8 198h-281zM502.2 131h39.1v140.6h-39.1zM236.855 200.802l27.647-27.647 99.419 99.418-27.648 27.648zM667.547 272.637l99.418-99.419 27.648 27.648-99.418 99.418z"
              ></path>
            </svg>
          </n-icon>
        </div>
        <div className="flex-grow ">
          <div className="mb-1 text-base">{this.title}</div>
          <div className="text-gray-400">{this.content}</div>
        </div>
      </div>
    </div>
  }
})
