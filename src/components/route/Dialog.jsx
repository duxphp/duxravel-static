import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    'title': {
      type: String,
    },
  },
  data() {
    return {
    }
  },
  render() {
    return <div>
      <div class="arco-modal-header">
        <div class="arco-modal-title">{this.title}</div>
        <route type="back" calss="arco-modal-close-btn">
          <span class="arco-icon-hover arco-icon-hover-size-medium"><icon-close /></span>
        </route>
      </div>
      {this.$slots.default?.()}
      {this.$slots.footer?.()}
    </div>
  }
})
