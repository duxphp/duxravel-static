import {defineComponent} from 'vue'
import {getUrl, request} from '../../utils/request'

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
        res = res  instanceof Array ? res : []
        this.nParams.options = res
        this.loading = false
        this.$emit('data-load', res)
      }).catch(() => {
        this.loading = false
      })
    },
    updateValue(value) {
      this.modelValue = value
      this.$emit('update:value', value)
    },
    filterTreeNode(searchValue, nodeData) {
        let search = nodeData.search ? nodeData.search : nodeData.label
        return search.toString().toLowerCase().indexOf(searchValue.toString().toLowerCase()) > -1;
    }
  },
  render() {
    return <a-tree-select
      {...this.nParams}
      fieldNames={{
          key: 'value',
          title: 'label',
          children: 'children'
        }}
      loading={this.loading}
      modelValue={this.modelValue}
      allowSearch={this.search}
      allowClear={true}
      onChange={this.updateValue}
      filterTreeNode={this.filterTreeNode}
    />
  }
})
