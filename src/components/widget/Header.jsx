import { defineComponent, h } from 'vue'

export default defineComponent({
  props: {
    'title': {
      type: String,
    },
    'back': {
      type: Boolean
    }
  },
  render() {
    return <div class="flex items-center p-4 border-b border-gray-300 bg-white shadow-sm z-10">
      <div class="flex-none">
        {this.$slots.header?.()}
        {this.back && <route type="back" class="cursor-pointer text-xs items-center text-gray-500 hidden lg:flex">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon w-5 h-5" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="5" y1="12" x2="19" y2="12"></line><line x1="5" y1="12" x2="11" y2="18"></line><line x1="5" y1="12" x2="11" y2="6"></line></svg>
          返回
        </route>}
        {this.title && <div class="text-base">{this.title}</div>}
      </div>
      <div class="flex-grow items-center hidden lg:flex justify-end gap-2">
      {this.$slots.default?.()}
      </div>
    </div>
  }
})
