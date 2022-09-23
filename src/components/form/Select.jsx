import { defineComponent } from 'vue'
import { getUrl, request } from '../../utils/request'

export default defineComponent({
  props: {
    nParams: Object,
    value: [String, Number, Array],
    dataUrl: String,
    optionRender: Function,
  },
  data() {
    return {
      keyword: '',
      loading: false,
      modelValue: null,
      options: []
    }
  },
  async created() {
    if (this.dataUrl) {
      await this.handleSearch('', this.value)
    }
    // if (this.optionRender) {
    //   this.nParams.formatLabel = (item) => {
    //     return item && (this.optionRender(item) || item.label)
    //   }
    // }
    this.options.map(item => {
      item.label = item.label.toString()
      return item
    })
    this.modelValue = this.value
  },
  watch: {
    dataUrl() {
      this.modelValue = null
      this.$emit('update:value', null)
      this.$emit('update:data', {})
      this.handleSearch()
    }
  },
  methods: {
    updateValue(value) {
      this.modelValue = value
      this.$emit('update:value', value)
      this.$emit('update:item', { ...this.options.find(item => item.value == value), render: void 0 })
    },
    handleSearch(query, value) {
      this.loading = true
      return request({
        url: getUrl(this.dataUrl),
        method: 'get',
        data: {
          query,
          id: value
        }
      }).then(res => {
        this.options = res.data instanceof Array ? res.data.map((item) => {
          const data = {
            label: item.name.toString(),
            value: item.id,
            rowData: item
          }
          if (this.optionRender) {
            data.render = () => {
              return this.optionRender(data)
            }
          }
          return data
        }) : []

        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  },
  render() {
    return <a-select
      options={this.options}
      {...this.nParams}
      modelValue={this.modelValue}
      loading={this.loading}
      onSearch={this.dataUrl && this.handleSearch}
      onChange={this.updateValue}
    >
    </a-select>
  }
})