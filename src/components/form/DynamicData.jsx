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
    console.log(this.$props)
    const list = this.value || []
    if (!list.length) {
      this.onCreate ? list.push(this.onCreate(0)) : list.push({})
    }
    return {
      list
    }
  },
  watch: {},
  created() {

  },
  methods: {
    onOpen() {
      this.show = true
    },
  },
  render() {
    return <div class="flex gap-2 flex-col  w-full">
      {
        this.list.length > 0 && this.list.map((value, index) => <div class="flex gap-2 items-center">
          <div class="flex-grow">{this.$slots.default?.({
            index: index,
            value: this.list[index]
          })}</div>
          <div class="flex-none flex items-center gap-2">
            <a-button type="secondary" shape="circle" disabled={this.max && this.list.length >= this.max} onClick={() => {
              if (this.onCreate) {
                this.list.splice(index + 1, 0, this.onCreate(index + 1))
                this.$emit('update:value', this.list)
              }
            }}>
              <icon-plus/>
            </a-button>
            {index > 0 && <a-button shape="circle" type="secondary" status="danger" disabled={this.min && this.list.length <= this.min} onClick={() => {
              if (this.onCreate) {
                this.list.splice(index, 1)
                this.$emit('update:value', this.list)
              }
            }}>
              <icon-delete/>
            </a-button>}
          </div>
        </div>)
      }
    </div>
  }
})
