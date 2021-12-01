import {defineComponent, nextTick} from 'vue'
import {requestCache} from '../../utils/request'
import {vExec} from '../Create'

export default defineComponent({
  props: {
    'n-params': {
      type: Object,
    },
    'value': {
      type: [String, Number]
    },
    'data-url': {
      type: String
    },
  },
  data() {
    return {
      modelVale: '',
    }
  },
  created() {
    if (this.dataUrl) {
      requestCache({
        url: this.dataUrl,
        method: 'get',
      }).then(res => {
        this.nParams.options = res

      })
    }
  },
  methods: {
    updateValue(value) {
      this.$emit('update:value', value)
    },
  },
  render() {
    return <a-cascader
      {...vExec.call(this, this.nParams)}
      formatLabel={this.formatLabel}
      modelValue={this.value}
      onChange={this.updateValue}
    />
  }
})
