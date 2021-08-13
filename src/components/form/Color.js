import { divide } from 'lodash'
import { onMounted, defineComponent } from 'vue'
import { request } from '../../utils/request'
import { vExec } from '../Create'

export default defineComponent({
  props: {
    'value': {
      type: String
    },
    'placeholder': {
      type: String
    },
    'colors': {
      type: Array
    }
  },
  data() {
    return {
      color: [
        '#a2d9ff',
        '#0099ff',
        '#000b76',
        '#5000ca',
        '#e7008a',
        '#ff5500',
        '#00cba9',
        '#ffd700',
        '#f3f4f5',
        '#273036',
      ]
    }
  },
  created() {
    if (this.colors && this.colors.length) {
      this.color = this.colors
    }
  },
  methods: {
    onSelect(value) {
      this.$emit('update:value', value)
    }
  },
  render() {
    return <n-popover placement="bottom-start" trigger="click" style={{padding: 0}}>
      {{
        default: () => <div class="flex flex-wrap pl-2 pr-1 py-2 gap-2 w-64">
            {this.color.map(color => <div class="w-7 h-7 rounded hover:shadow cursor-pointer" onClick={() => {this.onSelect(color)}} style={{backgroundColor: color}}></div>)}
            <div class="w-24"><n-input size="small" placeholder="" value={this.value} onUpdate:value={this.onSelect}  /></div>
        </div>,
        trigger: () => <n-input value={this.value} type="text" placeholder={this.placeholder}>
          {{
            suffix: () => <div class="rounded-full w-6 h-6 border " style={{backgroundColor: this.value}}></div>
          }}
        </n-input>
      }}
    </n-popover>
  }
})
