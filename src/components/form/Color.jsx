import { defineComponent } from 'vue'

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
    return <a-popover position="bl" trigger="click"  style={{padding: 0}}>
      {{
        default: () => <a-input modelValue={this.value} type="text" placeholder={this.placeholder}>
          {{
            append: () => <div class="rounded-full w-6 h-6 border " style={{backgroundColor: this.value}}></div>
          }}
        </a-input>,
        content: () => <div class="flex flex-wrap pl-1 pr-0 py-0 gap-2 w-64">
            {this.color.map(color => <div class="w-7 h-7 rounded hover:shadow cursor-pointer" onClick={() => {this.onSelect(color)}} style={{backgroundColor: color}}></div>)}
            <div class="w-24"><a-input size="small" placeholder="" modelValue={this.value} onUpdate:modelValue={this.onSelect}  /></div>
        </div>
      }}
    </a-popover>
  }
})
