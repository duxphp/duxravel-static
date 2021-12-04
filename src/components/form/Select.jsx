import {defineComponent} from 'vue'
import {getUrl, request} from '../../utils/request'
import {vExec} from '../Create'

export default defineComponent({
  props: {
    'n-params': {
      type: Object,
    },
    'value': {
      type: [String, Number, Array]
    },
    'data-url': {
      type: String
    }
  },
  data() {
    return {
      keyword: '',
      loading: false,
      modelValue: null
    }
  },
  async created() {
    if (this.dataUrl) {
      await this.handleSearch('', this.value)
    }
    this.modelValue = this.value
  },
  watch: {
    dataUrl() {
      this.modelValue = null
      this.$emit('update:value', null)
      this.handleSearch()
    }
  },
  methods: {
    updateValue(value) {
      this.modelValue = value
      this.$emit('update:value', value)
    },
    handleSearch(query, value) {
      this.loading = true
      return request({
        url: getUrl(this.dataUrl),
        method: 'get',
        data: {
          query: query,
          id: value
        }
      }).then(res => {
        this.nParams.options = res.data instanceof Array ? res.data.map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        }) : []

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  },
  render() {
    return <a-select
      {...vExec.call(this, this.nParams)}
      modelValue={this.modelValue}
      loading={this.loading}
      onSearch={this.handleSearch}
      onChange={this.updateValue}
    />
  }
})