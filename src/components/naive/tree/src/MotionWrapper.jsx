import { defineComponent } from 'vue'
import { pxfy } from 'seemly'
import FadeInExpandTransition from 'naive-ui/es/_internal/fade-in-expand-transition'
import TreeNode from './TreeNode'

export default defineComponent({
  name: 'TreeMotionWrapper',
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    height: Number,
    nodes: {
      type: Array,
      required: true
    },
    mode: {
      type: String,
      required: true
    },
    onAfterEnter: {
      type: Function,
      required: true
    }
  },
  render () {
    const { clsPrefix } = this
    return (
      <FadeInExpandTransition
        onAfterEnter={this.onAfterEnter}
        appear
        reverse={this.mode === 'collapse'}
      >
        {{
          default: () => (
            <div
              class={[
                `${clsPrefix}-tree-copy-motion-wrapper`,
                `${clsPrefix}-tree-copy-motion-wrapper--${this.mode}`
              ]}
              style={{
                height: pxfy(this.height)
              }}
            >
              {this.nodes.map((node) => (
                <TreeNode clsPrefix={clsPrefix} tmNode={node} />
              ))}
            </div>
          )
        }}
      </FadeInExpandTransition>
    )
  }
})
