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
      search : false
    }
  },
  created() {
    if (this.dataUrl) {
      this.getData()
    }
  },
  mounted() {
    console.log(this.value)
    // BUG FIX 偶尔会出现搜索输入变小问题
    this.search = true
  },
  watch: {
    dataUrl() {
      this.$emit('update:value', '')
      this.nParams.options = []
      this.getData()
    }
  },
  methods: {
    getData() {
      requestCache({
        url: this.dataUrl,
        method: 'get',
      }).then(res => {
        this.nParams.options = res
      })
    },
    updateValue(value) {
      this.$emit('update:value', value)
    },
  },
  render() {
    return <a-cascader
      {...vExec.call(this, this.nParams)}
      formatLabel={this.formatLabel}
      modelValue={this.value}
      allowSearch={this.search}
      onChange={this.updateValue}
    />
  }
})
