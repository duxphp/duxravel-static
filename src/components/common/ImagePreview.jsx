import { defineComponent } from 'vue'
import { event } from '../../utils/event';
import { imagePreview } from '../../utils/ui';

export default defineComponent({
  props: {
    'images': {
      type: Array,
      default: () => []
    },
    'defaultCurrent': {
      type: String
    },
    'class': String,
    'style': [String, Object]
  },
  methods: {
    click() {
      imagePreview(this.images, this.defaultCurrent)
    }
  },
  render() {
    return <div class={this.class} style={this.style} onClick={this.click}>
      {this.$slots.default?.()}
    </div>
  }
})


export const ImagePreview = defineComponent({
  methods: {
    click() {

    }
  },
  data() {
    return {
      images: [],
      current: 0,
      dialogShow: false
    }
  },
  created() {
    event.add('image-preview-show', ({ images, current }) => {
      if (!images?.length) {
        return
      }
      this.dialogShow = true
      this.images = images
      const index = images.indexOf(current)
      this.current = ~index ? index : 0
    })
  },
  methods: {
    close() {
      this.dialogShow = false
    }
  },
  render() {
    return <a-modal
      vModel={[this.dialogShow, 'visible']}
      modalClass="w-full h-full bg-transparent top-0"
      bodyClass="w-full h-full p-0"
      closable={false}
      footer={false}
      alignCenter={false}
      unmountOnClose
    >
      <a-carousel
        indicator-type="dot"
        show-arrow="hover"
        class="w-full h-full"
      >
        {
          this.images.map(item => <a-carousel-item style={{ display: 'flex', alignItems: 'centet', justifyContent: 'center' }}>
            <img src={item} />
          </a-carousel-item>)
        }
      </a-carousel>
      <icon-close-circle-fill size={100} class="absolute top-0 right-0 z-10 text-white" onClick={this.close} />
    </a-modal>
  }
})