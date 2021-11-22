import {defineComponent} from 'vue'
import {request} from '../../utils/request'
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
    }
  },
  data() {
    return {
      loading: false
    }
  },
  async created() {
    if (this.dataUrl) {
      await this.handleSearch('', this.value)
    }
  },
  methods: {
    updateValue(value){
      this.$emit('update:value', value)
    },
    handleSearch(query, value) {
      this.loading = true
      return request({
        url: this.dataUrl,
        method: 'get',
        data: {
          query: query,
          id: value
        }
      }).then(res => {
        this.nParams.options = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id
          }
        })

        console.log(this.nParams.options)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  },
  render() {
    return <a-select
      {...vExec.call(this, this.nParams)}

      modelValue={this.value}
      loading={this.loading}
      onSearch={this.handleSearch}
      onChange={this.updateValue}
    />
  }
})