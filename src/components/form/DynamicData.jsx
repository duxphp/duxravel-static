import {defineComponent} from 'vue'

export default defineComponent({
  props: {
    'value': {
      type: Array,
    },
    'onCreate': Function,
    'min': Number,
    'max': Number
  },
  data() {
    const list = this.value || []
    if (!list.length) {
      list.push(this.onAdd(0))
    }
    return {
      list,
    }
  },
  watch: {},
  methods: {
    onAdd(index) {
      if (!this.onCreate) {
        return ""
      }else {
        return this.onCreate(index)
      }
    },
    onOpen() {
      this.show = true
    },
  },
  render() {
    return <div class="flex gap-2 flex-col  w-full">
      {
        this.list.length > 0 && this.list.map((value, index) => <div class="flex gap-2 items-center">
          <div class="flex-grow"> {this.$slots.default?.({
            index: index,
            value: this.list[index]
          }) || <a-input vModel={[this.list[index], 'model-value']} />}</div>
          <div class="flex-none flex items-center gap-2">
            <a-button type="secondary" shape="circle" disabled={this.max && this.list.length >= this.max} onClick={() => {
                this.list.splice(index + 1, 0, this.onAdd(index + 1))
                this.$emit('update:value', this.list)
            }}>
              <icon-plus/>
            </a-button>
            {index > 0 && <a-button shape="circle" type="secondary" status="danger" disabled={this.min && this.list.length <= this.min} onClick={() => {
                this.list.splice(index, 1)
                this.$emit('update:value', this.list)
            }}>
              <icon-delete/>
            </a-button>}
          </div>
        </div>)
      }
    </div>
  }
})
