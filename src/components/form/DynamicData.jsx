import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    'only': {
      type: String,
    },
  },
  data() {
    return {

    }
  },
  watch: {
    // data: {
    //   handler(val){
    //     this.$emit('update:value', val)
    //   },
    //   deep:true
    // }
  },
  created() {

  },
  methods: {
    onOpen() {
      this.show = true
    },
  },
  render() {
    return <div class="flex gap-2 flex-col">

    </div>
  }
})
