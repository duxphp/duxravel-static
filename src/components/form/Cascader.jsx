import { defineComponent } from 'vue'
import { getUrl, request } from '../../utils/request'

export default defineComponent({
  props: {
    'n-params': {
      type: Array,
      default: () => ({}),
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
      modelValue: null,
      options: []
    }
  },
  async created() {
    if (this.nParams?.options) {
      this.options = this.nParams?.options
    }
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
      return request({
        url: getUrl(this.dataUrl)
      }).then(res => {
        function formatData(data) {
          let tmp = [];
          for (let datum of data) {
            if (datum.children instanceof Array && datum.children.length > 0) {
              datum.children = formatData(datum.children)
            } else {
              delete datum.children
            }
            tmp.push(datum)
          }
          return tmp
        }
        this.options = res instanceof Array ? formatData(res) : []
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    formatData(value) {
      let labelPath = []
      function getNodeRoute(tree) {
        for (let index = 0; index < tree.length; index++) {
          if (tree[index].children) {
            let endRecursiveLoop = getNodeRoute(tree[index].children)
            if (endRecursiveLoop) {
              labelPath.push(tree[index].label)
              return true
            }
          }
          if (tree[index].value == value) {
            labelPath.push(tree[index].label)
            return true
          }
        }
      }
      getNodeRoute(this.options)
      return labelPath.reverse()
    },
    getLabel(value) {
      let labels = []
      if (Array.isArray(value)) {
        value.forEach(item => {
          labels.push(this.formatData(item))
        })
      } else {
        labels.push(this.formatData(value))
      }
      return labels
    },
    updateValue(value, label) {
      this.modelValue = value
      const labels = this.getLabel(value)
      this.$emit('update:value', value)
      this.$emit('label', labels)
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
        options={this.options}
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
