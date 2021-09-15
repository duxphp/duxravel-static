/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  inject,
  computed,
  defineComponent,
  ref,
  onMounted
} from 'vue'
import { useMemo } from 'vooks'
import { happensIn, repeat } from 'seemly'
import { createDataKey } from 'naive-ui/es/_utils'
import NTreeNodeSwitcher from './TreeNodeSwitcher'
import NTreeNodeCheckbox from './TreeNodeCheckbox'
import NTreeNodeContent from './TreeNodeContent'
import { treeInjectionKey } from './interface'
import { renderDropMark } from './dnd'
import classNames from 'classnames'

const TreeNode = defineComponent({
  name: 'TreeNode',
  props: {
    clsPrefix: {
      type: String,
      required: true
    },
    tmNode: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const NTree = inject(treeInjectionKey)
    const {
      droppingNodeParentRef,
      droppingMouseNodeRef,
      draggingNodeRef,
      droppingPositionRef,
      droppingOffsetLevelRef,
      indentRef
    } = NTree

    // used for drag and drop
    const contentInstRef = ref(null)
    // must be non-reactive
    const contentElRef = { value: null }

    onMounted(() => {
      contentElRef.value = contentInstRef.value.$el
    })

    function handleSwitcherClick() {
      const { tmNode } = props
      if (NTree.remoteRef.value && !tmNode.isLeaf && !tmNode.shallowLoaded) {
        if (!NTree.loadingKeysRef.value.includes(tmNode.key)) {
          NTree.loadingKeysRef.value.push(tmNode.key)
        }
        const {
          onLoadRef: { value: onLoad }
        } = NTree
        if (onLoad) {
          void onLoad(tmNode.rawNode)
            .then(() => {
              NTree.handleSwitcherClick(tmNode)
            })
            .finally(() => {
              NTree.loadingKeysRef.value.splice(
                NTree.loadingKeysRef.value.findIndex(
                  (key) => key === tmNode.key
                ),
                1
              )
            })
        }
      } else {
        NTree.handleSwitcherClick(tmNode)
      }
    }
    function handleContentClick(e) {
      if (happensIn(e, 'checkbox') || happensIn(e, 'switcher')) return
      NTree.handleSelect(props.tmNode)
    }

    function handleCheck(checked) {
      NTree.handleCheck(props.tmNode, checked)
    }
    // Dnd
    function handleDragStart(e) {
      NTree.handleDragStart({
        event: e,
        node: props.tmNode
      })
    }
    function handleDragEnter(e) {
      if (e.currentTarget !== e.target) {
        return
      }
      NTree.handleDragEnter({
        event: e,
        node: props.tmNode
      })
    }
    function handleDragOver(e) {
      e.preventDefault() // if not prevent, drop event won't be fired...
      NTree.handleDragOver({
        event: e,
        node: props.tmNode
      })
    }
    function handleDragEnd(e) {
      NTree.handleDragEnd({
        event: e,
        node: props.tmNode
      })
    }
    function handleDragLeave(e) {
      if (e.currentTarget !== e.target) {
        return
      }
      NTree.handleDragLeave({
        event: e,
        node: props.tmNode
      })
    }
    function handleDrop(e) {
      e.preventDefault()
      if (droppingPositionRef.value !== null) {
        NTree.handleDrop({
          event: e,
          node: props.tmNode,
          dropPosition: droppingPositionRef.value
        })
      }
    }
    return {
      showDropMark: useMemo(() => {
        const { value: draggingNode } = draggingNodeRef
        if (!draggingNode) return
        const { value: droppingPosition } = droppingPositionRef
        if (!droppingPosition) return
        const { value: droppingMouseNode } = droppingMouseNodeRef
        if (!droppingMouseNode) {
          return
        }
        const { tmNode } = props
        if (tmNode.key === droppingMouseNode.key) return true
        return false
      }),
      showDropMarkAsParent: useMemo(() => {
        const { value: droppingNodeParent } = droppingNodeParentRef
        if (!droppingNodeParent) return false
        const { tmNode } = props
        const { value: droppingPosition } = droppingPositionRef
        if (droppingPosition === 'before' || droppingPosition === 'after') {
          return droppingNodeParent.key === tmNode.key
        }
        return false
      }),
      pending: useMemo(
        () => NTree.pendingNodeKeyRef.value === props.tmNode.key
      ),
      loading: useMemo(() =>
        NTree.loadingKeysRef.value.includes(props.tmNode.key)
      ),
      highlight: useMemo(() =>
        NTree.highlightKeySetRef.value.has(props.tmNode.key)
      ),
      checked: useMemo(() =>
        NTree.displayedCheckedKeysRef.value.includes(props.tmNode.key)
      ),
      indeterminate: useMemo(() =>
        NTree.displayedIndeterminateKeysRef.value.includes(props.tmNode.key)
      ),
      selected: useMemo(() =>
        NTree.mergedSelectedKeysRef.value.includes(props.tmNode.key)
      ),
      expanded: useMemo(() =>
        NTree.mergedExpandedKeysRef.value.includes(props.tmNode.key)
      ),
      disabled: computed(
        () => NTree.disabledRef.value || props.tmNode.disabled
      ),
      checkable: computed(
        () =>
          NTree.checkableRef.value &&
          (NTree.cascadeRef.value ||
            (NTree.leafOnlyRef.value && props.tmNode.isLeaf))
      ),
      checkboxDisabled: computed(() => !!props.tmNode.rawNode.checkboxDisabled),
      selectable: computed(
        () =>
          NTree.selectableRef.value &&
          (NTree.leafOnlyRef.value ? !!props.tmNode.isLeaf : true)
      ),
      internalScrollable: NTree.internalScrollableRef,
      draggable: NTree.draggableRef,
      blockLine: NTree.blockLineRef,
      checkboxFocusable: NTree.internalCheckboxFocusableRef,
      droppingPosition: droppingPositionRef,
      droppingOffsetLevel: droppingOffsetLevelRef,
      indent: indentRef,
      contentInstRef,
      contentElRef,
      handleCheck,
      handleDrop,
      handleDragStart,
      handleDragEnter,
      handleDragOver,
      handleDragEnd,
      handleDragLeave,
      handleContentClick,
      handleSwitcherClick
    }
  },
  render() {
    const {
      tmNode,
      clsPrefix,
      checkable,
      selectable,
      selected,
      checked,
      highlight,
      draggable,
      blockLine,
      indent,
      disabled,
      pending,
      internalScrollable
    } = this
    // drag start not inside
    // it need to be append to node itself, not wrapper
    const dragEventHandlers =
      draggable && !disabled
        ? {
          onDragenter: this.handleDragEnter,
          onDragleave: this.handleDragLeave,
          onDragend: this.handleDragEnd,
          onDrop: this.handleDrop,
          onDragover: this.handleDragOver
        }
        : undefined
    // In non virtual mode, there's no evidence that which element should be
    // scrolled to, so we need data-key to query the target element.
    const dataKey = internalScrollable ? createDataKey(tmNode.key) : undefined

    const getIndent = (() => {
      const arr = []
      let parent = tmNode.parent
      for (let i = 0; i < tmNode.level; i++) {
        arr.unshift(<div
          class={classNames(`${clsPrefix}-tree-copy-node-indent`, {
            'n-tree-copy-node-indent-hide': parent?.isLastChild && i,
            'n-tree-copy-node-indent-half': tmNode.isLastChild && i === 0,
            'n-tree-copy-node-indent-top': tmNode.isFirstChild && !tmNode.isLastChild && i === 0,
            'n-tree-copy-node-indent-top-more': tmNode.isFirstChild && tmNode.siblings.length > 1 && i === 0
          })}
        >
          {i === 0 && <div className={`${clsPrefix}-tree-copy-node-indent-right`} />}
        </div>)
        parent = parent?.parent
      }
      return arr
    })();

    return (
      <div class={`${clsPrefix}-tree-copy-node-wrapper`} {...dragEventHandlers}>
        <div
          class={[
            `${clsPrefix}-tree-copy-node`,
            {
              [`${clsPrefix}-tree-copy-node--selected`]: selected,
              [`${clsPrefix}-tree-copy-node--checkable`]: checkable,
              [`${clsPrefix}-tree-copy-node--highlight`]: highlight,
              [`${clsPrefix}-tree-copy-node--pending`]: pending,
              [`${clsPrefix}-tree-copy-node--disabled`]: disabled,
              [`${clsPrefix}-tree-copy-node--selectable`]: selectable
            }
          ]}
          data-key={dataKey}
          draggable={draggable && blockLine}
          onClick={blockLine && !disabled ? this.handleContentClick : undefined}
          onDragstart={
            draggable && blockLine && !disabled
              ? this.handleDragStart
              : undefined
          }
        // onContextmenu={}
        >
          {getIndent}
          <NTreeNodeSwitcher
            tmNode={this.tmNode}
            clsPrefix={clsPrefix}
            expanded={this.expanded}
            loading={this.loading}
            hide={tmNode.isLeaf}
            onClick={this.handleSwitcherClick}
          />
          {checkable ? (
            <NTreeNodeCheckbox
              focusable={this.checkboxFocusable}
              disabled={disabled || this.checkboxDisabled}
              clsPrefix={clsPrefix}
              checked={this.checked}
              indeterminate={this.indeterminate}
              onCheck={this.handleCheck}
            />
          ) : null}
          <NTreeNodeContent
            ref="contentInstRef"
            clsPrefix={clsPrefix}
            checked={checked}
            selected={selected}
            onClick={
              blockLine || disabled ? undefined : this.handleContentClick
            }
            onDragstart={
              draggable && !blockLine && !disabled
                ? this.handleDragStart
                : undefined
            }
            tmNode={tmNode}
          />
          {draggable
            ? this.showDropMark
              ? renderDropMark({
                el: this.contentElRef.value,
                position: this.droppingPosition,
                offsetLevel: this.droppingOffsetLevel,
                indent
              })
              : this.showDropMarkAsParent
                ? renderDropMark({
                  el: this.contentElRef.value,
                  position: 'inside',
                  offsetLevel: this.droppingOffsetLevel,
                  indent
                })
                : null
            : null}
        </div>
      </div>
    )
  }
})

export default TreeNode
