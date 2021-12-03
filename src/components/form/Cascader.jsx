import {defineComponent, nextTick} from 'vue'
import {requestCache} from '../../utils/request'
import {vExec} from '../Create'

export default defineComponent({
  props: {
    'n-params': {
      type: Array,
      default: [],
    },
    'value': {
      type: [String, Number, Array]
    },
    'data-url': {
      type: String
    },
  },
  data() {
    return {
      loading: false,
      search : false
    }
  },
  async created() {
    if (this.dataUrl) {
      await this.getData()
    }
  },
  mounted() {
    // BUG FIX 偶尔会出现搜索输入变小问题
    this.search = true
  },
  watch: {
    dataUrl() {
      this.$emit('update:value', null)
      this.getData()
    }
  },
  methods: {
    getData() {
      this.loading = true
      this.nParams.options = []
      return requestCache({
        url: this.dataUrl,
        method: 'get',
      }).then(res => {z
        this.nParams.options = res  instanceof Array ? res : []
        this.loading = false
      }).catch(() => {
        this.loading = false

      })
    },
    updateValue(value) {
      this.$emit('update:value', value)
    },
  },
  render() {
    return <a-spin loading={this.loading} class="black w-full"><a-cascader
      {...vExec.call(this, this.nParams)}
      formatLabel={this.formatLabel}
      modelValue={this.value}
      allowSearch={this.search}
      onChange={this.updateValue}
    />
  </a-spin>
  }
})
