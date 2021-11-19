import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    'title': {
      type: String,
      default: '暂无数据'
    },
  },
  data() {
    return {
    }
  },
  created() {
  },
  render() {
    return <div class="flex flex-col lg:h-screen">
      <div class="flex-none  p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        {this.$slots.header?.() || <div class="flex flex-row gap-2 items-center">
          <div class="flex-grow"></div>
          <div class="flex-none flex items-center gap-2">
            <div></div>
            <div class="flex items-center gap-1">
              <a-avatar>A</a-avatar>
              <div>姓名</div>
            </div>
          </div>
        </div>}
      </div>
      <div class="flex-grow bg-gray-100 dark:bg-gray-900 overflow-auto app-scrollbar">
        {this.$slots.default?.()}
      </div>
    </div>
  }
})
