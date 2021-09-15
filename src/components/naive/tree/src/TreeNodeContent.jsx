import { defineComponent, ref, inject } from 'vue'
import { render } from 'naive-ui/es/_utils'
import { treeInjectionKey } from './interface'

export default defineComponent({
  name: 'TreeNodeContent',
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    disabled: Boolean,
    checked: Boolean,
    selected: Boolean,
    onClick: Function,
    onDragstart: Function,
    tmNode: {
      type: Object,
      required: true
    }
  },
  setup (props) {
    const { renderLabelRef, renderPrefixRef, renderSuffixRef, labelFieldRef } =
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      inject(treeInjectionKey)
    const selfRef = ref(null)
    function doClick (e) {
      const { onClick } = props
      if (onClick) onClick(e)
    }
    function handleClick (e) {
      doClick(e)
    }
    return {
      selfRef,
      renderLabel: renderLabelRef,
      renderPrefix: renderPrefixRef,
      renderSuffix: renderSuffixRef,
      labelField: labelFieldRef,
      handleClick
    }
  },
  render () {
    const {
      clsPrefix,
      labelField,
      checked = false,
      selected = false,
      renderLabel,
      renderPrefix,
      renderSuffix,
      handleClick,
      onDragstart,
      tmNode: {
        rawNode,
        rawNode: { prefix, suffix, [labelField]: label }
      }
    } = this
    return (
      <span
        ref="selfRef"
        class={[`${clsPrefix}-tree-copy-node-content`]}
        onClick={handleClick}
        draggable={onDragstart === undefined ? undefined : true}
        onDragstart={onDragstart}
      >
        {renderPrefix || prefix ? (
          <div class={`${clsPrefix}-tree-copy-node-content__prefix`}>
            {renderPrefix
              ? renderPrefix({
                option: rawNode,
                selected,
                checked
              })
              : render(prefix)}
          </div>
        ) : null}
        <div class={`${clsPrefix}-tree-copy-node-content__text`}>
          {renderLabel
            ? renderLabel({
              option: rawNode,
              selected,
              checked
            })
            : render(label)}
        </div>
        {renderSuffix || suffix ? (
          <div class={`${clsPrefix}-tree-copy-node-content__suffix`}>
            {renderSuffix
              ? renderSuffix({
                option: rawNode,
                selected,
                checked
              })
              : render(suffix)}
          </div>
        ) : null}
      </span>
    )
  }
})
