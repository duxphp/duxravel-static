import {defineComponent, nextTick} from 'vue'
import {getUrl, request, requestCache} from '../../utils/request'
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
      search : false,
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
        this.nParams.options = res  instanceof Array ? res : []
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
      getNodeRoute(this.nParams.options)
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
      let labels = this.getLabel(value)
      this.$emit('label', labels)
      this.$emit('update:value', value)
    },
  },
  render() {
    return <a-spin loading={this.loading} class="black w-full"><a-cascader
      {...vExec.call(this, this.nParams)}
      modelValue={this.modelValue}
      allowSearch={this.search}
      allowClear={true}
      onChange={this.updateValue}
    />
  </a-spin>
  }
})
