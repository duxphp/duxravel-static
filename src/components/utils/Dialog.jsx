import {defineComponent} from 'vue'
import {getUrl, request} from '../../utils/request'


export default defineComponent({
  props: {
    type: {
      type: String,
      default: 'prompt'
    },
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    callback: Function,
    close: Function,
  },
  data() {
    return {
      show: true,
      modelValue: this.value,
    }
  },
  methods: {
    hidden() {
      this.show = false
      this.close()
    }
  },
  render() {
    if (this.type === 'prompt') {
      return <a-modal
        visible={this.show}
        title={this.title || '请输入内容'}
        vModel={[this.show, 'visible']}
        onOk={() => {
          this.$emit('update:value', this.modelValue)
          this.callback && this.callback(this.modelValue)
          this.hidden()
        }}
        onClose={this.hidden}
        onCancel={this.hidden}
      >
        <div>
          <a-input vModel={[this.modelValue, 'model-value']} placeholder=""/>
        </div>
      </a-modal>
    }
  }
})
