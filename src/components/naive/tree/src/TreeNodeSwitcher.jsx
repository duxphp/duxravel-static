import { defineComponent } from 'vue'

const levelColor = ['#0087FF', '#30CCF6', '#49CD5B', '#FAAC11', '#F53739', '#AA69F6']

const Point = defineComponent({
  name: 'NTreePoint',
  props: {
    tmNode: Object
  },
  render() {
    const { tmNode } = this
    return <div className='n-tree-copy-point' style={{ backgroundColor: levelColor[Math.min(5, tmNode.level)] }}>
      <div className='n-tree-copy-point-child'></div>
    </div>
  }
})

export default defineComponent({
  name: 'NTreeSwitcher',
  components: {
    Point
  },
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    expanded: Boolean,
    hide: Boolean,
    loading: Boolean,
    onClick: Function,
    tmNode: Object
  },
  render() {
    const { clsPrefix } = this
    return (
      <span
        data-switcher
        class={[
          `${clsPrefix}-tree-copy-node-switcher`,
          {
            [`${clsPrefix}-tree-copy-node-switcher--hide`]: this.hide
          }
        ]}
        onClick={this.onClick}
      >
        <div class={`${clsPrefix}-tree-copy-node-switcher__icon`}>
          {
            this.expanded
              ? <svg t="1631687830321" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8097" width="32" height="32"><path d="M980.918297 554.852994 43.079656 554.852994c-23.657816 0-42.856064-19.197224-42.856064-42.8489 0-23.657816 19.198248-42.857087 42.856064-42.857087l937.838641 0c23.697725 0 42.85811 19.199271 42.85811 42.857087C1023.775384 535.655769 1004.616022 554.852994 980.918297 554.852994L980.918297 554.852994z" p-id="8098"></path></svg>
              : <svg t="1631687807271" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7303" width="32" height="32"><path d="M510.635 68.267c22.621 0 40.96 18.338 40.96 40.96v360.447h360.448c22.621 0 40.96 18.34 40.96 40.96 0 22.622-18.339 40.96-40.96 40.96H551.595v360.449c0 22.621-18.339 40.96-40.96 40.96-22.622 0-40.96-18.339-40.96-40.96V551.595H109.227c-22.622 0-40.96-18.339-40.96-40.96 0-22.622 18.338-40.96 40.96-40.96l360.448-0.001V109.227c0-22.622 18.338-40.96 40.96-40.96z" fill="#2B313D" p-id="7304"></path></svg>
          }
          <Point tmNode={this.tmNode} />
        </div>
      </span>
    )
  }
})
