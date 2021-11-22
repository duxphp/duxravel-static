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
      modelVale: '',
    }
  },
  created() {
    if (this.dataUrl) {
      requestCache({
        url: this.dataUrl,
        method: 'get',
      }).then(res => {
        this.nParams.options = this.formatOptions(res)
        if (this.value !== null) {
          this.modelValue = this.value.toString()
        }

      })
    } else {
      this.nParams.options = this.formatOptions(this.nParams.options)
      if (this.value !== null) {
        this.modelValue = this.value.toString()
      }
    }
  },
  methods: {
    formatOptions(data) {
      let format = (data) => {
        return data.map((item) => {
          let tmp = {
            label: item.label.toString(),
            value: item.value.toString(),
          }
          if (item.children && item.children.length) {
            tmp.children = format(item.children)
          }
          return tmp;
        })
      }
      return format(data)
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
      return {
        label: labelPath.reverse().join(' / '),
      }
    },
    updateValue(value) {
      this.modelVale = value
      this.$emit('update:value', value)
    },
  },
  render() {
    return <a-cascader
      {...vExec.call(this, this.nParams)}
      formatLabel={this.formatLabel}
      modelValue={this.modelValue}
      onChange={this.updateValue}
    />
  }
})
