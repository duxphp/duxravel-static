import {defineComponent} from 'vue'
import {getUrl, request} from '../../utils/request'
import {vExec} from '../Create'

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
      modelValue: null
    }
  },
  async created() {
    if (this.dataUrl) {
      await this.handleSearch('', this.value)
      if (this.optionRender) {
        this.nParams.formatLabel = (item) => {
          if (item) {
            return this.optionRender?.(item.rowData) || item.label
          }
        }
      }
    } else {
      this.nParams.options.map((item) => {
        item.render = () => {
          return this.optionRender?.(item) || item.label
        }
        return item;
      })
      if (this.optionRender) {
        this.nParams.formatLabel = (item) => {
          if (item) {
            return this.optionRender?.(item) || item.label
          }
        }
      }
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
            value: item.id,
            render: () => {

              const ddd = this.$slots.option(item)
              console.log(ddd)
              return ddd
              //return this.optionRender?.(item) || item.name
            },
            rowData: item
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
    >
    </a-select>
  }
})