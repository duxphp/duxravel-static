import { defineComponent } from 'vue'
import { requestCache } from '../../utils/request'
import { vExec } from '../Create'

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
    }
  },
  created() {
    if (this.dataUrl) {
      requestCache({
        url: this.dataUrl,
        method: 'get',
      }).then(res => {
        this.nParams.options = res
        if (this.value !== null) {
          this.$emit('dataLabel', this.getLabel(this.value).join(' | '))
        }
      })
    }
  },
  methods: {
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
    getLabel(value) {
      let labels = []
      if (Array.isArray(value)) {
        value.forEach(item => {
          let data = this.formatData(item)
          labels.push(data.label)
        })
      }else {
        let data = this.formatData(value)
        labels.push(data.label)
      }
      return labels
    },
    updateValue(value) {
      this.$emit('dataLabel', this.getLabel(value).join(' | '))
      this.$emit('update:value', value)
    }
  },
  render() {
    return <n-cascader
      {...vExec.call(this, this.nParams)}
      value={this.value}
      onUpdate:value={this.updateValue}
    />
  }
})
