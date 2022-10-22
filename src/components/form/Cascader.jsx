import { defineComponent } from 'vue'
import { getUrl, request } from '../../utils/request'

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
      search: false,
      modelValue: null
    }
  },
  async created() {
    if (this.dataUrl) {
      await this.getData()
    }
    this.modelValue = this.value
  },
  mounted() {
    // BUG FIX 偶尔会出现搜索输入变小问题
    this.search = true
  },
  watch: {
    dataUrl() {
      this.modelValue = null
      this.$emit('update:value', null)
      this.getData()
    }
  },
  methods: {
    getData() {
      this.loading = true
      this.nParams.options = []
      return request({
        url: getUrl(this.dataUrl),
        method: 'get',
      }).then(res => {
        function formatData(data) {
          let tmp = [];
          for (let datum of data) {
            if (datum.children instanceof Array && datum.children.length > 0) {
              datum.children = formatData(datum.children)
            }else {
              delete datum.children
            }
            tmp.push(datum)
          }
          return tmp
        }
        this.nParams.options = res instanceof Array ? formatData(res) : []
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    updateValue(value, label) {
      this.modelValue = value
      this.$emit('update:value', value)
    },
  },
  render() {
    const nParams = this.nParams
    return <a-spin
      loading={this.loading}
      class='black w-full'
    >
      <a-cascader
        {...nParams}
        triggerProps={{
          alignPoint: true,
          ...nParams.triggerProps
        }}
        modelValue={this.modelValue}
        allowSearch={this.search}
        allowClear={true}
        onChange={this.updateValue}
      />
    </a-spin>
  }
})
